import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  
  login: (userData) => {
    set({ 
      user: userData, 
      isAuthenticated: true 
    });
    localStorage.setItem('auth-user', JSON.stringify(userData));
    localStorage.setItem('auth-isAuthenticated', 'true');
  },
  
  logout: () => {
    set({ 
      user: null, 
      isAuthenticated: false 
    });
    localStorage.removeItem('auth-user');
    localStorage.removeItem('auth-isAuthenticated');
  },
  
  updateUser: (userData) => set((state) => {
    const updatedUser = { ...state.user, ...userData };
    localStorage.setItem('auth-user', JSON.stringify(updatedUser));
    return { user: updatedUser };
  }),

  initializeAuth: () => {
    const storedUser = localStorage.getItem('auth-user');
    const storedAuth = localStorage.getItem('auth-isAuthenticated');
    if (storedUser && storedAuth === 'true') {
      set({
        user: JSON.parse(storedUser),
        isAuthenticated: true
      });
    }
  }
}));

// Initialize immediately
useAuthStore.getState().initializeAuth();