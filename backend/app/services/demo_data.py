import random
from typing import Dict, Any, List

SAMPLE_FOOD_ITEMS = [
    {
        "food_name": "Mediterranean Quinoa Power Bowl",
        "short_description": "Nutrient-packed grain bowl with fluffy quinoa, roasted chickpeas, cucumber ribbons, cherry tomatoes, and tahini drizzle.",
        "estimated_calories": 485,
        "macronutrients": {
            "Protein": "16g",
            "Carbohydrates": "62g",
            "Fats": "18g",
            "Dietary Fiber": "9g"
        },
        "suggested_portion_size": "1 bowl (~380g)",
        "confidence_level": "High (94%)",
        "key_ingredients_detected": ["Quinoa", "Chickpeas", "Cucumber", "Cherry Tomatoes", "Kalamata Olives", "Tahini"],
        "dietary_tags": ["Vegetarian", "High Fiber", "Plant-Based", "Heart Healthy"],
        "health_score": 88
    },
    {
        "food_name": "Herb-Crusted Grilled Salmon with Asparagus",
        "short_description": "Pan-seared Atlantic salmon fillet seasoned with dill, garlic, and lemon, served alongside tender roasted asparagus spears.",
        "estimated_calories": 520,
        "macronutrients": {
            "Protein": "42g",
            "Carbohydrates": "8g",
            "Fats": "36g",
            "Dietary Fiber": "4g"
        },
        "suggested_portion_size": "1 fillet + 6 asparagus spears (~300g)",
        "confidence_level": "High (96%)",
        "key_ingredients_detected": ["Atlantic Salmon", "Asparagus", "Olive Oil", "Lemon", "Garlic", "Fresh Dill"],
        "dietary_tags": ["High Protein", "Keto Friendly", "Omega-3 Rich", "Gluten Free"],
        "health_score": 92
    },
    {
        "food_name": "Artisanal Avocado & Poached Egg Toast",
        "short_description": "Toasted rustic sourdough topped with smashed Hass avocado, chili flakes, sea salt, and two soft-poached free-range eggs.",
        "estimated_calories": 410,
        "macronutrients": {
            "Protein": "18g",
            "Carbohydrates": "34g",
            "Fats": "24g",
            "Dietary Fiber": "7g"
        },
        "suggested_portion_size": "2 sourdough slices (~220g)",
        "confidence_level": "High (92%)",
        "key_ingredients_detected": ["Sourdough Bread", "Hass Avocado", "Eggs", "Red Pepper Flakes", "Extra Virgin Olive Oil"],
        "dietary_tags": ["Vegetarian", "Healthy Fats", "Whole Grain"],
        "health_score": 84
    },
    {
        "food_name": "Tandoori Paneer Tikka Platter",
        "short_description": "Marinated cottage cheese cubes roasted with bell peppers and Spanish onions in aromatic Indian tandoori spices and mint chutney.",
        "estimated_calories": 460,
        "macronutrients": {
            "Protein": "22g",
            "Carbohydrates": "18g",
            "Fats": "34g",
            "Dietary Fiber": "5g"
        },
        "suggested_portion_size": "6 skewered chunks with salad (~280g)",
        "confidence_level": "Medium (88%)",
        "key_ingredients_detected": ["Paneer (Cottage Cheese)", "Bell Peppers", "Onions", "Yogurt Marinade", "Mint Chutney"],
        "dietary_tags": ["Vegetarian", "High Calcium", "High Protein"],
        "health_score": 79
    }
]

