// src/pages/UserDashboard.tsx
import React, { useState, useEffect, useRef } from "react";

// CARDS
import CardOfertaPresenca from "../components/Cards/CardOfertaPresenca";
import CardSimulacaoPresenca from "../components/Cards/CardSimulacaoPresenca";

// POPUPS
import PopupTermo from "../components/Presenca/PopupTermo";
import PopupContratar from "../components/Contratar/PopupContratar";
import PopupContratarFGTS from "../components/FGTS/PopupContratarFGTS";
import PopupCarEquityInicial from "../components/Presenca/popup_carequity_inicial";
import Popup_NovoSaque_Simular from "../components/Presenca/Popup_NovoSaque_Simular";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";




// NOVO POPUP DE INSTRUÇÃO FGTS
import PopupFGTSInstruction from "../components/Presenca/PopupFGTSInstruction";

// ASSETS
import presencaLogo from "../assets/CLT.png";
import bannerPropostas from "../assets/MinhasPropostas.png";
import fgtsIcon from "../assets/fgts_icon.png";
import c6Logo from "../assets/CarEquity.jpg";
import novoSaqueLogo from "../assets/novo.png";
import Popup_Contratar_NS from "../components/Presenca/Popup_Contratar_NS";


//import fgtsIcon from "../assets/fgts_icon.png";

// Tipo para IDs de banco
type BancoId = "presenca_clt" | "presenca_fgts" | "c6" | "saque_cartao" | null;


