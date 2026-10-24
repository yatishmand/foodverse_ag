import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Apple,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  Loader2,
  RefreshCw,
  Info
} from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import DemoBadge from '../components/DemoBadge';
import { api } from '../services/api';

export default function FreshnessChecker({ onActivityLogged }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const samplePresets = [
    { emoji: '🫑', title: 'Red Bell Pepper' },
    { emoji: '🍌', title: 'Cavendish Bananas' },
    { emoji: '🥬', title: 'Fresh Spinach' },
    { emoji: '🍎', title: 'Crisp Apple' }
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

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select or capture a produce photo.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await api.analyzeFreshness(selectedFile);
      setResult(data);
      if (onActivityLogged) onActivityLogged();
    } catch (err) {
      setError(err.message || 'Failed to analyze produce freshness.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryBadge = (category) => {
    if (category === 'Looks fresh') {
      return {
        bg: '#dcfce7',
        color: '#15803d',
        border: '#86efac',
        icon: CheckCircle2,
        label: 'Looks Fresh'
      };
    } else if (category === 'Possible signs of deterioration') {
      return {
        bg: '#fef3c7',
        color: '#b45309',
        border: '#fde68a',
        icon: AlertTriangle,
        label: 'Possible Signs of Deterioration'
      };
    }
    return {
      bg: '#f1f5f9',
      color: '#475569',
      border: '#cbd5e1',
      icon: HelpCircle,
      label: 'Unable to Determine'
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Intro Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Produce Freshness & Quality Auditor</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '720px', marginTop: '4px' }}>
            Evaluate visible signs of freshness or senescence in raw fruits, leafy vegetables, and produce. Review visible discoloration, skin integrity, and optimal storage advice.
          </p>
        </div>
        <span className="fv-badge badge-fresh">
          <Sparkles size={12} />
          Visible Evidence Analysis
        </span>
      </div>

      <div className="fv-grid-2">
        {/* Input Column */}
        <div className="fv-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
              Upload Produce Photo
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Capture fruit, vegetable, or herb surfaces under bright, natural lighting for clearest visible indicator extraction.
            </p>
          </div>

          <ImageUploader
            onImageSelected={handleImageSelected}
            selectedFile={selectedFile}
            previewUrl={previewUrl}
            onClear={handleClear}
            samplePresets={samplePresets}
            presetType="freshness"
            label="Upload Fruit or Vegetable Image"
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

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              className="fv-btn fv-btn-primary"
              style={{ flex: 1, padding: '13px 20px' }}
              disabled={!selectedFile || loading}
              onClick={handleAnalyze}
              id="analyze-freshness-btn"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Inspecting Visual Indicators...
                </>
              ) : (
                <>
                  <Apple size={18} />
                  Analyze Freshness
                </>
              )}
            </button>
            {result && (
              <button
                type="button"
                className="fv-btn fv-btn-secondary"
                onClick={handleClear}
                title="Reset Inspection"
                id="reset-freshness-btn"
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
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Evaluating Surface Markers</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginTop: '4px' }}>
                  Auditing dermal firmness, chlorophyll intensity, oxidation, and stem hydration...
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
                <Apple size={32} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>No Produce Inspected Yet</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '340px', marginTop: '6px' }}>
                Select a fruit or vegetable image on the left and click "Analyze Freshness" to inspect visible decay signals.
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
              {/* Category banner */}
              {(() => {
                const badge = getCategoryBadge(result.category);
                const Icon = badge.icon;
                return (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: badge.bg,
                      border: `1px solid ${badge.border}`,
                      color: badge.color
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Icon size={24} />
                      <div>
                        <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                          Visual Assessment
                        </span>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: badge.color }}>
                          {badge.label}
                        </h4>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700 }}>
                        Freshness Score
                      </span>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                        {result.freshness_score}/100
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <DemoBadge isDemo={result.is_demo} notice={result.demo_notice} />
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '6px' }}>
                    {result.item_name}
                  </h3>
                </div>
              </div>

              {/* Visible Appearance Observation */}
              <div>
                <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Visible Surface Appearance
                </h4>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  {result.visible_appearance}
                </p>
              </div>

              {/* Indicators Lists */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {/* Positive signs */}
                <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#15803d', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <CheckCircle2 size={14} />
                    Visible Freshness Markers
                  </span>
                  {result.positive_indicators && result.positive_indicators.length > 0 ? (
                    <ul style={{ paddingLeft: '18px', fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {result.positive_indicators.map((pos, i) => (
                        <li key={i}>{pos}</li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>None noted.</p>
                  )}
                </div>

                {/* Deterioration signs */}
                <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#b45309', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <AlertTriangle size={14} />
                    Visible Decay Markers
                  </span>
                  {result.deterioration_indicators && result.deterioration_indicators.length > 0 ? (
                    <ul style={{ paddingLeft: '18px', fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {result.deterioration_indicators.map((det, i) => (
                        <li key={i}>{det}</li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>No visible decay markers detected.</p>
                  )}
                </div>
              </div>

              {/* Visible Evidence Explanation */}
              <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Evidence-Based Assessment Rationale
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  {result.evidence_explanation}
                </p>
              </div>

              {/* Recommended Action */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: 'var(--accent-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--forest-800)' }}>
                <Info size={18} style={{ flexShrink: 0 }} />
                <p style={{ fontSize: '0.86rem', fontWeight: 600, margin: 0 }}>
                  Recommended Action: {result.recommended_action}
                </p>
              </div>

              {/* Critical Food Safety Guidance Disclaimer */}
              <div className="fv-disclaimer safety">
                <AlertTriangle size={20} className="alert-icon" />
                <div>
                  <strong>Critical Food Safety Warning: </strong>
                  {result.safety_guidance}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