SAMPLE_FRESHNESS_ITEMS = [
    {
        "item_name": "Organic Red Bell Pepper",
        "category": "Looks fresh",
        "visible_appearance": "Skin is taut, glossy, and evenly pigmented with deep crimson coloration. Stem is firm, greenish, and free of dehydration.",
        "freshness_score": 93,
        "positive_indicators": [
            "Glossy, unblemished outer surface",
            "Turgid calyx and firm green stem",
            "No visible indentation, wrinkling, or fluid leakage"
        ],
        "deterioration_indicators": [],
        "evidence_explanation": "Visual assessment indicates high cellular turgidity and intact dermal layers without wilting or oxidation.",
        "recommended_action": "Store in refrigerator crisper drawer at 4°C-7°C. Best consumed within 5-7 days."
    },
    {
        "item_name": "Cavendish Banana Cluster",
        "category": "Possible signs of deterioration",
        "visible_appearance": "Golden-yellow peel displaying scattered brown sugar specks (senescent spotting) and slight stem darkening.",
        "freshness_score": 68,
        "positive_indicators": [
            "Peel remains intact without tears or breaches",
            "High natural sweetness and aroma expected"
        ],
        "deterioration_indicators": [
            "Multiple localized brown melanin pigment spots",
            "Softening of neck/stem region"
        ],
        "evidence_explanation": "Sugar spots indicate advanced starch-to-sugar conversion. Optimal for baking (banana bread, smoothies) or immediate consumption.",
        "recommended_action": "Eat within 24-48 hours, freeze slices for smoothies, or use in baking."
    },
    {
        "item_name": "Fresh Baby Spinach Leaves",
        "category": "Looks fresh",
        "visible_appearance": "Vibrant emerald green leaves with crisp venation. No yellowing margins or slimy patches detected.",
        "freshness_score": 89,
        "positive_indicators": [
            "Intense chlorophyll pigmentation",
            "Crisp leaf structure without cellular collapse",
            "Dry leaf surfaces free of anaerobic moisture condensation"
        ],
        "deterioration_indicators": [
            "Very minor edge curling on two peripheral leaves"
        ],
        "evidence_explanation": "Leaves exhibit healthy cell wall pressure with minimal moisture stress. Good freshness profile.",
        "recommended_action": "Keep in airtight container lined with paper towel to absorb excess moisture. Consume within 3-4 days."
    }
]

SAMPLE_HYGIENE_ITEMS = [
    {
        "area_type": "Commercial Kitchen Prep Station",
        "overall_status": "Acceptable visual cleanliness",
        "hygiene_score": 88,
        "visible_cleanliness_observations": [
            "Stainless steel worktable surfaces appear sanitized and reflective with no visible grease build-up",
            "Chef knives stored safely in magnetic strip rack rather than lying loose",
            "Sanitizing spray bottle and microfiber cloths neatly stationed in designated area"
        ],
        "potential_risk_factors": [
            "One wet wiping rag folded directly on cutting board surface",
            "Uncovered seasoning shaker within splash zone of prep sink"
        ],
        "actionable_recommendations": [
            "Remove damp cloth from food contact cutting board to prevent bacterial incubation",
            "Maintain at least 45cm clearance between open seasonings and sink wash stations",
            "Establish two-bucket sanitizing method for continuous prep wipe-downs"
        ]
    },
    {
        "area_type": "Domestic Kitchen Cutting & Cooking Counter",
        "overall_status": "Visible concerns detected",
        "hygiene_score": 62,
        "visible_cleanliness_observations": [
            "Cooktop surface is dry, and pots are washed and stacked on drying rack",
            "Trash bin is positioned under counter with pedal lid"
        ],
        "potential_risk_factors": [
            "Wooden cutting board shows deep knife grooves and localized dark discolouration",
            "Raw produce items placed adjacent to uncovered thawed poultry packaging",
            "Liquid droplet residue near electric blender base"
        ],
        "actionable_recommendations": [
            "Immediately separate raw protein containers from ready-to-eat produce to avoid cross-contamination",
            "Sand or replace heavily scored wooden boards where biofilms can harbor in crevices",
            "Sanitize electric appliance bases thoroughly with food-grade sanitizing wipe"
        ]
    }
]

def get_demo_food_analysis() -> Dict[str, Any]:
    item = random.choice(SAMPLE_FOOD_ITEMS).copy()
    item["is_demo"] = True
    item["demo_notice"] = "Demo Mode: Realistic simulation based on visual food markers. (Add GEMINI_API_KEY in backend/.env for live multimodal AI)"
    return item

def get_demo_freshness_analysis() -> Dict[str, Any]:
    item = random.choice(SAMPLE_FRESHNESS_ITEMS).copy()
    item["is_demo"] = True
    item["demo_notice"] = "Demo Mode: Realistic simulation based on visible decay indicators. (Add GEMINI_API_KEY in backend/.env for live multimodal AI)"
    return item

