import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  CheckCircle2,
  Loader2,
  Clock,
  User,
  FileText,
  Phone,
  Mail,
  Calendar,
  Check,
  DollarSign,
  Building2,
} from "lucide-react";

// --- TYPES ---
type PopupTermoProps = {
  show: boolean;
  onClose: () => void;

  nomePres: string;
  setNomePres: (v: string) => void;

  cpfPres: string;
  setCpfPres: (v: string) => void;

  telefonePres: string;
  setTelefonePres: (v: string) => void;

  emailPres: string;
  setEmailPres: (v: string) => void;

  dataNascPres: string;
  setDataNascPres: (v: string) => void;

  anosContrato: string;
  setAnosContrato: (v: string) => void;
  mesesContrato: string;
  setMesesContrato: (v: string) => void;

  salarioBruto: string;
  setSalarioBruto: (v: string) => void;

  tamanhoEmpresa: string;
  setTamanhoEmpresa: (v: string) => void;

  enviar: (dados?: any) => void;
  loading: boolean;
};

// --- ANIMATIONS ---
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 50 : -50,
    opacity: 0,
  }),
};

// --- MASKS ---
const maskNome = (value: string) => {
  let v = value.replace(/[^a-zA-Z\u00C0-\u00FF\s]/g, "");
  return v.replace(/\b\w/g, (l) => l.toUpperCase());
};

const maskCPF = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");

const maskPhone = (value: string) => {
  let val = value.replace(/\D/g, "").slice(0, 11);
  if (val.length <= 10)
    return val
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  return val
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
};

const maskDate = (v: string) =>
  v
    .replace(/\D/g, "")
    .slice(0, 8)
    .replace(/^(\d{2})(\d)/, "$1/$2")
    .replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");

