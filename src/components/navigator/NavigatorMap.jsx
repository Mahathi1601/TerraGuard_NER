import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Circle, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

function FitRouteBounds({ coordinates, origin, destination }) {
  const map = useMap();
  useEffect(() => {
    const points = [];
    if (coordinates && coordinates.length > 0) {
      coordinates.forEach((c) => points.push(c));
    }
    if (origin) points.push([origin.lat, origin.lng]);
    if (destination) points.push([destination.lat, destination.lng]);

    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [coordinates, origin, destination, map]);
  return null;
}

const createPinIcon = (label, color, subtext) => {
  return L.divIcon({
    className: 'custom-nav-pin',
    html: `
      <div style="
        background: #FFFFFF;
        color: #1C1917;
        border: 1.5px solid ${color};
        padding: 4px 8px;
        border-radius: 6px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        white-space: nowrap;
        pointer-events: auto;
      ">
        <div style="display: flex; align-items: center; gap: 4px; font-weight: 700; font-size: 10px; text-transform: uppercase; color: ${color};">
          <span style="width: 6px; height: 6px; border-radius: 50%; background: ${color};"></span>
          ${label}
        </div>
        <div style="font-size: 11px; font-weight: 600; color: #292524; max-width: 140px; overflow: hidden; text-overflow: ellipsis;">
          ${subtext || ''}
        </div>
      </div>
    `,
    iconSize: [120, 36],
    iconAnchor: [60, 18],
  });
};

const RISK_COLORS = {
  critical: '#B5544B',
  high: '#C97D5B',
  moderate: '#D8B863',
  low: '#84A98C',
};

export default function NavigatorMap({
  origin,
  destination,
  routes = [],
  riskZones = [],
  selectedRouteId,
  onSelectRoute,
}) {
  const selectedRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];
  const allCoords = selectedRoute?.coordinates || routes.flatMap((r) => r.coordinates || []);
  const center = origin ? [origin.lat, origin.lng] : [25.8, 92.8];

  return (
    <div className="relative w-full h-full min-h-[520px] rounded-xl overflow-hidden border border-[#DEE7EB] shadow-xs">
      <MapContainer
        center={center}
        zoom={8}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; Esri &mdash; Topographic Basemap'
          maxZoom={19}
        />

        <FitRouteBounds
          coordinates={allCoords}
          origin={origin}
          destination={destination}
        />

        {/* 1. Active Landslide Risk Zones (Visual Danger Buffers) */}
        {riskZones.map((zone) => {
          const color = RISK_COLORS[zone.level] || '#B5544B';
          return (
            <Circle
              key={`zone-${zone.id}`}
              center={[zone.lat, zone.lng]}
              radius={zone.radiusMeters || 4500}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: zone.level === 'critical' ? 0.22 : 0.12,
                weight: 1.5,
                dashArray: '3, 4',
              }}
            >
              <Popup>
                <div className="p-2 text-xs space-y-1 text-stone-800">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                    <span className="font-bold text-stone-900">{zone.name}</span>
                  </div>
                  <div className="text-[11px] text-stone-600">
                    District: {zone.district} · Slope: {zone.slope}°
                  </div>
                  <div className="text-[11px] font-mono font-bold" style={{ color }}>
                    Hazard Probability: {zone.risk}% ({zone.level.toUpperCase()})
                  </div>
                </div>
              </Popup>
            </Circle>
          );
        })}

        {/* 2. Route Polylines */}
        {routes.map((rt) => {
          const isSelected = rt.id === selectedRouteId;
          const routeColor =
            rt.mode === 'safest'
              ? '#446A4F'
              : rt.mode === 'balanced'
              ? '#C97D5B'
              : '#B5544B';

          return (
            <Polyline
              key={rt.id}
              positions={rt.coordinates}
              pathOptions={{
                color: isSelected ? routeColor : '#A8A29E',
                weight: isSelected ? 5 : 2.5,
                opacity: isSelected ? 0.95 : 0.45,
                dashArray: !isSelected ? '6, 8' : undefined,
              }}
              eventHandlers={{
                click: () => onSelectRoute(rt.id),
              }}
            >
              <Popup>
                <div className="p-2.5 text-xs text-stone-800 space-y-1 min-w-[200px]">
                  <div className="font-bold text-stone-900 text-sm">{rt.name}</div>
                  <div className="text-stone-600 font-mono text-xs">
                    Distance: <strong>{rt.distanceKm} km</strong> · ETA:{' '}
                    <strong>
                      {Math.floor(rt.etaMinutes / 60)}h {rt.etaMinutes % 60}m
                    </strong>
                  </div>
                  <div className="text-[11px] font-mono font-bold pt-1 border-t border-stone-200" style={{ color: routeColor }}>
                    Peak Hazard Index: {rt.maxRiskScore}% ({rt.maxRiskLevel || 'nominal'})
                  </div>
                  <div className="text-[10px] text-stone-500">
                    Safety Rating: {rt.safetyScore}/100
                  </div>
                </div>
              </Popup>
            </Polyline>
          );
        })}

        {/* 3. Origin Pin */}
        {origin && (
          <Marker
            position={[origin.lat, origin.lng]}
            icon={createPinIcon('ORIGIN', '#5A7F8E', origin.shortName || origin.name)}
          >
            <Popup>
              <div className="p-2 text-xs text-stone-800">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Departure Point</span>
                <span className="font-bold text-stone-900">{origin.name}</span>
                <span className="text-[11px] text-stone-500 block mt-0.5">
                  {origin.district}, {origin.state}
                </span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* 4. Destination Pin */}
        {destination && (
          <Marker
            position={[destination.lat, destination.lng]}
            icon={createPinIcon('DESTINATION', '#446A4F', destination.shortName || destination.name)}
          >
            <Popup>
              <div className="p-2 text-xs text-stone-800">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Target Destination</span>
                <span className="font-bold text-stone-900">{destination.name}</span>
                <span className="text-[11px] text-stone-500 block mt-0.5">
                  {destination.district}, {destination.state}
                </span>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
