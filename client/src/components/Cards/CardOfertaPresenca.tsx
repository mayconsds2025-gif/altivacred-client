import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  AlertCircle,
  RotateCcw,
  CheckCircle2,
  Clock,
  Zap,
  ShieldCheck,
} from "lucide-react";

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
    const updateEvery = 100; // atualiza a cada 100ms
    const maxAutoProgress = 90; // nunca passa de 90% sozinho

    const increment = (updateEvery / totalDuration) * maxAutoProgress;

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

  if (isAutorizar && !jaAutorizou) labelBotao = "Autorizar Consulta";
  if (isAutorizar && jaAutorizou) labelBotao = "Já autorizei";

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

  // ----------------------------- IDENTIDADE VISUAL (Kant Digital) ------------------------------
  // Navy institucional (#0A2540) como cor de marca + gradiente emerald → teal
  // como acento de ação, espelhando a navbar e os CTAs do site.
  const NAVY = "#0A2540";
  const NAVY_DARK = "#0d1f38";

  const accentGradient = isCarEquity
    ? "from-[#0A2540] to-[#16324f]"
    : "from-emerald-600 to-teal-600";

  const accentGlowShadow = isCarEquity
    ? "shadow-[0_10px_28px_-8px_rgba(10,37,64,0.5)]"
    : "shadow-[0_10px_28px_-8px_rgba(5,150,105,0.5)]";

  const topBarGradient = isCarEquity
    ? "from-slate-300 via-[#0A2540] to-slate-300"
    : "from-emerald-400 via-teal-500 to-emerald-400";

  // ----------------------------- RENDER BOTÃO ------------------------------
  const renderBotao = () => {
    const baseClasses = `
      relative w-full h-14 rounded-full font-bold text-sm
      transition-all duration-200
      flex items-center justify-center gap-2
      uppercase tracking-wide overflow-hidden
    `;

    if (error) {
      return (
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`${baseClasses} bg-red-50 text-red-700 border border-red-100`}
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
          className={`relative ${baseClasses} bg-slate-100 text-slate-500 cursor-wait`}
        >
          <span className="relative z-10 uppercase text-xs font-bold tracking-widest">
            Processando...
          </span>

          <div
            className={`absolute left-0 top-0 h-full bg-gradient-to-r ${accentGradient} opacity-25 transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      );
    }

    const buttonGradient =
      isAutorizar && jaAutorizou
        ? "from-[#0A2540] to-[#16324f]"
        : accentGradient;

    const buttonGlow =
      isAutorizar && jaAutorizou
        ? "shadow-[0_10px_28px_-8px_rgba(10,37,64,0.5)]"
        : accentGlowShadow;

    return (
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={`group ${baseClasses} bg-gradient-to-r ${buttonGradient} text-white ${buttonGlow}`}
      >
        {/* Brilho deslizante no hover — mesma assinatura do CTA da navbar */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
        <span className="relative z-10 flex items-center gap-2">
          {labelBotao}
          <ChevronRight className="w-5 h-5" />
        </span>
      </motion.button>
    );
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
        whileHover={{ y: -4 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden flex flex-col shadow-[0_20px_50px_-15px_rgba(10,37,64,0.18)] hover:shadow-[0_28px_60px_-15px_rgba(10,37,64,0.24)] transition-shadow duration-500"
      >
        {/* FIO DE ACABAMENTO — mesma linguagem da navbar */}
        <div className={`h-[3px] w-full bg-gradient-to-r ${topBarGradient}`} />

        {/* TOPO */}
        <div className="flex items-center gap-4 px-7 pt-6 pb-5 bg-gradient-to-b from-slate-50/70 to-white">
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-slate-100 flex items-center justify-center shrink-0">
            <img
              src={banco.logo}
              alt={banco.nome}
              className="w-full h-full object-contain scale-[1.15]"
            />
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight truncate">
              {banco.nome}
            </h2>
            <p
              className={`text-[10.5px] font-bold uppercase tracking-widest mt-0.5 ${
                isCarEquity ? "text-slate-500" : "text-emerald-700"
              }`}
            >
              {banco.tipo}
            </p>
          </div>
        </div>

        {/* VALOR */}
        <div className="relative px-7 pt-3 pb-7 bg-white overflow-hidden">
          {/* Glow decorativo sutil, sem exagero */}
          <div
            className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-[0.12] pointer-events-none ${
              isCarEquity ? "bg-[#0A2540]" : "bg-emerald-500"
            }`}
          />

          <p className="relative text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-1.5">
            Crédito a partir de
          </p>

          <div className="relative flex items-baseline">
            <span className="text-2xl mr-1 font-semibold text-slate-300">
              R$
            </span>
            <h3
              className="text-[3.25rem] leading-none font-extrabold tracking-tight"
              style={{ color: NAVY }}
            >
              {valorMinimo}
            </h3>
            <span className="text-2xl font-semibold text-slate-300">,00</span>
          </div>

          <div className="relative mt-4 inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-full pl-2.5 pr-3.5 py-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <p className="text-[11px] font-medium text-slate-600">
              Taxas a partir de{" "}
              <span className="font-bold text-emerald-700">{taxaTexto}</span>
            </p>
          </div>
        </div>

        {/* FAIXA */}
        <div
          className="py-3 text-center"
          style={{
            background: isCarEquity
              ? "linear-gradient(90deg, #f1f5f9, #ffffff, #f1f5f9)"
              : `linear-gradient(90deg, ${NAVY_DARK}, ${NAVY})`,
          }}
        >
          <p
            className={`text-[10.5px] font-semibold uppercase tracking-[0.18em] ${
              isCarEquity ? "text-slate-600" : "text-white/95"
            }`}
          >
            {isCarEquity
              ? "Use seu carro. Taxas reduzidas."
              : isSaqueCartao
              ? "Transforme limite do cartão em dinheiro"
              : "Simule para ver seu limite real"}
          </p>
        </div>

        {/* CONDIÇÕES */}
        <div className="px-7 py-6 flex-1 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <span className="flex items-center gap-2 text-slate-500 text-sm">
              <Clock className="w-4 h-4 text-slate-300" />
              Parcelamento
            </span>
            <span className="font-bold text-slate-800 text-sm">
              {parcelamentoTexto}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <span className="flex items-center gap-2 text-slate-500 text-sm">
              <Zap className="w-4 h-4 text-slate-300" />
              Liberação
            </span>
            <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Até 24h úteis
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-500 text-sm">
              <ShieldCheck className="w-4 h-4 text-slate-300" />
              Processo
            </span>
            <span className="font-bold text-slate-800 text-sm">
              100% Digital
            </span>
          </div>
        </div>

        {/* BOTÃO */}
        <div className="px-7 pb-7 pt-1 bg-white">{renderBotao()}</div>
      </motion.div>
    </motion.div>
  );
}