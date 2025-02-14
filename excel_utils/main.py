import os
import json
import re  # Import regex for cleaning AI response
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import openpyxl
from pydantic import BaseModel
from openai import OpenAI

# Load API Key from environment variables (You will set this manually)
AZURE_OPENAI_API_KEY = os.getenv("GITHUB_TOKEN")  # 🔹 Set your GitHub token here

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
    allow_origins=["*"],  # Change "*" to specific frontend domain if deployed
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Define request model
class ExcelRequest(BaseModel):
    description: str  # User input describing the required Excel template

# Function to generate structured template data using OpenAI (Azure)
def generate_excel_structure(description):
    prompt = f"""
    Generate a structured JSON template for an Excel file based on the following user request:
    '{description}'. Include:
    - 'template_name': The name of the template.
    - 'columns': A list of column headers.
    - 'formulas': A dictionary mapping column letters (e.g., "F2") to Excel formulas.
    - 'formatting': Any formatting instructions (e.g., bold headers, colored cells).
    Return only valid JSON. Do NOT include markdown formatting (```json ... ```).
    """

    try:
        # Use OpenAI API to generate structured response
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=1,
            max_tokens=4096,
            top_p=1
        )

        # Extract AI-generated response
        raw_output = response.choices[0].message.content.strip()

        # 🔹 Ensure JSON is correctly formatted by removing markdown and non-JSON characters
        raw_output = re.sub(r'```json|```', '', raw_output).strip()

        # Ensure response is valid JSON
        return json.loads(raw_output)

    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"AI response could not be parsed as JSON. Error: {str(e)} \nRaw Output: {raw_output}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI API Error: {str(e)}")


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

# API endpoint to generate and return an Excel file
@app.post("/generate_excel")
async def generate_excel(request: ExcelRequest):
    try:
        # Step 1: Generate structured template data
        template_data = generate_excel_structure(request.description)

        # Step 2: Create the Excel file
        file_path = create_excel_file(template_data)

        # Step 3: Return the Excel file for download
        return FileResponse(file_path, filename=os.path.basename(file_path), media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
