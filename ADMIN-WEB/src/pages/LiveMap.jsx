import { useEffect, useState, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { useCommandesStore } from '../store/commandesStore';
import { Navigation, Package, CheckCircle, Clock, Phone, MapPin, Edit, User } from 'lucide-react';
import truckIconImg from '../assets/truck.png'; // Ensure you have this image

// Map Configuration
const containerStyle = {
  width: '100%',
  height: '100%'
};

// Center on Rabat
const center = {
  lat: 33.9716,
  lng: -6.8498
};

const LiveMap = () => {
  const { livreurs, commandes } = useCommandesStore();
  const [selectedLivreur, setSelectedLivreur] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY  });

  // Simulate real-time updates
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      console.log('Refreshing livreur positions...');
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Filter Active Livreurs
  const activeLivreurs = useMemo(() => {
    return livreurs
      .filter(l => l.isActive)
      .map(livreur => {
        const activeDeliveries = commandes.filter(
          cmd => cmd.livreur?.id === livreur.id && cmd.statut === 'En cours'
        );
        return { ...livreur, activeDeliveries };
      });
  }, [livreurs, commandes]);

  // Calculate Stats
  const stats = {
    totalActive: activeLivreurs.length,
    enCourse: activeLivreurs.filter(l => l.status === 'En livraison' || l.status === 'Occupé').length,
    disponible: activeLivreurs.filter(l => l.status === 'Disponible').length
  };

  if (!isLoaded) return <div className="p-10 text-center">Chargement de la carte...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Carte en Direct
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Localisation en temps réel de la flotte
          </p>
        </div>
        <div>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`btn-${autoRefresh ? 'primary' : 'secondary'} flex items-center gap-2`}
          >
            <Clock className="w-4 h-4" />
            Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Stats Cards (Simplified: Count Only) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <Navigation className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Connectés</p>
              <p className="text-2xl font-bold">{stats.totalActive}</p>
            </div>
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
              <Package className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">En Course</p>
              <p className="text-2xl font-bold">{stats.enCourse}</p>
            </div>
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Disponibles</p>
              <p className="text-2xl font-bold">{stats.disponible}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Map and Livreur List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Google Map */}
        <div className="lg:col-span-2 card p-0 overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="h-[600px]">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={13}
              options={{
                disableDefaultUI: false,
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                styles: [
                  // Optional: Add custom map styles here for dark mode if needed
                  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }
                ]
              }}
            >
              {activeLivreurs.map(livreur => (
                <Marker
                  key={livreur.id}
                  position={{ 
                    lat: livreur.currentLocation.lat, 
                    lng: livreur.currentLocation.lng 
                  }}
                  icon={{
                    url: truckIconImg,
                    scaledSize: new window.google.maps.Size(40, 40), // Adjust size of truck png
                    origin: new window.google.maps.Point(0, 0),
                    anchor: new window.google.maps.Point(20, 20)
                  }}
                  onClick={() => setSelectedLivreur(livreur)}
                />
              ))}

              {/* Info Window for Selected Livreur */}
              {selectedLivreur && (
                <InfoWindow
                  position={{ 
                    lat: selectedLivreur.currentLocation.lat, 
                    lng: selectedLivreur.currentLocation.lng 
                  }}
                  onCloseClick={() => setSelectedLivreur(null)}
                >
                  <div className="p-1 min-w-[200px]">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{selectedLivreur.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Phone className="w-3 h-3" />
                      {selectedLivreur.phone}
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      selectedLivreur.status === 'Disponible' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {selectedLivreur.status}
                    </span>
                    {selectedLivreur.activeDeliveries.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs font-bold text-gray-500 uppercase">Livraisons en cours</p>
                        <p className="font-medium text-gray-900">
                          {selectedLivreur.activeDeliveries.length} paquet(s)
                        </p>
                      </div>
                    )}
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </div>
        </div>

        {/* Livreur List Sidebar */}
        <div className="card h-[600px] flex flex-col">
          <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">
            Liste des Livreurs ({activeLivreurs.length})
          </h3>
          <div className="space-y-3 overflow-y-auto flex-1 pr-2">
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
                    <img src={truckIconImg} alt="Truck" className="w-6 h-6 object-contain opacity-80" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {livreur.name}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    livreur.status === 'Disponible'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
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
                  {livreur.currentLocation && (
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-500 text-xs mt-1">
                      <MapPin className="w-3 h-3" />
                      GPS: {livreur.currentLocation.lat.toFixed(4)}, {livreur.currentLocation.lng.toFixed(4)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;