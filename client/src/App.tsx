import React, { useEffect, useRef, useState } from "react";
import logo from "./assets/Logotipo.png";
import hero from "./assets/hero.png";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Droplets,
  Gift,
  Heart,
  Instagram,
  Leaf,
  Menu,
  Package,
  ShieldCheck,
  Sprout,
  Sun,
  Truck,
  X,
} from "lucide-react";

/**
 * ManjeriCo — landing page premium
 * Stack: React + TypeScript + Tailwind CSS + lucide-react
 *
 * Antes de publicar:
 * 1. Troque MERCADO_LIVRE_URL e INSTAGRAM_URL pelos links reais.
 * 2. Confirme preço, composição do kit, prazo/frete e políticas no anúncio.
 * 3. Mantenha os arquivos ./assets/Logotipo.png e ./assets/hero.png.
 * 4. Tipografia: o componente injeta Fraunces + Inter via Google Fonts (ver FontStyles).
 *    Se preferir, mova o @import para o index.html / index.css.
 */

const MERCADO_LIVRE_URL = "https://www.mercadolivre.com.br/";
const INSTAGRAM_URL = "https://www.instagram.com/";
const PRICE = "R$ 78,90";

const C = {
  forest: "#173D2B",
  forestLight: "#28563C",
  cream: "#F8F4E9",
  terracotta: "#C96A3B",
  terracottaDark: "#B75B32",
  sage: "#E8EDE4",
};

