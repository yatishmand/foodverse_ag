// Food Verse AI - Adaptive API Service Connector

let resolvedApiUrl = import.meta.env.VITE_API_URL || null;

async function getBaseUrl() {
  if (resolvedApiUrl) return resolvedApiUrl;

  // 1. In production on Vercel or under `vercel dev`, requests to /api route through same-origin rewrite
  try {
    const sameOriginRes = await fetch('/api/health', { signal: AbortSignal.timeout(1000) });
    if (sameOriginRes.ok) {
      resolvedApiUrl = '';
      return resolvedApiUrl;
    }
  } catch {
    // Not on same-origin rewrite, fallback to standalone local servers
  }

  // 2. Auto-detect whether standalone backend is on port 8000 or 8001
  const candidatePorts = [8000, 8001];
  for (const port of candidatePorts) {
    try {
      const res = await fetch(`http://localhost:${port}/api/health`, { signal: AbortSignal.timeout(1000) });
      if (res.ok) {
        resolvedApiUrl = `http://localhost:${port}`;
        return resolvedApiUrl;
      }
    } catch {
      // try next port
    }
  }

  // Fallback default
  resolvedApiUrl = 'http://localhost:8001';
  return resolvedApiUrl;
}

async function handleResponse(response) {
  if (!response.ok) {
    let errorMsg = `Server error (${response.status})`;
    try {
      const errorData = await response.json();
      errorMsg = errorData.detail || errorData.message || errorMsg;
    } catch {
      // Ignore json parse error
    }
    throw new Error(errorMsg);
  }
  return response.json();
}

export const api = {
  // Health & System
  async checkHealth() {
    try {
      const base = await getBaseUrl();
      const res = await fetch(`${base}/api/health`);
      return await handleResponse(res);
    } catch (err) {
      console.warn("API health check failed, backend may be offline:", err.message);
      return { status: "offline", error: err.message };
    }
  },

  async getStats() {
    try {
      const base = await getBaseUrl();
      const res = await fetch(`${base}/api/stats`);
      return await handleResponse(res);
    } catch (err) {
      console.warn("Failed fetching live stats, using fallback cache:", err.message);
      return {
        food_scans_count: 18,
        freshness_checks_count: 14,
        recipes_generated_count: 27,
        nutrition_plans_count: 9,
        hygiene_audits_count: 12,
        is_supabase_connected: false,
        database_mode: "Demo In-Memory Mode"
      };
    }
  },

  async getActivities(limit = 10) {
    try {
      const base = await getBaseUrl();
      const res = await fetch(`${base}/api/activities?limit=${limit}`);
      return await handleResponse(res);
    } catch (err) {
      console.warn("Failed fetching activities:", err.message);
      return [];
    }
  },

  async getSystemStatus() {
    try {
      const base = await getBaseUrl();
      const res = await fetch(`${base}/api/system-status`);
      return await handleResponse(res);
    } catch (err) {
      return {
        ai_engine: { provider: "Google Gemini Multimodal AI", active: false, mode: "Demo Simulation Fallback" },
        database: { provider: "Supabase Cloud Database", active: false, mode: "Local Memory Mode" }
      };
    }
  },

  // Feature 1: AI Food Scanner
  async analyzeFood(file) {
    const base = await getBaseUrl();
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${base}/api/food/analyze`, {
      method: 'POST',
      body: formData,
    });
    return await handleResponse(res);
  },

  // Feature 2: Freshness Checker
  async analyzeFreshness(file) {
    const base = await getBaseUrl();
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${base}/api/freshness/analyze`, {
      method: 'POST',
      body: formData,
    });
    return await handleResponse(res);
  },

  // Feature 3: Smart Cooking Assistant
  async generateRecipe(data) {
    const base = await getBaseUrl();
    const res = await fetch(`${base}/api/recipes/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  },

  // Feature 4: Nutrition Planner
  async createNutritionPlan(data) {
    const base = await getBaseUrl();
    const res = await fetch(`${base}/api/nutrition/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  },

  // Feature 5: Hygiene Monitor
  async analyzeHygiene(file) {
    const base = await getBaseUrl();
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${base}/api/hygiene/analyze`, {
      method: 'POST',
      body: formData,
    });
    return await handleResponse(res);
  }
};
