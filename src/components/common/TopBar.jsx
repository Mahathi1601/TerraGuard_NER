import React from 'react';
import { useDisasterData } from '../../context/DisasterDataContext';
import { RefreshCw, Clock, Menu, Shield } from 'lucide-react';

export default function TopBar({ onMenuToggle }) {
  const { 
    alertCounts, 
    lastRefreshTime, 
    triggerTelemetryRefresh, 
    isRefreshing, 
    dataQuality,
  } = useDisasterData();

  const formattedTime = new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata',
  }).format(lastRefreshTime);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#E2E8ED] bg-[#FAFAF9]/95 backdrop-blur-sm px-6 py-2.5 shadow-xs">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        
        {/* Left: Mobile toggle & Context Label */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-1.5 rounded-md text-stone-600 hover:text-stone-900 hover:bg-[#EAF1F4]"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#84A98C]" />
            <span className="text-xs font-bold text-stone-900">
              NER Command Grid
            </span>
          </div>
        </div>

        {/* Center: Live Alert Counts */}
        <div className="hidden lg:flex items-center gap-2 bg-white px-3 py-1 rounded-lg border border-[#DEE7EB] shadow-xs">
          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
            Alerts:
          </span>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-bold text-[#9E3B33] bg-[#FDF6F5] border border-[#F4D8D5]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B5544B]" />
            <span>{alertCounts.critical} Crit</span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-bold text-[#B05C38] bg-[#FDF8F5] border border-[#F7DFD4]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C97D5B]" />
            <span>{alertCounts.high} High</span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-bold text-[#967420] bg-[#FDFBF4] border border-[#F6EDD0]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D8B863]" />
            <span>{alertCounts.moderate} Mod</span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-bold text-[#446A4F] bg-[#F6FAF7] border border-[#DBEADB]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#84A98C]" />
            <span>{alertCounts.low} Low</span>
          </div>
        </div>

        {/* Right: Data Quality + Sync Clock + Refresh Button */}
        <div className="flex items-center gap-2.5">
          {/* Section 43: Data Quality Badge */}
          <div 
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#DEE7EB] bg-white shadow-xs text-xs"
            title="Section 43: Telemetry ingestion integrity and confidence"
          >
            <Shield className="w-3.5 h-3.5 text-[#5A7F8E]" />
            <span className="font-mono font-bold text-stone-900">{dataQuality.score}%</span>
            <span className="text-[10px] text-[#446A4F] bg-[#F6FAF7] px-1.5 py-0.2 rounded border border-[#DBEADB] font-medium">
              Verified
            </span>
          </div>

          {/* Sync Time */}
          <div className="flex items-center gap-1.5 px-2 py-1 text-xs text-stone-500 font-mono">
            <Clock className="w-3 h-3 text-stone-400" />
            <span>{formattedTime}</span>
          </div>

          {/* Refresh Action Trigger */}
          <button
            onClick={triggerTelemetryRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5A7F8E] hover:bg-[#466674] text-white text-xs font-semibold transition-all shadow-xs disabled:opacity-50"
            title="Refresh InSAR telemetry stream"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

      </div>
    </header>
  );
}
