import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
// import { login as apiLogin } from "../api/auth"; // Keep commented if not used yet
import toast from "react-hot-toast";
import logoImg from "../assets/logo.png"; // Ensure path is correct

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    try {
      setLoading(true);

      // ✅ MOCK LOGIN - Remove when backend is ready
     setTimeout(() => {
      const { username, password } = formData;
      let role = "";

      // Credentials Check
      if (username === "admin" && password === "pass123") {
        role = "admin";
      } else if (username === "gestion" && password === "pass123") {
        role = "gestionnaire";
      } else {
        toast.error("Identifiants invalides (admin/pass123 ou gestion/pass123)");
        setLoading(false);
        return;
      }

       const user = {
        id: role === "admin" ? "ADM001" : "GES001",
        name: username.charAt(0).toUpperCase() + username.slice(1),
        username: username,
        email: `${username}@delivery.ma`,
        role: role, // This is the key field for the sidebar
      };

      login(user);
      toast.success(`Bienvenue, ${user.name}!`);
      navigate("/dashboard");
      setLoading(false);
    }, 800);

  } catch (error) {
    toast.error("Erreur de connexion");
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        
        {/* Updated Header with BIGGER Logo */}
        <div className="flex flex-col items-center text-center">
          <img 
            src={logoImg} 
            alt="Delivery Pro Logo" 
            // Changed h-24 to h-40 for a bigger logo, increased margin bottom slightly
            className="h-80 w-auto mb-6 object-contain drop-shadow-sm transition-transform hover:scale-105" 
          />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sr-only">
            DeliveryPro
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Bienvenue! Connectez-vous à votre compte
          </p>
        </div>

        {/* Removed the colored border from the card */}
        <form onSubmit={handleSubmit} className="card space-y-6 shadow-2xl">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
              className="input-field w-full py-3"
              placeholder="admin"
              disabled={loading}
              autoFocus
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Mot de passe
                </label>
            </div>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              className="input-field w-full py-3"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full btn-primary py-3 text-lg font-semibold shadow-md hover:shadow-lg transition-all transform active:scale-[0.98]"
            disabled={loading}
          >
            {loading ? (
                <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion...
                </span>
            ) : "Se connecter"}
          </button>
        </form>
        
        
      </div>
    </div>
  );
};

export default Login;