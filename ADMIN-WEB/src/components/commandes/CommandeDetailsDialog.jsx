import { Calendar, DollarSign, MapPin, Package, Phone, Truck, User, ExternalLink } from 'lucide-react';
import Dialog from '../common/Dialog';
import StatusBadge from '../common/StatusBadge';
import { formatDate } from '../../utils/helpers';

const CommandeDetailsDialog = ({ isOpen, onClose, commande }) => {
  if (!commande) return null;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Détails de la commande" size="lg">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {commande.trackingId}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Créée le {formatDate(commande.dateCreation)}
            </p>
          </div>
          <StatusBadge status={commande.statut} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client Information */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-xl border border-gray-100 dark:border-gray-600">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <User className="w-5 h-5 text-primary-600" />
              Information Client
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Nom complet</p>
                <p className="font-medium text-gray-900 dark:text-white">{commande.client.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Téléphone</p>
                <a href={`tel:${commande.client.phone}`} className="font-medium text-blue-600 hover:underline flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {commande.client.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-xl border border-gray-100 dark:border-gray-600">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <Truck className="w-5 h-5 text-primary-600" />
              Information Livraison
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Livreur assigné</p>
                {commande.livreur ? (
                  <p className="font-medium text-gray-900 dark:text-white">{commande.livreur.name}</p>
                ) : (
                  <p className="text-sm text-orange-600 font-medium bg-orange-50 dark:bg-orange-900/20 inline-block px-2 py-1 rounded">
                    Non assigné
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Date prévue</p>
                <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {formatDate(commande.dateLivraison)}
                </div>
              </div>
            </div>
          </div>

          {/* Real Map Integration */}
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                  <MapPin className="w-5 h-5 text-red-500" />
                  Localisation
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-xl truncate">
                  {commande.adresse.text}
                </p>
              </div>
              {commande.adresse.coordinates && (
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${commande.adresse.coordinates.lat},${commande.adresse.coordinates.lng}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ouvrir
                </a>
              )}
            </div>
            
            <div className="relative h-80 w-full bg-gray-100 dark:bg-gray-700">
              {commande.adresse.coordinates ? (
                <iframe
                  title="Map Localisation"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight="0"
                  marginWidth="0"
                  src={`https://maps.google.com/maps?q=${commande.adresse.coordinates.lat},${commande.adresse.coordinates.lng}&hl=fr&z=15&output=embed`}
                  className="absolute inset-0 w-full h-full filter dark:invert-[.85] dark:hue-rotate-180" 
                  // Note: The filter helps darken the standard map for dark mode, 
                  // though it's a CSS trick. Remove 'filter...' class if you prefer standard colors in dark mode.
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <MapPin className="w-12 h-12 mb-3 opacity-20" />
                  <p>Coordonnées GPS non disponibles pour cette commande</p>
                </div>
              )}
            </div>
          </div>

          {/* Financials & Notes */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50/50 dark:bg-gray-800/50">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Montant à encaisser
              </h4>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {commande.montant ? `${commande.montant.toFixed(2)} MAD` : '0.00 MAD'}
              </p>
            </div>
            
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50/50 dark:bg-gray-800/50">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                <Package className="w-4 h-4" /> Notes
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                {commande.notes || "Aucune note particulière pour cette commande."}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <button onClick={onClose} className="btn-primary">
            Fermer
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default CommandeDetailsDialog;