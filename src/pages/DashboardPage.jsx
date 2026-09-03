import React from 'react';
import { useDisasterData } from '../context/DisasterDataContext';
import StatCard from '../components/common/StatCard';
import AdvisoryBanner from '../components/common/AdvisoryBanner';
import QuickStatsStrip from '../components/dashboard/QuickStatsStrip';
import RiskDistributionPie from '../components/dashboard/RiskDistributionPie';
import PopulationImpactBar from '../components/dashboard/PopulationImpactBar';
import RiskTrendLineChart from '../components/dashboard/RiskTrendLineChart';
import PriorityActionsList from '../components/dashboard/PriorityActionsList';
import { Download, Compass, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { alertCounts, riskZones } = useDisasterData();

  const handleExportBriefing = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      platform: 'NER Landslide Command Center',
      alertCounts,
      criticalZones: riskZones.filter((z) => z.level === 'critical'),
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NER-Briefing-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. Header (Minimal text, scannable) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#DEE7EB]">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Command Center
          </h1>
          <span className="text-xs font-semibold text-[#5A7F8E] bg-[#E1EDF2] px-2.5 py-0.5 rounded-md">
            NDMA Level-3
          </span>
          <span className="text-xs text-stone-400 font-mono hidden md:inline">
            8 NER States Active
          </span>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/map"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#5A7F8E] hover:bg-[#466674] text-white text-xs font-semibold transition-all shadow-xs"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Spatial Map</span>
          </Link>
          <button
            onClick={handleExportBriefing}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white hover:bg-[#F2F6F8] border border-[#DEE7EB] text-stone-700 text-xs font-medium transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#5A7F8E]" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* 2. Advisory Banner (1-line scannable) */}
      <AdvisoryBanner
        level="critical"
        advisory="Recommended: review evacuation measures in Dima Hasao & Mangan corridors due to heavy antecedent rainfall (>160mm/24h)."
        actionButton={
          <Link
            to="/impact"
            className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white hover:bg-stone-50 text-stone-900 border border-[#F4D8D5] flex items-center gap-1 transition-colors shadow-2xs"
          >
            <span>Review</span>
            <ArrowUpRight className="w-3 h-3 text-[#B5544B]" />
          </Link>
        }
      />

      {/* 3. Stat Cards (Numbers & Risk Tints First) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#5A7F8E]">
            Hazard Distribution
          </h2>
          <span className="text-[11px] text-stone-400 font-mono">24h Telemetry</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          <StatCard
            level="critical"
            count={alertCounts.critical}
            subtext="Immediate review clusters"
          />
          <StatCard
            level="high"
            count={alertCounts.high}
            subtext="Accelerating deformation"
          />
          <StatCard
            level="moderate"
            count={alertCounts.moderate}
            subtext="Precipitation watch"
          />
          <StatCard
            level="low"
            count={alertCounts.low}
            subtext="Baseline telemetry normal"
          />
        </div>
      </section>

      {/* 4. Visuals First: Dual Analytics Grid (Charts Prominent) */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#5A7F8E]">
          Risk Analytics
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          <div className="h-full">
            <RiskDistributionPie />
          </div>
          <div className="h-full">
            <PopulationImpactBar />
          </div>
        </div>
      </section>

      {/* 5. Visuals First: 24h Telemetry Trend Line */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#5A7F8E]">
          Telemetry Surge
        </h2>
        <RiskTrendLineChart />
      </section>

      {/* 6. Critical Indicators Strip */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#5A7F8E]">
          Critical Bottlenecks
        </h2>
        <QuickStatsStrip />
      </section>

      {/* 7. Action Queue (Scannable Tags & Badges) */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#5A7F8E]">
          Action Queue
        </h2>
        <PriorityActionsList />
      </section>

    </div>
  );
}
