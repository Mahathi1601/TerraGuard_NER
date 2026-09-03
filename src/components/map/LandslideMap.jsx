import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Circle, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import PredictionBadge from '../common/PredictionBadge';
import { ArrowRight } from 'lucide-react';

// Muted Risk Palette
const RISK_COLORS = {
  critical: '#B5544B',
  high: '#C97D5B',
  moderate: '#D8B863',
  low: '#84A98C',
};

// Smooth recenter helper
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || map.getZoom(), {
        duration: 1.0,
        easeLinearity: 0.25,
      });
    }
  }, [center, zoom, map]);
  return null;
}

// Custom Leaflet DivIcon helpers
const createVillageIcon = (isolationStatus) => {
  const color =
    isolationStatus === 'isolated'
      ? '#B5544B'
      : isolationStatus === 'at_risk'
      ? '#C97D5B'
      : '#84A98C';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background: #FFFFFF;
        border: 1.5px solid #D6D3D1;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 1px 4px rgba(0,0,0,0.1);
      ">
        <div style="
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${color};
        "></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
};

const hospitalIcon = L.divIcon({
  className: 'custom-leaflet-marker',
  html: `
    <div style="
      background: #FFFFFF;
      color: #3B82F6;
      border: 1.5px solid #93C5FD;
      width: 22px;
      height: 22px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 13px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
    ">
      +
    </div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  popupAnchor: [0, -12],
});

const reportIcon = L.divIcon({
  className: 'custom-leaflet-marker',
  html: `
    <div style="
      background: #FFFFFF;
      border: 1.5px solid #C97D5B;
      width: 20px;
      height: 20px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
    ">
      <div style="width:6px; height:6px; border-radius:1px; background:#C97D5B;"></div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10],
});

