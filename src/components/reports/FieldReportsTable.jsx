import React, { useState } from 'react';
import { useDisasterData } from '../../context/DisasterDataContext';
import PredictionBadge from '../common/PredictionBadge';
import { 
  Clock, 
  MapPin, 
  Check, 
  User, 
  Search, 
  Eye, 
  X,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SEVERITY_CONFIG = {
  critical: { label: 'Critical', dot: 'bg-[#B5544B]', borderLeft: 'border-l-3 border-l-[#B5544B]' },
  high: { label: 'High', dot: 'bg-[#C97D5B]', borderLeft: 'border-l-3 border-l-[#C97D5B]' },
  moderate: { label: 'Moderate', dot: 'bg-[#D8B863]', borderLeft: 'border-l-3 border-l-[#D8B863]' },
  low: { label: 'Low', dot: 'bg-[#84A98C]', borderLeft: 'border-l-3 border-l-[#84A98C]' },
};

export default function FieldReportsTable() {
  const { fieldReports, verifyReport } = useDisasterData();
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [activePhoto, setActivePhoto] = useState(null);

  const filteredReports = fieldReports.filter((r) => {
    const matchesSearch =
      r.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.incidentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reporterName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity =
      severityFilter === 'all' || r.severity === severityFilter;

    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-4">
      {/* Search & Severity Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#7C9BA6] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter reports by keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 rounded-lg bg-white border border-[#DEE7EB] text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#5A7F8E]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs text-stone-500 shrink-0 mr-1 font-medium">Severity:</span>
          {['all', 'critical', 'high', 'moderate', 'low'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-all ${
                severityFilter === sev
                  ? 'bg-[#5A7F8E] text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-[#DEE7EB]'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List: Scannable visual cards */}
      <div className="space-y-3">
        {filteredReports.map((report) => {
          const isVerified = report.status === 'verified' || report.verificationBadge === 'verified';
          const cfg = SEVERITY_CONFIG[report.severity] || SEVERITY_CONFIG.critical;

          return (
            <div
              key={report.id}
              className={`p-4 sm:p-5 rounded-xl bg-white border border-[#DEE7EB] ${cfg.borderLeft} hover:border-[#CBD9E0] hover:shadow-subtle transition-all duration-150`}
            >
              <div className="flex flex-col md:flex-row gap-4 items-center">
                
                {/* Photo Thumbnail */}
                {report.photoUrl && (
                  <div
                    onClick={() => setActivePhoto(report.photoUrl)}
                    className="relative w-full md:w-32 h-20 rounded-lg overflow-hidden shrink-0 border border-[#DEE7EB] group cursor-pointer shadow-xs"
                  >
                    <img
                      src={report.photoUrl}
                      alt={report.incidentType}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}

                {/* Content: Badges and fragments */}
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-900">
                      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>

                    <PredictionBadge status={report.verificationBadge} size="xs" />

                    <span className="text-[11px] text-stone-400 font-mono flex items-center gap-1 ml-auto">
                      <Clock className="w-3 h-3 text-stone-400" />
                      {report.timestamp}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-stone-900 mb-0.5">
                    {report.incidentType}
                  </h3>

                  <div className="text-xs text-stone-600 flex items-center gap-1.5 mb-1.5">
                    <MapPin className="w-3 h-3 text-[#5A7F8E] shrink-0" />
                    <span className="font-semibold text-stone-800">{report.location}</span>
                    <span className="text-stone-400">· {report.district}</span>
                  </div>

                  <p className="text-xs text-stone-600 truncate">
                    {report.description}
                  </p>
                </div>

                {/* Right Actions */}
                <div className="shrink-0 flex items-center gap-2 self-end md:self-center">
                  {!isVerified && (
                    <button
                      onClick={() => verifyReport(report.id)}
                      className="px-3 py-1.5 rounded-md bg-[#F0F5F8] hover:bg-[#E1EDF2] border border-[#DEE7EB] text-[#2C4A57] text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Check className="w-3 h-3 text-[#5A7F8E]" />
                      <span>Verify</span>
                    </button>
                  )}

                  <Link
                    to="/map"
                    className="p-1.5 rounded-md text-stone-400 hover:text-[#5A7F8E] hover:bg-[#F0F5F8] transition-colors"
                    title="View pin on map"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs"
        >
          <div className="relative max-w-xl max-h-[85vh] rounded-xl overflow-hidden border border-stone-300 bg-white shadow-xl">
            <img src={activePhoto} alt="Field report attachment" className="w-full h-auto object-contain" />
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 text-stone-800 hover:bg-white shadow-xs transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
