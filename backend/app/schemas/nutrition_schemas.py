from pydantic import BaseModel, Field
from typing import Optional, List, Dict

class NutritionPlanRequest(BaseModel):
    dietary_preference: str = Field("Balanced", description="Balanced, Vegetarian, Vegan, Keto, High-Protein, Mediterranean")
    daily_calorie_target: int = Field(2000, ge=1000, le=4500, description="Target daily calories")
    meals_per_day: int = Field(3, ge=2, le=5, description="Number of meals (2 to 5)")
    allergies_or_avoid: Optional[List[str]] = Field(default_factory=list, description="Foods or allergens to exclude")
    fitness_goal: Optional[str] = Field("Maintenance", description="Weight Loss, Maintenance, Muscle Gain, Energy Boost")

class MealItem(BaseModel):
    meal_type: str  # Breakfast, Lunch, Dinner, Morning Snack, Evening Snack
    meal_title: str
    description: str
    estimated_calories: int
    macros: Dict[str, str]
    key_ingredients: List[str]
    prep_note: str

class NutritionPlanResponse(BaseModel):
    plan_title: str
    dietary_preference: str
    daily_calorie_target: int
    total_estimated_calories: int
    daily_macros_summary: Dict[str, str]
    meals: List[MealItem]
    hydration_advice: str
    lifestyle_tips: List[str]
    disclaimer: str = Field(
        "Approximate dietary planning guidance only. Calorie targets and macro figures are non-clinical estimations and do not constitute certified medical, dietetic, or nutritional prescription.",
        description="Health and medical disclaimer"
    )
    is_demo: bool = False
    demo_notice: Optional[str] = None
