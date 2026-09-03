import React from 'react';

const LEVEL_CONFIG = {
  critical: {
    label: 'Critical Hazard',
    threshold: '> 80%',
    bg: 'bg-[#FDF6F5]',
    border: 'border-[#F4D8D5]',
    dot: 'bg-[#B5544B]',
    textColor: 'text-[#9E3B33]',
    accentBar: 'border-l-3 border-l-[#B5544B]',
  },
  high: {
    label: 'High Hazard',
    threshold: '60–79%',
    bg: 'bg-[#FDF8F5]',
    border: 'border-[#F7DFD4]',
    dot: 'bg-[#C97D5B]',
    textColor: 'text-[#B05C38]',
    accentBar: 'border-l-3 border-l-[#C97D5B]',
  },
  moderate: {
    label: 'Moderate Watch',
    threshold: '40–59%',
    bg: 'bg-[#FDFBF4]',
    border: 'border-[#F6EDD0]',
    dot: 'bg-[#D8B863]',
    textColor: 'text-[#967420]',
    accentBar: 'border-l-3 border-l-[#D8B863]',
  },
  low: {
    label: 'Nominal',
    threshold: '< 40%',
    bg: 'bg-[#F6FAF7]',
    border: 'border-[#DBEADB]',
    dot: 'bg-[#84A98C]',
    textColor: 'text-[#446A4F]',
    accentBar: 'border-l-3 border-l-[#84A98C]',
  },
};

export default function StatCard({
  level = 'critical',
  count = 0,
  subtext,
  onClick,
  active = false,
}) {
  const config = LEVEL_CONFIG[level] || LEVEL_CONFIG.critical;

  return (
    <div
      onClick={onClick}
      className={`rounded-xl ${config.bg} border ${config.border} ${config.accentBar} p-5 sm:p-6 transition-all cursor-pointer hover:shadow-subtle ${
        active ? 'ring-2 ring-[#5A7F8E]/40' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${config.dot}`} />
          <span className="text-xs font-semibold text-stone-800 tracking-tight">
            {config.label}
          </span>
        </div>
        <span className="text-[11px] font-mono font-semibold text-stone-600 bg-white/80 px-2 py-0.5 rounded border border-stone-200/60">
          {config.threshold}
        </span>
      </div>

      <div className="my-1.5">
        <div className={`text-4xl font-mono font-bold tracking-tight ${config.textColor}`}>
          {count}
        </div>
      </div>

      <div className="text-[11px] text-stone-500 font-medium truncate mt-2">
        {subtext || 'Monitored clusters'}
      </div>
    </div>
  );
}