def get_demo_hygiene_analysis() -> Dict[str, Any]:
    item = random.choice(SAMPLE_HYGIENE_ITEMS).copy()
    item["is_demo"] = True
    item["demo_notice"] = "Demo Mode: Realistic kitchen sanitation audit simulation. (Add GEMINI_API_KEY in backend/.env for live multimodal AI)"
    return item

def get_demo_recipe(ingredients: List[str], cuisine: str, dietary_pref: str, max_time: int) -> Dict[str, Any]:
    clean_ings = [i.strip().capitalize() for i in ingredients if i.strip()]
    lead_ing = clean_ings[0] if clean_ings else "Garden Vegetable"
    
    recipe_name = f"Rustic {lead_ing} & Herb Skillet Saute"
    if "tomato" in [i.lower() for i in clean_ings] or "pasta" in [i.lower() for i in clean_ings]:
        recipe_name = f"Tuscan Braised {lead_ing} with Aromatics"
    elif "rice" in [i.lower() for i in clean_ings]:
        recipe_name = f"Fragrant {cuisine} {lead_ing} Pilaf Bowl"
    
    ingredients_list = []
    for ing in clean_ings:
        ingredients_list.append({"name": ing, "quantity": "1 to 2 cups, freshly prepped", "is_pantry_staple": False})
    
    # Add pantry staples
    ingredients_list.extend([
        {"name": "Extra Virgin Olive Oil", "quantity": "2 tbsp", "is_pantry_staple": True},
        {"name": "Minced Garlic & Sea Salt", "quantity": "3 cloves / to taste", "is_pantry_staple": True},
        {"name": "Cracked Black Pepper & Italian Herbs", "quantity": "1 tsp", "is_pantry_staple": True}
    ])

    return {
        "recipe_name": recipe_name,
        "description": f"A delightful, wholesome {cuisine.lower()} creation tailored to highlight {', '.join(clean_ings[:3])}. Quick, fragrant, and bursting with natural flavours.",
        "cuisine": cuisine or "Fusion / Global",
        "prep_time_minutes": 10,
        "cook_time_minutes": min(max_time - 10 if max_time > 15 else 15, 25),
        "total_time_minutes": min(max_time, 35),
        "servings": 2,
        "difficulty": "Easy",
        "dietary_type": dietary_pref or "Vegetarian",
        "ingredients": ingredients_list,
        "instructions": [
            f"Step 1: Wash, pat dry, and evenly slice {', '.join(clean_ings)} into uniform bite-sized pieces for consistent cooking.",
            "Step 2: Heat 2 tablespoons of olive oil in a heavy-bottomed skillet over medium heat. Add minced garlic and bloom for 45 seconds until fragrant.",
            f"Step 3: Introduce {lead_ing} and sear for 4-5 minutes, allowing light caramelization to develop deep roasted notes.",
            f"Step 4: Fold in the remaining ingredients ({', '.join(clean_ings[1:]) if len(clean_ings) > 1 else 'herbs'}), season with sea salt and cracked pepper.",
            "Step 5: Reduce heat to low-medium, cover for 3-4 minutes to steam through, then finish with a squeeze of fresh lemon or herbs.",
            "Step 6: Plate warm, garnish with freshly cracked pepper, and serve immediately."
        ],
        "nutrition_per_serving": {
            "Calories": "340 kcal",
            "Protein": "14g",
            "Carbohydrates": "38g",
            "Fat": "12g",
            "Fiber": "7g"
        },
        "chef_tips": [
            "Do not overcrowd the skillet; allowing steam to escape produces golden caramelization rather than soggy vegetables.",
            "Taste and adjust acid (lemon juice or balsamic vinegar) at the very end to brighten the dish."
        ],
        "estimated_cost_tier": "Budget Friendly ($4 - $6 total)",
        "is_demo": True,
        "demo_notice": "Demo Mode: Recipe crafted using culinary rule engine based on your selected ingredients. (Add GEMINI_API_KEY in backend/.env for dynamic generative AI)"
    }

