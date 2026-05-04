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

// Tipo para IDs de banco
type BancoId = "presenca_clt" | "presenca_fgts" | "c6" | "saque_cartao" | null;

// ============================================================
// 🎯 CONFIGURAÇÃO DE CARDS - LIGUE/DESLIGUE AQUI
// ============================================================
const CARD_CONFIG = {
  presenca_clt: {
    enabled: false,        // 👈 Mude para false para desativar
    priority: 1,          // Ordem de exibição (menor = primeiro)
  },
  presenca_fgts: {
    enabled: false,        // 👈 Mude para false para desativar
    priority: 2,
  },
  c6: {
    enabled: false,        // 👈 Mude para false para desativar
    priority: 3,
  },
  saque_cartao: {
    enabled: true,        // 👈 Mude para false para desativar
    priority: 4,
  },
};
// ============================================================

export default function UserDashboard() {
  // -------------------------------- STATES --------------------------------
  const [showPopupPresencaCLT, setShowPopupPresencaCLT] = useState<BancoId>(null);
  const [showPopupFGTS, setShowPopupFGTS] = useState(false);
  const [showPopupC6, setShowPopupC6] = useState(false);

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
      const index = Math.round(scrollLeft / (width * 0.6)); 
      const safeIndex = Math.min(Math.max(index, 0), ofertasAtivas.length - 1);
      setActiveCardIndex(safeIndex);
    }
  };

  const scrollToCard = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.querySelector('div')?.clientWidth || 0;
      carouselRef.current.scrollTo({
        left: index * (cardWidth + 20),
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
            cep, rua, numero, complemento, bairro, cidade, estado,
            codigoBanco, agencia, conta, digitoConta, formaCredito,
            ...extra,
          },
        }),
      });
    } catch (err) {
      console.error("Erro ao salvar progresso:", err);
    }
  };

  // ------------------------------ RESTAURAR PROGRESSO ------------------------------
  const restaurarProgressoBackend = async () => {
    try {
      const userStr = localStorage.getItem("altiva_user");
      const user = userStr ? JSON.parse(userStr) : null;
      if (!user?.email) return;

      const resp = await fetch(`${API_BASE}/progresso/buscar?email=${user.email}`);
      const data = await resp.json();
      if (data.sucesso && data.result?.dados) {
        const d = data.result.dados;

        if (d.cpf) setCpfPres(d.cpf);
        if (d.nome) setNomePres(d.nome);
        if (d.telefone) setTelefonePres(d.telefone);
        if (d.dataNascPres) setDataNascPres(d.dataNascPres);
        if (d.anosContrato) setAnosContrato(d.anosContrato);
        if (d.mesesContrato) setMesesContrato(d.mesesContrato);
        if (d.tamanhoEmpresa) setTamanhoEmpresa(d.tamanhoEmpresa);

        if (d.bancoSelecionado) setBancoSelecionado(d.bancoSelecionado);
        if (d.melhorSimulacaoPresenca) setMelhorSimulacaoPresenca(d.melhorSimulacaoPresenca);
        if (d.simulacaoC6) setSimulacaoC6(d.simulacaoC6);

        if (d.cep) setCep(d.cep);
        if (d.rua) setRua(d.rua);
        if (d.numero) setNumero(d.numero);
        if (d.complemento) setComplemento(d.complemento);
        if (d.bairro) setBairro(d.bairro);
        if (d.cidade) setCidade(d.cidade);
        if (d.estado) setEstado(d.estado);

        if (d.codigoBanco) setCodigoBanco(d.codigoBanco);
        if (d.agencia) setAgencia(d.agencia);
        if (d.conta) setConta(d.conta);
        if (d.digitoConta) setDigitoConta(d.digitoConta);
        if (d.formaCredito) setFormaCredito(d.formaCredito);

        if (d.etapaContratacao) setStepContratar(d.etapaContratacao);
        if (d.etapaBancoManual) setEtapaBancoManual(d.etapaBancoManual);
      }
    } catch (err) {
      console.error("Erro ao restaurar progresso:", err);
    }
  };

  useEffect(() => {
    restaurarProgressoBackend();
  }, []);

  // ------------------------------ AUTORIZAR CONSULTA (CLT) ------------------------------
  const autorizarConsulta = async (dados: any) => {
    setLoadingPres(true);
    setBancoSelecionado("presenca_clt");
    setEtapaBancoManual(1);

    setNomePres(dados.nome);
    setCpfPres(dados.cpf);
    setTelefonePres(dados.telefone);
    setEmailPres(dados.email);
    setDataNascPres(formatarDataISO(dados.dataNascimento));
    setAnosContrato(dados.anosContrato);
    setMesesContrato(dados.mesesContrato);
    setTamanhoEmpresa(dados.tamanhoEmpresa);
    setSalarioBruto(dados.salarioBruto);

    await salvarProgressoBackend({
      bancoSelecionado: "presenca_clt",
      etapaBancoManual: 1,
      ...dados,
    });

    try {
      const resp = await fetch(`${API_BASE}/presenca/autorizar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: dados.nome,
          cpf: dados.cpf,
          telefone: dados.telefone,
          email: dados.email,
          dataNascimento: formatarDataISO(dados.dataNascimento),
        }),
      });

      const data = await resp.json();
      if (!data.sucesso) {
        alert("Erro ao criar/autorizar consulta");
        setLoadingPres(false);
        return;
      }

      const linkAutorizacao = data.result?.link;
      if (!linkAutorizacao) {
        alert("Link de autorização não encontrado.");
        setLoadingPres(false);
        return;
      }

      window.open(linkAutorizacao, "_blank", "noopener,noreferrer");

      setEtapaBancoManual(2);
      await salvarProgressoBackend({ etapaBancoManual: 2 });

      aguardarConsentimento(linkAutorizacao);
    } catch (err) {
      console.error(err);
      alert("Erro na autorização. Tente novamente.");
      setLoadingPres(false);
    }
  };

  async function aguardarConsentimento(linkAutorizacao: string) {
    const urlObj = new URL(linkAutorizacao);
    const consentToken = urlObj.searchParams.get("consent_token");

    if (!consentToken) {
      alert("Token de consentimento não identificado.");
      setLoadingPres(false);
      return;
    }

    let tentativas = 0;
    const maxTentativas = 60;
    const intervaloMs = 5000;

    const interval = setInterval(async () => {
      tentativas++;

      try {
        const resp = await fetch(
          `${API_BASE}/presenca/validar-consentimento?consentToken=${consentToken}`
        );
        const data = await resp.json();

        if (data.sucesso && data.consentido) {
          clearInterval(interval);
          setEtapaBancoManual(3);
          await salvarProgressoBackend({ etapaBancoManual: 3 });

          setTimeout(() => {
            enviarSimulacao(consentToken);
          }, 1500);
        }

        if (tentativas >= maxTentativas) {
          clearInterval(interval);
          alert("Tempo esgotado. Por favor, tente novamente.");
          setLoadingPres(false);
          setEtapaBancoManual(0);
        }
      } catch (err) {
        console.error("Erro ao validar consentimento:", err);
      }
    }, intervaloMs);
  }

  async function enviarSimulacao(consentToken: string) {
    try {
      const resp = await fetch(`${API_BASE}/presenca/simular`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consentToken,
          cpf: cpfPres,
          salarioBruto: salarioBruto || 3000,
          tempoContrato: {
            anos: parseInt(anosContrato) || 0,
            meses: parseInt(mesesContrato) || 0,
          },
        }),
      });

      const data = await resp.json();
      if (!data.sucesso || !data.result) {
        alert("Erro ao simular.");
        setLoadingPres(false);
        return;
      }

      setMelhorSimulacaoPresenca(data.result);
      setEtapaBancoManual(4);
      await salvarProgressoBackend({
        melhorSimulacaoPresenca: data.result,
        etapaBancoManual: 4,
      });
    } catch (err) {
      console.error(err);
      alert("Erro ao simular.");
    } finally {
      setLoadingPres(false);
    }
  }

  const handleEnviarTermo = async (dados: any) => {
    setShowPopupPresencaCLT(null);
    autorizarConsulta(dados);
  };

  async function finalizarProposta() {
    if (!melhorSimulacaoPresenca) {
      alert("Nenhuma simulação disponível.");
      return;
    }

    setEnviandoProposta(true);

    try {
      const resp = await fetch(`${API_BASE}/presenca/criar-operacao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          simulacao: melhorSimulacaoPresenca,
          cpf: cpfPres,
          nome: nomePres,
          endereco: {
            cep: cep.replace(/\D/g, ""),
            rua,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
          },
          banco: { codigoBanco, agencia, conta, digitoConta, formaCredito },
        }),
      });

      const data = await resp.json();
      if (!data.sucesso) {
        alert("Erro ao criar operação!");
        setEnviandoProposta(false);
        return;
      }

      setEtapaBancoManual(5);
      await salvarProgressoBackend({
        etapaBancoManual: 5,
        operacaoCriada: data.result,
      });

      alert("Operação criada! Redirecionando para formalização...");

      const idOperacao = data.result?.id;
      if (idOperacao) {
        let linkForm = null;
        let tentativasFormalizacao = 0;
        const maxTentativasFormalizacao = 30;

        while (!linkForm && tentativasFormalizacao < maxTentativasFormalizacao) {
          linkForm = await buscarLinkFormalizacao(idOperacao, false);
          tentativasFormalizacao++;

          if (!linkForm) {
            await new Promise((resolve) => setTimeout(resolve, 5000));
          }
        }

        if (linkForm) {
          window.open(linkForm, "_blank");
          setStatusProposta("EM_ANALISE");
          await salvarProgressoBackend({ statusProposta: "EM_ANALISE" });
        } else {
          alert("Link de formalização não disponível. Tente reabrir a proposta mais tarde.");
        }
      }

      setShowPopupContratar(false);
      setStepContratar(1);
    } catch (err) {
      console.error(err);
      alert("Erro ao criar a operação.");
    } finally {
      setEnviandoProposta(false);
    }
  }

  // ------------------------------ C6 (CAR EQUITY) ------------------------------
  const enviarTermoC6 = async (dados: any) => {
    setLoadingC6(true);
    setBancoSelecionado("c6");
    setEtapaBancoManual(1);

    setNomePres(dados.nome);
    setCpfPres(dados.cpf);
    setTelefonePres(dados.telefone);
    setEmailPres(dados.email);
    setDataNascPres(formatarDataISO(dados.dataNascimento));

    await salvarProgressoBackend({
      bancoSelecionado: "c6",
      etapaBancoManual: 1,
    });

    try {
      const resp = await fetch(`${API_BASE}/c6/simular`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cpf: dados.cpf,
          nome: dados.nome,
          telefone: dados.telefone,
          email: dados.email,
          dataNascimento: formatarDataISO(dados.dataNascimento),
        }),
      });

      const data = await resp.json();
      if (!data.sucesso) {
        alert("Erro ao simular C6.");
        setLoadingC6(false);
        return;
      }

      setSimulacaoC6(data.result);
      setEtapaBancoManual(4);
      await salvarProgressoBackend({
        simulacaoC6: data.result,
        etapaBancoManual: 4,
      });
    } catch (err) {
      console.error(err);
      alert("Erro ao simular.");
    } finally {
      setLoadingC6(false);
    }
  };

  const autorizarConsultaC6 = async () => {
    setShowPopupC6(true);
  };

  // ------------------------------ FGTS ------------------------------
  const iniciarFluxoFGTS = async () => {
    setFgtsEtapa(1);
    setBancoSelecionado("presenca_fgts");
    setEtapaBancoManual(1);

    const userStr = localStorage.getItem("altiva_user");
    const userData = userStr ? JSON.parse(userStr) : null;

    if (userData?.email) {
      setEmailPres(userData.email);
    }

    await salvarProgressoBackend({ bancoSelecionado: "presenca_fgts", etapaBancoManual: 1 });
    setShowPopupPresencaCLT("presenca_fgts");
  };

  const handleEnviarTermoFGTS = async (dados: any) => {
    setShowPopupPresencaCLT(null);
    setFgtsEtapa(2);

    setNomePres(dados.nome);
    setCpfPres(dados.cpf);
    setTelefonePres(dados.telefone);
    setEmailPres(dados.email);
    setDataNascPres(formatarDataISO(dados.dataNascimento));

    await salvarProgressoBackend({ fgtsEtapa: 2 });

    try {
      const resp = await fetch(`${API_BASE}/fgts/autorizar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cpf: dados.cpf,
          nome: dados.nome,
          dataNascimento: formatarDataISO(dados.dataNascimento),
        }),
      });

      const data = await resp.json();
      if (!data.sucesso || !data.result?.link) {
        alert("Erro ao autorizar FGTS");
        setFgtsEtapa(0);
        return;
      }

      const linkFGTS = data.result.link;
      window.open(linkFGTS, "_blank", "noopener,noreferrer");

      setFgtsEtapa(3);
      await salvarProgressoBackend({ fgtsEtapa: 3 });
      aguardarConsentimentoFGTS(linkFGTS);
    } catch (err) {
      console.error(err);
      alert("Erro ao autorizar FGTS.");
      setFgtsEtapa(0);
    }
  };

  async function aguardarConsentimentoFGTS(linkAutorizacao: string) {
    const urlObj = new URL(linkAutorizacao);
    const consentToken = urlObj.searchParams.get("consent_token");

    if (!consentToken) {
      alert("Token de consentimento não identificado.");
      setFgtsEtapa(0);
      return;
    }

    let tentativas = 0;
    const maxTentativas = 60;
    const intervaloMs = 5000;

    const interval = setInterval(async () => {
      tentativas++;

      try {
        const resp = await fetch(
          `${API_BASE}/fgts/validar-consentimento?consentToken=${consentToken}`
        );
        const data = await resp.json();

        if (data.sucesso && data.consentido) {
          clearInterval(interval);
          enviarSimulacaoFGTS(consentToken);
        }

        if (tentativas >= maxTentativas) {
          clearInterval(interval);
          alert("Tempo esgotado. Por favor, tente novamente.");
          setFgtsEtapa(0);
        }
      } catch (err) {
        console.error("Erro ao validar consentimento FGTS:", err);
      }
    }, intervaloMs);
  }

  async function enviarSimulacaoFGTS(consentToken: string) {
    try {
      const resp = await fetch(`${API_BASE}/fgts/simular`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consentToken }),
      });

      const data = await resp.json();
      if (!data.sucesso || !data.result) {
        alert("Erro ao simular FGTS.");
        setFgtsEtapa(0);
        return;
      }

      setFgtsSimulacao(data.result);
      setFgtsSaldo(data.result?.saldo || null);
      setFgtsEtapa(4);

      await salvarProgressoBackend({
        fgtsSimulacao: data.result,
        fgtsEtapa: 4,
      });
    } catch (err) {
      console.error(err);
      alert("Erro ao simular FGTS.");
      setFgtsEtapa(0);
    }
  }

  const retryFGTS = () => {
    setFgtsEtapa(0);
    setBancoSelecionado(null);
    setEtapaBancoManual(0);
  };

  async function criarPropostaFGTS(simulacao: any, tabela: any) {
    if (!simulacao || !tabela) {
      alert("Simulação ou tabela inválida!");
      return null;
    }

    try {
      const resp = await fetch(`${API_BASE}/fgts/criar-proposta`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cpf: cpfPres,
          nome: nomePres,
          email: emailPres,
          telefone: telefonePres,
          dataNascimento: dataNascPres,
          tabela,
          motherName: dadosFGTS.motherName,
          documentIdentificationNumber: dadosFGTS.documentIdentificationNumber,
          maritalStatus: dadosFGTS.maritalStatus,
          endereco: {
            cep: cep.replace(/\D/g, ""),
            rua,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
          },
          pagamentoPix,
        }),
      });

      const data = await resp.json();
      if (!data.sucesso) {
        alert("Erro ao criar proposta FGTS!");
        return null;
      }

      const formalizationLink = data.result?.formalizationLink || null;
      if (formalizationLink) {
        window.open(formalizationLink, "_blank");
      }

      return data.result;
    } catch (err) {
      console.error(err);
      alert("Erro ao criar proposta FGTS.");
      return null;
    }
  }

  const selecionarTabelaFGTS = (tabela: any) => {
    setFgtsTabelaSelecionada(tabela);
    setShowPopupContratarFGTS(true);
  };

  // ------------------------------ NOVO SAQUE ------------------------------
  const enviarSimulacaoNovoSaque = async (dados: any) => {
    setLoadingNovoSaque(true);
    setBancoSelecionado("saque_cartao");

    setNomePres(dados.nome);
    setCpfPres(dados.cpf);
    setTelefonePres(dados.telefone);
    setEmailPres(dados.email);
    setDataNascPres(formatarDataISO(dados.dataNascimento));

    await salvarProgressoBackend({
      bancoSelecionado: "saque_cartao",
      etapaBancoManual: 1,
    });

    try {
      const resp = await fetch(`${API_BASE}/novosaque/simular`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cpf: dados.cpf,
        }),
      });

      const data = await resp.json();
      if (!data.sucesso || !data.result) {
        alert("Erro ao simular Novo Saque.");
        setLoadingNovoSaque(false);
        return;
      }

      setSimulacaoNovoSaque(data.result);
      setEtapaBancoManual(4);
      await salvarProgressoBackend({
        simulacaoNovoSaque: data.result,
        etapaBancoManual: 4,
      });

      setShowPopupNovoSaque(false);
      setShowPopupContratarNS(true);
    } catch (err) {
      console.error(err);
      alert("Erro ao simular.");
    } finally {
      setLoadingNovoSaque(false);
    }
  };

  // ------------------------------ DEFINIR OFERTAS ------------------------------
  const todasOfertas = [
    {
      id: "presenca_clt",
      config: CARD_CONFIG.presenca_clt,
      titulo: "Empréstimo Consignado Privado",
      subtitulo: "Desconto direto na folha de pagamento",
      logo: presencaLogo,
      manual: false,
      linkTermo: "https://www.presenca.com.br/termos",
      abrirPopup: () => setShowPopupPresencaCLT("presenca_clt"),
    },
    {
      id: "presenca_fgts",
      config: CARD_CONFIG.presenca_fgts,
      titulo: "Antecipação Saque-Aniversário FGTS",
      subtitulo: "Antecipe até 10 anos do seu FGTS",
      logo: fgtsIcon,
      manual: false,
      linkTermo: "https://www.presenca.com.br/termos",
      abrirPopup: () => setShowPopupFGTS(true),
    },
    {
      id: "c6",
      config: CARD_CONFIG.c6,
      titulo: "Empréstimo com Garantia de Veículo",
      subtitulo: "Use seu carro como garantia",
      logo: c6Logo,
      manual: false,
      linkTermo: "https://www.c6bank.com.br/termos",
      abrirPopup: () => setShowPopupC6(true),
    },
    {
      id: "saque_cartao",
      config: CARD_CONFIG.saque_cartao,
      titulo: "Saque com Limite do Cartão de Crédito",
      subtitulo: "Transforme seu limite em dinheiro",
      logo: novoSaqueLogo,
      manual: true,
      abrirPopup: () => setShowPopupNovoSaque(true),
      onSimularManualWhatsApp: () => {
        const numWhats = "5511977191411";
        const mensagem = encodeURIComponent(
          "Olá, gostaria de simular o Saque com Limite do Cartão de Crédito!"
        );
        window.open(`https://wa.me/${numWhats}?text=${mensagem}`, "_blank");
      },
    },
  ];

  // Filtrar apenas as ofertas ativas e ordenar por prioridade
  const ofertasAtivas = todasOfertas
    .filter((oferta) => oferta.config.enabled)
    .sort((a, b) => a.config.priority - b.config.priority);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    carousel.addEventListener("scroll", handleScroll);
    return () => carousel.removeEventListener("scroll", handleScroll);
  }, [ofertasAtivas.length]);

  // ------------------------------ RENDER ------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* HEADER */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Minhas Ofertas</h1>
              <p className="text-sm text-slate-600 mt-1">
                Escolha a melhor opção de crédito para você
              </p>
            </div>
            <img
              src={bannerPropostas}
              alt="Banner"
              className="h-12 w-auto hidden sm:block"
            />
          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {ofertasAtivas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">
              Nenhuma oferta disponível no momento.
            </p>
            <p className="text-slate-500 text-sm mt-2">
              Configure os cards em CARD_CONFIG para exibi-los.
            </p>
          </div>
        ) : (
          <>
            {/* CARROSSEL DE CARDS */}
            <div
              ref={carouselRef}
              className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-6 scrollbar-hide"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {ofertasAtivas.map((banco, idx) => (
                <div
                  key={banco.id}
                  className="min-w-[85%] md:min-w-[400px] snap-center"
                >
                  <div className="h-full">
                    {banco.id === "presenca_clt" && (
                      <CardOfertaPresenca
                        banco={{
                          id: banco.id,
                          nome: banco.titulo,
                          subtitulo: banco.subtitulo,
                          logo: banco.logo,
                        }}
                        isManualBank={banco.manual}
                        etapa={bancoSelecionado === banco.id ? etapaBancoManual : 0}
                        abrirPopupSimulacao={banco.abrirPopup}
                        linkTermo={banco.linkTermo}
                        onAutorizar={autorizarConsulta}
                      />
                    )}

                    {banco.id === "presenca_fgts" && (
                      <CardSimulacaoPresenca
                        banco={{
                          id: banco.id,
                          nome: banco.titulo,
                          subtitulo: banco.subtitulo,
                          logo: banco.logo,
                        }}
                        isManualBank={banco.manual}
                        etapa={bancoSelecionado === banco.id ? etapaBancoManual : 0}
                        abrirPopupSimulacao={banco.abrirPopup}
                        linkTermo={banco.linkTermo}
                        fgtsLoadingTrigger={fgtsEtapa === 3}
                        onRetryFGTS={retryFGTS}
                        simulacao={fgtsSimulacao}
                        saldo={fgtsSaldo}
                        onSelecionarTabela={selecionarTabelaFGTS}
                      />
                    )}

                    {banco.id === "c6" && (
                      <CardOfertaPresenca
                        banco={{
                          id: banco.id,
                          nome: banco.titulo,
                          subtitulo: banco.subtitulo,
                          logo: banco.logo,
                        }}
                        isManualBank={banco.manual}
                        etapa={bancoSelecionado === banco.id ? etapaBancoManual : 0}
                        abrirPopupSimulacao={banco.abrirPopup}
                        linkTermo={banco.linkTermo}
                        onAutorizar={autorizarConsultaC6}
                      />
                    )}

                    {banco.id === "saque_cartao" && (
                      <CardOfertaPresenca
                        banco={{
                          id: banco.id,
                          nome: banco.titulo,
                          subtitulo: banco.subtitulo,
                          logo: banco.logo,
                        }}
                        isManualBank={banco.manual}
                        etapa={bancoSelecionado === banco.id ? etapaBancoManual : 0}
                        abrirPopupSimulacao={banco.abrirPopup}
                        onSimularManualWhatsApp={banco.onSimularManualWhatsApp}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* INDICADORES DE PAGINAÇÃO */}
            <div className="flex justify-center items-center gap-2 mt-0 md:mt-4 mb-6">
              {ofertasAtivas.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToCard(idx)}
                  className={`transition-all duration-300 rounded-full h-2 ${
                    activeCardIndex === idx
                      ? "w-8 bg-[#0A2540] shadow-sm"
                      : "w-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Ir para oferta ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* --- MODAIS --- */}
      <PopupTermo
        show={
          !!showPopupPresencaCLT &&
          (showPopupPresencaCLT === "presenca_clt" ||
            showPopupPresencaCLT === "presenca_fgts")
        }
        onClose={() => setShowPopupPresencaCLT(null)}
        nomePres={nomePres}
        setNomePres={setNomePres}
        cpfPres={cpfPres}
        setCpfPres={setCpfPres}
        telefonePres={telefonePres}
        setTelefonePres={setTelefonePres}
        emailPres={emailPres}
        setEmailPres={setEmailPres}
        dataNascPres={dataNascPres}
        setDataNascPres={setDataNascPres}
        anosContrato={anosContrato}
        setAnosContrato={setAnosContrato}
        mesesContrato={mesesContrato}
        setMesesContrato={setMesesContrato}
        tamanhoEmpresa={tamanhoEmpresa}
        setTamanhoEmpresa={setTamanhoEmpresa}
        salarioBruto={salarioBruto}
        setSalarioBruto={setSalarioBruto}
        enviar={(dados) =>
          showPopupPresencaCLT === "presenca_fgts"
            ? handleEnviarTermoFGTS(dados)
            : handleEnviarTermo(dados)
        }
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

            const dadosCompletos = {
              tipo: "saque_cartao_credito",
              data_solicitacao: new Date().toISOString(),
              simulacao: simulacaoNovoSaque,
              contratacao: payload.customer,
              cliente: {
                nome: nomePres,
                cpf: cpfPres,
                email: emailPres,
                telefone: telefonePres,
              },
            };

            await salvarProgressoBackend({
              bancoSelecionado: "saque_cartao",
              etapaContratacao: 4,
              dadosContratacaoNovoSaque: dadosCompletos,
            });

            const numWhats = "5511977191411";
            const mensagem = encodeURIComponent(
              "Olá, gostaria de contratar minha proposta de Saque com Limite do Cartão de Crédito!"
            );

            window.open(`https://wa.me/${numWhats}?text=${mensagem}`, "_blank");
            setShowPopupContratarNS(false);
          } catch (err) {
            console.error("❌ Erro ao salvar dados do Novo Saque:", err);
            alert("Ocorreu um erro ao salvar sua solicitação. Por favor, tente novamente.");
          } finally {
            setEnviandoProposta(false);
          }
        }}
      />

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
          setEstado,
        }}
        bancario={{ codigoBanco, agencia, conta, digitoConta, formaCredito }}
        setBancario={{
          setCodigoBanco,
          setAgencia,
          setConta,
          setDigitoConta,
          setFormaCredito,
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
        dadosFGTS={dadosFGTS}
        setDadosFGTS={setDadosFGTS}
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
        pagamentoPix={pagamentoPix}
        setPagamentoPix={setPagamentoPix}
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
        nomePres={nomePres}
        setNomePres={setNomePres}
        cpfPres={cpfPres}
        setCpfPres={setCpfPres}
        telefonePres={telefonePres}
        setTelefonePres={setTelefonePres}
        emailPres={emailPres}
        setEmailPres={setEmailPres}
        dataNascPres={dataNascPres}
        setDataNascPres={setDataNascPres}
        enviar={enviarSimulacaoNovoSaque}
        loading={loadingNovoSaque}
      />
    </div>
  );
}