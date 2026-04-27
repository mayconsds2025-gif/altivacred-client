// src/pages/CarEquity.tsx (Assumindo que este é o nome do seu arquivo)
import React, { useState } from "react";
import { CheckCircle, Zap, FileText, Send, Loader } from "lucide-react";

// COMPONENTES
import CardOfertaPresenca from "../components/Cards/CardOfertaPresenca";
import CardSimulacaoPresenca from "../components/Cards/CardSimulacaoPresenca";

// POPUPS
import PopupContratar from "../components/Contratar/PopupContratar";
import PopupCarEquityInicial from "../components/Presenca/popup_carequity_inicial";

// ASSETS
import c6Logo from "../assets/c6bank.png";

// Tipo
type BancoId = "c6" | null;

// Novo componente de Passo a Passo (Roadmap)
const StepByStep = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    {
      id: 1,
      icon: Zap,
      title: "Simulação Rápida",
      description: "Informe seus dados para ver o potencial de crédito do seu veículo.",
    },
    {
      id: 2,
      icon: FileText,
      title: "Autorização e Análise",
      description: "Analise a proposta e autorize a consulta de crédito junto ao banco.",
    },
    {
      id: 3,
      icon: Send,
      title: "Formalização Digital",
      description: "Preencha o restante dos dados e finalize a proposta online.",
    },
    {
      id: 4,
      icon: CheckCircle,
      title: "Crédito Liberado",
      description: "O valor é transferido para sua conta via PIX em até 24h úteis.",
    },
  ];

  return (
    <div className="mt-16 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-extrabold text-slate-800 text-center mb-10 tracking-tight">
        Seu caminho para o crédito em <span className="text-indigo-600">4 passos</span>
      </h2>
      <div className="relative flex justify-between">
        {/* Linha de Conexão */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-slate-200">
          <div
            className={`absolute h-full bg-indigo-500 transition-all duration-700 ease-out`}
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step) => {
          const isActive = step.id <= currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center w-1/4 z-10">
              {/* Círculo do Ícone */}
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 transform ${
                  isCurrent
                    ? "bg-indigo-600 shadow-xl shadow-indigo-500/30 ring-4 ring-indigo-200/50"
                    : isActive
                    ? "bg-indigo-500 ring-2 ring-indigo-500/20"
                    : "bg-white border-2 border-slate-300"
                }`}
              >
                <step.icon
                  className={`w-5 h-5 transition-colors duration-300 ${
                    isActive ? "text-white" : "text-slate-400"
                  }`}
                />
              </div>

              {/* Título */}
              <h3
                className={`mt-4 text-sm font-bold text-center transition-colors duration-300 ${
                  isActive ? "text-slate-800" : "text-slate-500"
                }`}
              >
                {step.title}
              </h3>
              {/* Descrição */}
              <p className="text-xs text-center text-slate-400 mt-1 max-w-[120px] leading-snug hidden md:block">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};


export default function CarEquity() {
  // -------------------------------- STATES --------------------------------
  const [showPopupC6, setShowPopupC6] = useState<BancoId>(null);

  // Dados pessoais (UTILIZADOS APÓS SIMULAÇÃO)
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [dataNasc, setDataNasc] = useState("");

  const [loading, setLoading] = useState(false);
  const [simulacaoC6, setSimulacaoC6] = useState<any | null>(null);

  const [showPopupContratar, setShowPopupContratar] = useState(false);
  const [stepContratar, setStepContratar] = useState(1);
  const totalStepsContratar = 2;

  // Endereço
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  // Dados bancários
  const [codigoBanco, setCodigoBanco] = useState("");
  const [agencia, setAgencia] = useState("");
  const [conta, setConta] = useState("");
  const [digitoConta, setDigitoConta] = useState("");
  const [formaCredito, setFormaCredito] = useState("PIX");

  const [enviandoProposta, setEnviandoProposta] = useState(false);

  // BASE API
  const API_BASE =
    ["localhost", "127.0.0.1"].includes(window.location.hostname)
      ? "http://localhost:5000"
      : process.env.REACT_APP_API_URL;

  // ------------------------------------------------------------
  // Lógica do Passo Atual para o Roadmap
  // ------------------------------------------------------------
  let currentStep = 1; // 1: Início / Simulação

  if (showPopupC6 === "c6") {
    currentStep = 1; // Pop-up aberto, ainda no passo 1.
  } else if (simulacaoC6 && !simulacaoC6.linkTermo && !simulacaoC6.valorLiberado) {
    // Caso de simulação em andamento após envio do termo, mas antes do resultado final
    currentStep = 2;
  } else if (simulacaoC6?.linkTermo) {
    // Termo de autorização gerado, pronto para autorizar ou em consulta
    currentStep = 2;
  } else if (simulacaoC6?.valorLiberado) {
    // Simulação concluída, pronto para formalizar
    currentStep = 3;
    if (showPopupContratar) {
        currentStep = 3; // Formalização em andamento (pop-up aberto)
    }
  } 
  
  if (simulacaoC6?.linkFormalizacao) {
    currentStep = 4; // Formalização enviada, aguardando liberação
  }


  // ------------------------------------------------------------
  // 🔵 SALVAR PROGRESSO
  // ------------------------------------------------------------
  const salvarProgresso = async (etapa: number, dados: any) => {
    try {
      await fetch(`${API_BASE}/progresso/salvar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: dados.email,
          cpf: dados.cpf,
          etapa,
          dados,
        }),
      });
    } catch (e) {
      console.log("Erro ao salvar progresso:", e);
    }
  };

  // ------------------------------------------------------------
  // ENVIAR TERMO PARA C6
  // ------------------------------------------------------------
  const enviarTermoC6 = async (dados: any) => {
    setLoading(true);

    try {
      const resp = await fetch(`${API_BASE}/c6/termo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      const data = await resp.json();

      if (data.sucesso) {
        setSimulacaoC6({
          termoId: data.id,
          linkTermo: data.shortUrl,
        });

        // Guarda dados pessoais para uso futuro
        setNome(dados.nome);
        setCpf(dados.cpf);
        setTelefone(dados.telefone);
        setEmail(dados.email || "");
        setDataNasc(dados.dataNascimento || "");
      }
    } catch (e) {
      console.error("Erro ao enviar termo C6:", e);
    } finally {
      setLoading(false);
      setShowPopupC6(null);
    }
  };

  // ------------------------------------------------------------
  // AUTORIZAR CONSULTA
  // ------------------------------------------------------------
  const autorizarConsulta = async () => {
    if (!simulacaoC6?.termoId) return;

    try {
      const resp = await fetch(`${API_BASE}/c6/simular`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cpf: cpf.replace(/\D/g, ""),
          nome,
          telefone: telefone.replace(/\D/g, ""),
          email,
          termoId: simulacaoC6.termoId,
        }),
      });

      const data = await resp.json();

      if (data.sucesso && data.melhorSimulacao) {
        setSimulacaoC6(data.melhorSimulacao);
      }
    } catch {
      console.error("Erro na simulação C6");
    }
  };

  // ------------------------------------------------------------
  // FINALIZAR PROPOSTA
  // ------------------------------------------------------------
  const finalizarProposta = async () => {
    if (!simulacaoC6) return;

    setEnviandoProposta(true);

    try {
      const resp = await fetch(`${API_BASE}/c6/operacao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposta: {
            valorSolicitado: Number(simulacaoC6.valorLiberado),
            quantidadeParcelas: Number(simulacaoC6.prazo),
            valorParcela: Number(simulacaoC6.valorParcela),
            tabelaId: Number(simulacaoC6.id),
          },
          tomador: {
            cpf: cpf.replace(/\D/g, ""),
            nome,
            email,
            dataNascimento: dataNasc,
            telefone: {
              ddd: telefone.replace(/\D/g, "").substring(0, 2),
              numero: telefone.replace(/\D/g, "").substring(2),
            },
            endereco: {
              cep,
              rua,
              numero,
              complemento,
              bairro,
              cidade,
              estado,
            },
            dadosBancarios: {
              codigoBanco,
              agencia,
              conta,
              digitoConta,
              formaCredito,
            },
          },
        }),
      });

      const data = await resp.json();

      if (data.sucesso) {
        setSimulacaoC6((prev: any) => ({
          ...prev,
          contratadoId: data.id,
          linkFormalizacao: data.formalizacaoLink,
        }));
      }
    } catch (e) {
      console.error("Erro ao criar operação C6", e);
    } finally {
      setEnviandoProposta(false);
      setShowPopupContratar(false);
    }
  };

  // ------------------------------------------------------------
  // RENDER (VISUAL PREMIUM REFEITO COM ROADMAP)
  // ------------------------------------------------------------
  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] relative overflow-hidden font-sans text-slate-800 selection:bg-indigo-100 selection:text-indigo-800">

      {/* --- BACKGROUND ELEMENTS (GLOW EFFECTS) --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-tr from-indigo-100/40 via-purple-50/30 to-blue-50/20 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-50/50 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* --- HEADER --- */}
      <header className="w-full max-w-7xl mx-auto px-6 pt-12 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Empréstimo com Garantia de <span className="text-indigo-600">Veículo</span>
            </h1>
            <p className="text-slate-500 mt-3 text-lg font-medium max-w-2xl leading-relaxed">
              Transforme seu veículo em oportunidades financeiras com taxas exclusivas e aprovação digital C6 Bank.
            </p>
          </div>

          {/* Status Badge */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-full shadow-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-semibold text-slate-600">Sistema Online</span>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="w-full max-w-7xl mx-auto px-6 pb-24">
        <div className="transition-all duration-700 ease-out transform translate-y-0 opacity-100">

          {/* Divider Sutil */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-10" />

          {/* Área Dinâmica dos Cards */}
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            {simulacaoC6?.valorLiberado ? (
              <div className="w-full animate-fade-in scale-100">
                {/* Wrapper para o Card de Simulação para garantir que ele flutue */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative">
                    <CardSimulacaoPresenca
                      banco={{
                        id: "c6",
                        nome: "C6 Bank",
                        tipo: "Crédito com Veículo",
                        logo: c6Logo,
                      }}
                      simulacao={simulacaoC6}
                      linkFormalizacao={simulacaoC6.linkFormalizacao}
                      autorizarConsulta={autorizarConsulta}
                      abrirContratacao={() => {
                        setShowPopupContratar(true);
                        setStepContratar(1);
                      }}
                      criandoOperacao={enviandoProposta}
                      gerandoContrato={false}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Card principal de oferta */}
                <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center">
                  <div className="w-full max-w-4xl hover:transform hover:scale-[1.01] transition-all duration-300">
                    <CardOfertaPresenca
                      banco={{
                        id: "c6",
                        nome: "C6 Bank",
                        tipo: "Crédito com veículo",
                        logo: c6Logo,
                      }}
                      abrirPopupSimulacao={() => setShowPopupC6("c6")}
                      isManualBank={false}
                      onAutorizar={autorizarConsulta} // Passando autorizarConsulta para o CardOfertaPresenca
                      linkTermo={simulacaoC6?.linkTermo} // Passando o link do termo
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* --- NOVO COMPONENTE DE PASSO A PASSO (ROADMAP) --- */}
            <StepByStep currentStep={currentStep} />
          </div>
        </div>
      </main>

      {/* --- POPUPS (MANTIDOS E ENVOLVIDOS PELA LÓGICA) --- */}
      <PopupCarEquityInicial
        show={showPopupC6 === "c6"}
        onClose={() => setShowPopupC6(null)}
        enviar={enviarTermoC6}
        loading={loading}
        salvarProgresso={salvarProgresso}
      />

      <PopupContratar
        show={showPopupContratar}
        step={stepContratar}
        next={() => setStepContratar((s) => s + 1)}
        back={() =>
          stepContratar > 1
            ? setStepContratar((s) => s - 1)
            : setShowPopupContratar(false)
        }
        total={totalStepsContratar}
        endereco={{ cep, rua, numero, complemento, bairro, cidade, estado }}
        setEndereco={{
          setCep,
          setRua,
          setNumero,
          setComplemento,
          setBairro,
          setCidade,
          setEstado,
        }}
        bancario={{
          codigoBanco,
          agencia,
          conta,
          digitoConta,
          formaCredito,
        }}
        setBancario={{
          setCodigoBanco,
          setAgencia,
          setConta,
          setDigitoConta,
          setFormaCredito,
        }}
        finalizar={finalizarProposta}
        enviando={enviandoProposta}
      />
    </div>
  );
}