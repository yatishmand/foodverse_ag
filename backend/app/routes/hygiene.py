from fastapi import APIRouter, UploadFile, File, HTTPException
from ..schemas.hygiene_schemas import HygieneAnalysisResponse
from ..services.ai_service import analyze_hygiene_image
from ..services.supabase_service import record_activity

router = APIRouter(prefix="/api/hygiene", tags=["Visible Hygiene Monitor"])

MAX_FILE_SIZE = 10 * 1024 * 1024
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}

@router.post("/analyze", response_model=HygieneAnalysisResponse)
async def analyze_hygiene(file: UploadFile = File(...)):
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
            detail="Uploaded file is empty. Please select a valid photo of a kitchen or dining area."
        )

    result = await analyze_hygiene_image(contents, file.content_type)

    summary = f"{result.get('overall_status')} • Hygiene score: {result.get('hygiene_score')}/100"
    await record_activity(
        activity_type="hygiene_check",
        title=f"{result.get('area_type', 'Kitchen Area')} Hygiene Audit",
        summary=summary,
        is_demo=result.get("is_demo", False),
        metadata={"status": result.get("overall_status"), "score": result.get("hygiene_score")}
    )

    return result
