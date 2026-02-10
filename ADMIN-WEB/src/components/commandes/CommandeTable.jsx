import CommandeRow from './CommandeRow';

const CommandeTable = ({ 
  commandes, 
  livreurs, // New Prop
  onViewDetails,
  onViewLocation, 
  onAssignLivreur, 
  onChangeStatus, 
  onEdit, 
  onDelete,
  editingId,
  editFormData,
  onEditChange
}) => {
  return (
    <div className="card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tracking ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Adresse
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date Livraison
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Livreur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {commandes.map((commande) => (
              <CommandeRow
                key={commande.id}
                commande={commande}
                livreurs={livreurs} // Pass to row
                onViewDetails={onViewDetails}
                onViewLocation={onViewLocation}
                onAssignLivreur={onAssignLivreur}
                onChangeStatus={onChangeStatus}
                onEdit={onEdit}
                onDelete={onDelete}
                isEditing={editingId === commande.id}
                editFormData={editFormData}
                onEditChange={onEditChange}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommandeTable;