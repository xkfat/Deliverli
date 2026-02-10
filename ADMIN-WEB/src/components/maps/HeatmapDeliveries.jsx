import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Heatmap Layer Component
const HeatmapLayer = ({ points, options }) => {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;

    // Create heatmap layer
    const heat = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      max: 1.0,
      gradient: {
        0.0: '#0000ff',
        0.2: '#00ffff',
        0.4: '#00ff00',
        0.6: '#ffff00',
        0.8: '#ff9900',
        1.0: '#ff0000'
      },
      ...options
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, points, options]);

  return null;
};

const HeatmapDeliveries = ({ deliveries, intensity = 25 }) => {
  // Rabat center coordinates
  const center = [33.9716, -6.8498];

  // Convert deliveries to heatmap points format: [lat, lng, intensity]
  const heatmapPoints = deliveries
    .filter(delivery => delivery.adresse?.coordinates)
    .map(delivery => [
      delivery.adresse.coordinates.lat,
      delivery.adresse.coordinates.lng,
      1 // Intensity (can be weighted by order value)
    ]);

  return (
    <div className="h-full w-full">
      {heatmapPoints.length > 0 ? (
        <MapContainer
          center={center}
          zoom={12}
          className="h-full w-full rounded-lg"
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <HeatmapLayer 
            points={heatmapPoints} 
            options={{ radius: intensity }}
          />
        </MapContainer>
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Aucune donnée de livraison disponible
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeatmapDeliveries;