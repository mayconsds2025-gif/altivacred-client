// src/pages/UserDashboard.tsx
import React, { useState } from "react";
import { ShieldCheck, Zap, Clock3 } from "lucide-react";

// CARDS
import CardOfertaPresenca from "../components/Cards/CardOfertaPresenca";

// POPUPS
import PopupTermo from "../components/Presenca/PopupTermo";

import { useAuth } from "../context/AuthContext";

// ASSETS
import presencaLogo from "../assets/CLT.png";
import bannerPropostas from "../assets/MinhasPropostas.png";

// ⚠️ Ajuste este número para o WhatsApp comercial correto, se necessário.
const WHATSAPP_NUMERO = "5511977191411";
const WHATSAPP_MENSAGEM =
  "Olá, gostaria de obter minha simulação do Crédito do Trabalhador";

export default function UserDashboard() {
  // -------------------------------- STATES --------------------------------
  const [showPopupPresencaCLT, setShowPopupPresencaCLT] = useState(false);

  // DADOS PESSOAIS
  const [nomePres, setNomePres] = useState("");
  const [cpfPres, setCpfPres] = useState("");
  const [telefonePres, setTelefonePres] = useState("");
  const [emailPres, setEmailPres] = useState("");
  const [dataNascPres, setDataNascPres] = useState("");
  const [salarioBruto, setSalarioBruto] = useState("");

  // CONTRATO TEMPO (CLT)
  const [anosContrato, setAnosContrato] = useState("");
  const [mesesContrato, setMesesContrato] = useState("");

  // DADOS DO POPUP TERMO (CLT)
  const [tamanhoEmpresa, setTamanhoEmpresa] = useState("");

  // ESTADO DE LOADING (CLT)
  const [loadingPres, setLoadingPres] = useState(false);

  const { user } = useAuth();

  // BASE API
  const API_BASE =
    ["localhost", "127.0.0.1"].includes(window.location.hostname)
      ? "http://localhost:5000"
      : process.env.REACT_APP_API_URL;

  // ------------------------------ SALVAR PROGRESSO (LEAD) ------------------------------
  const salvarProgressoBackend = async (extra: any = {}) => {
    try {
      const userStr = localStorage.getItem("altiva_user");
      const localUser = userStr ? JSON.parse(userStr) : null;
      const email = user?.email || localUser?.email;
      if (!email) return;

      await fetch(`${API_BASE}/progresso/salvar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          cpf: cpfPres,
          nome: nomePres,
          telefone: telefonePres,
          etapa: extra.etapaContratacao ?? 1,
          dados: {
            cpf: cpfPres,
            nome: nomePres,
            telefone: telefonePres,
            email,
            dataNascPres,
            anosContrato,
            mesesContrato,
            tamanhoEmpresa,
            salarioBruto,
            bancoSelecionado: "presenca_clt",
            ...extra,
          },
        }),
      });
    } catch {
      // Falha ao salvar progresso não deve bloquear o redirecionamento ao WhatsApp
    }
  };

  // ------------------------------ PRESENÇA CLT: ENVIAR TERMO ------------------------------
  // Ao final do preenchimento do PopupTermo, salvamos o lead e
  // redirecionamos o usuário diretamente para o WhatsApp.
  const enviarPresencaCLT = async (dadosDoPopup?: any) => {
    const dadosFinais = dadosDoPopup || {
      nome: nomePres,
      cpf: cpfPres,
      telefone: telefonePres,
      email: emailPres,
      dataNascimento: dataNascPres,
      anosContrato,
      mesesContrato,
      tamanhoEmpresa,
      salarioBruto,
    };

    setLoadingPres(true);

    try {
      // Sincroniza os dados vindos do popup nos states globais
      setNomePres(dadosFinais.nome ?? nomePres);
      setCpfPres(dadosFinais.cpf ?? cpfPres);
      setTelefonePres(dadosFinais.telefone ?? telefonePres);
      if (dadosFinais.email) setEmailPres(dadosFinais.email);
      if (dadosFinais.dataNascimento) setDataNascPres(dadosFinais.dataNascimento);

      await salvarProgressoBackend({
        etapaContratacao: 1,
        bancoSelecionado: "presenca_clt",
        ...dadosFinais,
      });

      const mensagem = encodeURIComponent(WHATSAPP_MENSAGEM);
      window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${mensagem}`, "_blank");
    } catch (e) {
      console.error("Erro ao enviar dados do Crédito CLT:", e);
    } finally {
      setLoadingPres(false);
      setShowPopupPresencaCLT(false);
    }
  };

  // ------------------------------ ABRIR POPUP CLT ------------------------------
  const abrirPopupPresencaCLT = () => {
    setShowPopupPresencaCLT(true);
  };

  // ------------------------------ STYLES INLINE ------------------------------
  const customStyles = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.6s ease-out forwards;
    }

    @keyframes floatSlow {
      0%, 100% { transform: translateY(0) translateX(0); }
      50% { transform: translateY(-14px) translateX(8px); }
    }
    .animate-float-slow {
      animation: floatSlow 9s ease-in-out infinite;
    }
    .animate-float-slow-delayed {
      animation: floatSlow 11s ease-in-out infinite;
      animation-delay: 1.5s;
    }
  `;

  // ------------------------------ TRUST BADGES ------------------------------
  const trustItems = [
    { icon: ShieldCheck, label: "100% seguro e digital" },
    { icon: Zap, label: "Liberação em até 24h úteis" },
    { icon: Clock3, label: "Simulação em poucos minutos" },
  ];

  // ------------------------------ RENDER ------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pb-24 px-0 flex flex-col items-center relative font-sans text-slate-800 overflow-x-hidden">
      <style>{customStyles}</style>

      {/* --- BANNER HERO COM IDENTIDADE NAVY + EMERALD --- */}
      <div className="relative w-full h-[240px] md:h-[300px] overflow-hidden shadow-md z-0">
        <img
          src={bannerPropostas}
          alt="Banner"
          className="w-full h-full object-cover"
        />

        {/* Overlay navy institucional, alinhado ao theme-color do site (#0b1c3a) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540] via-[#0A2540]/70 to-[#0A2540]/20 pointer-events-none" />

        {/* Blobs decorativos sutis, em emerald/teal — mesma paleta dos CTAs */}
        <div className="absolute -left-10 top-6 w-52 h-52 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute right-0 bottom-0 w-64 h-64 rounded-full bg-teal-400/15 blur-3xl pointer-events-none animate-float-slow-delayed" />

        <div className="absolute inset-0 flex flex-col justify-center items-center z-10 px-4">
          {/* Badge de confiança */}
          <span className="animate-fade-in-up inline-flex items-center gap-1.5 mb-4 px-4 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider text-emerald-50 bg-white/10 border border-white/20 backdrop-blur-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            Crédito do Trabalhador
          </span>

          <h1 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight text-center drop-shadow-lg animate-fade-in-up">
            Simule e Contrate
          </h1>
          <p
            className="text-white/80 text-sm md:text-lg mt-3 text-center max-w-xl animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            Solicite seu Crédito CLT de forma rápida, segura e 100% digital.
          </p>
        </div>
      </div>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <div
        className="w-full max-w-7xl relative z-20 -mt-16 px-4 md:px-6 flex flex-col items-center animate-fade-in-up"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="w-full sm:w-[380px]">
          <CardOfertaPresenca
            banco={{
              id: "presenca_clt",
              nome: "Crédito CLT",
              tipo: "Crédito do Trabalhador",
              logo: presencaLogo,
            }}
            isManualBank={false}
            etapa={0}
            abrirPopupSimulacao={abrirPopupPresencaCLT}
            linkTermo={undefined}
            onAutorizar={undefined}
          />
        </div>

        {/* --- FAIXA DE CONFIANÇA --- */}
        <div className="mt-10 mb-2 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {trustItems.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 text-slate-500 text-xs sm:text-sm font-medium"
            >
              <span className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-emerald-600" />
              </span>
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* --- MODAL: PREENCHIMENTO DE DADOS --- */}
      <PopupTermo
        show={showPopupPresencaCLT}
        onClose={() => setShowPopupPresencaCLT(false)}
        nomePres={nomePres} setNomePres={setNomePres}
        cpfPres={cpfPres} setCpfPres={setCpfPres}
        telefonePres={telefonePres} setTelefonePres={setTelefonePres}
        emailPres={emailPres} setEmailPres={setEmailPres}
        dataNascPres={dataNascPres} setDataNascPres={setDataNascPres}
        anosContrato={anosContrato} setAnosContrato={setAnosContrato}
        mesesContrato={mesesContrato} setMesesContrato={setMesesContrato}
        tamanhoEmpresa={tamanhoEmpresa} setTamanhoEmpresa={setTamanhoEmpresa}
        salarioBruto={salarioBruto} setSalarioBruto={setSalarioBruto}
        enviar={enviarPresencaCLT}
        loading={loadingPres}
      />
    </div>
  );
}