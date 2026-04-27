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
  DollarSign
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
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 50 : -50,
    opacity: 0
  })
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
  type = "text"
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
      <label className={`absolute left-3 transition-all duration-200 pointer-events-none 
        ${isFocused || value ? "-top-2.5 text-xs bg-white px-1 text-indigo-600 font-medium" : "top-3 text-gray-400 text-sm"}`}>
        {placeholder}
      </label>
      
      <div className={`flex items-center border rounded-xl bg-white transition-all duration-200 
        ${isFocused ? "border-indigo-500 ring-2 ring-indigo-500/10 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}>
        
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

const OptionButton = ({ selected, onClick, label }: any) => (
  <button
    onClick={onClick}
    className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all duration-200 mb-3 group
      ${selected 
        ? "border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500/20 text-indigo-700" 
        : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50 text-gray-600"
      }`}
  >
    <span className="font-medium text-sm">{label}</span>
    {selected && <Check size={18} className="text-indigo-600" />}
  </button>
);

const HeaderPopup = ({ back, title, subtitle }: { back: () => void, title: string, subtitle: string }) => (
  <div className="flex justify-between items-center mb-6 px-1">
    <div>
      <h3 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h3>
      <p className="text-xs text-slate-500 font-medium mt-0.5">{subtitle}</p>
    </div>
    <button onClick={back} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
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
      className="h-full rounded-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.4)]"
    />
  </div>
);

