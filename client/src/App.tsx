import React, { useState } from "react";
import logo from "./assets/Logotipo.png";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Instagram,
  Leaf,
  Menu,
  Package,
  Sprout,
  Truck,
  X,
} from "lucide-react";

/**
 * ManjeriCo — landing page / vitrine de marca
 * Stack esperada: React + TypeScript + Tailwind CSS + lucide-react
 *
 * Antes de publicar:
 * 1. Troque MERCADO_LIVRE_URL pelo link real do anúncio.
 * 2. Confirme preço, composição do kit, prazo/frete e políticas.
 * 3. O logo oficial é importado de ./assets/Logotipo.png; mantenha o arquivo nesse caminho.
 */

const MERCADO_LIVRE_URL = "https://www.mercadolivre.com.br/";
const INSTAGRAM_URL = "https://www.instagram.com/";
const PRICE = "R$ 78,90";

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
    question: "Como acompanho a entrega?",
    answer:
      "Ao comprar pelo Mercado Livre, consulte o prazo estimado, as opções de frete e o acompanhamento do pedido diretamente na plataforma.",
  },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
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
        className="h-20 w-auto max-w-[300px] object-contain sm:h-24 sm:max-w-[340px]"
      />
    </a>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#C96A3B]">
      <span className="h-px w-7 bg-[#C96A3B]" />
      {children}
    </p>
  );
}

function ProductIllustration() {
  return (
    <div className="relative flex min-h-[390px] items-center justify-center overflow-hidden rounded-[2rem] bg-[#E8EDE4] p-8 sm:min-h-[490px]">
      <div className="absolute left-8 top-8 h-28 w-28 rounded-full bg-[#D6E0D0]" />
      <div className="absolute bottom-[-3rem] right-[-2rem] h-56 w-56 rounded-full bg-[#D6E0D0]" />
      <div className="relative z-10 w-full max-w-sm">
        <div className="absolute -left-2 top-10 h-24 w-24 rounded-full border border-[#173D2B]/15" />
        <div className="absolute -right-1 top-24 h-16 w-16 rounded-full border border-[#173D2B]/15" />
        <div className="relative mx-auto flex h-72 w-72 max-w-full flex-col items-center justify-end">
          <div className="absolute bottom-[6.8rem] left-1/2 h-40 w-1 -translate-x-1/2 bg-[#47734C]" />
          <div className="absolute bottom-[12.2rem] left-[5.1rem] h-14 w-24 rotate-[-32deg] rounded-[100%_0_100%_0] bg-[#47734C]" />
          <div className="absolute bottom-[14.1rem] right-[4.4rem] h-16 w-24 rotate-[18deg] rounded-[100%_0_100%_0] bg-[#5F8657]" />
          <div className="absolute bottom-[16rem] left-[7.3rem] h-12 w-20 rotate-[-28deg] rounded-[100%_0_100%_0] bg-[#6C925F]" />
          <div className="absolute bottom-[17rem] right-[7.2rem] h-12 w-16 rotate-[18deg] rounded-[100%_0_100%_0] bg-[#47734C]" />
          <div className="absolute bottom-[5.5rem] h-5 w-48 rounded-full bg-[#173D2B]/10 blur-md" />
          <div className="relative h-32 w-48 overflow-hidden rounded-b-[2.3rem] rounded-t-[1rem] bg-[#C96A3B] shadow-xl">
            <div className="absolute left-0 right-0 top-0 h-5 bg-[#B75B32]" />
            <div className="absolute inset-x-5 top-8 rounded-xl bg-[#F8F4E9] px-3 py-3 text-center">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-[#173D2B]">ManjeriCo</p>
              <p className="mt-1 text-[0.55rem] text-[#173D2B]/70">cultive um novo hobby</p>
            </div>
          </div>
        </div>
        <div className="relative mx-auto mt-[-1.25rem] w-56 rotate-[-4deg] rounded-lg border border-[#D8C9AE] bg-[#E7D9BE] p-4 shadow-lg">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.17em] text-[#173D2B]">Kit iniciante</p>
          <p className="mt-1 text-center text-[0.65rem] text-[#173D2B]/75">Jardinagem em casa</p>
        </div>
      </div>
      <span className="absolute bottom-6 left-6 rounded-full bg-[#F8F4E9]/90 px-4 py-2 text-xs font-semibold text-[#173D2B]">
        Um novo hobby, no seu ritmo
      </span>
    </div>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const buy = () => window.open(MERCADO_LIVRE_URL, "_blank", "noopener,noreferrer");

  const navItems = [
    { label: "O kit", id: "o-kit" },
    { label: "Como funciona", id: "como-funciona" },
    { label: "Sobre a ManjeriCo", id: "sobre" },
    { label: "Dúvidas", id: "duvidas" },
  ];

  return (
    <div id="inicio" className="min-h-screen bg-[#F8F4E9] font-sans text-[#24382B] selection:bg-[#D6E0D0]">
      <div className="bg-[#173D2B] px-4 py-2.5 text-center text-xs font-medium tracking-wide text-[#F8F4E9] sm:text-sm">
        Seu próximo hobby começa aqui <span className="mx-2 text-[#C96A3B]">✳</span> Cultive bons momentos
      </div>

      <header className="sticky top-0 z-40 border-b border-black/5 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8 sm:py-4">
          <BrandMark />
          <nav className="hidden items-center gap-7 md:flex" aria-label="Navegação principal">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => scrollToSection(item.id)} className="text-sm text-[#173D2B]/75 transition hover:text-[#C96A3B]">
                {item.label}
              </button>
            ))}
          </nav>
          <div className="hidden md:block">
            <button onClick={buy} className="inline-flex items-center gap-2 rounded-full bg-[#173D2B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#28563C]">
              Quero meu kit <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <button className="rounded-full p-2 md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}>
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-[#173D2B]/10 px-5 py-4 md:hidden">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <button key={item.id} onClick={() => { scrollToSection(item.id); setMenuOpen(false); }} className="rounded-xl px-3 py-3 text-left text-sm hover:bg-[#E8EDE4]">
                  {item.label}
                </button>
              ))}
              <button onClick={() => { buy(); setMenuOpen(false); }} className="mt-2 rounded-full bg-[#173D2B] px-5 py-3 text-sm font-semibold text-white">
                Comprar kit <ArrowRight className="ml-2 inline h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 sm:py-20 lg:grid-cols-[1fr_0.95fr] lg:gap-16 lg:py-24">
          <div className="max-w-xl">
            <SectionLabel>Jardinagem para começar</SectionLabel>
            <h1 className="text-5xl font-medium leading-[1.04] tracking-[-0.055em] text-[#173D2B] sm:text-6xl lg:text-7xl">
              Seu próximo hobby <span className="font-serif italic text-[#C96A3B]">começa aqui.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-[#526354] sm:text-lg sm:leading-8">
              Descubra o prazer de cultivar plantas com um kit pensado para quem está começando. Os primeiros passos para trazer mais natureza à sua rotina, em um só lugar.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button onClick={buy} className="inline-flex items-center justify-center gap-3 rounded-full bg-[#173D2B] px-7 py-4 font-semibold text-white shadow-lg shadow-[#173D2B]/10 transition hover:-translate-y-0.5 hover:bg-[#28563C]">
                Quero começar a plantar <ArrowRight className="h-5 w-5" />
              </button>
              <button onClick={() => scrollToSection("o-kit")} className="rounded-full border border-[#173D2B]/20 px-7 py-4 font-semibold text-[#173D2B] transition hover:bg-white/60">
                Conheça o kit
              </button>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm text-[#526354]">
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#C96A3B]" /> Para iniciantes</span>
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#C96A3B]" /> Materiais reunidos</span>
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#C96A3B]" /> Ótima ideia para presentear</span>
            </div>
          </div>
          <ProductIllustration />
        </section>

        <section className="border-y border-[#173D2B]/10 bg-white/55">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 py-7 sm:grid-cols-3 sm:px-8">
            {[
              { icon: Sprout, title: "Comece do zero", text: "Uma experiência pensada para quem está dando os primeiros passos." },
              { icon: Package, title: "Tudo mais simples", text: "Os principais materiais reunidos em um único kit." },
              { icon: Leaf, title: "Cultive seu tempo", text: "Uma pausa na rotina para cuidar, aprender e acompanhar o crescimento." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-4 px-2 py-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#E8EDE4]"><Icon className="h-5 w-5 text-[#173D2B]" /></span>
                <div><h3 className="font-semibold text-[#173D2B]">{title}</h3><p className="mt-1 text-sm leading-6 text-[#526354]">{text}</p></div>
              </div>
            ))}
          </div>
        </section>

        <section id="o-kit" className="scroll-mt-28 mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:py-28">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex min-h-44 flex-col justify-between rounded-3xl bg-[#E8EDE4] p-5 sm:min-h-52 sm:p-7">
                <Sprout className="h-7 w-7 text-[#47734C]" />
                <div><p className="font-semibold text-[#173D2B]">Sementes</p><p className="mt-1 text-sm text-[#526354]">O começo de algo novo.</p></div>
              </div>
              <div className="flex min-h-44 flex-col justify-between rounded-3xl bg-[#F0E1D4] p-5 sm:min-h-52 sm:p-7">
                <Package className="h-7 w-7 text-[#C96A3B]" />
                <div><p className="font-semibold text-[#173D2B]">Substrato</p><p className="mt-1 text-sm text-[#526354]">A base para o plantio.</p></div>
              </div>
              <div className="flex min-h-44 flex-col justify-between rounded-3xl bg-[#E5D7BE] p-5 sm:min-h-52 sm:p-7">
                <Leaf className="h-7 w-7 text-[#173D2B]" />
                <div><p className="font-semibold text-[#173D2B]">Vaso</p><p className="mt-1 text-sm text-[#526354]">Um espaço para cultivar.</p></div>
              </div>
              <div className="flex min-h-44 flex-col justify-between rounded-3xl bg-[#DCE6D8] p-5 sm:min-h-52 sm:p-7">
                <Check className="h-7 w-7 text-[#47734C]" />
                <div><p className="font-semibold text-[#173D2B]">Ferramentas</p><p className="mt-1 text-sm text-[#526354]">Mais praticidade no cuidado.</p></div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <SectionLabel>O kit iniciante</SectionLabel>
            <h2 className="text-4xl font-medium leading-tight tracking-[-0.045em] text-[#173D2B] sm:text-5xl">Tudo para dar o primeiro passo.</h2>
            <p className="mt-5 leading-7 text-[#526354]">
              Você não precisa saber tudo sobre jardinagem para começar. A ManjeriCo reúne os materiais essenciais em uma experiência simples, para que você possa aprender fazendo.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-[#344B39]">
              {["1 vaso de aproximadamente 13 × 11 cm", "1,2 litro de substrato", "3 ferramentas de jardinagem", "Sachês de sementes"].map((item) => (
                <li key={item} className="flex items-center gap-3"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#DCE6D8]"><Check className="h-3.5 w-3.5" /></span>{item}</li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-end gap-4">
              <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#526354]">Preço anunciado</p><p className="mt-1 text-3xl font-semibold tracking-tight text-[#173D2B]">{PRICE}</p><p className="mt-1 text-xs text-[#526354]">Confirme o valor e o frete no Mercado Livre.</p></div>
              <button onClick={buy} className="inline-flex items-center gap-2 rounded-full bg-[#C96A3B] px-6 py-4 font-semibold text-white transition hover:bg-[#B75B32]">Ver produto <ArrowRight className="h-4 w-4" /></button>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="scroll-mt-28 bg-[#173D2B] px-5 py-20 text-[#F8F4E9] sm:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <SectionLabel>Sem complicação</SectionLabel>
              <h2 className="text-4xl font-medium leading-tight tracking-[-0.045em] sm:text-5xl">Três passos para começar a cultivar.</h2>
              <p className="mt-5 leading-7 text-white/70">A jardinagem se aprende aos poucos. Comece com o que você tem, siga as orientações das sementes e aproveite o processo.</p>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {[
                { number: "01", title: "Prepare", text: "Organize os materiais e prepare o vaso para receber o substrato." },
                { number: "02", title: "Plante", text: "Siga as orientações adequadas às sementes que acompanham seu kit." },
                { number: "03", title: "Cuide", text: "Observe a luz, a umidade e acompanhe o desenvolvimento da planta." },
              ].map((step) => (
                <article key={step.number} className="rounded-3xl border border-white/15 bg-white/[0.04] p-7 sm:p-8">
                  <p className="font-serif text-4xl italic text-[#D98A60]">{step.number}</p>
                  <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-3 leading-7 text-white/70">{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="sobre" className="scroll-mt-28 mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1fr] lg:py-28">
          <div className="rounded-[2rem] bg-[#F0E1D4] p-8 sm:p-12">
            <p className="font-serif text-3xl italic leading-snug text-[#173D2B] sm:text-4xl">“Cultivar é abrir espaço para algo novo crescer.”</p>
            <div className="mt-8 h-px w-16 bg-[#C96A3B]" />
            <p className="mt-4 text-sm text-[#526354]">ManjeriCo — cultive um novo hobby.</p>
          </div>
          <div>
            <SectionLabel>Sobre a ManjeriCo</SectionLabel>
            <h2 className="text-4xl font-medium leading-tight tracking-[-0.045em] text-[#173D2B] sm:text-5xl">Mais natureza no seu dia a dia.</h2>
            <p className="mt-5 leading-7 text-[#526354]">A ManjeriCo acredita que começar algo novo pode ser simples. Criamos uma forma acessível e acolhedora de se aproximar das plantas, aprender no próprio ritmo e descobrir o prazer de cuidar de algo vivo.</p>
            <p className="mt-4 leading-7 text-[#526354]">Também acreditamos que experiências são presentes especiais — e que um novo hobby pode ser um ótimo começo.</p>
            <button onClick={buy} className="mt-7 inline-flex items-center gap-2 font-semibold text-[#173D2B] underline decoration-[#C96A3B] decoration-2 underline-offset-4 hover:text-[#C96A3B]">Comece com o kit <ArrowRight className="h-4 w-4" /></button>
          </div>
        </section>

        <section className="bg-[#E8EDE4] px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-[2rem] bg-[#F8F4E9] p-8 sm:p-12 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <SectionLabel>Um presente diferente</SectionLabel>
              <h2 className="text-3xl font-medium leading-tight tracking-[-0.04em] text-[#173D2B] sm:text-4xl">Presenteie alguém com um novo hobby.</h2>
              <p className="mt-4 max-w-xl leading-7 text-[#526354]">Para quem ama plantas, quer aprender algo novo ou merece um momento para desacelerar.</p>
            </div>
            <button onClick={buy} className="shrink-0 inline-flex items-center gap-3 rounded-full bg-[#C96A3B] px-7 py-4 font-semibold text-white transition hover:bg-[#B75B32]">Escolher o presente <ArrowRight className="h-5 w-5" /></button>
          </div>
        </section>

        <section id="duvidas" className="scroll-mt-28 mx-auto max-w-4xl px-5 py-20 sm:px-8 lg:py-24">
          <div className="text-center">
            <SectionLabel>Dúvidas frequentes</SectionLabel>
            <h2 className="text-4xl font-medium tracking-[-0.045em] text-[#173D2B] sm:text-5xl">Antes de começar.</h2>
          </div>
          <div className="mt-10 divide-y divide-[#173D2B]/10 border-y border-[#173D2B]/10">
            {faqs.map((faq, index) => (
              <div key={faq.question}>
                <button className="flex w-full items-center justify-between gap-4 py-5 text-left font-semibold text-[#173D2B]" onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}>
                  {faq.question}
                  <ChevronDown className={`h-5 w-5 shrink-0 transition-transform ${openFaq === index ? "rotate-180" : ""}`} />
                </button>
                {openFaq === index && <p className="max-w-3xl pb-5 pr-8 text-sm leading-7 text-[#526354]">{faq.answer}</p>}
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <p className="text-sm text-[#526354]">Ficou com alguma dúvida? Consulte as informações do anúncio.</p>
            <button onClick={buy} className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#173D2B] px-6 py-3.5 font-semibold text-white transition hover:bg-[#28563C]">Ver anúncio no Mercado Livre <ArrowRight className="h-4 w-4" /></button>
          </div>
        </section>
      </main>

      <footer className="bg-[#173D2B] px-5 py-10 text-[#F8F4E9] sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div><BrandMark light /><p className="mt-3 text-sm text-white/60">Cultive um novo hobby.</p></div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/75">
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-white"><Instagram className="h-4 w-4" /> Instagram</a>
            <button onClick={buy} className="inline-flex items-center gap-2 hover:text-white"><Truck className="h-4 w-4" /> Comprar no Mercado Livre</button>
            <a href="#duvidas" className="hover:text-white">Dúvidas frequentes</a>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-7xl border-t border-white/15 pt-5 text-xs leading-6 text-white/50">
          © {new Date().getFullYear()} ManjeriCo. Todos os direitos reservados. Informações de preço, disponibilidade e entrega devem ser confirmadas no anúncio.
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#173D2B]/10 bg-[#F8F4E9]/95 p-3 backdrop-blur md:hidden">
        <button onClick={buy} className="flex w-full items-center justify-between rounded-full bg-[#173D2B] px-5 py-3.5 text-sm font-semibold text-white">
          <span>Comprar Kit Iniciante</span><span className="flex items-center gap-2">{PRICE}<ArrowRight className="h-4 w-4" /></span>
        </button>
      </div>
      <div className="h-20 md:hidden" />
    </div>
  );
}
