import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import hero from "../assets/hero2.jpg";
import GoogleLogo from "../assets/google.png";
import OutlookLogo from "../assets/outlook.png";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const API_URL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:5000"
      : "https://altivacred-server.onrender.com";

  // Faz o registro opcional no backend; se falhar, continua apenas com o frontend (social-only).
  const registerBackend = async (payload: { cpf: string; nome: string; email: string; telefone?: string }) => {
    try {
      const res = await fetch(`${API_URL}/cadastro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      // backend pode retornar 200 com mensagem de "Já cadastrado" — não interrompemos o fluxo
      return { ok: res.ok, data };
    } catch (err) {
      // se falhar, não bloqueia o login social (modo offline)
      console.warn("Não foi possível registrar no backend (ignorado):", err);
      return { ok: false, data: null };
    }
  };

  const handleSocialLogin = async (provider: "google" | "outlook") => {
    setError(null);
    if (!cpf || cpf.trim().length < 6) {
      setError("Informe um CPF válido antes de continuar com o login social.");
      return;
    }

    setLoading(true);
    try {
      // Dados mock (substitua pelo payload real do provider quando integrar o OIDC)
      const mockData =
        provider === "google"
          ? { email: "usuario@gmail.com", nome: "Usuário Google" }
          : { email: "usuario@outlook.com", nome: "Usuário Outlook" };

      const userPayload = {
        cpf: cpf,
        nome: mockData.nome,
        email: mockData.email,
        telefone: undefined,
      };

      // tenta registrar no backend (não obrigatório)
      await registerBackend(userPayload);

      // salva no contexto e localStorage (autenticação social efetiva)
      login({
        nome: mockData.nome,
        email: mockData.email,
        cpf,
      });
      localStorage.setItem("userCpf", cpf);

      // redireciona direto pro dashboard do usuário
      navigate(`/usuario/${encodeURIComponent(cpf)}`);
    } catch (err: any) {
      console.error("Erro no login social:", err);
      setError("Erro ao efetuar login social. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* HERO */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative flex-1 overflow-hidden"
      >
        <img
          src={hero}
          alt="AltivaCred hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b1c3a]/85 to-[#1b3e74]/85" />

        <div className="hidden md:flex absolute inset-0 z-10 items-center justify-center text-center px-10 text-white">
          <div className="max-w-md">
            <h1 className="text-5xl font-extrabold leading-tight mb-4">
              Bem-vindo à <span className="text-yellow-400">AltivaCred</span>
            </h1>
            <p className="text-gray-200 text-lg leading-relaxed">
              Acesse sua conta com login social e vá direto para sua área pessoal.
            </p>
          </div>
        </div>
      </motion.div>

      {/* FORM / SOCIAL */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 flex items-start justify-center md:relative md:items-center md:flex-1 overflow-y-auto pt-10 md:pt-0"
      >
        <div className="w-11/12 max-w-md bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 md:p-10 mb-10 md:mb-0 md:-mt-8">
          <h2 className="text-3xl font-bold text-center text-[#0b1c3a] mb-6">Entrar com Conta Social</h2>

          <p className="text-sm text-gray-600 mb-4">
            Informe seu CPF para conectar a conta social ao seu perfil (necessário para seu dashboard).
            Se já tiver usado o simulador, use o mesmo CPF.
          </p>

          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-2">CPF</label>
            <input
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="000.000.000-00"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

          <div className="space-y-3">
            <button
              onClick={() => handleSocialLogin("google")}
              disabled={loading}
              className="flex items-center gap-3 justify-center w-full py-3 border rounded-full hover:border-[#3B82F6] transition font-medium"
            >
              <img src={GoogleLogo} alt="Google" className="w-5 h-5" />
              {loading ? "Entrando..." : "Entrar com Google"}
            </button>

            <button
              onClick={() => handleSocialLogin("outlook")}
              disabled={loading}
              className="flex items-center gap-3 justify-center w-full py-3 border rounded-full hover:border-[#3B82F6] transition font-medium"
            >
              <img src={OutlookLogo} alt="Outlook" className="w-5 h-5" />
              {loading ? "Entrando..." : "Entrar com Outlook"}
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Ao entrar, você será redirecionado diretamente para sua área pessoal.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
