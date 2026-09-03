import React, { useState } from 'react';
import { useDisasterData } from '../../context/DisasterDataContext';
import {
  POPULAR_NER_LOCATIONS,
  analyzeCustomLocation,
} from '../../services/customLocationAnalyzer';
import {
  X,
  Sparkles,
  MapPin,
  Compass,
  Droplets,
  Mountain,
  Gauge,
  Activity,
  Check,
  Search,
  PlusCircle,
} from 'lucide-react';

export default function CustomLocationAnalyzerModal({ isOpen, onClose, onZonePinned }) {
  const { addCustomRiskZone } = useDisasterData();

  // Selected preset or custom
  const [selectedPresetId, setSelectedPresetId] = useState('custom-cherra');
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Custom inputs
  const [customName, setCustomName] = useState('');
  const [customDistrict, setCustomDistrict] = useState('');
  const [customLat, setCustomLat] = useState('25.5788');
  const [customLng, setCustomLng] = useState('91.8933');
  const [customSlope, setCustomSlope] = useState('42');

  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isPinned, setIsPinned] = useState(false);

  if (!isOpen) return null;

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setIsPinned(false);

    let locationParams;
    if (isCustomMode) {
      locationParams = {
        name: customName.trim() || 'Custom Mountain Sector',
        district: customDistrict.trim() || 'NER District',
        lat: parseFloat(customLat) || 25.57,
        lng: parseFloat(customLng) || 91.89,
        customSlope: parseInt(customSlope, 10) || 40,
      };
    } else {
      const preset = POPULAR_NER_LOCATIONS.find((p) => p.id === selectedPresetId);
      locationParams = {
        name: preset.name,
        district: preset.district,
        state: preset.state,
        lat: preset.lat,
        lng: preset.lng,
        customSlope: preset.slope,
        customElevation: preset.elevation,
      };
    }

    try {
      const result = await analyzeCustomLocation(locationParams);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Custom location analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePinToMap = () => {
    if (!analysisResult) return;
    addCustomRiskZone(analysisResult);
    setIsPinned(true);
    if (onZonePinned) {
      onZonePinned(analysisResult);
    }
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const isCritical = analysisResult?.level === 'critical';
  const isHigh = analysisResult?.level === 'high';

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 bg-white border border-[#DEE7EB] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#F0F4F6] bg-[#FAFAF9]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#EAF1F4] text-[#5A7F8E]">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 leading-tight">
                Custom Location Hazard Analyzer
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                On-demand multi-condition synthesis (Live OWM Rain + DEM Slope + Gemini AI)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-[#F0F5F8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* 1. Location Selection Controls */}
          <div className="p-4 rounded-xl bg-[#FAFBFB] border border-[#E8EFF2] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-stone-700 tracking-wider">
                Step 1: Choose Location
              </span>

              {/* Mode Toggle */}
              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={() => setIsCustomMode(false)}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    !isCustomMode
                      ? 'bg-[#5A7F8E] text-white shadow-xs'
                      : 'bg-white text-stone-600 border border-[#DEE7EB]'
                  }`}
                >
                  Popular Stations
                </button>
                <button
                  onClick={() => setIsCustomMode(true)}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    isCustomMode
                      ? 'bg-[#5A7F8E] text-white shadow-xs'
                      : 'bg-white text-stone-600 border border-[#DEE7EB]'
                  }`}
                >
                  Custom GPS / Place
                </button>
              </div>
            </div>

            {!isCustomMode ? (
              /* Preset Dropdown */
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Select Mountain Station / Settlement:
                </label>
                <select
                  value={selectedPresetId}
                  onChange={(e) => setSelectedPresetId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#DEE7EB] text-xs text-stone-900 font-medium focus:outline-none focus:border-[#5A7F8E] shadow-xs"
                >
                  {POPULAR_NER_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} — {loc.district}, {loc.state} (Lat {loc.lat}, Lng {loc.lng})
                    </option>
                  ))}
                </select>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {POPULAR_NER_LOCATIONS.slice(0, 5).map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => setSelectedPresetId(loc.id)}
                      className={`text-[11px] font-medium px-2 py-0.5 rounded border transition-all ${
                        selectedPresetId === loc.id
                          ? 'bg-[#F0F5F8] border-[#5A7F8E] text-[#2C4A57] font-bold'
                          : 'bg-white border-stone-200 text-stone-600 hover:bg-[#FAFBFB]'
                      }`}
                    >
                      {loc.name.split(' ')[0]} ({loc.state})
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Custom Input Fields */
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">
                      Location / Hill Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Upper Shillong Peak"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#DEE7EB] text-xs text-stone-900 font-medium focus:outline-none focus:border-[#5A7F8E]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">
                      District / Sector
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. East Khasi Hills"
                      value={customDistrict}
                      onChange={(e) => setCustomDistrict(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#DEE7EB] text-xs text-stone-900 font-medium focus:outline-none focus:border-[#5A7F8E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-stone-500 uppercase mb-1">
                      Latitude (°N)
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={customLat}
                      onChange={(e) => setCustomLat(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#DEE7EB] text-xs font-mono text-stone-900 focus:outline-none focus:border-[#5A7F8E]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-stone-500 uppercase mb-1">
                      Longitude (°E)
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={customLng}
                      onChange={(e) => setCustomLng(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#DEE7EB] text-xs font-mono text-stone-900 focus:outline-none focus:border-[#5A7F8E]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-stone-500 uppercase mb-1">
                      Slope Angle (°)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="75"
                      value={customSlope}
                      onChange={(e) => setCustomSlope(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#DEE7EB] text-xs font-mono text-stone-900 focus:outline-none focus:border-[#5A7F8E]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Run Button */}
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="w-full py-2.5 px-4 rounded-xl bg-[#5A7F8E] hover:bg-[#466674] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Querying Live Weather & Computing Risk...' : 'Run Multi-Condition Hazard Analysis'}</span>
            </button>
          </div>

          {/* 2. Analysis Results Display */}
          {analysisResult && (
            <div className="space-y-4 pt-2 border-t border-[#F0F4F6] animate-in fade-in slide-in-from-bottom-2 duration-200">
              
              {/* Top Result Banner with Large Gauge */}
              <div className="p-4 rounded-xl bg-[#F0F5F8] border border-[#DEE7EB] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                        isCritical
                          ? 'border-[#F4D8D5] text-[#9E3B33] bg-[#FDF6F5]'
                          : isHigh
                          ? 'border-[#F7DFD4] text-[#B05C38] bg-[#FDF8F5]'
                          : 'border-[#F6EDD0] text-[#967420] bg-[#FDFBF4]'
                      }`}
                    >
                      {analysisResult.level} Hazard Tier
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono">
                      Analyzed at {analysisResult.analyzedAt}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 leading-snug">
                    {analysisResult.name}
                  </h3>
                  <div className="text-xs text-stone-600 font-mono">
                    {analysisResult.district}, {analysisResult.state} · Lat {analysisResult.lat}, Lng {analysisResult.lng}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-[#5A7F8E] tracking-wider block">
                    Hazard Index
                  </span>
                  <div className="flex items-baseline gap-1 justify-end">
                    <span
                      className={`text-3xl sm:text-4xl font-mono font-bold ${
                        isCritical ? 'text-[#B5544B]' : isHigh ? 'text-[#C97D5B]' : 'text-stone-900'
                      }`}
                    >
                      {analysisResult.risk}%
                    </span>
                  </div>
                </div>
              </div>

              {/* 4 Multi-Condition Telemetry Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-3 rounded-lg bg-[#FAFBFB] border border-[#E8EFF2]">
                  <div className="flex items-center gap-1 text-[10px] text-stone-500 mb-0.5">
                    <Droplets className="w-3 h-3 text-[#5A7F8E]" />
                    <span>Precipitation</span>
                  </div>
                  <div className="font-mono font-bold text-stone-900 text-sm">
                    {analysisResult.rainfall24h} mm
                  </div>
                  <div className="text-[10px] text-stone-400 font-mono mt-0.5 truncate">
                    {analysisResult.liveWeather?.isLive ? 'OWM Live' : 'InSAR Est.'}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#FAFBFB] border border-[#E8EFF2]">
                  <div className="flex items-center gap-1 text-[10px] text-stone-500 mb-0.5">
                    <Gauge className="w-3 h-3 text-[#84A98C]" />
                    <span>Soil Saturation</span>
                  </div>
                  <div className="font-mono font-bold text-stone-900 text-sm capitalize">
                    {analysisResult.soilMoisture}
                  </div>
                  <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                    Hum: {analysisResult.liveWeather.humidity}%
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#FAFBFB] border border-[#E8EFF2]">
                  <div className="flex items-center gap-1 text-[10px] text-stone-500 mb-0.5">
                    <Mountain className="w-3 h-3 text-[#C97D5B]" />
                    <span>Slope Gradient</span>
                  </div>
                  <div className="font-mono font-bold text-stone-900 text-sm">
                    {analysisResult.slope}°
                  </div>
                  <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                    Elev: {analysisResult.elevation}m
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#FAFBFB] border border-[#E8EFF2]">
                  <div className="flex items-center gap-1 text-[10px] text-stone-500 mb-0.5">
                    <Activity className="w-3 h-3 text-[#5A7F8E]" />
                    <span>Ground Creep</span>
                  </div>
                  <div className="font-mono font-bold text-stone-900 text-xs truncate">
                    {analysisResult.groundMovement.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                    InSAR Baseline
                  </div>
                </div>
              </div>

              {/* Factor Attribution Breakdown */}
              <div className="p-3.5 rounded-xl bg-[#FAFBFB] border border-[#E8EFF2]">
                <span className="text-[11px] uppercase font-bold text-stone-700 tracking-wide block mb-2">
                  Factor Attribution Contribution
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-white border border-stone-200">
                    <span className="text-[10px] text-stone-500 block">Rainfall (40%)</span>
                    <strong className="text-stone-900">{analysisResult.factorWeights.rainfall}%</strong>
                  </div>
                  <div className="p-2 rounded bg-white border border-stone-200">
                    <span className="text-[10px] text-stone-500 block">Slope Shear (28%)</span>
                    <strong className="text-stone-900">{analysisResult.factorWeights.slope}%</strong>
                  </div>
                  <div className="p-2 rounded bg-white border border-stone-200">
                    <span className="text-[10px] text-stone-500 block">Soil Moisture (20%)</span>
                    <strong className="text-stone-900">{analysisResult.factorWeights.soilMoisture}%</strong>
                  </div>
                  <div className="p-2 rounded bg-white border border-stone-200">
                    <span className="text-[10px] text-stone-500 block">Geology (12%)</span>
                    <strong className="text-stone-900">{analysisResult.factorWeights.geologyHistory}%</strong>
                  </div>
                </div>
              </div>

              {/* Gemini AI Operational Advisory Card */}
              <div className="p-3.5 rounded-xl bg-[#FDF6F5] border border-[#F4D8D5] border-l-4 border-l-[#B5544B] text-xs">
                <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#9E3B33] mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#5A7F8E]" />
                  <span>Google Gemini NDMA Advisory ({analysisResult.aiModel || 'Gemini Flash'})</span>
                </div>
                <p className="text-stone-800 text-xs font-medium leading-relaxed">
                  {analysisResult.sopAdvisory}
                </p>
              </div>

              {/* Pin to Map Action */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  onClick={handlePinToMap}
                  disabled={isPinned}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 ${
                    isPinned
                      ? 'bg-[#F6FAF7] text-[#446A4F] border border-[#DBEADB]'
                      : 'bg-[#446A4F] hover:bg-[#36553F] text-white'
                  }`}
                >
                  {isPinned ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Pinned to Live Map!</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span>Pin This Location to Live Map</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
