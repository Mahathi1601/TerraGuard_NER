import { API_CONFIG } from './apiConfig';
import mockRiskZones from '../data/riskZones.json';
import mockVillages from '../data/villages.json';
import mockRoads from '../data/roads.json';
import mockEmergencies from '../data/emergencies.json';

/**
 * Service to fetch disaster data either from real FastAPI backend
 * or seamlessly fallback to local seed data if backend is offline.
 */
export const DisasterApiService = {
  async getRiskZones() {
    if (!API_CONFIG.hasBackend) return mockRiskZones;
    try {
      const res = await fetch(`${API_CONFIG.baseUrl}/risk-zones`);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Backend API unavailable, using local mock data:', err.message);
      return mockRiskZones;
    }
  },

  async getRoads() {
    if (!API_CONFIG.hasBackend) return mockRoads;
    try {
      const res = await fetch(`${API_CONFIG.baseUrl}/roads`);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      return await res.json();
    } catch (err) {
      return mockRoads;
    }
  },

  async getVillages() {
    if (!API_CONFIG.hasBackend) return mockVillages;
    try {
      const res = await fetch(`${API_CONFIG.baseUrl}/villages`);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      return await res.json();
    } catch (err) {
      return mockVillages;
    }
  },

  async submitFieldReport(reportData) {
    if (!API_CONFIG.hasBackend) return { success: true, report: reportData };
    try {
      const res = await fetch(`${API_CONFIG.baseUrl}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
      });
      return await res.json();
    } catch (err) {
      console.warn('Backend POST failed, saved to local state only:', err.message);
      return { success: true, report: reportData };
    }
  },
};

export default DisasterApiService;
