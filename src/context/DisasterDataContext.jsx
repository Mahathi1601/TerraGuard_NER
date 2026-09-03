import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import initialRiskZones from '../data/riskZones.json';
import initialVillages from '../data/villages.json';
import initialRoads from '../data/roads.json';
import initialEmergencies from '../data/emergencies.json';
import initialHospitals from '../data/hospitals.json';
import initialFieldReports from '../data/fieldReports.json';
import initialTrendData from '../data/trendData.json';
import initialNavRoutes from '../data/navigationRoutes.json';
import { DisasterApiService } from '../services/backendService';
import { WeatherService } from '../services/weatherService';
import { AiService } from '../services/aiService';
import { API_CONFIG } from '../services/apiConfig';

const DisasterDataContext = createContext(null);

export function DisasterDataProvider({ children }) {
  const [riskZones, setRiskZones] = useState(initialRiskZones);
  const [villages, setVillages] = useState(initialVillages);
  const [roads, setRoads] = useState(initialRoads);
  const [emergencies, setEmergencies] = useState(initialEmergencies);
  const [hospitals, setHospitals] = useState(initialHospitals);
  const [fieldReports, setFieldReports] = useState(initialFieldReports);
  const [trendData, setTrendData] = useState(initialTrendData);
  const [navRoutes] = useState(initialNavRoutes);
  
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date());
  const [selectedZoneId, setSelectedZoneId] = useState('z1');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Backend connection state
  const [backendStatus, setBackendStatus] = useState('checking'); // 'online' | 'standalone_mock'
  const [integrations, setIntegrations] = useState({
    openweather_live: API_CONFIG.hasOpenWeather,
    gemini_ai_live: API_CONFIG.hasGemini,
    ors_routing_live: API_CONFIG.hasOrs,
  });

  // Check backend connectivity on mount
  useEffect(() => {
    async function checkBackend() {
      try {
        const res = await fetch(`${API_CONFIG.baseUrl}/health`);
        if (res.ok) {
          const data = await res.json();
          setBackendStatus('online');
          if (data.integrations) {
            setIntegrations({
              openweather_live: Boolean(data.integrations.openweather_live || API_CONFIG.hasOpenWeather),
              gemini_ai_live: Boolean(data.integrations.gemini_ai_live || API_CONFIG.hasGemini),
              ors_routing_live: Boolean(data.integrations.ors_routing_live || API_CONFIG.hasOrs),
            });
          }

          // Ingest live data from backend if available
          const [bz, br, bv] = await Promise.all([
            DisasterApiService.getRiskZones(),
            DisasterApiService.getRoads(),
            DisasterApiService.getVillages(),
          ]);
          if (bz?.length) setRiskZones(bz);
          if (br?.length) setRoads(br);
          if (bv?.length) setVillages(bv);
        } else {
          setBackendStatus('standalone_mock');
        }
      } catch {
        setBackendStatus('standalone_mock');
      }
    }
    checkBackend();
  }, []);

  // Compute alert level counts across risk zones
  const alertCounts = useMemo(() => {
    const counts = { critical: 0, high: 0, moderate: 0, low: 0 };
    riskZones.forEach((z) => {
      if (counts[z.level] !== undefined) {
        counts[z.level] += 1;
      }
    });
    return counts;
  }, [riskZones]);

  // Quick stats for dashboard header strip
  const quickStats = useMemo(() => {
    const roadsRequiringAttention = roads.filter(
      (r) => r.status === 'verification_required' || r.status === 'verified_blocked'
    ).length;

    const isolatedVillages = villages.filter(
      (v) => v.isolationStatus === 'isolated'
    ).length;

    const atRiskVillages = villages.filter(
      (v) => v.isolationStatus === 'at_risk'
    ).length;

    const hospitalsAtRisk = 2; // Haflong & Mangan Civil Hospitals near active blocks

    const activeEmergencies = emergencies.filter(
      (e) => e.status !== 'resolved'
    ).length;

    return {
      roadsRequiringAttention,
      isolatedVillages,
      atRiskVillages,
      hospitalsAtRisk,
      activeEmergencies,
      totalVillages: villages.length,
      totalRoads: roads.length,
      totalReports: fieldReports.length,
    };
  }, [roads, villages, emergencies, fieldReports]);

  // Selected Zone object
  const selectedZone = useMemo(() => {
    return riskZones.find((z) => z.id === selectedZoneId) || riskZones[0];
  }, [riskZones, selectedZoneId]);

  // Action: update road status (with backend sync)
  const verifyRoadStatus = useCallback(async (roadId, newStatus) => {
    // Optimistic local update
    setRoads((prevRoads) =>
      prevRoads.map((road) => {
        if (road.id === roadId) {
          return {
            ...road,
            status: newStatus,
            verificationBadge: 'verified',
            lastVerifiedAt: 'Just now by Duty Officer',
          };
        }
        return road;
      })
    );

    // Sync to backend if online
    if (backendStatus === 'online') {
      try {
        await fetch(`${API_CONFIG.baseUrl}/roads/${roadId}/verify`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });
      } catch (err) {
        console.warn('Backend road sync failed:', err);
      }
    }
  }, [backendStatus]);

  // Action: add a new field report (with backend sync)
  const addFieldReport = useCallback(async (newReport) => {
    const reportWithMeta = {
      id: `fr-${Date.now()}`,
      timestamp: 'Just now',
      verificationBadge: 'predicted_unverified',
      status: 'pending_verification',
      ...newReport,
    };
    setFieldReports((prev) => [reportWithMeta, ...prev]);

    // If report is critical, auto create an emergency alert entry
    if (newReport.severity === 'critical') {
      const newEmergency = {
        id: `e-${Date.now()}`,
        villageId: 'v-dynamic',
        villageName: newReport.location || 'Reported Location',
        district: newReport.district || 'NER Sector',
        type: newReport.incidentType || 'incident_alert',
        title: newReport.description?.slice(0, 60) || 'Urgent Field Incident',
        severity: 'critical',
        peopleAffected: 5,
        status: 'unresolved',
        timestamp: 'Just now',
        contactFrequency: 'Field telemetry',
        actionRecommended: 'Recommended: deploy assessment unit per Field Incident SOP',
        predictionBadge: 'predicted_unverified',
      };
      setEmergencies((prev) => [newEmergency, ...prev]);
    }

    // Sync to backend if online
    if (backendStatus === 'online') {
      try {
        await DisasterApiService.submitFieldReport(newReport);
      } catch (err) {
        console.warn('Backend report sync failed:', err);
      }
    }
  }, [backendStatus]);

  // Action: verify an existing field report
  const verifyReport = useCallback((reportId) => {
    setFieldReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? { ...r, status: 'verified', verificationBadge: 'verified' }
          : r
      )
    );
  }, []);

  // Action: simulate manual or live telemetry refresh
  const triggerTelemetryRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastRefreshTime(new Date());
      setRiskZones((prev) =>
        prev.map((zone) => {
          if (zone.level === 'critical') {
            const slightRain = zone.rainfall24h + Math.floor(Math.random() * 3);
            return { ...zone, rainfall24h: slightRain, lastTelemetry: 'Just now' };
          }
          return { ...zone, lastTelemetry: 'Just now' };
        })
      );
      setIsRefreshing(false);
    }, 600);
  }, []);

  // Action: generate live AI SOP advisory via Gemini
  const generateAiSopAdvisory = useCallback(async (zoneParams) => {
    return await AiService.generateSopAdvisory(zoneParams);
  }, []);

  // Action: fetch live weather via OpenWeatherMap
  const fetchLiveWeather = useCallback(async (lat, lng) => {
    return await WeatherService.getLiveRainfall(lat, lng);
  }, []);

  // Action: dynamically pin a newly analyzed custom risk zone onto the live map session
  const addCustomRiskZone = useCallback((newZone) => {
    setRiskZones((prev) => [newZone, ...prev]);
    setSelectedZoneId(newZone.id);
  }, []);

  const value = {
    riskZones,
    addCustomRiskZone,
    villages,
    roads,
    emergencies,
    hospitals,
    fieldReports,
    trendData,
    navRoutes,
    alertCounts,
    quickStats,
    selectedZone,
    selectedZoneId,
    setSelectedZoneId,
    verifyRoadStatus,
    addFieldReport,
    verifyReport,
    triggerTelemetryRefresh,
    isRefreshing,
    lastRefreshTime,
    backendStatus,
    integrations,
    generateAiSopAdvisory,
    fetchLiveWeather,
    dataQuality: {
      score: backendStatus === 'online' ? 98 : 96,
      label: backendStatus === 'online' ? 'Live API (98% Active)' : 'Good (96% Telemetry Active)',
      status: 'nominal',
      activeSensors: 142,
      totalSensors: 148,
      lastSync: backendStatus === 'online' ? 'FastAPI :8000 Stream' : 'Local Sensor Simulator',
    },
  };

  return (
    <DisasterDataContext.Provider value={value}>
      {children}
    </DisasterDataContext.Provider>
  );
}

export function useDisasterData() {
  const context = useContext(DisasterDataContext);
  if (!context) {
    throw new Error('useDisasterData must be used within a DisasterDataProvider');
  }
  return context;
}
