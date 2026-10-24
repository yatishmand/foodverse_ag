import React from 'react';
import { Menu, Sparkles, Database, RefreshCw } from 'lucide-react';

export default function Header({ title, subtitle, onOpenMobileMenu, systemStatus, onRefreshStats }) {
  const isAiActive = systemStatus?.ai_engine?.active;

  return (
    <header className="top-header">
      <div className="header-meta">
        <button
          type="button"
          className="fv-btn fv-btn-secondary"
          style={{ padding: '8px', display: 'flex' }}
          onClick={onOpenMobileMenu}
          id="mobile-menu-trigger-btn"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="header-title-box">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="header-actions">
        {/* Status chip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: isAiActive ? 'rgba(34, 197, 94, 0.12)' : 'rgba(234, 179, 8, 0.12)',
            border: `1px solid ${isAiActive ? 'rgba(34, 197, 94, 0.3)' : 'rgba(234, 179, 8, 0.3)'}`,
            fontSize: '0.8rem',
            fontWeight: 600,
            color: isAiActive ? '#15803d' : '#b45309'
          }}
        >
          <Sparkles size={14} />
          <span>{isAiActive ? 'Multimodal AI Online' : 'Demo Simulation Mode'}</span>
        </div>

        {onRefreshStats && (
          <button
            type="button"
            className="fv-btn fv-btn-secondary"
            style={{ padding: '8px 12px', fontSize: '0.82rem' }}
            onClick={onRefreshStats}
            title="Refresh statistics and activities"
            id="refresh-stats-btn"
          >
            <RefreshCw size={14} />
            <span style={{ display: 'none' }}>Refresh</span>
          </button>
        )}
      </div>
    </header>
  );
}
