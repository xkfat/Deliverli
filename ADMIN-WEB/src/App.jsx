import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/Login";
import { useAuthStore } from "./store/authStore";
import { useThemeStore } from "./store/themeStore";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Commandes from "./pages/Commandes";
import AddCommande from "./pages/AddCommande";
import Equipe from "./pages/Equipe";
import Calendar from "./pages/Calendar";
import LiveMap from "./pages/LiveMap";
import Heatmap from "./pages/Heatmap";
import Settings from "./pages/Settings";
import CommandHistory from "./pages/CommandHistory";

function App() {
  const { isAuthenticated } = useAuthStore();
  const { isDarkMode, setTheme } = useThemeStore();

  useEffect(() => {
    setTheme(isDarkMode);
  }, []);

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
          <Route path="/heatmap" element={<Heatmap />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/command-history" element={<CommandHistory />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
