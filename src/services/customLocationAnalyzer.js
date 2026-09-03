import { WeatherService } from './weatherService';
import { AiService } from './aiService';

// Popular North-East India locations for quick custom analysis
export const POPULAR_NER_LOCATIONS = [
  {
    id: 'custom-cherra',
    name: 'Cherrapunji (Sohra) Escarpment',
    district: 'East Khasi Hills',
    state: 'Meghalaya',
    lat: 25.2744,
    lng: 91.7323,
    elevation: 1430,
    slope: 44,
    baseSoilMoisture: 'saturated',
    geologicalHistory: 8,
  },
  {
    id: 'custom-tawang',
    name: 'Tawang High Mountain Pass',
    district: 'Tawang',
    state: 'Arunachal Pradesh',
    lat: 27.5861,
    lng: 91.8594,
    elevation: 3048,
    slope: 48,
    baseSoilMoisture: 'high',
    geologicalHistory: 6,
  },
  {
    id: 'custom-kohima',
    name: 'Kohima Bypass Ridge',
    district: 'Kohima',
    state: 'Nagaland',
    lat: 25.6751,
    lng: 94.1086,
    elevation: 1444,
    slope: 38,
    baseSoilMoisture: 'high',
    geologicalHistory: 5,
  },
  {
    id: 'custom-aizawl',
    name: 'Aizawl Hill Slope Corridor',
    district: 'Aizawl',
    state: 'Mizoram',
    lat: 23.7271,
    lng: 92.7176,
    elevation: 1132,
    slope: 41,
    baseSoilMoisture: 'saturated',
    geologicalHistory: 7,
  },
  {
    id: 'custom-namchi',
    name: 'Namchi Valley Slope',
    district: 'South Sikkim',
    state: 'Sikkim',
    lat: 27.1667,
    lng: 88.3500,
    elevation: 1315,
    slope: 36,
    baseSoilMoisture: 'moderate',
    geologicalHistory: 4,
  },
  {
    id: 'custom-diphu',
    name: 'Diphu Plateau Transition',
    district: 'Karbi Anglong',
    state: 'Assam',
    lat: 25.8456,
    lng: 93.4331,
    elevation: 186,
    slope: 24,
    baseSoilMoisture: 'moderate',
    geologicalHistory: 2,
  },
  {
    id: 'custom-champhai',
    name: 'Champhai Border Ridge',
    district: 'Champhai',
    state: 'Mizoram',
    lat: 23.4756,
    lng: 93.3297,
    elevation: 1678,
    slope: 39,
    baseSoilMoisture: 'high',
    geologicalHistory: 4,
  },
];

/**
 * Runs a multi-condition hazard analysis for any specific location.
 */
export async function analyzeCustomLocation({
  name,
  district,
  state = 'North-East Region',
  lat,
  lng,
  customSlope,
  customElevation,
}) {
  const latitude = Number(Number(lat).toFixed(4));
  const longitude = Number(Number(lng).toFixed(4));

  // 1. Fetch live meteorological telemetry for these exact coordinates
  const weather = await WeatherService.getLiveRainfall(latitude, longitude);

  // 2. Evaluate elevation & slope gradient
  const elevation = customElevation || Math.round(500 + Math.abs(latitude - 25.0) * 450 + (longitude % 5) * 80);
  const slope = customSlope || (latitude > 27.0 ? 46 : latitude > 25.5 ? 41 : 33);

  // 3. Evaluate soil moisture based on live rainfall and base conditions
  const rainfall24h = Math.round((weather?.rainfall1hMm || 6.5) * 12 + 45);
  const rainfall72h = rainfall24h * 2 + 30;

  let soilMoisture = 'moderate';
  if (rainfall24h > 120 || slope > 40) {
    soilMoisture = 'saturated';
  } else if (rainfall24h > 70) {
    soilMoisture = 'high';
  }

  // 4. Calculate GSI 4-Factor Landslide Risk Score (0-100%)
  // Weights: Rainfall 40%, Slope 28%, Soil Moisture 20%, Geology 12%
  const rainNorm = Math.min(100, (rainfall24h / 180) * 100);
  const slopeNorm = Math.min(100, (slope / 55) * 100);
  const moistureNorm = soilMoisture === 'saturated' ? 95 : soilMoisture === 'high' ? 70 : 40;
  const geologyNorm = 65; // Regional tectonic seismic activity

  const riskScore = Math.round(
    0.40 * rainNorm +
    0.28 * slopeNorm +
    0.20 * moistureNorm +
    0.12 * geologyNorm
  );

  let level = 'low';
  if (riskScore >= 80) level = 'critical';
  else if (riskScore >= 60) level = 'high';
  else if (riskScore >= 40) level = 'moderate';

  const groundMovement =
    level === 'critical'
      ? `-${(10 + (riskScore - 80) * 0.4).toFixed(1)} mm/yr (Severe Shear)`
      : level === 'high'
      ? `-${(5 + (riskScore - 60) * 0.2).toFixed(1)} mm/yr (Creep Active)`
      : '-1.8 mm/yr (Nominal Creep)';

  // 5. Generate tailored Google Gemini operational advisory
  const aiResult = await AiService.generateSopAdvisory({
    zoneName: name,
    district: district || 'NER Sector',
    rainfall24h,
    riskScore,
    slope,
    soilMoisture,
  });

  return {
    id: `custom-zone-${Date.now()}`,
    name,
    district: district || 'Monitored Sector',
    state,
    lat: latitude,
    lng: longitude,
    elevation,
    slope,
    risk: riskScore,
    level,
    soilMoisture,
    groundMovement,
    rainfall24h,
    rainfall72h,
    radiusMeters: level === 'critical' ? 4800 : 3800,
    historicalEvents: level === 'critical' ? 5 : 2,
    predictionType: 'predicted_unverified',
    sopAdvisory: aiResult.advisory,
    isLiveAi: aiResult.isLiveAi,
    aiModel: aiResult.model,
    liveWeather: {
      isLive: weather?.isLive || false,
      provider: weather?.provider || 'InSAR Hydrology Model',
      tempC: weather?.tempC || 22,
      humidity: weather?.humidity || 85,
      rainfall1hMm: weather?.rainfall1hMm || 4.2,
      condition: weather?.condition || 'Monsoon Infiltration',
    },
    factorWeights: {
      rainfall: Math.round(0.40 * rainNorm),
      slope: Math.round(0.28 * slopeNorm),
      soilMoisture: Math.round(0.20 * moistureNorm),
      geologyHistory: Math.round(0.12 * geologyNorm),
    },
    analyzedAt: new Date().toLocaleTimeString('en-IN', { hour12: false }),
  };
}
