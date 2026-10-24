from fastapi import APIRouter, UploadFile, File, HTTPException
from ..schemas.freshness_schemas import FreshnessAnalysisResponse
from ..services.ai_service import analyze_freshness_image
from ..services.supabase_service import record_activity

router = APIRouter(prefix="/api/freshness", tags=["Freshness Checker"])

MAX_FILE_SIZE = 10 * 1024 * 1024
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}

@router.post("/analyze", response_model=FreshnessAnalysisResponse)
async def analyze_freshness(file: UploadFile = File(...)):
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
            detail="Uploaded file is empty. Please select a valid produce photograph."
        )

    result = await analyze_freshness_image(contents, file.content_type)

    summary = f"{result.get('category')} • Freshness score: {result.get('freshness_score')}/100"
    await record_activity(
        activity_type="freshness_check",
        title=f"{result.get('item_name', 'Produce')} Freshness Audit",
        summary=summary,
        is_demo=result.get("is_demo", False),
        metadata={"category": result.get("category"), "score": result.get("freshness_score")}
    )

    return result
