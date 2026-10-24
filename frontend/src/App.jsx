import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import FoodScanner from './pages/FoodScanner';
import FreshnessChecker from './pages/FreshnessChecker';
import CookingAssistant from './pages/CookingAssistant';
import NutritionPlanner from './pages/NutritionPlanner';
import HygieneMonitor from './pages/HygieneMonitor';
import Settings from './pages/Settings';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('fv_theme') || 'dark';
  });

  const [stats, setStats] = useState({
    food_scans_count: 18,
    freshness_checks_count: 14,
    recipes_generated_count: 27,
    nutrition_plans_count: 9,
    hygiene_audits_count: 12,
    is_supabase_connected: false
  });

  const [activities, setActivities] = useState([]);
  const [systemStatus, setSystemStatus] = useState({
    ai_engine: { active: false, mode: 'Demo Simulation' },
    database: { active: false, mode: 'Local Memory' }
  });

  // Theme synchronization
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('fv_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Fetch initial telemetry
  const loadPlatformData = async () => {
    try {
      const [statsData, actData, sysData] = await Promise.all([
        api.getStats(),
        api.getActivities(6),
        api.getSystemStatus()
      ]);
      if (statsData) setStats(statsData);
      if (actData && Array.isArray(actData)) setActivities(actData);
      if (sysData) setSystemStatus(sysData);
    } catch (err) {
      console.warn('Failed loading platform telemetry:', err);
    }
  };

  useEffect(() => {
    loadPlatformData();
  }, []);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'Executive Intelligence Dashboard', subtitle: 'Food Verse AI — Autonomous Culinary & Nutritional Analytics' };
      case 'scanner':
        return { title: 'AI Food Scanner', subtitle: 'Ingredient identification, portion sizing, and estimated macronutrients' };
      case 'freshness':
        return { title: 'Freshness Checker', subtitle: 'Visible produce quality grading and evidence-based deterioration detection' };
      case 'cooking':
        return { title: 'Smart Cooking Assistant', subtitle: 'Pantry ingredient synthesis into step-by-step custom recipes' };
      case 'nutrition':
        return { title: 'Nutrition Planner', subtitle: 'Personalized daily macro distribution and balanced meal schedules' };
      case 'hygiene':
        return { title: 'Visible Hygiene Monitor', subtitle: 'Sanitation screening and contamination risk audit of food prep stations' };
      case 'settings':
        return { title: 'Platform Diagnostics & Settings', subtitle: 'Backend health, model toggles, and viva presentation documentation' };
      default:
        return { title: 'Food Verse AI', subtitle: 'Smart Food Intelligence Platform' };
    }
  };

  const { title, subtitle } = getPageTitle();

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        theme={theme}
        toggleTheme={toggleTheme}
        systemStatus={systemStatus}
      />

      {/* Main Content Viewport */}
      <div className="main-viewport">
        <Header
          title={title}
          subtitle={subtitle}
          onOpenMobileMenu={() => setMobileOpen(true)}
          systemStatus={systemStatus}
          onRefreshStats={loadPlatformData}
        />

        <main className="content-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
            >
              {activeTab === 'dashboard' && (
                <Dashboard
                  stats={stats}
                  activities={activities}
                  onNavigate={(tab) => setActiveTab(tab)}
                  onQuickScan={() => setActiveTab('scanner')}
                />
              )}

              {activeTab === 'scanner' && (
                <FoodScanner onActivityLogged={loadPlatformData} />
              )}

              {activeTab === 'freshness' && (
                <FreshnessChecker onActivityLogged={loadPlatformData} />
              )}

              {activeTab === 'cooking' && (
                <CookingAssistant onActivityLogged={loadPlatformData} />
              )}

              {activeTab === 'nutrition' && (
                <NutritionPlanner onActivityLogged={loadPlatformData} />
              )}

              {activeTab === 'hygiene' && (
                <HygieneMonitor onActivityLogged={loadPlatformData} />
              )}

              {activeTab === 'settings' && (
                <Settings
                  theme={theme}
                  toggleTheme={toggleTheme}
                  systemStatus={systemStatus}
                  onRefreshStats={loadPlatformData}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
