import React from "react";
import { motion, Variants } from "framer-motion";
import { 
  TrendingDown, 
  ShieldCheck, 
  Smartphone, 
  CheckCircle2, 
  ArrowRight, 
  Briefcase, 
  Wallet, 
  Car, 
  CreditCard,
  Zap,
  Lock,
  Info,
  Banknote,
  PieChart
} from "lucide-react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../firebaseConfig";

// Asset (Reutilizando o hero da Home para manter consistência)
import heroBg from "../assets/hero.jpg"; 

// --- VARIANTES DE ANIMAÇÃO ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const PaginaProdutos: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // 🔹 Fluxo de Autenticação Unificado (Baseado na Home.tsx)
  const handleSimulationAction = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      login({
        nome: user.displayName || "Usuário",
        email: user.email || "",
        foto: user.photoURL || "",
      });

      navigate("/usuario/dashboard");
    } catch (error) {
      console.error("Erro no login social:", error);
    }
  };

  return (
    <main className="bg-[#F8FAFC] text-[#0A2540] font-sans selection:bg-[#3B82F6] selection:text-white">
      
      {/* --- HERO SECTION PREMIUM --- */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="Finanças Nitz" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A2540] via-[#0A2540]/90 to-transparent" />
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
              <Zap className="w-4 h-4" />
              Soluções Digitais Imediatas
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
              Crédito inteligente <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-cyan-400">para o seu momento.</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl text-slate-300 mb-10 leading-relaxed border-l-4 border-[#3B82F6] pl-6">
              Explore nossa vitrine de produtos financeiros com taxas reduzidas e contratação 100% digital.
            </motion.p>
            <motion.button 
              onClick={handleSimulationAction}
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl transition-all hover:-translate-y-1 flex items-center gap-2"
            >
              Simular Agora <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* --- MENU RÁPIDO (STICKY NAV SUTIL) --- */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50 hidden md:block">
        <div className="container mx-auto px-6 py-4 flex justify-center gap-8 font-semibold text-sm text-slate-500">
          <a href="#clt" className="hover:text-[#3B82F6] transition-colors">Consignado CLT</a>
          <a href="#fgts" className="hover:text-[#3B82F6] transition-colors">Saque FGTS</a>
          <a href="#veiculo" className="hover:text-[#3B82F6] transition-colors">Garantia Veículo</a>
          <a href="#cartao" className="hover:text-[#3B82F6] transition-colors">Limite Cartão</a>
        </div>
      </div>

      {/* --- SEÇÃO 1: CONSIGNADO CLT --- */}
      <section id="clt" className="py-24 bg-white border-b border-slate-100">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#3B82F6] mb-6">
                <Briefcase className="w-8 h-8" />
              </div>
              <h2 className="text-4xl font-bold mb-6">Crédito Consignado CLT</h2>
              <p className="text-slate-500 text-lg mb-8">A modalidade com as menores taxas do mercado para quem trabalha de carteira assinada. O desconto é feito diretamente na sua folha de pagamento.</p>
              
              <div className="bg-[#F8FAFC] p-8 rounded-[32px] border border-slate-100 mb-8">
                <h4 className="font-bold mb-4 flex items-center gap-2"><Info className="w-5 h-5 text-blue-500" /> Regras Principais:</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <li className="flex items-start gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" /> Vínculo CLT ativo obrigatório</li>
                  <li className="flex items-start gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" /> Margem máxima de 35% do líquido</li>
                  <li className="flex items-start gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" /> Até 9 contratos simultâneos</li>
                  <li className="flex items-start gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" /> Quitação via FGTS em rescisão</li>
                </ul>
              </div>
              <button onClick={handleSimulationAction} className="w-full md:w-auto px-8 py-4 bg-[#0A2540] text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                Solicitar Consignado <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-600 h-64 rounded-3xl p-8 text-white flex flex-col justify-end">
                <p className="text-4xl font-bold">5x</p>
                <p className="text-sm opacity-80 uppercase tracking-wider">Menores Taxas</p>
              </div>
              <div className="bg-slate-100 h-64 rounded-3xl p-8 flex flex-col justify-end">
                <p className="text-4xl font-bold text-[#0A2540]">PIX</p>
                <p className="text-sm text-slate-500 uppercase tracking-wider">Liberação Imediata</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SEÇÃO 2: SAQUE ANIVERSÁRIO FGTS --- */}
      <section id="fgts" className="py-24 bg-[#F8FAFC]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative">
                <div className="absolute -inset-4 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="relative bg-white p-10 rounded-[40px] shadow-2xl">
                    <PieChart className="w-12 h-12 text-blue-500 mb-6" />
                    <h3 className="text-2xl font-bold mb-4">Seu saldo virando fôlego.</h3>
                    <p className="text-slate-500 mb-6">Antecipe as parcelas do seu Saque Aniversário sem boletos mensais.</p>
                    <div className="space-y-4">
                        <div className="flex justify-between p-4 bg-slate-50 rounded-xl">
                            <span className="font-semibold">Antecipação</span>
                            <span className="text-blue-600 font-bold">Até 10 anos</span>
                        </div>
                        <div className="flex justify-between p-4 bg-slate-50 rounded-xl">
                            <span className="font-semibold">Mínimo Saldo</span>
                            <span className="text-blue-600 font-bold">R$ 300,00</span>
                        </div>
                    </div>
                </div>
            </div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-1 md:order-2">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <Wallet className="w-8 h-8" />
              </div>
              <h2 className="text-4xl font-bold mb-6">Saque Aniversário FGTS</h2>
              <p className="text-slate-500 text-lg mb-8">Dinheiro na mão sem comprometer seu salário mensal. Ideal para quem tem saldo no FGTS e precisa de crédito rápido, mesmo estando negativado.</p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Ativar modalidade Saque-Aniversário no app FGTS</li>
                <li className="flex items-center gap-3 font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Autorizar os bancos parceiros da Nitz</li>
                <li className="flex items-center gap-3 font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Sem parcelas mensais (desconto anual do saldo)</li>
              </ul>
              <button onClick={handleSimulationAction} className="px-10 py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:shadow-blue-200 transition-all">
                Antecipar meu FGTS
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- SEÇÃO 3: GARANTIA DE VEÍCULO --- */}
      <section id="veiculo" className="py-24 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="bg-[#0A2540] rounded-[48px] p-8 md:p-16 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20" />
            
            <div className="grid md:grid-cols-2 gap-12 relative z-10">
              <div>
                <Car className="w-16 h-16 text-blue-400 mb-8" />
                <h2 className="text-4xl font-bold mb-6">Empréstimo com Garantia de Veículo</h2>
                <p className="text-slate-300 text-lg mb-8">Use seu carro para conseguir as melhores taxas de juros, prazos de até 60 meses e continue dirigindo seu veículo normalmente.</p>
                
                <div className="space-y-6 mb-10">
                  <div className="flex gap-4 p-5 bg-white/5 rounded-2xl border border-white/10">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">1</div>
                    <div>
                      <h4 className="font-bold">Veículo em seu nome</h4>
                      <p className="text-sm text-slate-400">Deve estar quitado ou com poucas parcelas restantes.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-5 bg-white/5 rounded-2xl border border-white/10">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">2</div>
                    <div>
                      <h4 className="font-bold">Valor do Crédito</h4>
                      <p className="text-sm text-slate-400">Liberamos até 90% do valor da tabela FIPE do seu bem.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <div className="bg-white text-[#0A2540] p-10 rounded-[32px]">
                   <h3 className="text-2xl font-bold mb-6">Detalhes Técnicos</h3>
                   <ul className="space-y-4 mb-8">
                      <li className="flex justify-between border-b border-slate-100 pb-2"><span>Taxas a partir de</span> <strong>1.49% a.m.</strong></li>
                      <li className="flex justify-between border-b border-slate-100 pb-2"><span>Prazo máximo</span> <strong>60 meses</strong></li>
                      <li className="flex justify-between border-b border-slate-100 pb-2"><span>Veículos aceitos</span> <strong>Até 15 anos de uso</strong></li>
                   </ul>
                   <button onClick={handleSimulationAction} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
                     Simular com meu Veículo
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SEÇÃO 4: SAQUE LIMITE CARTÃO --- */}
      <section id="cartao" className="py-24 bg-[#F8FAFC]">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto mb-16">
            <div className="inline-block p-4 bg-emerald-50 rounded-2xl text-emerald-600 mb-6">
              <CreditCard className="w-10 h-10" />
            </div>
            <h2 className="text-4xl font-bold mb-6">Saque do Limite do Cartão de Crédito</h2>
            <p className="text-slate-500 text-lg">Precisa de dinheiro agora? Transforme o limite do seu cartão em saldo na conta via PIX. Simples, rápido e sem burocracia de análise de score.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
             {[
               { t: "Pagamento em 12x", d: "Parcele o valor do saque em até 12 vezes na sua fatura." },
               { t: "Dinheiro na hora", d: "Após aprovação, o valor cai via PIX em poucos minutos." },
               { t: "Sem Burocracia", d: "Não consultamos SPC/Serasa para esta modalidade." }
             ].map((box, i) => (
               <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h4 className="font-bold text-xl mb-3">{box.t}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{box.d}</p>
               </div>
             ))}
          </div>

          <button onClick={handleSimulationAction} className="mt-12 px-12 py-5 bg-[#0A2540] text-white rounded-full font-bold text-lg hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 mx-auto">
            Sacar meu Limite <Banknote className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* --- SEGURANÇA E TRANSPARÊNCIA (FINTECH STYLE) --- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16 p-10 md:p-20 bg-slate-50 rounded-[60px] border border-slate-100">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">Segurança Nitz Digital</h2>
              <p className="text-slate-500 text-lg mb-8">Somos uma plataforma robusta que segue rigorosamente as normas do Banco Central. Sua tranquilidade é o nosso maior ativo.</p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-[#0A2540] font-semibold">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-emerald-600" /></div>
                  Criptografia de ponta a ponta (SSL)
                </div>
                <div className="flex items-center gap-4 text-[#0A2540] font-semibold">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-emerald-600" /></div>
                  Parceiros homologados pelo BACEN
                </div>
                <div className="flex items-center gap-4 text-[#0A2540] font-semibold">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-emerald-600" /></div>
                  Proteção de dados total (LGPD)
                </div>
              </div>
            </div>
            <div className="md:w-1/2 bg-[#0A2540] p-10 rounded-[40px] text-white text-center relative overflow-hidden">
                <Lock className="w-16 h-16 text-blue-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4">Aviso de Golpe</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  A Nitz Digital <strong>nunca cobra taxas antecipadas</strong> ou depósitos para liberação de crédito. 
                  Toda a nossa remuneração vem diretamente das instituições bancárias parceiras.
                </p>
                <div className="bg-white/10 py-3 px-6 rounded-full inline-block text-xs font-bold uppercase tracking-widest">
                  Transparência é Tudo
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA FINAL --- */}
      <section className="py-24 bg-[#3B82F6] text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-8">O próximo passo é agora.</h2>
          <p className="text-blue-100 text-xl max-w-2xl mx-auto mb-12">Escolha a sua modalidade e veja como é fácil ter o crédito que você merece com a Nitz Digital.</p>
          <button 
            onClick={handleSimulationAction}
            className="px-16 py-6 bg-white text-blue-600 rounded-full font-black text-xl shadow-2xl hover:scale-105 transition-transform"
          >
            Começar Simulação
          </button>
        </div>
      </section>

    </main>
  );
};

export default PaginaProdutos;