const faqs = [
  {
    question: "O kit é indicado para quem nunca plantou?",
    answer:
      "Sim. O Kit Iniciante foi pensado para facilitar os primeiros passos na jardinagem. Você recebe os materiais descritos na página e pode seguir as orientações de plantio adequadas às sementes incluídas.",
  },
  {
    question: "O que vem no kit?",
    answer:
      "O kit inclui um vaso de aproximadamente 13 × 11 cm, 1,2 litro de substrato, três ferramentas de jardinagem e sachês de sementes. Confira as fotos e a descrição do anúncio para confirmar a composição vigente.",
  },
  {
    question: "Preciso comprar mais alguma coisa?",
    answer:
      "Os principais materiais de cultivo estão reunidos no kit. Dependendo das sementes e das condições de cultivo, você pode precisar de água, luz adequada e cuidados complementares.",
  },
  {
    question: "Posso dar o kit de presente?",
    answer:
      "Pode, e é uma ótima escolha: o kit reúne tudo que a pessoa precisa para começar, sem exigir experiência prévia. Para presentear, basta indicar o endereço de quem vai receber durante a compra no Mercado Livre.",
  },
  {
    question: "Como acompanho a entrega?",
    answer:
      "Ao comprar pelo Mercado Livre, consulte o prazo estimado, as opções de frete e o acompanhamento do pedido diretamente na plataforma.",
  },
  {
    question: "Onde compro com segurança?",
    answer:
      "A compra é feita no Mercado Livre, com as condições, formas de pagamento e proteções da própria plataforma. Confira os detalhes no anúncio antes de finalizar.",
  },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Fade-up ao entrar na tela */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function FontStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600&family=Inter:wght@400;500;600;700&display=swap');
      .mc-sans { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
      .mc-display { font-family: 'Fraunces', Georgia, 'Times New Roman', serif; font-optical-sizing: auto; }
      html { scroll-behavior: smooth; }
      @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
      .mc-grain::after {
        content: ""; position: absolute; inset: 0; pointer-events: none; opacity: .05; mix-blend-mode: multiply;
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
      }
    `}</style>
  );
}

function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <a
      href="#inicio"
      className={`inline-flex items-center ${light ? "rounded-xl bg-[#F8F4E9] px-3 py-2" : ""}`}
      aria-label="ManjeriCo — início"
    >
      <img
        src={logo}
        alt="ManjeriCo"
        className={`w-auto object-contain ${light ? "h-14 max-w-[240px]" : "h-14 max-w-[220px] sm:h-16 sm:max-w-[260px]"}`}
      />
    </a>
  );
}

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className={`mb-5 inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.28em] ${
        light ? "text-[#D98A60]" : "text-[#C96A3B]"
      }`}
    >
      <span className={`h-px w-8 ${light ? "bg-[#D98A60]" : "bg-[#C96A3B]"}`} />
      {children}
    </p>
  );
}

function PrimaryButton({
  onClick,
  children,
  tone = "forest",
  className = "",
}: {
  onClick: () => void;
  children: React.ReactNode;
  tone?: "forest" | "terracotta" | "cream";
  className?: string;
}) {
  const tones = {
    forest: "bg-[#173D2B] text-white hover:bg-[#28563C] shadow-[0_12px_30px_-12px_rgba(23,61,43,0.55)]",
    terracotta: "bg-[#C96A3B] text-white hover:bg-[#B75B32] shadow-[0_12px_30px_-12px_rgba(201,106,59,0.6)]",
    cream: "bg-[#F8F4E9] text-[#173D2B] hover:bg-white",
  };
  return (
    <button
      onClick={onClick}
      className={`group inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 text-sm font-semibold tracking-wide transition duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96A3B] focus-visible:ring-offset-2 ${tones[tone]} ${className}`}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </button>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const buy = () => window.open(MERCADO_LIVRE_URL, "_blank", "noopener,noreferrer");

  const navItems = [
    { label: "O kit", id: "o-kit" },
    { label: "Como funciona", id: "como-funciona" },
    { label: "Presentear", id: "presente" },
    { label: "Sobre", id: "sobre" },
    { label: "Dúvidas", id: "duvidas" },
  ];

  const pillars = [
    { icon: Sprout, title: "Comece do zero", text: "Pensado para quem nunca plantou. Sem jargão, sem pressão." },
    { icon: Package, title: "Tudo reunido", text: "Vaso, substrato, ferramentas e sementes em um único kit." },
    { icon: Leaf, title: "Seu ritmo", text: "Uma pausa na rotina para cuidar, aprender e ver algo crescer." },
  ];

  const kitItems = [
    { icon: Sprout, tone: "bg-[#E8EDE4]", iconColor: "text-[#47734C]", title: "Sachês de sementes", text: "O ponto de partida do seu cultivo." },
    { icon: Package, tone: "bg-[#F0E1D4]", iconColor: "text-[#C96A3B]", title: "1,2 L de substrato", text: "A base certa para o plantio." },
    { icon: Leaf, tone: "bg-[#E5D7BE]", iconColor: "text-[#173D2B]", title: "Vaso 13 × 11 cm", text: "Espaço para a planta se desenvolver." },
    { icon: Check, tone: "bg-[#DCE6D8]", iconColor: "text-[#47734C]", title: "3 ferramentas", text: "Praticidade em cada etapa do cuidado." },
  ];

  const steps = [
    { number: "01", icon: Package, title: "Prepare", text: "Organize os materiais e prepare o vaso para receber o substrato." },
    { number: "02", icon: Sprout, title: "Plante", text: "Siga as orientações adequadas às sementes que acompanham o seu kit." },
    { number: "03", icon: Droplets, title: "Cuide", text: "Observe a luz, a umidade e acompanhe o desenvolvimento da planta." },
  ];

  return (
    <div
      id="inicio"
      className="mc-sans min-h-screen bg-[#F8F4E9] text-[#24382B] antialiased selection:bg-[#D6E0D0]"
    >
      <FontStyles />

      {/* Barra superior */}
      <div className="bg-[#173D2B] px-4 py-2.5 text-center text-[0.7rem] font-medium uppercase tracking-[0.22em] text-[#F8F4E9]/90 sm:text-xs">
        Seu próximo hobby começa aqui <span className="mx-3 text-[#C96A3B]">✳</span> Cultive bons momentos
      </div>

      {/* Header */}
      <header
        className={`sticky top-0 z-40 border-b transition-all duration-300 ${
          scrolled
            ? "border-[#173D2B]/10 bg-[#F8F4E9]/90 shadow-[0_8px_30px_-18px_rgba(23,61,43,0.35)] backdrop-blur-xl"
            : "border-transparent bg-[#F8F4E9]"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
          <BrandMark />
          <nav className="hidden items-center gap-9 lg:flex" aria-label="Navegação principal">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="group relative text-sm font-medium text-[#173D2B]/75 transition hover:text-[#173D2B]"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#C96A3B] transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>
          <div className="hidden lg:block">
            <PrimaryButton onClick={buy} className="!px-6 !py-3">
              Quero meu kit
            </PrimaryButton>
          </div>
          <button
            className="rounded-full p-2 text-[#173D2B] lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-[#173D2B]/10 bg-[#F8F4E9] px-5 pb-5 pt-3 lg:hidden">
            <div className="flex flex-col">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    scrollToSection(item.id);
                    setMenuOpen(false);
                  }}
                  className="border-b border-[#173D2B]/10 py-4 text-left text-base text-[#173D2B]"
                >
                  {item.label}
                </button>
              ))}
              <PrimaryButton
                onClick={() => {
                  buy();
                  setMenuOpen(false);
                }}
                className="mt-5"
              >
                Comprar kit
              </PrimaryButton>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-[#E8EDE4]" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-[#F0E1D4]/60" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-10 sm:px-8 sm:pt-16 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:pb-28 lg:pt-20">
            <div className="max-w-xl">
              <Reveal>
                <SectionLabel>Kit de jardinagem para iniciantes</SectionLabel>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="mc-display text-[2.9rem] font-light leading-[1.02] tracking-[-0.03em] text-[#173D2B] sm:text-6xl lg:text-[4.6rem]">
                  Seu próximo hobby{" "}
                  <span className="italic text-[#C96A3B]">começa aqui.</span>
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="mt-7 max-w-lg text-base leading-8 text-[#526354] sm:text-lg">
                  Um kit completo e acolhedor para você descobrir o prazer de cultivar. Vaso, substrato, ferramentas e sementes reunidos para trazer mais natureza à sua rotina — no seu ritmo.
                </p>
              </Reveal>
              <Reveal delay={240}>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <PrimaryButton onClick={buy}>Quero começar a plantar</PrimaryButton>
                  <button
                    onClick={() => scrollToSection("o-kit")}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#173D2B]/20 px-8 py-4 text-sm font-semibold text-[#173D2B] transition hover:border-[#173D2B]/50 hover:bg-white/60"
                  >
                    Conheça o kit
                  </button>
                </div>
              </Reveal>
              <Reveal delay={320}>
                <div className="mt-10 flex items-center gap-8 border-t border-[#173D2B]/10 pt-6">
                  <div>
                    <p className="mc-display text-3xl font-light text-[#173D2B]">{PRICE}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#526354]">Preço anunciado</p>
                  </div>
                  <div className="h-10 w-px bg-[#173D2B]/15" />
                  <ul className="space-y-1.5 text-sm text-[#526354]">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#C96A3B]" /> Para iniciantes</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#C96A3B]" /> Ótimo para presentear</li>
                  </ul>
                </div>
              </Reveal>
            </div>

            <Reveal delay={200} className="relative">
              <div className="relative mx-auto max-w-xl lg:max-w-none">
                {/* moldura decorativa */}
                <div className="absolute -inset-3 translate-x-4 translate-y-4 rounded-[2.5rem] border border-[#C96A3B]/40 sm:-inset-4 sm:translate-x-6 sm:translate-y-6" />
                <div className="mc-grain relative overflow-hidden rounded-[2.25rem] bg-[#E8EDE4] shadow-[0_40px_80px_-30px_rgba(23,61,43,0.5)]">
                  <img
                    src={hero}
                    alt="Kit Iniciante ManjeriCo para jardinagem"
                    className="aspect-[4/5] h-full w-full object-cover sm:aspect-[5/5] lg:aspect-[4/5]"
                    loading="eager"
                    fetchPriority="high"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#173D2B]/35 via-transparent to-transparent" />
                </div>

                {/* selo flutuante */}
                <div className="absolute -left-3 bottom-10 rounded-2xl bg-[#F8F4E9] px-5 py-4 shadow-[0_20px_40px_-15px_rgba(23,61,43,0.45)] sm:-left-8">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#C96A3B]">Kit Iniciante</p>
                  <p className="mc-display mt-1 text-lg leading-tight text-[#173D2B]">Tudo para o<br />primeiro passo</p>
                </div>

                {/* selo circular */}
                <div className="absolute -right-2 top-8 grid h-24 w-24 place-items-center rounded-full bg-[#173D2B] text-center text-[#F8F4E9] shadow-xl sm:-right-6 sm:h-28 sm:w-28">
                  <div>
                    <Sprout className="mx-auto h-5 w-5 text-[#D98A60]" />
                    <p className="mt-1 text-[0.6rem] font-semibold uppercase leading-tight tracking-[0.16em]">Cultive<br />um novo<br />hobby</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Pilares */}
        <section className="border-y border-[#173D2B]/10 bg-white/60">
          <div className="mx-auto grid max-w-7xl gap-2 px-5 py-6 sm:px-8 md:grid-cols-3 md:divide-x md:divide-[#173D2B]/10">
            {pillars.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 100}>
                <div className="flex items-start gap-4 px-2 py-4 md:px-8">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#E8EDE4]">
                    <Icon className="h-5 w-5 text-[#173D2B]" />
                  </span>
                  <div>
                    <h3 className="mc-display text-lg text-[#173D2B]">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-[#526354]">{text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* O KIT */}
        <section id="o-kit" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:px-8 lg:py-32">
          <div className="grid items-start gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
            <div className="lg:sticky lg:top-32">
              <Reveal>
                <SectionLabel>O kit iniciante</SectionLabel>
                <h2 className="mc-display text-4xl font-light leading-[1.05] tracking-[-0.025em] text-[#173D2B] sm:text-5xl lg:text-[3.4rem]">
                  Tudo para dar o <span className="italic text-[#C96A3B]">primeiro passo.</span>
                </h2>
                <p className="mt-6 max-w-md leading-8 text-[#526354]">
                  Você não precisa saber tudo sobre jardinagem para começar. A ManjeriCo reúne os materiais essenciais em uma experiência simples, para que você aprenda fazendo.
                </p>
              </Reveal>

              <Reveal delay={120}>
                <div className="mt-9 rounded-3xl bg-[#173D2B] p-7 text-[#F8F4E9] sm:p-9">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[#D98A60]">Preço anunciado</p>
                  <p className="mc-display mt-2 text-5xl font-light">{PRICE}</p>
                  <p className="mt-2 text-xs text-white/60">Confirme o valor, o frete e o prazo diretamente no Mercado Livre.</p>
                  <PrimaryButton onClick={buy} tone="terracotta" className="mt-6 w-full sm:w-auto">
                    Ver produto no Mercado Livre
                  </PrimaryButton>
                </div>
              </Reveal>
            </div>

            <div>
              <div className="grid gap-4 sm:grid-cols-2">
                {kitItems.map(({ icon: Icon, tone, iconColor, title, text }, i) => (
                  <Reveal key={title} delay={i * 90}>
                    <div
                      className={`group flex min-h-52 flex-col justify-between rounded-[1.75rem] ${tone} p-7 transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_40px_-24px_rgba(23,61,43,0.45)]`}
                    >
                      <span className="grid h-12 w-12 place-items-center rounded-full bg-[#F8F4E9]/80">
                        <Icon className={`h-5 w-5 ${iconColor}`} />
                      </span>
                      <div>
                        <p className="mc-display text-xl text-[#173D2B]">{title}</p>
                        <p className="mt-1.5 text-sm leading-6 text-[#526354]">{text}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
              <Reveal delay={200}>
                <p className="mt-6 rounded-2xl border border-[#173D2B]/10 bg-white/60 px-5 py-4 text-xs leading-6 text-[#526354]">
                  Composição conforme descrição do anúncio. Confira fotos e detalhes no Mercado Livre para confirmar o que está incluído na versão vigente.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Faixa de citação */}
        <section className="bg-[#E8EDE4] px-5 py-20 sm:px-8 lg:py-24">
          <Reveal>
            <div className="mx-auto max-w-4xl text-center">
              <Leaf className="mx-auto h-6 w-6 text-[#C96A3B]" />
              <p className="mc-display mt-6 text-3xl font-light italic leading-snug text-[#173D2B] sm:text-4xl lg:text-5xl">
                “Cultivar é abrir espaço para algo novo crescer.”
              </p>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.26em] text-[#526354]">ManjeriCo</p>
            </div>
          </Reveal>
        </section>

        {/* COMO FUNCIONA */}
        <section id="como-funciona" className="relative scroll-mt-24 overflow-hidden bg-[#173D2B] px-5 py-24 text-[#F8F4E9] sm:px-8 lg:py-32">
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-40 -left-20 h-[28rem] w-[28rem] rounded-full border border-white/10" />
          <div className="relative mx-auto max-w-7xl">
            <Reveal>
              <div className="max-w-2xl">
                <SectionLabel light>Sem complicação</SectionLabel>
                <h2 className="mc-display text-4xl font-light leading-[1.05] tracking-[-0.025em] sm:text-5xl lg:text-[3.4rem]">
                  Três passos para começar a <span className="italic text-[#D98A60]">cultivar.</span>
                </h2>
                <p className="mt-6 max-w-xl leading-8 text-white/70">
                  A jardinagem se aprende aos poucos. Comece com o que você tem, siga as orientações das sementes e aproveite o processo.
                </p>
              </div>
            </Reveal>

            <div className="mt-16 grid gap-5 md:grid-cols-3">
              {steps.map((step, i) => (
                <Reveal key={step.number} delay={i * 120}>
                  <article className="group h-full rounded-[1.75rem] border border-white/15 bg-white/[0.04] p-8 transition duration-500 hover:border-[#D98A60]/60 hover:bg-white/[0.07] sm:p-10">
                    <div className="flex items-center justify-between">
                      <p className="mc-display text-5xl font-light italic text-[#D98A60]">{step.number}</p>
                      <step.icon className="h-6 w-6 text-white/50 transition group-hover:text-[#D98A60]" />
                    </div>
                    <h3 className="mc-display mt-10 text-2xl">{step.title}</h3>
                    <p className="mt-3 leading-7 text-white/70">{step.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal delay={200}>
              <div className="mt-12 grid gap-4 rounded-[1.75rem] border border-white/15 p-7 sm:grid-cols-3 sm:p-9">
                {[
                  { icon: Sun, title: "Luz", text: "Observe a luminosidade que cada espécie pede." },
                  { icon: Droplets, title: "Água", text: "Regue com atenção, sem excessos." },
                  { icon: Heart, title: "Paciência", text: "Plantas têm tempo próprio — aproveite o caminho." },
                ].map(({ icon: Icon, title, text }) => (
                  <div key={title} className="flex items-start gap-4">
                    <Icon className="mt-1 h-5 w-5 shrink-0 text-[#D98A60]" />
                    <div>
                      <p className="font-semibold">{title}</p>
                      <p className="mt-1 text-sm leading-6 text-white/65">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* PRESENTE */}
        <section id="presente" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:px-8 lg:py-32">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.25rem] bg-[#F0E1D4] px-7 py-14 sm:px-14 sm:py-16 lg:px-20">
              <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#F8F4E9]/60" />
              <div className="relative grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
                <div>
                  <SectionLabel>Um presente diferente</SectionLabel>
                  <h2 className="mc-display text-3xl font-light leading-[1.08] tracking-[-0.02em] text-[#173D2B] sm:text-5xl">
                    Presenteie alguém com um <span className="italic text-[#C96A3B]">novo hobby.</span>
                  </h2>
                  <p className="mt-5 max-w-xl leading-8 text-[#526354]">
                    Em vez de mais um objeto, uma experiência: para quem ama plantas, quer aprender algo novo ou merece um momento para desacelerar.
                  </p>
                  <div className="mt-8">
                    <PrimaryButton onClick={buy} tone="forest">Escolher o presente</PrimaryButton>
                  </div>
                </div>
                <ul className="space-y-4">
                  {[
                    { icon: Gift, text: "Para aniversários, datas especiais ou “só porque sim”" },
                    { icon: Sprout, text: "Não exige experiência prévia de quem recebe" },
                    { icon: Heart, text: "Uma lembrança que cresce com o tempo" },
                  ].map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-center gap-4 rounded-2xl bg-[#F8F4E9]/80 px-5 py-4 text-sm text-[#173D2B]">
                      <Icon className="h-5 w-5 shrink-0 text-[#C96A3B]" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </section>

        {/* SOBRE */}
        <section id="sobre" className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-24 sm:px-8 lg:pb-32">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <div>
                <SectionLabel>Sobre a ManjeriCo</SectionLabel>
                <h2 className="mc-display text-4xl font-light leading-[1.05] tracking-[-0.025em] text-[#173D2B] sm:text-5xl">
                  Mais natureza no seu <span className="italic text-[#C96A3B]">dia a dia.</span>
                </h2>
                <p className="mt-6 leading-8 text-[#526354]">
                  A ManjeriCo acredita que começar algo novo pode ser simples. Criamos uma forma acessível e acolhedora de se aproximar das plantas, aprender no próprio ritmo e descobrir o prazer de cuidar de algo vivo.
                </p>
                <p className="mt-4 leading-8 text-[#526354]">
                  Também acreditamos que experiências são presentes especiais — e que um novo hobby pode ser um ótimo começo.
                </p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Sprout, title: "Acessível", text: "Um começo simples, sem barreiras." },
                  { icon: Heart, title: "Acolhedora", text: "Pensada para quem está aprendendo." },
                  { icon: Leaf, title: "Natural", text: "Mais verde e calma na rotina." },
                  { icon: ShieldCheck, title: "Transparente", text: "Informações claras no anúncio." },
                ].map(({ icon: Icon, title, text }) => (
                  <div key={title} className="rounded-3xl border border-[#173D2B]/10 bg-white/70 p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <Icon className="h-6 w-6 text-[#C96A3B]" />
                    <p className="mc-display mt-5 text-lg text-[#173D2B]">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-[#526354]">{text}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* FAQ */}
        <section id="duvidas" className="scroll-mt-24 bg-white/60 px-5 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <div className="text-center">
                <SectionLabel>Dúvidas frequentes</SectionLabel>
                <h2 className="mc-display text-4xl font-light tracking-[-0.025em] text-[#173D2B] sm:text-5xl">
                  Antes de <span className="italic text-[#C96A3B]">começar.</span>
                </h2>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="mt-12 divide-y divide-[#173D2B]/10 border-y border-[#173D2B]/10">
                {faqs.map((faq, index) => {
                  const open = openFaq === index;
                  return (
                    <div key={faq.question}>
                      <button
                        className="flex w-full items-center justify-between gap-6 py-6 text-left"
                        onClick={() => setOpenFaq(open ? null : index)}
                        aria-expanded={open}
                      >
                        <span className="mc-display text-lg text-[#173D2B] sm:text-xl">{faq.question}</span>
                        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition ${open ? "border-[#C96A3B] bg-[#C96A3B] text-white" : "border-[#173D2B]/20 text-[#173D2B]"}`}>
                          <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
                        </span>
                      </button>
                      <div className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                        <div className="overflow-hidden">
                          <p className="max-w-2xl pb-6 pr-12 text-sm leading-7 text-[#526354]">{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="px-5 py-24 sm:px-8 lg:py-32">
          <Reveal>
            <div className="mc-grain relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-[#173D2B] px-7 py-16 text-center text-[#F8F4E9] sm:px-16 sm:py-24">
              <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full border border-white/10" />
              <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full border border-white/10" />
              <div className="relative">
                <Sprout className="mx-auto h-8 w-8 text-[#D98A60]" />
                <h2 className="mc-display mx-auto mt-6 max-w-3xl text-4xl font-light leading-[1.05] tracking-[-0.025em] sm:text-6xl">
                  Pronto para <span className="italic text-[#D98A60]">plantar</span> o primeiro passo?
                </h2>
                <p className="mx-auto mt-6 max-w-xl leading-8 text-white/70">
                  O Kit Iniciante ManjeriCo está disponível no Mercado Livre. Confira o anúncio e comece o seu novo hobby.
                </p>
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <PrimaryButton onClick={buy} tone="terracotta">Comprar por {PRICE}</PrimaryButton>
                  <button onClick={buy} className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 underline decoration-[#D98A60] decoration-2 underline-offset-8 transition hover:text-white">
                    Ver anúncio <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0F2B1E] px-5 py-14 text-[#F8F4E9] sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <BrandMark light />
            <p className="mc-display mt-5 max-w-xs text-lg italic text-white/70">Cultive um novo hobby.</p>
          </div>
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[#D98A60]">Explorar</p>
            <ul className="mt-5 space-y-3 text-sm text-white/75">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button onClick={() => scrollToSection(item.id)} className="transition hover:text-white">{item.label}</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[#D98A60]">Fale com a gente</p>
            <ul className="mt-5 space-y-3 text-sm text-white/75">
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition hover:text-white">
                  <Instagram className="h-4 w-4" /> Instagram
                </a>
              </li>
              <li>
                <button onClick={buy} className="inline-flex items-center gap-2 transition hover:text-white">
                  <Truck className="h-4 w-4" /> Comprar no Mercado Livre
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-6 text-xs leading-6 text-white/45">
          © {new Date().getFullYear()} ManjeriCo. Todos os direitos reservados. Informações de preço, disponibilidade e entrega devem ser confirmadas no anúncio.
        </div>
      </footer>

      {/* CTA fixo mobile */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#173D2B]/10 bg-[#F8F4E9]/95 p-3 backdrop-blur md:hidden">
        <button onClick={buy} className="flex w-full items-center justify-between rounded-full bg-[#173D2B] px-6 py-4 text-sm font-semibold text-white">
          <span>Comprar Kit Iniciante</span>
          <span className="flex items-center gap-2">{PRICE}<ArrowRight className="h-4 w-4" /></span>
        </button>
      </div>
      <div className="h-20 md:hidden" />
    </div>
  );
}