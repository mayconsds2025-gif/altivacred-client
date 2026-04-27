// src/pages/CentralAjuda.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  Search, 
  MessageCircle, 
  FileText, 
  CreditCard, 
  Phone, 
  ArrowRight 
} from "lucide-react";

import helpdesk from "../assets/helpdesk.jpg";

// --- COMPONENTE DE ACORDEÃO (ITEM INDIVIDUAL) ---
const AccordionItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-100 last:border-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left focus:outline-none group"
      >
        <span className={`text-lg font-medium transition-colors duration-300 ${isOpen ? "text-[#3B82F6]" : "text-[#0A2540] group-hover:text-[#3B82F6]"}`}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={`p-2 rounded-full ${isOpen ? "bg-blue-50 text-[#3B82F6]" : "bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-[#3B82F6]"}`}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-slate-500 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function CentralAjuda() {
  const faq = [
    {
      categoria: "Sobre o Crédito CLT",
      icon: <CreditCard className="w-6 h-6 text-[#3B82F6]" />,
      perguntas: [
        {
          q: "O que é o Crédito CLT?",
          a: "É uma modalidade exclusiva onde o trabalhador com carteira assinada pode antecipar parte do seu salário ou solicitar crédito pessoal usando o vínculo empregatício como garantia principal, garantindo taxas muito menores que o mercado tradicional."
        },
        {
          q: "Qual o valor mínimo e máximo que posso solicitar?",
          a: "O valor mínimo para contratação é de R$ 800,00. O limite máximo é calculado automaticamente pelo nosso sistema com base no seu salário e tempo de casa, podendo chegar a valores expressivos."
        },
        {
          q: "Preciso ter conta em um banco específico?",
          a: "Não! Somos livres de amarras. Você pode informar qualquer conta corrente ou poupança (em seu nome) para receber o PIX."
        }
      ]
    },
    {
      categoria: "Contratação e Documentos",
      icon: <FileText className="w-6 h-6 text-[#3B82F6]" />,
      perguntas: [
        {
          q: "Quanto tempo leva para o dinheiro cair na conta?",
          a: "Nossa tecnologia permite pagamentos ultrarrápidos. Na maioria dos casos, após a assinatura digital e aprovação final, o PIX é enviado em questão de minutos (dentro do horário bancário)."
        },
        {
          q: "Quais documentos preciso enviar?",
          a: "Para garantir sua segurança e agilidade, pedimos apenas: Documento oficial com foto (RG ou CNH) e, em alguns casos, um comprovante de residência simples."
        },
        {
          q: "Como assino o contrato?",
          a: "Tudo 100% digital! Você receberá um link seguro no seu celular (via SMS ou WhatsApp) para assinar eletronicamente, com validade jurídica, sem precisar imprimir nada."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans pb-20">
      
      {/* --- HERO SECTION --- */}
      <div className="relative w-full h-[400px] bg-[#0A2540] overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0">
          <img
            src={helpdesk}
            alt="Atendimento"
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A2540]/80 via-[#0A2540]/90 to-[#F8FAFC]" />
        </div>

        {/* Conteúdo do Hero */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#3B82F6] font-bold tracking-wider uppercase text-xs mb-4 bg-white/10 px-4 py-1 rounded-full backdrop-blur-sm border border-white/10"
          >
            Suporte Nitz Digital
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight"
          >
            Como podemos ajudar você?
          </motion.h1>

          {/* Barra de Busca Simulada */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-xl relative"
          >
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input 
              type="text" 
              placeholder="Busque por 'taxas', 'prazos' ou 'documentos'..." 
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white shadow-2xl border-none focus:ring-2 focus:ring-[#3B82F6] outline-none text-slate-600 placeholder-slate-400"
            />
          </motion.div>
        </div>
      </div>

      {/* --- CONTEÚDO FAQ --- */}
      <div className="max-w-4xl mx-auto px-6 -mt-10 relative z-20">
        
        {faq.map((cat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 mb-8 border border-slate-100"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100">
                {cat.icon}
              </div>
              <h2 className="text-2xl font-bold text-[#0A2540]">
                {cat.categoria}
              </h2>
            </div>

            <div>
              {cat.perguntas.map((item, i) => (
                <AccordionItem key={i} question={item.q} answer={item.a} />
              ))}
            </div>
          </motion.div>
        ))}

        {/* --- CARD DE ATENDIMENTO / CTA --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-br from-[#0A2540] to-[#1E3A8A] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl"
        >
          {/* Decorative Background Circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#3B82F6]/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium text-blue-200 mb-4">
                <MessageCircle className="w-4 h-4" />
                Fale com um especialista
              </div>
              <h2 className="text-3xl font-bold mb-2">Ainda tem dúvidas?</h2>
              <p className="text-slate-300 text-lg max-w-md">
                Nosso time de atendimento está pronto para te ajudar via WhatsApp agora mesmo.
              </p>
            </div>

            <a
              href="https://wa.me/5511977191411"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-green-900/20 transition-all duration-300 hover:scale-105 flex items-center gap-3"
            >
              <Phone className="w-5 h-5 fill-current" />
              <span>(11) 97719-1411</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>

      </div>
    </div>
  );
}