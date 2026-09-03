import React from 'react';
import { useDisasterData } from '../../context/DisasterDataContext';
import { ArrowRight, MapPin, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import PredictionBadge from '../common/PredictionBadge';

export default function PriorityActionsList() {
  const { setSelectedZoneId } = useDisasterData();

  const actionCards = [
    {
      id: 'act-1',
      title: 'Harangajao Basti',
      category: 'Isolation',
      severity: 'critical',
      status: 'verified',
      location: 'Dima Hasao',
      riskZoneId: 'z1',
      sopTag: 'Helicopter Air-Bridge (SOP-33)',
      metricChips: ['Pop: 1,240', 'NH-27 Blocked (Km 84)', 'Comms: Down'],
      actionLink: '/impact?tab=villages',
      actionLabel: 'Review',
    },
    {
      id: 'act-2',
      title: 'SH-11 Pynursla-Dawki',
      category: 'Road Verify',
      severity: 'high',
      status: 'predicted_unverified',
      location: 'East Khasi Hills',
      riskZoneId: 'z3',
      sopTag: 'PWD Inspection Patrol',
      metricChips: ['InSAR: +2.1mm/h', '2 Villages at cutoff risk'],
      actionLink: '/impact?tab=roads',
      actionLabel: 'Verify',
    },
    {
      id: 'act-3',
      title: 'NH-10 Mangan-Chungthang',
      category: 'Road Blocked',
      severity: 'critical',
      status: 'verified',
      location: 'Mangan',
      riskZoneId: 'z2',
      sopTag: 'Western Bypass Detour',
      metricChips: ['Teesta Surge Breach', 'BRO Earthmovers active'],
      actionLink: '/navigate',
      actionLabel: 'Detour',
    },
    {
      id: 'act-4',
      title: 'Mahur Forest Colony',
      category: 'Evacuation',
      severity: 'critical',
      status: 'verified',
      location: 'Dima Hasao',
      riskZoneId: 'z1',
      sopTag: 'SDRF VHF Repeater & SAR',
      metricChips: ['3 Homes struck', 'Zero cellular signal'],
      actionLink: '/map',
      actionLabel: 'Map View',
    },
    {
      id: 'act-5',
      title: 'NH-29 Dimapur-Kohima Pass',
      category: 'Road Hazard',
      severity: 'high',
      status: 'predicted_unverified',
      location: 'Kohima',
      riskZoneId: 'z5',
      sopTag: 'Single-Lane Pilot Escort',
      metricChips: ['Pagla Pahar Fissure', 'Heavy freight diverted'],
      actionLink: '/impact?tab=roads',
      actionLabel: 'Inspect',
    },
  ];

  return (
    <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#DEE7EB] shadow-xs">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-[#F0F5F8] text-[#5A7F8E] border border-[#DEE7EB]">
            <AlertCircle className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-sm font-semibold text-stone-900">
            Priority Action Queue
          </h3>
        </div>

        <span className="text-[11px] font-mono text-[#5A7F8E] bg-[#F0F5F8] px-2.5 py-0.5 rounded border border-[#DEE7EB] font-medium">
          Severity Sorted
        </span>
      </div>

      <div className="space-y-2.5">
        {actionCards.map((item) => {
          const isCrit = item.severity === 'critical';
          const dotColor = isCrit ? 'bg-[#B5544B]' : 'bg-[#C97D5B]';
          const borderLeft = isCrit ? 'border-l-3 border-l-[#B5544B]' : 'border-l-3 border-l-[#C97D5B]';

          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-lg border border-[#DEE7EB] ${borderLeft} bg-white hover:bg-[#FAFBFB] transition-all duration-150 flex flex-col md:flex-row md:items-center justify-between gap-3`}
            >
              {/* Left Info */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-xs text-stone-900 truncate">
                      {item.title}
                    </span>
                    <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-[#F0F5F8] text-stone-600 border border-[#DEE7EB]">
                      {item.category}
                    </span>
                    <PredictionBadge status={item.status} size="xs" />
                    <span className="text-[11px] text-stone-500 flex items-center gap-1 font-mono">
                      <MapPin className="w-2.5 h-2.5 text-[#5A7F8E]" />
                      {item.location}
                    </span>
                  </div>

                  {/* Scannable Metric Chips */}
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {item.metricChips.map((chip, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100/70 text-stone-700 border border-stone-200"
                      >
                        {chip}
                      </span>
                    ))}
                    <span className="text-[10px] font-medium text-[#5A7F8E] bg-[#E1EDF2]/60 px-2 py-0.5 rounded">
                      {item.sopTag}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0 self-end md:self-center">
                <Link
                  to={item.actionLink}
                  onClick={() => {
                    if (item.riskZoneId) {
                      setSelectedZoneId(item.riskZoneId);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-[#2C4A57] bg-[#F0F5F8] hover:bg-[#E1EDF2] border border-[#DEE7EB] transition-colors"
                >
                  <span>{item.actionLabel}</span>
                  <ArrowRight className="w-3 h-3 text-[#5A7F8E]" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
