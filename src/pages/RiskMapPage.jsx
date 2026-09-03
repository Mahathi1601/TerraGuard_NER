import React, { useState } from 'react';
import { useDisasterData } from '../context/DisasterDataContext';
import LandslideMap from '../components/map/LandslideMap';
import LayerControls from '../components/map/LayerControls';
import MapLegend from '../components/map/MapLegend';
import ZoneDetailsDrawer from '../components/map/ZoneDetailsDrawer';
import { Eye, Filter } from 'lucide-react';

export default function RiskMapPage() {
  const {
    riskZones,
    roads,
    villages,
    hospitals,
    fieldReports,
    selectedZone,
    setSelectedZoneId,
  } = useDisasterData();

  const [layers, setLayers] = useState({
    zones: true,
    roads: true,
    villages: true,
    hospitals: true,
    reports: true,
  });

  const [selectedFilter, setSelectedFilter] = useState('all');
  const [basemap, setBasemap] = useState('light');
  const [showDrawer, setShowDrawer] = useState(true);

  const layerCounts = {
    zones: riskZones.length,
    roads: roads.length,
    villages: villages.length,
    hospitals: hospitals.length,
    reports: fieldReports.length,
  };

  const handleSelectZone = (zone) => {
    setSelectedZoneId(zone.id);
    setShowDrawer(true);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Top Header & Focus Bar (Short & Scannable) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#DEE7EB]">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Spatial Risk Map
          </h1>
          <span className="text-xs font-semibold text-[#5A7F8E] bg-[#E1EDF2] px-2.5 py-0.5 rounded-md">
            InSAR Deformation Grid
          </span>
        </div>

        {/* Quick jump to zones */}
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 max-w-full">
          <span className="text-xs text-stone-500 shrink-0 flex items-center gap-1 font-medium">
            <Filter className="w-3.5 h-3.5 text-[#5A7F8E]" />
            Jump:
          </span>
          {riskZones.slice(0, 5).map((z) => (
            <button
              key={z.id}
              onClick={() => handleSelectZone(z)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono shrink-0 transition-all ${
                selectedZone?.id === z.id
                  ? 'bg-[#5A7F8E] text-white font-bold shadow-xs'
                  : 'bg-white hover:bg-[#F0F5F8] text-stone-700 border border-[#DEE7EB]'
              }`}
            >
              {z.name.split(' ')[0]} ({z.risk}%)
            </button>
          ))}
        </div>
      </div>

      {/* Main Map + Side Drawer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[720px] relative items-stretch">
        
        {/* Map Container with breathing room */}
        <div className={`h-full relative rounded-xl transition-all duration-200 ${
          showDrawer ? 'lg:col-span-8' : 'lg:col-span-12'
        }`}>
          <LandslideMap
            riskZones={riskZones}
            roads={roads}
            villages={villages}
            hospitals={hospitals}
            fieldReports={fieldReports}
            layers={layers}
            selectedFilter={selectedFilter}
            selectedZone={selectedZone}
            onSelectZone={handleSelectZone}
            basemap={basemap}
          />

          {/* Docked Top-Right: Layer Controls */}
          <div className="absolute top-5 right-5 z-[1000] hidden sm:block">
            <LayerControls
              layers={layers}
              setLayers={setLayers}
              counts={layerCounts}
              basemap={basemap}
              setBasemap={setBasemap}
            />
          </div>

          {/* Docked Bottom-Left: Map Legend */}
          <div className="absolute bottom-5 left-5 z-[1000] hidden sm:block">
            <MapLegend
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />
          </div>

          {/* Toggle drawer button if closed */}
          {!showDrawer && (
            <button
              onClick={() => setShowDrawer(true)}
              className="absolute top-5 left-5 z-[1000] px-3.5 py-2 rounded-lg bg-white hover:bg-[#F2F6F8] border border-[#DEE7EB] text-xs font-semibold text-stone-900 shadow-panel flex items-center gap-2 transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-[#5A7F8E]" />
              <span>Diagnostic Drawer</span>
            </button>
          )}
        </div>

        {/* Right: Explainability Details Drawer */}
        {showDrawer && (
          <div className="h-full lg:col-span-4 transition-all duration-200">
            <ZoneDetailsDrawer
              zone={selectedZone}
              onClose={() => setShowDrawer(false)}
            />
          </div>
        )}

      </div>

      {/* Mobile layer controls & legend */}
      <div className="sm:hidden grid grid-cols-1 gap-4 pt-2">
        <LayerControls
          layers={layers}
          setLayers={setLayers}
          counts={layerCounts}
          basemap={basemap}
          setBasemap={setBasemap}
        />
        <MapLegend
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />
      </div>
    </div>
  );
}