export default function UserDashboard() {
  // -------------------------------- STATES --------------------------------
  const [showPopupPresencaCLT, setShowPopupPresencaCLT] = useState<BancoId>(null);
  const [showPopupFGTS, setShowPopupFGTS] = useState(false);
  const [showPopupC6, setShowPopupC6] = useState(false); // Controle específico para C6
  


  // DADOS PESSOAIS
  const [nomePres, setNomePres] = useState("");
  const [cpfPres, setCpfPres] = useState("");
  const [telefonePres, setTelefonePres] = useState("");
  const [emailPres, setEmailPres] = useState("");
  const [dataNascPres, setDataNascPres] = useState("");
  const [salarioBruto, setSalarioBruto] = useState("");



  // FGTS STATES
  const [fgtsEtapa, setFgtsEtapa] = useState<number>(0);
  const [fgtsSaldo, setFgtsSaldo] = useState<any | null>(null);
  const [fgtsSimulacao, setFgtsSimulacao] = useState<any | null>(null);
  const [fgtsTabelaSelecionada, setFgtsTabelaSelecionada] = useState<any | null>(null);

  // CONTRATO TEMPO (CLT)
  const [anosContrato, setAnosContrato] = useState("");
  const [mesesContrato, setMesesContrato] = useState("");

  // NOVOS DADOS DO POPUP TERMO (CLT)
  const [tamanhoEmpresa, setTamanhoEmpresa] = useState("");
  

  // ESTADOS DE LOADING E SIMULAÇÃO (CLT)
  const [loadingPres, setLoadingPres] = useState(false);
  const [melhorSimulacaoPresenca, setMelhorSimulacaoPresenca] = useState<any | null>(null);
  const [statusProposta, setStatusProposta] = useState<"DISPONIVEL" | "EM_ANALISE">("DISPONIVEL");


  // ESTADOS DE LOADING E SIMULAÇÃO (C6 - CAR EQUITY)
  const [loadingC6, setLoadingC6] = useState(false);
  const [simulacaoC6, setSimulacaoC6] = useState<any | null>(null);

  // POPUP CONTRATAR (GENÉRICO PARA CLT E C6)
  const [showPopupContratar, setShowPopupContratar] = useState(false);
  const [stepContratar, setStepContratar] = useState(1);
  const [criandoOperacao, setCriandoOperacao] = useState(false);
  const totalStepsContratar = 3;
  const [gerandoContrato, setGerandoContrato] = useState(false);

  // ENDEREÇO
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  // BANCÁRIO
  const [codigoBanco, setCodigoBanco] = useState("");
  const [agencia, setAgencia] = useState("");
  const [conta, setConta] = useState("");
  const [digitoConta, setDigitoConta] = useState("");
  const [formaCredito, setFormaCredito] = useState("PIX");

  const [enviandoProposta, setEnviandoProposta] = useState(false);

  // BANCO MANUAL / SELEÇÃO
  const [bancoSelecionado, setBancoSelecionado] = useState<string | null>(null);
  const [etapaBancoManual, setEtapaBancoManual] = useState<number>(0);
  
  // POPUP CONTRATAÇÃO FGTS
  const [showPopupContratarFGTS, setShowPopupContratarFGTS] = useState(false);
  const [stepFGTS, setStepFGTS] = useState(1);
  const totalStepsFGTS = 3;
  const [showPopupContratarNS, setShowPopupContratarNS] = useState(false);

  const [dadosFGTS, setDadosFGTS] = useState({
    motherName: "",
    documentIdentificationNumber: "",
    maritalStatus: "",
  });
  const { user } = useAuth();


  const [pagamentoPix, setPagamentoPix] = useState("");
  // NOVO SAQUE
const [showPopupNovoSaque, setShowPopupNovoSaque] = useState(false);
const [loadingNovoSaque, setLoadingNovoSaque] = useState(false);
const [simulacaoNovoSaque, setSimulacaoNovoSaque] = useState<any | null>(null);


  // --- UX STATES & REFS (CARROSSEL) ---
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [searchParams] = useSearchParams();
const produtoCampanha = searchParams.get("produto");


  // BASE API
  const API_BASE =
    ["localhost", "127.0.0.1"].includes(window.location.hostname)
      ? "http://localhost:5000"
      : process.env.REACT_APP_API_URL;

  // 🔵 CORREÇÃO DA DATA
  function formatarDataISO(dt: string) {
    if (!dt) return "";
    const clean = dt.replace(/\D/g, "");
    if (clean.length === 8 && !dt.includes("-")) {
      const dia = clean.substring(0, 2);
      const mes = clean.substring(2, 4);
      const ano = clean.substring(4, 8);
      return `${ano}-${mes}-${dia}`;
    }
    if (clean.length === 8 && dt.includes("-")) {
      return dt;
    }
    return dt;
  }

  // ------------------------------ SCROLL HANDLER (UX) ------------------------------
  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const width = carouselRef.current.offsetWidth;
      // Calcula o índice baseado no scroll (arredondando)
      // Ajuste fino: considera que o card ocupa cerca de 80% da tela mobile
      const index = Math.round(scrollLeft / (width * 0.6)); 
      // Clamp index entre 0 e 2 (agora temos 3 ofertas)
      const safeIndex = Math.min(Math.max(index, 0), ofertas.length - 1);

      setActiveCardIndex(safeIndex);
    }
  };

  const scrollToCard = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.querySelector('div')?.clientWidth || 0;
      // Adiciona um gap
      carouselRef.current.scrollTo({
        left: index * (cardWidth + 20), // 20px é o gap-5 (1.25rem) aproximado
        behavior: 'smooth'
      });
    }
  };

  // ------------------------------------------------------------------
  // Buscar link da formalização (pooling)
  // ------------------------------------------------------------------
  async function buscarLinkFormalizacao(idOperacao: number, isC6 = false) {
    try {
      const endpoint = isC6 ? `c6` : `presenca`;
      const resp = await fetch(`${API_BASE}/${endpoint}/operacoes/${idOperacao}`);
      const data = await resp.json();
      if (!data.sucesso) return null;
      return data.result?.formalizacao?.link ?? null;
    } catch {
      return null;
    }
  }

  // ------------------------------ SALVAR PROGRESSO ------------------------------
  const salvarProgressoBackend = async (extra: any = {}) => {
    try {
      const userStr = localStorage.getItem("altiva_user");
      const user = userStr ? JSON.parse(userStr) : null;
      if (!user?.email) return;

      const etapa = extra.etapaContratacao ?? extra.etapa ?? 0;

      await fetch(`${API_BASE}/progresso/salvar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          cpf: cpfPres,
          nome: nomePres,
          telefone: telefonePres,
          etapa,
          dados: {
            cpf: cpfPres,
            nome: nomePres,
            telefone: telefonePres,
            email: user.email,
            bancoSelecionado,
            melhorSimulacaoPresenca,
            simulacaoC6,
            dataNascPres,
            anosContrato,
            mesesContrato,
            tamanhoEmpresa,
            endereco: { cep, rua, numero, complemento, bairro, cidade, estado },
            bancario: { codigoBanco, agencia, conta, digitoConta, formaCredito },
            etapaContratacao: etapa,
            ...extra,
          },
        }),
      });
    } catch {}
  };
// ------------------------------ C6: SALVAR ESTADO CANÔNICO ------------------------------
const salvarEstadoC6 = (simulacao: any, etapa: number) => {
  salvarProgressoBackend({
    bancoSelecionado: "c6",
    etapaContratacao: etapa,
    simulacaoC6: simulacao
  });
};

  // ------------------- LOAD PROGRESS -------------------
  useEffect(() => {
    const carregar = async () => {
      try {
        let email = null;
        const LS = localStorage.getItem("altiva_user");
        if (LS) email = JSON.parse(LS).email;
        if (!email) return;

        const resp = await fetch(`${API_BASE}/progresso/${email}`);
        const data = await resp.json();
        if (!data.existe) return;

        const d = data.dados || {};

        setEmailPres(email);
        if (d.bancoSelecionado) setBancoSelecionado(d.bancoSelecionado);
        if (typeof d.etapaContratacao === "number") setEtapaBancoManual(d.etapaContratacao);

        if (d.cpf) setCpfPres(d.cpf);
        if (d.nome) setNomePres(d.nome);
        if (d.telefone) setTelefonePres(d.telefone);
        if (d.dataNascPres) setDataNascPres(d.dataNascPres);

        if (d.anosContrato) setAnosContrato(String(d.anosContrato));
        if (d.mesesContrato) setMesesContrato(String(d.mesesContrato));
        if (d.tamanhoEmpresa) setTamanhoEmpresa(d.tamanhoEmpresa);
      

        if (d.melhorSimulacaoPresenca) setMelhorSimulacaoPresenca(d.melhorSimulacaoPresenca);
        if (d.simulacaoC6) {
  setSimulacaoC6(d.simulacaoC6);
  setBancoSelecionado("c6");

  // força o carrossel para o card do C6
  const indexC6 = ofertas.findIndex(o => o.id === "c6");
  if (indexC6 >= 0) {
    setTimeout(() => {
      scrollToCard(indexC6);
      setActiveCardIndex(indexC6);
    }, 200);
  }
}


        if (d.endereco) {
          setCep(d.endereco.cep || "");
          setRua(d.endereco.rua || "");
          setNumero(d.endereco.numero || "");
          setComplemento(d.endereco.complemento || "");
          setBairro(d.endereco.bairro || "");
          setCidade(d.endereco.cidade || "");
          setEstado(d.endereco.estado || "");
        }

        if (d.bancario) {
          setCodigoBanco(d.bancario.codigoBanco || "");
          setAgencia(d.bancario.agencia || "");
          setConta(d.bancario.conta || "");
          setDigitoConta(d.bancario.digitoConta || "");
          setFormaCredito(d.bancario.formaCredito || "PIX");
        }
      } catch {}
    };

    carregar();
  }, []);

  // ------------------------------ POOLING (CLT e C6 formalização) ------------------------------
  useEffect(() => {
    // Verificar qual simulação está ativa para polling
    const targetSimulacao = bancoSelecionado === 'c6' ? simulacaoC6 : melhorSimulacaoPresenca;
    
    if (!targetSimulacao?.contratadoId) return;
    if (targetSimulacao?.linkFormalizacao) return;

    setGerandoContrato(true);
    let attempts = 0;
    const isC6 = bancoSelecionado === 'c6';

    const interval = setInterval(async () => {
      attempts++;
      const link = await buscarLinkFormalizacao(targetSimulacao.contratadoId, isC6);

      if (link || attempts >= 50) {
        if (link) {
          if (isC6) {
             setSimulacaoC6((prev: any) => ({ ...prev, linkFormalizacao: link }));
          } else {
             setMelhorSimulacaoPresenca((prev: any) => ({ ...prev, linkFormalizacao: link }));
          }

          salvarProgressoBackend({
            etapaContratacao: 99,
            linkFormalizacao: link,
            isC6
          });
        }

        setGerandoContrato(false);
        clearInterval(interval);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [melhorSimulacaoPresenca?.contratadoId, simulacaoC6?.contratadoId, bancoSelecionado]);

  // ------------------------------ C6: ENVIAR TERMO ------------------------------
  const enviarTermoC6 = async (dados: any) => {
  setLoadingC6(true);
  setBancoSelecionado("c6");

  // sincroniza dados pessoais
  setNomePres(dados.nome);
  setCpfPres(dados.cpf);
  setTelefonePres(dados.telefone);
  setEmailPres(dados.email || "");
  setDataNascPres(dados.dataNascimento || "");

  try {
    const resp = await fetch(`${API_BASE}/c6/termo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    const data = await resp.json();

    if (data.sucesso) {
      const novoEstado = {
        termoId: data.id,
        linkTermo: data.shortUrl,
      };

      setSimulacaoC6(novoEstado);
      salvarEstadoC6(novoEstado, 1);
    }
  } catch (e) {
    console.error("Erro ao enviar termo C6:", e);
  } finally {
    setLoadingC6(false);
    setShowPopupC6(false);
  }
};


  // ------------------------------ C6: AUTORIZAR CONSULTA ------------------------------
  const autorizarConsultaC6 = async () => {
  if (!simulacaoC6?.termoId) return;

  try {
    const resp = await fetch(`${API_BASE}/c6/simular`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cpf: cpfPres.replace(/\D/g, ""),
        nome: nomePres,
        telefone: telefonePres.replace(/\D/g, ""),
        email: emailPres,
        termoId: simulacaoC6.termoId,
      }),
    });

    const data = await resp.json();

    if (data.sucesso && data.melhorSimulacao) {
      setSimulacaoC6(data.melhorSimulacao);
      salvarEstadoC6(data.melhorSimulacao, 2);
    }
  } catch (e) {
    console.error("Erro na simulação C6", e);
  }
};


  // ------------------------------ PRESENÇA CLT: ENVIAR TERMO ------------------------------
  const enviarPresencaCLT = async (dadosDoPopup?: any) => {
    const dadosFinais = dadosDoPopup || {
      nome: nomePres,
      cpf: cpfPres,
      telefone: telefonePres,
      email: emailPres,
      dataNascimento: dataNascPres,
      anosContrato,
      mesesContrato,
      tamanhoEmpresa,
    };

    salvarProgressoBackend({
      etapaContratacao: 1,
      bancoSelecionado: "presenca_clt",
      anosContrato: dadosFinais.anosContrato,
      mesesContrato: dadosFinais.mesesContrato,
      tamanhoEmpresa: dadosFinais.tamanhoEmpresa,
      
    });

    setLoadingPres(true);

    try {
      const resp = await fetch(`${API_BASE}/presenca/termo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cpf: dadosFinais.cpf.replace(/\D/g, ""),
          nome: dadosFinais.nome,
          telefone: dadosFinais.telefone.replace(/\D/g, ""),
          email: dadosFinais.email,
          dataNascimento: dadosFinais.dataNascimento,
          anosContrato: dadosFinais.anosContrato,
          mesesContrato: dadosFinais.mesesContrato,
          tamanhoEmpresa: dadosFinais.tamanhoEmpresa,
          
        }),
      });

      const data = await resp.json();

      if (data.sucesso) {
        salvarProgressoBackend({
          etapaContratacao: 1,
          linkTermo: data.shortUrl,
          termoId: data.id,
        });

        setMelhorSimulacaoPresenca((prev: any) => ({
          ...(prev || {}),
          linkTermo: data.shortUrl,
          termoId: data.id,
        }));
      }
    } catch (e) {
      console.error("Erro ao enviar termo:", e);
    } finally {
      setLoadingPres(false);
      setShowPopupPresencaCLT(null);
    }
  };

  // ------------------------------ PRESENÇA CLT: AUTORIZAR CONSULTA ------------------------------
// Substitua sua função autorizarConsulta por esta versão
const autorizarConsulta = async () => {
  try {
    const resp = await fetch(`${API_BASE}/presenca/consultar-margem-pos-termo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cpf: cpfPres,
        termoId: melhorSimulacaoPresenca?.termoId
      })
    });

    const data = await resp.json();
    if (!data.sucesso) return;

    const tempoAPI = Number(data.tempoServicoDias);

    if (tempoAPI < 90) {
      setMelhorSimulacaoPresenca({ propostaInvalida: true });
      return;
    }

    const salarioBrutoNum = Number(salarioBruto.replace(/\D/g, "")) / 100;

    if (!salarioBrutoNum || salarioBrutoNum <= 0) {
      setMelhorSimulacaoPresenca({ propostaInvalida: true });
      return;
    }

    const INSS_TABLE = [
      { upTo: 1621.0, rate: 0.075 },
      { upTo: 2902.84, rate: 0.09 },
      { upTo: 4354.27, rate: 0.12 },
      { upTo: 8475.55, rate: 0.14 }
    ];

    const calcINSS = (gross: number) => {
      let remaining = gross;
      let previousCap = 0;
      let contribution = 0;

      for (const faixa of INSS_TABLE) {
        const cap = faixa.upTo;
        const baseInBracket = Math.max(0, Math.min(remaining, cap - previousCap));

        if (baseInBracket > 0) {
          contribution += baseInBracket * faixa.rate;
          remaining -= baseInBracket;
        }

        previousCap = cap;
        if (remaining <= 0) break;
      }

      return Number(contribution.toFixed(2));
    };

    const IR_TABLE = [
      { upTo: 1903.98, rate: 0 },
      { upTo: 2826.65, rate: 0.075 },
      { upTo: 3751.05, rate: 0.15 },
      { upTo: 4664.68, rate: 0.225 },
      { upTo: Infinity, rate: 0.275 }
    ];

    const calcIR = (base: number) => {
      let remaining = base;
      let previousCap = 0;
      let tax = 0;

      for (const faixa of IR_TABLE) {
        const cap = faixa.upTo;
        const baseInBracket = Math.max(0, Math.min(remaining, cap - previousCap));

        if (baseInBracket > 0) {
          tax += baseInBracket * faixa.rate;
          remaining -= baseInBracket;
        }

        previousCap = cap;
        if (remaining <= 0) break;
      }

      return Number(tax.toFixed(2));
    };

    const inss = calcINSS(salarioBrutoNum);
    const baseIR = Math.max(0, salarioBrutoNum - inss);
    const ir = calcIR(baseIR);
    const salarioLiquido = Number((salarioBrutoNum - inss - ir).toFixed(2));

    const anos = Number(anosContrato) || 0;
    const meses = Number(mesesContrato) || 0;
    const totalMesesContrato = anos * 12 + meses;

    let parcelas = 0;

    if (totalMesesContrato < 6) parcelas = 6;
    else if (totalMesesContrato < 12) parcelas = 12;
    else parcelas = 24;

    const margemSimulada = salarioLiquido * 0.35;
    const parcelaMaxima = margemSimulada * 0.7;
    const taxa = 0.0699;

    const valorLiberado =
      parcelaMaxima *
      ((1 - Math.pow(1 + taxa, -parcelas)) / taxa);

    const simulacaoCalculada = {
      valorLiberado: Number(valorLiberado.toFixed(2)),
      valorParcela: Number(parcelaMaxima.toFixed(2)),
      prazo: parcelas,
      taxaJuros: 6.99
    };

    setMelhorSimulacaoPresenca(simulacaoCalculada);

    salvarProgressoBackend({
      bancoSelecionado: "presenca_clt",
      melhorSimulacaoPresenca: simulacaoCalculada,
      etapaContratacao: 2
    });

  } catch (err) {
    console.error("Erro ao consultar margem:", err);
  }
};





  // ------------------------------ ABRIR CONTRATAR ------------------------------
  const abrirPopupContratar = () => {
    setShowPopupContratar(true);
    setStepContratar(1);
    salvarProgressoBackend({ etapaContratacao: 3 });
  };
  const abrirPopupContratarNovoSaque = () => {
  setShowPopupContratarNS(true);
};

  // ------------------------------ HANDLER DO FGTS ------------------------------
  const abrirPopupFGTS = () => {
    setBancoSelecionado("presenca_fgts");
    setShowPopupPresencaCLT("presenca_fgts");
    setFgtsEtapa(1);
  };

  // ------------------------------ FINALIZAR PROPOSTA (CLT e C6) ------------------------------
  const finalizarProposta = async () => {
    
    // Determina qual simulação usar com base no banco selecionado
    const isC6 = bancoSelecionado === "c6";
    const simulacaoAtiva = isC6 ? simulacaoC6 : melhorSimulacaoPresenca;
    const endpoint = isC6 ? "c6" : "presenca";

    if (!simulacaoAtiva) return console.error("Sem simulação para finalizar a proposta.");
    if (!cep || !rua || !numero || !bairro || !cidade || !estado) return console.error("Endereço incompleto");
    if (!codigoBanco || !agencia || !conta) return console.error("Dados bancários incompletos");

    setShowPopupContratar(false);
    setCriandoOperacao(true);
    setEnviandoProposta(true);

    try {
      const resp = await fetch(`${API_BASE}/${endpoint}/operacao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposta: {
            valorSolicitado: Number(simulacaoAtiva.valorLiberado),
            quantidadeParcelas: Number(simulacaoAtiva.prazo),
            produtoId: simulacaoAtiva.produtoId ?? 28, // Default apenas para Presenca
            valorParcela: Number(simulacaoAtiva.valorParcela),
            tabelaId: Number(simulacaoAtiva.id),
          },
          tomador: {
            cpf: cpfPres.replace(/\D/g, ""),
            nome: nomePres,
            email: emailPres,
            dataNascimento: isC6 ? dataNascPres : simulacaoAtiva.dataNascimento,
            nomeMae: simulacaoAtiva.nomeMae || "", // C6 não exige neste ponto
            sexo: simulacaoAtiva.sexo || "",
            telefone: {
              ddd: telefonePres.replace(/\D/g, "").substring(0, 2),
              numero: telefonePres.replace(/\D/g, "").substring(2),
            },
            endereco: { cep, rua, numero, complemento, bairro, cidade, estado },
            dadosBancarios: { codigoBanco, agencia, conta, digitoConta, formaCredito },
          },
        }),
      });

      const data = await resp.json();

      if (data.sucesso) {
  const idOperacao = data.id;
  const link = data.formalizacaoLink ?? null;

  setStatusProposta("EM_ANALISE");

  setCriandoOperacao(false);
  setGerandoContrato(true);


  const novoEstado = {
    ...simulacaoAtiva,
    contratadoId: idOperacao,
    linkFormalizacao: link,
  };

  if (isC6) {
    setSimulacaoC6(novoEstado);
    salvarEstadoC6(novoEstado, 99);
  } else {
    setMelhorSimulacaoPresenca(novoEstado);
    salvarProgressoBackend({
      etapaContratacao: 99,
      contratadoId: idOperacao,
      linkFormalizacao: link,
    });
  }
} else {
  setCriandoOperacao(false);

  const estadoInvalido = {
    ...simulacaoAtiva,
    propostaInvalida: true,
  };

  if (isC6) setSimulacaoC6(estadoInvalido);
  else setMelhorSimulacaoPresenca(estadoInvalido);

  console.error("Erro ao enviar proposta. Resposta da API não foi sucesso.");
}

   } catch (e) {
  setCriandoOperacao(false);

  const estadoInvalido = {
    ...simulacaoAtiva,
    propostaInvalida: true,
  };

  if (isC6) setSimulacaoC6(estadoInvalido);
  else setMelhorSimulacaoPresenca(estadoInvalido);

  console.error("Erro ao criar operação. Tente novamente.", e);
} finally {
  setEnviandoProposta(false);
}
};

  // ------------------------------ STYLES INLINE ------------------------------
  const customStyles = `
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.6s ease-out forwards;
    }
    
    /* ANIMAÇÃO DE BOUNCE LATERAL PARA A SETA DE HINT */
    @keyframes bounceHorizontal {
        0%, 100% { transform: translateX(0); }
        50% { transform: translateX(5px); }
    }
    .animate-bounce-horizontal {
        animation: bounceHorizontal 1.5s infinite;
    }
  `;

  // ------------------------------ Handler enviado ao PopupTermo ------------------------------
  const handleEnviarTermo = async (dados: any) => {
    if (bancoSelecionado === "presenca_fgts") {
      await salvarProgressoBackend({
        etapaContratacao: 1,
        bancoSelecionado: "presenca_fgts",
        ...dados,
      });

      setEtapaBancoManual(1);
      setShowPopupPresencaCLT(null);
      return;
    }
    return enviarPresencaCLT(dados);
  };

  // ------------------------------ DADOS DOS BANCOS ------------------------------
  const ofertas = [
    {
      id: "presenca_clt",
      nome: "CRÉDITO CLT - NITZ",
      tipo: "Crédito do Trabalhador",
      logo: presencaLogo,
      manual: false,
      abrirPopup: () => {
        setBancoSelecionado("presenca_clt");
        setShowPopupPresencaCLT("presenca_clt" as BancoId);
      },
      linkTermo: melhorSimulacaoPresenca?.linkTermo,
      onAutorizar: autorizarConsulta,
    },
	{
    id: "saque_cartao",
    nome: "Novo Saque",
    tipo: "Saque com Cartão de Crédito",
    logo: novoSaqueLogo,
    manual: false,
    abrirPopup: () => {
    setBancoSelecionado("saque_cartao");
    setShowPopupNovoSaque(true);
},
    linkTermo: undefined,
    onAutorizar: undefined,
},
    {
      id: "presenca_fgts",
      nome: "FGTS",
      tipo: "SAQUE-ANIVERSÁRIO",
      logo: fgtsIcon,
      manual: true,
      abrirPopup: abrirPopupFGTS,
      linkTermo: undefined,
      onAutorizar: undefined,
      onSimularManualWhatsApp: () => setShowPopupFGTS(true),
    },
    {
        id: "c6",
        nome: "CRÉDITO COM GARANTIA VEÍCULAR",
        tipo: "Car Equity",
        logo: c6Logo,
        manual: false,
        abrirPopup: () => {
            setBancoSelecionado("c6");
            setShowPopupC6(true);
        },
        linkTermo: simulacaoC6?.linkTermo,
        onAutorizar: autorizarConsultaC6,
    }


  ];
// ------------------------------
// CAMPANHA: FOCO NO PRODUTO VIA URL
// ------------------------------
useEffect(() => {
  if (!produtoCampanha) return;

  const index = ofertas.findIndex(o => o.id === produtoCampanha);
  if (index < 0) return;

  // pequeno delay para garantir que o carrossel já foi renderizado
  const t = setTimeout(() => {
    scrollToCard(index);
    setActiveCardIndex(index);
    setBancoSelecionado(produtoCampanha);
  }, 300);

  return () => clearTimeout(t);
}, [produtoCampanha, ofertas]);
// ------------------------------
// GARANTIA DE TIMING: LOGIN → DADOS → AÇÕES
// ------------------------------
useEffect(() => {
  if (!user?.email) return;      // 🔒 login ainda não hidratado
  if (!dataNascPres) return;    // 🔒 dados obrigatórios ainda não prontos

  // NÃO chama nada automaticamente aqui
  // Esse effect existe só para garantir que
  // qualquer ação futura tenha email válido

}, [user?.email, dataNascPres]);


  // --------------------------------------------
  // 🔵 FGTS — FUNÇÕES DE API (USAM APENAS BACKEND)
  // --------------------------------------------

  async function iniciarConsultaFGTS() {
    try {
      const resp = await fetch(`${API_BASE}/fgts/iniciar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf: cpfPres.replace(/\D/g, "") }),
      });
      const data = await resp.json();
      return data.sucesso === true;
    } catch (e) {
      console.error("Erro iniciar consulta FGTS:", e);
      return false;
    }
  }

  async function buscarSaldoFGTS() {
    try {
      const resp = await fetch(`${API_BASE}/fgts/resultado/${cpfPres.replace(/\D/g, "")}`);
      const data = await resp.json();
      if (!data.sucesso) return null;
      return data.resultado ?? null;
    } catch (e) {
      console.error("Erro buscar saldo FGTS:", e);
      return null;
    }
  }

  async function buscarTabelasFGTS() {
    try {
      const resp = await fetch(`${API_BASE}/fgts/tabelas`);
      const data = await resp.json();
      if (!data.sucesso) return [];
      return data.tabelas || [];
    } catch (e) {
      console.error("Erro buscar tabelas FGTS:", e);
      return [];
    }
  }

  async function simularFGTS(balanceData: any, tabela: any) {
    try {
      const resp = await fetch(`${API_BASE}/fgts/simular`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          balanceId: balanceData.id || balanceData.balanceId || balanceData.balanceId,
          cpf: cpfPres.replace(/\D/g, ""),
          tabela,
          periods: balanceData.periods || balanceData.installments || [],
        }),
      });
      const data = await resp.json();
      return data.simulacao ?? data;
    } catch (e) {
      console.error("Erro simular FGTS:", e);
      return null;
    }
  }

  async function criarPropostaFGTS(simulacao: any, tabela: any) {
    try {
      const resp = await fetch(`${API_BASE}/fgts/proposta`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dadosCliente: {
            nome: nomePres,
            cpf: cpfPres,
            email: emailPres,
            telefone: telefonePres,
            dataNasc: formatarDataISO(dataNascPres),
            cep, estado, bairro, numero, cidade, rua, complemento,
            nomeMae: dadosFGTS.motherName,
            rg: dadosFGTS.documentIdentificationNumber,
            estadoCivil: dadosFGTS.maritalStatus,
            chavePix: pagamentoPix,
          },
          simulacao,
          tabela,
          periods: simulacao?.periods || simulacao?.installments || [],
        }),
      });
      const data = await resp.json();
      return data.proposta ?? data;
    } catch (e) {
      console.error("Erro criar proposta FGTS:", e);
      return null;
    }
  }

  // --------------------------------------------
  // 🔵 FGTS — FLUXO DE CONTROLE (STATES E EFFECTS)
  // --------------------------------------------
  function retryFGTS() {
    setFgtsEtapa(3);
    iniciarFluxoFGTS();
  }
  async function iniciarFluxoFGTS() {
    setFgtsEtapa(3);
    await iniciarConsultaFGTS();
  }

  useEffect(() => {
    if (fgtsEtapa !== 3) return;
    let mounted = true;
    const interval = setInterval(async () => {
      try {
        const saldo = await buscarSaldoFGTS();
        if (!mounted) return;
        if (saldo) {
          setFgtsSaldo(saldo);
          setFgtsEtapa(4);
          clearInterval(interval);
        }
      } catch (e) {
        console.error("Erro no pooling FGTS:", e);
      }
    }, 2000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [fgtsEtapa, cpfPres]);

  useEffect(() => {
    if (fgtsEtapa !== 4 || !fgtsSaldo) return;
    (async () => {
      const tabelas = await buscarTabelasFGTS();
      const tabelaSelecionada = tabelas && tabelas.length ? tabelas[0] : null;
      setFgtsTabelaSelecionada(tabelaSelecionada);
      const simul = await simularFGTS(fgtsSaldo, tabelaSelecionada);
      setFgtsSimulacao(simul);
      setFgtsEtapa(5);
    })();
  }, [fgtsEtapa, fgtsSaldo]);

  useEffect(() => {
    const isAnyPopupOpen = !!showPopupPresencaCLT || showPopupFGTS || showPopupContratar || showPopupC6  || showPopupContratarNS || showPopupNovoSaque;
    const current = document.body.style.overflow;
    const desired = isAnyPopupOpen ? "hidden" : "";
    if (current !== desired) {
      document.body.style.overflow = desired;
    }
  }, [showPopupPresencaCLT, showPopupFGTS, showPopupContratar, showPopupC6]);


const enviarSimulacaoNovoSaque = async (dadosDaSimulacao: any) => {
  // 1. Verificação de autenticação
  if (!user?.email) {
    console.warn("Usuário ainda não autenticado. Abortando simulação.");
    return;
  }

  setLoadingNovoSaque(true);
  setBancoSelecionado("saque_cartao");

  // 2. Sincronização imediata dos estados globais (para uso em outros componentes)
  setNomePres(dadosDaSimulacao.nome);
  setCpfPres(dadosDaSimulacao.cpf);
  setTelefonePres(dadosDaSimulacao.telefone);
  setDataNascPres(dadosDaSimulacao.dataNascimento);
  setEmailPres(user.email);

  // 3. Montagem do Payload usando os dados vindos DIRETAMENTE do formulário
  // Isso garante que mesmo um usuário novo envie dados completos.
  const payload = {
    email: user.email, 
    cpf: dadosDaSimulacao.cpf.replace(/\D/g, ""),
    nome: dadosDaSimulacao.nome.trim(),
    telefone: dadosDaSimulacao.telefone.replace(/\D/g, ""),
    value: Number(dadosDaSimulacao.value),
    installments: Number(dadosDaSimulacao.installments),
    dataNascimento: dadosDaSimulacao.dataNascimento 
  };

  try {
    const resp = await fetch(`${API_BASE}/saque/simular`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await resp.json();

    if (!data.sucesso || !data.simulacao) {
      throw new Error("Resposta de simulação inválida do servidor");
    }

    // 4. Atualiza o estado da simulação com o retorno do backend
    setSimulacaoNovoSaque(data.simulacao);

    // 5. UX: Move o carrossel para o card do Novo Saque para mostrar o resultado
    const indexNovoSaque = ofertas.findIndex(o => o.id === "saque_cartao");
    if (indexNovoSaque >= 0) {
      setTimeout(() => {
        scrollToCard(indexNovoSaque);
        setActiveCardIndex(indexNovoSaque);
      }, 100);
    }

    // 6. Persistência: Salva o progresso para que, se ele fechar a página, a simulação volte
    salvarProgressoBackend({
      bancoSelecionado: "saque_cartao",
      simulacaoNovoSaque: data.simulacao,
      etapaContratacao: 2, // Etapa de simulação concluída
      // Salva os dados de contato atualizados
      nome: dadosDaSimulacao.nome,
      cpf: dadosDaSimulacao.cpf,
      telefone: dadosDaSimulacao.telefone,
      dataNascPres: dadosDaSimulacao.dataNascimento
    });

  } catch (e) {
    console.error("❌ Erro ao simular Novo Saque:", e);
    // Opcional: setErro("Falha na simulação. Verifique os dados e tente novamente.");
  } finally {
    setLoadingNovoSaque(false);
    setShowPopupNovoSaque(false);
  }
};




  // ------------------------------ RENDER ------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pb-20 px-0 flex flex-col items-center relative font-sans text-slate-800">
      <style>{customStyles}</style>

      {/* --- BANNER HERO COM OVERLAY MODERNO --- */}
      <div className="relative w-full h-[220px] md:h-[280px] overflow-hidden shadow-md z-0">
        <img
          src={bannerPropostas}
          alt="Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/90 via-[#0A2540]/40 to-transparent pointer-events-none" />
        
        <div className="absolute inset-0 flex flex-col justify-center items-center z-10 px-4 mt-6">
          <h1 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight text-center drop-shadow-lg animate-fade-in-up">
            Simule e Contrate
          </h1>
          <p className="text-white/90 text-sm md:text-lg mt-2 text-center max-w-xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Escolha a melhor oferta e receba seu crédito de forma rápida e segura.
          </p>
        </div>
      </div>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <div className="w-full max-w-7xl relative z-20 -mt-16 px-0 md:px-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        
        {/* ÁREA DO CARROSSEL DE OFERTAS / SIMULAÇÕES */}
        <div className="relative w-full">
            
            {/* 🔵 UX HINT: Seta animada flutuante (apenas mobile, se estiver no 1º slide) */}
            <div 
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-30 md:hidden pointer-events-none transition-opacity duration-500 ease-in-out ${activeCardIndex === 0 ? 'opacity-100' : 'opacity-0'}`}
                style={{ top: '45%' }} // Ajuste fino para alinhar verticalmente com o card
            >
                <div className="bg-white/90 backdrop-blur-sm p-3 rounded-l-full shadow-lg border-l border-t border-b border-slate-200 animate-bounce-horizontal flex items-center">
                   {/* Ícone chevron simples SVG */}
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A2540" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                   </svg>
                </div>
            </div>

            {/* CONTAINER COM SCROLL */}
            <div
                ref={carouselRef}
                onScroll={handleScroll}
                className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-8 pl-6 pr-12 md:px-2 items-stretch"
                style={{ WebkitOverflowScrolling: "touch", scrollPaddingLeft: "1.5rem" }}
            >
                {ofertas.map((banco, idx) => {
                    const isFgtsSimulado = banco.id === 'presenca_fgts' && fgtsSimulacao;
                    const isCltSimulado = banco.id === 'presenca_clt' && melhorSimulacaoPresenca?.valorLiberado;
                    const isC6Simulado = banco.id === 'c6' && simulacaoC6?.valorLiberado;
					const isNovoSaqueSimulado =
  banco.id === "saque_cartao" &&
  !!simulacaoNovoSaque?.valorLiberado;



                    return (
                        <div 
                            key={banco.id} 
                            // 🟡 UX ALTERADA: width reduzido no mobile de 85vw para 78vw para mostrar a ponta do próximo card
                            className="snap-start flex-shrink-0 w-[78vw] sm:w-[320px] md:w-[350px] transition-transform duration-300 hover:scale-[1.02] hover:-translate-y-2"
                            style={{ animationDelay: `${0.1 * idx}s` }}
                        >
                            <div className="h-full rounded-2xl shadow-lg hover:shadow-2xl bg-white overflow-hidden border border-slate-100">
                               {isNovoSaqueSimulado ? (
  <CardSimulacaoPresenca
    banco={{
      id: "saque_cartao",
      nome: "Novo Saque",
      tipo: "Saque com Cartão de Crédito",
      logo: novoSaqueLogo,
    }}
	 statusProposta="DISPONIVEL"
    simulacao={{
    valorLiberado: simulacaoNovoSaque.valorLiberado,
    valorParcela: simulacaoNovoSaque.valorParcela,
    prazo: simulacaoNovoSaque.parcelas,          // 🔥 AQUI
    taxaJuros: simulacaoNovoSaque.taxaJurosMensal // 🔥 AQUI
    }}
    linkFormalizacao={null}
    criandoOperacao={false}
    gerandoContrato={false}
    autorizarConsulta={() => {}}
    abrirContratacao={abrirPopupContratarNovoSaque}

  />
) : isFgtsSimulado ? (
  <CardSimulacaoPresenca
    banco={{
      id: "presenca_fgts",
      nome: "FGTS Saque-Aniversário",
      tipo: "FGTS",
      logo: fgtsIcon,
    }}
	statusProposta="DISPONIVEL"
    simulacao={{
      valorLiberado: fgtsSimulacao.availableBalance,
      valorParcela: fgtsSimulacao.installments?.[0]?.amount ?? 0,
      prazo: fgtsSimulacao.totalInstallments,
      taxaJuros: fgtsSimulacao.tax,
      id: fgtsSimulacao.id,
    }}
    linkFormalizacao={fgtsSimulacao?.formalizationLink ?? null}
    criandoOperacao={false}
    gerandoContrato={false}
    abrirContratacao={() => {
      setShowPopupContratarFGTS(true);
      setStepFGTS(1);
    }}
    autorizarConsulta={() => {}}
  />
) : isCltSimulado ? (
  <CardSimulacaoPresenca
    banco={{
      id: "presenca_clt",
      nome: "CRÉDITO CLT",
      tipo: "Crédito CLT",
      logo: presencaLogo,
    }}
    simulacao={melhorSimulacaoPresenca} 
    linkFormalizacao={melhorSimulacaoPresenca.linkFormalizacao}
    abrirContratacao={abrirPopupContratar}
    autorizarConsulta={autorizarConsulta}
    criandoOperacao={criandoOperacao}
    gerandoContrato={gerandoContrato}
    statusProposta={statusProposta}
  />

) : isC6Simulado ? (
  <CardSimulacaoPresenca
    banco={{
      id: "c6",
      nome: "C6 Bank",
      tipo: "Crédito com Veículo",
      logo: c6Logo,
    }}
    simulacao={simulacaoC6}
    linkFormalizacao={simulacaoC6.linkFormalizacao}
    autorizarConsulta={autorizarConsultaC6}
    abrirContratacao={abrirPopupContratar}
    criandoOperacao={enviandoProposta}
    gerandoContrato={gerandoContrato}
	statusProposta="DISPONIVEL"
  />
) : (
  <CardOfertaPresenca
    banco={{
      id: banco.id,
      nome: banco.nome,
      tipo: banco.tipo,
      logo: banco.logo,
    }}
    isManualBank={banco.manual}
    etapa={bancoSelecionado === banco.id ? etapaBancoManual : 0}
    abrirPopupSimulacao={banco.abrirPopup}
    linkTermo={
      banco.id === "presenca_clt"
        ? banco.linkTermo
        : banco.id === "c6"
        ? banco.linkTermo
        : undefined
    }
    onAutorizar={
      banco.id === "presenca_clt"
        ? autorizarConsulta
        : banco.id === "c6"
        ? autorizarConsultaC6
        : undefined
    }
    onSimularManualWhatsApp={banco.onSimularManualWhatsApp}
    fgtsLoadingTrigger={banco.id === "presenca_fgts" && fgtsEtapa === 3}
    onRetryFGTS={retryFGTS}
  />
)}

         </div>
                        </div>
                    );
                })}
            </div>

            {/* 🔵 UX HINT: Indicadores de Paginação (Dots) */}
            <div className="flex justify-center items-center gap-2 mt-0 md:mt-4 mb-6">
                {ofertas.map((_, idx) => (
                    <button 
                        key={idx}
                        onClick={() => scrollToCard(idx)}
                        className={`transition-all duration-300 rounded-full h-2 ${
                            activeCardIndex === idx 
                                ? 'w-8 bg-[#0A2540] shadow-sm' 
                                : 'w-2 bg-slate-300 hover:bg-slate-400'
                        }`}
                        aria-label={`Ir para oferta ${idx + 1}`}
                    />
                ))}
            </div>

        </div>

      </div>

      {/* --- MODAIS --- */}
      <PopupTermo
        show={!!showPopupPresencaCLT && (showPopupPresencaCLT === "presenca_clt" || showPopupPresencaCLT === "presenca_fgts")}
        onClose={() => setShowPopupPresencaCLT(null)}
        nomePres={nomePres} setNomePres={setNomePres}
        cpfPres={cpfPres} setCpfPres={setCpfPres}
        telefonePres={telefonePres} setTelefonePres={setTelefonePres}
        emailPres={emailPres} setEmailPres={setEmailPres}
        dataNascPres={dataNascPres} setDataNascPres={setDataNascPres}
        anosContrato={anosContrato} setAnosContrato={setAnosContrato}
        mesesContrato={mesesContrato} setMesesContrato={setMesesContrato}
        tamanhoEmpresa={tamanhoEmpresa} setTamanhoEmpresa={setTamanhoEmpresa}
		salarioBruto={salarioBruto}
setSalarioBruto={setSalarioBruto}
        enviar={(dados) => handleEnviarTermo(dados)}
        loading={loadingPres}
      />
	<Popup_Contratar_NS
  show={showPopupContratarNS}
  onClose={() => setShowPopupContratarNS(false)}
  loading={enviandoProposta}
  nome={nomePres}
  cpf={cpfPres}
  email={emailPres}
  telefone={telefonePres}
  dataNascimento={dataNascPres}
onSubmit={async (payload) => {
  try {
    setEnviandoProposta(true);

    /* 1️⃣ PREPARAR O OBJETO CONSOLIDADO */
    // Juntamos os dados de simulação (valores, parcelas) 
    // com os dados de contratação (endereço, banco, pais)
    const dadosCompletos = {
      tipo: "saque_cartao_credito",
      data_solicitacao: new Date().toISOString(),
      simulacao: simulacaoNovoSaque, // Dados vindos da etapa anterior
      contratacao: payload.customer, // Dados vindos do Popup (CEP, Pai, Mãe, Banco, etc)
      cliente: {
        nome: nomePres,
        cpf: cpfPres,
        email: emailPres,
        telefone: telefonePres
      }
    };

    /* 2️⃣ SALVAR NO SEU BACKEND (progresso_proposta) */
    // A função salvarProgressoBackend já envia para a rota que salva no banco
    await salvarProgressoBackend({
      bancoSelecionado: "saque_cartao",
      etapaContratacao: 4, // Etapa finalizada
      dadosContratacaoNovoSaque: dadosCompletos // Isso será stringificado e salvo na coluna 'dados'
    });

    /* 3️⃣ ABRIR WHATSAPP */
    const numWhats = "5511977191411";
    const mensagem = encodeURIComponent(
      "Olá, gostaria de contratar minha proposta de Saque com Limite do Cartão de Crédito!"
    );

    window.open(`https://wa.me/${numWhats}?text=${mensagem}`, "_blank");

    /* 4️⃣ FECHAR POPUP */
    setShowPopupContratarNS(false);

  } catch (err) {
    console.error("❌ Erro ao salvar dados do Novo Saque:", err);
    alert("Ocorreu um erro ao salvar sua solicitação. Por favor, tente novamente.");
  } finally {
    setEnviandoProposta(false);
  }
}}


