import React, { useState } from 'react';
import { useDisasterData } from '../../context/DisasterDataContext';
import PredictionBadge from '../common/PredictionBadge';
import { Search, MapPin, Clock, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RoadsTable() {
  const { roads, riskZones, villages, verifyRoadStatus, setSelectedZoneId } = useDisasterData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredRoads = roads.filter((road) => {
    const matchesSearch =
      road.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      road.routeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      road.district.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || road.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getNearbyRiskZone = (riskZoneId) => {
    return riskZones.find((z) => z.id === riskZoneId);
  };

  const getDependentVillages = (villageIds = []) => {
    return villages.filter((v) => villageIds.includes(v.id));
  };

  return (
    <div className="space-y-4">
      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#7C9BA6] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter corridors, routes, districts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-white border border-[#DEE7EB] text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#5A7F8E]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs text-stone-500 shrink-0 mr-1 font-medium">Status:</span>
          {[
            { key: 'all', label: 'All Roads' },
            { key: 'verified_blocked', label: 'Blocked' },
            { key: 'verification_required', label: 'Verify Required' },
            { key: 'open', label: 'Passable' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === tab.key
                  ? 'bg-[#5A7F8E] text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-[#DEE7EB]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Roads Table */}
      <div className="overflow-x-auto rounded-xl border border-[#DEE7EB] bg-white shadow-xs">
        <table className="w-full text-left text-xs text-stone-700">
          <thead className="bg-[#FAFBFB] text-stone-600 uppercase tracking-wider text-[10px] font-semibold border-b border-[#DEE7EB]">
            <tr>
              <th className="py-3 px-4">Corridor & Route</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Nearby Hazard</th>
              <th className="py-3 px-4">Dependent Settlements</th>
              <th className="py-3 px-4">Verification</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F4F6]">
            {filteredRoads.map((road) => {
              const zone = getNearbyRiskZone(road.riskZoneId);
              const depVillages = getDependentVillages(road.dependentVillageIds);
              const isBlocked = road.status === 'verified_blocked';
              const isVerify = road.status === 'verification_required';

              return (
                <tr key={road.id} className="hover:bg-[#FAFBFB] transition-colors">
                  {/* Name & Route */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#F0F5F8] text-[#2C4A57] border border-[#DEE7EB]">
                        {road.routeCode}
                      </span>
                      <div>
                        <div className="font-semibold text-stone-900 text-xs">
                          {road.name}
                        </div>
                        <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#5A7F8E]" />
                          <span>{road.district}, {road.state} ({road.lengthKm} km)</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-medium"
                      style={{
                        backgroundColor: isBlocked ? '#FDF6F5' : isVerify ? '#FDFBF4' : '#F6FAF7',
                        borderColor: isBlocked ? '#F4D8D5' : isVerify ? '#F6EDD0' : '#DBEADB',
                        color: isBlocked ? '#9E3B33' : isVerify ? '#967420' : '#446A4F',
                      }}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isBlocked
                            ? 'bg-[#B5544B]'
                            : isVerify
                            ? 'bg-[#D8B863]'
                            : 'bg-[#84A98C]'
                        }`}
                      />
                      <span>
                        {road.status === 'open' ? 'Passable' : road.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500 mt-1 max-w-xs truncate" title={road.blockedReason}>
                      {road.blockedReason}
                    </div>
                  </td>

                  {/* Hazard proximity */}
                  <td className="py-3.5 px-4">
                    {zone ? (
                      <div>
                        <span className="font-mono font-semibold text-xs text-stone-900">
                          {zone.risk}% Hazard
                        </span>
                        <div className="text-[11px] text-stone-500 truncate max-w-[150px]">
                          {zone.name}
                        </div>
                      </div>
                    ) : (
                      <span className="text-stone-400">None detected</span>
                    )}
                  </td>

                  {/* Dependent villages */}
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-xs text-stone-900 font-semibold">
                      {depVillages.length} settlements
                    </div>
                    <div className="text-[10px] text-stone-500 flex flex-wrap gap-1 mt-1 max-w-[200px]">
                      {depVillages.map((v) => (
                        <span
                          key={v.id}
                          className="px-1.5 py-0.2 rounded text-[10px] bg-[#F0F5F8] text-stone-700 border border-[#DEE7EB]"
                        >
                          {v.name.split(' ')[0]}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Verification badge */}
                  <td className="py-3.5 px-4">
                    <PredictionBadge status={road.verificationBadge} size="xs" />
                    <div className="text-[10px] text-stone-400 font-mono mt-1 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 text-stone-400" />
                      <span>{road.lastVerifiedAt}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {isVerify ? (
                        <>
                          <button
                            onClick={() => verifyRoadStatus(road.id, 'verified_blocked')}
                            className="px-2.5 py-1 rounded-md bg-white hover:bg-[#FDF6F5] border border-[#F4D8D5] text-[#9E3B33] text-xs font-semibold transition-colors"
                          >
                            Mark Blocked
                          </button>
                          <button
                            onClick={() => verifyRoadStatus(road.id, 'open')}
                            className="px-2.5 py-1 rounded-md bg-[#5A7F8E] hover:bg-[#466674] text-white text-xs font-semibold transition-colors shadow-xs"
                          >
                            Mark Clear
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => verifyRoadStatus(road.id, isBlocked ? 'open' : 'verified_blocked')}
                          className="px-2.5 py-1 rounded-md bg-white hover:bg-stone-50 border border-[#DEE7EB] text-stone-700 text-xs font-medium transition-colors"
                        >
                          {isBlocked ? 'Re-open' : 'Flag Block'}
                        </button>
                      )}

                      <Link
                        to="/map"
                        onClick={() => {
                          if (road.riskZoneId) setSelectedZoneId(road.riskZoneId);
                        }}
                        className="p-1.5 rounded-md text-stone-400 hover:text-[#5A7F8E] hover:bg-[#F0F5F8] transition-colors"
                        title="View on Spatial Map"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
