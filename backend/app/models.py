from pydantic import BaseModel, HttpUrl
from typing import Optional, List
from datetime import date

class MasterProgram(BaseModel):
    # A. Identity
    school_name: str
    program_title: str
    url: str
    location: str
    contact_email: str

    # B. The "Fit" & Ranking
    fit_score: int  # 1-10
    calculated_rank: Optional[float] = None
    pros: str
    cons: str
    curriculum_focus: str

    # C. Logistics & Cost
    application_deadline: str # Using string for easier sheet handling, or date
    tuition_cost: float
    application_fee: float
    funding_scholarships: str
    duration: str

    # D. Requirements Checklist
    gre_gmat_required: str # Yes/No/Optional
    letters_of_rec_qty: int
    english_test: str
    sop_essay_done: bool

    # E. Status
    status: str # Researching, To Apply, In Progress, Submitted, Interview, Accepted, Rejected
    portal_login: str
    decision_date: Optional[str] = None
    is_favorite: bool = False

class ProgramCreate(MasterProgram):
    pass

class ProgramUpdate(MasterProgram):
    pass
