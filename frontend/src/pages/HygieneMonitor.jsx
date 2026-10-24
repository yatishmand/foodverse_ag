import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  Loader2,
  RefreshCw,
  CheckCircle2,
  Brush,
  Info
} from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import DemoBadge from '../components/DemoBadge';
import { api } from '../services/api';

export default function HygieneMonitor({ onActivityLogged }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const samplePresets = [
    { emoji: '🍳', title: 'Prep Station Counter' },
    { emoji: '🪵', title: 'Cutting Board Station' },
    { emoji: '🍽️', title: 'Dining Prep Surface' }
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
      setError('Please select or capture a photo of a kitchen or prep station.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await api.analyzeHygiene(selectedFile);
      setResult(data);
      if (onActivityLogged) onActivityLogged();
    } catch (err) {
      setError(err.message || 'Failed to inspect kitchen hygiene.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'Acceptable visual cleanliness') {
      return {
        bg: '#dcfce7',
        color: '#15803d',
        border: '#86efac',
        icon: ShieldCheck,
        label: 'Acceptable Visual Cleanliness'
      };
    } else if (status === 'Visible concerns detected') {
      return {
        bg: '#fee2e2',
        color: '#dc2626',
        border: '#fca5a5',
        icon: AlertTriangle,
        label: 'Visible Cleanliness Concerns Detected'
      };
    }
    return {
      bg: '#f1f5f9',
      color: '#475569',
      border: '#cbd5e1',
      icon: HelpCircle,
      label: 'Unable to Assess'
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Intro Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Visible Hygiene & Sanitation Monitor</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '720px', marginTop: '4px' }}>
            Upload photographs of food preparation stations, kitchen counters, or dining tables. The vision model audits visible clutter, cross-contamination vectors, and surface residue.
          </p>
        </div>
        <span className="fv-badge badge-neutral">
          <Sparkles size={12} />
          Sanitation Audit AI
        </span>
      </div>

      <div className="fv-grid-2">
        {/* Upload & Controls */}
        <div className="fv-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
              Upload Prep Area Photograph
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Capture the food contact surfaces, chopping boards, or surrounding counter setup.
            </p>
          </div>

          <ImageUploader
            onImageSelected={handleImageSelected}
            selectedFile={selectedFile}
            previewUrl={previewUrl}
            onClear={handleClear}
            samplePresets={samplePresets}
            presetType="hygiene"
            label="Upload Kitchen Counter Photo"
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
              id="analyze-hygiene-btn"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Inspecting Station Hygiene...
                </>
              ) : (
                <>
                  <ShieldAlert size={18} />
                  Analyze Visible Hygiene
                </>
              )}
            </button>
            {result && (
              <button
                type="button"
                className="fv-btn fv-btn-secondary"
                onClick={handleClear}
                title="Reset Inspection"
                id="reset-hygiene-btn"
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
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Scanning Visual Cleanliness Vectors</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginTop: '4px' }}>
                  Auditing raw-cooked separation, surface sheen, cloth hygiene, and clutter...
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
                <ShieldAlert size={32} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>No Kitchen Station Inspected Yet</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '340px', marginTop: '6px' }}>
                Select a prep area image on the left and click "Analyze Visible Hygiene" to evaluate sanitation markers.
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
              {/* Overall status banner */}
              {(() => {
                const badge = getStatusBadge(result.overall_status);
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
                          Overall Visual Sanitation Status
                        </span>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: badge.color }}>
                          {badge.label}
                        </h4>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700 }}>
                        Hygiene Score
                      </span>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                        {result.hygiene_score}/100
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div>
                <DemoBadge isDemo={result.is_demo} notice={result.demo_notice} />
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '8px' }}>
                  {result.area_type}
                </h3>
              </div>

              {/* Visible Cleanliness Observations */}
              {result.visible_cleanliness_observations && result.visible_cleanliness_observations.length > 0 && (
                <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#15803d', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <CheckCircle2 size={14} />
                    Observations Based on Visible Evidence
                  </span>
                  <ul style={{ paddingLeft: '18px', fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {result.visible_cleanliness_observations.map((obs, i) => (
                      <li key={i}>{obs}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Potential Risk Factors */}
              {result.potential_risk_factors && result.potential_risk_factors.length > 0 && (
                <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#b45309', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <AlertTriangle size={14} />
                    Potential Sanitation Risk Factors
                  </span>
                  <ul style={{ paddingLeft: '18px', fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {result.potential_risk_factors.map((risk, i) => (
                      <li key={i}>{risk}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actionable Recommendations */}
              {result.actionable_recommendations && result.actionable_recommendations.length > 0 && (
                <div style={{ background: 'var(--accent-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', color: 'var(--forest-900)' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <Brush size={16} />
                    Actionable Handling & Cleaning Recommendations
                  </span>
                  <ul style={{ paddingLeft: '18px', fontSize: '0.86rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {result.actionable_recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Official Disclaimer */}
              <div className="fv-disclaimer safety">
                <AlertTriangle size={20} className="alert-icon" />
                <div>
                  <strong>Official Health & Inspection Disclaimer: </strong>
                  {result.official_disclaimer}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
