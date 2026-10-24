import React from 'react';

export default function StatCard({ title, value, icon: Icon, color = 'var(--forest-600)', isDemo = false, subtitle = '' }) {
  return (
    <div className="fv-card" style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color,
          flexShrink: 0
        }}
      >
        <Icon size={26} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            {title}
          </span>
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: isDemo ? 'rgba(234, 179, 8, 0.15)' : 'rgba(34, 197, 94, 0.15)',
              color: isDemo ? '#b45309' : '#15803d'
            }}
          >
            {isDemo ? 'DEMO' : 'LIVE'}
          </span>
        </div>

        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
          {value}
        </div>

        {subtitle && (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
