import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

function FitRouteBounds({ coordinates }) {
  const map = useMap();
  useEffect(() => {
    if (coordinates && coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [coordinates, map]);
  return null;
}

const createPinIcon = (label, color) => {
  return L.divIcon({
    className: 'custom-nav-pin',
    html: `
      <div style="
        background: #FFFFFF;
        color: #1C1917;
        border: 1.5px solid #D6D3D1;
        padding: 3px 7px;
        border-radius: 4px;
        font-weight: 600;
        font-size: 11px;
        font-family: monospace;
        box-shadow: 0 1px 4px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        gap: 5px;
        white-space: nowrap;
      ">
        <div style="width: 6px; height: 6px; border-radius: 50%; background: ${color};"></div>
        ${label}
      </div>
    `,
    iconSize: [80, 24],
    iconAnchor: [40, 12],
  });
};

export default function NavigatorMap({
  origin,
  destination,
  routes = [],
  selectedRouteId,
  onSelectRoute,
}) {
  const allCoords = routes.flatMap((r) => r.coordinates || []);
  const center = origin ? [origin.lat, origin.lng] : [25.8, 92.8];

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-lg overflow-hidden border border-stone-200">
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

        {allCoords.length > 0 && <FitRouteBounds coordinates={allCoords} />}

        {/* Origin Pin */}
        {origin && (
          <Marker
            position={[origin.lat, origin.lng]}
            icon={createPinIcon('ORIGIN', '#78716C')}
          >
            <Popup>
              <div className="p-2 text-xs text-stone-800">
                <span className="font-semibold text-stone-900 block">Origin Base</span>
                <span>{origin.name}</span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Destination Pin */}
        {destination && (
          <Marker
            position={[destination.lat, destination.lng]}
            icon={createPinIcon('DEST', '#84A98C')}
          >
            <Popup>
              <div className="p-2 text-xs text-stone-800">
                <span className="font-semibold text-stone-900 block">Destination</span>
                <span>{destination.name}</span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route Polylines */}
        {routes.map((rt) => {
          const isSelected = rt.id === selectedRouteId;
          const routeColor =
            rt.mode === 'safest'
              ? '#84A98C'
              : rt.mode === 'balanced'
              ? '#D8B863'
              : '#B5544B';

          return (
            <Polyline
              key={rt.id}
              positions={rt.coordinates}
              pathOptions={{
                color: isSelected ? routeColor : '#A8A29E',
                weight: isSelected ? 4 : 2,
                opacity: isSelected ? 0.95 : 0.4,
                dashArray: !isSelected ? '4, 6' : undefined,
              }}
              eventHandlers={{
                click: () => onSelectRoute(rt.id),
              }}
            >
              <Popup>
                <div className="p-2 text-xs text-stone-800 space-y-1">
                  <div className="font-semibold text-stone-900">{rt.name}</div>
                  <div className="text-stone-600">
                    Distance: <span className="font-mono font-medium">{rt.distanceKm} km</span> · ETA:{' '}
                    <span className="font-mono font-medium">{Math.floor(rt.etaMinutes / 60)}h {rt.etaMinutes % 60}m</span>
                  </div>
                  <div className="text-stone-500 text-[11px]">
                    Peak Hazard Index: {rt.maxRiskScore}% ({rt.maxRiskLevel})
                  </div>
                </div>
              </Popup>
            </Polyline>
          );
        })}
      </MapContainer>
    </div>
  );
}
