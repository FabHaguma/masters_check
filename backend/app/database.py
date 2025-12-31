import gspread
from google.oauth2.service_account import Credentials
import os
from dotenv import load_dotenv

load_dotenv()

SERVICE_ACCOUNT_FILE = os.getenv("SERVICE_ACCOUNT_FILE", "service_account.json")
SPREADSHEET_ID = os.getenv("SPREADSHEET_ID")

scopes = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
]

def get_gspread_client():
    if not os.path.exists(SERVICE_ACCOUNT_FILE):
        raise FileNotFoundError(f"Service account file not found at {SERVICE_ACCOUNT_FILE}")
    
    try:
        creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=scopes)
        return gspread.authorize(creds)
    except Exception as e:
        print(f"Error authorizing gspread: {e}")
        raise

def get_worksheet(sheet_name: str = "Applications"):
    client = get_gspread_client()
    try:
        spreadsheet = client.open_by_key(SPREADSHEET_ID)
    except gspread.exceptions.APIError as e:
        if e.response.status_code == 403:
            # Get the email from the service account file to help the user
            import json
            with open(SERVICE_ACCOUNT_FILE) as f:
                info = json.load(f)
                email = info.get("client_email")
            raise PermissionError(
                f"Permission denied to access spreadsheet {SPREADSHEET_ID}. "
                f"Please share your Google Sheet with this email: {email}"
            ) from e
        raise
    
    try:
        return spreadsheet.worksheet(sheet_name)
    except gspread.exceptions.WorksheetNotFound:
        # Create worksheet if it doesn't exist
        # We'll define headers here
        worksheet = spreadsheet.add_worksheet(title=sheet_name, rows="100", cols="25")
        headers = [
            "School Name", "Program Title", "URL", "Location", "Contact Email",
            "Fit Score", "Calculated Rank", "Pros", "Cons", "Curriculum Focus",
            "Application Deadline", "Tuition Cost", "Application Fee", "Funding/Scholarships", "Duration",
            "GRE/GMAT Required", "Letters of Rec Qty", "English Test", "SOP/Essay Done",
            "Status", "Portal Login", "Decision Date", "Is Favorite"
        ]
        worksheet.append_row(headers)
        return worksheet
