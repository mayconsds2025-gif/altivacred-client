import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  CheckCircle2,
  Loader2,
  FileText,
  Phone,
  Calendar,
  Car,
  User,
  Check,
  ChevronDown,
  Mail,
  Bike,
  ClipboardList,
  Truck,
  ArrowRight,
  DollarSign,
  MapPin,
  Briefcase,
  TrendingUp
} from "lucide-react";

/* ============================================
   MASKS & VALIDATIONS
============================================ */

const maskNome = (value: string) =>
  value
    .replace(/[^a-zA-ZÀ-ÿ\s]/g, "")
    .replace(/\b\w/g, (l) => l.toUpperCase());

const maskCPF = (value: string = "") =>
  value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");

const maskPhone = (value: string = "") => {
  const v = value.replace(/\D/g, "").slice(0, 11);
  if (v.length <= 10)
    return v.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  return v.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
};

const maskDate = (v: string = "") =>
  v
    .replace(/\D/g, "")
    .slice(0, 8)
    .replace(/^(\d{2})(\d)/, "$1/$2")
    .replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");

const maskPlaca = (v: string = "") =>
  v.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7);

const maskAno = (v: string = "") =>
  v.replace(/\D/g, "").slice(0, 4);

const maskCEP = (v: string = "") =>
  v.replace(/\D/g, "").slice(0, 8).replace(/^(\d{5})(\d)/, "$1-$2");

const maskMoney = (v: string = "") => {
  let clean = v.replace(/\D/g, "");
  if (!clean) return "";
  clean = clean.padStart(3, "0");
  const cents = clean.slice(-2);
  let integer = clean.slice(0, -2);
  integer = integer.replace(/^0+/, "");
  if (!integer) integer = "0";
  integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `R$ ${integer},${cents}`;
};

const validarDataNasc = (data: string) => {
  const digits = data.replace(/\D/g, "");
  if (digits.length !== 8) return false;
  const d = Number(digits.slice(0, 2));
  const m = Number(digits.slice(2, 4));
  const y = Number(digits.slice(4, 8));
  const currentYear = new Date().getFullYear();
  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;
  if (y < 1900 || y > currentYear) return false;
  return true;
};

const validarAnoFab = (ano: string) => {
  const digits = ano.replace(/\D/g, "");
  if (digits.length !== 4) return false;
  const y = Number(digits);
  const currentYear = new Date().getFullYear();
  if (y < 1900 || y > currentYear) return false;
  return true;
};

const validarEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validarCEP = (cep: string) => {
  const digits = cep.replace(/\D/g, "");
  return digits.length === 8;
};

/* ============================================
   DYNAMIC INPUT COMPONENT
============================================ */

type InputProps = {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  icon?: any;
  type?: string;
  autoFocus?: boolean;
  onEnter?: () => void;
};

const DynamicInput = ({ placeholder, value, onChange, icon: Icon, type = "text", autoFocus = true, onEnter }: InputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [autoFocus]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && onEnter) {
      onEnter();
    }
  };

  return (
    <div className="w-full">
      <div className="relative flex items-center border-b-2 border-indigo-100 focus-within:border-indigo-600 transition-colors duration-300 py-2">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full text-2xl sm:text-3xl font-medium bg-transparent outline-none text-slate-800 placeholder:text-slate-300"
          type={type}
          placeholder={placeholder}
        />
        {Icon && (
          <div className="text-indigo-600 ml-2">
            <Icon size={28} />
          </div>
        )}
      </div>
    </div>
  );
};

/* ============================================
   OPTION BUTTONS
============================================ */

const BigOption = ({
  selected,
  label,
  onClick,
  icon: Icon
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
  icon?: any;
}) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full p-6 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 transition-all duration-200 h-32 sm:h-40
      ${selected ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-lg shadow-indigo-200" : "border-slate-100 bg-white hover:border-indigo-200 hover:bg-slate-50 text-slate-600 shadow-sm"}`}
  >
    {Icon && <Icon size={32} strokeWidth={1.5} />}
    <span className="text-lg font-semibold">{label}</span>
  </motion.button>
);