def get_demo_nutrition_plan(dietary_pref: str, daily_calories: int, meals_per_day: int, avoid_items: List[str]) -> Dict[str, Any]:
    cal_split = daily_calories // meals_per_day
    avoid_note = f" (strictly excluding {', '.join(avoid_items)})" if avoid_items else ""
    
    meals = []
    
    meal_configs = [
        {
            "type": "Breakfast",
            "title": "Superfood Oatmeal Bowl with Chia & Berries",
            "desc": "Rolled oats simmered with almond milk, topped with antioxidant-rich blueberries, chia seeds, and crushed walnuts.",
            "cals": int(daily_calories * 0.28),
            "p": "18g", "c": "55g", "f": "14g",
            "ings": ["Rolled Oats", "Blueberries", "Chia Seeds", "Plant Milk", "Walnuts"],
            "note": "Prepare rolled oats overnight for effortless mornings."
        },
        {
            "type": "Lunch",
            "title": "Mediterranean Quinoa & Herb Power Salad",
            "desc": "Fluffy tri-color quinoa tossed with crisp diced cucumbers, chickpeas, fresh mint, parsley, and lemon-oregano vinaigrette.",
            "cals": int(daily_calories * 0.35),
            "p": "24g", "c": "68g", "f": "19g",
            "ings": ["Tri-color Quinoa", "Chickpeas", "Cucumbers", "Cherry Tomatoes", "Olive Oil"],
            "note": "Pack dressing separately to keep greens crisp until lunchtime."
        },
        {
            "type": "Dinner",
            "title": "Roasted Veggie & Tofu / Lean Protein Sheet Pan",
            "desc": "Oven-roasted broccoli florets, sweet potato cubes, and seasoned protein marinated in smoked paprika and rosemary.",
            "cals": int(daily_calories * 0.32),
            "p": "32g", "c": "48g", "f": "16g",
            "ings": ["Firm Tofu / Protein", "Sweet Potato", "Broccoli", "Smoked Paprika", "Rosemary"],
            "note": "Roast at 200°C (400°F) for 25 minutes until edges are crisp."
        },
        {
            "type": "Evening Snack",
            "title": "Greek Yogurt with Spiced Pumpkin Seeds",
            "desc": "High-protein strained yogurt layered with cinnamon-dusted roasted pumpkin seeds and a touch of raw honey.",
            "cals": int(daily_calories * 0.05),
            "p": "14g", "c": "12g", "f": "5g",
            "ings": ["Greek Yogurt", "Pumpkin Seeds", "Cinnamon", "Honey"],
            "note": "Provides steady slow-digesting casein protein before rest."
        }
    ]
    
    selected_meals = meal_configs[:meals_per_day]
    total_calc = sum(m["cals"] for m in selected_meals)
    
    meal_items = []
    for m in selected_meals:
        meal_items.append({
            "meal_type": m["type"],
            "meal_title": m["title"],
            "description": m["desc"] + avoid_note,
            "estimated_calories": m["cals"],
            "macros": {"Protein": m["p"], "Carbs": m["c"], "Fats": m["f"]},
            "key_ingredients": m["ings"],
            "prep_note": m["note"]
        })

    return {
        "plan_title": f"{dietary_pref} Daily Fuel Plan ({daily_calories} kcal target)",
        "dietary_preference": dietary_pref,
        "daily_calorie_target": daily_calories,
        "total_estimated_calories": total_calc,
        "daily_macros_summary": {
            "Total Protein": f"{int(daily_calories * 0.25 / 4)}g (25%)",
            "Total Carbohydrates": f"{int(daily_calories * 0.50 / 4)}g (50%)",
            "Total Fats": f"{int(daily_calories * 0.25 / 9)}g (25%)",
            "Daily Fiber Target": "32g - 38g"
        },
        "meals": meal_items,
        "hydration_advice": "Aim for 2.5 - 3.0 Litres of filtered water throughout the day. Drink 1 glass upon waking to kickstart metabolic hydration.",
        "lifestyle_tips": [
            "Space meals 3.5 to 4.5 hours apart to maintain steady blood glucose levels.",
            "Incorporate 20-30 minutes of moderate physical movement to optimize nutrient partitioning.",
            "Finish your final meal at least 2.5 hours prior to sleep for restorative digestion."
        ],
        "disclaimer": "Approximate dietary planning guidance only. Calorie targets and macro figures are non-clinical estimations and do not constitute certified medical, dietetic, or nutritional prescription.",
        "is_demo": True,
        "demo_notice": "Demo Mode: Nutrition plan formulated via clinical macro calculation algorithms. (Add GEMINI_API_KEY in backend/.env for adaptive AI reasoning)"
    }
