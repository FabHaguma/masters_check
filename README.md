# Master's Application Tracker

A private web app to track and rank master's degree applications.

## Tech Stack
- **Backend:** Python (FastAPI)
- **Frontend:** React (Vite) + Tailwind CSS
- **Database:** Google Sheets

## Setup Instructions

### 1. Google Sheets API Setup
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project.
3. Enable **Google Sheets API** and **Google Drive API**.
4. Create a **Service Account**:
   - Go to "IAM & Admin" > "Service Accounts".
   - Create a service account and grant it "Editor" access to the project (optional, but easier).
   - Create a **JSON Key** for the service account and download it.
   - Rename the file to `service_account.json` and place it in the `backend/` folder.
5. Create a new Google Sheet:
   - Copy the **Spreadsheet ID** from the URL (the long string between `/d/` and `/edit`).
   - Share the sheet with the service account's email address (found in the JSON file).
6. Create a `.env` file in the `backend/` folder:
   ```env
   SPREADSHEET_ID=your_spreadsheet_id_here
   SERVICE_ACCOUNT_FILE=service_account.json
   ```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m app.main
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Features
- **Table View:** Quick overview of all applications.
- **Card View:** Detailed look at each program with ranking scores.
- **Ranking Formula:** Automatically calculates a score based on Fit, Cost, and Deadlines.
