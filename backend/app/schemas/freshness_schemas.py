from pydantic import BaseModel, Field
from typing import Optional, List

class FreshnessAnalysisResponse(BaseModel):
    item_name: str = Field(..., description="Food item identified")
    category: str = Field(..., description="Classification: 'Looks fresh', 'Possible signs of deterioration', or 'Unable to determine'")
    visible_appearance: str = Field(..., description="Detailed observation of surface, color, texture")
    freshness_score: int = Field(..., description="Visual freshness index 0-100")
    positive_indicators: List[str] = Field(default_factory=list, description="Visible freshness signals (e.g. vibrant skin, turgid stem)")
    deterioration_indicators: List[str] = Field(default_factory=list, description="Visible decay markers (e.g. browning, bruising, wilting)")
    evidence_explanation: str = Field(..., description="Explanation of why the category was assigned based strictly on visible evidence")
    recommended_action: str = Field(..., description="Storage tips, consumption window, or disposal advisory")
    safety_guidance: str = Field(
        "Important Food Safety Notice: Visual AI analysis cannot reliably establish microbiological safety, detect invisible pathogens (like Salmonella or E. coli), or determine if food is safe to consume. Always check smell, texture, and follow certified food safety guidelines.",
        description="Mandatory food safety warning"
    )
    is_demo: bool = Field(False, description="Whether this response was generated using demo simulation")
    demo_notice: Optional[str] = Field(None, description="Clear label explaining demo state")
