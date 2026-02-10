import { useState } from 'react';
import { User, Lock, Bell, Palette, Globe, Shield } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, updateUser } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    orderUpdates: true,
    deliveryAlerts: true,
    weeklyReport: false
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    updateUser(profileData);
    toast.success('Profil mis à jour avec succès!');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    // In production, this would call an API
    toast.success('Mot de passe modifié avec succès!');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success('Préférences de notification mises à jour');
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'security', label: 'Sécurité', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Apparence', icon: Palette },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Paramètres
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gérez vos préférences et paramètres de compte
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-0">
            <div className="space-y-1 p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Informations du profil</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                    <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <button type="button" className="btn-secondary text-sm">
                      Changer la photo
                    </button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      JPG, PNG ou GIF. Max 2MB
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Nom complet</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="input-field"
                    placeholder="Ahmed Benali"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="input-field"
                    placeholder="ahmed@delivery.ma"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    className="input-field"
                    placeholder="+212 6 12 34 56 78"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Rôle</label>
                  <input
                    type="text"
                    value={user?.role === 'admin' ? 'Administrateur' : 'Gestionnaire'}
                    disabled
                    className="input-field bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn-primary">
                    Enregistrer les modifications
                  </button>
                  <button type="button" className="btn-secondary">
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Sécurité du compte</h2>
              
              <form onSubmit={handlePasswordChange} className="space-y-6 mb-8">
                <div>
                  <h3 className="font-medium mb-4">Changer le mot de passe</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Mot de passe actuel
                      </label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        className="input-field"
                        placeholder="••••••••"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        className="input-field"
                        placeholder="••••••••"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Au moins 8 caractères
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Confirmer le mot de passe
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        className="input-field"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn-primary">
                  Mettre à jour le mot de passe
                </button>
              </form>

              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-medium mb-4">Authentification à deux facteurs</h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium">2FA désactivée</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ajoutez une couche de sécurité supplémentaire
                    </p>
                  </div>
                  <button className="btn-secondary">
                    Activer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Préférences de notification</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Canaux de notification</h3>
                  <div className="space-y-4">
                    {[
                      { key: 'emailNotifications', label: 'Notifications par email', desc: 'Recevoir des emails pour les mises à jour' },
                      { key: 'smsNotifications', label: 'Notifications SMS', desc: 'Recevoir des SMS pour les alertes urgentes' },
                      { key: 'pushNotifications', label: 'Notifications push', desc: 'Recevoir des notifications dans le navigateur' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => handleNotificationChange(item.key)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notifications[item.key] ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Types de notifications</h3>
                  <div className="space-y-4">
                    {[
                      { key: 'orderUpdates', label: 'Mises à jour des commandes', desc: 'Changements de statut et nouvelles commandes' },
                      { key: 'deliveryAlerts', label: 'Alertes de livraison', desc: 'Notifications en temps réel pour les livraisons' },
                      { key: 'weeklyReport', label: 'Rapport hebdomadaire', desc: 'Résumé des performances chaque semaine' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => handleNotificationChange(item.key)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notifications[item.key] ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Apparence</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Thème</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => !isDarkMode && toggleTheme()}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        !isDarkMode
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="w-full h-24 bg-white rounded mb-2 border border-gray-200"></div>
                      <p className="font-medium">Clair</p>
                    </button>
                    
                    <button
                      onClick={() => isDarkMode || toggleTheme()}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        isDarkMode
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="w-full h-24 bg-gray-800 rounded mb-2"></div>
                      <p className="font-medium">Sombre</p>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Langue</h3>
                  <select className="input-field">
                    <option value="fr">Français</option>
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Fuseau horaire</h3>
                  <select className="input-field">
                    <option value="Africa/Casablanca">GMT+1 (Casablanca)</option>
                    <option value="Europe/Paris">GMT+2 (Paris)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;