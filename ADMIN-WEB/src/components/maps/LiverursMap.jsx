import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon creator
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

const LiverursMap = ({ livreurs, commandes, showRoutes = true }) => {
  // Rabat center coordinates
  const center = [33.9716, -6.8498];

  // Get active deliveries for livreur
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

  // Generate route for livreur
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
    <div className="h-full w-full">
      <MapContainer
        center={center}
        zoom={13}
        className="h-full w-full rounded-lg"
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* Livreur markers */}
        {activeLivreurs.map(livreur => (
          <div key={livreur.id}>
            {/* Livreur position */}
            <Marker
              position={[livreur.currentLocation.lat, livreur.currentLocation.lng]}
              icon={createCustomIcon(
                livreur.status === 'En livraison' ? '#3b82f6' : '#10b981',
                'driver'
              )}
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

            {/* Delivery destinations */}
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
  );
};

export default LiverursMap;