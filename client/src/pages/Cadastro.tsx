import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import hero from "../assets/office2.jpg";
import { User, Mail, Lock, Phone, IdCard } from "lucide-react";

export default function Cadastro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    senha: "",
    confirmarSenha: "",
  });
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  // ============================================================
  // 🔥 API BASE URL DEFINITIVA (PROD / HOMOLOG / LOCAL)
  // ============================================================
  const API_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000";

  // ============================================================
  // 🔥 Detecta login social vindo via query param
  // ============================================================
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const social = params.get("social");

    if (social === "true") {
      const nome = params.get("nome") || "";
      const email = params.get("email") || "";
      const cpf = params.get("cpf") || "";
      const telefone = params.get("telefone") || "";

      registrarSocial({ nome, email, cpf, telefone });
    }
  }, []);

  // ============================================================
  // 🔥 Cadastro automático via login social
  // ==> Tipado corretamente para evitar TS7031
  // ============================================================
async function registrarSocial({
  nome,
  email,
  cpf,
  telefone,
}: {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
}) {
    try {
      const res = await fetch(`${API_URL}/cadastro-social`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, cpf, telefone }),
      });

      const data = await res.json();

      if (data.success) {
        navigate("/simulador");
      } else {
        console.error("Erro:", data.error);
      }
    } catch (err) {
      console.error("Erro ao cadastrar social:", err);
    }
  }

  // ============================================================
  // 🔥 Cadastro manual
  // ============================================================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (form.senha !== form.confirmarSenha)
      return setErro("As senhas não coincidem!");

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/cadastro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          cpf: form.cpf,
          telefone: form.telefone,
          senha: form.senha,
        }),
      });

      let data = null;
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }

      if (res.ok) {
        navigate("/simulador");
      } else {
        setErro(data?.error || "Erro ao cadastrar. Tente novamente.");
      }
    } catch (err: any) {
      console.error("Erro no cadastro:", err);
      setErro(err.message || "Falha na conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // 🔥 FRONTEND
  // ============================================================
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
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
              Crie sua conta na{" "}
              <span className="text-yellow-400">AltivaCred</span>
            </h1>
            <p className="text-gray-200 text-lg leading-relaxed">
              Agilidade, transparência e tecnologia em cada etapa do crédito.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 flex items-start justify-center md:relative md:items-center md:flex-1 overflow-y-auto pt-10 md:pt-0"
      >
        <div className="w-11/12 max-w-md bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 md:p-10 mb-10 md:mb-0">
          <h2 className="text-3xl font-bold text-center text-[#0b1c3a] mb-8">
            Criar Conta
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { name: "nome", label: "Nome", icon: User },
              { name: "email", label: "E-mail", icon: Mail },
              { name: "cpf", label: "CPF", icon: IdCard },
              { name: "telefone", label: "Telefone", icon: Phone },
            ].map(({ name, label, icon: Icon }) => (
              <div key={name} className="relative">
                <Icon className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
                <input
                  type={name === "email" ? "email" : "text"}
                  name={name}
                  placeholder={label}
                  value={form[name as keyof typeof form]}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
                  required
                />
              </div>
            ))}

            <div className="relative">
              <Lock className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
              <input
                type="password"
                name="senha"
                placeholder="Senha"
                value={form.senha}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
              <input
                type="password"
                name="confirmarSenha"
                placeholder="Confirmar senha"
                value={form.confirmarSenha}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
                required
              />
            </div>

            {erro && (
              <p className="text-red-500 text-center text-sm">{erro}</p>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              type="submit"
              className="w-full bg-yellow-400 text-[#0b1c3a] font-semibold py-3 rounded-lg hover:bg-yellow-300 transition shadow-lg"
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </motion.button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Já tem conta?{" "}
            <Link
              to="/simulador"
              className="text-yellow-500 font-semibold hover:underline"
            >
              Acesse com login social
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
