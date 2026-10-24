from fastapi import APIRouter
from typing import Dict, Any, List
from ..services.supabase_service import fetch_recent_activities, fetch_stats, is_supabase_configured
from ..services.ai_service import has_gemini_key

router = APIRouter(prefix="/api", tags=["Platform System & Stats"])

@router.get("/health")
async def health_check() -> Dict[str, Any]:
    return {
        "status": "healthy",
        "service": "Food Verse AI API",
        "version": "1.0.0",
        "ai_configured": has_gemini_key(),
        "supabase_configured": is_supabase_configured()
    }

@router.get("/stats")
async def get_statistics() -> Dict[str, Any]:
    return await fetch_stats()

@router.get("/activities")
async def get_activities(limit: int = 10) -> List[Dict[str, Any]]:
    return await fetch_recent_activities(limit=limit)

@router.get("/system-status")
async def get_system_status() -> Dict[str, Any]:
    return {
        "ai_engine": {
            "provider": "Google Gemini Multimodal AI",
            "active": has_gemini_key(),
            "mode": "Live Multimodal AI" if has_gemini_key() else "Realistic Demo Simulator (No API key needed to evaluate)"
        },
        "database": {
            "provider": "Supabase Cloud Database",
            "active": is_supabase_configured(),
            "mode": "Connected Supabase Cloud" if is_supabase_configured() else "Local Reactive Memory Store"
        }
    }
