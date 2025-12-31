from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models import MasterProgram, ProgramCreate
from . import crud
from typing import List

app = FastAPI(title="Master's Application Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Master's Application Tracker API"}

@app.get("/programs", response_model=List[dict])
def get_programs():
    return crud.get_all_programs()

@app.post("/programs", response_model=MasterProgram)
def create_program(program: ProgramCreate):
    try:
        return crud.create_program(program)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/programs/{school_name}/{program_title}", response_model=MasterProgram)
def update_program(school_name: str, program_title: str, program: MasterProgram):
    try:
        print(f"Updating program: {school_name} - {program_title}")
        updated = crud.update_program(school_name, program_title, program)
        if not updated:
            print(f"Program not found: {school_name} - {program_title}")
            raise HTTPException(status_code=404, detail="Program not found")
        return updated
    except Exception as e:
        print(f"Error in update_program: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/programs/{school_name}/{program_title}")
def delete_program(school_name: str, program_title: str):
    try:
        success = crud.delete_program(school_name, program_title)
        if not success:
            raise HTTPException(status_code=404, detail="Program not found")
        return {"message": "Program deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
