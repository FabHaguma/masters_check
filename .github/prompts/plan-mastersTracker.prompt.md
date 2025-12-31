## Plan: Master's Application Tracker

A private full-stack application to manage and rank master's degree programs using a Python (FastAPI) backend, a React (Vite) frontend, and Google Sheets as the database.

### Steps
1. Initialize the project structure with a `backend/` folder for FastAPI and a `frontend/` folder for React + Vite.
2. Configure Google Cloud credentials by creating a service account and saving the `service_account.json` in the `backend/` directory.
3. Develop the FastAPI backend in [backend/app/main.py](backend/app/main.py) using `gspread` to perform CRUD operations on the Google Sheet.
4. Implement a ranking formula in [backend/app/ranking.py](backend/app/ranking.py) using a weighted sum: $Score = (Fit \times 0.5) + (CostScore \times 0.3) + (LocationScore \times 0.2)$.
5. Create the React frontend with a `ViewToggle` component to switch between `ApplicationTable` and `ApplicationCard` layouts.
6. Build a comprehensive data entry form in the frontend to capture all fields across the Identity, Fit, Logistics, Requirements, and Status categories.

### Further Considerations
1. Should the "Calculated Rank" update in real-time as you edit fields, or only when saving to the database?
2. Do you want to include a "Deadline Countdown" feature in the Card view to highlight upcoming dates?
3. Would you like to add a "Notes" section for each program to store more detailed research or interview feedback?
