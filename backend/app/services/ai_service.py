import os
import json
import base64
import logging
from typing import Dict, Any, List, Optional
import httpx
from .demo_data import (
    get_demo_food_analysis,
    get_demo_freshness_analysis,
    get_demo_hygiene_analysis,
    get_demo_recipe,
    get_demo_nutrition_plan
)

logger = logging.getLogger("foodverse.ai")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()

def has_gemini_key() -> bool:
    key = os.getenv("GEMINI_API_KEY", "").strip()
    return bool(key and len(key) > 10 and not key.startswith("your_"))

async def call_gemini_vision(image_bytes: bytes, mime_type: str, prompt: str, schema_desc: str) -> Optional[Dict[str, Any]]:
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not has_gemini_key():
        return None

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={api_key}"
    
    b64_data = base64.b64encode(image_bytes).decode("utf-8")
    
    system_instruction = (
        "You are Food Verse AI, an expert food intelligence system. "
        "Analyze the provided image and respond ONLY with a strictly valid JSON object matching the requested schema. "
        "Do not include markdown codeblocks or triple backticks if possible, return pure JSON."
    )
    
    full_prompt = f"{prompt}\n\nRequired JSON Schema:\n{schema_desc}"

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": system_instruction + "\n\n" + full_prompt},
                    {
                        "inline_data": {
                            "mime_type": mime_type or "image/jpeg",
                            "data": b64_data
                        }
                    }
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.2,
            "responseMimeType": "application/json"
        }
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, json=payload)
            if response.status_code == 200:
                result = response.json()
                candidates = result.get("candidates", [])
                if candidates:
                    text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                    clean_text = text.strip()
                    if clean_text.startswith("```json"):
                        clean_text = clean_text[7:]
                    if clean_text.startswith("```"):
                        clean_text = clean_text[3:]
                    if clean_text.endswith("```"):
                        clean_text = clean_text[:-3]
                    return json.loads(clean_text.strip())
            else:
                logger.warning(f"Gemini API returned status {response.status_code}: {response.text}")
    except Exception as e:
        logger.error(f"Error calling Gemini Vision API: {e}")
    
    return None

async def call_gemini_text(prompt: str, schema_desc: str) -> Optional[Dict[str, Any]]:
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not has_gemini_key():
        return None

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={api_key}"
    
    system_instruction = (
        "You are Food Verse AI, an expert culinary and nutrition intelligence system. "
        "Respond ONLY with a strictly valid JSON object matching the requested schema."
    )
    full_prompt = f"{prompt}\n\nRequired JSON Schema:\n{schema_desc}"

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": system_instruction + "\n\n" + full_prompt}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.3,
            "responseMimeType": "application/json"
        }
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, json=payload)
            if response.status_code == 200:
                result = response.json()
                candidates = result.get("candidates", [])
                if candidates:
                    text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                    clean_text = text.strip()
                    if clean_text.startswith("```json"):
                        clean_text = clean_text[7:]
                    if clean_text.startswith("```"):
                        clean_text = clean_text[3:]
                    if clean_text.endswith("```"):
                        clean_text = clean_text[:-3]
                    return json.loads(clean_text.strip())
            else:
                logger.warning(f"Gemini API returned status {response.status_code}: {response.text}")
    except Exception as e:
        logger.error(f"Error calling Gemini Text API: {e}")
    
    return None

# Feature 1: Food Scanner
async def analyze_food_image(image_bytes: bytes, mime_type: str) -> Dict[str, Any]:
    prompt = (
        "Identify the food item or dish shown in the image. Estimate calories, approximate macronutrients "
        "(protein, carbs, fats, fiber), portion size, confidence level, key ingredients detected, and health score."
    )
    schema = (
        '{"food_name": "string", "short_description": "string", "estimated_calories": 500, '
        '"macronutrients": {"Protein": "20g", "Carbohydrates": "50g", "Fats": "15g", "Dietary Fiber": "6g"}, '
        '"suggested_portion_size": "string", "confidence_level": "High (90%)", '
        '"key_ingredients_detected": ["item1", "item2"], "dietary_tags": ["tag1", "tag2"], "health_score": 85}'
    )
    
    ai_result = await call_gemini_vision(image_bytes, mime_type, prompt, schema)
    if ai_result:
        ai_result["disclaimer"] = "Estimated values only. Visual AI analysis provides approximations and should not replace clinical medical or dietary advice."
        ai_result["is_demo"] = False
        ai_result["demo_notice"] = None
        return ai_result

    return get_demo_food_analysis()

# Feature 2: Freshness Checker
async def analyze_freshness_image(image_bytes: bytes, mime_type: str) -> Dict[str, Any]:
    prompt = (
        "Perform a visible freshness assessment of the fruit, vegetable, or food in the image. "
        "Classify into category strictly as one of: 'Looks fresh', 'Possible signs of deterioration', or 'Unable to determine'. "
        "List positive indicators and deterioration markers visible. Explain visible evidence. Provide recommended storage or consumption action."
    )
    schema = (
        '{"item_name": "string", "category": "Looks fresh | Possible signs of deterioration | Unable to determine", '
        '"visible_appearance": "string", "freshness_score": 85, '
        '"positive_indicators": ["indicator 1"], "deterioration_indicators": ["indicator 2"], '
        '"evidence_explanation": "string", "recommended_action": "string"}'
    )
    
    ai_result = await call_gemini_vision(image_bytes, mime_type, prompt, schema)
    if ai_result:
        ai_result["safety_guidance"] = (
            "Important Food Safety Notice: Visual AI analysis cannot reliably establish microbiological safety, "
            "detect invisible pathogens (like Salmonella or E. coli), or determine if food is safe to consume. "
            "Always check smell, texture, and follow certified food safety guidelines."
        )
        ai_result["is_demo"] = False
        ai_result["demo_notice"] = None
        return ai_result

    return get_demo_freshness_analysis()

