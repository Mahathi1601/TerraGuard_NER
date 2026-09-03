// Centralized Environment & API Configuration
export const API_CONFIG = {
  // FastAPI + PostGIS Backend
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  hasBackend: Boolean(import.meta.env.VITE_API_BASE_URL),

  // Live Weather Telemetry (OpenWeatherMap)
  openWeatherKey: import.meta.env.VITE_OPENWEATHER_API_KEY || '',
  hasOpenWeather: Boolean(import.meta.env.VITE_OPENWEATHER_API_KEY),

  // Satellite Basemaps (Mapbox)
  mapboxToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '',
  hasMapbox: Boolean(import.meta.env.VITE_MAPBOX_ACCESS_TOKEN),

  // Live Routing Engine (OpenRouteService)
  orsKey: import.meta.env.VITE_ORS_API_KEY || '',
  hasOrs: Boolean(import.meta.env.VITE_ORS_API_KEY),

  // AI Incident Analysis & Advisory Generator (Google Gemini)
  geminiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  hasGemini: Boolean(import.meta.env.VITE_GEMINI_API_KEY),
};

export default API_CONFIG;
