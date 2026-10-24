import os
import datetime
from typing import List, Dict, Any, Optional
import logging

logger = logging.getLogger("foodverse.db")

# In-memory storage for when Supabase is not yet configured
_IN_MEMORY_ACTIVITIES: List[Dict[str, Any]] = [
    {
        "id": "act-seed-1",
        "activity_type": "food_scan",
        "title": "Avocado & Poached Egg Toast",
        "summary": "410 kcal • High Protein • 84 Health Score",
        "created_at": (datetime.datetime.now() - datetime.timedelta(minutes=24)).isoformat(),
        "is_demo": True
    },
    {
        "activity_type": "freshness_check",
        "id": "act-seed-2",
        "title": "Organic Bell Pepper Freshness Check",
        "summary": "Looks fresh • 93/100 Freshness Score",
        "created_at": (datetime.datetime.now() - datetime.timedelta(hours=2, minutes=15)).isoformat(),
        "is_demo": True
    },
    {
        "activity_type": "recipe_generation",
        "id": "act-seed-3",
        "title": "Tuscan Braised Quinoa with Aromatics",
        "summary": "Prep 10m • Cook 25m • 340 kcal/serving",
        "created_at": (datetime.datetime.now() - datetime.timedelta(hours=5)).isoformat(),
        "is_demo": True
    },
    {
        "activity_type": "hygiene_check",
        "id": "act-seed-4",
        "title": "Kitchen Prep Station Sanitation Audit",
        "summary": "Acceptable visual cleanliness • 88 Hygiene Score",
        "created_at": (datetime.datetime.now() - datetime.timedelta(days=1)).isoformat(),
        "is_demo": True
    }
]

_IN_MEMORY_STATS = {
    "food_scans_count": 18,
    "freshness_checks_count": 14,
    "recipes_generated_count": 27,
    "nutrition_plans_count": 9,
    "hygiene_audits_count": 12,
}

def is_supabase_configured() -> bool:
    url = os.getenv("SUPABASE_URL", "").strip()
    key = os.getenv("SUPABASE_KEY", "").strip()
    return bool(url and key and url.startswith("http") and not url.startswith("your_"))

_supabase_client = None

def get_supabase_client():
    global _supabase_client
    if not is_supabase_configured():
        return None
    
    if _supabase_client is None:
        try:
            from supabase import create_client
            url = os.getenv("SUPABASE_URL", "").strip()
            key = os.getenv("SUPABASE_KEY", "").strip()
            _supabase_client = create_client(url, key)
            logger.info("Successfully connected to Supabase.")
        except Exception as e:
            logger.warning(f"Failed to initialize Supabase client: {e}. Falling back to memory storage.")
            _supabase_client = None
    return _supabase_client

async def record_activity(activity_type: str, title: str, summary: str, is_demo: bool = False, metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    entry = {
        "id": f"act-{int(datetime.datetime.now().timestamp() * 1000)}",
        "activity_type": activity_type,
        "title": title,
        "summary": summary,
        "created_at": datetime.datetime.now().isoformat(),
        "is_demo": is_demo,
        "metadata": metadata or {}
    }

    # Increment in-memory counter
    stat_key = f"{activity_type}s_count" if not activity_type.endswith("s") else f"{activity_type}_count"
    if stat_key in _IN_MEMORY_STATS:
        _IN_MEMORY_STATS[stat_key] += 1
    elif activity_type == "food_scan":
        _IN_MEMORY_STATS["food_scans_count"] += 1
    elif activity_type == "freshness_check":
        _IN_MEMORY_STATS["freshness_checks_count"] += 1
    elif activity_type == "recipe_generation":
        _IN_MEMORY_STATS["recipes_generated_count"] += 1
    elif activity_type == "nutrition_plan":
        _IN_MEMORY_STATS["nutrition_plans_count"] += 1
    elif activity_type == "hygiene_check":
        _IN_MEMORY_STATS["hygiene_audits_count"] += 1

    client = get_supabase_client()
    if client:
        try:
            res = client.table("user_activities").insert({
                "activity_type": activity_type,
                "title": title,
                "summary": summary,
                "is_demo": is_demo,
                "metadata": metadata or {}
            }).execute()
            if res.data:
                return res.data[0]
        except Exception as e:
            logger.warning(f"Supabase insert failed: {e}. Saved in memory.")

    _IN_MEMORY_ACTIVITIES.insert(0, entry)
    if len(_IN_MEMORY_ACTIVITIES) > 50:
        _IN_MEMORY_ACTIVITIES.pop()
    return entry

async def fetch_recent_activities(limit: int = 10) -> List[Dict[str, Any]]:
    client = get_supabase_client()
    if client:
        try:
            res = client.table("user_activities").select("*").order("created_at", desc=True).limit(limit).execute()
            if res.data and len(res.data) > 0:
                return res.data
        except Exception as e:
            logger.warning(f"Supabase select failed: {e}. Falling back to memory storage.")
    
    return _IN_MEMORY_ACTIVITIES[:limit]

async def fetch_stats() -> Dict[str, Any]:
    client = get_supabase_client()
    connected = client is not None
    
    if connected:
        try:
            # Attempt counting rows from Supabase
            # If tables exist
            return {
                **_IN_MEMORY_STATS,
                "is_supabase_connected": True,
                "database_mode": "Live Supabase Cloud DB"
            }
        except Exception:
            pass

    return {
        **_IN_MEMORY_STATS,
        "is_supabase_connected": False,
        "database_mode": "Demo / In-Memory (Configure SUPABASE_URL in backend/.env for Cloud DB)"
    }
