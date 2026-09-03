import React from 'react';
import { Check, AlertTriangle, ShieldCheck, Ban, Compass } from 'lucide-react';

export default function RouteComparisonCards({
  routes = [],
  selectedRouteId,
  onSelectRoute,
}) {
  return (
    <div className="space-y-3">
      {routes.map((route) => {
        const isSelected = route.id === selectedRouteId;
        const isSafest = route.mode === 'safest';
        const isBalanced = route.mode === 'balanced';
        const isEmergency = route.mode === 'emergency';

        const hours = Math.floor(route.etaMinutes / 60);
        const mins = route.etaMinutes % 60;

        const dotColor = isSafest
          ? 'bg-[#84A98C]'
          : isBalanced
          ? 'bg-[#D8B863]'
          : 'bg-[#B5544B]';

        const accentBorder = isSafest
          ? 'border-l-4 border-l-[#84A98C]'
          : isBalanced
          ? 'border-l-4 border-l-[#D8B863]'
          : 'border-l-4 border-l-[#B5544B]';

        const isBlocked = route.clearanceStatus === 'blocked' || route.maxRiskScore >= 75;
        const isCaution = route.clearanceStatus === 'caution' || (route.maxRiskScore >= 45 && route.maxRiskScore < 75);

        return (
          <div
            key={route.id}
            onClick={() => onSelectRoute(route.id)}
            className={`cursor-pointer p-4 sm:p-5 rounded-xl bg-white border ${accentBorder} transition-all duration-150 shadow-xs ${
              isSelected
                ? 'border-[#5A7F8E] ring-2 ring-[#5A7F8E]/25 bg-[#FAFBFB]'
                : 'border-[#DEE7EB] hover:border-[#CBD9E0] hover:shadow-subtle'
            }`}
          >
            {/* 1. Header with Mode, Recommendation Badge & Safety Score */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-900">
                  <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                  {route.mode === 'safest'
                    ? 'Safest Bypass'
                    : route.mode === 'balanced'
                    ? 'Balanced Corridor'
                    : 'Direct Highway'}
                </span>

                {isSafest && (
                  <span className="text-[10px] bg-[#F6FAF7] text-[#446A4F] px-2 py-0.5 rounded border border-[#DBEADB] font-mono font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#446A4F]" />
                    <span>RECOMMENDED</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-stone-500 font-mono">Safety:</span>
                <span
                  className={`text-xs font-mono font-bold px-1.5 py-0.2 rounded border ${
                    route.safetyScore >= 80
                      ? 'bg-[#F6FAF7] border-[#DBEADB] text-[#446A4F]'
                      : route.safetyScore >= 60
                      ? 'bg-[#FDFBF4] border-[#F6EDD0] text-[#967420]'
                      : 'bg-[#FDF6F5] border-[#F4D8D5] text-[#9E3B33]'
                  }`}
                >
                  {route.safetyScore}/100
                </span>
              </div>
            </div>

            {/* 2. Numbers First: 3-Column Metric Strip */}
            <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#F0F4F6] text-xs my-2.5">
              <div>
                <span className="text-[10px] uppercase font-semibold text-stone-400 block">
                  Distance
                </span>
                <span className="font-mono font-bold text-stone-900 text-sm sm:text-base">
                  {route.distanceKm} km
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-stone-400 block">
                  Est. Transit
                </span>
                <span className="font-mono font-bold text-stone-900 text-sm sm:text-base">
                  {hours > 0 ? `${hours}h ` : ''}{mins}m
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-stone-400 block">
                  Peak Landslide
                </span>
                <span
                  className={`font-mono font-bold text-sm sm:text-base ${
                    route.maxRiskScore >= 80
                      ? 'text-[#B5544B]'
                      : route.maxRiskScore >= 60
                      ? 'text-[#C97D5B]'
                      : 'text-[#446A4F]'
                  }`}
                >
                  {route.maxRiskScore}%
                </span>
              </div>
            </div>

            {/* 3. Route Name & Description */}
            <h4 className="text-xs font-bold text-stone-900 mb-0.5 leading-snug">
              {route.name}
            </h4>
            <p className="text-[11px] text-stone-500 mb-2.5 line-clamp-1">
              {route.summary}
            </p>

            {/* 4. Clearance Status Badge & Threat Details */}
            <div className="space-y-1.5 pt-1 border-t border-[#F0F4F6]">
              <div className="flex items-center justify-between text-xs">
                {/* Clearance Status */}
                {isBlocked ? (
                  <span className="text-[10px] font-bold text-[#9E3B33] bg-[#FDF6F5] px-2 py-0.5 rounded border border-[#F4D8D5] flex items-center gap-1">
                    <Ban className="w-3 h-3 text-[#B5544B]" />
                    <span>HIGH RISK / BLOCKED</span>
                  </span>
                ) : isCaution ? (
                  <span className="text-[10px] font-bold text-[#967420] bg-[#FDFBF4] px-2 py-0.5 rounded border border-[#F6EDD0] flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-[#D8B863]" />
                    <span>CAUTION / CONVOY ONLY</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-[#446A4F] bg-[#F6FAF7] px-2 py-0.5 rounded border border-[#DBEADB] flex items-center gap-1">
                    <Check className="w-3 h-3 text-[#84A98C]" />
                    <span>HAZARD-CLEARED BYPASS</span>
                  </span>
                )}

                <span className="text-[10px] font-mono text-stone-400">
                  {route.intersectedZones?.length > 0
                    ? `${route.intersectedZones.length} Hazard Sector(s)`
                    : '0 Intersections'}
                </span>
              </div>

              {/* Specific Hazard Intersections */}
              {route.intersectedZones && route.intersectedZones.length > 0 ? (
                <div className="text-[10px] font-mono text-[#9E3B33] bg-[#FDF6F5] p-1.5 rounded border border-[#F4D8D5] truncate">
                  ⚠️ Intersects: {route.intersectedZones.map((z) => `${z.name} (${z.risk}%)`).join(', ')}
                </div>
              ) : (
                <div className="text-[10px] font-mono text-[#446A4F] bg-[#F6FAF7] p-1.5 rounded border border-[#DBEADB] flex items-center gap-1">
                  <Compass className="w-3 h-3 text-[#84A98C]" />
                  <span>Steers clear of all active seismic/shear failure zones.</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
