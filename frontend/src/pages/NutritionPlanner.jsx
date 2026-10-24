import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  Flame,
  PieChart,
  Droplets,
  Heart,
  Plus,
  X,
  AlertTriangle,
  Loader2,
  Sparkles,
  Utensils,
  Lightbulb
} from 'lucide-react';
import DemoBadge from '../components/DemoBadge';
import { api } from '../services/api';

export default function NutritionPlanner({ onActivityLogged }) {
  const [dietaryPref, setDietaryPref] = useState('Balanced');
  const [calorieTarget, setCalorieTarget] = useState(2000);
  const [mealsPerDay, setMealsPerDay] = useState(3);
  const [avoidInput, setAvoidInput] = useState('');
  const [avoidList, setAvoidList] = useState(['Peanuts', 'Dairy']);
  const [fitnessGoal, setFitnessGoal] = useState('Maintenance');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [plan, setPlan] = useState(null);

  const commonAllergens = ['Shellfish', 'Soy', 'Gluten', 'Pork', 'Tree Nuts', 'Egg'];

  const handleAddAvoid = (item) => {
    const clean = (item || avoidInput).trim();
    if (clean && !avoidList.some((a) => a.toLowerCase() === clean.toLowerCase())) {
      setAvoidList([...avoidList, clean]);
      setAvoidInput('');
    }
  };

  const handleRemoveAvoid = (index) => {
    setAvoidList(avoidList.filter((_, i) => i !== index));
  };

  const handleGeneratePlan = async () => {
    setLoading(true);
    setError('');
    setPlan(null);

    try {
      const data = await api.createNutritionPlan({
        dietary_preference: dietaryPref,
        daily_calorie_target: calorieTarget,
        meals_per_day: mealsPerDay,
        allergies_or_avoid: avoidList,
        fitness_goal: fitnessGoal
      });
      setPlan(data);
      if (onActivityLogged) onActivityLogged();
    } catch (err) {
      setError(err.message || 'Failed to generate meal plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>AI Daily Nutrition & Meal Planner</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '720px', marginTop: '4px' }}>
            Calculate macro partitions and organize a customized, balanced daily meal schedule matching your exact metabolic target, dietary choices, and allergen exclusions.
          </p>
        </div>
        <span className="fv-badge badge-neutral">
          <Sparkles size={12} />
          Nutritional Intelligence
        </span>
      </div>

      <div className="fv-grid-2">
        {/* Form Inputs */}
        <div className="fv-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
              Dietary Profile & Goals
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Customize your nutritional parameters to produce personalized meal options.
            </p>
          </div>

          {/* Dietary preference & Fitness goal */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="fv-input-group">
              <label className="fv-label">Dietary Preference</label>
              <select
                className="fv-select"
                value={dietaryPref}
                onChange={(e) => setDietaryPref(e.target.value)}
                id="diet-pref-select"
              >
                <option value="Balanced">Balanced Whole Foods</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan (Plant-Based)</option>
                <option value="High-Protein">High-Protein Fitness</option>
                <option value="Mediterranean">Mediterranean</option>
                <option value="Keto / Low-Carb">Keto / Low-Carb</option>
              </select>
            </div>

            <div className="fv-input-group">
              <label className="fv-label">Fitness Objective</label>
              <select
                className="fv-select"
                value={fitnessGoal}
                onChange={(e) => setFitnessGoal(e.target.value)}
                id="fitness-goal-select"
              >
                <option value="Maintenance">Weight Maintenance</option>
                <option value="Weight Loss">Healthy Fat Loss</option>
                <option value="Muscle Gain">Lean Muscle Hypertrophy</option>
                <option value="Energy Boost">Endurance & Energy</option>
              </select>
            </div>
          </div>

          {/* Calorie Target Slider */}
          <div className="fv-input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="fv-label">Daily Calorie Target</label>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ea580c' }}>
                {calorieTarget} kcal
              </span>
            </div>
            <input
              type="range"
              min="1200"
              max="4000"
              step="50"
              value={calorieTarget}
              onChange={(e) => setCalorieTarget(Number(e.target.value))}
              style={{ accentColor: 'var(--lime-500)', marginTop: '6px' }}
              id="calorie-target-slider"
            />
            {/* Quick Presets */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              {[1600, 2000, 2400, 2800].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className="preset-sample-btn"
                  style={{
                    backgroundColor: calorieTarget === preset ? 'var(--accent-subtle)' : 'var(--bg-secondary)',
                    borderColor: calorieTarget === preset ? 'var(--lime-500)' : 'var(--border-light)'
                  }}
                  onClick={() => setCalorieTarget(preset)}
                >
                  {preset} kcal
                </button>
              ))}
            </div>
          </div>

          {/* Meals per day */}
          <div className="fv-input-group">
            <label className="fv-label">Number of Meals: {mealsPerDay} Meals / Day</label>
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              {[2, 3, 4].map((count) => (
                <button
                  key={count}
                  type="button"
                  className="fv-btn"
                  style={{
                    flex: 1,
                    backgroundColor: mealsPerDay === count ? 'var(--forest-800)' : 'var(--bg-secondary)',
                    color: mealsPerDay === count ? '#ffffff' : 'var(--text-primary)',
                    border: '1px solid var(--border-light)'
                  }}
                  onClick={() => setMealsPerDay(count)}
                >
                  {count} Meals {count === 3 ? '(Standard)' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Allergies & Avoid Input */}
          <div className="fv-input-group">
            <label className="fv-label">Ingredients or Allergens to Avoid</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="fv-input"
                placeholder="e.g. Shellfish, Gluten, Cilantro..."
                value={avoidInput}
                onChange={(e) => setAvoidInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAvoid())}
                id="avoid-input-field"
              />
              <button
                type="button"
                className="fv-btn fv-btn-secondary"
                onClick={() => handleAddAvoid()}
              >
                <Plus size={18} />
              </button>
            </div>

            {/* Quick Allergens */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
              {commonAllergens.map((alg) => (
                <button
                  key={alg}
                  type="button"
                  className="preset-sample-btn"
                  onClick={() => handleAddAvoid(alg)}
                >
                  + {alg}
                </button>
              ))}
            </div>

            {/* Selected Exclusions */}
            {avoidList.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                {avoidList.map((item, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-pill)',
                      backgroundColor: 'rgba(220, 38, 38, 0.1)',
                      color: '#dc2626',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}
                  >
                    No {item}
                    <button
                      type="button"
                      onClick={() => handleRemoveAvoid(idx)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: 0, display: 'flex' }}
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="fv-disclaimer safety">
              <AlertTriangle size={18} className="alert-icon" />
              <div>
                <strong>Error: </strong>
                {error}
              </div>
            </div>
          )}

          <button
            type="button"
            className="fv-btn fv-btn-primary"
            style={{ padding: '14px 20px', marginTop: '8px' }}
            disabled={loading}
            onClick={handleGeneratePlan}
            id="generate-plan-btn"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Formulating Custom Plan...
              </>
            ) : (
              <>
                <CalendarDays size={18} />
                Generate Daily Meal Plan
              </>
            )}
          </button>
        </div>

        {/* Results Column */}
        <div>
          {loading && (
            <div className="fv-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '440px', justifyContent: 'center', alignItems: 'center' }}>
              <div className="skeleton-box" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Calculating Caloric Distribution</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginTop: '4px' }}>
                  Structuring macro balances, aligning meal timings, and avoiding restricted allergens...
                </p>
              </div>
              <div className="skeleton-box" style={{ width: '85%', height: '24px' }} />
              <div className="skeleton-box" style={{ width: '70%', height: '24px' }} />
            </div>
          )}

          {!loading && !plan && (
            <div
              className="fv-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '440px',
                textAlign: 'center',
                borderStyle: 'dashed'
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--forest-600)',
                  marginBottom: '14px'
                }}
              >
                <CalendarDays size={32} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>No Meal Plan Generated Yet</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '340px', marginTop: '6px' }}>
                Configure your dietary style and target calories on the left, then click "Generate Daily Meal Plan".
              </p>
            </div>
          )}

          {!loading && plan && (
            <motion.div
              className="fv-card"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <div>
                <DemoBadge isDemo={plan.is_demo} notice={plan.demo_notice} />
                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginTop: '8px' }}>
                  {plan.plan_title}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--forest-600)', fontWeight: 600 }}>
                    Target: {plan.daily_calorie_target} kcal
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>•</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Calculated Total: ~{plan.total_estimated_calories} kcal
                  </span>
                </div>
              </div>

              {/* Daily Macros Summary Banner */}
              {plan.daily_macros_summary && (
                <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Approximate Daily Macronutrient Targets
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '8px', textAlign: 'center' }}>
                    {Object.entries(plan.daily_macros_summary).map(([macro, val]) => (
                      <div key={macro} style={{ padding: '8px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{macro.replace('Total ', '')}</span>
                        <p style={{ fontSize: '1rem', fontWeight: 800, margin: '2px 0 0', color: 'var(--text-primary)' }}>
                          {val}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Chronological Meal Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Scheduled Meals
                </h4>
                {plan.meals.map((meal, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '14px 16px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-light)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="fv-badge badge-fresh">
                        {meal.meal_type}
                      </span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ea580c' }}>
                        ~{meal.estimated_calories} kcal
                      </span>
                    </div>

                    <h5 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                      {meal.meal_title}
                    </h5>

                    <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                      {meal.description}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', flexWrap: 'wrap', gap: '8px' }}>
                      {meal.macros && (
                        <span>
                          Macros: P: {meal.macros.Protein || '—'} • C: {meal.macros.Carbs || '—'} • F: {meal.macros.Fats || '—'}
                        </span>
                      )}
                      <span>Prep: {meal.prep_note}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hydration & Lifestyle Tips */}
              {plan.hydration_advice && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: 'var(--accent-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--forest-900)' }}>
                  <Droplets size={18} style={{ flexShrink: 0 }} />
                  <p style={{ fontSize: '0.86rem', fontWeight: 600, margin: 0 }}>
                    {plan.hydration_advice}
                  </p>
                </div>
              )}

              {/* Medical Disclaimer */}
              <div className="fv-disclaimer">
                <AlertTriangle size={18} className="alert-icon" />
                <div>
                  <strong>Medical Disclaimer: </strong>
                  {plan.disclaimer}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
