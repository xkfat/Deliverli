import { MapPin, Edit, Trash2, UserPlus, Eye } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { formatDate } from '../../utils/helpers';

const CommandeRow = ({ 
  commande, 
  onViewLocation, 
  onAssignLivreur, 
  onChangeStatus, 
  onEdit, 
  onDelete 
}) => {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-medium text-gray-900 dark:text-white">
          {commande.trackingId}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {formatDate(commande.dateCreation)}
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="font-medium text-gray-900 dark:text-white">
          {commande.client.name}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {commande.client.phone}
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate">
            {commande.adresse.text}
          </span>
          {commande.adresse.coordinates && (
            <button
              onClick={() => onViewLocation(commande)}
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
              title="Voir sur la carte"
            >
              <MapPin className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
      
      <td className="px-6 py-4">
        {commande.livreur ? (
          <span className="text-sm text-gray-900 dark:text-white">
            {commande.livreur.name}
          </span>
        ) : (
          <button
            onClick={() => onAssignLivreur(commande)}
            className="flex items-center gap-1 text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm font-medium"
          >
            <UserPlus className="w-4 h-4" />
            Assigner
          </button>
        )}
      </td>
      
      <td className="px-6 py-4">
        <StatusBadge
          status={commande.statut}
          onClick={() => onChangeStatus(commande)}
        />
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(commande)}
            className="p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            title="Voir détails"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(commande)}
            className="p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            title="Modifier"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(commande)}
            className="p-1 text-red-600 hover:text-red-700 dark:text-red-400"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CommandeRow;