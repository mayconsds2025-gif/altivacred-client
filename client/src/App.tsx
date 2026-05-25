import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import HomePage from "./pages/Home";
import UserDashboard from "./pages/UserDashboard";
import NovoSaqueDashboard from "./pages/NovoSaqueDashboard";
import Simulador from "./pages/Simulador";
import Sobre from "./pages/Sobre";
import ProdutoConsignadoCLT from "./pages/ProdutoConsignadoCLT";
import AdminDashboard from "./pages/AdminDashboard";
import CentralAjuda from "./pages/CentralAjuda";
import CRM from "./pages/CRM";
import MasterCRM from "./pages/MasterCRM";
import CapturaLead from "./pages/SaibaMais";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import logo from "./assets/Logotipo.png";
import googleLogo from "./assets/google.png";

import CarEquity from "./pages/CarEquity";

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import "./firebaseConfig";

// =======================================================================
// NAVBAR PREMIUM (COMPONENTE DE NAVEGAÇÃO SUPERIOR)
// =======================================================================
function Navbar() {
  const { user, login, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Detectar scroll para efeito glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔒 Esconder navbar em rotas admin e captura
  if (
    location.pathname === "/admin" ||
    location.pathname === "/admin/crm" ||
    location.pathname === "/admin/crm/master" ||
    location.pathname === "/saiba-mais"
  ) {
    return null;
  }

  const links = [
    { name: "Cidades", path: "/sobre" },
    { name: "Como Funciona", path: "/produto-consignado-clt" },
    { name: "Depoimentos", path: "/ajuda" },
  ];

  const handleGoogleLogin = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const userG = result.user;
      const payload = {
        cpf: null,
        nome: userG.displayName || "Usuário",
        email: userG.email,
        telefone: null,
        foto: userG.photoURL,
      };

      const API_URL =
        process.env.REACT_APP_API_URL || "http://localhost:5000";

      const resp = await fetch(`${API_URL}/auth/social`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data;
      try {
        data = await resp.json();
      } catch {
        data = {};
      }

      login({
        nome: data?.usuario?.nome || payload.nome,
        email: data?.usuario?.email || payload.email,
        cpf: data?.usuario?.cpf || null,
        foto: payload.foto ?? undefined,
      });

      const from = location.state?.from || "/usuario/dashboard";
      navigate(from, { replace: true });
    } catch (err) {
      console.error("[GOOGLE] Erro:", err);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`
        fixed top-0 left-0 w-full z-50 transition-all duration-500
        ${
          scrolled
            ? "bg-white/80 backdrop-blur-2xl border-b border-emerald-100/50 shadow-sm"
            : "bg-white border-b border-transparent"
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="relative group">
            <motion.img
              src={logo}
              alt="Kant Digital"
              className="h-10 md:h-12 w-auto object-contain"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            />
          </Link>

          {/* Links Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="relative group px-4 py-2"
              >
                <span
                  className={`
                    text-sm font-semibold transition-colors duration-300
                    ${
                      location.pathname === link.path
                        ? "text-emerald-700"
                        : "text-gray-700 group-hover:text-emerald-600"
                    }
                  `}
                >
                  {link.name}
                </span>

                {/* Indicador animado */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{
                    scaleX: location.pathname === link.path ? 1 : 0,
                  }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            ))}
          </div>

          {/* Actions Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-50/50">
                  {user.foto ? (
                    <img
                      src={user.foto}
                      alt="Foto"
                      className="w-8 h-8 rounded-full border-2 border-emerald-500"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm font-bold">
                      {user.nome[0]?.toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-semibold text-gray-700">
                    {user.nome.split(" ")[0]}
                  </span>
                </div>

                <motion.button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-emerald-700 transition-colors"
                >
                  Sair
                </motion.button>
              </>
            ) : (
              <motion.button
                onClick={handleGoogleLogin}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-6 py-2.5 rounded-full overflow-hidden"
              >
                {/* Background gradient animado */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 transition-transform group-hover:scale-105" />

                {/* Brilho hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                <span className="relative flex items-center gap-2 text-sm font-bold text-white">
                  <img src={googleLogo} alt="Google" className="w-4 h-4" />
                  Começar
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            )}
          </div>

          {/* Hamburger Mobile */}
          <motion.button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {menuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6 text-gray-700" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6 text-gray-700" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Menu Mobile */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-2xl border-t border-emerald-100"
          >
            <div className="px-6 py-6 space-y-4">
              {links.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={`
                      block px-4 py-3 rounded-xl font-semibold transition-all
                      ${
                        location.pathname === link.path
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }
                    `}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: links.length * 0.1 }}
                className="pt-4 border-t border-gray-100"
              >
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 rounded-xl">
                      {user.foto ? (
                        <img
                          src={user.foto}
                          alt="Foto"
                          className="w-10 h-10 rounded-full border-2 border-emerald-500"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold">
                          {user.nome[0]?.toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-bold text-gray-900">
                          {user.nome.split(" ")[0]}
                        </div>
                        <div className="text-xs text-gray-600">
                          {user.email}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                        navigate("/");
                      }}
                      className="w-full px-4 py-3 text-center font-semibold text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      Sair
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleGoogleLogin();
                    }}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
                  >
                    <img src={googleLogo} alt="Google" className="w-5 h-5" />
                    Começar Agora
                  </button>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// =======================================================================
// APP WRAPPER E ROTAS
// =======================================================================
function AppContent() {
  const location = useLocation();
  const isAdmin =
    location.pathname === "/admin" ||
    location.pathname === "/admin/crm" ||
    location.pathname === "/admin/crm/master";

  const isCaptura = location.pathname === "/saiba-mais";

  return (
    <>
      <Navbar />
      <div className={isAdmin || isCaptura ? "" : "pt-20 bg-white min-h-screen"}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/ajuda" element={<CentralAjuda />} />
          <Route path="/simulador" element={<Simulador />} />
          <Route
            path="/produto-consignado-clt"
            element={<ProdutoConsignadoCLT />}
          />

          <Route path="/car-equity" element={<CarEquity />} />

          {/* PÁGINA DE CAPTURA DE LEADS */}
          <Route path="/saiba-mais" element={<CapturaLead />} />

          {/* DASHBOARD GERAL */}
          <Route
            path="/usuario/dashboard"
            element={
              <PrivateRoute>
                <UserDashboard />
              </PrivateRoute>
            }
          />

          {/* ROTA NOVO SAQUE */}
          <Route path="/novosaque" element={<NovoSaqueDashboard />} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/crm" element={<CRM />} />
          <Route path="/admin/crm/master" element={<MasterCRM />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}