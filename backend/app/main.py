import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables from backend/.env or root
load_dotenv()

from .routes import (
    food_router,
    freshness_router,
    recipes_router,
    nutrition_router,
    hygiene_router,
    stats_router,
)
from .services import has_gemini_key, is_supabase_configured

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("foodverse")

app = FastAPI(
    title="Food Verse AI — Smart Food Intelligence Platform API",
    description="Multimodal AI-powered platform for food identification, nutritional estimation, visible freshness assessment, smart recipe generation, personalized meal planning, and visible hygiene monitoring.",
    version="1.0.0"
)

# CORS configuration for Vite React frontend
cors_env = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174,http://localhost:3000")
origins = [origin.strip() for origin in cors_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount feature routers
app.include_router(food_router)
app.include_router(freshness_router)
app.include_router(recipes_router)
app.include_router(nutrition_router)
app.include_router(hygiene_router)
app.include_router(stats_router)

@app.on_event("startup")
async def startup_event():
    ai_status = "Enabled (Google Gemini)" if has_gemini_key() else "Demo Mode Enabled (Realistic Simulation Fallback)"
    db_status = "Connected (Supabase Cloud)" if is_supabase_configured() else "Local Reactive Memory Store (Optional Supabase)"
    logger.info("==================================================")
    logger.info("🌱 Food Verse AI Backend Starting")
    logger.info(f"🤖 AI Engine Status: {ai_status}")
    logger.info(f"🗄️ Database Status:  {db_status}")
    logger.info("🚀 Interactive Swagger Docs: http://localhost:8000/docs")
    logger.info("==================================================")

@app.get("/")
async def root():
    return {
        "project": "Food Verse AI — Smart Food Intelligence Platform",
        "status": "Online",
        "documentation": "/docs",
        "ai_mode": "Live AI" if has_gemini_key() else "Demo Mode",
        "supabase_connected": is_supabase_configured(),
        "endpoints": [
            "GET  /api/health",
            "GET  /api/stats",
            "GET  /api/activities",
            "GET  /api/system-status",
            "POST /api/food/analyze",
            "POST /api/freshness/analyze",
            "POST /api/recipes/generate",
            "POST /api/nutrition/plan",
            "POST /api/hygiene/analyze"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
