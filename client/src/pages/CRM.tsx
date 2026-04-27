// ===============================
// PART 1: SETUP & LOGIC
// ===============================
import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import logo from "../assets/Logotipo.png";

import { motion, AnimatePresence } from "framer-motion";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  Kanban as KanbanIcon,
  List as ListIcon,
  Search,
  Phone,
  Mail,
  Calendar,
  XCircle,
  DollarSign,
  User,
  Settings,
  LogOut,
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  Send,
  Copy,
  IdCard,
  MessageCircle,
  Filter,
  Briefcase,
  Users,
  MapPin,
  Car,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";

// ===============================
// TYPES
// ===============================
type PipelineStage =
  | "NOVO"
  | "EM_CONTATO"
  | "SIMULADO"
  | "NE_MARGEM"
  | "NE_TEMPO_CONTRATO"
  | "PROPOSTA_GERADA"
  | "FORMALIZACAO"
  | "PROPOSTA_RECUSADA"
  | "PROPOSTA_ACEITA";

type Priority = "LOW" | "MEDIUM" | "HIGH";

type ActivityLog = {
  id: string;
  type: "STATUS_CHANGE" | "NOTE";
  content: string;
  timestamp: string;
};

type CRMStatus = {
  status: PipelineStage;
  statusAtendimento: "Não atendido" | "Atendido";
  comentario: string;
  badges?: LeadBadgeKey[];
  dataSimulacao?: string;
  updatedAt?: string;
  probability?: number;
};

type LeadData = {
  // =====================
  // DADOS BÁSICOS DO LEAD
  // =====================
  nome?: string;
  telefone?: string;
  email?: string;
  cpf?: string;
  tempo_servico_clt?: number;        // em meses (ou anos, conforme backend)
  margem_consignavel?: number;       // valor em R$
  dataNascPres?: string;
  dataNasc?: string;

  empresa?: string;
  cargo?: string;

  bancoSelecionado?: string; // ex: "saque_cartao"
  produto?: string;

  valorEstimado?: number;
  valorCarro?: string;

  prioridade?: Priority;

  anosContrato?: number;
  mesesContrato?: number;
  tamanhoEmpresa?: string;

  placa?: string;
  uf?: string;
  ano?: string;
  tipoVeiculo?: string;

  // =====================
  // CRM
  // =====================
  crm?: CRMStatus;

  // =====================
  // NOVO SAQUE (SAQUE CARTÃO)
  // =====================
  novoSaque?: {
    cpf?: string;
    nome?: string;
    telefone?: string;
    email?: string;

    nomeMae?: string;
    rg?: string;
    dataNascimento?: string;

    endereco?: {
      cep?: string;
      rua?: string;
      bairro?: string;
      numero?: string;
    };

    bancoCartao?: string;
    invoiceDueDay?: number;
	parcelas?: number;
valorParcela?: number;
valorSimulado?: number;
taxaJurosMensal?: number;

  };
};


type Lead = {
  id: string;
  email: string;
  cpf: string;
  updated_at: string;
  dados: LeadData;
  activities?: ActivityLog[];
};

type LeadBadgeKey =
  | "EM_CONTATO"
  | "NEGATIVADO"
  | "SEM_MARGEM"
  | "CONTRATO_RECENTE"
  | "PROPOSTA_RECUSADA"
  | "CNPJ_NEGATIVADO"
  | "SIMULADO"
  | "CONTRATO EXISTENTE"
  | "RECUSADO_POLITICA"
  | "NÃO ELEGÍVEL"
  | "CONVERTIDO";

type LeadBadge = {
  key: LeadBadgeKey;
  label: string;
  className: string;
};

// ===============================
// CONSTANTS (STYLED FOR PREMIUM LOOK)
// ===============================
const API_URL = "https://altivacred-server.onrender.com";

const STAGES = [
  {
    id: "NOVO",
    label: "Novo Lead",
    color: "bg-blue-500",
    gradient: "from-blue-500/20 to-blue-600/5",
    isFinal: false,
  },
  {
    id: "EM_CONTATO",
    label: "Em Tratativa",
    color: "bg-amber-500",
    gradient: "from-amber-500/20 to-amber-600/5",
    isFinal: false,
  },
  {
    id: "FINALIZADO",
    label: "Finalizado",
    color: "bg-emerald-500",
    gradient: "from-emerald-500/20 to-emerald-600/5",
    isFinal: true,
  },
] as const;

