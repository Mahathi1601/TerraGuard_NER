import React from 'react';
import { Layers } from 'lucide-react';

export default function LayerControls({
  layers,
  setLayers,
  counts,
  basemap,
  setBasemap,
}) {
  const toggleLayer = (layerKey) => {
    setLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const layerItems = [
    { key: 'zones', label: 'Risk Zones', count: counts.zones },
    { key: 'roads', label: 'Road Corridors', count: counts.roads },
    { key: 'villages', label: 'Settlements', count: counts.villages },
    { key: 'hospitals', label: 'Base Hospitals', count: counts.hospitals },
    { key: 'reports', label: 'Field Reports', count: counts.reports },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-sm border border-[#DEE7EB] p-4 rounded-xl shadow-panel text-xs space-y-3 w-64 text-stone-800">
      <div className="flex items-center justify-between pb-2 border-b border-[#F0F4F6]">
        <span className="text-xs font-semibold text-stone-900 flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-[#5A7F8E]" />
          Spatial GIS Layers
        </span>
      </div>

      {/* Layer Toggles */}
      <div className="space-y-1">
        {layerItems.map((item) => {
          const isChecked = layers[item.key];
          return (
            <button
              key={item.key}
              onClick={() => toggleLayer(item.key)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors ${
                isChecked
                  ? 'bg-[#E1EDF2] text-[#1C2930] font-semibold'
                  : 'text-stone-500 hover:text-stone-800 hover:bg-[#F2F6F8]'
              }`}
            >
              <span className="text-xs">{item.label}</span>
              <span className="text-[10px] font-mono text-[#5A7F8E] font-medium bg-white/70 px-1.5 py-0.5 rounded border border-stone-200/50">
                {item.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Basemap switcher */}
      <div className="pt-2.5 border-t border-[#F0F4F6]">
        <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
          Basemap Style
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => setBasemap('light')}
            className={`px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
              basemap === 'light'
                ? 'bg-[#5A7F8E] text-white shadow-xs'
                : 'bg-[#F0F5F8] text-stone-600 hover:bg-[#E1EDF2]'
            }`}
          >
            Topographic
          </button>
          <button
            onClick={() => setBasemap('satellite')}
            className={`px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
              basemap === 'satellite'
                ? 'bg-[#5A7F8E] text-white shadow-xs'
                : 'bg-[#F0F5F8] text-stone-600 hover:bg-[#E1EDF2]'
            }`}
          >
            Satellite (Free)
          </button>
          <button
            onClick={() => setBasemap('topo')}
            className={`px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
              basemap === 'topo'
                ? 'bg-[#5A7F8E] text-white shadow-xs'
                : 'bg-[#F0F5F8] text-stone-600 hover:bg-[#E1EDF2]'
            }`}
          >
            Topo Relief
          </button>
          <button
            onClick={() => setBasemap('osm')}
            className={`px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
              basemap === 'osm'
                ? 'bg-[#5A7F8E] text-white shadow-xs'
                : 'bg-[#F0F5F8] text-stone-600 hover:bg-[#E1EDF2]'
            }`}
          >
            OpenStreetMap
          </button>
        </div>
      </div>
    </div>
  );
}
