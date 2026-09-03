import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useDisasterData } from '../../context/DisasterDataContext';
import { ShieldAlert } from 'lucide-react';

const STATUS_COLORS = {
  isolated: '#B5544B',
  at_risk: '#C97D5B',
  connected: '#84A98C',
};

const STATUS_LABELS = {
  isolated: 'Isolated (All Roads Blocked)',
  at_risk: 'At Risk (Alternate Access Only)',
  connected: 'Connected (Normal Passability)',
};

export default function IsolationDonut() {
  const { villages } = useDisasterData();

  const counts = {
    isolated: 0,
    at_risk: 0,
    connected: 0,
  };

  const populations = {
    isolated: 0,
    at_risk: 0,
    connected: 0,
  };

  villages.forEach((v) => {
    if (counts[v.isolationStatus] !== undefined) {
      counts[v.isolationStatus] += 1;
      populations[v.isolationStatus] += v.population;
    }
  });

  const data = [
    { key: 'isolated', name: 'Isolated', count: counts.isolated, pop: populations.isolated, color: STATUS_COLORS.isolated },
    { key: 'at_risk', name: 'At Risk', count: counts.at_risk, pop: populations.at_risk, color: STATUS_COLORS.at_risk },
    { key: 'connected', name: 'Connected', count: counts.connected, pop: populations.connected, color: STATUS_COLORS.connected },
  ].filter((d) => d.count > 0);

  const totalVillages = villages.length;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white border border-[#DEE7EB] p-3 rounded-lg shadow-panel text-xs">
          <div className="flex items-center gap-2 mb-1 text-stone-900 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span>{STATUS_LABELS[item.key]}</span>
          </div>
          <div className="text-stone-800 font-mono">
            {item.count} Villages ({Math.round((item.count / totalVillages) * 100)}%)
          </div>
          <div className="text-stone-500 text-[11px] mt-0.5">
            {item.pop.toLocaleString()} Residents
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 rounded-xl bg-white border border-[#DEE7EB] shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-[#FDF6F5] text-[#B5544B] border border-[#F4D8D5]">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-semibold text-stone-900">
              Settlement Isolation Proportion
            </h3>
          </div>
          <span className="text-[11px] text-[#5A7F8E] font-mono bg-[#F0F5F8] px-2.5 py-0.5 rounded border border-[#DEE7EB] font-medium">
            Section 33 Status
          </span>
        </div>
        <p className="text-xs text-stone-500">
          Proportion of monitored settlements by lifeline accessibility and cutoff vulnerability
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
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-semibold font-mono text-stone-900">{counts.isolated}</span>
          <span className="text-[11px] font-medium text-[#B5544B] uppercase tracking-wider">
            Isolated
          </span>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-stone-100 text-center text-xs">
        {data.map((item) => (
          <div key={item.key} className="py-1.5 bg-[#FAFBFB] rounded-lg border border-[#E8EFF2]">
            <span className="text-xs text-stone-500 block font-medium">{item.name}</span>
            <span className="text-xs font-mono font-semibold text-stone-900 block mt-0.5" style={{ color: item.color }}>
              {item.count} ({item.pop.toLocaleString()})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