/>


      
      {/* POPUP ESPECÍFICO DO C6 */}
      <PopupCarEquityInicial
        show={showPopupC6}
        onClose={() => setShowPopupC6(false)}
        enviar={enviarTermoC6}
        loading={loadingC6}
        salvarProgresso={salvarProgressoBackend}
      />
      
      <PopupFGTSInstruction
        show={showPopupFGTS}
        onClose={() => setShowPopupFGTS(false)}
        onContinue={() => {
          setShowPopupFGTS(false);
          iniciarFluxoFGTS();
        }}
      />

    <PopupContratar
  show={showPopupContratar}
  step={stepContratar}
  next={() => {
    setStepContratar((s) => s + 1);
    salvarProgressoBackend({ etapaContratacao: stepContratar + 1 });
  }}
  back={() =>
    stepContratar > 1
      ? setStepContratar((s) => s - 1)
      : setShowPopupContratar(false)
  }
  total={totalStepsContratar}
  cpf={cpfPres}
  endereco={{ cep, rua, numero, complemento, bairro, cidade, estado }}
  setEndereco={{
    setCep,
    setRua,
    setNumero,
    setComplemento,
    setBairro,
    setCidade,
    setEstado
  }}
  bancario={{ codigoBanco, agencia, conta, digitoConta, formaCredito }}
  setBancario={{
    setCodigoBanco,
    setAgencia,
    setConta,
    setDigitoConta,
    setFormaCredito
  }}
  finalizar={finalizarProposta}
  enviando={enviandoProposta}
  salvarProgresso={salvarProgressoBackend}
