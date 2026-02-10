import { Mail, Phone, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const EquipeTable = ({ members, type = 'livreurs' }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {members.map(member => (
        <div key={member.id} className="card hover:shadow-lg transition-shadow">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
              <span className="text-primary-600 dark:text-primary-400 font-semibold text-lg">
                {member.name.charAt(0).toUpperCase()}
              </span>
            </div>
            
            {/* Status Badge */}
            {member.isActive !== undefined && (
              <div className="flex items-center gap-1">
                {member.isActive ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Actif
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-gray-500" />
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                      Inactif
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Name */}
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">
            {member.name}
          </h3>

          {/* Contact Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Mail className="w-4 h-4" />
              <span className="truncate">{member.email}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Phone className="w-4 h-4" />
              <span>{member.phone}</span>
            </div>

            {member.dateCreation && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Depuis {formatDate(member.dateCreation)}</span>
              </div>
            )}
          </div>

          {/* Livreur Stats */}
          {type === 'livreurs' && member.deliveriesToday !== undefined && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Livraisons aujourd'hui
                </span>
                <span className="font-semibold text-primary-600 dark:text-primary-400">
                  {member.deliveriesToday}
                </span>
              </div>
              
              {member.status && (
                <div className="mt-2">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    member.status === 'En livraison'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : member.status === 'Disponible'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    {member.status}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Gestionnaire Role */}
          {type === 'gestionnaires' && member.role && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                {member.role === 'admin' ? 'Administrateur' : 'Gestionnaire'}
              </span>
            </div>
          )}
        </div>
      ))}

      {members.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Aucun membre trouvé
          </p>
        </div>
      )}
    </div>
  );
};

export default EquipeTable;