const ListOption = ({ selected, label, onClick, shortcut }: { selected: boolean, label: string, onClick: () => void, shortcut?: string }) => (
  <motion.button
    whileHover={{ x: 4 }}
    onClick={onClick}
    className={`w-full p-4 rounded-xl border flex items-center justify-between mb-3 transition-all duration-200 group
      ${selected ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 bg-white hover:border-indigo-300 text-slate-700"}`}
  >
    <div className="flex items-center gap-3">
        {shortcut && <span className={`text-xs font-bold px-2 py-1 rounded border ${selected ? "border-indigo-200 bg-indigo-100" : "border-slate-200 bg-slate-50"}`}>{shortcut}</span>}
        <span className="text-lg font-medium">{label}</span>
    </div>
    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selected ? "border-indigo-600 bg-indigo-600" : "border-slate-300 group-hover:border-indigo-400"}`}>
        {selected && <Check size={14} className="text-white" />}
    </div>
  </motion.button>
);

/* ============================================
   MAIN POPUP
============================================ */

type PopupProps = {
  show: boolean;
  onClose: () => void;
  enviar: (dados: any) => void;
  loading: boolean;
  salvarProgresso: (etapa: number, dados: any) => void;
};

export default function PopupCarEquityDinamic({
  show,
  onClose,
  enviar,
  loading,
  salvarProgresso,
}: PopupProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const TOTAL_STEPS = 17;

  /* Form Data */
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNasc, setDataNasc] = useState("");
  const [cnh, setCnh] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [cep, setCep] = useState("");
  const [situacaoProfissional, setSituacaoProfissional] = useState("");
  const [anosAutonomo, setAnosAutonomo] = useState("");
  const [profissao, setProfissao] = useState("");
  const [rendaComprovada, setRendaComprovada] = useState("");
  const [tipoVeiculo, setTipoVeiculo] = useState("");
  const [uf, setUf] = useState("");
  const [placa, setPlaca] = useState("");
  const [ano, setAno] = useState("");
  const [valor, setValor] = useState("");
  const [quitado, setQuitado] = useState("");

  const [erro, setErro] = useState("");

  const UFs = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RO", "RS", "RR", "SC", "SE", "SP", "TO"
  ];

  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "auto";
  }, [show]);

  const validarPassoAtual = () => {
    setErro("");
    switch (currentStep) {
        case 0: if (nome.trim().length < 3) return "Digite seu nome completo."; break;
        case 1: if (cpf.replace(/\D/g, "").length !== 11) return "CPF inválido."; break;
        case 2: if (!validarDataNasc(dataNasc)) return "Data inválida."; break;
        case 3: if (!cnh) return "Selecione uma opção."; break;
        case 4: if (telefone.replace(/\D/g, "").length < 10) return "Telefone inválido."; break;
        case 5: if (!validarEmail(email)) return "Email inválido."; break;
        case 6: if (!validarCEP(cep)) return "CEP inválido."; break;
        case 7: if (!situacaoProfissional) return "Selecione uma opção."; break;
        case 8: 
          if (situacaoProfissional === "Autônomo") {
            if (!anosAutonomo || anosAutonomo === "0") return "Informe há quantos anos trabalha como autônomo.";
          }
          break;
        case 9: if (profissao.trim().length < 3) return "Informe sua profissão."; break;
        case 10: if (!rendaComprovada || rendaComprovada === "R$ 0,00") return "Informe sua renda."; break;
        case 11: if (!tipoVeiculo) return "Selecione o tipo."; break;
        case 12: if (!quitado) return "Informe se é quitado."; break;
        case 13: if (!uf) return "Selecione o estado."; break;
        case 14: if (placa.length < 7) return "Placa incompleta."; break;
        case 15: if (!validarAnoFab(ano)) return "Ano inválido."; break;
        case 16: if (!valor || valor === "R$ 0,00") return "Informe o valor desejado."; break;
    }
    return "";
  };

  const getVirtualStage = () => {
    if (currentStep <= 3) return 1;
    if (currentStep <= 10) return 2;
    return 3;
  }

  const handleNext = async () => {
    const e = validarPassoAtual();
    if (e) {
        setErro(e);
        return;
    }

    const allData = {
      nome, cpf, dataNasc, cnh, telefone, email, cep,
      situacaoProfissional, anosAutonomo, profissao, rendaComprovada,
      tipoVeiculo, quitado, uf, placa, ano, valor, produto: "car_equity",
    };
    
    await salvarProgresso(getVirtualStage(), allData);

    if (currentStep === 7 && situacaoProfissional !== "Autônomo") {
      setCurrentStep(9);
      return;
    }

    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      submitForm();
    }
  };

  const handleBack = () => {
    setErro("");
    if (currentStep === 0) return onClose();
    
    if (currentStep === 9 && situacaoProfissional !== "Autônomo") {
      setCurrentStep(7);
      return;
    }
    
    setCurrentStep(prev => prev - 1);
  };

  const submitForm = async () => {
    const valorNumerico = valor.replace(/[R$\s\.]/g, "").replace(",", "");
    const valorParaEnvio = parseFloat(valorNumerico) / 100;

    const rendaNumerico = rendaComprovada.replace(/[R$\s\.]/g, "").replace(",", "");
    const rendaParaEnvio = parseFloat(rendaNumerico) / 100;

    const dadosFinais = {
      nome,
      cpf: cpf.replace(/\D/g, ""),
      telefone: telefone.replace(/\D/g, ""),
      dataNascimento: dataNasc,
      cnh,
      email,
      cep: cep.replace(/\D/g, ""),
      situacaoProfissional,
      anosAutonomo: situacaoProfissional === "Autônomo" ? anosAutonomo : null,
      profissao,
      rendaComprovada: rendaParaEnvio,
      tipoVeiculo,
      quitado,
      uf,
      placa: placa.toUpperCase(),
      ano,
      valor: valorParaEnvio,
      produto: "car_equity",
    };

    enviar(dadosFinais);

    const mensagem = encodeURIComponent("Olá, gostaria de obter minha simulação de Empréstimo com Garantia de Veículo.");
    window.open(`https://wa.me/5511977191411?text=${mensagem}`, "_blank");
  };

  const selectAndNext = (setter: (v: string) => void, value: string) => {
      setter(value);
      setTimeout(() => {
          setErro("");
          if (currentStep < TOTAL_STEPS - 1) {
            if (currentStep === 7 && value !== "Autônomo") {
              setCurrentStep(9);
            } else {
              setCurrentStep(s => s + 1);
            }
          }
      }, 250);
  };

  const renderField = () => {
      switch(currentStep) {
        case 0:
            return (
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Vamos começar!</h2>
                    <p className="text-slate-500 text-lg mb-6">Qual é o seu <span className="text-indigo-600 font-semibold">nome completo</span>?</p>
                    <DynamicInput placeholder="Digite seu nome..." value={nome} onChange={(v) => setNome(maskNome(v))} icon={User} onEnter={handleNext} />
                </div>
            );
        case 1:
            return (
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Identificação</h2>
                    <p className="text-slate-500 text-lg mb-6">Agora, digite o seu <span className="text-indigo-600 font-semibold">CPF</span>.</p>
                    <DynamicInput placeholder="000.000.000-00" value={cpf} onChange={(v) => setCpf(maskCPF(v))} icon={FileText} type="tel" onEnter={handleNext} />
                </div>
            );
        case 2:
            return (
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Data de Nascimento</h2>
                    <p className="text-slate-500 text-lg mb-6">Quando você <span className="text-indigo-600 font-semibold">nasceu</span>?</p>
                    <DynamicInput placeholder="DD/MM/AAAA" value={dataNasc} onChange={(v) => setDataNasc(maskDate(v))} icon={Calendar} type="tel" onEnter={handleNext} />
                </div>
            );
        case 3:
            return (
                <div>
                     <h2 className="text-2xl font-bold text-slate-900 mb-2">Habilitação</h2>
                     <p className="text-slate-500 text-lg mb-6">Você possui <span className="text-indigo-600 font-semibold">CNH válida</span>?</p>
                     <div className="space-y-3">
                        <ListOption shortcut="A" label="Sim, eu possuo" selected={cnh === "Sim"} onClick={() => selectAndNext(setCnh, "Sim")} />
                        <ListOption shortcut="B" label="Não possuo" selected={cnh === "Não"} onClick={() => selectAndNext(setCnh, "Não")} />
                     </div>
                </div>
            );
        case 4:
            return (
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Contato</h2>
                    <p className="text-slate-500 text-lg mb-6">Qual seu melhor <span className="text-indigo-600 font-semibold">número de WhatsApp</span>?</p>
                    <DynamicInput placeholder="(00) 00000-0000" value={telefone} onChange={(v) => setTelefone(maskPhone(v))} icon={Phone} type="tel" onEnter={handleNext} />
                </div>
            );
        case 5:
            return (
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Email</h2>
                    <p className="text-slate-500 text-lg mb-6">Qual seu <span className="text-indigo-600 font-semibold">email principal</span>?</p>
                    <DynamicInput placeholder="exemplo@email.com" value={email} onChange={(v) => setEmail(v)} icon={Mail} type="email" onEnter={handleNext} />
                </div>
            );
        case 6:
            return (
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Endereço</h2>
                    <p className="text-slate-500 text-lg mb-6">Qual o seu <span className="text-indigo-600 font-semibold">CEP</span>?</p>
                    <DynamicInput placeholder="00000-000" value={cep} onChange={(v) => setCep(maskCEP(v))} icon={MapPin} type="tel" onEnter={handleNext} />
                </div>
            );
        case 7:
            return (
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Situação Profissional</h2>
                    <p className="text-slate-500 text-lg mb-6">Qual sua <span className="text-indigo-600 font-semibold">situação profissional</span>?</p>
                    <div className="space-y-3">
                        <ListOption shortcut="A" label="Assalariado" selected={situacaoProfissional === "Assalariado"} onClick={() => selectAndNext(setSituacaoProfissional, "Assalariado")} />
                        <ListOption shortcut="B" label="Autônomo" selected={situacaoProfissional === "Autônomo"} onClick={() => selectAndNext(setSituacaoProfissional, "Autônomo")} />
                        <ListOption shortcut="C" label="Pensionista" selected={situacaoProfissional === "Pensionista"} onClick={() => selectAndNext(setSituacaoProfissional, "Pensionista")} />
                    </div>
                </div>
            );
        case 8:
            return (
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Tempo de Trabalho</h2>
                    <p className="text-slate-500 text-lg mb-6">Há quantos anos trabalha como <span className="text-indigo-600 font-semibold">autônomo</span>?</p>
                    <DynamicInput placeholder="Ex: 5" value={anosAutonomo} onChange={(v) => setAnosAutonomo(maskAno(v))} icon={Briefcase} type="tel" onEnter={handleNext} />
                </div>
            );
        case 9:
            return (
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Profissão</h2>
                    <p className="text-slate-500 text-lg mb-6">Qual a sua <span className="text-indigo-600 font-semibold">profissão</span>?</p>
                    <DynamicInput placeholder="Digite sua profissão..." value={profissao} onChange={(v) => setProfissao(maskNome(v))} icon={Briefcase} onEnter={handleNext} />
                </div>
            );
        case 10:
            return (
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Renda</h2>
                    <p className="text-slate-500 text-lg mb-6">Qual sua <span className="text-indigo-600 font-semibold">renda comprovada</span>?</p>
                    <DynamicInput placeholder="R$ 0,00" value={rendaComprovada} onChange={(v) => setRendaComprovada(maskMoney(v))} icon={TrendingUp} type="tel" onEnter={handleNext} />
                </div>
            );
        case 11:
            return (
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Seu Veículo</h2>
                    <p className="text-slate-500 text-lg mb-6">Qual o <span className="text-indigo-600 font-semibold">tipo do veículo</span>?</p>
                    <div className="grid grid-cols-2 gap-4">
                        <BigOption label="Carro" icon={Car} selected={tipoVeiculo === "Carro"} onClick={() => selectAndNext(setTipoVeiculo, "Carro")} />
                        <BigOption label="Moto" icon={Bike} selected={tipoVeiculo === "Moto"} onClick={() => selectAndNext(setTipoVeiculo, "Moto")} />
                        <BigOption label="Utilitário" icon={Car} selected={tipoVeiculo === "Utilitário"} onClick={() => selectAndNext(setTipoVeiculo, "Utilitário")} />
                        <BigOption label="Pesado" icon={Truck} selected={tipoVeiculo === "Pesado"} onClick={() => selectAndNext(setTipoVeiculo, "Pesado")} />
                    </div>
                </div>
            );
        case 12:
            return (
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Situação</h2>
                    <p className="text-slate-500 text-lg mb-6">O veículo está <span className="text-indigo-600 font-semibold">quitado</span>?</p>
                     <div className="space-y-3">
                        <ListOption shortcut="A" label="Sim, está quitado" selected={quitado === "Sim"} onClick={() => selectAndNext(setQuitado, "Sim")} />
                        <ListOption shortcut="B" label="Não, ainda pago parcelas" selected={quitado === "Não"} onClick={() => selectAndNext(setQuitado, "Não")} />
                     </div>
                </div>
            );
        case 13:
             return (
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Localização</h2>
                    <p className="text-slate-500 text-lg mb-6">Qual a <span className="text-indigo-600 font-semibold">UF de licenciamento</span>?</p>
                    <div className="relative">
                        <select
                            value={uf}
                            onChange={(e) => setUf(e.target.value)}
                            className="w-full text-2xl py-3 border-b-2 border-indigo-100 bg-transparent outline-none text-slate-800 appearance-none focus:border-indigo-600 transition-colors cursor-pointer"
                        >
                            <option value="">Selecione na lista...</option>
                            {UFs.map((u) => <option key={u} value={u}>{u}</option>)}
                        </select>
                        <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-indigo-600 pointer-events-none" size={24} />
                    </div>
                    {uf && (
                        <motion.button 
                            initial={{opacity:0, y:10}} animate={{opacity:1, y:0}}
                            onClick={handleNext}
                            className="mt-6 flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-800"
                        >
                            Confirmar UF <ArrowRight size={18} />
                        </motion.button>
                    )}
                </div>
             );
        case 14:
             return (
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Placa</h2>
                    <p className="text-slate-500 text-lg mb-6">Qual a <span className="text-indigo-600 font-semibold">placa do veículo</span>?</p>
                    <DynamicInput placeholder="ABC-1234" value={placa} onChange={(v) => setPlaca(maskPlaca(v))} icon={ClipboardList} onEnter={handleNext} />
                </div>
             );
        case 15:
             return (
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Ano</h2>
                    <p className="text-slate-500 text-lg mb-6">Qual o <span className="text-indigo-600 font-semibold">ano de fabricação</span>?</p>
                    <DynamicInput placeholder="Ex: 2018" value={ano} onChange={(v) => setAno(maskAno(v))} icon={Calendar} type="tel" onEnter={handleNext} />
                </div>
             );
        case 16:
             return (
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Crédito</h2>
                    <p className="text-slate-500 text-lg mb-6">De quanto <span className="text-indigo-600 font-semibold">você precisa</span>?</p>
                    <DynamicInput placeholder="R$ 0,00" value={valor} onChange={(v) => setValor(maskMoney(v))} icon={DollarSign} type="tel" onEnter={handleNext} />
                </div>
             );
        default: return null;
      }
  }

  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center p-4 z-[9999]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden relative flex flex-col max-h-[90vh]"
          >
            
                    <div className="h-1.5 w-full bg-slate-100">
              <motion.div
                className="h-full bg-indigo-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <div className="px-8 pt-6 pb-2 flex justify-between items-center z-10">
              <button
                onClick={handleBack}
                className="p-2 -ml-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                title="Voltar"
              >
                {currentStep > 0 ? (
                  <ChevronLeft size={24} />
                ) : (
                  <span className="w-6 h-6 block" />
                )}
              </button>

              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Passo {currentStep + 1} de {TOTAL_STEPS}
              </div>

              <button
                onClick={onClose}
                className="text-slate-400 hover:text-red-500 font-bold text-xl px-2"
              >
                &times;
              </button>
            </div>

            <div className="p-8 flex-1 overflow-y-auto min-h-[300px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  {renderField()}
                </motion.div>
              </AnimatePresence>

              {erro && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-red-500 text-sm font-medium flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {erro}
                </motion.div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50">
              <div className="flex justify-end">
                {currentStep === TOTAL_STEPS - 1 ? (
                  <button
                    onClick={handleNext}
                    disabled={loading}
                    className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2
                      ${
                        loading
                          ? "bg-slate-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700 hover:shadow-green-200 hover:-translate-y-0.5"
                      }`}
                  >
                    {loading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={20} />
                    )}
                    <span>Finalizar Simulação</span>
                  </button>
                ) : (
                  ![3, 7, 11, 12].includes(currentStep) && (
                    <button
                      onClick={handleNext}
                      className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                    >
                      Continuar <ArrowRight size={18} />
                    </button>
                  )
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
