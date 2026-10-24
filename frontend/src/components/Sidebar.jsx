import React from 'react';
import {
  LayoutDashboard,
  ScanLine,
  Apple,
  ChefHat,
  CalendarDays,
  ShieldAlert,
  Settings,
  Sparkles,
  Database,
  Moon,
  Sun,
  X
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  mobileOpen,
  setMobileOpen,
  theme,
  toggleTheme,
  systemStatus
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scanner', label: 'Food Scanner', icon: ScanLine },
    { id: 'freshness', label: 'Freshness Checker', icon: Apple },
    { id: 'cooking', label: 'Cooking Assistant', icon: ChefHat },
    { id: 'nutrition', label: 'Nutrition Planner', icon: CalendarDays },
    { id: 'hygiene', label: 'Hygiene Monitor', icon: ShieldAlert },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelect = (id) => {
    setActiveTab(id);
    if (setMobileOpen) setMobileOpen(false);
  };

  const isAiActive = systemStatus?.ai_engine?.active;
  const isDbActive = systemStatus?.database?.active;

  return (
    <>
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
          id="sidebar-backdrop"
        />
      )}

      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand Logo */}
        <div className="sidebar-logo">
          <div className="logo-badge">
            <Sparkles size={22} />
          </div>
          <div className="logo-text" style={{ flex: 1 }}>
            <h1>Food Verse AI</h1>
            <span>Smart Food Intelligence</span>
          </div>
          {setMobileOpen && (
            <button
              type="button"
              className="fv-btn fv-btn-ghost"
              style={{ display: 'none', padding: '6px' }}
              onClick={() => setMobileOpen(false)}
              id="mobile-close-sidebar-btn"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <div
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleSelect(item.id)}
                id={`nav-${item.id}`}
                role="button"
                tabIndex={0}
              >
                <Icon className="nav-icon" />
                <span>{item.label}</span>
                {isActive && <div className="active-pill" />}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer with Status & Theme Switch */}
        <div className="sidebar-footer">
          {/* AI Engine Status */}
          <div className="system-status-card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>AI Provider</span>
              <div className="status-indicator">
                <span className={`status-dot ${isAiActive ? '' : 'demo'}`} />
                <span style={{ color: 'var(--text-primary)' }}>
                  {isAiActive ? 'Gemini Live' : 'Demo Fallback'}
                </span>
              </div>
            </div>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                color: isAiActive ? '#15803d' : '#b45309',
                backgroundColor: isAiActive ? 'rgba(34,197,94,0.15)' : 'rgba(234,179,8,0.15)',
                padding: '2px 6px',
                borderRadius: '4px'
              }}
            >
              {isAiActive ? 'READY' : 'ACTIVE'}
            </span>
          </div>

          {/* Database Status */}
          <div className="system-status-card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Database</span>
              <div className="status-indicator">
                <span className={`status-dot ${isDbActive ? '' : 'demo'}`} />
                <span style={{ color: 'var(--text-primary)' }}>
                  {isDbActive ? 'Supabase' : 'Local Memory'}
                </span>
              </div>
            </div>
            <Database size={15} color="var(--text-muted)" />
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            className="fv-btn fv-btn-secondary"
            onClick={toggleTheme}
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
            id="theme-toggle-btn"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span>{theme === 'dark' ? 'Warm Cream Mode' : 'Deep Forest Dark'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
