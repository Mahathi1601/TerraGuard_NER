import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';
import { useDisasterData } from '../../context/DisasterDataContext';
import PredictionBadge from '../common/PredictionBadge';
import { Users } from 'lucide-react';

const COLOR_MAP = {
  Critical: '#B5544B',
  High: '#C97D5B',
  Moderate: '#D8B863',
  Low: '#84A98C',
};

export default function PopulationImpactBar() {
  const { villages } = useDisasterData();

  const chartData = useMemo(() => {
    const summary = {
      Critical: { level: 'Critical', population: 0, villagesCount: 0, color: COLOR_MAP.Critical },
      High: { level: 'High', population: 0, villagesCount: 0, color: COLOR_MAP.High },
      Moderate: { level: 'Moderate', population: 0, villagesCount: 0, color: COLOR_MAP.Moderate },
      Low: { level: 'Low', population: 0, villagesCount: 0, color: COLOR_MAP.Low },
    };

    villages.forEach((v) => {
      const key =
        v.priority === 'critical'
          ? 'Critical'
          : v.priority === 'high'
          ? 'High'
          : v.priority === 'moderate'
          ? 'Moderate'
          : 'Low';

      if (summary[key]) {
        summary[key].population += v.population;
        summary[key].villagesCount += 1;
      }
    });

    return Object.values(summary);
  }, [villages]);

  const totalPop = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.population, 0);
  }, [chartData]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white border border-[#DEE7EB] p-3 rounded-lg shadow-panel text-xs">
          <div className="flex items-center gap-2 mb-1 font-semibold text-stone-900">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span>{item.level} Risk Settlements</span>
          </div>
          <div className="text-stone-800 font-mono">
            {item.population.toLocaleString()} Residents ({item.villagesCount} villages)
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
              <Users className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-semibold text-stone-900">
              Population Impact by Risk Level
            </h3>
          </div>
          <PredictionBadge status="predicted_unverified" size="xs" />
        </div>
        <p className="text-xs text-stone-500">
          Estimated population in hazard corridors: <span className="text-stone-900 font-mono font-medium">{totalPop.toLocaleString()}</span> residents
        </p>
      </div>

      <div className="h-56 w-full my-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 15, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F6" vertical={false} />
            <XAxis
              dataKey="level"
              stroke="#A4B7C1"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#E2E8ED' }}
            />
            <YAxis
              stroke="#A4B7C1"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#E2E8ED' }}
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v)}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F5F8FA' }} />
            <Bar dataKey="population" radius={[5, 5, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`bar-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-4 gap-3 pt-4 border-t border-stone-100 text-center text-xs">
        {chartData.map((item) => (
          <div key={item.level} className="py-1 bg-[#F9FBFC] rounded-lg border border-[#EAF0F4]">
            <span className="text-[11px] text-stone-500 block font-medium">{item.level}</span>
            <span className="text-xs font-mono font-semibold text-stone-900 mt-0.5 block">
              {item.population.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