export default function LandslideMap({
  riskZones = [],
  roads = [],
  villages = [],
  hospitals = [],
  fieldReports = [],
  layers = { zones: true, roads: true, villages: true, hospitals: true, reports: true },
  selectedFilter = 'all',
  selectedZone = null,
  onSelectZone = () => {},
  basemap = 'light',
}) {
  const defaultCenter = [25.85, 92.8];
  const defaultZoom = 7.4;

  const filteredZones = useMemo(() => {
    if (selectedFilter === 'all') return riskZones;
    return riskZones.filter((z) => z.level === selectedFilter);
  }, [riskZones, selectedFilter]);

  const basemapConfigs = {
    light: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; Esri &mdash; Topographic Basemap',
      maxZoom: 19,
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; Esri &mdash; Maxar, Earthstar Geographics, GIS Community',
      maxZoom: 19,
    },
    topo: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenTopoMap (CC-BY-SA) &copy; OpenStreetMap',
      maxZoom: 17,
    },
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    },
  };

  const activeBasemap = basemapConfigs[basemap] || basemapConfigs.light;

  return (
    <div className="relative w-full h-full min-h-[550px] rounded-lg overflow-hidden border border-stone-200">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={true}
      >
        {selectedZone && (
          <MapController center={[selectedZone.lat, selectedZone.lng]} zoom={9} />
        )}

        <TileLayer
          key={basemap}
          url={activeBasemap.url}
          attribution={activeBasemap.attribution}
          maxZoom={activeBasemap.maxZoom}
        />

        {/* 1. Risk Zones Circles */}
        {layers.zones &&
          filteredZones.map((zone) => {
            const color = RISK_COLORS[zone.level] || RISK_COLORS.critical;
            const isSelected = selectedZone?.id === zone.id;

            return (
              <Circle
                key={zone.id}
                center={[zone.lat, zone.lng]}
                radius={zone.radiusMeters || 4000}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: isSelected ? 0.35 : 0.2,
                  weight: isSelected ? 2.5 : 1,
                }}
                eventHandlers={{
                  click: () => onSelectZone(zone),
                }}
              >
                <Popup>
                  <div className="p-3 space-y-2 min-w-[240px] text-stone-800">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border border-stone-200 text-stone-700 bg-stone-50">
                        {zone.level}
                      </span>
                      <PredictionBadge status={zone.predictionType} size="xs" />
                    </div>

                    <div>
                      <h4 className="font-semibold text-xs text-stone-900">{zone.name}</h4>
                      <p className="text-[11px] text-stone-500">
                        {zone.district}, {zone.state}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-xs py-1.5 border-y border-stone-100">
                      <div>
                        <span className="text-[10px] text-stone-500 block">Risk:</span>
                        <span className="font-mono font-medium" style={{ color }}>
                          {zone.risk}%
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-500 block">24h Rain:</span>
                        <span className="font-mono text-stone-800">
                          {zone.rainfall24h} mm
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-stone-600 leading-snug">
                      {zone.sopAdvisory}
                    </p>

                    <button
                      onClick={() => onSelectZone(zone)}
                      className="w-full py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>Inspect Factor Weights</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </Popup>
              </Circle>
            );
          })}

        {/* 2. Road Network Polylines */}
        {layers.roads &&
          roads.map((road) => {
            const isBlocked = road.status === 'verified_blocked';
            const isVerify = road.status === 'verification_required';
            const color = isBlocked ? '#B5544B' : isVerify ? '#D8B863' : '#84A98C';

            return (
              <Polyline
                key={road.id}
                positions={road.coordinates}
                pathOptions={{
                  color: color,
                  weight: isBlocked ? 3.5 : isVerify ? 3 : 2.5,
                  dashArray: isVerify ? '5, 5' : undefined,
                  opacity: 0.85,
                }}
              >
                <Popup>
                  <div className="p-2.5 space-y-1 min-w-[220px] text-stone-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-100 text-stone-700">
                        {road.routeCode}
                      </span>
                      <PredictionBadge status={road.verificationBadge} size="xs" />
                    </div>

                    <h4 className="font-semibold text-xs text-stone-900">{road.name}</h4>

                    <div className="text-xs">
                      <span className="text-stone-500">Status: </span>
                      <span className="font-medium capitalize" style={{ color }}>
                        {road.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-600 leading-tight">
                      {road.blockedReason}
                    </p>
                  </div>
                </Popup>
              </Polyline>
            );
          })}

        {/* 3. Villages Markers */}
        {layers.villages &&
          villages.map((village) => (
            <Marker
              key={village.id}
              position={[village.lat, village.lng]}
              icon={createVillageIcon(village.isolationStatus)}
            >
              <Popup>
                <div className="p-2.5 space-y-1.5 min-w-[200px] text-stone-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-medium px-1.5 py-0.5 rounded bg-stone-100 text-stone-700">
                      {village.isolationStatus.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-mono text-stone-500">
                      Pop: {village.population.toLocaleString()}
                    </span>
                  </div>

                  <h4 className="font-semibold text-xs text-stone-900">{village.name}</h4>
                  <div className="text-[11px] text-stone-500">
                    {village.district}, {village.state}
                  </div>

                  <div className="text-xs space-y-0.5 pt-1 border-t border-stone-100 text-stone-600">
                    <div>Road: <span className="font-medium capitalize">{village.mainRoadStatus.replace('_', ' ')}</span></div>
                    <div>Nearest Hospital: {village.nearestHospitalKm} km</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* 4. Hospitals Markers */}
        {layers.hospitals &&
          hospitals.map((hospital) => (
            <Marker
              key={hospital.id}
              position={[hospital.lat, hospital.lng]}
              icon={hospitalIcon}
            >
              <Popup>
                <div className="p-2.5 space-y-1 min-w-[200px] text-stone-800">
                  <span className="text-[10px] font-medium text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                    Base Hospital
                  </span>
                  <h4 className="font-semibold text-xs text-stone-900">{hospital.name}</h4>
                  <div className="text-xs text-stone-500">{hospital.district}, {hospital.state}</div>
                  <div className="text-xs pt-1 border-t border-stone-100">
                    Beds: <span className="font-mono text-stone-900">{hospital.bedsAvailable} / {hospital.totalBeds}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* 5. Field Reports Markers */}
        {layers.reports &&
          fieldReports.map((report) => (
            <Marker
              key={report.id}
              position={[report.lat, report.lng]}
              icon={reportIcon}
            >
              <Popup>
                <div className="p-2.5 space-y-1 min-w-[220px] text-stone-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-stone-700 bg-stone-100 px-1.5 py-0.5 rounded">
                      Field Incident
                    </span>
                    <PredictionBadge status={report.verificationBadge} size="xs" />
                  </div>
                  <h4 className="font-semibold text-xs text-stone-900">{report.incidentType}</h4>
                  <p className="text-[11px] text-stone-600 leading-snug">
                    {report.description}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
