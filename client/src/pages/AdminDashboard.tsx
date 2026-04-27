import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import logo from "../assets/Logotipo.png";

const API_URL = "https://altivacred-server.onrender.com";

// ======================= TYPES =======================
type DadosLead = {
  cpf: string;
  nome: string;
  telefone: string;
  email: string;

  bancoSelecionado?: string;

  anosContrato?: number;
  mesesContrato?: number;

  tamanhoEmpresa?: string;
  jaFezEmprestimo?: string;

  etapaContratacao?: number;
};

type Lead = {
  email: string;
  cpf: string;
  etapa: number;
  updated_at: string;
  dados: DadosLead;
};

// =================== COMPONENT =======================
export default function AdminDashboard() {
  // AUTH / LOADING
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  // CREDENTIALS
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // RAW STATS
  const [stats, setStats] = useState<any>({
    total: 0,
    funil: [],
    tabela: [],
  });

  // FILTERS / UI
  const [periodo, setPeriodo] = useState("tudo");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
const [minMesesContrato, setMinMesesContrato] = useState<number | null>(null);
const [maxMesesContrato, setMaxMesesContrato] = useState<number | null>(null);



  // THEME — FIXO EM DARK
  // const theme = "dark"; // (Variável não utilizada, mantida comentado se quiser usar depois)

  // SEARCH + PAGINATION
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);

  // KPI & CHART DATA
  const [chartElegiveis, setChartElegiveis] = useState<any[]>([]);
  const [chartEtapas, setChartEtapas] = useState<any[]>([]);
  const [chartVolumeDia, setChartVolumeDia] = useState<any[]>([]); // <--- NOVO STATE
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const COLORS = ["#7BD4FF", "#FF6B6B", "#0088FE", "#FFBB28", "#00C49F"];

  // SMALL UI FLAGS
  const [tableSortKey, setTableSortKey] = useState<string | null>(null);
  const [tableSortDir, setTableSortDir] = useState<"asc" | "desc">("asc");

  // CARD FILTER
  const [cardFilter, setCardFilter] = useState<
    | null
    | { type: "elegibilidade"; value: "Elegível" | "Não" }
    | { type: "etapa"; etapa: number }
  >(null);

  // ==================== EFFECTS =====================
  useEffect(() => {
    const token = localStorage.getItem("nitz_admin_token");
    if (token === "admin-token-secreto-nitz") {
      setIsAuthenticated(true);
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodo, dateStart, dateEnd]);

  // =================== AUTH HANDLERS ===================
  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const r = await axios.post(`${API_URL}/admin/login`, { login, senha });
      if (r.data.success) {
        localStorage.setItem("nitz_admin_token", r.data.token);
        setIsAuthenticated(true);
        fetchData();
      } else {
        setErrorMsg("Login incorreto.");
      }
    } catch (err) {
      setErrorMsg("Login incorreto.");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("nitz_admin_token");
    setIsAuthenticated(false);
  };

  // =================== FETCH DATA ======================
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("nitz_admin_token") ?? "";
      const r = await axios.get(`${API_URL}/admin/dashboard-data`, {
        params: {
          periodo,
          inicio: dateStart || undefined,
          fim: dateEnd || undefined,
        },
        headers: { Authorization: token },
      });

      const leads: Lead[] = (r.data.tabela || []).map((l: any) => ({
        ...l,
        dados: typeof l.dados === "string" ? JSON.parse(l.dados) : l.dados,
      }));

      // Ordena por data (mais recente primeiro) para a tabela
      leads.sort(
        (a, b) =>
          new Date(b.updated_at).getTime() -
          new Date(a.updated_at).getTime()
      );

      const newStats = { ...r.data, tabela: leads };
      setStats(newStats);

      // --- CÁLCULO ELEGIBILIDADE (PIE CHART) ---
      let countElegivel = 0;
      let countNaoElegivel = 0;

      // --- CÁLCULO VOLUME DIÁRIO (STACKED BAR CHART) ---
      const volumeMap: Record<
        string,
        {
          name: string;
          elegivel: number;
          naoElegivel: number;
          ts: number; // timestamp para ordenar
        }
      > = {};

      leads.forEach((l) => {
        const d = l.dados;
        const meses = (d.anosContrato ?? 0) * 12 + (d.mesesContrato ?? 0);
        const isEligible =
          meses >= 6 && d.tamanhoEmpresa?.includes("Mais de 20");

        // Pie Chart Counter
        if (isEligible) countElegivel++;
        else countNaoElegivel++;

        // Volume Stacked Logic
        const dateObj = new Date(l.updated_at);
        // Chave DD/MM
        const dateKey = dateObj.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        });

        if (!volumeMap[dateKey]) {
          volumeMap[dateKey] = {
            name: dateKey,
            elegivel: 0,
            naoElegivel: 0,
            ts: dateObj.setHours(0, 0, 0, 0), // Normaliza hora para ordenação correta
          };
        }

        if (isEligible) {
          volumeMap[dateKey].elegivel += 1;
        } else {
          volumeMap[dateKey].naoElegivel += 1;
        }
      });

      setChartElegiveis([
        { name: "Elegíveis", value: countElegivel },
        { name: "Não elegíveis", value: countNaoElegivel },
      ]);

      // Converter map para array e ordenar cronologicamente
      const volumeArray = Object.values(volumeMap).sort((a, b) => a.ts - b.ts);
      setChartVolumeDia(volumeArray);

      // --- CÁLCULO FUNIL (BAR CHART) ---
      setChartEtapas(
        (newStats.funil || []).map((f: any) => ({
          etapa: `Etapa ${f.etapa}`,
          quantidade: f.quantidade,
        }))
      );

      setLastUpdate(new Date());
    } catch (err) {
      setErrorMsg("Erro ao buscar dados.");
    } finally {
      setLoading(false);
    }
  };

  // ================== FILTERS & SEARCH ==================
  const normalized = (s?: string) => (s || "").toString().toLowerCase();

  const filteredLeads = useMemo(() => {
    const all: Lead[] = stats.tabela || [];
    const q = query.trim().toLowerCase();
    let result = all.filter((lead) => {
      if (!q) return true;
      const d = lead.dados;
      return (
        normalized(d.nome).includes(q) ||
        normalized(d.email).includes(q) ||
        normalized(d.cpf).includes(q) ||
        normalized(d.telefone).includes(q) ||
        normalized(d.tamanhoEmpresa).includes(q)
      );
    });

    if (cardFilter) {
      if (cardFilter.type === "elegibilidade") {
        const val = cardFilter.value;
        result = result.filter((l) => {
          const d = l.dados;
          const meses =
            (d.anosContrato ?? 0) * 12 + (d.mesesContrato ?? 0);
          const elegivel =
            meses >= 6 && d.tamanhoEmpresa?.includes("Mais de 20")
              ? "Elegível"
              : "Não";
          return elegivel === val;
        });
      } else if (cardFilter.type === "etapa") {
        result = result.filter((l) => l.etapa === cardFilter.etapa);
      }
    }

    if (tableSortKey) {
      result = [...result].sort((a: any, b: any) => {
        let av =
          tableSortKey === "updated_at"
            ? new Date(a.updated_at).getTime()
            : normalized(a.dados?.[tableSortKey] ?? a[tableSortKey]);
        let bv =
          tableSortKey === "updated_at"
            ? new Date(b.updated_at).getTime()
            : normalized(b.dados?.[tableSortKey] ?? b[tableSortKey]);

        if (av < bv) return tableSortDir === "asc" ? -1 : 1;
        if (av > bv) return tableSortDir === "asc" ? 1 : -1;
        return 0;
      });
    }
	if (minMesesContrato !== null || maxMesesContrato !== null) {
  result = result.filter((lead) => {
    const d = lead.dados;
    const meses =
      (d.anosContrato ?? 0) * 12 + (d.mesesContrato ?? 0);

    if (minMesesContrato !== null && meses < minMesesContrato) {
      return false;
    }

    if (maxMesesContrato !== null && meses > maxMesesContrato) {
      return false;
    }

    return true;
  });
}



    return result;
  }, [
  stats.tabela,
  query,
  cardFilter,
  tableSortKey,
  tableSortDir,
  minMesesContrato,
  maxMesesContrato,
]);



  // pagination
  const totalItems = filteredLeads.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const paginatedLeads = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredLeads.slice(start, start + perPage);
  }, [filteredLeads, page, perPage]);

  // ================ EXPORT CSV =================
  const exportCSV = () => {
    const headers = [
      "Nome",
      "CPF",
      "Telefone",
      "Email",
      "Empresa",
      "Anos",
      "Meses",
      "Elegível",
      "Etapa",
      "Última Atualização",
    ];

    const rows = filteredLeads.map((lead) => {
      const d = lead.dados;
      const meses =
        (d.anosContrato ?? 0) * 12 + (d.mesesContrato ?? 0);
      const elegivel =
        meses >= 6 && d.tamanhoEmpresa?.includes("Mais de 20")
          ? "Elegível"
          : "Não";

      return [
        `"${d.nome}"`,
        `"${d.cpf}"`,
        `"${d.telefone}"`,
        `"${d.email}"`,
        `"${d.tamanhoEmpresa}"`,
        d.anosContrato ?? "",
        d.mesesContrato ?? "",
        elegivel,
        lead.etapa,
        `"${new Date(lead.updated_at).toLocaleString("pt-BR")}"`,
      ].join(",");
    });

    const content = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([content], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nitz_leads.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // helpers
  const resetCardFilter = () => setCardFilter(null);
  const fmt = (v: any) => (v == null ? "-" : v);

  const handleCardClickElegiveis = (only: boolean) => {
    setCardFilter(
      only ? { type: "elegibilidade", value: "Elegível" } : null
    );
    setPage(1);
  };

  const handleCardClickEtapa = (etapaNum?: number | null) => {
    if (etapaNum != null)
      setCardFilter({ type: "etapa", etapa: etapaNum });
    else setCardFilter(null);
    setPage(1);
  };
    const openWhatsApp = (telefone: string) => {
    if (!telefone) return;

    const numero = telefone.replace(/\D/g, "");

    const msg =
      "Olá, sou Fred, asistente da Nitz Digital. Irei te auxiliar com a sua simulação do crédito do trabalhador!";

    const encoded = encodeURIComponent(msg);

    window.open(`https://wa.me/55${numero}?text=${encoded}`, "_blank");
  };


  // ========================== LOGIN ==========================
  if (!isAuthenticated) {
    return (
      <div className="bg-gradient-to-b from-[#071827] to-[#0A2540] min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md bg-white/10 border border-white/20 text-white backdrop-blur-xl rounded-2xl shadow-2xl p-8"
        >
          <div className="flex flex-col items-center gap-3 mb-6">
            <img
              src={logo}
              alt="Nitz"
              className="w-36 object-contain drop-shadow"
            />
            <h1 className="text-white text-xl font-bold">
              Painel Administrativo
            </h1>
            <p className="text-white/70 text-sm">
              Acesso restrito à equipe interna.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <label className="block">
              <span className="text-white/80 text-xs">Login</span>
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="mt-2 w-full rounded-lg px-3 py-2 bg-white/10 text-white border border-white/20 placeholder-white/60 outline-none"
                placeholder="usuario.admin"
              />
            </label>

            <label className="block">
              <span className="text-white/80 text-xs">Senha</span>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="mt-2 w-full rounded-lg px-3 py-2 bg-white/10 text-white border border-white/20 placeholder-white/60 outline-none"
                placeholder="••••••••"
              />
            </label>

            {errorMsg && (
              <div className="text-sm text-red-400 text-center">
                {errorMsg}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-full bg-[#7BD4FF] text-[#052738] font-semibold shadow-md hover:opacity-95 transition"
              >
                {loading ? "Entrando..." : "Acessar Dashboard"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setLogin("admin");
                  setSenha("admin123");
                }}
                className="px-3 py-2 rounded-md border border-white/20 text-xs"
              >
                Demo
              </button>
            </div>
          </form>

          <p className="mt-6 text-xs text-center text-white/40">
            © Nitz — acesso interno. Última verificação:{" "}
            {lastUpdate.toLocaleString()}
          </p>
        </motion.div>
      </div>
    );
  }

  // ========================= DASHBOARD =========================
  return (
    <div className="bg-gradient-to-b from-[#071827] to-[#0A2540] text-white min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <img src={logo} alt="Nitz" className="w-36 object-contain" />
            <div>
              <h1 className="text-2xl font-bold">Painel Nitz</h1>
              <p className="text-white/60 text-xs">
                Atualizado em {lastUpdate.toLocaleString("pt-BR")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Quick period */}
            <div className="flex items-center gap-2">
              {["hoje", "3dias", "7dias", "30dias", "tudo"].map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPeriodo(p);
                    setPage(1);
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                    periodo === p
                      ? "bg-[#7BD4FF] text-[#052738]"
                      : "bg-white/6 border border-white/10"
                  }`}
                >
                  {p === "hoje"
                    ? "24h"
                    : p === "3dias"
                    ? "3d"
                    : p === "tudo"
                    ? "Total"
                    : p}
                </button>
              ))}
            </div>
			<div className="flex items-center gap-2">
  <input
    type="number"
    min={0}
    placeholder="Mín. meses"
    value={minMesesContrato ?? ""}
    onChange={(e) => {
      const v = e.target.value;
      setMinMesesContrato(v === "" ? null : Number(v));
      setPage(1);
    }}
    className="rounded-lg px-3 py-2 outline-none bg-white/10 text-white border border-white/20 w-32"
  />

  <span className="text-white/50 text-sm">até</span>

  <input
    type="number"
    min={0}
    placeholder="Máx. meses"
    value={maxMesesContrato ?? ""}
    onChange={(e) => {
      const v = e.target.value;
      setMaxMesesContrato(v === "" ? null : Number(v));
      setPage(1);
    }}
    className="rounded-lg px-3 py-2 outline-none bg-white/10 text-white border border-white/20 w-32"
  />
</div>



            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateStart}
                onChange={(e) => {
                  setDateStart(e.target.value);
                  setPage(1);
                }}
                className="rounded-md px-2 py-1 text-xs bg-white/10 text-white border border-white/20"
              />
              <input
                type="date"
                value={dateEnd}
                onChange={(e) => {
                  setDateEnd(e.target.value);
                  setPage(1);
                }}
                className="rounded-md px-2 py-1 text-xs bg-white/10 text-white border border-white/20"
              />
            </div>

            <button
              onClick={handleLogout}
              className="ml-2 px-3 py-1 rounded-md bg-red-500 text-white text-sm font-semibold"
            >
              Sair
            </button>
          </div>
        </motion.header>

        {/* TOP ACTIONS */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-6">
          <div className="flex items-center gap-3 w-full md:w-1/2">
            <input
              placeholder="Buscar por nome, email, CPF, telefone ou empresa..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              className="flex-1 rounded-lg px-3 py-2 outline-none bg-white/10 text-white placeholder-white/60 border border-white/20"
            />

            <button
              onClick={() => {
                setQuery("");
                setPage(1);
              }}
              className="px-3 py-2 rounded-md border border-white/20 text-sm"
            >
              Limpar
            </button>

            <button
              onClick={() => exportCSV()}
              className="px-3 py-2 rounded-md bg-[#7BD4FF] text-[#052738] font-semibold shadow"
            >
              Exportar CSV
            </button>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs">Linhas</label>
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-md px-2 py-1 bg-white/10 text-white border border-white/20"
            >
              {[10, 15, 25, 50].map((n) => (
                <option
                  key={n}
                  value={n}
                  className="bg-[#071827] text-white"
                >
                  {n}
                </option>
              ))}
            </select>

            <div className="text-xs text-white/40">
              Exibindo {paginatedLeads.length} de {totalItems}
            </div>
          </div>
        </div>

        {/* KPI CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-xl p-5 cursor-pointer bg-white/6 border border-white/10 shadow"
            onClick={() => {
              resetCardFilter();
              setQuery("");
              setPage(1);
            }}
          >
            <h3 className="text-xs font-semibold uppercase text-white/70">
              Total de Leads
            </h3>
            <p className="text-3xl font-extrabold mt-2">
              {fmt(stats.total ?? stats.tabela?.length ?? 0)}
            </p>
            <p className="text-xs text-white/50 mt-2">
              Clique para limpar filtros
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-xl p-5 cursor-pointer bg-white/6 border border-white/10 shadow"
            onClick={() => handleCardClickElegiveis(true)}
          >
            <h3 className="text-xs font-semibold uppercase text-white/70">
              Elegíveis
            </h3>
            <p className="text-3xl font-extrabold mt-2">
              {chartElegiveis[0]?.value ?? 0}
            </p>
            <p className="text-xs text-white/50 mt-2">
              Clique para ver apenas elegíveis
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-xl p-5 cursor-pointer bg-white/6 border border-white/10 shadow"
            onClick={() =>
              stats.funil?.[0] &&
              handleCardClickEtapa(stats.funil[0].etapa)
            }
          >
            <h3 className="text-xs font-semibold uppercase text-white/70">
              Etapa Principal
            </h3>
            <p className="text-3xl font-extrabold mt-2">
              {stats.funil?.[0]?.etapa ?? "N/A"}
            </p>
            <p className="text-xs text-white/50 mt-2">
              Clique para filtrar por etapa
            </p>
          </motion.div>
        </section>

        {/* --- NOVO GRÁFICO DE VOLUME POR DIA (STACKED) --- */}
        <section className="mt-6">
          <div className="rounded-xl p-5 bg-white/6 border border-white/10 shadow">
            <h2 className="text-lg font-semibold mb-3">
              Volume de Leads por Dia (Elegibilidade)
            </h2>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={chartVolumeDia}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" stroke="#ffffff60" fontSize={12} />
                  <YAxis stroke="#ffffff60" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#071827",
                      borderColor: "#ffffff20",
                      color: "#fff",
                    }}
                    cursor={{ fill: "#ffffff10" }}
                  />
                  <Legend />
                  {/* StackId igual ('a') faz empilhar */}
                  <Bar
                    name="Elegíveis"
                    dataKey="elegivel"
                    stackId="a"
                    fill="#4ADE80" // Verde
                  />
                  <Bar
                    name="Não Elegíveis"
                    dataKey="naoElegivel"
                    stackId="a"
                    fill="#F87171" // Vermelho
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* CHARTS ROW (PIE + FUNNEL) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="rounded-xl p-5 bg-white/6 border border-white/10 shadow">
            <h2 className="text-lg font-semibold mb-3">
              Distribuição de Elegibilidade (Total)
            </h2>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={chartElegiveis}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                    dataKey="value"
                  >
                    {chartElegiveis.map((entry, idx) => (
                      <Cell
                        key={idx}
                        fill={COLORS[idx % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#071827",
                      borderColor: "#ffffff20",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl p-5 bg-white/6 border border-white/10 shadow">
            <h2 className="text-lg font-semibold mb-3">
              Funil por Etapa
            </h2>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={chartEtapas}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="etapa" stroke="#ffffff60" fontSize={12} />
                  <YAxis stroke="#ffffff60" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#071827",
                      borderColor: "#ffffff20",
                      color: "#fff",
                    }}
                    cursor={{ fill: "#ffffff10" }}
                  />
                  <Legend />
                  <Bar dataKey="quantidade" fill="#7BD4FF" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* TABLE */}
        <section className="mt-8">
          <div className="rounded-xl p-5 bg-white/6 border border-white/10 shadow">
            {/* TABLE HEADER */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                Leads (Mais Recentes Primeiro)
              </h2>

              <div className="flex items-center gap-2">
                <label className="text-xs">Ordenar por</label>
                <select
                  value={tableSortKey || ""}
                  onChange={(e) => {
                    const v = e.target.value || null;
                    setTableSortKey(v);
                    setPage(1);
                  }}
                  className="rounded-md px-2 py-1 text-xs bg-white/10 text-white border border-white/20"
                >
                  <option className="bg-[#071827]" value="">
                    Default
                  </option>
                  <option className="bg-[#071827]" value="nome">
                    Nome
                  </option>
                  <option
                    className="bg-[#071827]"
                    value="updated_at"
                  >
                    Última Atualização
                  </option>
                  <option className="bg-[#071827]" value="cpf">
                    CPF
                  </option>
                </select>

                <button
                  onClick={() =>
                    setTableSortDir((d) =>
                      d === "asc" ? "desc" : "asc"
                    )
                  }
                  className="px-2 py-1 rounded-md border text-xs"
                >
                  {tableSortDir === "asc" ? "↑" : "↓"}
                </button>
              </div>
            </div>

            {/* TABLE BODY */}
            <div className="overflow-auto max-h-[520px]">
              <table className="w-full text-sm">
                <thead className="bg-[#0A2540]/70 text-white/70">
                  <tr className="text-xs uppercase">
                    <th className="px-3 py-2 text-left">Nome</th>
                    <th className="px-3 py-2 text-left">CPF</th>
                    <th className="px-3 py-2 text-left">
                      Telefone
                    </th>
                    <th className="px-3 py-2 text-left">
                      Empresa
                    </th>
                    <th className="px-3 py-2 text-left">
                      Tempo
                    </th>
                    <th className="px-3 py-2 text-left">
                      Elegível
                    </th>
                    <th className="px-3 py-2 text-left">Etapa</th>
                    <th className="px-3 py-2 text-left">
                      Última Atualização
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedLeads.map((lead: Lead, i: number) => {
                    const d = lead.dados;
                    const meses =
                      (d.anosContrato ?? 0) * 12 +
                      (d.mesesContrato ?? 0);
                    const elegivel =
                      meses >= 6 &&
                      d.tamanhoEmpresa?.includes("Mais de 20")
                        ? "Elegível"
                        : "Não";

                    return (
                      <tr
                        key={i}
                        className="border-b hover:bg-white/5 transition"
                      >
                        <td className="px-3 py-2 font-semibold">
                          {d.nome}
                        </td>
                        <td className="px-3 py-2">{d.cpf}</td>
                        <td className="px-3 py-2">
  <button
    onClick={() => openWhatsApp(d.telefone)}
    className="text-[#7BD4FF] underline hover:text-[#a6e6ff] transition"
  >
    {d.telefone}
  </button>
</td>
                        <td className="px-3 py-2">
                          {d.tamanhoEmpresa}
                        </td>
                        <td className="px-3 py-2">
                          {d.anosContrato ?? 0} anos /{" "}
                          {d.mesesContrato ?? 0} meses
                        </td>
                        <td
                          className={`px-3 py-2 font-bold ${
                            elegivel === "Elegível"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {elegivel}
                        </td>
                        <td className="px-3 py-2">
                          <button
                            onClick={() => {
                              handleCardClickEtapa(lead.etapa);
                              setPage(1);
                            }}
                            className="text-xs px-2 py-1 rounded-full border text-white/80"
                          >
                            {lead.etapa}
                          </button>
                        </td>
                        <td className="px-3 py-2">
                          {new Date(
                            lead.updated_at
                          ).toLocaleString("pt-BR")}
                        </td>
                      </tr>
                    );
                  })}

                  {paginatedLeads.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-3 py-8 text-center text-white/60"
                      >
                        Nenhum lead encontrado para o filtro
                        atual.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-xs text-white/60">
                Página {page} de {totalPages}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="px-2 py-1 rounded border text-xs"
                >
                  « Primeiro
                </button>

                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-2 py-1 rounded border text-xs"
                >
                  ‹
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages })
                    .slice(
                      Math.max(0, page - 3),
                      Math.min(totalPages, page + 2)
                    )
                    .map((_, idx) => {
                      const pnum = Math.max(
                        1,
                        Math.min(
                          totalPages,
                          page - 2 + idx
                        )
                      );
                      return (
                        <button
                          key={pnum}
                          onClick={() => setPage(pnum)}
                          className={`px-2 py-1 rounded text-xs ${
                            pnum === page
                              ? "bg-[#7BD4FF] text-[#052738]"
                              : "border"
                          }`}
                        >
                          {pnum}
                        </button>
                      );
                    })}
                </div>

                <button
                  onClick={() =>
                    setPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={page === totalPages}
                  className="px-2 py-1 rounded border text-xs"
                >
                  ›
                </button>

                <button
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className="px-2 py-1 rounded border text-xs"
                >
                  Último »
                </button>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-6 text-center text-xs text-white/40">
          © Nitz — Painel interno. Dados sensíveis permanecem
          dentro da empresa.
        </footer>
      </div>

      <style>{`
        @media (max-width: 768px) {
          img[alt="Nitz"] { width: 160px; }
        }
      `}</style>
    </div>
  );
}