// Helper for glass badges
const glassBadge = (bgClass: string, textClass: string) =>
  `
    ${bgClass}
    ${textClass}
    
    /* Efeito de Vidro e Borda */
    backdrop-blur-md
    border border-white/10
    shadow-[0_2px_10px_-4px_rgba(0,0,0,0.5)]
    
    /* Forma e Espaçamento */
    rounded-full
    px-3 
    py-1
    
    /* Tipografia */
    text-[13px]
    font-bold
    uppercase
    tracking-wider
    
    /* Alinhamento */
    inline-flex
    items-center
    justify-center
    transition-all
    duration-300
    hover:scale-105
  `;



const PRODUCT_TAGS: Record<string, { label: string; className: string }> = {
  car_equity: {
    label: "Car Equity",
    className: glassBadge("bg-emerald-500 border-emerald-400", "text-emerald-300"),
  },
  saque_cartao: {
    label: "Novo Saque",
    className: glassBadge("bg-blue-500 border-blue-400", "text-blue-300"),
  },
  presenca_clt: {
    label: "CLT",
    className: glassBadge("bg-amber-500 border-amber-400", "text-amber-300"),
  },
  c6: {
    label: "C6 Bank",
    className: glassBadge("bg-gray-100 border-gray-400", "text-gray-300"),
  },
  presenca_fgts: {
    label: "FGTS",
    className: glassBadge("bg-purple-500 border-purple-400", "text-purple-300"),
  },
};

const MANUAL_BADGES: Record<LeadBadgeKey, LeadBadge> = {
  EM_CONTATO: {
    key: "EM_CONTATO",
    label: "EM CONTATO",
    className: glassBadge("bg-blue-500 border-blue-500", "text-blue-200"),
  },
  SIMULADO: {
    key: "SIMULADO",
    label: "SIMULADO",
    className: glassBadge("bg-indigo-500 border-indigo-500", "text-indigo-200"),
  },
  CONVERTIDO: {
    key: "CONVERTIDO",
    label: "CONVERTIDO",
    className: glassBadge("bg-emerald-500 border-emerald-500", "text-emerald-200"),
  },
  PROPOSTA_RECUSADA: {
    key: "PROPOSTA_RECUSADA",
    label: "RECUSADA",
    className: glassBadge("bg-zinc-500 border-zinc-500", "text-zinc-300"),
  },
  SEM_MARGEM: {
    key: "SEM_MARGEM",
    label: "SEM MARGEM",
    className: glassBadge("bg-orange-500 border-orange-500", "text-orange-200"),
  },
  CONTRATO_RECENTE: {
    key: "CONTRATO_RECENTE",
    label: "RECENTE < 6M",
    className: glassBadge("bg-amber-500 border-amber-500", "text-amber-200"),
  },
  NEGATIVADO: {
    key: "NEGATIVADO",
    label: "CPF NEGATIVADO",
    className: glassBadge("bg-red-500 border-red-500", "text-red-200"),
  },
  RECUSADO_POLITICA: {
    key: "RECUSADO_POLITICA",
    label: "POLÍTICA",
    className: glassBadge("bg-red-600 border-red-600", "text-red-100"),
  },
  CNPJ_NEGATIVADO: {
    key: "CNPJ_NEGATIVADO",
    label: "CNPJ NEGATIVADO",
    className: glassBadge("bg-rose-500 border-rose-500", "text-rose-200"),
  },
  "NÃO ELEGÍVEL": {
    key: "NÃO ELEGÍVEL",
    label: "NÃO ELEGÍVEL",
    className: glassBadge("bg-slate-500 border-slate-500", "text-slate-300"),
  },
  "CONTRATO EXISTENTE": {
    key: "CONTRATO EXISTENTE",
    label: "JÁ POSSUI",
    className: glassBadge("bg-cyan-500 border-cyan-500", "text-cyan-200"),
  },
};

// ===============================
// HELPERS
// ===============================
const format = {
  date: (d?: string, opt?: Intl.DateTimeFormatOptions) =>
    d ? new Date(d).toLocaleDateString("pt-BR", opt) : "-",
  time: (d?: string) =>
    d
      ? new Date(d).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      : "",
  currency: (v?: number) =>
    `R$ ${(v ?? 0).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`,
  tempoEmpresa: (a = 0, m = 0) =>
    a || m
      ? `${a ? `${a} ano(s)` : ""}${a && m ? " e " : ""}${m ? `${m} mês(es)` : ""}`
      : "Não informado",
};

const getLeadBadges = (lead: Lead): LeadBadge[] =>
  lead.dados.crm?.badges?.map((b) => MANUAL_BADGES[b]).filter(Boolean) ?? [];

const copyToClipboard = (v: string) => {
  if (v) {
    navigator.clipboard.writeText(v);
    // Optional: Add toast notification logic here
  }
};

const openWhatsApp = (tel?: string) => {
  if (!tel) return;
  const n = tel.replace(/\D/g, "");
  window.open(
    `https://wa.me/55${n}?text=${encodeURIComponent(
      "Olá, sou Elisa, assistente da Nitz Digital. Vou te ajudar com sua simulação de crédito."
    )}`,
    "_blank"
  );
};

