import React, { useState } from 'react';
import { useDisasterData } from '../context/DisasterDataContext';
import NavigatorMap from '../components/navigator/NavigatorMap';
import RouteComparisonCards from '../components/navigator/RouteComparisonCards';

export default function NavigatorPage() {
  const { navRoutes } = useDisasterData();

  const [selectedPairId, setSelectedPairId] = useState('pair-1');
  const activePair = navRoutes.find((p) => p.routeId === selectedPairId) || navRoutes[0];

  const [activeMode, setActiveMode] = useState('all');
  const [selectedRouteId, setSelectedRouteId] = useState(activePair.routes[0].id);

  const handlePairChange = (pairId) => {
    setSelectedPairId(pairId);
    const pair = navRoutes.find((p) => p.routeId === pairId);
    if (pair && pair.routes.length > 0) {
      setSelectedRouteId(pair.routes[0].id);
    }
  };

  const displayedRoutes =
    activeMode === 'all'
      ? activePair.routes
      : activePair.routes.filter((r) => r.mode === activeMode);

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header (Minimal & Scannable) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#DEE7EB]">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Hazard-Avoidance Navigator
          </h1>
          <span className="text-xs font-semibold text-[#5A7F8E] bg-[#E1EDF2] px-2.5 py-0.5 rounded-md">
            Multi-Criteria Routing
          </span>
        </div>

        {/* Corridor Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-medium">Corridor:</span>
          <select
            value={selectedPairId}
            onChange={(e) => handlePairChange(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-white border border-[#DEE7EB] text-xs text-stone-900 font-medium focus:outline-none focus:border-[#5A7F8E] shadow-xs"
          >
            <option value="pair-1">Guwahati Depot ➔ Haflong Hospital (Assam)</option>
            <option value="pair-2">Gangtok Base ➔ Mangan Hospital (Sikkim)</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Controls & Comparisons (Left) + Map (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Route Controls & Comparison Cards */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Waypoints & Modes Card */}
          <div className="p-5 rounded-xl bg-white border border-[#DEE7EB] shadow-xs space-y-3.5">
            {/* Waypoints */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#FAFBFB] border border-[#E8EFF2]">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-stone-400" />
                  <span className="text-[10px] uppercase font-bold text-stone-400">Origin</span>
                </div>
                <div className="font-semibold text-stone-900 text-xs truncate">
                  {activePair.origin.name}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#FAFBFB] border border-[#E8EFF2]">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#84A98C]" />
                  <span className="text-[10px] uppercase font-bold text-stone-400">Dest</span>
                </div>
                <div className="font-semibold text-stone-900 text-xs truncate">
                  {activePair.destination.name}
                </div>
              </div>
            </div>

            {/* Mode Switcher Buttons */}
            <div>
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

          {/* Route Comparison Cards */}
          <div className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#5A7F8E]">
              Route Options
            </h2>

            <RouteComparisonCards
              routes={displayedRoutes}
              selectedRouteId={selectedRouteId}
              onSelectRoute={(id) => setSelectedRouteId(id)}
            />
          </div>

        </div>

        {/* Right Side: Map Displaying Highlighted Selected Route */}
        <div className="lg:col-span-7 h-[680px] sticky top-20 space-y-2.5">
          <NavigatorMap
            origin={activePair.origin}
            destination={activePair.destination}
            routes={activePair.routes}
            selectedRouteId={selectedRouteId}
            onSelectRoute={(id) => setSelectedRouteId(id)}
          />

          <div className="p-3 rounded-xl bg-white border border-[#DEE7EB] shadow-xs flex items-center justify-between text-xs text-stone-600">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-1 bg-[#84A98C] rounded" />
                <span className="font-bold text-stone-800">Selected Path</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-1 bg-stone-400 rounded border-dashed" />
                <span>Alternates</span>
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#5A7F8E] font-bold">
              Dynamic Hazard Clearance
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
