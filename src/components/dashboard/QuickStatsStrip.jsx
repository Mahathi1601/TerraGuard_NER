import React from 'react';
import { useDisasterData } from '../../context/DisasterDataContext';
import { ChevronRight, AlertTriangle, ShieldAlert, Hospital, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function QuickStatsStrip() {
  const { quickStats } = useDisasterData();

  const items = [
    {
      label: 'Corridors Requiring Review',
      value: quickStats.roadsRequiringAttention,
      dot: 'bg-[#C97D5B]',
      icon: AlertTriangle,
      iconBg: 'bg-[#FDF8F5] text-[#C97D5B] border-[#F7DFD4]',
      to: '/impact?tab=roads',
      detail: `${quickStats.totalRoads} monitored corridors`,
    },
    {
      label: 'Isolated Settlements',
      value: quickStats.isolatedVillages,
      dot: 'bg-[#B5544B]',
      icon: ShieldAlert,
      iconBg: 'bg-[#FDF6F5] text-[#B5544B] border-[#F4D8D5]',
      to: '/impact?tab=villages',
      detail: `${quickStats.atRiskVillages} additional at-risk`,
    },
    {
      label: 'Hospitals in Slide Perimeter',
      value: quickStats.hospitalsAtRisk,
      dot: 'bg-[#5A7F8E]',
      icon: Hospital,
      iconBg: 'bg-[#F0F5F8] text-[#5A7F8E] border-[#DEE7EB]',
      to: '/map',
      detail: 'Helipad air-bridges active',
    },
    {
      label: 'Active Field Emergencies',
      value: quickStats.activeEmergencies,
      dot: 'bg-[#B5544B]',
      icon: AlertCircle,
      iconBg: 'bg-[#FDF6F5] text-[#B5544B] border-[#F4D8D5]',
      to: '/reports',
      detail: 'Ground patrols deployed',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <Link
            key={idx}
            to={item.to}
            className="group flex items-center justify-between p-5 rounded-xl bg-white border border-[#DEE7EB] hover:border-[#CBD9E0] hover:shadow-subtle transition-all duration-150"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className={`p-2.5 rounded-lg border ${item.iconBg} shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="truncate">
                <span className="text-xs text-stone-500 font-medium truncate block">
                  {item.label}
                </span>
                <div className="text-2xl font-mono font-semibold text-stone-900 leading-tight mt-0.5">
                  {item.value}
                </div>
                <span className="text-[11px] text-stone-400 truncate block mt-0.5">
                  {item.detail}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-[#5A7F8E] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </Link>
        );
      })}
    </div>
  );
}
