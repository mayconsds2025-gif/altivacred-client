import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle2,
  Loader2,
  MapPin,
  User,
  Landmark,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { BANKS } from "../../utils/banks";

/* =========================
   TYPES
========================= */
type Props = {
  show: boolean;
  onClose: () => void;
  onSubmit: (payload: any) => void;
  loading: boolean;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  dataNascimento: string;
};

/* =========================
   HELPERS & MASKS
========================= */
const maskCEP = (value: string) =>
  value.replace(/\D/g, "").replace(/^(\d{5})(\d)/, "$1-$2").slice(0, 9);

const maskCPF = (value: string) =>
  value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14);

export default function PopupContratarNovoSaque({
  show,
  onClose,
  onSubmit,
  loading,
  nome,
  cpf,
  email,
  telefone,
  dataNascimento,
}: Props) {
  /* =========================
     STATES
  ========================= */
  const [step, setStep] = useState(0);
  const [erro, setErro] = useState("");

  const [address, setAddress] = useState({
    zip_code: "",
    street: "",
    number: "",
    district: "",
    city: "",
    state: "",
    complement: "",
  });

  const [motherName, setMotherName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [rg, setRg] = useState("");

  const [bankSearch, setBankSearch] = useState("");
  const [bankSelected, setBankSelected] = useState<any | null>(null);
  const [pixCpf, setPixCpf] = useState("");
  const [invoiceDueDay, setInvoiceDueDay] = useState("");

  /* =========================
     EFFECTS
  ========================= */
  useEffect(() => {
    if (!show) {
      setStep(0);
      setErro("");
      setBankSearch("");
      setBankSelected(null);
      setRg("");
      setAddress({
        zip_code: "",
        street: "",
        number: "",
        district: "",
        city: "",
        state: "",
        complement: "",
      });
      setMotherName("");
      setFatherName("");
      setPixCpf("");
      setInvoiceDueDay("");
    }
  }, [show]);

  const handleCEPBlur = async () => {
    const cleanCEP = address.zip_code.replace(/\D/g, "");
    if (cleanCEP.length === 8) {
      try {
        const res = await fetch(
          `https://viacep.com.br/ws/${cleanCEP}/json/`
        );
        const data = await res.json();
        if (!data.erro) {
          setAddress((prev) => ({
            ...prev,
            street: data.logradouro,
            district: data.bairro,
            city: data.localidade,
            state: data.uf,
          }));
          setErro("");
        } else {
          setErro("CEP não encontrado.");
        }
      } catch {
        setErro("Erro ao buscar CEP.");
      }
    }
  };

  /* =========================
     VALIDATION LOGIC
  ========================= */
  const bancosFiltrados = BANKS.filter(
    (b) =>
      b.nome.toLowerCase().includes(bankSearch.toLowerCase()) ||
      b.numero.includes(bankSearch)
  ).slice(0, 4);

  const validateStep = () => {
    setErro("");

    if (step === 1) {
      if (!address.zip_code || address.zip_code.length < 9)
        return "Informe um CEP válido.";
      if (!address.street.trim())
        return "O campo Rua é obrigatório.";
      if (!address.number.trim())
        return "O número da residência é obrigatório.";
      if (!address.district.trim())
        return "O bairro é obrigatório.";
      if (!address.city.trim())
        return "A cidade é obrigatória.";
    }

    if (step === 2) {
      if (!rg.trim() || rg.length < 5)
        return "Informe um RG válido.";
      if (!motherName.trim())
        return "O nome da mãe é obrigatório.";
      if (motherName.trim().split(" ").length < 2)
        return "Informe o nome completo da mãe.";
    }

    if (step === 3) {
      if (!bankSelected)
        return "Selecione o banco do seu cartão.";
      if (!pixCpf || pixCpf.length < 14)
        return "Informe um CPF válido para a chave PIX.";
      if (!invoiceDueDay)
        return "Selecione o dia de vencimento da fatura.";
    }

    return null;
  };

  const nextStep = () => {
    const errorMsg = validateStep();
    if (errorMsg) {
      setErro(errorMsg);
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = () => {
    const errorMsg = validateStep();
    if (errorMsg) {
      setErro(errorMsg);
      return;
    }

    const payload = {
      customer: {
        birth_date: dataNascimento,
        email,
        mobile: telefone,
        mother_name: motherName.trim(),
        father_name: fatherName.trim(),
        rg: rg.trim(),
        entity_attributes: {
          name: nome,
          cpf_cnpj: cpf,
          address_attributes: address,
        },
        bank_account_attributes: {
          number_bank: bankSelected.numero,
          name_bank: bankSelected.nome,
          pix_key: pixCpf.replace(/\D/g, ""),
          kind_pix: 0,
        },
        invoice_due_day: Number(invoiceDueDay),
      },
    };

    onSubmit(payload);
  };

  /* =========================
     STYLES
  ========================= */
  const inputStyle =
    "w-full border border-slate-200 bg-slate-50/50 rounded-xl p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-slate-700 placeholder:text-slate-400";
  const labelStyle =
    "text-xs font-semibold text-slate-500 mb-1 ml-1 uppercase tracking-wider";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            {/* Header */}
            <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">
                  Finalizar Contratação
                </h2>
                <p className="text-indigo-100 text-sm">
                  Etapa {step} de 3
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-slate-100">
              <motion.div
                className="h-full bg-indigo-500"
                animate={{ width: `${(step / 3) * 100}%` }}
              />
            </div>

            <div className="p-8">
              {/* STEP 0: CONFIRMAÇÃO */}
              {step === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-6"
                >
                  <p className="text-lg text-slate-700 leading-relaxed">
                    O valor simulado está{" "}
                    <span className="font-bold text-indigo-600">
                      disponível no limite do cartão de crédito
                      que será usado na contratação
                    </span>
                    ?
                  </p>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-4 font-bold transition-all"
                    >
                      Sim
                    </button>

                    <button
                      onClick={() => window.location.reload()}
                      className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-xl py-4 font-bold transition-all"
                    >
                      Não
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 1: ENDEREÇO */}
              {step === 1 && (
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 mb-4 text-indigo-600 font-semibold">
                    <MapPin size={18} /> <span>Onde você mora?</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className={labelStyle}>CEP *</p>
                      <input
                        className={inputStyle}
                        placeholder="00000-000"
                        value={address.zip_code}
                        onChange={(e) =>
                          setAddress({
                            ...address,
                            zip_code: maskCEP(e.target.value),
                          })
                        }
                        onBlur={handleCEPBlur}
                      />
                    </div>

                    <div>
                      <p className={labelStyle}>Bairro *</p>
                      <input
                        className={inputStyle}
                        value={address.district}
                        onChange={(e) =>
                          setAddress({
                            ...address,
                            district: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <p className={labelStyle}>
                      Endereço (Rua/Av) *
                    </p>
                    <input
                      className={inputStyle}
                      value={address.street}
                      onChange={(e) =>
                        setAddress({
                          ...address,
                          street: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className={labelStyle}>Número *</p>
                      <input
                        className={inputStyle}
                        value={address.number}
                        onChange={(e) =>
                          setAddress({
                            ...address,
                            number: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="col-span-2">
                      <p className={labelStyle}>Cidade *</p>
                      <input
                        className={inputStyle}
                        value={address.city}
                        onChange={(e) =>
                          setAddress({
                            ...address,
                            city: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: PESSOAL */}
              {step === 2 && (
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 mb-4 text-indigo-600 font-semibold">
                    <User size={18} />{" "}
                    <span>Dados Pessoais & Familiares</span>
                  </div>

                  <div>
                    <p className={labelStyle}>Número do RG *</p>
                    <input
                      className={inputStyle}
                      value={rg}
                      onChange={(e) =>
                        setRg(e.target.value.replace(/\D/g, ""))
                      }
                    />
                  </div>

                  <div>
                    <p className={labelStyle}>Nome da Mãe *</p>
                    <input
                      className={inputStyle}
                      value={motherName}
                      onChange={(e) =>
                        setMotherName(e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <p className={labelStyle}>
                      Nome do Pai (Opcional)
                    </p>
                    <input
                      className={inputStyle}
                      value={fatherName}
                      onChange={(e) =>
                        setFatherName(e.target.value)
                      }
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP 3: BANCÁRIO */}
              {step === 3 && (
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 mb-4 text-indigo-600 font-semibold">
                    <Landmark size={18} />{" "}
                    <span>Dados de Pagamento</span>
                  </div>

                  <div className="relative">
                    <p className={labelStyle}>Banco do Cartão *</p>
                    <input
                      className={inputStyle}
                      value={bankSearch}
                      onChange={(e) => {
                        setBankSearch(e.target.value);
                        if (bankSelected) setBankSelected(null);
                      }}
                    />

                    {bankSearch && !bankSelected && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded-xl shadow-xl overflow-hidden">
                        {bancosFiltrados.map((b) => (
                          <div
                            key={b.numero}
                            onClick={() => {
                              setBankSelected(b);
                              setBankSearch(b.nome);
                            }}
                            className="px-4 py-3 hover:bg-indigo-50 cursor-pointer text-sm border-b last:border-none"
                          >
                            {b.nome}{" "}
                            <span className="text-slate-400 text-xs">
                              ({b.numero})
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <p className={labelStyle}>
                      Chave PIX (CPF do Titular) *
                    </p>
                    <input
                      className={inputStyle}
                      value={pixCpf}
                      onChange={(e) =>
                        setPixCpf(maskCPF(e.target.value))
                      }
                    />
                  </div>

                  <div>
                    <p className={labelStyle}>
                      Dia de Vencimento da Fatura *
                    </p>
                    <select
                      className={inputStyle}
                      value={invoiceDueDay}
                      onChange={(e) =>
                        setInvoiceDueDay(e.target.value)
                      }
                    >
                      <option value="">
                        Selecione o dia
                      </option>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(
                        (day) => (
                          <option key={day} value={day}>
                            Dia {day}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </motion.div>
              )}

              {/* AÇÕES */}
              {step > 0 && (
                <div className="flex gap-3 mt-8">
                  {step > 1 && (
                    <button
                      onClick={() => setStep(step - 1)}
                      className="flex-1 px-6 py-4 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                    >
                      <ChevronLeft size={18} /> Voltar
                    </button>
                  )}

                  <button
                    onClick={
                      step === 3 ? handleSubmit : nextStep
                    }
                    disabled={loading}
                    className="flex-[2] bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-xl py-4 font-bold transition-all flex justify-center items-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : step === 3 ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      <ChevronRight size={20} />
                    )}
                    {step === 3
                      ? "Finalizar Agora"
                      : "Próximo Passo"}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
