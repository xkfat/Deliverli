import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  type = 'warning'
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    warning: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200',
    danger: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200',
    success: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200'
  };

  const buttonStyles = {
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    danger: 'bg-red-600 hover:bg-red-700',
    success: 'bg-green-600 hover:bg-green-700'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${typeStyles[type]} mb-4`}>
              <AlertTriangle className="h-6 w-6" />
            </div>
            
            <h3 className="text-lg font-semibold text-center text-gray-900 dark:text-white mb-2">
              {title}
            </h3>
            
            <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-6">
              {message}
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 btn-secondary"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 text-white font-medium py-2 px-4 rounded-lg transition-colors ${buttonStyles[type]}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;