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
import { Menu, X, ArrowRight, MessageCircle } from "lucide-react";
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

// Número de WhatsApp para contato direto (formato internacional, sem símbolos)
const WHATSAPP_NUMBER = "5511959273817";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Olá! Gostaria de saber mais sobre o crédito CLT."
)}`;

// Altura aproximada da navbar fixa, usada para compensar o scroll até as seções
const NAVBAR_OFFSET = 96;

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET;
  window.scrollTo({ top: y, behavior: "smooth" });
}

// =======================================================================
// NAVBAR PREMIUM (COMPONENTE DE NAVEGAÇÃO SUPERIOR)
// =======================================================================
function Navbar() {
  const { user, login, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Detectar scroll para efeito glassmorphism + navbar compacta
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Travar o scroll do body quando o menu mobile está aberto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // 🔒 Esconder navbar em rotas admin e captura
  if (
    location.pathname === "/admin" ||
    location.pathname === "/admin/crm" ||
    location.pathname === "/admin/crm/master" ||
    location.pathname === "/saiba-mais"
  ) {
    return null;
  }

  // Links que apontam para seções da Home (scroll suave), não páginas separadas
  const sectionLinks = [
    { name: "Como funciona", id: "como-funciona" },
    { name: "Depoimentos", id: "depoimentos" },
    { name: "Dúvidas frequentes", id: "duvidas-frequentes" },
  ];

  // Navega até a seção — se já estiver na Home, só rola; se não, vai pra Home e rola em seguida
  const handleSectionClick = (id: string) => {
    const isHome = location.pathname === "/";

    setMenuOpen(false);
    // Libera o scroll do body na hora — sem isso, o menu mobile ainda está
    // travando o scroll no instante em que tentaríamos rolar até a seção.
    document.body.style.overflow = "";

    if (isHome) {
      // Espera a animação de fechamento do menu mobile terminar antes de rolar,
      // senão o cálculo de posição da seção acontece com o layout ainda mudando.
      setTimeout(() => scrollToId(id), 300);
    } else {
      navigate("/", { state: { scrollTo: id } });
    }
  };

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
        fixed top-0 left-0 w-full z-50 bg-white transition-shadow duration-500
        ${scrolled ? "shadow-[0_1px_0_0_rgba(16,185,129,0.12)]" : ""}
      `}
    >
      {/* Fio de acabamento no rodapé da navbar — substitui a borda genérica */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent transition-opacity duration-500 ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div
          className={`flex justify-between items-center transition-all duration-500 ${
            scrolled ? "h-16" : "h-24"
          }`}
        >
          {/* Logo */}
          <Link to="/" className="relative shrink-0">
            <motion.img
              src={logo}
              alt="Kant Digital"
              className="w-auto object-contain"
              animate={{ height: scrolled ? 40 : 56 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              whileHover={{ scale: 1.04 }}
            />
          </Link>

          {/* Links Desktop — âncoras para seções da Home */}
          <div className="hidden md:flex items-center gap-1">
            {sectionLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleSectionClick(link.id)}
                className="relative group px-4 py-2"
              >
                <span className="text-[15px] font-medium text-gray-600 group-hover:text-emerald-700 transition-colors duration-300">
                  {link.name}
                </span>

                <motion.span
                  className="absolute left-1/2 bottom-0 h-[2px] bg-emerald-600 rounded-full"
                  style={{ translateX: "-50%" }}
                  initial={false}
                  animate={{ width: "0%" }}
                  whileHover={{ width: "60%" }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                />
              </button>
            ))}
          </div>

          {/* Actions Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-emerald-200 text-emerald-700 text-sm font-semibold hover:bg-emerald-50 hover:border-emerald-300 transition-colors duration-300"
            >
              <MessageCircle className="w-4 h-4" />
              Fale conosco
            </a>

            {user ? (
              <>
                <div className="flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-full border border-emerald-100 bg-emerald-50/60">
                  {user.foto ? (
                    <img
                      src={user.foto}
                      alt="Foto"
                      className="w-8 h-8 rounded-full ring-2 ring-white"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-semibold">
                      {user.nome[0]?.toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {user.nome.split(" ")[0]}
                  </span>
                </div>

                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="text-sm font-medium text-gray-500 hover:text-emerald-700 transition-colors"
                >
                  Sair
                </button>
              </>
            ) : (
              <motion.button
                onClick={handleGoogleLogin}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group relative px-6 py-2.5 rounded-full overflow-hidden shadow-[0_8px_24px_-8px_rgba(5,150,105,0.55)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                <span className="relative flex items-center gap-2 text-sm font-semibold text-white">
                  Começar
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </motion.button>
            )}
          </div>

          {/* Hamburger Mobile */}
          <motion.button
            className="md:hidden p-2 -mr-2 rounded-full"
            onClick={() => setMenuOpen(!menuOpen)}
            whileTap={{ scale: 0.9 }}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
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
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden bg-white border-t border-emerald-50 overflow-hidden"
          >
            <div className="px-6 py-6 space-y-1">
              {sectionLinks.map((link, index) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06 }}
                >
                  <button
                    onClick={() => handleSectionClick(link.id)}
                    className="w-full text-left block px-4 py-3.5 rounded-xl text-[15px] font-medium text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    {link.name}
                  </button>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: sectionLinks.length * 0.06 }}
              >
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3.5 rounded-xl text-[15px] font-medium text-emerald-700 hover:bg-emerald-50 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  Fale conosco
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (sectionLinks.length + 1) * 0.06 }}
                className="pt-4 mt-3 border-t border-gray-100"
              >
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50/60 rounded-xl">
                      {user.foto ? (
                        <img
                          src={user.foto}
                          alt="Foto"
                          className="w-10 h-10 rounded-full ring-2 ring-white"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold">
                          {user.nome[0]?.toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {user.nome.split(" ")[0]}
                        </div>
                        <div className="text-xs text-gray-500">
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
                      className="w-full px-4 py-3 text-center font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
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
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-[0_8px_24px_-8px_rgba(5,150,105,0.55)]"
                  >
                    <img src={googleLogo} alt="Google" className="w-5 h-5" />
                    Começar agora
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
      <div className={isAdmin || isCaptura ? "" : "pt-24 bg-white min-h-screen"}>
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