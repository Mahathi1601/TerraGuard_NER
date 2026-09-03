import React, { useState } from 'react';
import { useDisasterData } from '../../context/DisasterDataContext';
import { 
  Phone, 
  PhoneOff, 
  Wifi, 
  WifiOff, 
  Radio, 
  Search, 
  MapPin,
  ArrowRight,
  Hospital
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ISOLATION_CONFIG = {
  isolated: {
    label: 'Isolated',
    dot: 'bg-[#B5544B]',
    borderLeft: 'border-l-3 border-l-[#B5544B]',
    badgeBg: 'bg-[#FDF6F5] text-[#9E3B33] border-[#F4D8D5]',
  },
  at_risk: {
    label: 'At Risk',
    dot: 'bg-[#C97D5B]',
    borderLeft: 'border-l-3 border-l-[#C97D5B]',
    badgeBg: 'bg-[#FDF8F5] text-[#B05C38] border-[#F7DFD4]',
  },
  connected: {
    label: 'Connected',
    dot: 'bg-[#84A98C]',
    borderLeft: 'border-l-3 border-l-[#84A98C]',
    badgeBg: 'bg-[#F6FAF7] text-[#446A4F] border-[#DBEADB]',
  },
};

export default function VillageCardGrid() {
  const { villages } = useDisasterData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isolationFilter, setIsolationFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredVillages = villages.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.state.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesIsolation =
      isolationFilter === 'all' || v.isolationStatus === isolationFilter;

    const matchesPriority =
      priorityFilter === 'all' || v.priority === priorityFilter;

    return matchesSearch && matchesIsolation && matchesPriority;
  });

  return (
    <div className="space-y-5">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#7C9BA6] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search settlement, district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 rounded-lg bg-white border border-[#DEE7EB] text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#5A7F8E]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-stone-500 font-medium">Status:</span>
          {['all', 'isolated', 'at_risk', 'connected'].map((st) => (
            <button
              key={st}
              onClick={() => setIsolationFilter(st)}
              className={`px-2.5 py-1 rounded-md text-xs capitalize transition-all ${
                isolationFilter === st
                  ? 'bg-[#5A7F8E] text-white font-semibold shadow-xs'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-[#DEE7EB]'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}

          <span className="text-xs text-stone-500 font-medium ml-2">Priority:</span>
          {['all', 'critical', 'high', 'moderate', 'low'].map((pr) => (
            <button
              key={pr}
              onClick={() => setPriorityFilter(pr)}
              className={`px-2.5 py-1 rounded-md text-xs capitalize transition-all ${
                priorityFilter === pr
                  ? 'bg-[#5A7F8E] text-white font-semibold shadow-xs'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-[#DEE7EB]'
              }`}
            >
              {pr}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Village Cards: Visuals & Numbers First */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVillages.map((village) => {
          const cfg = ISOLATION_CONFIG[village.isolationStatus] || ISOLATION_CONFIG.connected;

          return (
            <div
              key={village.id}
              className={`flex flex-col justify-between p-5 sm:p-6 rounded-xl bg-white border border-[#DEE7EB] ${cfg.borderLeft} shadow-xs hover:border-[#CBD9E0] hover:shadow-subtle transition-all duration-150`}
            >
              <div>
                {/* 1. Header Badges */}
                <div className="flex items-center justify-between mb-2.5">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded-full border ${cfg.badgeBg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>

                  <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-[#F0F5F8] text-stone-600 border border-[#DEE7EB]">
                    {village.priority}
                  </span>
                </div>

                {/* 2. Settlement Name & Location */}
                <h3 className="text-base font-bold text-stone-900 leading-snug">
                  {village.name}
                </h3>
                <div className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#5A7F8E]" />
                  <span>{village.district}, {village.state}</span>
                </div>

                {/* 3. Numbers First: Population & Distance Stat Tiles */}
                <div className="grid grid-cols-2 gap-2.5 my-3.5 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#FAFBFB] border border-[#E8EFF2]">
                    <span className="text-[10px] uppercase font-semibold text-stone-400 block">Population</span>
                    <span className="font-mono font-bold text-stone-900 text-lg block mt-0.5">
                      {village.population.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#FAFBFB] border border-[#E8EFF2]">
                    <span className="text-[10px] uppercase font-semibold text-stone-400 block">Hospital Dist</span>
                    <span className="font-mono font-bold text-stone-900 text-lg block mt-0.5">
                      {village.nearestHospitalKm} km
                    </span>
                  </div>
                </div>

                {/* 4. Comms Status Badges */}
                <div className="grid grid-cols-3 gap-1.5 text-center text-xs mb-3">
                  <div className={`p-1.5 rounded-md border flex items-center justify-center gap-1 ${
                    village.mobile ? 'bg-[#F6FAF7] border-[#DBEADB] text-[#446A4F]' : 'bg-[#FDF6F5] border-[#F4D8D5] text-[#9E3B33]'
                  }`}>
                    {village.mobile ? <Phone className="w-3 h-3" /> : <PhoneOff className="w-3 h-3" />}
                    <span className="text-[10px] font-medium">{village.mobile ? 'Cell' : 'No Cell'}</span>
                  </div>

                  <div className={`p-1.5 rounded-md border flex items-center justify-center gap-1 ${
                    village.internet ? 'bg-[#F6FAF7] border-[#DBEADB] text-[#446A4F]' : 'bg-[#FDF6F5] border-[#F4D8D5] text-[#9E3B33]'
                  }`}>
                    {village.internet ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                    <span className="text-[10px] font-medium">{village.internet ? 'Net' : 'No Net'}</span>
                  </div>

                  <div className={`p-1.5 rounded-md border flex items-center justify-center gap-1 ${
                    village.radio ? 'bg-[#F6FAF7] border-[#DBEADB] text-[#446A4F]' : 'bg-[#FDF6F5] border-[#F4D8D5] text-[#9E3B33]'
                  }`}>
                    <Radio className="w-3 h-3" />
                    <span className="text-[10px] font-medium">{village.radio ? 'VHF' : 'No Radio'}</span>
                  </div>
                </div>

                {/* 5. Road Status 1-liner */}
                <div className="text-[11px] text-stone-600 bg-[#F8FAFC] px-2.5 py-1.5 rounded-md border border-[#E8EFF2] flex items-center justify-between mb-3">
                  <span>Main: <strong className="capitalize text-stone-800">{village.mainRoadStatus.replace('_', ' ')}</strong></span>
                  <span className="text-stone-400">·</span>
                  <span>Alt: <strong className="text-stone-800">{village.altRoadAvailable ? 'Available' : 'None'}</strong></span>
                </div>
              </div>

              {/* 6. Action Button */}
              <div className="pt-2 border-t border-stone-100">
                <Link
                  to="/navigate"
                  className="w-full py-1.5 px-3 rounded-lg bg-[#F0F5F8] hover:bg-[#E1EDF2] text-[#2C4A57] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Hospital className="w-3 h-3 text-[#5A7F8E]" />
                  <span>Route to {village.nearestHospitalName.split(' ')[0]}</span>
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
