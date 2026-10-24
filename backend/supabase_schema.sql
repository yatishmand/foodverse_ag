-- =========================================================================
-- Food Verse AI — Supabase SQL Database Schema
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard)
-- =========================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. User Activities Table (Scans, recipes, plans, hygiene audits)
CREATE TABLE IF NOT EXISTS public.user_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_type VARCHAR(50) NOT NULL, -- 'food_scan', 'freshness_check', 'recipe_generation', 'nutrition_plan', 'hygiene_check'
    title TEXT NOT NULL,
    summary TEXT,
    is_demo BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Food Scans Table
CREATE TABLE IF NOT EXISTS public.food_scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    food_name TEXT NOT NULL,
    short_description TEXT,
    estimated_calories INT,
    macronutrients JSONB,
    suggested_portion_size TEXT,
    confidence_level TEXT,
    dietary_tags TEXT[],
    health_score INT,
    image_url TEXT,
    is_demo BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Freshness Audits Table
CREATE TABLE IF NOT EXISTS public.freshness_audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_name TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'Looks fresh', 'Possible signs of deterioration', 'Unable to determine'
    freshness_score INT,
    positive_indicators TEXT[],
    deterioration_indicators TEXT[],
    evidence_explanation TEXT,
    recommended_action TEXT,
    image_url TEXT,
    is_demo BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Generated Recipes Table
CREATE TABLE IF NOT EXISTS public.recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_name TEXT NOT NULL,
    cuisine VARCHAR(100),
    total_time_minutes INT,
    servings INT,
    dietary_type VARCHAR(50),
    ingredients JSONB,
    instructions TEXT[],
    nutrition_per_serving JSONB,
    is_demo BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Nutrition Plans Table
CREATE TABLE IF NOT EXISTS public.nutrition_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_title TEXT NOT NULL,
    dietary_preference VARCHAR(100),
    daily_calorie_target INT,
    total_estimated_calories INT,
    daily_macros_summary JSONB,
    meals JSONB,
    is_demo BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Hygiene Inspections Table
CREATE TABLE IF NOT EXISTS public.hygiene_inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    area_type TEXT NOT NULL,
    overall_status VARCHAR(50) NOT NULL,
    hygiene_score INT,
    visible_cleanliness_observations TEXT[],
    potential_risk_factors TEXT[],
    actionable_recommendations TEXT[],
    image_url TEXT,
    is_demo BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) - Permissive for MVP / college demonstration
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.user_activities FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.user_activities FOR INSERT WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_activities_created ON public.user_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activities_type ON public.user_activities(activity_type);