// ===============================
// SHARED COMPONENT
// ===============================
const InfoRow = ({
  icon: Icon,
  value,
  label,
  onAction,
}: {
  icon: any;
  value: string;
  label?: string;
  onAction?: () => void;
}) => {
  const canCopy = Boolean(value && value !== "N/A");

  const handleCopy = () => {
    if (canCopy) {
      navigator.clipboard.writeText(value);
    }
  };

  return (
    <div className="group flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
      <div className="flex items-center gap-4 overflow-hidden">
        <div className="p-2 rounded-md bg-[#111827] border border-white/10 text-slate-400 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-colors">
          <Icon className="w-4 h-4" />
        </div>

        <div className="flex flex-col min-w-0">
          {label && (
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              {label}
            </span>
          )}
          <span className="text-sm text-slate-200 truncate font-medium">
            {value}
          </span>
        </div>
      </div>

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Copy */}
        <button
          onClick={handleCopy}
          disabled={!canCopy}
          className={`p-2 rounded-md transition-colors ${
            canCopy
              ? "hover:bg-white/10 text-slate-400 hover:text-white"
              : "text-slate-600 cursor-not-allowed"
          }`}
          title={canCopy ? "Copiar" : "Nada para copiar"}
        >
          <Copy className="w-4 h-4" />
        </button>

        {/* Action (opcional, ex: WhatsApp) */}
        {onAction && (
          <button
            onClick={onAction}
            className="p-2 hover:bg-emerald-500/20 rounded-md transition-colors"
            title="Ação"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
          </button>
        )}
      </div>
    </div>
  );
};

// ===============================
// HOOK (LOGIC UNTOUCHED)
// ===============================
export const useCRM = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"PIPELINE" | "LIST">("PIPELINE");
  const token = localStorage.getItem("nitz_admin_token") || "";
  

  const fetchLeads = useCallback(async () => {
    if (!token) return setLoading(false);
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/admin/crm/leads`, {
        headers: { Authorization: token },
      });

      setLeads(
        (data.leads || []).map((l: any, i: number) => ({
          ...l,
          id: l.email || `lead-${i}`,
          activities: [],
          dados: {
            ...l.dados,
			  tempo_servico_clt: l.dados?.tempo_servico_clt ?? null,
			  margem_consignavel: l.dados?.margem_consignavel ?? null,
            prioridade: l.dados.prioridade || "MEDIUM",
            valorEstimado: typeof l.dados.valor === "number" ? l.dados.valor : undefined,
            valorCarro: typeof l.dados.valor === "string" ? l.dados.valor : undefined,
            crm: {
              ...l.dados.crm,
              status: l.dados.crm?.status || "NOVO",
              probability:
                l.dados.crm?.probability ??
                (l.dados.crm?.status === "PROPOSTA_ACEITA"
                  ? 100
                  : l.dados.crm?.status === "PROPOSTA_RECUSADA"
                  ? 0
                  : 20),
            },
          },
        }))
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const updateLead = useCallback(
    async (lead: Lead, updates: Partial<CRMStatus>, msg?: string) => {
      const newStatus = updates.status || lead.dados.crm?.status;
      const isAttended = ["PROPOSTA_ACEITA", "PROPOSTA_RECUSADA"].includes(newStatus!);

      setLeads((prev) =>
        prev.map((l) =>
          l.id === lead.id
            ? {
                ...l,
                updated_at: new Date().toISOString(),
                activities: msg
                  ? [
                      {
                        id: Date.now().toString(),
                        type: "STATUS_CHANGE",
                        content: msg,
                        timestamp: new Date().toISOString(),
                      },
                      ...(l.activities || []),
                    ]
                  : l.activities,
                dados: {
                  ...l.dados,
                  crm: {
                    ...l.dados.crm!,
                    ...updates,
                    statusAtendimento: isAttended ? "Atendido" : "Não atendido",
                  },
                },
              }
            : l
        )
      );

      await axios.put(
        `${API_URL}/admin/crm/lead`,
        {
          email: lead.email,
          status: updates.status ?? lead.dados.crm?.status,
          probability: updates.probability ?? lead.dados.crm?.probability,
          comentario: updates.comentario ?? lead.dados.crm?.comentario,
          badges: updates.badges ?? lead.dados.crm?.badges ?? [],
        },
        { headers: { Authorization: token } }
      );
    },
    [token]
  );

  const onDragEnd = (r: DropResult) => {
    if (!r.destination) return;
    const lead = leads.find((l) => l.id === r.draggableId);
    if (lead && lead.dados.crm?.status !== r.destination.droppableId) {
      const label = STAGES.find((s) => s.id === r.destination!.droppableId)?.label;
      updateLead(
        lead,
        { status: r.destination.droppableId as PipelineStage },
        `Moveu para ${label}`
      );
    }
  };

  return { leads, loading, activeTab, setActiveTab, updateLead, onDragEnd };
};
// ===============================
// PART 2: UI COMPONENTS (SIDEBAR & PIPELINE)
// ===============================

const Sidebar = ({ activeTab, setActiveTab }: any) => (
  <aside className="w-20 lg:w-64 bg-[#020617] border-r border-white/5 flex flex-col justify-between h-screen fixed z-20 shadow-2xl shadow-black">
    <div>
      {/* LOGO / HEADER */}
      <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-white/5">
        {/* Logo compacto (mobile / sidebar fechada) */}
        <img
          src={logo}
          alt="Nitz"
          className="w-10 h-10 object-contain lg:hidden drop-shadow-lg"
        />

        {/* Logo completo (desktop / sidebar aberta) */}
        <div className="hidden lg:flex items-center gap-3">
          <img
            src={logo}
            alt="Nitz"
            className="w-32 object-contain drop-shadow-lg"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] text-slate-500 font-semibold tracking-widest uppercase">
              CRM
            </span>
            <span className="text-[10px] text-slate-600 tracking-wide">
              Admin Console
            </span>
          </div>
        </div>
      </div>

      {/* NAV */}
      <nav className="mt-8 px-3 space-y-1">
        {[
          { id: "PIPELINE", icon: KanbanIcon, label: "Pipeline" },
          { id: "LIST", icon: ListIcon, label: "Todos os Leads" },
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden ${
              activeTab === id
                ? "bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)] border border-emerald-500/20"
                : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
            }`}
          >
            {activeTab === id && (
              <div className="absolute inset-y-0 left-0 w-1 bg-emerald-500 rounded-r-full" />
            )}

            <Icon
              className={`w-5 h-5 transition-transform ${
                activeTab === id ? "scale-110" : "group-hover:scale-110"
              }`}
            />

            <span className="hidden lg:block text-sm font-medium tracking-wide">
              {label}
            </span>
          </button>
        ))}
      </nav>
    </div>

    {/* LOGOUT */}
    <button className="m-4 flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 border border-transparent hover:border-red-500/20">
      <LogOut className="w-5 h-5" />
      <span className="hidden lg:block text-sm font-medium">
        Sair da Conta
      </span>
    </button>
  </aside>
);

