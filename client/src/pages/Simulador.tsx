// Simulador.tsx (completo) - salvar/carregar progresso + login social
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GoogleLogo from "../assets/google.png";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebaseConfig";

const steps = [
  { name: "valor", label: "De quanto você precisa?" },
  { name: "parcelas", label: "Em quantas parcelas quer pagar?" },
  { name: "cpf", label: "Informe seu CPF", type: "text", placeholder: "000.000.000-00" },
  { name: "telefone", label: "Informe seu telefone", type: "text", placeholder: "(00) 00000-0000" },
  { name: "login", label: "Acesse sua conta Nitz para receber sua proposta" },
];

const Simulador: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    valor: 500,
    parcelas: "",
    cpf: "",
    telefone: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : process.env.REACT_APP_API_URL;


  const current = steps[step];
  const progressPercent = Math.round(((step + 1) / steps.length) * 100);

  // ----- SAVE PROGRESS -----
  const saveProgress = async (nextStep?: number, customData?: any) => {
    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      if (!user?.email) return; // só salva quando tivermos email

      const payload = {
        email: user.email,
        cpf: form.cpf || user.cpf || "",
        etapa: typeof nextStep === "number" ? nextStep : step,
        dados: customData ?? form,
      };

      await fetch(`${API_URL}/progresso/salvar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn("Erro ao salvar progresso:", err);
    }
  };

  // ----- LOAD PROGRESS -----
  const loadProgress = async () => {
    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      if (!user?.email) return;

      const res = await fetch(`${API_URL}/progresso/${encodeURIComponent(user.email)}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.existe) {
        setForm((prev) => ({ ...prev, ...(data.dados || {}) }));
        setStep(data.etapa ? Number(data.etapa) - 1 >= 0 ? Number(data.etapa) - 1 : 0 : 0);
        // Nota: se você preferir que etapa seja 0-based no DB, remova o -1 acima.
      }
    } catch (err) {
      console.warn("Erro ao carregar progresso:", err);
    }
  };

  useEffect(() => {
    // tenta restaurar user do localStorage no mount (caso AuthContext não tenha persistido)
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const usr = JSON.parse(userStr);
        if (usr?.email) {
          // opcional: sincronizar com AuthContext se necessário
          // login({ nome: usr.nome, email: usr.email, cpf: usr.cpf, foto: usr.foto });
        }
      } catch {}
    }
    loadProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----- INPUT HANDLERS -----
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleNext = async () => {
    setErrorMessage(null);
    if (step < steps.length - 1) {
      // salva a etapa que o usuário vai para (1-based no backend)
      await saveProgress(step + 2, form); // se backend usa etapa 1..N
      setStep((s) => s + 1);
    }
  };

  const handleBack = async () => {
    setErrorMessage(null);
    await saveProgress(Math.max(1, step), form); // salvar etapa anterior
    setStep((s) => Math.max(0, s - 1));
  };

  // ----- SOCIAL LOGIN (Google) -----
  const handleSocialLogin = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      // 1) autentica com google
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const nome = user.displayName || "Usuário Google";
      const email = user.email || "";
      const foto = user.photoURL || "";
      const cpf = form.cpf;
      const telefone = form.telefone;

      // exige CPF antes do login (se esse for o requisito do seu produto)
      if (!cpf) {
        throw new Error("Informe o CPF antes de continuar com o login.");
      }

      // 2) salva o progresso antes de chamar o backend (garante estado)
      await saveProgress(step + 1, form);

      // 3) chama o backend para criar/atualizar usuário social
      const cadastroResp = await fetch(`${API_URL}/auth/social`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf, nome, email, telefone, foto }),
      });

      const dbResp = await cadastroResp.json();
      if (!cadastroResp.ok) {
        // backend costuma retornar 200 com {sucesso:false} ou 500; trata ambos
        const msg = dbResp?.erro || dbResp?.error || dbResp?.message || "Erro ao registrar no backend";
        throw new Error(msg);
      }

      // 4) persiste o user localmente e no contexto
      const userObj = {
        nome,
        email,
        cpf,
        foto,
      };
      localStorage.setItem("user", JSON.stringify(userObj));
      login(userObj);

      // 5) redireciona pro dashboard
      navigate("/usuario/dashboard");
    } catch (err: any) {
      console.error("Erro no login social:", err);
      setErrorMessage(err?.message || "Falha no login social.");
    } finally {
      setLoading(false);
    }
  };

  // ----- UI -----
  return (
    <main className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center px-6 py-20 text-[#0A2540]">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl bg-white rounded-2xl shadow-[0_8px_40px_rgba(15,23,42,0.08)] p-8 border border-[#E5E7EB]"
      >
        {/* progresso */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-[#0A2540]/70">
              Etapa {step + 1} de {steps.length}
            </span>
            <span className="text-sm font-semibold text-[#3B82F6]">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
            <motion.div
              className="h-2 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={steps[step].name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
          >
            {/* VALOR */}
            {current.name === "valor" && (
              <div className="flex flex-col items-center space-y-6">
                <h2 className="text-2xl font-bold text-center mb-4">{current.label}</h2>
                <motion.p
                  key={form.valor}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-3xl font-extrabold text-[#3B82F6]"
                >
                  R$ {Number(form.valor).toLocaleString("pt-BR")}
                </motion.p>

                <div className="relative w-full">
                  <input
                    type="range"
                    name="valor"
                    min="500"
                    max="30000"
                    step="100"
                    value={form.valor}
                    onChange={(e) => setForm((s) => ({ ...s, valor: Number(e.target.value) }))}
                    className="w-full appearance-none bg-transparent cursor-pointer"
                  />
                  <div className="w-full flex justify-between text-xs text-gray-500 mt-2">
                    <span>R$ 500</span>
                    <span>R$ 30.000</span>
                  </div>
                </div>
              </div>
            )}

            {/* PARCELAS */}
            {current.name === "parcelas" && (
              <div className="grid grid-cols-2 gap-4">
                {["6x", "12x", "18x", "24x"].map((option) => (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    key={option}
                    onClick={() => setForm({ ...form, parcelas: option })}
                    className={`py-4 rounded-xl border text-lg font-semibold transition-all ${
                      form.parcelas === option
                        ? "bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white border-[#3B82F6] shadow-md"
                        : "bg-white text-[#0A2540] border-[#E5E7EB] hover:border-[#3B82F6]"
                    }`}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            )}

            {/* CPF / TELEFONE */}
            {["cpf", "telefone"].includes(current.name) && (
              <input
                type="text"
                name={current.name}
                placeholder={(current as any).placeholder || ""}
                value={(form as any)[current.name]}
                onChange={handleChange}
                className="w-full p-4 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
            )}

            {/* LOGIN */}
            {current.name === "login" && (
              <div className="flex flex-col items-center text-center space-y-6 mt-6">
                <h2 className="text-2xl font-bold text-[#3B82F6] leading-snug">
                  Acesse sua conta Nitz para receber sua proposta
                </h2>

                <button
                  onClick={handleSocialLogin}
                  disabled={loading}
                  className="flex items-center justify-center w-full gap-3 py-3 border border-[#E5E7EB] rounded-full hover:border-[#3B82F6]"
                >
                  <img src={GoogleLogo} alt="Google" className="w-5 h-5" />
                  {loading ? "Entrando..." : "Entrar com Google"}
                </button>

                <p className="text-xs text-gray-500 max-w-sm">
                  Ao continuar, você concorda que a <span className="text-[#3B82F6] font-semibold">Nitz Digital</span> poderá
                  consultar seus dados para criar ou acessar sua conta.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}

        <div className="flex justify-between mt-10">
          <button
            onClick={handleBack}
            disabled={step === 0 || loading}
            className={`flex items-center gap-2 px-6 py-3 rounded-full border border-[#E5E7EB] font-semibold transition ${
              step === 0 ? "opacity-40 cursor-not-allowed" : "hover:border-[#3B82F6]"
            } ${loading ? "opacity-60 cursor-wait" : ""}`}
          >
            <ChevronLeft className="w-5 h-5" /> Voltar
          </button>

          <button
            onClick={handleNext}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-[#3B82F6] text-white font-semibold rounded-full hover:bg-[#2563EB] transition disabled:opacity-60 disabled:cursor-wait"
          >
            {loading ? "Aguarde..." : step === steps.length - 1 ? "Concluir" : "Avançar"}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </main>
  );
};

export default Simulador;
