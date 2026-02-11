import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Commandes from "./pages/Commandes";
import AddCommande from "./pages/AddCommande";
import Equipe from "./pages/Equipe";
import Calendar from "./pages/Calendar"; 
import CommandHistory from "./pages/CommandHistory";
import LiveMap from "./pages/LiveMap";
import { useAuthStore } from "./store/authStore";
import { useThemeStore } from "./store/themeStore";
import { useCommandesStore } from "./store/commandesStore"; // 1. Import the store
import { mockCommandes, mockLivreurs, mockGestionnaires } from "./utils/mockData"; // 2. Import your JSON data
import Layout from "./components/layout/Layout";
// ... other imports

function App() {
  const { isAuthenticated } = useAuthStore();
  const { isDarkMode, setTheme } = useThemeStore();
  
  // 3. Extract the sync function from your store
  const syncAllData = useCommandesStore((state) => state.syncAllData);

  useEffect(() => {
    setTheme(isDarkMode);
    
    // 4. Initialize the global state with your mock data
    // This ensures data is loaded as soon as the app starts
    syncAllData({
      commandes: mockCommandes,
      livreurs: mockLivreurs,
      gestionnaires: mockGestionnaires
    });
  }, [syncAllData, isDarkMode, setTheme]);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
        />

        <Route
          element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/commandes" element={<Commandes />} />
          <Route path="/add-commande" element={<AddCommande />} />
          <Route path="/equipe" element={<Equipe />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/live-map" element={<LiveMap />} />
  
        </Route>
      </Routes>
    </Router>
  );
}

export default App;