// Pipeline Card - The "Fintech" Ticket Style
const PipelineCard = ({ lead, index, onClick }: { lead: Lead; index: number; onClick: () => void }) => {
  const tag = PRODUCT_TAGS[lead.dados.produto || ""] || PRODUCT_TAGS[lead.dados.bancoSelecionado || ""];
  const badges = getLeadBadges(lead);

  return (
  <Draggable draggableId={lead.id} index={index}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        onClick={onClick}
        className={`
          group relative mb-3 rounded-xl border p-4 cursor-pointer transition-all duration-300
          ${
            snapshot.isDragging
              ? "z-50 rotate-2 scale-105 shadow-2xl shadow-emerald-500/20 border-emerald-500 bg-[#111827]"
              : "bg-[#111827]/60 hover:bg-[#111827] hover:-translate-y-1"
          }
          border-white/5 hover:border-emerald-500/30 backdrop-blur-xl
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex flex-col gap-2 max-w-[75%]">
            {tag && (
              <span className="text-sm font-semibold text-slate-200 tracking-wide">
                {tag.label}
              </span>
            )}

            {/* Badges */}
            <div className="absolute top-3 right-3 flex gap-1">
              {badges.slice(0, 1).map((b) => (
                <span
                  key={b.key}
                  className={`text-[9px] uppercase tracking-wider font-bold ${b.className}`}
                >
                  {b.label}
                </span>
              ))}

              {badges.length > 1 && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/10">
                  +{badges.length - 1}
                </span>
              )}
            </div>
          </div>

          {lead.dados.valorEstimado && (
            <span className="flex items-center text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
              {format.currency(lead.dados.valorEstimado)}
            </span>
          )}
        </div>

        {/* Title */}
        <h4 className="text-slate-100 font-semibold text-sm mb-1">
          {lead.dados.nome || "Lead sem nome"}
        </h4>
        <p className="text-xs text-slate-500 mb-4 line-clamp-1">
          {lead.dados.empresa || "Empresa não informada"}
        </p>

        {/* Footer */}
<div className="flex items-center justify-between border-t border-white/5 pt-3 mt-2">
  {/* Lado esquerdo */}
  <div className="flex items-center gap-3">
    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold">
      {(lead.dados.nome?.[0] || "L").toUpperCase()}
    </div>

    <div className="flex flex-col">
      <span className="text-[10px] text-slate-400">Última ação</span>
      <span className="text-[10px] text-slate-300">
        {lead.dados.crm?.dataSimulacao
          ? format.date(lead.dados.crm.dataSimulacao)
          : "-"}
      </span>
    </div>
  </div>

  {/* Lado direito – tempo CLT e margem */}
 <div className="flex flex-col items-end gap-1.5 text-xs font-semibold">
  <span className="flex items-center gap-1.5 text-slate-300">
    <Briefcase className="w-4 h-4 text-amber-400" />
    {lead.dados.tempo_servico_clt
      ? `${lead.dados.tempo_servico_clt} dias`
      : "Tempo CLT N/I"}
  </span>

  <span className="flex items-center gap-1.5 text-slate-300">
    <DollarSign className="w-4 h-4 text-emerald-400" />
    {lead.dados.margem_consignavel
      ? format.currency(lead.dados.margem_consignavel)
      : "Sem margem"}
  </span>
</div>

</div>

      </div>
    )}
  </Draggable>
);

};

const PipelineView = ({
  leads,
  onDragEnd,
  onLeadClick,
  orderByMargem,
}: {
  leads: Lead[];
  onDragEnd: (r: DropResult) => void;
  onLeadClick: (l: Lead) => void;
  orderByMargem: boolean;
}) => (

  <DragDropContext onDragEnd={onDragEnd}>
    <div className="flex gap-6 overflow-x-auto pb-6 h-full custom-scrollbar">
      {STAGES.map((stage) => {
       const today = new Date().toISOString().slice(0, 10);

let stageLeads = leads.filter((l) => l.dados.crm?.status === stage.id);

if (stage.id === "NOVO") {
  stageLeads = stageLeads
    .filter((l) => {
      const margem = l.dados.margem_consignavel ?? 0;
      const dias = l.dados.tempo_servico_clt ?? 0;

      return margem > 300 && dias > 90;
    })
    .sort((a, b) => {
      const da = a.dados.crm?.dataSimulacao
        ? new Date(a.dados.crm.dataSimulacao).getTime()
        : 0;

      const db = b.dados.crm?.dataSimulacao
        ? new Date(b.dados.crm.dataSimulacao).getTime()
        : 0;

      return db - da;
    })
    .slice(0, 30);
} else {
  stageLeads = stageLeads.filter(
    (l) => l.updated_at?.slice(0, 10) === today
  );
}




        return (
          <Droppable key={stage.id} droppableId={stage.id} direction="vertical">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`
                  min-w-[320px] w-[320px] flex flex-col rounded-2xl p-3 border transition-colors duration-300
                  ${snapshot.isDraggingOver ? "bg-[#111827] border-emerald-500/30" : "bg-[#0B1120] border-white/5"}
                `}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4 px-1 pt-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ring-2 ring-opacity-20 ring-white ${stage.color}`} />
                    <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">
                      {stage.label}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-bold text-slate-400 border border-white/5">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar min-h-[150px]">
                  {stageLeads.map((lead, index) => (
                    <PipelineCard
                        key={lead.id}
                        lead={lead}
                        index={index}
                        onClick={() => onLeadClick(lead)}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        );
      })}
    </div>
  </DragDropContext>
);
// ===============================
// PART 3: MODAL & MAIN LAYOUT
// ===============================

