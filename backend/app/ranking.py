from datetime import datetime

def calculate_rank(fit_score: int, tuition_cost: float, deadline_str: str = None) -> float:
    """
    A temporal formula for ranking.
    (Fit * 0.6) + (CostScore * 0.3) + (TemporalFactor * 0.1)
    Higher is better.
    """
    # Normalize fit score (1-10) to 0-1
    fit_norm = fit_score / 10.0
    
    # Normalize cost (assuming max 100k for normalization)
    # Lower cost is better
    cost_norm = max(0, (100000 - tuition_cost) / 100000)
    
    # Temporal factor: closer deadlines increase urgency
    # We'll use a scale where 0 days left = 1.0, and 180+ days left = 0.0
    temporal_factor = 0.0
    if deadline_str:
        try:
            deadline = datetime.strptime(deadline_str, "%Y-%m-%d")
            days_left = (deadline - datetime.now()).days
            if days_left <= 0:
                temporal_factor = 1.0 # Urgent or passed
            else:
                # Linear decay over 6 months
                temporal_factor = max(0, (180 - days_left) / 180)
        except Exception:
            temporal_factor = 0.5 # Default if date parsing fails
    
    # Weighted sum
    score = (fit_norm * 0.6) + (cost_norm * 0.3) + (temporal_factor * 0.1)
    
    return round(score * 100, 2)
