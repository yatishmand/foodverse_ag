import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChefHat,
  Plus,
  X,
  Clock,
  Users,
  Flame,
  Sparkles,
  AlertTriangle,
  Loader2,
  Check,
  DollarSign,
  Utensils
} from 'lucide-react';
import DemoBadge from '../components/DemoBadge';
import { api } from '../services/api';

export default function CookingAssistant({ onActivityLogged }) {
  const [ingredients, setIngredients] = useState(['Tomatoes', 'Garlic', 'Olive Oil', 'Pasta']);
  const [currentInput, setCurrentInput] = useState('');
  const [cuisine, setCuisine] = useState('Italian');
  const [dietaryPref, setDietaryPref] = useState('Vegetarian');
  const [cookingTime, setCookingTime] = useState(30);
  const [skillLevel, setSkillLevel] = useState('Beginner');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recipe, setRecipe] = useState(null);

  const stapleSuggestions = [
    'Onions', 'Eggs', 'Rice', 'Bell Pepper', 'Spinach',
    'Paneer / Tofu', 'Chicken Breast', 'Black Beans', 'Mushrooms'
  ];

  const handleAddIngredient = (item) => {
    const clean = (item || currentInput).trim();
    if (clean && !ingredients.some((i) => i.toLowerCase() === clean.toLowerCase())) {
      setIngredients([...ingredients, clean]);
      setCurrentInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (ingredients.length === 0) {
      setError('Please add at least one available ingredient.');
      return;
    }

    setLoading(true);
    setError('');
    setRecipe(null);

    try {
      const data = await api.generateRecipe({
        ingredients,
        cuisine,
        dietary_preference: dietaryPref,
        cooking_time_max: cookingTime,
        skill_level: skillLevel
      });
      setRecipe(data);
      if (onActivityLogged) onActivityLogged();
    } catch (err) {
      setError(err.message || 'Failed to generate recipe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Intro Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Smart Generative Cooking Assistant</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '720px', marginTop: '4px' }}>
            Transform whatever ingredients you have in your fridge or pantry into a gourmet, step-by-step recipe with accurate cooking times and nutritional breakdowns.
          </p>
        </div>
        <span className="fv-badge badge-warning">
          <Sparkles size={12} />
          Pantry-to-Plate AI
        </span>
      </div>

      <div className="fv-grid-2">
        {/* Input Parameters Card */}
        <div className="fv-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
              Available Pantry Ingredients
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Type ingredients and press Enter, or click the quick staple tags below.
            </p>
          </div>

          {/* Tag Input */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              className="fv-input"
              placeholder="e.g. Cherry tomatoes, Mozzarella, Basil..."
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              id="ingredient-input-field"
            />
            <button
              type="button"
              className="fv-btn fv-btn-secondary"
              onClick={() => handleAddIngredient()}
              id="add-ingredient-btn"
            >
              <Plus size={18} />
              Add
            </button>
          </div>

          {/* Quick Staple Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', width: '100%', marginBottom: '2px' }}>
              Quick suggestions:
            </span>
            {stapleSuggestions.map((staple) => (
              <button
                key={staple}
                type="button"
                className="preset-sample-btn"
                style={{ fontSize: '0.78rem' }}
                onClick={() => handleAddIngredient(staple)}
              >
                + {staple}
              </button>
            ))}
          </div>

          {/* Selected Ingredients Badges */}
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Selected Ingredients ({ingredients.length}):
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {ingredients.map((ing, i) => (
                <span
                  key={i}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: 'var(--accent-subtle)',
                    color: 'var(--forest-800)',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}
                >
                  {ing}
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(i)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--forest-700)', padding: 0, display: 'flex' }}
                    aria-label={`Remove ${ing}`}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)' }} />

          {/* Preferences */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="fv-input-group">
              <label className="fv-label">Cuisine Style</label>
              <select
                className="fv-select"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                id="cuisine-select"
              >
                <option value="Italian">Italian</option>
                <option value="Indian">Indian</option>
                <option value="Mediterranean">Mediterranean</option>
                <option value="Mexican">Mexican</option>
                <option value="Asian / Stir-fry">Asian / Stir-fry</option>
                <option value="American / Bistro">American / Bistro</option>
                <option value="Fusion / Any">Fusion / Any</option>
              </select>
            </div>

            <div className="fv-input-group">
              <label className="fv-label">Dietary Type</label>
              <select
                className="fv-select"
                value={dietaryPref}
                onChange={(e) => setDietaryPref(e.target.value)}
                id="dietary-select"
              >
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="High-Protein">High-Protein</option>
                <option value="Keto / Low-Carb">Keto / Low-Carb</option>
                <option value="Any">Any</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="fv-input-group">
              <label className="fv-label">Max Cooking Time: {cookingTime} mins</label>
              <input
                type="range"
                min="15"
                max="90"
                step="5"
                value={cookingTime}
                onChange={(e) => setCookingTime(Number(e.target.value))}
                style={{ accentColor: 'var(--lime-500)', marginTop: '8px' }}
                id="cooking-time-range"
              />
            </div>

            <div className="fv-input-group">
              <label className="fv-label">Skill Level</label>
              <select
                className="fv-select"
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
                id="skill-level-select"
              >
                <option value="Beginner">Beginner (1-Pot / Simple)</option>
                <option value="Intermediate">Intermediate (Skillet & Sear)</option>
                <option value="Master">Master Chef (Layered flavors)</option>
              </select>
            </div>
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
            style={{ padding: '14px 20px', marginTop: '6px' }}
            disabled={ingredients.length === 0 || loading}
            onClick={handleGenerate}
            id="generate-recipe-btn"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Crafting Custom Recipe...
              </>
            ) : (
              <>
                <ChefHat size={18} />
                Generate Custom Recipe
              </>
            )}
          </button>
        </div>

        {/* Recipe Display Card */}
        <div>
          {loading && (
            <div className="fv-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '440px', justifyContent: 'center', alignItems: 'center' }}>
              <div className="skeleton-box" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Synthesizing Culinary Profile</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginTop: '4px' }}>
                  Balancing flavor aromatics, step sequencing, and calculating macro estimates...
                </p>
              </div>
              <div className="skeleton-box" style={{ width: '85%', height: '24px' }} />
              <div className="skeleton-box" style={{ width: '70%', height: '24px' }} />
            </div>
          )}

          {!loading && !recipe && (
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
                <ChefHat size={32} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Ready to Cook</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '340px', marginTop: '6px' }}>
                Enter your available ingredients on the left and click "Generate Custom Recipe" to receive an AI chef recipe.
              </p>
            </div>
          )}

          {!loading && recipe && (
            <motion.div
              className="fv-card"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <div>
                <DemoBadge isDemo={recipe.is_demo} notice={recipe.demo_notice} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '8px', color: 'var(--text-primary)' }}>
                  {recipe.recipe_name}
                </h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                  {recipe.description}
                </p>
              </div>

              {/* Meta stats pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <span className="fv-badge badge-neutral" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} />
                  Prep: {recipe.prep_time_minutes}m • Cook: {recipe.cook_time_minutes}m ({recipe.total_time_minutes}m total)
                </span>
                <span className="fv-badge badge-neutral" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users size={13} />
                  {recipe.servings} Servings
                </span>
                <span className="fv-badge badge-fresh">
                  {recipe.dietary_type}
                </span>
                <span className="fv-badge badge-neutral">
                  <DollarSign size={13} />
                  {recipe.estimated_cost_tier}
                </span>
              </div>

              {/* Nutrition row */}
              {recipe.nutrition_per_serving && (
                <div style={{ padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Approximate Nutrition Per Serving
                  </span>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '6px' }}>
                    {Object.entries(recipe.nutrition_per_serving).map(([k, v]) => (
                      <span key={k} style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                        {k}: <strong style={{ color: 'var(--forest-600)' }}>{v}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Ingredients Checklist */}
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Ingredients & Quantities
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {recipe.ingredients.map((ing, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-secondary)',
                        fontSize: '0.88rem'
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{ing.name}</span>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {ing.quantity} {ing.is_pantry_staple && '(Pantry Staple)'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-step instructions */}
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Preparation & Cooking Instructions
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {recipe.instructions.map((inst, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        fontSize: '0.9rem',
                        lineHeight: 1.55,
                        color: 'var(--text-primary)'
                      }}
                    >
                      <span
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--accent-subtle)',
                          color: 'var(--forest-800)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          flexShrink: 0,
                          marginTop: '2px'
                        }}
                      >
                        {i + 1}
                      </span>
                      <span>{inst.replace(/^Step \d+:\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chef tips */}
              {recipe.chef_tips && recipe.chef_tips.length > 0 && (
                <div style={{ background: 'var(--accent-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', color: 'var(--forest-900)' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <ChefHat size={16} />
                    Chef's Pro Tip
                  </span>
                  <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', margin: 0 }}>
                    {recipe.chef_tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
