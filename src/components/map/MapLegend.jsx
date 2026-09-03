import React from 'react';

export default function MapLegend({ selectedFilter, onFilterChange }) {
  const levels = [
    { key: 'all', label: 'All Zones', color: '#7C9BA6' },
    { key: 'critical', label: 'Critical (>80%)', color: '#B5544B' },
    { key: 'high', label: 'High (60–79%)', color: '#C97D5B' },
    { key: 'moderate', label: 'Moderate (40–59%)', color: '#D8B863' },
    { key: 'low', label: 'Low (<40%)', color: '#84A98C' },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-sm border border-[#DEE7EB] p-4 rounded-xl shadow-panel text-xs space-y-2.5 max-w-xs text-stone-800">
      <div className="flex items-center justify-between pb-2 border-b border-[#F0F4F6]">
        <span className="text-xs font-semibold text-stone-900">
          Risk Classification
        </span>
        <span className="text-[10px] font-mono text-[#5A7F8E] font-medium bg-[#F0F5F8] px-1.5 py-0.5 rounded">ISRO / GSI</span>
      </div>

      <div className="space-y-1">
        {levels.map((lvl) => (
          <button
            key={lvl.key}
            onClick={() => onFilterChange(lvl.key)}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors ${
              selectedFilter === lvl.key
                ? 'bg-[#E1EDF2] font-semibold text-[#1C2930]'
                : 'text-stone-600 hover:text-stone-900 hover:bg-[#F2F6F8]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: lvl.color }}
              />
              <span className="text-xs">{lvl.label}</span>
            </div>
            {selectedFilter === lvl.key && (
              <span className="text-[10px] text-[#5A7F8E] font-mono font-medium">Active</span>
            )}
          </button>
        ))}
      </div>

      <div className="pt-2.5 border-t border-[#F0F4F6] space-y-1.5 text-[11px] text-stone-600">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-0.5 bg-[#84A98C] rounded" />
          <span>Road: Passable</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-0.5 bg-[#D8B863] rounded border-dashed" />
          <span>Road: Verify Required</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-0.5 bg-[#B5544B] rounded" />
          <span>Road: Blocked</span>
        </div>
      </div>
    </div>
  );
}