# Feature 3: Smart Cooking Assistant
async def generate_smart_recipe(ingredients: List[str], cuisine: str, dietary_pref: str, cooking_time_max: int, skill_level: str) -> Dict[str, Any]:
    prompt = (
        f"Generate a creative and practical recipe using these available ingredients: {', '.join(ingredients)}. "
        f"Target cuisine: {cuisine}. Dietary preference: {dietary_pref}. "
        f"Maximum cooking time: {cooking_time_max} minutes. Skill level: {skill_level}."
    )
    schema = (
        '{"recipe_name": "string", "description": "string", "cuisine": "string", '
        '"prep_time_minutes": 10, "cook_time_minutes": 20, "total_time_minutes": 30, '
        '"servings": 2, "difficulty": "Easy", "dietary_type": "Vegetarian", '
        '"ingredients": [{"name": "item", "quantity": "amount", "is_pantry_staple": false}], '
        '"instructions": ["step 1", "step 2"], '
        '"nutrition_per_serving": {"Calories": "350 kcal", "Protein": "15g", "Carbohydrates": "40g", "Fat": "10g"}, '
        '"chef_tips": ["tip 1"], "estimated_cost_tier": "Budget Friendly"}'
    )
    
    ai_result = await call_gemini_text(prompt, schema)
    if ai_result:
        ai_result["is_demo"] = False
        ai_result["demo_notice"] = None
        return ai_result

    return get_demo_recipe(ingredients, cuisine, dietary_pref, cooking_time_max)

# Feature 4: Nutrition Planner
async def generate_nutrition_plan(dietary_pref: str, daily_calorie_target: int, meals_per_day: int, allergies_or_avoid: List[str], fitness_goal: str) -> Dict[str, Any]:
    prompt = (
        f"Generate a structured daily meal plan with {meals_per_day} meals for dietary preference '{dietary_pref}', "
        f"targeting {daily_calorie_target} daily calories and fitness goal '{fitness_goal}'. "
        f"Exclude items: {', '.join(allergies_or_avoid) if allergies_or_avoid else 'None'}."
    )
    schema = (
        '{"plan_title": "string", "dietary_preference": "string", "daily_calorie_target": 2000, '
        '"total_estimated_calories": 2000, '
        '"daily_macros_summary": {"Total Protein": "120g", "Total Carbohydrates": "220g", "Total Fats": "60g"}, '
        '"meals": [{"meal_type": "Breakfast", "meal_title": "string", "description": "string", '
        '"estimated_calories": 500, "macros": {"Protein": "30g", "Carbs": "60g", "Fats": "15g"}, '
        '"key_ingredients": ["item1"], "prep_note": "string"}], '
        '"hydration_advice": "string", "lifestyle_tips": ["tip1", "tip2"]}'
    )
    
    ai_result = await call_gemini_text(prompt, schema)
    if ai_result:
        ai_result["disclaimer"] = (
            "Approximate dietary planning guidance only. Calorie targets and macro figures are non-clinical estimations "
            "and do not constitute certified medical, dietetic, or nutritional prescription."
        )
        ai_result["is_demo"] = False
        ai_result["demo_notice"] = None
        return ai_result

    return get_demo_nutrition_plan(dietary_pref, daily_calorie_target, meals_per_day, allergies_or_avoid)

# Feature 5: Hygiene Monitor
async def analyze_hygiene_image(image_bytes: bytes, mime_type: str) -> Dict[str, Any]:
    prompt = (
        "Analyze the provided image of a food preparation area, kitchen counter, or dining environment for visible cleanliness concerns. "
        "Strictly ground your analysis in visible evidence only. "
        "Classify overall status as: 'Acceptable visual cleanliness', 'Visible concerns detected', or 'Unable to assess'. "
        "Identify visible cleanliness observations, potential risk factors (e.g. cross-contamination risks, dirty cloths on prep areas, spills), and actionable recommendations."
    )
    schema = (
        '{"area_type": "string", "overall_status": "Acceptable visual cleanliness | Visible concerns detected | Unable to assess", '
        '"hygiene_score": 80, "visible_cleanliness_observations": ["obs 1"], '
        '"potential_risk_factors": ["risk 1"], "actionable_recommendations": ["rec 1"]}'
    )
    
    ai_result = await call_gemini_vision(image_bytes, mime_type, prompt, schema)
    if ai_result:
        ai_result["official_disclaimer"] = (
            "Important Hygiene & Safety Disclaimer: This visual analysis tool cannot certify commercial restaurant hygiene standards, "
            "verify sanitization chemical efficacy, or detect invisible microbial/bacterial pathogens. It is not an official health department inspection."
        )
        ai_result["is_demo"] = False
        ai_result["demo_notice"] = None
        return ai_result

    return get_demo_hygiene_analysis()
