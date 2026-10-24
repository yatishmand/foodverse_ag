from pydantic import BaseModel, Field
from typing import Optional, List, Dict

class RecipeRequest(BaseModel):
    ingredients: List[str] = Field(..., min_length=1, description="List of available ingredients")
    cuisine: Optional[str] = Field("Any / Global", description="Preferred cuisine style")
    dietary_preference: Optional[str] = Field("Any", description="Vegetarian, Vegan, Non-Vegetarian, Any")
    cooking_time_max: Optional[int] = Field(45, description="Maximum cooking time in minutes")
    skill_level: Optional[str] = Field("Beginner", description="Skill level: Beginner, Intermediate, Advanced")

class IngredientItem(BaseModel):
    name: str
    quantity: str
    is_pantry_staple: bool = False

class RecipeResponse(BaseModel):
    recipe_name: str
    description: str
    cuisine: str
    prep_time_minutes: int
    cook_time_minutes: int
    total_time_minutes: int
    servings: int
    difficulty: str
    dietary_type: str
    ingredients: List[IngredientItem]
    instructions: List[str]
    nutrition_per_serving: Dict[str, str]
    chef_tips: List[str]
    estimated_cost_tier: str = "Budget Friendly"
    is_demo: bool = False
    demo_notice: Optional[str] = None
