import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Wallet,
  Percent,
  Clock3,
  CheckCircle2,
  Users,
  Banknote,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../firebaseConfig";

// Substitua por uma imagem que remeta ao público CLT (trabalho, carteira assinada, cotidiano)
import hero from "../assets/hero.jpg";

const HomePage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Login Google
  const handleGoogleLogin = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      login({
        nome: user.displayName || "Usuário Google",
        email: user.email || "",
        foto: user.photoURL || "",
      });

      const from = location.state?.from || "/usuario/dashboard";
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Erro no login com Google:", error);
    }
  };

  const beneficios = [
    {
      icon: <Wallet className="w-7 h-7" />,
      title: "Desconto direto em folha",
      desc: "As parcelas saem automaticamente do seu salário. Sem boleto, sem esquecer de pagar.",
    },
    {
      icon: <Percent className="w-7 h-7" />,
      title: "Taxas menores",
      desc: "Por ser descontado em folha, o risco é menor para o banco — e isso significa juros mais baixos pra você.",
    },
    {
      icon: <CheckCircle2 className="w-7 h-7" />,
      title: "Aprovação facilitada",
      desc: "Análise simplificada, inclusive para quem está com o nome negativado.",
    },
    {
      icon: <Clock3 className="w-7 h-7" />,
      title: "Dinheiro rápido na conta",
      desc: "Simulação em minutos e liberação do crédito sem enrolação.",
    },
  ];

  const etapas = [
    {
      title: "Simule online",
      desc: "Preencha alguns dados básicos e veja quanto você pode contratar.",
    },
    {
      title: "Compare as condições",
      desc: "Mostramos as opções disponíveis para o seu perfil, sem letra miúda.",
    },
    {
      title: "Envie seus dados",
      desc: "Confirmação simples, direto pelo celular ou computador.",
    },
    {
      title: "Receba na conta",
      desc: "Assim que aprovado, o valor cai na sua conta — sem burocracia.",
    },
  ];

  const depoimentos = [
    {
      nome: "Camila R.",
      cargo: "Auxiliar administrativa",
      texto:
        "Simulei em poucos minutos e a parcela coube certinho no orçamento. Não esperava que fosse tão rápido.",
    },
    {
      nome: "Diego S.",
      cargo: "Técnico de manutenção",
      texto:
        "Já tinha tentado em outro lugar e não consegui. Aqui a aprovação saiu no mesmo dia.",
    },
    {
      nome: "Patrícia M.",
      cargo: "Vendedora CLT",
      texto:
        "Gostei de entender exatamente quanto ia pagar por mês antes de fechar. Ficou tudo bem claro.",
    },
  ];

  const faqs = [
    {
      pergunta: "O que é o crédito CLT?",
      resposta:
        "É uma modalidade de empréstimo voltada para quem trabalha com carteira assinada. As parcelas são descontadas direto do salário, o que costuma garantir taxas de juros menores do que as de um empréstimo pessoal comum.",
    },
    {
      pergunta: "Posso simular mesmo com o nome negativado?",
      resposta:
        "Sim. Como o desconto acontece em folha, a análise de crédito costuma ser mais flexível — muitos clientes negativados conseguem aprovação.",
    },
    {
      pergunta: "Quanto custa para simular?",
      resposta:
        "Nada. A simulação é gratuita e não tem qualquer compromisso de contratação.",
    },
    {
      pergunta: "Quanto tempo leva para o dinheiro cair na conta?",
      resposta:
        "Depois da aprovação, a liberação costuma acontecer em poucos dias úteis, direto na sua conta bancária.",
    },
    {
      pergunta: "Meus dados estão seguros?",
      resposta:
        "Sim. Seus dados são usados apenas para montar a sua simulação e são tratados conforme a LGPD, sem compartilhamento indevido com terceiros.",
    },
  ];

  return (
    <main className="bg-white text-[#1F2937] font-sans overflow-x-hidden">
      {/* HERO */}
      <section className="relative min-h-[80vh] flex items-center text-white overflow-hidden">
        <img
          src={hero}
          alt="Trabalhador CLT no dia a dia"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div
          className="
            absolute inset-0
            bg-gradient-to-r
            from-[#065f46]/90
            via-[#047857]/70
            to-[#065f46]/40
          "
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col items-start justify-center py-24 md:py-28">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-7 max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-sm font-medium px-4 py-1.5 rounded-full">
              Crédito consignado para quem tem carteira assinada
            </span>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)]">
              Seu salário garante
              <br />
              <span className="text-[#D1FAE5]">o crédito que você precisa</span>
            </h1>

            <p className="text-gray-100 text-lg md:text-xl max-w-xl leading-relaxed">
              Simule seu Empréstimo CLT em poucos minutos, com parcelas descontadas
              direto da folha e taxas pensadas pra caber no seu bolso.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-1">
              <button
                onClick={handleGoogleLogin}
                className="inline-flex items-center justify-center gap-2 bg-white text-[#047857] font-bold py-4 px-10 rounded-full shadow-xl hover:bg-gray-50 hover:shadow-2xl transition-all duration-300 text-lg"
              >
                Simular agora
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[#D1FAE5] text-sm pt-1">
              Simulação gratuita. Sem consulta que afete seu score.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAIXA DE CONFIANÇA */}
      <div className="w-full bg-[#ECFDF5] border-b border-[#A7F3D0]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
          {[
            { icon: <ShieldCheck className="w-5 h-5" />, text: "Processo 100% online e seguro" },
            { icon: <Banknote className="w-5 h-5" />, text: "Sem nenhuma taxa para simular" },
            { icon: <Users className="w-5 h-5" />, text: "Atendimento humano, sem robôs" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-center sm:justify-start gap-2 text-[#065f46]">
              {item.icon}
              <span className="text-sm font-semibold">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* BENEFÍCIOS */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#065f46] mb-5">
              Por que o crédito CLT compensa mais
            </h2>
            <p className="text-[#4B5563] text-lg leading-relaxed">
              Quem tem carteira assinada tem acesso a condições que o crédito
              pessoal comum não oferece.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {beneficios.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-[#F0FDF4] p-7 rounded-2xl border border-[#A7F3D0] hover:border-[#6EE7B7] hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-white text-[#047857] flex items-center justify-center mb-5 shadow-sm">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-[#065f46] mb-2">
                  {item.title}
                </h3>
                <p className="text-[#4B5563] text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-5">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6 md:sticky md:top-28"
              >
                <span className="inline-block bg-[#065f46] text-white text-xs font-bold px-4 py-1.5 rounded-full">
                  Como funciona
                </span>

                <h2 className="text-3xl md:text-4xl font-bold text-[#065f46]">
                  Do celular até a conta, em poucos passos
                </h2>

                <p className="text-[#4B5563] leading-relaxed text-lg">
                  Sem filas, sem papelada. Todo o processo acontece de forma
                  digital, com um time pronto pra te ajudar se precisar.
                </p>

                <button
                  onClick={handleGoogleLogin}
                  className="inline-flex items-center gap-2 bg-[#047857] text-white font-bold py-3.5 px-8 rounded-full shadow-lg hover:bg-[#065f46] transition-all duration-300"
                >
                  Começar simulação
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            </div>

            <div className="md:col-span-7">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative pl-8 md:pl-12"
              >
                <div className="absolute left-4 top-2 bottom-2 w-1 bg-gradient-to-b from-[#10B981] to-[#6EE7B7] rounded-full hidden md:block" />

                <ol className="space-y-6">
                  {etapas.map((step, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.08 }}
                      className="relative bg-white rounded-xl p-6 border-l-4 border-[#10B981] shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="absolute -left-11 top-7 hidden md:flex items-center">
                        <div className="w-9 h-9 rounded-full bg-[#10B981] text-white flex items-center justify-center font-bold text-sm shadow-md">
                          {i + 1}
                        </div>
                      </div>
                      <h4 className="text-[#065f46] font-bold mb-2 text-lg">
                        {step.title}
                      </h4>
                      <p className="text-[#4B5563] text-sm leading-relaxed">
                        {step.desc}
                      </p>
                    </motion.li>
                  ))}
                </ol>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* SEGURANÇA E TRANSPARÊNCIA */}
      <section className="bg-[#ECFDF5] py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-[#065f46] text-center mb-14"
          >
            Transparência do início ao fim
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <ShieldCheck className="w-11 h-11" />,
                title: "Correspondente regulamentado",
                desc: "Operamos de acordo com as normas do Banco Central para intermediação de crédito.",
              },
              {
                icon: <Percent className="w-11 h-11" />,
                title: "Sem taxa escondida",
                desc: "Você vê exatamente quanto vai pagar por mês antes de confirmar qualquer coisa.",
              },
              {
                icon: <Users className="w-11 h-11" />,
                title: "Suporte de verdade",
                desc: "Time disponível para tirar dúvidas antes, durante e depois da contratação.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-md text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#D1FAE5] text-[#047857] rounded-full mb-5">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-[#065f46] mb-3">
                  {item.title}
                </h3>
                <p className="text-[#6B7280] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl font-bold text-[#065f46] mb-4">
              Quem simulou, recomenda
            </h2>
            <p className="text-[#6B7280] text-lg max-w-xl mx-auto">
              Histórias reais de quem usou o crédito CLT para respirar mais no
              fim do mês.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {depoimentos.map((dep, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-[#F9FAFB] p-7 rounded-2xl border border-[#E5E7EB]"
              >
                <p className="text-[#374151] leading-relaxed mb-5">
                  “{dep.texto}”
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
                    {dep.nome[0]}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#065f46]">
                      {dep.nome}
                    </div>
                    <div className="text-xs text-[#6B7280]">{dep.cargo}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-[#F9FAFB]">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-[#065f46] text-center mb-12"
          >
            Dúvidas frequentes
          </motion.h2>

          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between text-left px-6 py-5"
                  >
                    <span className="font-semibold text-[#1F2937]">
                      {faq.pergunta}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-[#047857] shrink-0 ml-4"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 text-[#4B5563] leading-relaxed">
                          {faq.resposta}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-gradient-to-br from-[#065f46] to-[#047857] py-24 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Vamos ver quanto você pode contratar?
          </motion.h2>

          <p className="text-[#D1FAE5] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Leva menos de dois minutos e não compromete o seu score. Você só
            contrata se a proposta fizer sentido pra você.
          </p>

          <button
            onClick={handleGoogleLogin}
            className="bg-white text-[#047857] font-bold py-4 px-12 rounded-full shadow-2xl hover:bg-gray-50 hover:scale-105 transition-all duration-300 text-lg inline-flex items-center gap-2"
          >
            Simular meu crédito CLT
            <ArrowRight className="w-5 h-5" />
          </button>

          <p className="text-[#A7F3D0] text-sm mt-6">
            Simulação gratuita, sem compromisso.
          </p>
        </div>
      </section>
    </main>
  );
};

export default HomePage;