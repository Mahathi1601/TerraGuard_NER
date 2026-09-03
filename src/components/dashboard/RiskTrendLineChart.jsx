import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { useDisasterData } from '../../context/DisasterDataContext';
import PredictionBadge from '../common/PredictionBadge';
import { TrendingUp } from 'lucide-react';

export default function RiskTrendLineChart() {
  const { trendData } = useDisasterData();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-[#DEE7EB] p-3 rounded-lg shadow-panel text-xs">
          <div className="text-stone-500 font-mono mb-2 pb-1 border-b border-stone-100">
            Observation Time: {label}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-stone-700">
                <span className="w-2 h-2 rounded-full bg-[#B5544B]" />
                Hazard Risk Index:
              </span>
              <span className="font-mono font-semibold text-stone-900">
                {payload[0]?.value}%
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-stone-700">
                <span className="w-2 h-2 rounded-full bg-[#6B9080]" />
                Cumulative Rainfall:
              </span>
              <span className="font-mono font-semibold text-stone-900">
                {payload[1]?.value} mm
              </span>
            </div>
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
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-semibold text-stone-900">
              24-Hour Regional Risk & Precipitation Trend
            </h3>
          </div>
          <PredictionBadge status="predicted_unverified" size="xs" />
        </div>
        <p className="text-xs text-stone-500">
          Section 20: 06:00 to 18:00+ continuous infiltration tracking & hazard elevation
        </p>
      </div>

      <div className="h-64 w-full my-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 15, right: 15, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F6" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#A4B7C1"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#E2E8ED' }}
            />
            <YAxis
              yAxisId="left"
              stroke="#A4B7C1"
              domain={[20, 100]}
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#E2E8ED' }}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#A4B7C1"
              domain={[0, 220]}
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#E2E8ED' }}
              tickFormatter={(v) => `${v}mm`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              yAxisId="left"
              y={80}
              label={{
                value: 'Critical Threshold (80%)',
                fill: '#9E3B33',
                fontSize: 11,
                position: 'insideTopRight',
              }}
              stroke="#F4D8D5"
              strokeDasharray="4 4"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="avgRisk"
              stroke="#B5544B"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: '#B5544B' }}
              activeDot={{ r: 6 }}
              name="Avg Risk %"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="rainfallMm"
              stroke="#6B9080"
              strokeWidth={2}
              strokeDasharray="4 3"
              dot={{ r: 3, fill: '#6B9080' }}
              name="Rainfall (mm)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & SOP Context footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-100 text-xs text-stone-600">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-0.5 bg-[#B5544B] rounded" />
            <span className="font-medium">Hazard Risk Index (%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-0.5 bg-[#6B9080] rounded border-dashed" />
            <span className="font-medium">Cumulative Rain (mm)</span>
          </div>
        </div>
        <div className="text-[11px] text-[#5A7F8E] font-mono font-medium">
          Telemetry Flux: +48% regional risk surge since 06:00 AM
        </div>
      </div>
    </div>
  );
}
