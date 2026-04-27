import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle2,
  Loader2,
  FileText,
  Heart,
  Hash,
  ChevronDown
} from "lucide-react";

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
  center: { x: 0, opacity: 1, zIndex: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? 50 : -50, opacity: 0, zIndex: 0 })
};

// *********************************
// INPUT PADRÃO COM MÁSCARA
// *********************************
const Input = ({ placeholder, value, onChange, mask, icon: Icon }: any) => {
  const [focus, setFocus] = useState(false);

  const applyMask = (v: string) => {
    if (!mask) return v;

    const onlyNumbers = v.replace(/\D/g, "");

    if (mask === "pix-cpf") return onlyNumbers.slice(0, 11);
    if (mask === "pix-phone") return onlyNumbers.slice(0, 14);
    if (mask === "pix-email") return v;

    if (mask === "cep")
      return onlyNumbers.slice(0, 8).replace(/^(\d{5})(\d)/, "$1-$2");

    if (mask === "number") return onlyNumbers;

    if (mask === "pix") return v;

    return v;
  };

  return (
    <div className="relative mb-5">
      <label
        className={`absolute left-3 transition-all duration-200 ${
          focus || value
            ? "-top-2.5 text-xs bg-white px-1 text-indigo-600"
            : "top-3 text-gray-400 text-sm"
        }`}
      >
        {placeholder}
      </label>

      <div
        className={`flex items-center border rounded-xl transition-all ${
          focus ? "border-indigo-500 ring-2 ring-indigo-500/10" : "border-gray-200"
        }`}
      >
        <input
          value={value}
          onChange={(e) => onChange(applyMask(e.target.value))}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          className="w-full p-3 bg-transparent outline-none"
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

// *********************************
// SELECT
// *********************************
const Select = ({ placeholder, value, onChange, options }: any) => {
  const [focus, setFocus] = useState(false);

  return (
    <div className="relative mb-5">
      <label
        className={`absolute left-3 transition-all duration-200 ${
          focus || value
            ? "-top-2.5 text-xs bg-white px-1 text-indigo-600"
            : "top-3 text-gray-400 text-sm"
        }`}
      >
        {placeholder}
      </label>

      <div
        className={`flex items-center border rounded-xl transition-all ${
          focus ? "border-indigo-500 ring-2 ring-indigo-500/10" : "border-gray-200"
        }`}
      >
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          className="w-full p-3 bg-transparent outline-none appearance-none"
        >
          <option value=""></option>
          {options.map((op: any) => (
            <option key={op.value} value={op.value}>
              {op.label}
            </option>
          ))}
        </select>

        <div className="pr-3 text-gray-400">
          <ChevronDown size={18} />
        </div>
      </div>
    </div>
  );
};

const MARITAL_OPTIONS = [
  { label: "Solteiro(a)", value: "single" },
  { label: "Casado(a)", value: "married" },
  { label: "Divorciado(a)", value: "divorced" },
  { label: "Viúvo(a)", value: "widower" }
];

const UF_OPTIONS = [
  "AC","AL","AM","AP","BA","CE","DF","ES",
  "GO","MA","MG","MS","MT","PA","PB","PE",
  "PI","PR","RJ","RN","RO","RR","RS","SC",
  "SE","SP","TO"
].map((uf) => ({ label: uf, value: uf }));

const PIX_TYPES = [
  { label: "CPF", value: "pix-cpf" },
  { label: "Telefone", value: "pix-phone" },
  { label: "E-mail", value: "pix-email" }
];

// *********************************
// POPUP
// *********************************
export default function PopupContratarFGTS({
  show,
  step,
  next,
  back,
  total,
  dadosFGTS,
  setDadosFGTS,
  endereco,
  setEndereco,
  pagamentoPix,
  setPagamentoPix,
  finalizar,
  enviando
}: any) {

  const { cep, rua, numero, complemento, bairro, cidade, estado } = endereco;
  const { setCep, setRua, setNumero, setComplemento, setBairro, setCidade, setEstado } = setEndereco;

  const [tipoPix, setTipoPix] = useState("pix-cpf");

  // 🔥 STATE DA BARRA DE PROGRESSO
  const [progress, setProgress] = useState(0);
  const [loadingAnimation, setLoadingAnimation] = useState(false);

  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [show]);

  // 🔥 INICIA A ANIMAÇÃO DE 5s
  const handleFinalizar = async () => {
    setLoadingAnimation(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 2;
      });
    }, 100);

    await new Promise((res) => setTimeout(res, 2000));

    setLoadingAnimation(false);
    finalizar();
  };

  const renderStep = () => {
    if (step === 1) {
      return (
        <motion.div key="s1" variants={slideVariants} initial="enter" animate="center" exit="exit">
          <Input
            placeholder="Nome da mãe"
            value={dadosFGTS.motherName}
            onChange={(v: string) => setDadosFGTS({ ...dadosFGTS, motherName: v })}
            icon={Heart}
          />

          <Input
            placeholder="RG/CNH"
            mask="number"
            value={dadosFGTS.documentIdentificationNumber}
            onChange={(v: string) =>
              setDadosFGTS({ ...dadosFGTS, documentIdentificationNumber: v })
            }
            icon={FileText}
          />

          <Select
            placeholder="Estado civil"
            value={dadosFGTS.maritalStatus}
            onChange={(v: string) =>
              setDadosFGTS({ ...dadosFGTS, maritalStatus: v })
            }
            options={MARITAL_OPTIONS}
          />
        </motion.div>
      );
    }

    if (step === 2) {
      return (
        <motion.div key="s2" variants={slideVariants} initial="enter" animate="center" exit="exit">

          <Input placeholder="CEP" mask="cep" value={cep} onChange={setCep} />

          <Input placeholder="Rua" value={rua} onChange={setRua} />
          <Input placeholder="Número" mask="number" value={numero} onChange={setNumero} />
          <Input placeholder="Complemento" value={complemento} onChange={setComplemento} />
          <Input placeholder="Bairro" value={bairro} onChange={setBairro} />
          <Input placeholder="Cidade" value={cidade} onChange={setCidade} />

          <Select
            placeholder="UF"
            value={estado}
            onChange={setEstado}
            options={UF_OPTIONS}
          />

        </motion.div>
      );
    }

    if (step === 3) {
      return (
        <motion.div key="s3" variants={slideVariants} initial="enter" animate="center" exit="exit">

          <Select
            placeholder="Tipo de chave PIX"
            value={tipoPix}
            onChange={setTipoPix}
            options={PIX_TYPES}
          />

          <Input
            placeholder="Chave PIX"
            mask={tipoPix}
            value={pagamentoPix}
            onChange={setPagamentoPix}
            icon={Hash}
          />

        </motion.div>
      );
    }

    return null;
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 relative"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
          >

            <div className="flex justify-between mb-6">
              <h3 className="text-xl font-bold">Contratação FGTS</h3>
              <button onClick={back} className="p-2 text-gray-400 hover:text-gray-600">
                <X size={22} />
              </button>
            </div>

            <div className="min-h-[300px]">{renderStep()}</div>

            <div className="mt-8 border-t pt-4 flex gap-3">

              <button
                onClick={back}
                className="flex-1 py-3 bg-gray-100 rounded-xl font-semibold text-gray-600 hover:bg-gray-200"
              >
                {step === 1 ? "Cancelar" : "Voltar"}
              </button>

              {step < total ? (
                <button
                  onClick={next}
                  className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700"
                >
                  Continuar
                </button>
              ) : (
                <button
                  onClick={handleFinalizar}
                  disabled={loadingAnimation}
                  className="relative flex-[2] py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl font-semibold hover:opacity-90 flex items-center justify-center overflow-hidden"
                >
                  {loadingAnimation ? (
                    <>
                      <Loader2 size={18} className="animate-spin mr-2" />
                      Processando...

                      {/* 🔥 Barra de carregamento premium */}
                      <motion.div
                        className="absolute bottom-0 left-0 h-[3px] bg-white/70"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} className="mr-2" /> Enviar Proposta
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
