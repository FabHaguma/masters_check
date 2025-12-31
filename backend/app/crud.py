from .database import get_worksheet
from .models import MasterProgram, ProgramCreate
from .ranking import calculate_rank
from datetime import datetime

def get_all_programs():
    worksheet = get_worksheet()
    
    # Ensure header is up to date for existing sheets
    headers = worksheet.row_values(1)
    if "Is Favorite" not in headers:
        # Append missing header
        worksheet.update_cell(1, len(headers) + 1, "Is Favorite")
    
    if "Currency" not in headers:
        # Insert after Tuition Cost if possible
        try:
            idx = headers.index("Tuition Cost") + 2
            worksheet.insert_cols([["Currency"]], col=idx)
        except ValueError:
            worksheet.update_cell(1, len(headers) + 1, "Currency")
        
    records = worksheet.get_all_records()
    return records

def create_program(program: ProgramCreate):
    worksheet = get_worksheet()
    
    # Calculate rank before saving
    rank = calculate_rank(program.fit_score, program.tuition_cost, program.application_deadline)
    program.calculated_rank = rank
    
    row = [
        program.school_name, program.program_title, program.url, program.location, program.contact_email,
        program.fit_score, program.calculated_rank, program.pros, program.cons, program.curriculum_focus,
        program.application_deadline, program.tuition_cost, program.currency, program.application_fee, program.funding_scholarships, program.duration,
        program.gre_gmat_required, program.letters_of_rec_qty, program.english_test, program.sop_essay_done,
        program.status, program.portal_login, program.decision_date, program.is_favorite
    ]
    worksheet.append_row(row)
    return program

def update_program(school_name: str, program_title: str, program: MasterProgram):
    worksheet = get_worksheet()
    
    # Get all values to find the row efficiently
    all_values = worksheet.get_all_values()
    row_idx = -1
    
    for i, row_data in enumerate(all_values):
        if i == 0: continue # Skip header
        # Check if school name (col 1) and program title (col 2) match
        if len(row_data) >= 2 and row_data[0] == school_name and row_data[1] == program_title:
            row_idx = i + 1 # gspread is 1-indexed
            break
            
    if row_idx == -1:
        return None
    
    # Recalculate rank
    rank = calculate_rank(program.fit_score, program.tuition_cost, program.application_deadline)
    program.calculated_rank = rank
    
    # Prepare the row data
    updated_row = [
        program.school_name, program.program_title, program.url, program.location, program.contact_email,
        program.fit_score, program.calculated_rank, program.pros, program.cons, program.curriculum_focus,
        program.application_deadline, program.tuition_cost, program.currency, program.application_fee, program.funding_scholarships, program.duration,
        program.gre_gmat_required, program.letters_of_rec_qty, program.english_test, program.sop_essay_done,
        program.status, program.portal_login, program.decision_date, program.is_favorite
    ]
    
    # Update the entire row. 
    # Using a highly compatible syntax: update(range, values)
    # Providing the start cell and a list of lists will update the row.
    range_label = f"A{row_idx}"
    try:
        # Try the most common way
        worksheet.update(range_label, [updated_row])
    except Exception:
        # Fallback for gspread 6.0+ if the above fails
        worksheet.update(values=[updated_row], range_name=range_label)
    
    return program

def delete_program(school_name: str, program_title: str):
    worksheet = get_worksheet()
    all_values = worksheet.get_all_values()
    row_idx = -1
    
    for i, row_data in enumerate(all_values):
        if i == 0: continue
        if len(row_data) >= 2 and row_data[0] == school_name and row_data[1] == program_title:
            row_idx = i + 1
            break
            
    if row_idx == -1:
        return False
    
    worksheet.delete_rows(row_idx)
    return True
