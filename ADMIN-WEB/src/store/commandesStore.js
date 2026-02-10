import { create } from 'zustand';

export const useCommandesStore = create((set) => ({
  commandes: [],
  livreurs: [],
  gestionnaires: [],
  
  setCommandes: (commandes) => set({ commandes }),
  
  addCommande: (commande) => set((state) => ({
    commandes: [...state.commandes, commande]
  })),
  
  updateCommande: (id, updates) => set((state) => ({
    commandes: state.commandes.map(cmd => 
      cmd.id === id ? { ...cmd, ...updates } : cmd
    )
  })),
  
  deleteCommande: (id) => set((state) => ({
    commandes: state.commandes.filter(cmd => cmd.id !== id)
  })),
  
  setLivreurs: (livreurs) => set({ livreurs }),
  
  addLivreur: (livreur) => set((state) => ({
    livreurs: [...state.livreurs, livreur]
  })),
  
  setGestionnaires: (gestionnaires) => set({ gestionnaires }),
  
  addGestionnaire: (gestionnaire) => set((state) => ({
    gestionnaires: [...state.gestionnaires, gestionnaire]
  })),
}));