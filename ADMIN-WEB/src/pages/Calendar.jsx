import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Edit2 } from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  startOfWeek,
  endOfWeek,
  isAfter 
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { useCommandesStore } from '../store/commandesStore';
import Dialog from '../components/common/Dialog';
import { useNavigate } from 'react-router-dom';

const Calendar = () => {
const { commandes } = useCommandesStore();
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  // Get start and end of calendar view (including previous/next month days)
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Start on Monday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getDeliveriesForDate = (date) => {
    return commandes.filter(cmd => 
      isSameDay(new Date(cmd.dateLivraison), date)
    );
  };

  const selectedDeliveries = getDeliveriesForDate(selectedDate);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Livré':
        return 'bg-green-500';
      case 'En cours':
        return 'bg-blue-500';
      case 'En attente':
        return 'bg-yellow-500';
      case 'Annulé':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Calendrier des Livraisons
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Planifiez et visualisez vos livraisons
          </p>
        </div>
        <button
          onClick={() => navigate('/add-commande')}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nouvelle commande
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 card">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold capitalize">
              {format(currentMonth, 'MMMM yyyy', { locale: fr })}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Mois précédent"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentMonth(new Date())}
                className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium transition-colors"
              >
                Aujourd'hui
              </button>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Mois suivant"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day headers */}
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
              <div 
                key={day} 
                className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 py-2"
              >
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {days.map((day, index) => {
              const deliveries = getDeliveriesForDate(day);
              const isSelected = isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isPast = !isAfter(day, new Date()) && !isToday;
              
              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(day)}
                  disabled={isPast}
                  className={`relative aspect-square p-2 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : isToday
                      ? 'border-primary-300 dark:border-primary-700 bg-primary-50/50 dark:bg-primary-900/10'
                      : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                  } ${
                    !isCurrentMonth ? 'opacity-40' : ''
                  } ${
                    isPast ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="flex flex-col items-center h-full">
                    <span className={`text-sm font-medium ${
                      isToday ? 'text-primary-600 dark:text-primary-400 font-bold' : ''
                    }`}>
                      {format(day, 'd')}
                    </span>
                    
                    {/* Delivery indicators */}
                    {deliveries.length > 0 && (
                      <div className="flex-1 flex items-end justify-center gap-1 pb-1">
                        {deliveries.slice(0, 3).map((delivery, idx) => (
                          <div
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full ${getStatusColor(delivery.statut)}`}
                            title={delivery.trackingId}
                          />
                        ))}
                        {deliveries.length > 3 && (
                          <span className="text-xs text-gray-500">+{deliveries.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium mb-2">Statuts:</p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm">En attente</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm">En cours</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm">Livré</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm">Annulé</span>
              </div>
            </div>
          </div>
        </div>

        {/* Deliveries List */}
        <div className="card">
          <h3 className="font-semibold mb-4">
            Livraisons du {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
          </h3>
          
          {selectedDeliveries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Aucune livraison prévue
              </p>
              <button
                onClick={() => navigate('/add-commande')}
                className="btn-secondary text-sm"
              >
                Ajouter une commande
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {selectedDeliveries.map(delivery => (
                <div 
                  key={delivery.id} 
                  className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedDelivery(delivery);
                    setShowDetailsDialog(true);
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm">{delivery.trackingId}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {delivery.client.name}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      delivery.statut === 'Livré' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : delivery.statut === 'En cours'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : delivery.statut === 'Annulé'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {delivery.statut}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                    {delivery.adresse.text}
                  </p>
                  
                  {delivery.livreur && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Livreur: {delivery.livreur.name}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                    <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                      {delivery.montant} MAD
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/commandes`);
                      }}
                      className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      Modifier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delivery Details Dialog */}
      <Dialog
        isOpen={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
        title="Détails de la livraison"
      >
        {selectedDelivery && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Tracking ID
              </label>
              <p className="font-medium">{selectedDelivery.trackingId}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Client
              </label>
              <p className="font-medium">{selectedDelivery.client.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedDelivery.client.phone}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Adresse
              </label>
              <p className="text-sm">{selectedDelivery.adresse.text}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Montant
              </label>
              <p className="font-medium text-primary-600 dark:text-primary-400">
                {selectedDelivery.montant} MAD
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Statut
              </label>
              <p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedDelivery.statut === 'Livré' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : selectedDelivery.statut === 'En cours'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {selectedDelivery.statut}
                </span>
              </p>
            </div>

            {selectedDelivery.livreur && (
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Livreur
                </label>
                <p className="font-medium">{selectedDelivery.livreur.name}</p>
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={() => {
                  setShowDetailsDialog(false);
                  navigate('/commandes');
                }}
                className="w-full btn-primary"
              >
                Voir dans les commandes
              </button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default Calendar;