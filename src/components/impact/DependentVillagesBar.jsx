import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';
import { useDisasterData } from '../../context/DisasterDataContext';
import { Network } from 'lucide-react';

export default function DependentVillagesBar() {
  const { roads } = useDisasterData();

  const data = roads.map((r) => ({
    id: r.id,
    name: r.routeCode || r.name.slice(0, 10),
    fullName: r.name,
    count: r.dependentVillageIds?.length || 0,
    status: r.status,
    color:
      r.status === 'verified_blocked'
        ? '#B5544B'
        : r.status === 'verification_required'
        ? '#D8B863'
        : '#84A98C',
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white border border-[#DEE7EB] p-3 rounded-lg shadow-panel text-xs">
          <div className="font-semibold text-stone-900 mb-1">{item.fullName}</div>
          <div className="font-mono text-stone-800">
            {item.count} Dependent Settlements Reliant
          </div>
          <div className="text-stone-500 capitalize text-[11px] mt-0.5">
            Status: {item.status.replace('_', ' ')}
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
            <div className="p-1 rounded bg-[#F0F5F8] text-[#5A7F8E] border border-[#DEE7EB]">
              <Network className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-semibold text-stone-900">
              Villages Dependent per Road Corridor
            </h3>
          </div>
          <span className="text-[11px] text-[#5A7F8E] font-mono bg-[#F0F5F8] px-2.5 py-0.5 rounded border border-[#DEE7EB] font-medium">
            Section 26 Bottlenecks
          </span>
        </div>
        <p className="text-xs text-stone-500">
          Identifies critical connectivity lifelines where a single slope failure isolates communities
        </p>
      </div>

      <div className="h-56 w-full my-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 15, right: 15, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F6" vertical={false} />
            <XAxis
              dataKey="name"
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
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[5, 5, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`bar-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-stone-100 text-xs text-stone-600">
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#B5544B]" />
          <span className="font-medium">Blocked Corridor</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D8B863]" />
          <span className="font-medium">Verification Required</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#84A98C]" />
          <span className="font-medium">Passable</span>
        </span>
      </div>
    </div>
  );
}
