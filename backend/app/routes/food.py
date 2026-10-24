from fastapi import APIRouter, UploadFile, File, HTTPException
from ..schemas.food_schemas import FoodAnalysisResponse
from ..services.ai_service import analyze_food_image
from ..services.supabase_service import record_activity

router = APIRouter(prefix="/api/food", tags=["AI Food Scanner"])

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}

@router.post("/analyze", response_model=FoodAnalysisResponse)
async def analyze_food(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{file.content_type}'. Please upload JPEG, PNG, or WebP images."
        )

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File size exceeds 10MB limit. Current size: {len(contents) / (1024 * 1024):.2f}MB"
        )
    
    if len(contents) == 0:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty. Please select a valid food photograph."
        )

    result = await analyze_food_image(contents, file.content_type)
    
    # Persist activity
    summary = f"{result.get('estimated_calories', 0)} kcal • {result.get('suggested_portion_size', '')}"
    await record_activity(
        activity_type="food_scan",
        title=result.get("food_name", "Food Item"),
        summary=summary,
        is_demo=result.get("is_demo", False),
        metadata={"calories": result.get("estimated_calories")}
    )

    return result
