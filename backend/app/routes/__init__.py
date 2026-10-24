from .food import router as food_router
from .freshness import router as freshness_router
from .recipes import router as recipes_router
from .nutrition import router as nutrition_router
from .hygiene import router as hygiene_router
from .stats import router as stats_router

__all__ = [
    "food_router",
    "freshness_router",
    "recipes_router",
    "nutrition_router",
    "hygiene_router",
    "stats_router",
]