const LeadModal = ({ lead, onClose, onUpdate }: any) => {
  const activeBadges = lead.dados.crm?.badges ?? [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#020617]/80 backdrop-blur-sm"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-full max-w-2xl bg-[#0B1120] border-l border-white/10 shadow-2xl shadow-black h-full flex flex-col"
      >
        {/* Header */}
        <div className="flex-none px-8 py-6 border-b border-white/5 bg-[#0B1120] z-10">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {lead.dados.nome || "Lead Desconhecido"}
              </h2>
              <div className="flex items-center gap-2 mt-1 text-slate-400 text-sm">
                <Briefcase className="w-3 h-3" />
                <span>{lead.dados.empresa || "Empresa não informada"}</span>
                <span className="text-slate-600">•</span>
                <span>{lead.email}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/5"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => openWhatsApp(lead.dados.telefone)}
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-emerald-900/20"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 py-2.5 rounded-lg text-sm font-semibold transition-colors">
              <Mail className="w-4 h-4" />
              Enviar Email
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          
          {/* Status Section */}
          <section>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
              Gestão de Status
            </h4>
            <div className="flex flex-wrap gap-2">
              {Object.values(MANUAL_BADGES).map((badge) => {
                const active = activeBadges.includes(badge.key);
                return (
                  <button
                    key={badge.key}
                    onClick={() => {
                      const next = active ? [] : [badge.key];
                      onUpdate(
                        { badges: next },
                        `${active ? "Removeu" : "Adicionou"} badge ${badge.label}`
                      );
                    }}
                    className={`
                      px-3 py-1.5 rounded-lg text-[13px] font-bold border transition-all duration-200
                      ${
                        active
                          ? `${badge.className} ring-1 ring-offset-1 ring-offset-[#0B1120]`
                          : "bg-[#111827] text-slate-400 border-white/10 hover:border-slate-500 hover:text-slate-300"
                      }
                    `}
                  >
                    {badge.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Data Grid */}
          <section>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
              Detalhes Financeiros & Pessoais
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow
                icon={Phone}
                label="Telefone"
                value={lead.dados.telefone || "N/A"}
              
              />

              <InfoRow
                icon={IdCard}
                label="CPF"
                value={lead.dados.cpf || lead.cpf || "N/A"}
                
              />

              <InfoRow
                icon={Calendar}
                label="Data de Nascimento"
                value={
                  lead.dados.dataNasc
                    ? format.date(lead.dados.dataNasc)
                    : "N/A"
                }
              />

              <InfoRow
                icon={DollarSign}
                label="Valor Desejado"
                value={lead.dados.valorCarro || "N/A"}
              />

              <InfoRow
                icon={Calendar}
                label="Tempo de Casa"
                value={format.tempoEmpresa(
                  lead.dados.anosContrato,
                  lead.dados.mesesContrato
                )}
              />

              <InfoRow
                icon={Users}
                label="Porte da Empresa"
                value={lead.dados.tamanhoEmpresa || "N/A"}
              />

              <InfoRow
                icon={Car}
                label="Veículo / Ano"
                value={`${lead.dados.tipoVeiculo || "N/A"}${
                  lead.dados.ano ? ` (${lead.dados.ano})` : ""
                }`}
              />

              <InfoRow
                icon={Car}
                label="Placa"
                value={lead.dados.placa || "N/A"}
              />

              <InfoRow
                icon={MapPin}
                label="Localização"
                value={lead.dados.uf ? `Estado: ${lead.dados.uf}` : "N/A"}
              />

              <InfoRow
                icon={CheckCircle2}
                label="Simulação"
                value={
                  lead.dados.crm?.dataSimulacao
                    ? format.date(lead.dados.crm.dataSimulacao)
                    : "Pendente"
                }
              />
            </div>
          </section>
		  {lead.dados.novoSaque && (
  <section>
    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
      Dados Novo Saque
    </h4>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InfoRow icon={User} label="Nome da Mãe" value={lead.dados.novoSaque.nomeMae || "N/A"} />
      <InfoRow icon={IdCard} label="RG" value={lead.dados.novoSaque.rg || "N/A"} />

      <InfoRow
        icon={Calendar}
        label="Data de Nascimento"
        value={
          lead.dados.novoSaque.dataNascimento
            ? format.date(lead.dados.novoSaque.dataNascimento)
            : "N/A"
        }
      />

      <InfoRow icon={MapPin} label="CEP" value={lead.dados.novoSaque.endereco?.cep || "N/A"} />
      <InfoRow icon={MapPin} label="Rua" value={lead.dados.novoSaque.endereco?.rua || "N/A"} />
      <InfoRow icon={MapPin} label="Bairro" value={lead.dados.novoSaque.endereco?.bairro || "N/A"} />
      <InfoRow icon={MapPin} label="Número" value={lead.dados.novoSaque.endereco?.numero || "N/A"} />

      <InfoRow
        icon={Briefcase}
        label="Banco do Cartão"
        value={lead.dados.novoSaque.bancoCartao || "N/A"}
      />

      <InfoRow
        icon={Calendar}
        label="Dia da Fatura"
        value={
          lead.dados.novoSaque.invoiceDueDay
            ? `Todo dia ${lead.dados.novoSaque.invoiceDueDay}`
            : "N/A"
        }
      />
	  <InfoRow
  icon={DollarSign}
  label="Valor da Parcela"
  value={
    lead.dados.novoSaque.valorParcela
      ? format.currency(lead.dados.novoSaque.valorParcela)
      : "N/A"
  }
/>

<InfoRow
  icon={ClipboardList}
  label="Parcelas"
  value={
    lead.dados.novoSaque.parcelas
      ? `${lead.dados.novoSaque.parcelas}x`
      : "N/A"
  }
/>

<InfoRow
  icon={DollarSign}
  label="Valor Simulado"
  value={
    lead.dados.novoSaque.valorSimulado
      ? format.currency(lead.dados.novoSaque.valorSimulado)
      : "N/A"
  }
/>

<InfoRow
  icon={AlertTriangle}
  label="Taxa de Juros"
  value={
    lead.dados.novoSaque.taxaJurosMensal
      ? `${lead.dados.novoSaque.taxaJurosMensal}% a.m.`
      : "N/A"
  }
/>

    </div>
  </section>
)}

        </div>
      </motion.div>
    </div>
  );
};


// ===============================
// MAIN EXPORT
// ===============================
export default function ProfessionalCRM() {
  const { leads, loading, activeTab, setActiveTab, updateLead, onDragEnd } = useCRM();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [search, setSearch] = useState("");
  const [filterProduct, setFilterProduct] = useState<string | null>(null);
  const [filterBadge, setFilterBadge] = useState<LeadBadgeKey | null>(null);
  const [filterDateSimulacao, setFilterDateSimulacao] = useState<string | null>(null);
  const [minDiasCLT, setMinDiasCLT] = useState<number | null>(null);
const [maxDiasCLT, setMaxDiasCLT] = useState<number | null>(null);
const [onlyMargemPositiva, setOnlyMargemPositiva] = useState(false);
const [orderByMargem, setOrderByMargem] = useState(false);



const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    const normalizedTerm = term.replace(/\D/g, "");
    
    return leads.filter((l) => {
      // Busca por texto (nome, email, empresa)
      const matchesText = !term || 
        [l.email, l.dados.nome, l.dados.empresa].some((v) =>
          v?.toLowerCase().includes(term)
        );
      
      // Busca por números (CPF, telefone) - só aplica se houver dígitos
      const matchesNumber = normalizedTerm.length > 0 &&
        [l.dados.telefone, l.dados.cpf].some((v) =>
          v?.replace(/\D/g, "").includes(normalizedTerm)
        );
      
      // Combina as buscas: se não há termo OU se encontrou em texto OU em números
      const matchesSearch = !term || matchesText || matchesNumber;
      
      const matchesProduct = !filterProduct || 
        l.dados.produto === filterProduct || 
        l.dados.bancoSelecionado === filterProduct;
      
      const matchesBadge = !filterBadge || 
        l.dados.crm?.badges?.includes(filterBadge);
      
      const matchesDateSimulacao = !filterDateSimulacao || 
        (l.dados.crm?.dataSimulacao && 
         l.dados.crm.dataSimulacao.slice(0, 10) >= filterDateSimulacao);
      
      // Filtro dias CLT
const diasCLT = l.dados.tempo_servico_clt ?? null;

const matchesMinCLT =
  minDiasCLT === null || (diasCLT !== null && diasCLT >= minDiasCLT);

const matchesMaxCLT =
  maxDiasCLT === null || (diasCLT !== null && diasCLT <= maxDiasCLT);

// Filtro margem positiva
const matchesMargem =
  !onlyMargemPositiva ||
  (l.dados.margem_consignavel !== null &&
    l.dados.margem_consignavel !== undefined &&
    l.dados.margem_consignavel > 0);

return (
  matchesSearch &&
  matchesProduct &&
  matchesBadge &&
  matchesDateSimulacao &&
  matchesMinCLT &&
  matchesMaxCLT &&
  matchesMargem
);

    });
  }, [
  leads,
  search,
  filterProduct,
  filterBadge,
  filterDateSimulacao,
  minDiasCLT,
  maxDiasCLT,
  onlyMargemPositiva,
]);


  if (loading)
    return (
      <div className="h-screen w-screen bg-[#020617] flex items-center justify-center">
         <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            <span className="text-emerald-500 font-medium text-sm animate-pulse">Carregando Sistema...</span>
         </div>
      </div>
    );

  return (
    <div className="bg-[#020617] min-h-screen text-slate-200 font-sans selection:bg-emerald-500/30">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="lg:pl-64 p-8 min-h-screen flex flex-col">
        {/* Top Control Bar */}
        <div className="mb-8 flex flex-col xl:flex-row gap-4 xl:items-center justify-between">
            {/* Search */}
            <div className="relative w-full xl:w-96 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por nome, CPF, empresa..."
                    className="w-full bg-[#111827] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all shadow-sm"
                />
            </div>

            {/* Filters */}
			
            <div className="flex flex-wrap items-center gap-3">
			<button
  onClick={() => setOrderByMargem((v) => !v)}
  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
    orderByMargem
      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      : "bg-[#111827] text-slate-400 border-white/10 hover:bg-white/5"
  }`}
>
  Ordenar por Margem
</button>

			{/* Filtro Dias CLT */}
<div className="bg-[#111827] border border-white/10 rounded-xl p-1.5 flex gap-2">
  <input
    type="number"
    placeholder="CLT ≥ dias"
    value={minDiasCLT ?? ""}
    onChange={(e) =>
      setMinDiasCLT(e.target.value ? Number(e.target.value) : null)
    }
    className="w-24 bg-[#0B1120] rounded-lg px-3 py-2 text-xs text-slate-300 focus:ring-0"
  />

  <input
    type="number"
    placeholder="CLT ≤ dias"
    value={maxDiasCLT ?? ""}
    onChange={(e) =>
      setMaxDiasCLT(e.target.value ? Number(e.target.value) : null)
    }
    className="w-24 bg-[#0B1120] rounded-lg px-3 py-2 text-xs text-slate-300 focus:ring-0"
  />
</div>

{/* Filtro Margem Positiva */}
<button
  onClick={() => setOnlyMargemPositiva((v) => !v)}
  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
    onlyMargemPositiva
      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      : "bg-[#111827] text-slate-400 border-white/10 hover:bg-white/5"
  }`}
>
  Margem +
</button>

                <div className="bg-[#111827] border border-white/10 rounded-xl p-1.5 flex items-center gap-2">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 z-10" />
                        <select
                            value={filterProduct ?? ""}
                            onChange={(e) => setFilterProduct(e.target.value || null)}
                            className="bg-[#0B1120] border-0 rounded-lg pl-9 pr-8 py-2 text-xs font-medium text-slate-300 hover:bg-[#1f2937] focus:ring-0 cursor-pointer transition-colors appearance-none min-w-[140px]"
                        >
                            <option value="">Todos Produtos</option>
                            {Object.entries(PRODUCT_TAGS).map(([key, p]) => (
                            <option key={key} value={key}>{p.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-px h-5 bg-white/10" />
                    <div className="relative">
                        <select
                            value={filterBadge ?? ""}
                            onChange={(e) => setFilterBadge(e.target.value ? (e.target.value as LeadBadgeKey) : null)}
                            className="bg-[#0B1120] border-0 rounded-lg px-4 py-2 text-xs font-medium text-slate-300 hover:bg-[#1f2937] focus:ring-0 cursor-pointer transition-colors appearance-none min-w-[140px]"
                        >
                            <option value="">Todos Status</option>
                            {Object.values(MANUAL_BADGES).map((b) => (
                            <option key={b.key} value={b.key}>{b.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="bg-[#111827] border border-white/10 rounded-xl p-1.5">
                    <input
                        type="date"
                        value={filterDateSimulacao ?? ""}
                        onChange={(e) => setFilterDateSimulacao(e.target.value || null)}
                        className="bg-[#0B1120] border-0 rounded-lg px-3 py-2 text-xs font-medium text-slate-300 hover:bg-[#1f2937] focus:ring-0 cursor-pointer transition-colors"
                    />
                </div>

                {(filterProduct || filterBadge || filterDateSimulacao) && (
                <button
                    onClick={() => {
                        setFilterProduct(null);
                        setFilterBadge(null);
                        setFilterDateSimulacao(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-colors border border-red-500/20"
                >
                    Limpar
                </button>
                )}
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-0">
            {activeTab === "PIPELINE" && (
            <PipelineView
  leads={filtered}
  onDragEnd={onDragEnd}
  onLeadClick={setSelectedLead}
  orderByMargem={orderByMargem}
/>

            )}

            {activeTab === "LIST" && (
            <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#0B1120] border-b border-white/5 text-xs uppercase text-slate-500 font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Nome / Email</th>
                            <th className="px-6 py-4">Empresa</th>
                            <th className="px-6 py-4">CPF</th>
                            <th className="px-6 py-4">Telefone</th>
                            <th className="px-6 py-4 text-right">Ação</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filtered.map((l) => (
                        <tr
                            key={l.id}
                            onClick={() => setSelectedLead(l)}
                            className="hover:bg-white/[0.02] cursor-pointer transition-colors group"
                        >
                            <td className="px-6 py-4">
                                <div className="font-medium text-white">{l.dados.nome || "Sem nome"}</div>
                                <div className="text-xs text-slate-500">{l.email}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-400">{l.dados.empresa || "-"}</td>
                            <td className="px-6 py-4 text-sm text-slate-400 font-mono">{l.dados.cpf || l.cpf}</td>
                            <td className="px-6 py-4 text-sm text-slate-400">{l.dados.telefone || "-"}</td>
                            <td className="px-6 py-4 text-right">
                                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-emerald-500 ml-auto transition-colors" />
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        Nenhum lead encontrado com os filtros atuais.
                    </div>
                )}
            </div>
            )}
        </div>
      </main>

      <AnimatePresence>
        {selectedLead && (
          <LeadModal
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
            onUpdate={(u: any, m: string) => updateLead(selectedLead, u, m)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}