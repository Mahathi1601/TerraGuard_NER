import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useDisasterData } from '../../context/DisasterDataContext';
import PredictionBadge from '../common/PredictionBadge';
import { PieChart as PieIcon } from 'lucide-react';

const COLOR_MAP = {
  critical: '#B5544B',
  high: '#C97D5B',
  moderate: '#D8B863',
  low: '#84A98C',
};

const LABEL_MAP = {
  critical: 'Critical (>80%)',
  high: 'High (60–79%)',
  moderate: 'Moderate (40–59%)',
  low: 'Low (<40%)',
};

export default function RiskDistributionPie() {
  const { alertCounts, riskZones } = useDisasterData();

  const data = [
    { name: 'Critical', key: 'critical', value: alertCounts.critical, color: COLOR_MAP.critical },
    { name: 'High', key: 'high', value: alertCounts.high, color: COLOR_MAP.high },
    { name: 'Moderate', key: 'moderate', value: alertCounts.moderate, color: COLOR_MAP.moderate },
    { name: 'Low', key: 'low', value: alertCounts.low, color: COLOR_MAP.low },
  ].filter((item) => item.value > 0);

  const totalZones = riskZones.length;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const percentage = Math.round((item.value / totalZones) * 100);
      return (
        <div className="bg-white border border-[#DEE7EB] p-3 rounded-lg shadow-panel text-xs">
          <div className="flex items-center gap-2 mb-1 font-semibold text-stone-900">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span>{LABEL_MAP[item.key]}</span>
          </div>
          <div className="text-stone-700 font-mono">
            {item.value} Monitored Zones ({percentage}%)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 rounded-xl bg-white border border-[#DEE7EB] shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-[#F0F5F8] text-[#5A7F8E] border border-[#DEE7EB]">
              <PieIcon className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-semibold text-stone-900">
              Risk Level Distribution
            </h3>
          </div>
          <PredictionBadge status="predicted_unverified" size="xs" />
        </div>
        <p className="text-xs text-stone-500">
          Proportion of {totalZones} monitored sectors across the North-East Region
        </p>
      </div>

      <div className="relative h-56 w-full my-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={82}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-semibold font-mono text-stone-900">{totalZones}</span>
          <span className="text-[11px] font-medium text-stone-400 uppercase tracking-wider">
            Total Zones
          </span>
        </div>
      </div>

      {/* Legend strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-stone-100 text-xs">
        {data.map((item) => (
          <div key={item.key} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <div className="truncate">
              <span className="text-stone-700 font-medium">{item.name}</span>
              <span className="text-stone-400 font-mono ml-1.5 font-semibold">({item.value})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
