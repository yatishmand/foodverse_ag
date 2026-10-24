from fastapi import APIRouter, HTTPException
from ..schemas.recipe_schemas import RecipeRequest, RecipeResponse
from ..services.ai_service import generate_smart_recipe
from ..services.supabase_service import record_activity

router = APIRouter(prefix="/api/recipes", tags=["Smart Cooking Assistant"])

@router.post("/generate", response_model=RecipeResponse)
async def create_recipe(payload: RecipeRequest):
    if not payload.ingredients or len(payload.ingredients) == 0:
        raise HTTPException(status_code=400, detail="Please provide at least one ingredient.")

    filtered_ings = [i.strip() for i in payload.ingredients if i.strip()]
    if not filtered_ings:
        raise HTTPException(status_code=400, detail="Ingredient entries cannot be blank.")

    result = await generate_smart_recipe(
        ingredients=filtered_ings,
        cuisine=payload.cuisine or "Any",
        dietary_pref=payload.dietary_preference or "Any",
        cooking_time_max=payload.cooking_time_max or 45,
        skill_level=payload.skill_level or "Beginner"
    )

    summary = f"{result.get('cuisine')} • Ready in {result.get('total_time_minutes')}m • {result.get('servings')} servings"
    await record_activity(
        activity_type="recipe_generation",
        title=result.get("recipe_name", "Custom Recipe"),
        summary=summary,
        is_demo=result.get("is_demo", False),
        metadata={"cuisine": result.get("cuisine"), "time": result.get("total_time_minutes")}
    )

    return result
