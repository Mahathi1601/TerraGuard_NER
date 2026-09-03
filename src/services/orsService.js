import { API_CONFIG } from './apiConfig';

/**
 * Service to calculate live road routes and bypasses using OpenRouteService.
 */
export const OrsService = {
  async calculateDirections(originCoords, destCoords) {
    // 1. Try FastAPI backend proxy first
    try {
      const res = await fetch(`${API_CONFIG.baseUrl}/routing/directions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: originCoords,
          destination: destCoords,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.is_live) return data;
      }
    } catch {
      // Backend offline, fallback to direct client
    }

    // 2. Direct client call if VITE_ORS_API_KEY is present
    if (API_CONFIG.hasOrs) {
      try {
        const url = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': API_CONFIG.orsKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            coordinates: [originCoords, destCoords],
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const feature = data.features[0];
          const summary = feature.properties.summary;
          const coordsLeaflet = feature.geometry.coordinates.map((c) => [c[1], c[0]]);
          return {
            isLive: true,
            provider: 'OpenRouteService (Live)',
            distanceKm: Math.round(summary.distance / 100) / 10,
            etaMinutes: Math.round(summary.duration / 60),
            coordinates: coordsLeaflet,
          };
        }
      } catch (err) {
        console.warn('Direct ORS routing call failed:', err);
      }
    }

    return { isLive: false, provider: 'Precomputed Corridor' };
  },
};

export default OrsService;
