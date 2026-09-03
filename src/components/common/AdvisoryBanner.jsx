import React from 'react';

export default function AdvisoryBanner({
  advisory,
  level = 'critical',
  subtext,
  actionButton,
  className = '',
}) {
  const styles = {
    critical: {
      bg: 'bg-[#FDF6F5]',
      border: 'border-[#F4D8D5]',
      leftBorder: 'border-l-4 border-l-[#B5544B]',
      dotColor: 'bg-[#B5544B]',
      badgeBg: 'bg-[#B5544B]/10 text-[#9E3B33] border-[#F4D8D5]',
      title: 'Critical Advisory',
    },
    high: {
      bg: 'bg-[#FDF8F5]',
      border: 'border-[#F7DFD4]',
      leftBorder: 'border-l-4 border-l-[#C97D5B]',
      dotColor: 'bg-[#C97D5B]',
      badgeBg: 'bg-[#C97D5B]/10 text-[#B05C38] border-[#F7DFD4]',
      title: 'High Hazard',
    },
    moderate: {
      bg: 'bg-[#FDFBF4]',
      border: 'border-[#F6EDD0]',
      leftBorder: 'border-l-4 border-l-[#D8B863]',
      dotColor: 'bg-[#D8B863]',
      badgeBg: 'bg-[#D8B863]/10 text-[#967420] border-[#F6EDD0]',
      title: 'Moderate',
    },
    low: {
      bg: 'bg-[#F6FAF7]',
      border: 'border-[#DBEADB]',
      leftBorder: 'border-l-4 border-l-[#84A98C]',
      dotColor: 'bg-[#84A98C]',
      badgeBg: 'bg-[#84A98C]/10 text-[#446A4F] border-[#DBEADB]',
      title: 'Baseline',
    },
  }[level] || {
    bg: 'bg-white',
    border: 'border-stone-200',
    leftBorder: 'border-l-4 border-l-[#5A7F8E]',
    dotColor: 'bg-[#5A7F8E]',
    badgeBg: 'bg-[#5A7F8E]/10 text-[#5A7F8E] border-stone-200',
    title: 'Advisory',
  };

  return (
    <div
      className={`rounded-xl ${styles.bg} border ${styles.border} ${styles.leftBorder} px-5 py-3.5 transition-all shadow-xs ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded border shrink-0 ${styles.badgeBg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${styles.dotColor}`} />
            {styles.title}
          </span>
          <p className="text-xs sm:text-[13px] text-stone-800 font-medium truncate">
            {advisory}
          </p>
        </div>

        {actionButton && (
          <div className="shrink-0">
            {actionButton}
          </div>
        )}
      </div>
    </div>
  );
}
