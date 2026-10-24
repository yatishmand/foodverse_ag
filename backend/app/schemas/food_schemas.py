from pydantic import BaseModel, Field
from typing import Optional, List, Dict

class FoodAnalysisResponse(BaseModel):
    food_name: str = Field(..., description="Predicted name of the food item or dish")
    short_description: str = Field(..., description="Short culinary and nutritional overview")
    estimated_calories: int = Field(..., description="Estimated total calories (kcal)")
    macronutrients: Dict[str, str] = Field(..., description="Protein, Carbs, Fats, Fiber breakdown")
    suggested_portion_size: str = Field(..., description="Suggested realistic portion size")
    confidence_level: str = Field("Medium", description="Confidence level: High, Medium, Low")
    key_ingredients_detected: List[str] = Field(default_factory=list, description="Key ingredients identified")
    dietary_tags: List[str] = Field(default_factory=list, description="Tags like Vegetarian, High-Protein, Gluten-Free")
    health_score: int = Field(75, description="Nutritional density indicator score (0-100)")
    disclaimer: str = Field(
        "Estimated values only. Visual AI analysis provides approximations and should not replace clinical medical or dietary advice.",
        description="Mandatory health disclaimer"
    )
    is_demo: bool = Field(False, description="Whether this response was generated using demo simulation")
    demo_notice: Optional[str] = Field(None, description="Clear label explaining demo state")