/>

      
      <PopupContratarFGTS
        show={showPopupContratarFGTS}
        step={stepFGTS}
        next={() => setStepFGTS((s) => s + 1)}
        back={() => {
            if (stepFGTS === 1) {
                setShowPopupContratarFGTS(false);
            } else {
                setStepFGTS((s) => s - 1);
            }
        }}
        total={totalStepsFGTS}
        dadosFGTS={dadosFGTS} setDadosFGTS={setDadosFGTS}
        endereco={{ cep, rua, numero, complemento, bairro, cidade, estado }}
        setEndereco={{ setCep, setRua, setNumero, setComplemento, setBairro, setCidade, setEstado }}
        pagamentoPix={pagamentoPix} setPagamentoPix={setPagamentoPix}
        finalizar={async () => {
            const proposta = await criarPropostaFGTS(fgtsSimulacao, fgtsTabelaSelecionada);
            if (proposta?.formalizationLink) {
                setFgtsSimulacao((prev: any) => ({
                    ...prev,
                    formalizationLink: proposta.formalizationLink,
                }));
            }
            setShowPopupContratarFGTS(false);
        }}
        enviando={false}
      />
	<Popup_NovoSaque_Simular
  show={showPopupNovoSaque}
  onClose={() => setShowPopupNovoSaque(false)}
  nomePres={nomePres} setNomePres={setNomePres}
  cpfPres={cpfPres} setCpfPres={setCpfPres}
  telefonePres={telefonePres} setTelefonePres={setTelefonePres}
  emailPres={emailPres} setEmailPres={setEmailPres}
  dataNascPres={dataNascPres} setDataNascPres={setDataNascPres}
  enviar={enviarSimulacaoNovoSaque}
  loading={loadingNovoSaque}
/>

    </div>
  );
}