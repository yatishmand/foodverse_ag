from fastapi import APIRouter, HTTPException
from ..schemas.nutrition_schemas import NutritionPlanRequest, NutritionPlanResponse
from ..services.ai_service import generate_nutrition_plan
from ..services.supabase_service import record_activity

router = APIRouter(prefix="/api/nutrition", tags=["Nutrition Planner"])

@router.post("/plan", response_model=NutritionPlanResponse)
async def create_nutrition_plan(payload: NutritionPlanRequest):
    if payload.daily_calorie_target < 800 or payload.daily_calorie_target > 5000:
        raise HTTPException(
            status_code=400,
            detail="Daily calorie target must be between 800 and 5000 kcal for realistic dietary planning."
        )

    result = await generate_nutrition_plan(
        dietary_pref=payload.dietary_preference,
        daily_calorie_target=payload.daily_calorie_target,
        meals_per_day=payload.meals_per_day,
        allergies_or_avoid=payload.allergies_or_avoid or [],
        fitness_goal=payload.fitness_goal or "Maintenance"
    )

    summary = f"{result.get('dietary_preference')} • {result.get('total_estimated_calories')} kcal • {len(result.get('meals', []))} meals"
    await record_activity(
        activity_type="nutrition_plan",
        title=result.get("plan_title", "Daily Meal Plan"),
        summary=summary,
        is_demo=result.get("is_demo", False),
        metadata={"calories": result.get("total_estimated_calories")}
    )

    return result