const FooterPopup = ({ step, total, back, next, finalizar, loading, erro }: any) => (
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
          className="flex-1 py-3.5 rounded-xl text-slate-600 font-semibold text-sm hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all flex items-center justify-center gap-2"
        >
          <ChevronLeft size={16} /> Voltar
        </motion.button>
      ) : (
        <div className="flex-1"></div>
      )}

      {step < total ? (
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)" }}
          whileTap={{ scale: 0.98 }}
          onClick={next}
          className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-200 transition-all flex items-center justify-center"
        >
          Continuar
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(22, 163, 74, 0.3)" }}
          whileTap={{ scale: 0.98 }}
          onClick={finalizar}
          disabled={loading}
          className={`flex-[2] py-3.5 rounded-xl font-semibold text-sm shadow-lg text-white transition-all flex items-center justify-center gap-2
            ${loading ? "bg-green-700 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 shadow-green-200"}`}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Processando...
            </>
          ) : (
            <>
              <CheckCircle2 size={18} /> Enviar Solicitação
            </>
          )}
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
  const totalSteps = 8; // Ajustado (removido histórico de empréstimo)
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (show) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [show]);

  const validarStep = () => {
    // Passo 1: Tempo de Empresa
    if (step === 1) {
      const anos = parseInt(anosContrato) || 0;
      const meses = parseInt(mesesContrato) || 0;
      if (anos === 0 && meses === 0) {
        setErro("Informe o tempo de contrato.");
        return false;
      }
      if (meses > 11) {
        setErro("Meses devem estar entre 0 e 11.");
        return false;
      }
    }

    // Passo 2: Salário Bruto
    if (step === 2) {
        const valorNumerico = Number(salarioBruto.replace(/\D/g, ""));
        if (!salarioBruto || valorNumerico === 0) {
            setErro("Informe o seu salário bruto mensal.");
            return false;
        }
    }

    // Passo 3: Tamanho Empresa
    if (step === 3 && !tamanhoEmpresa) {
      setErro("Selecione o tamanho da empresa.");
      return false;
    }

    // Passo 4: Nome
    if (step === 4 && nomePres.trim().length < 3) {
      setErro("Digite seu nome completo.");
      return false;
    }

    // Passo 5: CPF
    if (step === 5 && cpfPres.replace(/\D/g, "").length !== 11) {
      setErro("CPF inválido.");
      return false;
    }

    // Passo 6: Telefone
    if (step === 6 && telefonePres.replace(/\D/g, "").length < 10) {
      setErro("Telefone inválido.");
      return false;
    }

    // Passo 7: E-mail
    if (step === 7) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailPres)) {
        setErro("E-mail inválido.");
        return false;
      }
    }

    // Passo 8: Data Nascimento
    if (step === 8 && !validarDataNasc(dataNascPres)) {
      setErro("Data de nascimento inválida.");
      return false;
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
  }

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

  const getStepTitle = () => {
    if (step <= 3) return "Perfil Profissional";
    return "Dados Pessoais";
  };

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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-0 opacity-50" />

            <div className="relative z-10">
              <HeaderPopup 
                back={onClose} 
                title={getStepTitle()} 
                subtitle={`Passo ${step} de ${totalSteps}`}
              />
              
              <ProgressBar value={(step / totalSteps) * 100} />

              <div className="mt-2 min-h-[200px]">
                <AnimatePresence mode="wait">
                  
                  {/* STEP 1: Tempo Contrato */}
                  {step === 1 && (
                    <motion.div key="s1" variants={slideVariants} initial="enter" animate="center" exit="exit">
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          placeholder="Anos"
                          value={anosContrato}
                          onChange={(v) => setAnosContrato(v.replace(/\D/g, ""))}
                          icon={Clock}
                          type="number"
                        />
                        <Input
                          placeholder="Meses"
                          value={mesesContrato}
                          onChange={(v) => {
                            const val = v.replace(/\D/g, "");
                            if (parseInt(val) > 11) return;
                            setMesesContrato(val);
                          }}
                          icon={Clock}
                          type="number"
                        />
                      </div>
                      <p className="text-xs text-gray-400 text-center mt-[-10px]">Tempo de serviço na empresa atual</p>
                    </motion.div>
                  )}

                  {/* STEP 2: Salário Bruto */}
                  {step === 2 && (
                    <motion.div key="s2" variants={slideVariants} initial="enter" animate="center" exit="exit">
                       <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 block ml-1">
                         Renda Mensal
                       </label>
                       <Input
                          placeholder="Salário Bruto"
                          value={salarioBruto}
                          onChange={(v) => setSalarioBruto(maskCurrency(v))}
                          icon={DollarSign}
                        />
                        <p className="text-xs text-gray-400 px-1">Valor total recebido sem descontos (holerite).</p>
                    </motion.div>
                  )}

                  {/* STEP 3: Tamanho Empresa */}
                  {step === 3 && (
                    <motion.div key="s3" variants={slideVariants} initial="enter" animate="center" exit="exit">
                       <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 block ml-1">
                         Porte da Empresa
                       </label>
                      <OptionButton
                        selected={tamanhoEmpresa === "Menos de 20 funcionários"}
                        onClick={() => setTamanhoEmpresa("Menos de 20 funcionários")}
                        label="Menos de 20 funcionários"
                      />
                      <OptionButton
                        selected={tamanhoEmpresa === "Mais de 20 funcionários"}
                        onClick={() => setTamanhoEmpresa("Mais de 20 funcionários")}
                        label="20 ou mais funcionários"
                      />
                      <OptionButton
                        selected={tamanhoEmpresa === "100 ou mais funcionários"}
                        onClick={() => setTamanhoEmpresa("100 ou mais funcionários")}
                        label="100 ou mais funcionários"
                      />
                    </motion.div>
                  )}

                  {/* STEP 4: Nome */}
                  {step === 4 && (
                    <motion.div key="s4" variants={slideVariants} initial="enter" animate="center" exit="exit">
                      <Input
                        placeholder="Nome Completo"
                        value={nomePres}
                        onChange={(v) => setNomePres(maskNome(v))}
                        icon={User}
                      />
                    </motion.div>
                  )}

                  {/* STEP 5: CPF */}
                  {step === 5 && (
                    <motion.div key="s5" variants={slideVariants} initial="enter" animate="center" exit="exit">
                      <Input
                        placeholder="CPF"
                        value={maskCPF(cpfPres)}
                        onChange={(v) => setCpfPres(maskCPF(v))}
                        icon={FileText}
                      />
                    </motion.div>
                  )}

                  {/* STEP 6: Telefone */}
                  {step === 6 && (
                    <motion.div key="s6" variants={slideVariants} initial="enter" animate="center" exit="exit">
                      <Input
                        placeholder="Celular"
                        value={maskPhone(telefonePres)}
                        onChange={(v) => setTelefonePres(maskPhone(v))}
                        icon={Phone}
                      />
                    </motion.div>
                  )}

                  {/* STEP 7: Email */}
                  {step === 7 && (
                    <motion.div key="s7" variants={slideVariants} initial="enter" animate="center" exit="exit">
                      <Input
                        placeholder="E-mail"
                        value={emailPres}
                        onChange={(v) => setEmailPres(v)}
                        icon={Mail}
                        type="email"
                      />
                    </motion.div>
                  )}

                  {/* STEP 8: Data Nasc */}
                  {step === 8 && (
                    <motion.div key="s8" variants={slideVariants} initial="enter" animate="center" exit="exit">
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