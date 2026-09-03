import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import RoadsTable from '../components/impact/RoadsTable';
import DependentVillagesBar from '../components/impact/DependentVillagesBar';
import VillageCardGrid from '../components/impact/VillageCardGrid';
import IsolationDonut from '../components/impact/IsolationDonut';
import { Network, Home } from 'lucide-react';

export default function ImpactPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'villages' ? 'villages' : 'roads';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'villages' || tabParam === 'roads') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header (Minimal & Scannable) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#DEE7EB]">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Roads & Settlements
          </h1>
          <span className="text-xs font-semibold text-[#5A7F8E] bg-[#E1EDF2] px-2.5 py-0.5 rounded-md">
            Cutoff & Isolation Analytics
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-[#F0F5F8] border border-[#DEE7EB] shrink-0">
          <button
            onClick={() => handleTabChange('roads')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'roads'
                ? 'bg-white text-[#1C2930] shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Network className="w-3.5 h-3.5 text-[#5A7F8E]" />
            <span>Road Corridors</span>
          </button>
          <button
            onClick={() => handleTabChange('villages')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'villages'
                ? 'bg-white text-[#1C2930] shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Home className="w-3.5 h-3.5 text-[#5A7F8E]" />
            <span>Settlement Isolation</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Roads & Dependent Settlements */}
      {activeTab === 'roads' && (
        <div className="space-y-8">
          {/* Visual Chart First */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#5A7F8E]">
              Settlements Dependent
            </h2>
            <DependentVillagesBar />
          </section>

          {/* Table */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#5A7F8E]">
              Corridors Queue
            </h2>
            <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#DEE7EB] shadow-xs">
              <RoadsTable />
            </div>
          </section>
        </div>
      )}

      {/* Tab 2: Villages & Isolation Vulnerability */}
      {activeTab === 'villages' && (
        <div className="space-y-8">
          {/* Visual Donut First */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#5A7F8E]">
              Isolation Proportion
            </h2>
            <IsolationDonut />
          </section>

          {/* Village Cards Grid */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#5A7F8E]">
              Settlement Matrix
            </h2>
            <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#DEE7EB] shadow-xs">
              <VillageCardGrid />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
