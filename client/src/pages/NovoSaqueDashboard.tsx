// src/pages/NovoSaqueDashboard.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

// COMPONENTS
import CardOfertaPresenca from "../components/Cards/CardOfertaPresenca";
import CardSimulacaoPresenca from "../components/Cards/CardSimulacaoPresenca";
import Popup_NovoSaque_Simular from "../components/Presenca/Popup_NovoSaque_Simular";
import Popup_Contratar_NS from "../components/Presenca/Popup_Contratar_NS";

// ASSETS
import novoSaqueLogo from "../assets/novo.png";

export default function NovoSaqueDashboard() {
  const { user } = useAuth();

  // -------------------------------- STATES --------------------------------
  const [showPopupSimular, setShowPopupSimular] = useState(false);
  const [showPopupContratar, setShowPopupContratar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [enviandoProposta, setEnviandoProposta] = useState(false);
  const [simulacaoNovoSaque, setSimulacaoNovoSaque] = useState<any | null>(null);

  // DADOS DO CLIENTE
  const [nomePres, setNomePres] = useState(user?.nome ?? "");
  const [cpfPres, setCpfPres] = useState(user?.cpf ?? "");
  const [telefonePres, setTelefonePres] = useState("");
  const [emailPres, setEmailPres] = useState(user?.email ?? "");
  const [dataNascPres, setDataNascPres] = useState("");

  // BASE API (Sincronizada com UserDashboard)
  const API_BASE = ["localhost", "127.0.0.1"].includes(window.location.hostname)
    ? "http://localhost:5000"
    : process.env.REACT_APP_API_URL || "https://v8-backend-j09p.onrender.com";

  // ------------------------------ SALVAR PROGRESSO ------------------------------
  const salvarProgressoBackend = async (extra: any = {}) => {
    try {
      const emailAtivo = emailPres || user?.email;
      if (!emailAtivo) return;

      const etapa = extra.etapaContratacao ?? 0;

      await fetch(`${API_BASE}/progresso/salvar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailAtivo,
          cpf: cpfPres.replace(/\D/g, ""),
          nome: nomePres,
          telefone: telefonePres.replace(/\D/g, ""),
          etapa,
          dados: {
            cpf: cpfPres,
            nome: nomePres,
            telefone: telefonePres,
            email: emailAtivo,
            dataNascPres,
            bancoSelecionado: "saque_cartao",
            simulacaoNovoSaque,
            etapaContratacao: etapa,
            ...extra,
          },
        }),
      });
    } catch (err) {
      console.error("Erro ao salvar progresso:", err);
    }
  };

  // ------------------- LOAD PROGRESS -------------------
  useEffect(() => {
    const carregarProgresso = async () => {
      const emailBusca = user?.email || emailPres;
      if (!emailBusca) return;

      try {
        const resp = await fetch(`${API_BASE}/progresso/${emailBusca}`);
        const data = await resp.json();
        if (data.existe && data.dados) {
          const d = data.dados;
          if (d.simulacaoNovoSaque) setSimulacaoNovoSaque(d.simulacaoNovoSaque);
          if (d.nome) setNomePres(d.nome);
          if (d.cpf) setCpfPres(d.cpf);
          if (d.telefone) setTelefonePres(d.telefone);
          if (d.dataNascPres) setDataNascPres(d.dataNascPres);
        }
      } catch {}
    };
    carregarProgresso();
  }, [user, API_BASE]);

  // ------------------------------ SIMULAR NOVO SAQUE ------------------------------
  const enviarSimulacaoNovoSaque = async (dados: any) => {
  setLoading(true);
  try {
    // 1. Sincroniza estados locais para uso posterior na interface
    setNomePres(dados.nome);
    setCpfPres(dados.cpf);
    setTelefonePres(dados.telefone);
    setEmailPres(dados.email || "");
    setDataNascPres(dados.dataNascimento || "");

    // 2. Prepara os dados limpos para a API (Igual ao UserDashboard)
    const payload = {
      email: dados.email || user?.email || "", // Garante que não vá null
      cpf: dados.cpf.replace(/\D/g, ""),       // Limpa pontuação
      nome: dados.nome,
      telefone: dados.telefone.replace(/\D/g, ""), // Limpa pontuação
      value: Number(dados.value),              // Garante que é número
      installments: Number(dados.installments), // Garante que é número
      dataNascimento: dados.dataNascimento     // Adicionado conforme snippet do UserDashboard
    };

    const resp = await fetch(`${API_BASE}/saque/simular`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await resp.json();

    // 3. Validação rigorosa da resposta
    if (data.sucesso && data.simulacao) {
      setSimulacaoNovoSaque(data.simulacao);
      setShowPopupSimular(false);
      
      // Salva progresso usando os dados da resposta
      salvarProgressoBackend({
        etapaContratacao: 2,
        simulacaoNovoSaque: data.simulacao
      });
    } else {
      // Exibe a mensagem de erro vinda do backend se existir
      throw new Error(data.mensagem || "Simulação recusada pelo servidor.");
    }
  } catch (e: any) {
    console.error("Erro detalhado ao simular Novo Saque:", e);
    alert(e.message || "Erro na simulação. Verifique os dados e tente novamente.");
  } finally {
    setLoading(false);
  }
};

  // ------------------------------ FINALIZAR CONTRATAÇÃO ------------------------------
  const handleFinalizarContratacao = async (payload: any) => {
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
          telefone: telefonePres
        }
      };

      await salvarProgressoBackend({
        etapaContratacao: 4, 
        dadosContratacaoNovoSaque: dadosCompletos
      });

      const numWhats = "5511977191411";
      const mensagem = encodeURIComponent(
        `Olá! Acabei de simular um Novo Saque no valor de R$ ${simulacaoNovoSaque.valorLiberado}. Gostaria de prosseguir com a contratação!`
      );

      window.open(`https://wa.me/${numWhats}?text=${mensagem}`, "_blank");
      setShowPopupContratar(false);

    } catch (err) {
      console.error("Erro ao finalizar proposta:", err);
      alert("Ocorreu um erro ao processar sua solicitação.");
    } finally {
      setEnviandoProposta(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center">
      <div className="max-w-2xl w-full text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Novo Saque
        </h1>
        <p className="text-slate-600 mt-3 text-lg">
          Transforme o limite do seu cartão em dinheiro na conta, rápido e sem burocracia.
        </p>
      </div>

      <div className="w-full max-w-md transition-all duration-500">
        {simulacaoNovoSaque ? (
          <CardSimulacaoPresenca
            banco={{
              id: "saque_cartao",
              nome: "Novo Saque",
              tipo: "Saque com Cartão de Crédito",
              logo: novoSaqueLogo,
            }}
            simulacao={{
              valorLiberado: simulacaoNovoSaque.valorLiberado,
              valorParcela: simulacaoNovoSaque.valorParcela,
              prazo: simulacaoNovoSaque.parcelas,
              taxaJuros: simulacaoNovoSaque.taxaJurosMensal,
            }}
            linkFormalizacao={null}
            abrirContratacao={() => setShowPopupContratar(true)}
            autorizarConsulta={() => {}}
            criandoOperacao={false}
            gerandoContrato={false}
          />
        ) : (
          <CardOfertaPresenca
            banco={{
              id: "saque_cartao",
              nome: "Novo Saque",
              tipo: "Crédito via Cartão",
              logo: novoSaqueLogo,
            }}
            isManualBank={false}
            etapa={0}
            abrirPopupSimulacao={() => setShowPopupSimular(true)}
          />
        )}
      </div>

      <Popup_NovoSaque_Simular
        show={showPopupSimular}
        onClose={() => setShowPopupSimular(false)}
        nomePres={nomePres} setNomePres={setNomePres}
        cpfPres={cpfPres} setCpfPres={setCpfPres}
        telefonePres={telefonePres} setTelefonePres={setTelefonePres}
        emailPres={emailPres} setEmailPres={setEmailPres}
        dataNascPres={dataNascPres} setDataNascPres={setDataNascPres}
        enviar={enviarSimulacaoNovoSaque}
        loading={loading}
      />

      <Popup_Contratar_NS
        show={showPopupContratar}
        onClose={() => setShowPopupContratar(false)}
        loading={enviandoProposta}
        nome={nomePres}
        cpf={cpfPres}
        email={emailPres}
        telefone={telefonePres}
        dataNascimento={dataNascPres}
        onSubmit={handleFinalizarContratacao}
      />

      <div className="mt-12 text-slate-400 text-sm flex items-center gap-2">
         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-6a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
         Ambiente Seguro e Criptografado
      </div>
    </div>
  );
}