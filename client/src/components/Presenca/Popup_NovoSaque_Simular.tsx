import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  CheckCircle2,
  Loader2,
  User,
  FileText,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  Info
} from "lucide-react";

/* =========================
   TYPES
========================= */
type PopupNovoSaqueSimularProps = {
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

  enviar: (dados: any) => void;
  loading: boolean;
};

/* =========================
   MASKS
========================= */
const maskCPF = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");

const maskPhone = (value: string) => {
  const v = value.replace(/\D/g, "").slice(0, 11);
  if (v.length <= 10)
    return v.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  return v.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
};

const maskDate = (v: string) =>
  v
    .replace(/\D/g, "")
    .slice(0, 8)
    .replace(/^(\d{2})(\d)/, "$1/$2")
    .replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");

const validarDataNasc = (data: string) => {
  const digits = data.replace(/\D/g, "");
  if (digits.length !== 8) return false;
  const d = Number(digits.slice(0, 2));
  const m = Number(digits.slice(2, 4));
  const a = Number(digits.slice(4, 8));
  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;
  if (a < 1900 || a > new Date().getFullYear()) return false;
  return true;
};

const maskMoney = (v: string) => {
  const digits = v.replace(/\D/g, "");
  if (!digits) return "";
  const num = Number(digits) / 100;
  return num.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
};

const unmaskMoneyToNumber = (v: string) =>
  Number(v.replace(/\D/g, ""));

/* =========================
   UI COMPONENTS
========================= */
const Input = ({ placeholder, value, onChange, icon: Icon, type = "text" }: any) => {
  const [focus, setFocus] = useState(false);

  return (
    <div className="relative mb-4">
      <label
        className={`absolute left-3 transition-all duration-200 pointer-events-none
        ${focus || value ? "-top-2.5 text-xs bg-white px-1 text-indigo-600 font-medium" : "top-3 text-gray-400 text-sm"}`}
      >
        {placeholder}
      </label>

      <div
        className={`flex items-center border rounded-xl bg-white transition-all
        ${focus ? "border-indigo-500 ring-2 ring-indigo-500/10" : "border-gray-200"}`}
      >
        <input
          type={type}
          value={value}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onChange={(e: any) => onChange(e.target.value)}
          className="w-full p-3 bg-transparent outline-none text-gray-800 rounded-xl"
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

const ParcelButton = ({ selected, onClick, label }: any) => (
  <button
    onClick={onClick}
    className={`flex-1 p-4 rounded-xl border text-sm font-semibold transition-all
      ${
        selected
          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
          : "border-gray-200 hover:border-indigo-300 text-gray-600"
      }
    `}
  >
    {label}
  </button>
);

/* =========================
   MAIN
========================= */
export default function Popup_NovoSaque_Simular(props: PopupNovoSaqueSimularProps) {
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
    enviar,
    loading
  } = props;

  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const [erro, setErro] = useState("");

  const [valor, setValor] = useState("");
  const [parcelas, setParcelas] = useState<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show]);

  const validarStep = () => {
    if (step === 1) {
      if (unmaskMoneyToNumber(valor) <= 0) {
        setErro("Informe o limite livre disponível no seu cartão.");
        return false;
      }
      if (!parcelas) {
        setErro("Selecione em quantas vezes deseja pagar o empréstimo.");
        return false;
      }
    }

    if (step === 2 && nomePres.trim().length < 3) {
      setErro("Digite seu nome completo.");
      return false;
    }

    if (step === 3 && cpfPres.replace(/\D/g, "").length !== 11) {
      setErro("CPF inválido.");
      return false;
    }

    if (step === 4 && telefonePres.replace(/\D/g, "").length < 10) {
      setErro("Telefone inválido.");
      return false;
    }

    if (step === 5 && !validarDataNasc(dataNascPres)) {
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
    if (step > 1) setStep(step - 1);
    else onClose();
    setErro("");
  };

  const handleEnviar = () => {
    if (!validarStep()) return;

    enviar({
      value: unmaskMoneyToNumber(valor) / 100,
      installments: parcelas,
      nome: nomePres.trim(),
      cpf: cpfPres.replace(/\D/g, ""),
      telefone: telefonePres.replace(/\D/g, ""),
      email: emailPres.trim(),
      dataNascimento: dataNascPres
    });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[9999] p-4">
          <motion.div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">
                Simulação Novo Saque
              </h3>
              <button onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            {step === 1 && (
              <div className="flex gap-2 items-start bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl p-4 mb-6 ring-1 ring-amber-100">
                <AlertCircle size={20} className="mt-0.5 flex-shrink-0 text-amber-600" />
                <span>
                  <strong>Atenção:</strong> Para contratar este crédito, você precisa ter
                  <span className="font-bold underline">
                    {" "}
                    limite livre disponível no cartão de crédito
                  </span>
                  .
                </span>
              </div>
            )}

            {step === 1 && (
              <>
                <Input
                  placeholder="Qual é o LIMITE LIVRE disponível no seu cartão de crédito?"
                  value={valor}
                  onChange={(v: string) => setValor(maskMoney(v))}
                  icon={Info}
                />

                <label className="text-sm font-semibold text-gray-500 uppercase mb-3 block">
                  Em quantas vezes você deseja pagar o empréstimo?
                </label>

                <div className="flex gap-3">
                  {[4, 8, 12].map((p) => (
                    <ParcelButton
                      key={p}
                      label={`${p}x`}
                      selected={parcelas === p}
                      onClick={() => setParcelas(p)}
                    />
                  ))}
                </div>
              </>
            )}

            {step === 2 && (
              <Input
                placeholder="Nome Completo"
                value={nomePres}
                onChange={setNomePres}
                icon={User}
              />
            )}

            {step === 3 && (
              <Input
                placeholder="CPF"
                value={maskCPF(cpfPres)}
                onChange={(v: string) => setCpfPres(maskCPF(v))}
                icon={FileText}
              />
            )}

            {step === 4 && (
              <Input
                placeholder="Celular"
                value={maskPhone(telefonePres)}
                onChange={(v: string) => setTelefonePres(maskPhone(v))}
                icon={Phone}
              />
            )}

            {step === 5 && (
              <Input
                placeholder="Data de Nascimento"
                value={maskDate(dataNascPres)}
                onChange={(v: string) => setDataNascPres(maskDate(v))}
                icon={Calendar}
              />
            )}

            {erro && (
              <div className="mt-4 text-red-600 text-sm text-center font-medium">
                {erro}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleBack}
                className="flex items-center justify-center gap-2 flex-1 border rounded-xl py-2.5 text-sm"
              >
                <ChevronLeft size={16} /> Voltar
              </button>

              {step < totalSteps ? (
                <button
                  onClick={handleNext}
                  className="flex-[2] bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-xl py-2.5 text-sm font-semibold"
                >
                  Continuar
                </button>
              ) : (
                <button
                  onClick={handleEnviar}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 flex-[2] bg-emerald-600 hover:bg-emerald-700 transition text-white rounded-xl py-2.5 text-sm font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Processando
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      Simular
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
