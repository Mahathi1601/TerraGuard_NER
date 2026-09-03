import React, { useState } from 'react';
import FieldReportsTable from '../components/reports/FieldReportsTable';
import NewReportModal from '../components/reports/NewReportModal';
import { Plus } from 'lucide-react';
import { useDisasterData } from '../context/DisasterDataContext';

export default function ReportsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { fieldReports } = useDisasterData();

  const totalReports = fieldReports.length;
  const verifiedCount = fieldReports.filter((r) => r.status === 'verified').length;
  const unverifiedCount = totalReports - verifiedCount;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#DEE7EB]">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Field Reports
          </h1>
          <span className="text-xs font-semibold text-[#5A7F8E] bg-[#E1EDF2] px-2.5 py-0.5 rounded-md">
            Ground Truth Feed
          </span>
        </div>

        {/* Submit Action */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#5A7F8E] hover:bg-[#466674] text-white text-xs font-semibold transition-all shadow-xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Submit Report</span>
        </button>
      </div>

      {/* Stats Cards Row: Numbers First */}
      <section className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#5A7F8E]">
          Verification Status
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
          <div className="p-5 rounded-xl bg-white border border-[#DEE7EB] shadow-xs">
            <span className="text-xs text-stone-500 font-medium block">Total Submitted</span>
            <span className="text-3xl font-bold font-mono text-stone-900 mt-1 block">
              {totalReports}
            </span>
          </div>

          <div className="p-5 rounded-xl bg-white border border-[#DEE7EB] shadow-xs">
            <span className="text-xs text-stone-500 font-medium block">Confirmed Ground Truth</span>
            <span className="text-3xl font-bold font-mono text-[#446A4F] mt-1 block">
              {verifiedCount}
            </span>
          </div>

          <div className="p-5 rounded-xl bg-white border border-[#DEE7EB] shadow-xs">
            <span className="text-xs text-stone-500 font-medium block">Pending Inspection</span>
            <span className="text-3xl font-bold font-mono text-[#B05C38] mt-1 block">
              {unverifiedCount}
            </span>
          </div>
        </div>
      </section>

      {/* Reports Table View */}
      <section className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#5A7F8E]">
          Submissions Stream
        </h2>
        <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#DEE7EB] shadow-xs">
          <FieldReportsTable />
        </div>
      </section>

      <NewReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
