import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ChevronsUpDown, 
  MapPin, 
  Building2, 
  CreditCard, 
  CheckCircle2, 
  ChevronLeft,
  Loader2,
  Search
} from "lucide-react";
import { BANKS } from "../../utils/banks"; 

const UF_LIST = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
  "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
  "RS","RO","RR","SC","SP","SE","TO"
];

// --- ANIMAÇÕES ---
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

// ----------------------------- INPUT PREMIUM -----------------------------
const Input = ({
  placeholder,
  value,
  onChange,
  mask,
  icon: Icon,
  className = ""
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  mask?: string;
  icon?: any;
  className?: string;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const aplicarMascara = (v: string) => {
    let dig = v.replace(/\D/g, "");
    switch (mask) {
      case "cep": return dig.replace(/(\d{5})(\d)/, "$1-$2").slice(0, 9);
      case "agencia": return dig.slice(0, 4);
      case "conta": return dig.slice(0, 8);
      case "digito": return dig.slice(0, 1);
      default: return v;
    }
  };

  return (
    <div className={`relative mb-4 group ${className}`}>
      <label className={`absolute left-3 transition-all duration-200 pointer-events-none 
        ${isFocused || value ? "-top-2.5 text-xs bg-white px-1 text-indigo-600 font-medium" : "top-3 text-gray-400 text-sm"}`}>
        {placeholder}
      </label>
      
      <div className={`flex items-center border rounded-xl bg-white transition-all duration-200 
        ${isFocused ? "border-indigo-500 ring-2 ring-indigo-500/10 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}>
        
        <input
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => onChange(aplicarMascara(e.target.value))}
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

// ----------------------------- HEADER -----------------------------
const HeaderPopup = ({ back, title }: { back: () => void, title: string }) => (
  <div className="flex justify-between items-center mb-6 px-1">
    <div>
      <h3 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h3>
      <p className="text-xs text-slate-500 font-medium mt-0.5">Complete seus dados com segurança</p>
    </div>
    <button onClick={back} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
      <X size={20} />
    </button>
  </div>
);
const UploadStep = ({ arquivos, setArquivos }: any) => {

  const handleFiles = (e: any) => {
    const files = Array.from(e.target.files);

    if (files.length > 2) {
      alert("Máximo de 2 arquivos.");
      return;
    }

    setArquivos(files);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <label className="block text-sm font-semibold text-gray-600 mb-3">
        Envie RG ou CNH (frente e verso)
      </label>

      <input
        type="file"
        accept="*/*"

        multiple
        onChange={handleFiles}
        className="w-full border border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-500"
      />

      {arquivos.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          {arquivos.map((file: any, idx: number) => (
            <div key={idx}>{file.name}</div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-3">
        ✔ Obrigatório pelo menos 1 documento
      </p>
    </motion.div>
  );
};


// ----------------------------- PROGRESS BAR -----------------------------
const ProgressBar = ({ value }: { value: number }) => (
  <div className="w-full bg-slate-100 h-1.5 rounded-full mb-8 overflow-hidden">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 0.5, ease: "circOut" }}
      className="h-full rounded-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.4)]"
    />
  </div>
);

// ----------------------------- ENDEREÇO -----------------------------
const EnderecoStep = (props: any) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="space-y-1"
  >
    <div className="grid grid-cols-12 gap-3">
      <div className="col-span-5">
        <Input placeholder="CEP" value={props.cep} onChange={props.setCep} mask="cep" icon={MapPin} />
      </div>
      <div className="col-span-7">
        <Input placeholder="Rua" value={props.rua} onChange={props.setRua} />
      </div>
    </div>

    <div className="grid grid-cols-12 gap-3">
      <div className="col-span-4">
        <Input placeholder="Número" value={props.numero} onChange={props.setNumero} />
      </div>
      <div className="col-span-8">
        <Input placeholder="Complemento" value={props.complemento} onChange={props.setComplemento} />
      </div>
    </div>

    <Input placeholder="Bairro" value={props.bairro} onChange={props.setBairro} />

    <div className="grid grid-cols-12 gap-3 items-start">
      <div className="col-span-8">
        <Input placeholder="Cidade" value={props.cidade} onChange={props.setCidade} />
      </div>

      <div className="col-span-4 relative group">
        <label className="absolute -top-2.5 left-3 px-1 bg-white text-xs font-medium text-gray-400 z-10">UF</label>
        <div className="relative">
            <select
            value={props.estado}
            onChange={(e) => props.setEstado(e.target.value)}
            className="w-full border border-gray-200 p-3 rounded-xl bg-white text-gray-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 appearance-none cursor-pointer hover:border-gray-300 transition-all"
            >
            <option value="">--</option>
            {UF_LIST.map((uf) => (
                <option key={uf} value={uf}>{uf}</option>
            ))}
            </select>
            <ChevronsUpDown size={16} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  </motion.div>
);

// ----------------------------- BANCÁRIO -----------------------------
const BancarioStep = (props: any) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const bancosFiltrados = BANKS.filter(b =>
    b.nome.toLowerCase().includes(search.toLowerCase())
  );

  const bancoSelecionado = BANKS.find(b => b.numero === props.codigoBanco);

  useEffect(() => {
    props.setFormaCredito("CC");
  }, [props.codigoBanco]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      {/* SELETOR DE BANCO */}
      <div className="relative mb-5">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block ml-1">Instituição Financeira</label>
        <button
          onClick={() => setOpen(!open)}
          className={`w-full border p-3.5 rounded-xl flex justify-between items-center bg-white transition-all
            ${open ? "border-indigo-500 ring-2 ring-indigo-500/10" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"}`}
        >
          <span className={`text-sm ${bancoSelecionado ? "text-slate-800 font-medium" : "text-gray-400"}`}>
            {bancoSelecionado
              ? `${bancoSelecionado.nome} (${bancoSelecionado.numero})`
              : "Selecione o seu banco"}
          </span>
          <ChevronsUpDown size={18} className="text-gray-400" />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 right-0 bg-white border border-gray-100 rounded-xl mt-2 max-h-60 overflow-hidden shadow-2xl z-50 flex flex-col"
            >
              <div className="p-2 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                <Search size={16} className="text-gray-400 ml-2" />
                <input
                  autoFocus
                  placeholder="Buscar banco..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent p-2 outline-none text-sm text-gray-700 placeholder-gray-400"
                />
              </div>

              <div className="overflow-y-auto flex-1 p-1 custom-scrollbar">
                {bancosFiltrados.map((banco) => (
                  <div
                    key={banco.numero}
                    onClick={() => {
                      props.setCodigoBanco(banco.numero);
                      setOpen(false);
                    }}
                    className="p-3 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer text-sm rounded-lg transition-colors flex items-center justify-between group"
                  >
                    <span>{banco.nome}</span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                        {banco.numero}
                    </span>
                  </div>
                ))}

                {bancosFiltrados.length === 0 && (
                  <div className="p-8 text-center text-gray-400 text-sm">
                    Nenhum banco encontrado.
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="h-px bg-gray-200 flex-1"></div>
        <span className="text-xs text-gray-400 font-medium uppercase">Detalhes da Conta</span>
        <div className="h-px bg-gray-200 flex-1"></div>
      </div>

      {/* CAMPOS ALINHADOS */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-4">
          <Input
            placeholder="Agência"
            value={props.agencia}
            onChange={props.setAgencia}
            mask="agencia"
            icon={Building2}
          />
        </div>

        <div className="col-span-5">
          <Input
            placeholder="Conta"
            value={props.conta}
            onChange={props.setConta}
            mask="conta"
            icon={CreditCard}
          />
        </div>

        <div className="col-span-3">
          <Input
            placeholder="Dígito"
            value={props.digitoConta}
            onChange={props.setDigitoConta}
            mask="digito"
            className="text-center"
          />
        </div>
      </div>
    </motion.div>
  );
};

// ----------------------------- FOOTER -----------------------------
const FooterPopup = ({
  step,
  total,
  next,
  back,
  enviar,
  enviando,
  salvarProgresso,
  endereco,
  bancario,
  uploadDocumentos
}: any) =>
 {

  const handleSaveAndNext = () => {
    let enderecoToSave = endereco;
    if (step === 1) {
      const cepLimpo = endereco.cep.replace(/\D/g, "");
      enderecoToSave = { ...endereco, cep: cepLimpo };
    }
    salvarProgresso({
      etapaContratacao: step + 1,
      endereco: enderecoToSave,
      bancario
    });
    next();
  };

  return (
    <div className="mt-8 flex gap-3 pt-4 border-t border-gray-100">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={back}
        className="flex-1 py-3.5 rounded-xl text-slate-600 font-semibold text-sm hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all flex items-center justify-center gap-2"
      >
        {step > 1 && <ChevronLeft size={16} />}
        {step > 1 ? "Voltar" : "Cancelar"}
      </motion.button>

      {step < total ? (
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)" }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSaveAndNext}
          className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-200 transition-all"
        >
          Continuar
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(22, 163, 74, 0.3)" }}
          whileTap={{ scale: 0.98 }}
         onClick={async () => {
  const ok = await uploadDocumentos();
  if (!ok) return;

  enviar(); // mantém sua lógica atual

  const numero = "5511977191411";
  const mensagem = encodeURIComponent(
    "Olá, gostaria de contratar meu Crédito do Trabalhador"
  );

  window.open(`https://wa.me/${numero}?text=${mensagem}`, "_blank");
}}


          disabled={enviando}
          className={`flex-[2] py-3.5 rounded-xl font-semibold text-sm shadow-lg text-white transition-all flex items-center justify-center gap-2
            ${enviando ? "bg-green-700 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 shadow-green-200"}`}
        >
          {enviando ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Processando...
            </>
          ) : (
            <>
              <CheckCircle2 size={18} /> Confirmar Contratação
            </>
          )}
        </motion.button>
      )}
    </div>
  );
};

// ----------------------------- POPUP PRINCIPAL -----------------------------
export default function PopupContratar({
  show,
  step,
  next,
  back,
  total,
  cpf,
  endereco,
  setEndereco,
  bancario,
  setBancario,
  finalizar,
  enviando,
  salvarProgresso
}: any) {

  // 🔥 API BASE (LOCAL + PRODUÇÃO)
  const API_BASE =
    ["localhost", "127.0.0.1"].includes(window.location.hostname)
      ? "http://localhost:5000"
      : process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (show) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [show]);

  const [arquivos, setArquivos] = useState<File[]>([]);

  const uploadDocumentos = async () => {
    console.log("📤 Iniciando upload...");

    if (!arquivos.length) {
      alert("Envie pelo menos 1 documento.");
      return false;
    }

    const cpfLimpo = (cpf || "").replace(/\D/g, "");

    console.log("CPF recebido:", cpf);
    console.log("CPF limpo:", cpfLimpo);
    console.log("API_BASE:", API_BASE);

    if (!cpfLimpo || cpfLimpo.length !== 11) {
      alert("CPF inválido. Não foi possível enviar os documentos.");
      return false;
    }

    if (!API_BASE) {
      alert("API_BASE não configurado.");
      console.error("REACT_APP_API_URL não definido.");
      return false;
    }

    const formData = new FormData();
    arquivos.forEach(file => {
      console.log("Arquivo:", file.name);
      formData.append("documentos", file);
    });

    try {
      const url = `${API_BASE}/upload/${cpfLimpo}`;
      console.log("🌍 Enviando para:", url);

      const resp = await fetch(url, {
        method: "POST",
        body: formData
      });

      console.log("Status HTTP:", resp.status);

      if (!resp.ok) {
        const erroTexto = await resp.text();
        console.error("Erro HTTP:", erroTexto);
        alert("Erro no upload. Veja console.");
        return false;
      }

      const data = await resp.json();
      console.log("Resposta backend:", data);

      if (!data.sucesso) {
        alert(data.erro || "Erro no upload");
        return false;
      }

      console.log("✅ Upload realizado com sucesso");
      return true;

    } catch (err) {
      console.error("🔥 Erro de rede:", err);
      alert("Erro de conexão com o servidor.");
      return false;
    }
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
            <div className="relative z-10">

              <HeaderPopup
                back={back}
                title={
                  step === 1
                    ? "Endereço Residencial"
                    : step === 2
                    ? "Dados Bancários"
                    : "Documento de Identificação"
                }
              />

              <ProgressBar value={(step / total) * 100} />

              <div className="mt-6 min-h-[320px]">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <EnderecoStep {...endereco} {...setEndereco} />
                  )}
                  {step === 2 && (
                    <BancarioStep {...bancario} {...setBancario} />
                  )}
                  {step === 3 && (
                    <UploadStep
                      arquivos={arquivos}
                      setArquivos={setArquivos}
                    />
                  )}
                </AnimatePresence>
              </div>

              <FooterPopup
                step={step}
                total={total}
                next={next}
                back={back}
                enviar={finalizar}
                enviando={enviando}
                salvarProgresso={salvarProgresso}
                endereco={endereco}
                bancario={bancario}
                uploadDocumentos={uploadDocumentos}
              />

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
