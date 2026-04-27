import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, AlertCircle, RotateCcw, CheckCircle2 } from "lucide-react";

type CardOfertaProps = {
  banco: {
    id: string;
    nome: string;
    tipo: string;
    logo: string;
  };

  abrirPopupSimulacao: () => void;

  linkTermo?: string | null;
  etapa?: number;

  onAutorizar?: () => void;

  isManualBank?: boolean;
  onSimularManualWhatsApp?: () => void;

  fgtsLoadingTrigger?: boolean;
  onRetryFGTS?: () => void;
};

export default function CardOfertaPresenca({
  banco,
  abrirPopupSimulacao,
  linkTermo = null,
  etapa = 0,
  onAutorizar = () => {},

  isManualBank = false,
  onSimularManualWhatsApp,

  fgtsLoadingTrigger = false,
  onRetryFGTS,
}: CardOfertaProps) {
  // ----------------------------- ESTADOS DO LOADING ------------------------------
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [jaAutorizou, setJaAutorizou] = useState(false);


  const isFGTS = banco.id === "presenca_fgts";

  const isCarEquity =
    banco.tipo.toLowerCase().includes("veículo") ||
    banco.tipo.toLowerCase().includes("car equity");

  // ✅ NOVO: Saque com Cartão de Crédito (SEM alterar tema)
  const isSaqueCartao =
    banco.id === "saque_cartao" ||
    banco.tipo.toLowerCase().includes("cartão");

  // ----------------------------- VALORES DINÂMICOS ------------------------------
  const valorMinimo = isFGTS
    ? 100
    : isCarEquity
    ? 5000
    : isSaqueCartao
    ? 300
    : 800;

  const parcelamentoTexto = isFGTS
    ? "5x"
    : isCarEquity
    ? "Até 60 meses"
    : isSaqueCartao
    ? "Até 12x no cartão"
    : "6 a 24x";

  const taxaTexto = isCarEquity
    ? "0,99% a.m"
    : isSaqueCartao
    ? "A partir de 3,49% a.m"
    : "2,99% a.m";

  // ----------------------------- FGTS LOADING ------------------------------
  useEffect(() => {
    if (banco.id === "presenca_fgts" && fgtsLoadingTrigger) {
      setError(false);
      setProgress(0);
      setLoading(true);
    }
  }, [fgtsLoadingTrigger, banco.id]);

  // ----------------------------- PROGRESS BAR ------------------------------
useEffect(() => {
  if (!loading) {
    setProgress(0);
    return;
  }

  const totalDuration = 7000; // 25s alinhado com backend
  const updateEvery = 100;     // atualiza a cada 100ms
  const maxAutoProgress = 90;  // nunca passa de 90% sozinho

  const increment =
    (updateEvery / totalDuration) * maxAutoProgress;

  const interval = setInterval(() => {
    setProgress((p) => {
      const next = p + increment;

      if (next >= maxAutoProgress) {
        clearInterval(interval);
        return maxAutoProgress; // trava em 90%
      }

      return next;
    });
  }, updateEvery);

  return () => clearInterval(interval);
}, [loading]);


  // ----------------------------- BOTÃO ------------------------------
  const isPresenca = !isManualBank;

  let labelBotao = "Simular Crédito";
  const isAutorizar = isPresenca && linkTermo;

  if (isAutorizar && !jaAutorizou)
  labelBotao = "Autorizar Consulta";

if (isAutorizar && jaAutorizou)
  labelBotao = "Já autorizei";


  if (isManualBank && etapa >= 1) {
    if (banco.id === "presenca_fgts") labelBotao = "Autorizar Consulta";
    else labelBotao = "Receber minha simulação";
  }

  const handleClick = async () => {
    if (loading || error) return;

    if (isPresenca) {
      if (linkTermo && !jaAutorizou) {
  window.open(linkTermo, "_blank");
  setJaAutorizou(true);
  return;
}

if (linkTermo && jaAutorizou) {
  setError(false);
  setProgress(0);
  setLoading(true);

  try {
    await onAutorizar?.(); // 👈 agora espera backend
    setLoading(false);
  } catch {
    setLoading(false);
    setError(true);
  }

  return;
}



      abrirPopupSimulacao();
      return;
    }

    if (isManualBank) {
      if (etapa < 1) return abrirPopupSimulacao();
      if (onSimularManualWhatsApp) onSimularManualWhatsApp();
    }
  };

  const handleRetry = () => {
    setError(false);
    setProgress(0);
    setLoading(true);
    onRetryFGTS?.();
  };

  // ----------------------------- RENDER BOTÃO ------------------------------
  const renderBotao = () => {
    const baseClasses = `
      w-full 
      h-14
      rounded-xl
      font-bold 
      text-sm
      shadow-sm
      transition-all
      duration-200
      flex items-center justify-center gap-2
      uppercase tracking-wide
    `;

    if (error) {
      return (
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`${baseClasses} bg-red-50 text-red-700 border border-red-100 shadow-none cursor-default`}
          >
            <AlertCircle className="w-5 h-5" />
            Falha na consulta
          </motion.div>

          <button
            onClick={handleRetry}
            className="mt-3 flex items-center gap-2 font-semibold text-xs text-slate-500 hover:text-slate-800 hover:underline"
          >
            <RotateCcw className="w-4 h-4" />
            Tentar novamente
          </button>
        </div>
      );
    }

    if (loading) {
      return (
        <div
          className={`relative ${baseClasses} bg-slate-100 text-slate-500 shadow-none overflow-hidden cursor-wait`}
        >
          <span className="relative z-10 uppercase text-xs font-bold tracking-widest">
            Processando...
          </span>

          <div
            className={`absolute left-0 top-0 h-full opacity-20 transition-all duration-100 ease-linear ${
              isCarEquity ? "bg-indigo-600" : "bg-blue-600"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      );
    }

 const buttonStyle =
  isAutorizar && !jaAutorizou
    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
    : isAutorizar && jaAutorizou
    ? "bg-blue-600 hover:bg-blue-700 text-white"
    : isCarEquity
    ? "bg-[#2E3A59] ..."
    : "bg-blue-600 hover:bg-blue-700 text-white";


    return (
      <motion.button
        onClick={handleClick}
        whileHover={{
          scale: 1.02,
          y: -2,
          boxShadow: isCarEquity
            ? "0 10px 20px rgba(46, 58, 89, 0.4)"
            : "0 10px 20px rgba(59, 130, 246, 0.25)",
        }}
        whileTap={{ scale: 0.98 }}
        className={`${baseClasses} ${buttonStyle}`}
      >
        {labelBotao}
        <ChevronRight className="w-5 h-5" />
      </motion.button>
    );
  };

  // ----------------------------- TEMA (INALTERADO) ------------------------------
  const theme = {
    container: isCarEquity
      ? "bg-white border-slate-100 shadow-[0_15px_40px_-5px_rgba(0,0,0,0.12)] text-slate-900"
      : "bg-white/90 backdrop-blur-xl border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.06)] text-slate-800",

    headerBg: isCarEquity
      ? "bg-white"
      : "bg-gradient-to-r from-[#F8FAFC] to-white border-b border-gray-100",

    headerTitle: "text-slate-900 font-extrabold",
    headerSubtitle: isCarEquity
      ? "text-indigo-600 font-semibold"
      : "text-slate-500",

    labelColor: "text-slate-400 font-semibold tracking-widest",
    valueColor: isCarEquity ? "text-[#2E3A59]" : "text-[#0A2540]",
    centsColor: "text-slate-400 font-medium",

    taxaBadgeBg: isCarEquity
      ? "bg-slate-50 border border-slate-200/60"
      : "bg-slate-50 border border-slate-100",
    taxaValueColor: isCarEquity
      ? "text-indigo-700 font-black"
      : "text-emerald-600 font-bold",

    bannerBg: isCarEquity
      ? "bg-gradient-to-r from-slate-100 via-white to-slate-100 border-y border-slate-200/50"
      : "bg-[#0A2540]",
    bannerTextColor: isCarEquity ? "text-slate-700" : "text-white",

    separatorColor: "border-slate-100",
    conditionLabel: "text-slate-500",
    conditionValue: isCarEquity
      ? "text-slate-900 font-bold"
      : "text-slate-700 font-bold",
    footerBg: "bg-white",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-[340px] mx-auto min-h-[580px]"
    >
      <motion.div
        initial={{ scale: 0.97 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`${theme.container} rounded-[2rem] border overflow-hidden flex flex-col`}
      >
        {/* TOPO */}
        <div className={`flex items-center justify-between px-7 py-6 ${theme.headerBg}`}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-white shadow-md border flex items-center justify-center">
              <img
                src={banco.logo}
                alt={banco.nome}
                className="w-full h-full object-contain scale-[1.15]"
              />
            </div>

            <div>
              <h2 className={`text-xl ${theme.headerTitle}`}>{banco.nome}</h2>
              <p className={`text-[11px] uppercase ${theme.headerSubtitle}`}>
                {banco.tipo}
              </p>
            </div>
          </div>
        </div>

        {/* VALOR */}
        <div className="px-7 pt-4 pb-8 bg-white">
          <p className={`text-[10px] uppercase mb-2 ${theme.labelColor}`}>
            Crédito a partir de
          </p>

          <div className="flex items-baseline">
            <span className={`text-3xl mr-1 ${theme.centsColor}`}>R$</span>
            <h3 className={`text-[3.5rem] font-extrabold ${theme.valueColor}`}>
              {valorMinimo}
            </h3>
            <span className={`text-3xl ${theme.centsColor}`}>,00</span>
          </div>

          <div className={`mt-5 inline-flex items-center gap-2 ${theme.taxaBadgeBg} rounded-full px-4 py-1`}>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <p className="text-xs text-slate-500">
              Taxas a partir de <span className={theme.taxaValueColor}>{taxaTexto}</span>
            </p>
          </div>
        </div>

        {/* FAIXA */}
        <div className={`${theme.bannerBg} py-3 text-center`}>
          <p className={`text-[11px] uppercase tracking-widest ${theme.bannerTextColor}`}>
            {isCarEquity
              ? "Use seu carro. Taxas de reduzidas."
              : isSaqueCartao
              ? "Transforme limite do cartão em dinheiro"
              : "Simule para ver seu limite real"}
          </p>
        </div>

        {/* CONDIÇÕES */}
        <div className="px-7 py-6 flex-1 bg-white space-y-5">
          <div className={`flex justify-between border-b ${theme.separatorColor} pb-3`}>
            <span className={theme.conditionLabel}>Parcelamento</span>
            <span className={theme.conditionValue}>{parcelamentoTexto}</span>
          </div>

          <div className={`flex justify-between border-b ${theme.separatorColor} pb-3`}>
            <span className={theme.conditionLabel}>Liberação</span>
            <span className={`${theme.conditionValue} flex items-center gap-1`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Até 24h úteis
            </span>
          </div>

          <div className="flex justify-between">
            <span className={theme.conditionLabel}>Processo</span>
            <span className={theme.conditionValue}>100% Digital</span>
          </div>
        </div>

        {/* BOTÃO */}
        <div className={`px-7 py-7 ${theme.footerBg}`}>
          {renderBotao()}
        </div>
      </motion.div>
    </motion.div>
  );
}