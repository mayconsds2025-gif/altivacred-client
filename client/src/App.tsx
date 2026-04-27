import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Home from "./pages/Home";
import UserDashboard from "./pages/UserDashboard";
import NovoSaqueDashboard from "./pages/NovoSaqueDashboard"; // ✅ IMPORTADO
import Simulador from "./pages/Simulador";
import Sobre from "./pages/Sobre";
import ProdutoConsignadoCLT from "./pages/ProdutoConsignadoCLT";
import AdminDashboard from "./pages/AdminDashboard";
import CentralAjuda from "./pages/CentralAjuda";
import CRM from "./pages/CRM"; 
import MasterCRM from "./pages/MasterCRM";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import logo from "./assets/Logotipo.png";
import googleLogo from "./assets/google.png";

import CarEquity from "./pages/CarEquity";

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import "./firebaseConfig";

// =======================================================================
// NAVBAR (COMPONENTE DE NAVEGAÇÃO SUPERIOR)
// =======================================================================
function Navbar() {
  const { user, login, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // 🔒 AJUSTE: esconder navbar em /admin, /admin/crm e opcionalmente /novosaque se quiser foco total
  if (location.pathname === "/admin" || location.pathname === "/admin/crm" || location.pathname === "/admin/crm/master") {
    return null;
  }

  const links = [
    { name: "Produtos", path: "/produto-consignado-clt" },
    { name: "Por que a Nitz", path: "/sobre" },
    { name: "Central de Ajuda", path: "/ajuda" },
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
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="
        fixed top-0 left-0 w-full z-50 backdrop-blur-xl
        bg-[#0A2540]/80 border-b border-white/10 shadow-lg
      "
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-8 py-4">
        <Link to="/" className="flex items-center space-x-3">
          <motion.img
            src={logo}
            alt="Nitz"
            className="w-40 md:w-52 h-auto object-contain drop-shadow-lg"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
          />
        </Link>

        <div className="hidden md:flex items-center space-x-10 text-base font-medium ml-auto mr-6">
          {links.map((link) => (
            <motion.div
              key={link.name}
              whileHover={{ scale: 1.04, y: -2 }}
              className="relative group cursor-pointer"
            >
              <Link
                to={link.path}
                className={`transition-all duration-300 ${
                  location.pathname === link.path
                    ? "text-[#7BD4FF] font-semibold"
                    : "text-white"
                }`}
              >
                {link.name}
              </Link>

              <span
                className={`
                  absolute left-0 bottom-[-6px] h-[2px] bg-[#7BD4FF] 
                  transition-all duration-300
                  ${
                    location.pathname === link.path
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }
                `}
              />
            </motion.div>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <div className="flex items-center gap-3">
                {user.foto ? (
                  <img
                    src={user.foto}
                    alt="Foto"
                    className="w-10 h-10 rounded-full border border-[#7BD4FF] shadow-md"
                  />
                ) : (
                  <div
                    className="
                    bg-gradient-to-br from-[#7BD4FF] to-[#3B82F6]
                    w-10 h-10 flex items-center justify-center
                    rounded-full text-white font-bold shadow-lg
                  "
                  >
                    {user.nome[0]?.toUpperCase()}
                  </div>
                )}
                <span className="text-[#CFE9FF] font-semibold">
                  Olá, {user.nome.split(" ")[0]}!
                </span>
              </div>

              <motion.button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                className="
                  px-5 py-2 rounded-full font-semibold
                  bg-white/10 border border-white/20 text-[#7BD4FF]
                  hover:bg-white/20 transition-all shadow-md
                "
              >
                Sair
              </motion.button>
            </>
          ) : (
            <motion.button
              onClick={handleGoogleLogin}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              className="
                flex items-center gap-2 bg-white text-[#0A2540]
                font-semibold py-2 px-6 rounded-full shadow-lg
                hover:opacity-90 transition-all
              "
            >
              <img src={googleLogo} alt="Google" className="w-5 h-5" />
              Entrar
            </motion.button>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? (
            <X className="w-7 h-7 text-white" />
          ) : (
            <Menu className="w-7 h-7 text-white" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="
              md:hidden backdrop-blur-2xl bg-[#0A2540]/95 border-t border-white/10
            "
          >
            <div className="flex flex-col items-center py-6 space-y-6 text-lg font-semibold">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className="text-white hover:text-[#7BD4FF] transition"
                >
                  {link.name}
                </Link>
              ))}

              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                    navigate("/");
                  }}
                  className="
                    text-[#7BD4FF] border border-[#7BD4FF]
                    py-2 px-6 rounded-full"
                >
                  Sair
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleGoogleLogin();
                  }}
                  className="
                    flex items-center gap-2 bg-white text-[#0A2540]
                    py-2 px-6 rounded-full shadow-md
                  "
                >
                  <img src={googleLogo} alt="Google" className="w-5 h-5" />
                  Entrar
                </button>
              )}
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
    location.pathname === "/admin/crm"||
    location.pathname === "/admin/crm/master";

  return (
    <>
      <Navbar />
      <div className={isAdmin ? "" : "pt-20 bg-[#F9FAFB] min-h-screen"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/ajuda" element={<CentralAjuda />} />
          <Route path="/simulador" element={<Simulador />} />
          <Route
            path="/produto-consignado-clt"
            element={<ProdutoConsignadoCLT />}
          />

          <Route path="/car-equity" element={<CarEquity />} />

          {/* DASHBOARD GERAL */}
          <Route
            path="/usuario/dashboard"
            element={
              <PrivateRoute>
                <UserDashboard />
              </PrivateRoute>
            }
          />

          {/* ✅ NOVA ROTA FOCADA NO NOVO SAQUE */}
        <Route
  path="/novosaque"
  element={<NovoSaqueDashboard />}
/>


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