const maskCurrency = (value: string) => {
  let v = value.replace(/\D/g, "");
  v = (Number(v) / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  return v;
};

const validarDataNasc = (data: string) => {
  const digits = data.replace(/\D/g, "");
  if (digits.length !== 8) return false;
  const d = parseInt(digits.slice(0, 2));
  const m = parseInt(digits.slice(2, 4));
  const a = parseInt(digits.slice(4, 8));
  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;
  if (a < 1900 || a > new Date().getFullYear()) return false;
  return true;
};

// --- UI COMPONENTS ---
const Input = ({
  placeholder,
  value,
  onChange,
  icon: Icon,
  className = "",
  type = "text",
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  icon?: any;
  className?: string;
  type?: string;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative mb-4 group ${className}`}>
      <label
        className={`absolute left-3 transition-all duration-200 pointer-events-none 
        ${
          isFocused || value
            ? "-top-2.5 text-xs bg-white px-1 text-emerald-700 font-semibold"
            : "top-3 text-gray-400 text-sm"
        }`}
      >
        {placeholder}
      </label>

      <div
        className={`flex items-center border rounded-xl bg-white transition-all duration-200 
        ${
          isFocused
            ? "border-emerald-500 ring-2 ring-emerald-500/10 shadow-sm"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <input
          type={type}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-3 bg-transparent outline-none text-gray-800 placeholder-transparent rounded-xl"
        />

        {Icon && (
          <div className="pr-3 text-gray-400">
            <Icon size={18} />
          </div>
        )}
      </div>
    </div>
  );
};

const OptionButton = ({ selected, onClick, label, icon: Icon }: any) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all duration-200 mb-3 group
      ${
        selected
          ? "border-emerald-500 bg-emerald-50/70 ring-1 ring-emerald-500/20 text-emerald-700"
          : "border-gray-200 hover:border-emerald-300 hover:bg-gray-50 text-gray-600"
      }`}
  >
    <span className="flex items-center gap-2.5 font-medium text-sm">
      {Icon && (
        <Icon
          size={16}
          className={selected ? "text-emerald-600" : "text-gray-400"}
        />
      )}
      {label}
    </span>
    {selected && <Check size={18} className="text-emerald-600 shrink-0" />}
  </button>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 block ml-1">
    {children}
  </label>
);

const HeaderPopup = ({
  back,
  title,
  subtitle,
}: {
  back: () => void;
  title: string;
  subtitle: string;
}) => (
  <div className="relative flex justify-between items-center mb-6 px-1">
    <div>
      <h3 className="text-xl font-bold text-slate-900 tracking-tight">
        {title}
      </h3>
      <p className="text-xs font-semibold text-emerald-700 mt-0.5">
        {subtitle}
      </p>
    </div>
    <button
      onClick={back}
      className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
    >
      <X size={20} />
    </button>
  </div>
);

const ProgressBar = ({ value }: { value: number }) => (
  <div className="w-full bg-slate-100 h-1.5 rounded-full mb-6 overflow-hidden">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 0.5, ease: "circOut" }}
      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
    />
  </div>
);

const FooterPopup = ({
  step,
  total,
  back,
  next,
  finalizar,
  loading,
  erro,
}: any) => (
  <div className="mt-6">
    {erro && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs font-medium text-center"
      >
        {erro}
      </motion.div>
    )}

    <div className="flex gap-3 pt-4 border-t border-gray-100">
      {step > 1 ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={back}
          className="flex-1 py-3.5 rounded-full text-slate-600 font-semibold text-sm hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all flex items-center justify-center gap-2"
        >
          <ChevronLeft size={16} /> Voltar
        </motion.button>
      ) : (
        <div className="flex-1" />
      )}

      {step < total ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={next}
          className="group relative flex-[2] overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3.5 rounded-full font-semibold text-sm shadow-[0_10px_24px_-8px_rgba(5,150,105,0.5)] transition-all flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
          <span className="relative z-10">Continuar</span>
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={finalizar}
          disabled={loading}
          className={`group relative flex-[2] overflow-hidden py-3.5 rounded-full font-semibold text-sm text-white transition-all flex items-center justify-center gap-2
            ${
              loading
                ? "bg-emerald-700 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-600 to-teal-600 shadow-[0_10px_24px_-8px_rgba(5,150,105,0.5)]"
            }`}
        >
          {!loading && (
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
          )}
          <span className="relative z-10 flex items-center gap-2">
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Processando...
              </>
            ) : (
              <>
                <CheckCircle2 size={18} /> Enviar Solicitação
              </>
            )}
          </span>
        </motion.button>
      )}
    </div>
  </div>
);

// --- MAIN COMPONENT ---
export default function PopupTermo(props: PopupTermoProps) {
  const {
    show,
    onClose,
    nomePres,
    setNomePres,
    cpfPres,
    setCpfPres,
    telefonePres,
    setTelefonePres,
    emailPres,
    setEmailPres,
    dataNascPres,
    setDataNascPres,
    anosContrato,
    setAnosContrato,
    mesesContrato,
    setMesesContrato,
    salarioBruto,
    setSalarioBruto,
    tamanhoEmpresa,
    setTamanhoEmpresa,
    enviar,
    loading,
  } = props;

  const [step, setStep] = useState(1);
  const totalSteps = 2; // Informações Profissionais + Informações Pessoais
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (show) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show]);

  // Reseta a etapa sempre que o popup é reaberto
  useEffect(() => {
    if (show) {
      setStep(1);
      setErro("");
    }
  }, [show]);

  // ------------------------------ TEMPO DE EMPRESA (simplificado) ------------------------------
  // Em vez de pedir anos e meses separadamente, oferecemos duas faixas diretas.
  // Isso continua sendo guardado nos mesmos campos (anosContrato / mesesContrato)
  // para manter compatibilidade com o restante do fluxo.
  type TempoEmpresa = "6m" | "1a" | null;

  const tempoSelecionado: TempoEmpresa =
    anosContrato === "1" && mesesContrato === "0"
      ? "1a"
      : anosContrato === "0" && mesesContrato === "6"
      ? "6m"
      : null;

  const selecionarTempoEmpresa = (opcao: "6m" | "1a") => {
    if (opcao === "6m") {
      setAnosContrato("0");
      setMesesContrato("6");
    } else {
      setAnosContrato("1");
      setMesesContrato("0");
    }
  };

  const validarStep = () => {
    // ETAPA 1: Informações Profissionais
    if (step === 1) {
      if (!tempoSelecionado) {
        setErro("Selecione há quanto tempo você trabalha na empresa.");
        return false;
      }

      if (!tamanhoEmpresa) {
        setErro("Selecione o número de funcionários da empresa.");
        return false;
      }

      const valorNumerico = Number(salarioBruto.replace(/\D/g, ""));
      if (!salarioBruto || valorNumerico === 0) {
        setErro("Informe o seu salário bruto mensal.");
        return false;
      }
    }

    // ETAPA 2: Informações Pessoais
    if (step === 2) {
      if (nomePres.trim().length < 3) {
        setErro("Digite seu nome completo.");
        return false;
      }

      if (cpfPres.replace(/\D/g, "").length !== 11) {
        setErro("CPF inválido.");
        return false;
      }

      if (telefonePres.replace(/\D/g, "").length < 10) {
        setErro("Telefone inválido.");
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailPres)) {
        setErro("E-mail inválido.");
        return false;
      }

      if (!validarDataNasc(dataNascPres)) {
        setErro("Data de nascimento inválida.");
        return false;
      }
    }

    setErro("");
    return true;
  };

  const handleNext = () => {
    if (!validarStep()) return;
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErro("");
    } else {
      onClose();
    }
  };

  const handleEnviar = () => {
    if (!validarStep()) return;

    enviar({
      anosContrato: Number(anosContrato),
      mesesContrato: Number(mesesContrato),
      salarioBruto: Number(salarioBruto.replace(/\D/g, "")) / 100,
      tamanhoEmpresa,
      nome: nomePres.trim(),
      cpf: cpfPres.replace(/\D/g, ""),
      telefone: telefonePres.replace(/\D/g, ""),
      email: emailPres.trim(),
      dataNascimento: dataNascPres,
    });
  };

  const getStepTitle = () =>
    step === 1 ? "Informações Profissionais" : "Informações Pessoais";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg relative overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Fio de acabamento — mesma linguagem visual da navbar / card */}
            <div className="h-[3px] w-full bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400 shrink-0" />

            {/* Glow decorativo sutil */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-400/10 rounded-full blur-3xl -z-0 pointer-events-none" />

            <div className="relative z-10 p-8 overflow-y-auto">
              <HeaderPopup
                back={onClose}
                title={getStepTitle()}
                subtitle={`Passo ${step} de ${totalSteps}`}
              />

              <ProgressBar value={(step / totalSteps) * 100} />

              <div className="mt-2 min-h-[280px]">
                <AnimatePresence mode="wait">
                  {/* ETAPA 1: INFORMAÇÕES PROFISSIONAIS */}
                  {step === 1 && (
                    <motion.div
                      key="s1"
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                    >
                      <SectionLabel>
                        Há quanto tempo você trabalha na empresa atual?
                      </SectionLabel>
                      <OptionButton
                        icon={Clock}
                        selected={tempoSelecionado === "6m"}
                        onClick={() => selecionarTempoEmpresa("6m")}
                        label="Mais de 6 meses"
                      />
                      <OptionButton
                        icon={Clock}
                        selected={tempoSelecionado === "1a"}
                        onClick={() => selecionarTempoEmpresa("1a")}
                        label="Mais de 1 ano"
                      />

                      <div className="mt-6">
                        <SectionLabel>
                          Quantos funcionários tem a empresa?
                        </SectionLabel>
                        <OptionButton
                          icon={Building2}
                          selected={
                            tamanhoEmpresa === "Menos de 20 funcionários"
                          }
                          onClick={() =>
                            setTamanhoEmpresa("Menos de 20 funcionários")
                          }
                          label="Menos de 20 funcionários"
                        />
                        <OptionButton
                          icon={Building2}
                          selected={
                            tamanhoEmpresa === "Mais de 20 funcionários"
                          }
                          onClick={() =>
                            setTamanhoEmpresa("Mais de 20 funcionários")
                          }
                          label="20 ou mais funcionários"
                        />
                        <OptionButton
                          icon={Building2}
                          selected={
                            tamanhoEmpresa === "100 ou mais funcionários"
                          }
                          onClick={() =>
                            setTamanhoEmpresa("100 ou mais funcionários")
                          }
                          label="100 ou mais funcionários"
                        />
                      </div>

                      <div className="mt-6">
                        <SectionLabel>Renda mensal bruta</SectionLabel>
                        <Input
                          placeholder="Salário Bruto"
                          value={salarioBruto}
                          onChange={(v) => setSalarioBruto(maskCurrency(v))}
                          icon={DollarSign}
                        />
                        <p className="text-xs text-gray-400 px-1 -mt-2">
                          Valor total recebido sem descontos (holerite).
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* ETAPA 2: INFORMAÇÕES PESSOAIS */}
                  {step === 2 && (
                    <motion.div
                      key="s2"
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                    >
                      <Input
                        placeholder="Nome Completo"
                        value={nomePres}
                        onChange={(v) => setNomePres(maskNome(v))}
                        icon={User}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          placeholder="CPF"
                          value={maskCPF(cpfPres)}
                          onChange={(v) => setCpfPres(maskCPF(v))}
                          icon={FileText}
                        />
                        <Input
                          placeholder="Celular"
                          value={maskPhone(telefonePres)}
                          onChange={(v) => setTelefonePres(maskPhone(v))}
                          icon={Phone}
                        />
                      </div>

                      <Input
                        placeholder="E-mail"
                        value={emailPres}
                        onChange={(v) => setEmailPres(v)}
                        icon={Mail}
                        type="email"
                      />

                      <Input
                        placeholder="Data de Nascimento"
                        value={maskDate(dataNascPres)}
                        onChange={(v) => setDataNascPres(maskDate(v))}
                        icon={Calendar}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <FooterPopup
                step={step}
                total={totalSteps}
                back={handleBack}
                next={handleNext}
                finalizar={handleEnviar}
                loading={loading}
                erro={erro}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}