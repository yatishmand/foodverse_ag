import React from 'react';
import { motion } from 'framer-motion';
import {
  ScanLine,
  Apple,
  ChefHat,
  CalendarDays,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Activity,
  Sparkles,
  CheckCircle2,
  Clock
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function Dashboard({ stats, activities, onNavigate, onQuickScan }) {
  const isDemo = !stats?.is_supabase_connected;

  const featureCards = [
    {
      id: 'scanner',
      title: 'AI Food Scanner',
      desc: 'Identify dishes, estimate calories, calculate macronutrients, and analyze portion sizes.',
      icon: ScanLine,
      color: '#2d6a4f',
      tag: 'Multimodal Vision',
      badgeClass: 'badge-fresh'
    },
    {
      id: 'freshness',
      title: 'Freshness Checker',
      desc: 'Inspect produce appearance, detect visible signs of decay, and get safety recommendations.',
      icon: Apple,
      color: '#40916c',
      tag: 'Produce Quality',
      badgeClass: 'badge-fresh'
    },
    {
      id: 'cooking',
      title: 'Smart Cooking Assistant',
      desc: 'Turn on-hand ingredients into step-by-step recipes customized by cuisine, time, and diet.',
      icon: ChefHat,
      color: '#d97706',
      tag: 'Generative Recipes',
      badgeClass: 'badge-warning'
    },
    {
      id: 'nutrition',
      title: 'Nutrition Planner',
      desc: 'Formulate balanced daily meal schedules tailored to dietary goals and calorie targets.',
      icon: CalendarDays,
      color: '#2563eb',
      tag: 'Dietary Intelligence',
      badgeClass: 'badge-neutral'
    },
    {
      id: 'hygiene',
      title: 'Visible Hygiene Monitor',
      desc: 'Review kitchen counters and prep stations for visible sanitation concerns and cross-contamination.',
      icon: ShieldAlert,
      color: '#dc2626',
      tag: 'Sanitation Audit',
      badgeClass: 'badge-neutral'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Hero Welcome Card */}
      <motion.div
        className="fv-hero-card"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div style={{ maxWidth: '780px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: 'var(--radius-pill)',
                background: 'rgba(82, 183, 136, 0.25)',
                color: '#b7efc5',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.04em'
              }}
            >
              <Sparkles size={13} />
              COLLEGE PROJECT MVP • FOOD VERSE AI
            </span>
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '12px', lineHeight: 1.2 }}>
            Smart Food Intelligence Platform
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#d8f3dc', lineHeight: 1.6, marginBottom: '24px' }}>
            Harnessing multimodal artificial intelligence to identify meals, estimate nutrition, assess visible freshness indicators, generate creative recipes from available pantry staples, and inspect preparation hygiene.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="fv-btn"
              style={{ background: '#52b788', color: '#081c15', fontWeight: 700 }}
              onClick={() => onNavigate('scanner')}
              id="hero-scan-now-btn"
            >
              <ScanLine size={18} />
              Scan a Dish Now
            </button>
            <button
              type="button"
              className="fv-btn"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', backdropFilter: 'blur(8px)' }}
              onClick={() => onNavigate('cooking')}
              id="hero-cook-btn"
            >
              <ChefHat size={18} />
              Generate Recipe
            </button>
            <button
              type="button"
              className="fv-btn"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', backdropFilter: 'blur(8px)' }}
              onClick={() => onNavigate('freshness')}
              id="hero-freshness-btn"
            >
              <Apple size={18} />
              Check Produce
            </button>
          </div>
        </div>
      </motion.div>

      {/* Platform Statistics */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>System Platform Analytics</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Usage metrics recorded across all five AI intelligence modules
            </p>
          </div>
          <span
            className="fv-badge"
            style={{
              background: isDemo ? 'rgba(234, 179, 8, 0.12)' : 'rgba(34, 197, 94, 0.12)',
              color: isDemo ? '#b45309' : '#15803d'
            }}
          >
            {isDemo ? '• Demo Simulation Telemetry' : '• Stored Cloud Database'}
          </span>
        </div>

        <div className="fv-grid-4">
          <StatCard
            title="Food Scans Completed"
            value={stats?.food_scans_count || 18}
            icon={ScanLine}
            color="var(--forest-600)"
            isDemo={isDemo}
            subtitle="Dishes analyzed for macros"
          />
          <StatCard
            title="Freshness Audits"
            value={stats?.freshness_checks_count || 14}
            icon={Apple}
            color="#40916c"
            isDemo={isDemo}
            subtitle="Produce decay checks"
          />
          <StatCard
            title="Recipes Created"
            value={stats?.recipes_generated_count || 27}
            icon={ChefHat}
            color="#d97706"
            isDemo={isDemo}
            subtitle="Pantry ingredient blends"
          />
          <StatCard
            title="Hygiene Audits"
            value={stats?.hygiene_audits_count || 12}
            icon={ShieldAlert}
            color="#dc2626"
            isDemo={isDemo}
            subtitle="Visual prep area reviews"
          />
        </div>
      </div>

      {/* Five Main Features Grid */}
      <div>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Core AI Modules</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Choose an intelligence module to evaluate live or run realistic viva demonstrations
          </p>
        </div>

        <div className="fv-grid-3">
          {featureCards.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.id}
                className="fv-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                whileHover={{ y: -4, borderColor: 'var(--lime-500)' }}
                onClick={() => onNavigate(feat.id)}
                id={`feature-card-${feat.id}`}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: feat.color
                      }}
                    >
                      <Icon size={24} />
                    </div>
                    <span className={`fv-badge ${feat.badgeClass}`}>
                      {feat.tag}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>
                    {feat.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {feat.desc}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'var(--forest-600)',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    marginTop: '20px'
                  }}
                >
                  <span>Launch Tool</span>
                  <ArrowRight size={16} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="fv-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={20} color="var(--forest-600)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recent Intelligence Activity</h3>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Real-time feed
          </span>
        </div>

        {activities && activities.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activities.map((act) => (
              <div
                key={act.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-light)',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--lime-500)'
                    }}
                  >
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 600, margin: 0 }}>
                      {act.title}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                      {act.summary}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: act.is_demo ? 'rgba(234, 179, 8, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                      color: act.is_demo ? '#b45309' : '#15803d'
                    }}
                  >
                    {act.is_demo ? 'DEMO' : 'LIVE'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} />
                    {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No recent activity logged yet. Start by scanning a food item or generating a recipe!
          </p>
        )}
      </div>
    </div>
  );
}
