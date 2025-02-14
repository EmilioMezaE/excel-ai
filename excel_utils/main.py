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

# Initialize FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# Store user session details
user_sessions = {}

# Define request models
class ChatRequest(BaseModel):
    user_id: str
    message: str  

class ExcelRequest(BaseModel):
    user_id: str  

# Questions for the agent
QUESTIONS = [
    "What type of Excel file do you need? (e.g., Budget Tracker, Payroll, Inventory, Sales Report)",
    "Do you want pre-filled values in the Excel file? (Yes/No)",
    "What specific calculations should be included? (e.g., Sum, Averages, Profit Margins, Tax Deductions)",
    "Do you need visual elements like charts, conditional formatting, or colored sections?"
]

# Function to interact with AI agent
def ask_agent(user_id, user_message):
    session = user_sessions.get(user_id, {"step": 0, "responses": []})

    # Save user response
    session["responses"].append(user_message)

    if session["step"] < len(QUESTIONS):
        next_question = QUESTIONS[session["step"]]
        session["step"] += 1
        user_sessions[user_id] = session
        return {"reply": next_question, "done": False}

    # If all questions are answered, generate Excel structure
    user_sessions.pop(user_id, None)  # Clear session
    return {"reply": "Thank you! Generating your Excel file now...", "done": True, "responses": session["responses"]}

# API Endpoint to handle user conversation
@app.post("/chat")
async def chat_with_ai(request: ChatRequest):
    response = ask_agent(request.user_id, request.message)
    return response

# Function to generate structured template data using OpenAI
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

# API Endpoint to generate and return an Excel file
@app.post("/generate_excel")
async def generate_excel(request: ExcelRequest):
    try:
        user_data = user_sessions.pop(request.user_id, None)
        if not user_data or len(user_data["responses"]) < 4:
            raise HTTPException(status_code=400, detail="Incomplete data. Please complete the chat process.")

        # Generate structured template data
        template_data = generate_excel_structure(user_data["responses"])

        # Create Excel file
        file_path = create_excel_file(template_data)

        # Return the Excel file for download
        return FileResponse(file_path, filename=os.path.basename(file_path), media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Function to create an Excel file
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

    # Save the file
    wb.save(filepath)
    return filepath
