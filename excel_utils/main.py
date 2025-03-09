import os
import json
import re
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import openpyxl
from pydantic import BaseModel
from openai import OpenAI

# Load API Key from environment variables
AZURE_OPENAI_API_KEY = os.getenv("GITHUB_TOKEN")
if not AZURE_OPENAI_API_KEY:
    raise ValueError("Set your GitHub PAT token as an environment variable (GITHUB_TOKEN).")

# Initialize OpenAI client using Azure
client = OpenAI(
    base_url="https://models.inference.ai.azure.com",
    api_key=AZURE_OPENAI_API_KEY
)

# Initialize FastAPI app and CORS middleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change "*" to your frontend domain when deploying
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for user sessions (for demonstration only)
user_sessions = {}

# ---------------------------
# Request Models
# ---------------------------
class ChatRequest(BaseModel):
    user_id: str
    message: str

class ExcelRequest(BaseModel):
    user_id: str

# ---------------------------
# Conversation Questions (Server Controlled)
# ---------------------------
QUESTIONS = [
    "What type of Excel file do you need? (e.g., Budget Tracker, Payroll, Inventory, Sales Report)",
    "Do you want pre-filled values in the Excel file? (Yes/No)",
    "What specific calculations should be included? (e.g., Sum, Averages, Profit Margins, Tax Deductions)",
    "Do you need visual elements like charts, conditional formatting, or colored sections?"
]

# ---------------------------
# Server-Driven Conversation Logic
# ---------------------------
def ask_agent(user_id: str, user_message: str):
    # Retrieve or initialize session data for this user
    session = user_sessions.get(user_id, {"step": 0, "responses": []})
    # Append the user's answer
    session["responses"].append(user_message)

    # If there are still questions left, return the next question
    if session["step"] < len(QUESTIONS):
        next_question = QUESTIONS[session["step"]]
        session["step"] += 1
        user_sessions[user_id] = session
        return {"reply": next_question, "done": False}
    else:
        # All questions answered—clear the session and indicate "done"
        # Optionally, you could keep the session data if needed later.
        user_sessions.pop(user_id, None)
        return {"reply": "Thank you! Generating your Excel file now...", "done": True, "responses": session["responses"]}

@app.post("/chat")
async def chat_with_ai(request: ChatRequest):
    response = ask_agent(request.user_id, request.message)
    return response

# ---------------------------
# Generate Excel Template Using AI
# ---------------------------
def generate_excel_structure(responses):
    prompt = f"""
Generate a structured JSON template for an Excel file based on the following user inputs:
- File Type: {responses[0]}
- Pre-filled Values: {responses[1]}
- Calculations: {responses[2]}
- Visual Elements: {responses[3]}

Include:
- 'template_name': A relevant name for the template.
- 'columns': A list of column headers.
- 'formulas': A dictionary mapping column letters (e.g., "F2") to Excel formulas.
- 'formatting': Any formatting instructions (e.g., bold headers, colored cells, charts).
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=1,
            max_tokens=4096,
            top_p=1
        )
        raw_output = response.choices[0].message.content.strip()
        raw_output = re.sub(r'```json|```', '', raw_output).strip()
        return json.loads(raw_output)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"AI response could not be parsed as JSON. Error: {str(e)} \nRaw Output: {raw_output}")

# ---------------------------
# Create Excel File
# ---------------------------
def create_excel_file(template_data):
    filename = f"{template_data['template_name'].replace(' ', '_')}.xlsx"
    filepath = os.path.join(os.getcwd(), filename)
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = template_data["template_name"]
    # Add headers
    headers = template_data["columns"]
    ws.append(headers)
    # Apply bold font to headers
    for col_num, header in enumerate(headers, 1):
        ws.cell(row=1, column=col_num, value=header).font = openpyxl.styles.Font(bold=True)
    # Insert formulas if provided
    for cell, formula in template_data.get("formulas", {}).items():
        ws[cell] = formula
    wb.save(filepath)
    return filepath

@app.post("/generate_excel")
async def generate_excel(request: ExcelRequest):
    try:
        # Get the user's session data
        user_data = user_sessions.pop(request.user_id, None)
        # Check if the user answered all questions
        if not user_data or len(user_data["responses"]) < len(QUESTIONS):
            raise HTTPException(status_code=400, detail="Incomplete data. Please complete the chat process.")
        # Generate Excel structure from the collected responses
        template_data = generate_excel_structure(user_data["responses"])
        # Create the Excel file
        file_path = create_excel_file(template_data)
        # Return the file for download
        return FileResponse(file_path, filename=os.path.basename(file_path),
                            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
