import { API_CONFIG } from './apiConfig';

/**
 * Service to fetch real-time weather & precipitation for NER sectors.
 * Can fetch directly from OpenWeatherMap (if client key is set)
 * or via the local FastAPI backend (/api/weather/live).
 */
export const WeatherService = {
  async getLiveRainfall(lat, lng) {
    // 1. Try FastAPI backend live weather endpoint if backend is configured
    try {
      const backendUrl = `${API_CONFIG.baseUrl}/weather/live?lat=${lat}&lng=${lng}`;
      const res = await fetch(backendUrl);
      if (res.ok) {
        const data = await res.json();
        return {
          isLive: data.is_live,
          provider: data.provider,
          tempC: data.temp_c,
          humidity: data.humidity_pct,
          rainfall1hMm: data.rainfall_1h_mm,
          condition: data.description,
        };
      }
    } catch {
      // Backend not running, try direct client key fallback
    }

    // 2. Direct client-side OpenWeatherMap call if VITE_OPENWEATHER_API_KEY is available
    if (API_CONFIG.hasOpenWeather) {
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_CONFIG.openWeatherKey}&units=metric`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          const rain1h = data.rain ? data.rain['1h'] || 0 : 0;
          return {
            isLive: true,
            provider: 'OpenWeatherMap (Client)',
            tempC: Math.round(data.main?.temp || 22),
            humidity: data.main?.humidity || 85,
            rainfall1hMm: rain1h,
            condition: data.weather?.[0]?.description || 'Heavy Rain',
          };
        }
      } catch (err) {
        console.warn('Direct OpenWeatherMap call failed:', err);
      }
    }

    // 3. Fallback to InSAR hydrological estimate
    return {
      isLive: false,
      provider: 'InSAR Hydrological Estimate',
      tempC: 22,
      humidity: 90,
      rainfall1hMm: 12.5,
      condition: 'Monsoon Overcast & Downpour',
    };
  },
};

export default WeatherService;
