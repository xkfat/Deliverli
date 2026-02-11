import { MapPin, Edit, Trash2, UserPlus, Eye, Calendar, ChevronDown } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { formatDate } from '../../utils/helpers';

const CommandeRow = ({ 
  commande, 
  onViewDetails, 
  onViewLocation, 
  onAssignLivreur, 
  onChangeStatus, 
  onEdit, 
  onDelete,
  isEditing,
  editFormData,
  onEditChange
}) => {
  
const getInputValue = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
};


  return (
    <tr className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${isEditing ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
      {/* 1. Tracking ID */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-medium text-gray-900 dark:text-white">
          {commande.trackingId}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {formatDate(commande.dateCreation)}
        </div>
      </td>
      
      {/* 2. Client Info (Input when editing) */}
      <td className="px-6 py-4">
        {isEditing ? (
          <div className="space-y-2">
            <input 
              type="text" 
              value={editFormData.client.name}
              onChange={(e) => onEditChange('name', e.target.value, 'client')}
              className="w-full text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 px-2 py-1"
              placeholder="Nom"
            />
            <input 
              type="text" 
              value={editFormData.client.phone}
              onChange={(e) => onEditChange('phone', e.target.value, 'client')}
              className="w-full text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 px-2 py-1"
              placeholder="Téléphone"
            />
          </div>
        ) : (
          <>
            <div className="font-medium text-gray-900 dark:text-white">
              {commande.client.name}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {commande.client.phone}
            </div>
          </>
        )}
      </td>
      
      {/* 3. Address (Textarea when editing) */}
      <td className="px-6 py-4">
        {isEditing ? (
          <textarea 
            value={editFormData.adresse.text}
            onChange={(e) => onEditChange('text', e.target.value, 'adresse')}
            className="w-full text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 px-2 py-1 min-w-[200px]"
            rows="2"
          />
        ) : (
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
        )}
      </td>

      {/* 4. Date de Livraison (Input when editing) */}
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <input
            type="date"
            value={getInputValue(editFormData.dateLivraison)}
            onChange={(e) => onEditChange('dateLivraison', e.target.value)}
            className="text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 px-2 py-1"
          />
        ) : (
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Calendar className="w-4 h-4 text-gray-400" />
            {formatDate(commande.dateLivraison)}
          </div>
        )}
      </td>
      
      {/* 5. Livreur */}
      <td className="px-6 py-4">
        {isEditing ? (
          /* Edit Mode: Button to Open Dialog */
          <button
            onClick={() => onAssignLivreur(editFormData)}
            className="w-full flex items-center justify-between gap-2 px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <span className={editFormData.livreur ? "text-gray-900 dark:text-white" : "text-gray-500"}>
              {editFormData.livreur?.name || "Assigner..."}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        ) : (
          /* View Mode: Static Text */
          commande.livreur ? (
            <span className="text-sm font-medium text-gray-900 dark:text-white block">
              {commande.livreur.name}
            </span>
          ) : (
            <span className="text-sm text-gray-500 italic">Non assigné</span>
          )
        )}
      </td>
      
      {/* 6. Status */}
      <td className="px-6 py-4">
        {isEditing ? (
           /* Edit Mode: Button to Open Dialog */
           <button
             onClick={() => onChangeStatus(editFormData)}
             className="w-full flex items-center justify-between gap-2 px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
           >
             <StatusBadge status={editFormData.statut} />
             <ChevronDown className="w-4 h-4 text-gray-400" />
           </button>
        ) : (
          /* View Mode: Static Badge (non-clickable) */
          <StatusBadge status={commande.statut} />
        )}
      </td>
      
      {/* 7. Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {isEditing ? (
             <span className="text-xs text-blue-600 font-medium animate-pulse">
               En modification...
             </span>
          ) : (
            <>
              <button
                onClick={() => onViewDetails(commande)}
                className="p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                title="Voir détails"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => onEdit(commande)}
                className="p-1 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200"
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
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default CommandeRow;