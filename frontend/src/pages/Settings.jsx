import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Server,
  Sparkles,
  Database,
  Moon,
  Sun,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Terminal,
  BookOpen,
  Key
} from 'lucide-react';
import { api } from '../services/api';

export default function Settings({ theme, toggleTheme, systemStatus, onRefreshStats }) {
  const [pingStatus, setPingStatus] = useState(null);
  const [testingPing, setTestingPing] = useState(false);

  const handleTestConnection = async () => {
    setTestingPing(true);
    const start = performance.now();
    try {
      const res = await api.checkHealth();
      const duration = Math.round(performance.now() - start);
      setPingStatus({
        ok: res.status === 'healthy',
        time: `${duration}ms`,
        data: res
      });
      if (onRefreshStats) onRefreshStats();
    } catch (err) {
      setPingStatus({
        ok: false,
        time: 'Failed',
        error: err.message
      });
    } finally {
      setTestingPing(false);
    }
  };

  const isAiActive = systemStatus?.ai_engine?.active;
  const isDbActive = systemStatus?.database?.active;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Platform Settings & Diagnostics</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '720px', marginTop: '4px' }}>
          Inspect backend health, toggle visual themes, review AI & database connectivity, and view viva architecture notes.
        </p>
      </div>

      <div className="fv-grid-2">
        {/* Connection Diagnostics Card */}
        <div className="fv-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Server size={22} color="var(--forest-600)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>FastAPI Backend Status</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Backend Endpoint</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, fontFamily: 'monospace' }}>http://localhost:8000</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>AI Provider Status</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isAiActive ? '#15803d' : '#b45309' }}>
                {isAiActive ? 'Live Google Gemini Multimodal' : 'Demo Mode (Simulated AI)'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Database Persistence</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isDbActive ? '#15803d' : '#2563eb' }}>
                {isDbActive ? 'Connected Supabase Cloud DB' : 'Local In-Memory Telemetry'}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="fv-btn fv-btn-secondary"
            onClick={handleTestConnection}
            disabled={testingPing}
            style={{ width: '100%', justifyContent: 'center' }}
            id="test-connection-btn"
          >
            {testingPing ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Testing API Ping...
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                Test Connection to Python Backend
              </>
            )}
          </button>

          {pingStatus && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: pingStatus.ok ? 'rgba(34, 197, 94, 0.12)' : 'rgba(220, 38, 38, 0.12)',
                border: `1px solid ${pingStatus.ok ? 'rgba(34, 197, 94, 0.3)' : 'rgba(220, 38, 38, 0.3)'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              {pingStatus.ok ? <CheckCircle2 size={18} color="#15803d" /> : <AlertCircle size={18} color="#dc2626" />}
              <div style={{ fontSize: '0.86rem' }}>
                <span style={{ fontWeight: 700, color: pingStatus.ok ? '#15803d' : '#dc2626' }}>
                  {pingStatus.ok ? `Backend Online (${pingStatus.time})` : 'Backend Unreachable'}
                </span>
                <p style={{ margin: '2px 0 0', color: 'var(--text-muted)' }}>
                  {pingStatus.ok ? 'FastAPI server is running cleanly at http://localhost:8000' : pingStatus.error}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Theme & Display Preferences */}
        <div className="fv-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {theme === 'dark' ? <Moon size={22} color="var(--lime-500)" /> : <Sun size={22} color="#d97706" />}
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Interface Theme</h3>
          </div>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Switch between the Deep Forest Dark theme and the Warm Cream Minimalist theme for high readability during demonstrations.
          </p>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              className="fv-btn"
              style={{
                flex: 1,
                backgroundColor: theme === 'dark' ? 'var(--forest-700)' : 'var(--bg-secondary)',
                color: theme === 'dark' ? '#ffffff' : 'var(--text-primary)',
                border: '1px solid var(--border-light)'
              }}
              onClick={() => theme !== 'dark' && toggleTheme()}
            >
              <Moon size={16} />
              Deep Forest Dark
            </button>

            <button
              type="button"
              className="fv-btn"
              style={{
                flex: 1,
                backgroundColor: theme === 'light' ? 'var(--forest-700)' : 'var(--bg-secondary)',
                color: theme === 'light' ? '#ffffff' : 'var(--text-primary)',
                border: '1px solid var(--border-light)'
              }}
              onClick={() => theme !== 'light' && toggleTheme()}
            >
              <Sun size={16} />
              Warm Cream Light
            </button>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)' }} />

          {/* Environment Config Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Key size={15} color="var(--forest-600)" />
              How to Configure Secrets in `backend/.env`
            </span>
            <pre
              style={{
                background: 'var(--bg-secondary)',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                fontFamily: 'monospace',
                overflowX: 'auto',
                color: 'var(--text-primary)'
              }}
            >
{`# backend/.env
GEMINI_API_KEY=your_gemini_key_here
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key`}
            </pre>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Note: The platform is engineered to start and function in Demo Mode even if both keys are left blank!
            </p>
          </div>
        </div>
      </div>

      {/* College Viva Architecture Overview Card */}
      <div className="fv-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <BookOpen size={22} color="var(--forest-600)" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>College Viva & Architecture Summary</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
          <div style={{ padding: '14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>
              1. Full-Stack Separation
            </h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              React + Vite frontend communicates with a Python FastAPI REST API. All secrets remain strictly isolated inside <code>backend/.env</code>, avoiding browser leakage.
            </p>
          </div>

          <div style={{ padding: '14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>
              2. Multimodal Vision Pipeline
            </h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Images are submitted via multipart/form-data, validated by file type & size, encoded into base64, and evaluated through Google Gemini multimodal vision with strict JSON schemas.
            </p>
          </div>

          <div style={{ padding: '14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>
              3. Resilient Demo Fallback
            </h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              If no API key is supplied or internet drops, the system seamlessly activates rule-based domain simulators. No dead buttons, no crashes during viva evaluation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
