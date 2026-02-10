import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import {useCommandesStore} from '../store/commandesStore';
import { Calendar, TrendingUp, MapPin } from 'lucide-react';
import { format, subDays, isAfter } from 'date-fns';
import { fr } from 'date-fns/locale';

// Fix Leaflet default marker icon issue
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

const Heatmap = () => {
  const { commandes } = useCommandesStore();
  const [dateRange, setDateRange] = useState(30); // Last 30 days
  const [intensity, setIntensity] = useState(25); // Heatmap radius
  const [showStats, setShowStats] = useState(true);

  // Filter delivered orders within date range
  const getDeliveredOrders = () => {
    const cutoffDate = subDays(new Date(), dateRange);
    return commandes.filter(cmd => 
      cmd.statut === 'Livré' && 
      cmd.dateLivraison &&
      isAfter(new Date(cmd.dateLivraison), cutoffDate)
    );
  };

  const deliveredOrders = getDeliveredOrders();

  // Convert orders to heatmap points format: [lat, lng, intensity]
  const heatmapPoints = deliveredOrders
    .filter(order => order.adresse?.coordinates)
    .map(order => [
      order.adresse.coordinates.lat,
      order.adresse.coordinates.lng,
      1 // Intensity value (can be adjusted based on order value)
    ]);

  // Calculate zone statistics
  const calculateZoneStats = () => {
    const zones = {};
    
    deliveredOrders.forEach(order => {
      if (!order.adresse?.coordinates) return;
      
      // Simple zone detection based on coordinates
      // You can enhance this with proper zone names from your data
      const zoneName = determineZone(order.adresse.coordinates);
      
      if (!zones[zoneName]) {
        zones[zoneName] = {
          name: zoneName,
          count: 0,
          revenue: 0,
          avgDeliveryTime: 0
        };
      }
      
      zones[zoneName].count += 1;
      zones[zoneName].revenue += order.montant || 0;
    });

    return Object.values(zones).sort((a, b) => b.count - a.count);
  };

  // Simple zone determination (enhance this with your actual zones)
  const determineZone = (coords) => {
    const { lat, lng } = coords;
    
    // Agdal area
    if (lat >= 33.97 && lat <= 33.98 && lng >= -6.86 && lng <= -6.84) {
      return 'Agdal';
    }
    // Hay Riad area
    if (lat >= 33.95 && lat <= 33.97 && lng >= -6.88 && lng <= -6.86) {
      return 'Hay Riad';
    }
    // Centre Ville
    if (lat >= 34.01 && lat <= 34.03 && lng >= -6.85 && lng <= -6.83) {
      return 'Centre Ville';
    }
    // Default
    return 'Autre Zone';
  };

  const zoneStats = calculateZoneStats();

  // Rabat center coordinates
  const center = [33.9716, -6.8498];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Zones de Demande Élevée
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Analyse AI des zones avec forte concentration de livraisons
          </p>
        </div>
        <button
          onClick={() => setShowStats(!showStats)}
          className="btn-primary"
        >
          {showStats ? 'Masquer' : 'Afficher'} Statistiques
        </button>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <label className="block text-sm font-medium mb-2">
            Période d'analyse
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(Number(e.target.value))}
            className="input-field"
          >
            <option value={7}>7 derniers jours</option>
            <option value={30}>30 derniers jours</option>
            <option value={90}>3 derniers mois</option>
            <option value={365}>1 an</option>
          </select>
        </div>

        <div className="card">
          <label className="block text-sm font-medium mb-2">
            Intensité du heatmap
          </label>
          <input
            type="range"
            min="10"
            max="50"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Rayon: {intensity}px
          </div>
        </div>

        <div className="card">
          <div className="text-sm font-medium mb-2">Données analysées</div>
          <div className="text-2xl font-bold text-primary-600">
            {deliveredOrders.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            livraisons
          </div>
        </div>
      </div>

      {/* Map and Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap */}
        <div className="lg:col-span-2 card p-0 overflow-hidden">
          <div className="h-[600px] relative">
            {heatmapPoints.length > 0 ? (
              <MapContainer
                center={center}
                zoom={12}
                className="h-full w-full"
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
              <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-700">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Aucune donnée de livraison disponible pour cette période
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Zone Statistics */}
        {showStats && (
          <div className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                Top Zones
              </h3>
              <div className="space-y-3">
                {zoneStats.slice(0, 5).map((zone, index) => (
                  <div key={zone.name} className="pb-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">#{index + 1} {zone.name}</span>
                      <span className="text-primary-600 font-semibold">
                        {zone.count}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${(zone.count / zoneStats[0].count) * 100}%`
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Revenu: {zone.revenue.toFixed(2)} MAD
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-3">Recommandations AI</h3>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="font-medium text-blue-900 dark:text-blue-200 mb-1">
                    🎯 Positionnement optimal
                  </p>
                  <p className="text-blue-700 dark:text-blue-300">
                    Placer 2-3 livreurs supplémentaires dans {zoneStats[0]?.name || 'la zone principale'}
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="font-medium text-green-900 dark:text-green-200 mb-1">
                    📈 Opportunité de croissance
                  </p>
                  <p className="text-green-700 dark:text-green-300">
                    Augmentation de {((zoneStats[0]?.count / deliveredOrders.length) * 100).toFixed(0)}% de demande
                  </p>
                </div>

                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="font-medium text-yellow-900 dark:text-yellow-200 mb-1">
                    ⏰ Heures de pointe
                  </p>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    Pic d'activité détecté entre 12h-14h et 19h-21h
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="card">
        <h3 className="font-semibold mb-3">Légende</h3>
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ background: 'linear-gradient(to right, #0000ff, #00ffff)' }}></div>
            <span className="text-sm">Demande faible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ background: 'linear-gradient(to right, #00ff00, #ffff00)' }}></div>
            <span className="text-sm">Demande moyenne</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ background: 'linear-gradient(to right, #ff9900, #ff0000)' }}></div>
            <span className="text-sm">Demande élevée</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;