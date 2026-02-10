import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  isDarkMode: false,
  
  toggleTheme: () => set((state) => {
    const newDarkMode = !state.isDarkMode;
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme-isDarkMode', newDarkMode.toString());
    return { isDarkMode: newDarkMode };
  }),
  
  setTheme: (isDark) => set(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme-isDarkMode', isDark.toString());
    return { isDarkMode: isDark };
  }),

  initializeTheme: () => {
    const stored = localStorage.getItem('theme-isDarkMode');
    if (stored !== null) {
      const isDark = stored === 'true';
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      set({ isDarkMode: isDark });
    }
  }
}));

// Initialize immediately
useThemeStore.getState().initializeTheme();