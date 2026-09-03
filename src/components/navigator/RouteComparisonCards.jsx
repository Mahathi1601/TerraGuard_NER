import React from 'react';
import { Check, AlertTriangle, X } from 'lucide-react';

export default function RouteComparisonCards({
  routes = [],
  selectedRouteId,
  onSelectRoute,
}) {
  return (
    <div className="space-y-3.5">
      {routes.map((route) => {
        const isSelected = route.id === selectedRouteId;
        const isSafest = route.mode === 'safest';
        const isBalanced = route.mode === 'balanced';

        const hours = Math.floor(route.etaMinutes / 60);
        const mins = route.etaMinutes % 60;

        const dotColor = isSafest
          ? 'bg-[#84A98C]'
          : isBalanced
          ? 'bg-[#D8B863]'
          : 'bg-[#B5544B]';

        const accentBorder = isSafest
          ? 'border-l-3 border-l-[#84A98C]'
          : isBalanced
          ? 'border-l-3 border-l-[#D8B863]'
          : 'border-l-3 border-l-[#B5544B]';

        return (
          <div
            key={route.id}
            onClick={() => onSelectRoute(route.id)}
            className={`cursor-pointer p-5 rounded-xl bg-white border ${accentBorder} transition-all duration-150 shadow-xs ${
              isSelected
                ? 'border-[#5A7F8E] ring-2 ring-[#5A7F8E]/20 bg-[#F9FBFC]'
                : 'border-[#DEE7EB] hover:border-[#CBD9E0] hover:shadow-subtle'
            }`}
          >
            {/* 1. Header with Mode & Safety Score */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-900">
                  <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                  {route.mode.charAt(0).toUpperCase() + route.mode.slice(1)} Mode
                </span>

                {isSafest && (
                  <span className="text-[10px] bg-[#F6FAF7] text-[#446A4F] px-2 py-0.2 rounded border border-[#DBEADB] font-mono font-bold">
                    RECOMMENDED
                  </span>
                )}
              </div>

              <span className="text-xs font-mono text-stone-600">
                Safety: <strong className="text-stone-900 font-bold">{route.safetyScore}/100</strong>
              </span>
            </div>

            {/* 2. Numbers First: Distance, Time, Peak Hazard */}
            <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#F0F4F6] text-xs my-2.5">
              <div>
                <span className="text-[10px] uppercase font-semibold text-stone-400 block">Distance</span>
                <span className="font-mono font-bold text-stone-900 text-base">
                  {route.distanceKm} km
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-stone-400 block">ETA</span>
                <span className="font-mono font-bold text-stone-900 text-base">
                  {hours}h {mins}m
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-stone-400 block">Peak Risk</span>
                <span className={`font-mono font-bold text-base ${
                  route.maxRiskScore >= 80 ? 'text-[#B5544B]' : route.maxRiskScore >= 60 ? 'text-[#C97D5B]' : 'text-[#84A98C]'
                }`}>
                  {route.maxRiskScore}%
                </span>
              </div>
            </div>

            {/* 3. Route Name & Short Caption */}
            <h4 className="text-xs font-bold text-stone-900 mb-0.5">
              {route.name}
            </h4>
            <p className="text-[11px] text-stone-500 mb-2 truncate">
              {route.summary}
            </p>

            {/* 4. Closures & Warnings Chips */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              {route.verifiedClosures === 0 ? (
                <span className="text-[10px] font-medium text-[#446A4F] bg-[#F6FAF7] px-2 py-0.5 rounded border border-[#DBEADB] flex items-center gap-1">
                  <Check className="w-3 h-3 text-[#84A98C]" />
                  <span>0 Closures</span>
                </span>
              ) : (
                <span className="text-[10px] font-bold text-[#9E3B33] bg-[#FDF6F5] px-2 py-0.5 rounded border border-[#F4D8D5] flex items-center gap-1">
                  <X className="w-3 h-3" />
                  <span>{route.verifiedClosures} Blocked</span>
                </span>
              )}

              {route.warnings?.slice(0, 1).map((w, idx) => (
                <span key={idx} className="text-[10px] text-stone-700 bg-[#FDFBF4] px-2 py-0.5 rounded border border-[#F6EDD0] truncate max-w-[200px] flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-[#D8B863] shrink-0" />
                  <span className="truncate">{w}</span>
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
