import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useCommandesStore } from '../store/commandesStore';
import { Navigation, Package, MapPin, Phone, Clock } from 'lucide-react';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different marker types
const createCustomIcon = (color, iconType = 'driver') => {
  const svgIcon = iconType === 'driver' 
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="28" height="28"><circle cx="12" cy="12" r="10"/><path fill="white" d="M12 4l-1.5 1.5 4.5 4.5H4v2h11l-4.5 4.5L12 20l8-8-8-8z"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="28" height="28"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;
  
  return L.divIcon({
    className: 'custom-marker',
    html: svgIcon,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
};

const LiveMap = () => {
  const { livreurs, commandes } = useCommandesStore();
  const [selectedLivreur, setSelectedLivreur] = useState(null);
  const [showRoutes, setShowRoutes] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // In production, this would fetch real GPS data from backend
      console.log('Refreshing livreur positions...');
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Get active deliveries for each livreur
  const getActiveLivreursWithDeliveries = () => {
    return livreurs
      .filter(l => l.isActive)
      .map(livreur => {
        const activeDeliveries = commandes.filter(
          cmd => cmd.livreur?.id === livreur.id && cmd.statut === 'En cours'
        );
        return {
          ...livreur,
          activeDeliveries
        };
      });
  };

  const activeLivreurs = getActiveLivreursWithDeliveries();

  // Rabat center
  const center = [33.9716, -6.8498];

  // Generate route polyline for a livreur
  const getRouteForLivreur = (livreur) => {
    if (!livreur.activeDeliveries || livreur.activeDeliveries.length === 0) {
      return [];
    }

    const points = [
      [livreur.currentLocation.lat, livreur.currentLocation.lng],
      ...livreur.activeDeliveries
        .filter(d => d.adresse?.coordinates)
        .map(d => [d.adresse.coordinates.lat, d.adresse.coordinates.lng])
    ];

    return points;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Carte en Direct
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Suivi en temps réel de vos livreurs
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowRoutes(!showRoutes)}
            className={`btn-${showRoutes ? 'primary' : 'secondary'}`}
          >
            {showRoutes ? 'Masquer' : 'Afficher'} Itinéraires
          </button>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`btn-${autoRefresh ? 'primary' : 'secondary'} flex items-center gap-2`}
          >
            <Clock className="w-4 h-4" />
            Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <Navigation className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Livreurs actifs</p>
              <p className="text-2xl font-bold">{activeLivreurs.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">En cours</p>
              <p className="text-2xl font-bold">
                {activeLivreurs.reduce((acc, l) => acc + l.activeDeliveries.length, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Distance totale</p>
              <p className="text-2xl font-bold">45 km</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Temps moyen</p>
              <p className="text-2xl font-bold">28 min</p>
            </div>
          </div>
        </div>
      </div>

      {/* Map and Livreur List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2 card p-0 overflow-hidden">
          <div className="h-[600px]">
            <MapContainer
              center={center}
              zoom={13}
              className="h-full w-full"
              zoomControl={true}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />

              {/* Livreur markers */}
              {activeLivreurs.map(livreur => (
                <div key={livreur.id}>
                  <Marker
                    position={[livreur.currentLocation.lat, livreur.currentLocation.lng]}
                    icon={createCustomIcon(
                      livreur.status === 'En livraison' ? '#3b82f6' : '#10b981',
                      'driver'
                    )}
                    eventHandlers={{
                      click: () => setSelectedLivreur(livreur)
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold mb-1">{livreur.name}</h3>
                        <p className="text-sm text-gray-600">{livreur.phone}</p>
                        <p className="text-sm mt-1">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            livreur.status === 'En livraison' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {livreur.status}
                          </span>
                        </p>
                        <p className="text-sm mt-2">
                          {livreur.activeDeliveries.length} livraison(s) en cours
                        </p>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Delivery destination markers */}
                  {livreur.activeDeliveries.map(delivery => (
                    delivery.adresse?.coordinates && (
                      <Marker
                        key={delivery.id}
                        position={[delivery.adresse.coordinates.lat, delivery.adresse.coordinates.lng]}
                        icon={createCustomIcon('#ef4444', 'destination')}
                      >
                        <Popup>
                          <div className="p-2">
                            <h3 className="font-semibold mb-1">{delivery.trackingId}</h3>
                            <p className="text-sm text-gray-600">{delivery.client.name}</p>
                            <p className="text-sm">{delivery.client.phone}</p>
                            <p className="text-sm mt-1 text-gray-500">
                              {delivery.adresse.text}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    )
                  ))}

                  {/* Route polyline */}
                  {showRoutes && getRouteForLivreur(livreur).length > 1 && (
                    <Polyline
                      positions={getRouteForLivreur(livreur)}
                      color={livreur.status === 'En livraison' ? '#3b82f6' : '#10b981'}
                      weight={3}
                      opacity={0.6}
                      dashArray="10, 10"
                    />
                  )}
                </div>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Livreur List */}
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-semibold mb-4">Livreurs actifs ({activeLivreurs.length})</h3>
            <div className="space-y-3 max-h-[540px] overflow-y-auto">
              {activeLivreurs.map(livreur => (
                <div
                  key={livreur.id}
                  onClick={() => setSelectedLivreur(livreur)}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedLivreur?.id === livreur.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        livreur.status === 'En livraison' ? 'bg-blue-500' : 'bg-green-500'
                      }`} />
                      <span className="font-medium">{livreur.name}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      livreur.status === 'En livraison'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {livreur.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Phone className="w-3 h-3" />
                      {livreur.phone}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Package className="w-3 h-3" />
                      {livreur.activeDeliveries.length} livraison(s) active(s)
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Navigation className="w-3 h-3" />
                      {livreur.deliveriesToday} livrées aujourd'hui
                    </div>
                  </div>

                  {livreur.activeDeliveries.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Prochaines livraisons:
                      </p>
                      {livreur.activeDeliveries.slice(0, 2).map(delivery => (
                        <div key={delivery.id} className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          • {delivery.client.name} - {delivery.trackingId}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="card">
        <h3 className="font-semibold mb-3">Légende</h3>
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-sm">Livreur disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-sm">En livraison</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500" style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}></div>
            <span className="text-sm">Destination de livraison</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0 border-t-2 border-dashed border-blue-500"></div>
            <span className="text-sm">Itinéraire prévu</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;