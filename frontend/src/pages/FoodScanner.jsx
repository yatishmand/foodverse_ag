import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ScanLine,
  AlertTriangle,
  Flame,
  Scale,
  Sparkles,
  PieChart,
  Tag,
  Heart,
  Loader2,
  RefreshCw,
  CheckCircle
} from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import DemoBadge from '../components/DemoBadge';
import { api } from '../services/api';

export default function FoodScanner({ onActivityLogged }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const samplePresets = [
    { emoji: '🥑', title: 'Avocado Egg Toast' },
    { emoji: '🥗', title: 'Quinoa Power Bowl' },
    { emoji: '🐟', title: 'Grilled Salmon Asparagus' },
    { emoji: '🧀', title: 'Paneer Tikka Platter' }
  ];

  const handleImageSelected = (file, url) => {
    setSelectedFile(file);
    setPreviewUrl(url);
    setError('');
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setResult(null);
    setError('');
  };

  const handleScan = async () => {
    if (!selectedFile) {
      setError('Please select or capture a food photo to analyze.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await api.analyzeFood(selectedFile);
      setResult(data);
      if (onActivityLogged) onActivityLogged();
    } catch (err) {
      setError(err.message || 'Failed to scan food image. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Intro Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>AI Food Scanner & Macro Estimator</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '700px', marginTop: '4px' }}>
            Upload or snap a photo of any cooked meal, snack, or grocery item. The multimodal AI identifies ingredients, estimates calories, and computes approximate macronutrient distribution.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="fv-badge badge-fresh">
            <Sparkles size={12} />
            Multimodal Vision
          </span>
        </div>
      </div>

      <div className="fv-grid-2">
        {/* Upload & Controls Column */}
        <div className="fv-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
              Select Food Image
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Capture a dish, choose a photo from your computer, or pick one of our instant viva samples.
            </p>
          </div>

          <ImageUploader
            onImageSelected={handleImageSelected}
            selectedFile={selectedFile}
            previewUrl={previewUrl}
            onClear={handleClear}
            samplePresets={samplePresets}
            presetType="food"
            label="Upload Food Photo"
          />

          {error && (
            <div className="fv-disclaimer safety">
              <AlertTriangle size={18} className="alert-icon" />
              <div>
                <strong>Error: </strong>
                {error}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
            <button
              type="button"
              className="fv-btn fv-btn-primary"
              style={{ flex: 1, padding: '13px 20px' }}
              disabled={!selectedFile || loading}
              onClick={handleScan}
              id="analyze-food-btn"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Analyzing Food & Nutrients...
                </>
              ) : (
                <>
                  <ScanLine size={18} />
                  Analyze Dish
                </>
              )}
            </button>
            {result && (
              <button
                type="button"
                className="fv-btn fv-btn-secondary"
                onClick={handleClear}
                title="Reset Scan"
                id="reset-food-scan-btn"
              >
                <RefreshCw size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Results Column */}
        <div>
          {loading && (
            <div className="fv-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '380px', justifyContent: 'center', alignItems: 'center' }}>
              <div className="skeleton-box" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Extracting Food Features</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginTop: '4px' }}>
                  Processing visual pixels, segmenting ingredients, estimating portions...
                </p>
              </div>
              <div className="skeleton-box" style={{ width: '85%', height: '24px' }} />
              <div className="skeleton-box" style={{ width: '60%', height: '24px' }} />
            </div>
          )}

          {!loading && !result && (
            <div
              className="fv-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '380px',
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
                <ScanLine size={32} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>No Food Scanned Yet</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '340px', marginTop: '6px' }}>
                Upload or take a photo on the left and click "Analyze Dish" to view nutritional estimations and macro calculations.
              </p>
            </div>
          )}

          {!loading && result && (
            <motion.div
              className="fv-card"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              {/* Header result row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <DemoBadge isDemo={result.is_demo} notice={result.demo_notice} />
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginTop: '8px', color: 'var(--text-primary)' }}>
                    {result.food_name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--forest-600)', fontWeight: 600 }}>
                      Confidence: {result.confidence_level}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>•</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Portion: {result.suggested_portion_size}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center'
                  }}
                >
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Health Score
                  </span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--forest-600)' }}>
                    {result.health_score}/100
                  </div>
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                {result.short_description}
              </p>

              {/* Calorie & Macro highlight */}
              <div
                style={{
                  background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-surface))',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Flame size={18} color="#ea580c" />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Estimated Nutritional Breakdown</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', textAlign: 'center' }}>
                  <div style={{ padding: '8px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Calories</span>
                    <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ea580c', margin: '2px 0 0' }}>
                      ~{result.estimated_calories}
                    </p>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>kcal</span>
                  </div>

                  {result.macronutrients && Object.entries(result.macronutrients).map(([macro, val]) => (
                    <div key={macro} style={{ padding: '8px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{macro}</span>
                      <p style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0 0' }}>
                        {val}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ingredients detected */}
              {result.key_ingredients_detected && result.key_ingredients_detected.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Key Ingredients Detected
                  </h4>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {result.key_ingredients_detected.map((ing, i) => (
                      <span key={i} className="fv-badge badge-neutral" style={{ textTransform: 'none', fontSize: '0.82rem' }}>
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dietary Tags */}
              {result.dietary_tags && result.dietary_tags.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {result.dietary_tags.map((tag, i) => (
                    <span key={i} className="fv-badge badge-fresh">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Mandatory Medical / Precision Disclaimer */}
              <div className="fv-disclaimer">
                <AlertTriangle size={18} className="alert-icon" />
                <div>
                  <strong>Nutritional Estimation Disclaimer: </strong>
                  {result.disclaimer}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
