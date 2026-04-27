import React, { useEffect, useState } from "react";
import CardBase from "./CardBase";
import Info from "../Info";
import { ChevronRight, User, FileSignature, Banknote } from "lucide-react";

type StatusProposta = "DISPONIVEL" | "EM_ANALISE";

type CardSimulacaoProps = {
  banco: {
    id: string;
    nome: string;
    tipo: string;
    logo: string;
  };
  simulacao: any;
  linkFormalizacao: string | null;
  abrirContratacao: () => void;
  autorizarConsulta: () => void;
  gerandoContrato: boolean;
  criandoOperacao: boolean;
statusProposta?: StatusProposta;

};

export default function CardSimulacaoPresenca({
  banco,
  simulacao,
  linkFormalizacao,
  abrirContratacao,
  autorizarConsulta,
  gerandoContrato,
  criandoOperacao,
  statusProposta, // 👈 ADICIONE AQUI
}: CardSimulacaoProps)
 {

  // ------------------------------
  // 🔵 NORMALIZAÇÃO DE CAMPOS
  // ------------------------------
  const valorLiberado = Number(simulacao.valorLiberado);
  const valorParcela = Number(simulacao.valorParcela);

  const prazo = Number(
    simulacao.prazo ?? simulacao.parcelas ?? 0
  );

  const taxa =
    simulacao.taxaJuros ??
    simulacao.taxaJurosMensal ??
    "—";

  const propostaInvalida = simulacao.propostaInvalida;
  const podeAssinar = !!linkFormalizacao;

  // ------------------------------
  // 🔵 PROGRESSO DINÂMICO
  // ------------------------------
  const [progress, setProgress] = useState(0);
  

  useEffect(() => {
    const ativo = criandoOperacao || gerandoContrato;

    if (!ativo || propostaInvalida) {
      setProgress(0);
      return;
    }

    const updateEvery = 200; // ms
    const totalDuration = 15000; // 15s
    const increment = (updateEvery / totalDuration) * 100;

    const interval = setInterval(() => {
      setProgress((p) => (p + increment >= 100 ? 100 : p + increment));
    }, updateEvery);

    return () => clearInterval(interval);
  }, [criandoOperacao, gerandoContrato, propostaInvalida]);

  // ------------------------------
  // 🔵 STATUS DAS ETAPAS
  // ------------------------------
  const etapa1Status = podeAssinar
    ? "verde"
    : gerandoContrato || criandoOperacao
    ? "cinza"
    : "azul";

  const etapa2Status = podeAssinar
    ? "azul"
    : gerandoContrato || criandoOperacao
    ? "azul"
    : "cinza";

  const corEtapa = {
    azul: "bg-[#2563EB] text-white",
    cinza: "bg-gray-300 text-gray-700",
    verde: "bg-green-500 text-white",
  };

  const fundoEtapa2 =
    podeAssinar || gerandoContrato || criandoOperacao
      ? "bg-green-50 border-green-300"
      : "bg-gray-50 border-gray-200";

  // ------------------------------
  // 🔵 BOTÃO PRINCIPAL
  // ------------------------------
  let botaoPrincipal;
const status = statusProposta ?? "DISPONIVEL";
const emAnalise = status === "EM_ANALISE";

// 🟡 EM ANÁLISE
if (emAnalise) {
  botaoPrincipal = (
    <button
      onClick={() => {
        const numero = "5511977191411";
        const mensagem = encodeURIComponent(
          "Olá, gostaria de contratar meu Crédito do Trabalhador"
        );

        window.open(`https://wa.me/${numero}?text=${mensagem}`, "_blank");
      }}
      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl font-semibold shadow mt-6 transition-colors"
    >
      EM ANÁLISE
    </button>
  );
}


 // ❌ PROPOSTA INVÁLIDA
else if (propostaInvalida) {
  botaoPrincipal = (
    <button
      onClick={() => {
        const numero = "5511977191411";
        const mensagem = encodeURIComponent(
          "Olá, gostaria de acompanhar minha proposta de Crédito do Trabalhador"
        );
        window.open(`https://wa.me/${numero}?text=${mensagem}`, "_blank");
      }}
      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl font-semibold shadow mt-6 transition-colors"
    >
      EM ANÁLISE
    </button>
  );
}





// ⏳ GERANDO CONTRATO
else if ((criandoOperacao || gerandoContrato) && !podeAssinar) {
  botaoPrincipal = (
    <div className="w-full mt-6">
      <div className="relative w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold shadow overflow-hidden flex items-center justify-center">
        <span className="relative z-10 font-semibold">
          Gerando contrato...
        </span>

        <div
          className="absolute left-0 top-0 h-full bg-[#2563EB] opacity-40 transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// 🟦 CONTRATAR
else if (!podeAssinar) {
  botaoPrincipal = (
    <button
      onClick={abrirContratacao}
      className="w-full bg-[#2563EB] hover:bg-[#1E4FCF] text-white py-3 rounded-xl font-semibold shadow mt-6"
    >
      CONTRATAR CRÉDITO
    </button>
  );
}

// 🟢 ASSINAR
else {
  botaoPrincipal = (
    <button
      onClick={() => window.open(linkFormalizacao!, "_blank")}
      className="w-full bg-[#16A34A] hover:bg-[#0f8b36] text-white py-3 rounded-xl font-semibold shadow mt-6 flex items-center justify-center gap-2"
    >
      ASSINAR CONTRATO
      <ChevronRight className="w-5 h-5" />
    </button>
  );
}

  // ------------------------------
  // 🔵 RENDER
  // ------------------------------
  return (
    <div className="w-full max-w-[420px] mx-auto overflow-visible">
      <div
        className="rounded-2xl"
        style={{
          boxShadow:
            "0 6px 16px rgba(0,0,0,0.08), 0 12px 32px rgba(0,0,0,0.10), 0 24px 48px rgba(0,0,0,0.06)",
          borderRadius: "20px",
        }}
      >
        <CardBase
          logo={banco.logo}
          title={banco.nome}
          subtitle={banco.tipo}
          badge={null}
        >
          <div className="bg-[#16A34A] text-white text-center py-2 font-semibold rounded-lg mb-5 text-sm shadow-sm">
            CONDIÇÕES PRÉ-SIMULADAS
          </div>

          <div className="text-center mb-5">
            <span className="text-gray-600 text-sm">Valor Liberado Estimado</span>
            <h2 className="text-4xl font-extrabold text-[#2563EB] mt-1">
              R$ {valorLiberado.toLocaleString("pt-BR")}
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <Info label="Parcela" value={`R$ ${valorParcela}`} />
            <Info label="Prazo" value={`${prazo}x`} />
            <Info label="Juros" value={`${taxa}%`} />
          </div>

          <h3 className="text-sm font-bold text-[#111827] mb-3">
            PREENCHIMENTO DE DADOS
          </h3>

          <div className="flex items-center justify-between px-3 mb-5">
            <div className="flex flex-col items-center text-gray-600">
              <User className="w-5 h-5" />
              <span className="text-xs mt-1">Pessoais</span>
            </div>

            <div className="w-8 h-[2px] bg-gray-300"></div>

            <div className="flex flex-col items-center text-gray-600">
              <Banknote className="w-5 h-5" />
              <span className="text-xs mt-1">Bancários</span>
            </div>

            <div className="w-8 h-[2px] bg-gray-300"></div>

            <div className="flex flex-col items-center text-gray-600">
              <FileSignature className="w-5 h-5" />
              <span className="text-xs mt-1">Contrato</span>
            </div>
          </div>

          <div className="border border-gray-200 bg-gray-50 rounded-xl p-4 mb-3 shadow-sm flex gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${corEtapa[etapa1Status]}`}>
              1
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#0A2540]">
                Finalizar preenchimento de dados
              </h4>
              <p className="text-xs text-gray-600 mt-1">
                Finalize a digitação de dados para geração do contrato de formalização.
              </p>
            </div>
          </div>

          <div className={`border rounded-xl p-4 shadow-sm flex gap-3 ${fundoEtapa2}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${corEtapa[etapa2Status]}`}>
              2
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#0A2540]">
                Assinar contrato e receber a transferência
              </h4>
              <p className="text-xs text-gray-600 mt-1">
                Assine o contrato digital para que o dinheiro caia na sua conta.
              </p>
            </div>
          </div>

          {botaoPrincipal}
        </CardBase>
      </div>
    </div>
  );
}
