import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { login as apiLogin } from "../api/auth";
import toast from "react-hot-toast";

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
        const user = {
          id: "USER001",
          name: formData.username,
          username: formData.username,
          email: `${formData.username}@delivery.ma`,
          role: "admin",
        };

        login(user);
        toast.success("Connexion réussie! (Mode Mock)");
        navigate("/dashboard");
        setLoading(false);
      }, 500);

      /* ✅ REAL API LOGIN - Uncomment when backend is ready
      const response = await apiLogin(formData.username, formData.password);
      
      const user = {
        id: response.user?.id || 'USER001',
        name: response.user?.username || formData.username,
        username: formData.username,
        email: response.user?.email || '',
        role: response.user?.role || 'admin'
      };
      
      login(user);
      toast.success('Connexion réussie!');
      navigate('/dashboard');
      */
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Nom d'utilisateur ou mot de passe incorrect");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            DeliveryPro
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Connectez-vous à votre compte
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
              className="input-field"
              placeholder="admin"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              className="input-field"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full btn-primary"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
