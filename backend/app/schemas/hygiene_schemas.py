from pydantic import BaseModel, Field
from typing import Optional, List

class HygieneAnalysisResponse(BaseModel):
    area_type: str = Field(..., description="Kitchen Counter, Food Prep Station, Dining Table, Cooktop, etc.")
    overall_status: str = Field(..., description="'Acceptable visual cleanliness', 'Visible concerns detected', or 'Unable to assess'")
    hygiene_score: int = Field(..., description="Visual sanitation estimation (0-100)")
    visible_cleanliness_observations: List[str] = Field(default_factory=list, description="Observations strictly grounded in visible evidence")
    potential_risk_factors: List[str] = Field(default_factory=list, description="Cross-contamination risks, visible spills, unorganized raw/cooked tools")
    actionable_recommendations: List[str] = Field(default_factory=list, description="Concrete sanitizing and workflow suggestions")
    official_disclaimer: str = Field(
        "Important Hygiene & Safety Disclaimer: This visual analysis tool cannot certify commercial restaurant hygiene standards, verify sanitization chemical efficacy, or detect invisible microbial/bacterial pathogens. It is not an official health department inspection.",
        description="Official hygiene disclaimer"
    )
    is_demo: bool = Field(False, description="Whether this response was generated using demo simulation")
    demo_notice: Optional[str] = Field(None, description="Clear label explaining demo state")
