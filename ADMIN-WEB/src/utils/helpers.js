import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatDate = (date) => {
  return format(new Date(date), 'dd/MM/yyyy', { locale: fr });
};

export const formatDateTime = (date) => {
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: fr });
};

export const getStatusColor = (status) => {
  const statusColors = {
    'En attente': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'En cours': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Livré': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Annulé': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };
  return statusColors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
};

export const generateTrackingId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `TRK-${timestamp}-${random}`;
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

export const findNearestLivreurs = (location, livreurs, maxDistance = 10) => {
  return livreurs
    .filter(liv => liv.isActive && liv.status === 'Disponible')
    .map(liv => ({
      ...liv,
      distance: calculateDistance(
        location.lat,
        location.lng,
        liv.currentLocation.lat,
        liv.currentLocation.lng
      )
    }))
    .filter(liv => liv.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);
};