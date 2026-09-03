import React, { useState, useEffect } from 'react';
import PredictionBadge from '../common/PredictionBadge';
import { useDisasterData } from '../../context/DisasterDataContext';
import { X, ArrowRight, Compass, Activity, Droplets, Mountain, History, Gauge, Sparkles, CloudSun } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ZoneDetailsDrawer({ zone, onClose }) {
  const { fetchLiveWeather, generateAiSopAdvisory, integrations } = useDisasterData();

  const [liveWeather, setLiveWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [currentAdvisory, setCurrentAdvisory] = useState(zone?.sopAdvisory || '');
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const [generatingAi, setGeneratingAi] = useState(false);

  useEffect(() => {
    if (zone) {
      setCurrentAdvisory(zone.sopAdvisory);
      setIsAiGenerated(false);

      // Fetch live weather telemetry
      setLoadingWeather(true);
      fetchLiveWeather(zone.lat, zone.lng).then((res) => {
        setLiveWeather(res);
        setLoadingWeather(false);
      });
    }
  }, [zone, fetchLiveWeather]);

  if (!zone) return null;

  const isCritical = zone.level === 'critical';
  const isHigh = zone.level === 'high';

  const weights = zone.factorWeights || {
    rainfall: 40,
    slope: 28,
    soilMoisture: 20,
    geologyHistory: 12,
  };

  const handleGenerateAiAdvisory = async () => {
    setGeneratingAi(true);
    const result = await generateAiSopAdvisory({
      zoneName: zone.name,
      district: zone.district,
      rainfall24h: liveWeather?.rainfall1hMm ? zone.rainfall24h + liveWeather.rainfall1hMm : zone.rainfall24h,
      riskScore: zone.risk,
      slope: zone.slope,
      soilMoisture: zone.soilMoisture,
    });
    setCurrentAdvisory(result.advisory);
    setIsAiGenerated(true);
    setGeneratingAi(false);
  };

  const diagnosticTags = [
    `Rainfall: ${zone.rainfall24h}mm (>120mm Trigger)`,
    `InSAR: ${zone.groundMovement} Active Slip`,
    `Slope: ${zone.slope}° (>35° Critical Shear)`,
    `Pore Saturation: ${zone.soilMoisture.toUpperCase()}`,
    `Chronic: ${zone.historicalEvents} Past Washouts`,
  ];

  return (
    <div className="h-full flex flex-col justify-between bg-white border border-[#DEE7EB] rounded-xl p-5 sm:p-6 shadow-xs overflow-y-auto">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#F0F4F6]">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span
                className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                  isCritical
                    ? 'border-[#F4D8D5] text-[#9E3B33] bg-[#FDF6F5]'
                    : isHigh
                    ? 'border-[#F7DFD4] text-[#B05C38] bg-[#FDF8F5]'
                    : 'border-[#F6EDD0] text-[#967420] bg-[#FDFBF4]'
                }`}
              >
                {zone.level}
              </span>

              <PredictionBadge status={zone.predictionType || 'predicted_unverified'} size="xs" />

              {/* Weather Provider Badge */}
              {liveWeather && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border flex items-center gap-1 ${
                  liveWeather.isLive
                    ? 'bg-[#F6FAF7] border-[#DBEADB] text-[#446A4F]'
                    : 'bg-[#F0F5F8] border-[#DEE7EB] text-[#5A7F8E]'
                }`}>
                  <CloudSun className="w-3 h-3" />
                  <span>{liveWeather.provider}</span>
                </span>
              )}
            </div>

            <h3 className="text-base font-bold text-stone-900 leading-snug">
              {zone.name}
            </h3>

            <div className="text-[11px] text-stone-500 mt-0.5 font-mono">
              {zone.district}, {zone.state} · Lat {zone.lat.toFixed(2)}, Lng {zone.lng.toFixed(2)}
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-[#F0F5F8] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 1. Large Probability Gauge */}
        <div className="my-3.5 p-4 rounded-xl bg-[#F0F5F8] border border-[#DEE7EB] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#5A7F8E] tracking-wider block">
              Hazard Probability
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className={`text-4xl font-mono font-bold ${
                isCritical ? 'text-[#B5544B]' : isHigh ? 'text-[#C97D5B]' : 'text-stone-900'
              }`}>
                {zone.risk}%
              </span>
              <span className="text-xs text-stone-500 font-mono font-medium">
                index
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-stone-500 uppercase font-semibold block">
              InSAR Deformation
            </span>
            <div className="text-xs font-mono font-bold text-stone-800 mt-1 flex items-center gap-1 justify-end">
              <Activity className="w-3.5 h-3.5 text-[#C97D5B]" />
              <span>{zone.groundMovement}</span>
            </div>
            <span className="text-[10px] text-stone-400 font-mono block mt-0.5">
              {zone.lastTelemetry}
            </span>
          </div>
        </div>

        {/* 2. Visual Metric Tiles with Live Weather Info */}
        <div className="grid grid-cols-2 gap-2.5 text-xs mb-3.5">
          <div className="p-2.5 rounded-lg bg-[#FAFBFB] border border-[#E8EFF2]">
            <div className="flex items-center justify-between text-[11px] mb-0.5 text-stone-500">
              <div className="flex items-center gap-1">
                <Droplets className="w-3 h-3 text-[#5A7F8E]" />
                <span>Precipitation</span>
              </div>
              {liveWeather?.isLive && (
                <span className="text-[9px] font-mono text-[#446A4F] bg-[#F6FAF7] px-1 rounded">Live</span>
              )}
            </div>
            <div className="font-mono font-bold text-stone-900 text-sm">
              {liveWeather?.tempC ? `${liveWeather.tempC}°C · ` : ''}{zone.rainfall24h} mm
            </div>
            <div className="text-[10px] text-stone-400 font-mono mt-0.5 truncate">
              {liveWeather?.condition || `72h: ${zone.rainfall72h}mm`}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#FAFBFB] border border-[#E8EFF2]">
            <div className="flex items-center gap-1.5 text-stone-500 text-[11px] mb-0.5">
              <Gauge className="w-3 h-3 text-[#84A98C]" />
              <span>Soil Saturation</span>
            </div>
            <div className="font-mono font-bold text-stone-900 text-sm capitalize">
              {zone.soilMoisture}
            </div>
            <div className="text-[10px] text-stone-400 font-mono mt-0.5">
              {liveWeather?.humidity ? `Humidity: ${liveWeather.humidity}%` : 'Pore Water: Critical'}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#FAFBFB] border border-[#E8EFF2]">
            <div className="flex items-center gap-1.5 text-stone-500 text-[11px] mb-0.5">
              <Mountain className="w-3 h-3 text-[#C97D5B]" />
              <span>Slope Gradient</span>
            </div>
            <div className="font-mono font-bold text-stone-900 text-sm">
              {zone.slope}°
            </div>
            <div className="text-[10px] text-stone-400 font-mono mt-0.5">
              Elev: {zone.elevation}m
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#FAFBFB] border border-[#E8EFF2]">
            <div className="flex items-center gap-1.5 text-stone-500 text-[11px] mb-0.5">
              <History className="w-3 h-3 text-[#5A7F8E]" />
              <span>History</span>
            </div>
            <div className="font-mono font-bold text-stone-900 text-sm">
              {zone.historicalEvents} events
            </div>
            <div className="text-[10px] text-stone-400 font-mono mt-0.5">
              Chronic Corridor
            </div>
          </div>
        </div>

        {/* 3. Factor Attribution Bars */}
        <div className="p-3.5 rounded-xl bg-[#FAFBFB] border border-[#E8EFF2] mb-3.5">
          <span className="text-[11px] uppercase font-bold text-stone-700 tracking-wide block mb-2.5">
            Factor Weights
          </span>

          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-stone-700">Precipitation</span>
                <span className="font-mono text-[#5A7F8E] font-bold">{weights.rainfall}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#E2E8ED] rounded-full overflow-hidden">
                <div className="h-full bg-[#5A7F8E] rounded-full" style={{ width: `${weights.rainfall}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-stone-700">Slope & Shear Stress</span>
                <span className="font-mono text-[#C97D5B] font-bold">{weights.slope}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#E2E8ED] rounded-full overflow-hidden">
                <div className="h-full bg-[#C97D5B] rounded-full" style={{ width: `${weights.slope}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-stone-700">Soil Moisture</span>
                <span className="font-mono text-[#84A98C] font-bold">{weights.soilMoisture}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#E2E8ED] rounded-full overflow-hidden">
                <div className="h-full bg-[#84A98C] rounded-full" style={{ width: `${weights.soilMoisture}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-stone-700">Geology History</span>
                <span className="font-mono text-stone-500 font-bold">{weights.geologyHistory}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#E2E8ED] rounded-full overflow-hidden">
                <div className="h-full bg-[#A4B7C1] rounded-full" style={{ width: `${weights.geologyHistory}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* 4. Diagnostic Checklist as Visual Badges */}
        <div className="p-3.5 rounded-xl bg-[#FAFBFB] border border-[#E8EFF2] mb-3.5">
          <span className="text-[11px] uppercase font-bold text-stone-700 tracking-wide block mb-2">
            Trigger Triggers
          </span>

          <div className="flex flex-wrap gap-1.5">
            {diagnosticTags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-white text-stone-800 border border-stone-200 shadow-2xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Advisory Tag & AI Generation Trigger */}
      <div className="pt-3 border-t border-[#F0F4F6] space-y-2.5">
        <div className="p-3 rounded-lg bg-[#FDF6F5] border border-[#F4D8D5] border-l-3 border-l-[#B5544B] text-xs leading-relaxed">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold text-[#9E3B33] flex items-center gap-1">
              {isAiGenerated ? (
                <>
                  <Sparkles className="w-3 h-3 text-[#5A7F8E]" />
                  <span>Gemini AI SOP Advisory</span>
                </>
              ) : (
                <span>NDMA Advisory</span>
              )}
            </span>

            {/* AI Generator Button */}
            <button
              onClick={handleGenerateAiAdvisory}
              disabled={generatingAi}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white hover:bg-[#F0F5F8] border border-[#DEE7EB] text-[10px] font-semibold text-[#5A7F8E] transition-colors shadow-2xs disabled:opacity-50"
              title="Generate live AI advisory with Gemini"
            >
              <Sparkles className={`w-2.5 h-2.5 ${generatingAi ? 'animate-spin' : ''}`} />
              <span>{generatingAi ? 'Generating...' : 'AI Re-Analyze'}</span>
            </button>
          </div>
          <p className="text-stone-800 text-[11px] font-medium">
            {currentAdvisory}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            to="/impact"
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#F0F5F8] hover:bg-[#E1EDF2] text-[#2C4A57] text-xs font-semibold transition-colors"
          >
            <span>Roads</span>
            <ArrowRight className="w-3 h-3 text-[#5A7F8E]" />
          </Link>
          <Link
            to="/navigate"
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#5A7F8E] hover:bg-[#466674] text-white text-xs font-semibold transition-colors shadow-xs"
          >
            <span>Bypass</span>
            <Compass className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
