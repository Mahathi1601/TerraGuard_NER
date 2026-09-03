import React, { useState, useMemo, useEffect } from 'react';
import { useDisasterData } from '../context/DisasterDataContext';
import NavigatorMap from '../components/navigator/NavigatorMap';
import RouteComparisonCards from '../components/navigator/RouteComparisonCards';
import { NAVIGATOR_LOCATIONS, NAVIGATOR_PRESETS } from '../data/navigatorLocations';
import { generateDynamicRoutes } from '../utils/routeRiskAnalyzer';
import { OrsService } from '../services/orsService';
import { ArrowLeftRight, Compass, ShieldAlert, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';

export default function NavigatorPage() {
  const { riskZones, roads } = useDisasterData();

  // Origin & Destination state
  const [originId, setOriginId] = useState('loc-ghy-depot');
  const [destinationId, setDestinationId] = useState('loc-haflong-hosp');
  const [activeMode, setActiveMode] = useState('all');
  const [selectedRouteId, setSelectedRouteId] = useState('rt-safest');
  const [isCalculating, setIsCalculating] = useState(false);

  // Selected Origin & Destination objects
  const origin = useMemo(() => {
    return NAVIGATOR_LOCATIONS.find((l) => l.id === originId) || NAVIGATOR_LOCATIONS[0];
  }, [originId]);

  const destination = useMemo(() => {
    return NAVIGATOR_LOCATIONS.find((l) => l.id === destinationId) || NAVIGATOR_LOCATIONS[5];
  }, [destinationId]);

  // Compute multi-mode routes dynamically based on chosen origin & destination
  const [routes, setRoutes] = useState(() => {
    return generateDynamicRoutes(origin, destination, riskZones, roads);
  });

  // Re-generate routes whenever origin, destination, riskZones, or roads change
  useEffect(() => {
    setIsCalculating(true);
    const dynamicRoutes = generateDynamicRoutes(origin, destination, riskZones, roads);

    // Optionally augment with live OpenRouteService calculation if available
    OrsService.calculateDirections(
      [origin.lng, origin.lat],
      [destination.lng, destination.lat]
    ).then((orsResult) => {
      if (orsResult?.isLive && orsResult.coordinates?.length > 0) {
        // Update direct route with live road geometry
        dynamicRoutes[2] = {
          ...dynamicRoutes[2],
          distanceKm: orsResult.distanceKm,
          etaMinutes: orsResult.etaMinutes,
          coordinates: orsResult.coordinates,
          summary: 'Live highway network calculation via OpenRouteService.',
        };
      }
      setRoutes(dynamicRoutes);
      setSelectedRouteId(dynamicRoutes[0]?.id || 'rt-safest');
      setIsCalculating(false);
    });
  }, [origin, destination, riskZones, roads]);

  // 1-Click Swap Origin & Destination
  const handleSwapLocations = () => {
    const temp = originId;
    setOriginId(destinationId);
    setDestinationId(temp);
  };

  // Quick Preset Selection
  const handleSelectPreset = (preset) => {
    setOriginId(preset.originId);
    setDestinationId(preset.destId);
  };

  // Filter routes by mode
  const displayedRoutes = useMemo(() => {
    if (activeMode === 'all') return routes;
    return routes.filter((r) => r.mode === activeMode);
  }, [routes, activeMode]);

  const activeSelectedRoute = useMemo(() => {
    return routes.find((r) => r.id === selectedRouteId) || routes[0];
  }, [routes, selectedRouteId]);

  // Categorize locations for clean dropdown groups
  const categorizedLocations = useMemo(() => {
    return {
      depots: NAVIGATOR_LOCATIONS.filter((l) => l.type === 'depot' || l.type === 'hub'),
      hospitals: NAVIGATOR_LOCATIONS.filter((l) => l.type === 'hospital'),
      villages: NAVIGATOR_LOCATIONS.filter((l) => l.type === 'village'),
    };
  }, []);

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DEE7EB]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              Hazard-Avoidance Navigator
            </h1>
            <span className="text-xs font-semibold text-[#5A7F8E] bg-[#E1EDF2] px-2.5 py-0.5 rounded-md">
              Multi-Criteria Risk Routing
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Dynamic mountain route planning with real-time landslide shear and debris-flow avoidance.
          </p>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
          <span className="w-2 h-2 rounded-full bg-[#84A98C]" />
          <span>Active GSI & Telemetry Matrix</span>
        </div>
      </div>

      {/* Main Grid: Controls & Route Options (Left) + Map (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Location Selector & Route Cards */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* 1. Interactive Location Selector Card */}
          <div className="p-5 rounded-xl bg-white border border-[#DEE7EB] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-[#5A7F8E] tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>Select Relief Corridor</span>
              </span>

              <button
                onClick={handleSwapLocations}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-stone-600 bg-[#F0F5F8] hover:bg-[#E1EDF2] hover:text-stone-900 transition-colors shadow-2xs"
                title="Swap departure and target locations"
              >
                <ArrowLeftRight className="w-3 h-3 text-[#5A7F8E]" />
                <span>Swap</span>
              </button>
            </div>

            {/* Origin & Destination Pickers */}
            <div className="space-y-3">
              {/* Origin Dropdown */}
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#5A7F8E]" />
                  <span>Departure Point (Origin)</span>
                </label>
                <select
                  value={originId}
                  onChange={(e) => setOriginId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#DEE7EB] text-xs text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#5A7F8E]/30 focus:border-[#5A7F8E] shadow-xs"
                >
                  <optgroup label="Relief Depots & Command HQs">
                    {categorizedLocations.depots.map((loc) => (
                      <option key={`orig-${loc.id}`} value={loc.id} disabled={loc.id === destinationId}>
                        {loc.name} ({loc.district})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="District & Referral Hospitals">
                    {categorizedLocations.hospitals.map((loc) => (
                      <option key={`orig-${loc.id}`} value={loc.id} disabled={loc.id === destinationId}>
                        {loc.name} ({loc.district})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Vulnerable Settlements & Villages">
                    {categorizedLocations.villages.map((loc) => (
                      <option key={`orig-${loc.id}`} value={loc.id} disabled={loc.id === destinationId}>
                        {loc.name} ({loc.district})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Destination Dropdown */}
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#446A4F]" />
                  <span>Target Destination</span>
                </label>
                <select
                  value={destinationId}
                  onChange={(e) => setDestinationId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#DEE7EB] text-xs text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#5A7F8E]/30 focus:border-[#5A7F8E] shadow-xs"
                >
                  <optgroup label="District & Referral Hospitals">
                    {categorizedLocations.hospitals.map((loc) => (
                      <option key={`dest-${loc.id}`} value={loc.id} disabled={loc.id === originId}>
                        {loc.name} ({loc.district})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Vulnerable Settlements & Villages">
                    {categorizedLocations.villages.map((loc) => (
                      <option key={`dest-${loc.id}`} value={loc.id} disabled={loc.id === originId}>
                        {loc.name} ({loc.district})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Relief Depots & Command HQs">
                    {categorizedLocations.depots.map((loc) => (
                      <option key={`dest-${loc.id}`} value={loc.id} disabled={loc.id === originId}>
                        {loc.name} ({loc.district})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Quick Preset Corridors */}
            <div className="pt-2 border-t border-[#F0F4F6]">
              <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1.5 tracking-wider">
                Quick Preset Corridors:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {NAVIGATOR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-[#FAFBFB] hover:bg-[#F0F5F8] text-stone-700 border border-[#DEE7EB] transition-colors shadow-2xs"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode Switcher Filter */}
            <div className="pt-2 border-t border-[#F0F4F6]">
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { key: 'all', label: 'All Modes' },
                  { key: 'safest', label: 'Safest' },
                  { key: 'balanced', label: 'Balanced' },
                  { key: 'emergency', label: 'Direct' },
                ].map((mode) => (
                  <button
                    key={mode.key}
                    onClick={() => setActiveMode(mode.key)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-all ${
                      activeMode === mode.key
                        ? 'bg-[#5A7F8E] text-white shadow-xs'
                        : 'bg-[#F0F5F8] text-stone-600 hover:bg-[#E1EDF2]'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Route Comparison Cards */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#5A7F8E]">
                Calculated Corridors ({displayedRoutes.length})
              </h2>
              {isCalculating && (
                <span className="text-[11px] text-[#5A7F8E] font-mono animate-pulse">
                  Analyzing road topography...
                </span>
              )}
            </div>

            <RouteComparisonCards
              routes={displayedRoutes}
              selectedRouteId={selectedRouteId}
              onSelectRoute={(id) => setSelectedRouteId(id)}
            />
          </div>

          {/* 3. Detailed Landslide Risk Breakdown of Selected Path */}
          {activeSelectedRoute && (
            <div className="p-4 sm:p-5 rounded-xl bg-white border border-[#DEE7EB] shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0F4F6]">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#5A7F8E]" />
                  <h3 className="text-xs font-bold text-stone-900">
                    Selected Path Hazard Analysis
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-stone-700">
                  {activeSelectedRoute.name}
                </span>
              </div>

              {/* Dynamic Assessment Points */}
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2 text-stone-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#84A98C] shrink-0 mt-0.5" />
                  <span>
                    <strong>Transit Clearance:</strong> {activeSelectedRoute.clearanceLabel || 'Cleared'} (Safety Score: {activeSelectedRoute.safetyScore}/100)
                  </span>
                </div>

                <div className="flex items-start gap-2 text-stone-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5A7F8E] shrink-0 mt-1.5 ml-1" />
                  <span>
                    <strong>Threat Evaluation:</strong> {activeSelectedRoute.threatSummary}
                  </span>
                </div>

                {activeSelectedRoute.warnings?.map((warn, i) => (
                  <div key={i} className="flex items-start gap-2 text-stone-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D8B863] shrink-0 mt-1.5 ml-1" />
                    <span>{warn}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Sticky Map */}
        <div className="lg:col-span-7 h-[700px] sticky top-20 space-y-2.5">
          <NavigatorMap
            origin={origin}
            destination={destination}
            routes={routes}
            riskZones={riskZones}
            selectedRouteId={selectedRouteId}
            onSelectRoute={(id) => setSelectedRouteId(id)}
          />

          {/* Map Legend & Operational Clearance Summary */}
          <div className="p-3 rounded-xl bg-white border border-[#DEE7EB] shadow-xs flex items-center justify-between text-xs text-stone-600 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-[#446A4F] rounded" />
                <span className="font-bold text-stone-800">Safest Bypass</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-[#C97D5B] rounded" />
                <span>Balanced</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-[#B5544B] rounded" />
                <span>Direct Highway</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full border border-dashed border-[#B5544B] bg-[#B5544B]/20" />
                <span className="text-[11px] font-mono text-stone-500">Active Hazard Zones</span>
              </span>
              <span className="text-[11px] font-mono font-bold text-[#5A7F8E]">
                OpenGIS Routing Engine
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
