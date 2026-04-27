import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, ShieldCheck, DollarSign } from "lucide-react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../firebaseConfig";

// Imagens
import hero from "../assets/hero.jpg";
import c6bank from "../assets/c6bank.png";
import pan from "../assets/pan.png";
import presenca from "../assets/presenca.png";
import bmg from "../assets/bmg.png";
import daycoval from "../assets/daycoval.png";

const Home: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Login social Google + redirecionamento
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

  return (
    <main className="bg-[#F9FAFB] text-[#0A2540] font-sans overflow-x-hidden">

      {/* HERO */}
      <section className="relative min-h-[80vh] flex items-center text-white overflow-hidden">
        <img
          src={hero}
          alt="Pessoa usando notebook"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div
          className="
            absolute inset-0
            bg-gradient-to-r
            from-[#0A2540]/70
            via-[#0A2540]/40
            to-transparent
          "
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full flex flex-col items-start justify-center py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 max-w-2xl"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]">
              O crédito que você merece
              <br />
              <span className="text-white">Está aqui!</span>
            </h1>

            <p className="text-gray-200 text-lg max-w-xl leading-relaxed">
              Chega de adiar <strong>seus planos.</strong> Encontre fôlego financeiro agora.
              Simule e descubra suas oportunidades com a Nitz Digital.
            </p>

            <button
              onClick={handleGoogleLogin}
              className="inline-flex items-center justify-center bg-[#3B82F6] text-white font-semibold py-4 px-10 rounded-full shadow-lg hover:bg-[#2563EB] hover:shadow-xl transition text-lg"
            >
              Simular Agora
            </button>
          </motion.div>
        </div>
      </section>

      {/* FAIXA ANTI-GOLPE */}
      <div className="w-full bg-white text-center py-2 border-b border-gray-200 shadow-sm">
        <p className="text-[#0A2540] font-semibold text-xs md:text-sm">
          Cuidado com golpes! <span className="font-bold">A Nitz nunca cobrará taxas.</span>
        </p>
      </div>

      {/* BENEFÍCIOS */}
      <section className="bg-[#F3F4F6] py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-10 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-4xl font-extrabold text-[#0A2540] mb-14"
          >
            A solução financeira perfeita para você!
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <ShieldCheck className="w-12 h-12 text-[#3B82F6]" />,
                title: "Tudo 100% online, rápido e seguro.",
              },
              {
                icon: <CheckCircle className="w-12 h-12 text-[#3B82F6]" />,
                title: "Parceiros regulamentados pelo Banco Central.",
              },
              {
                icon: <DollarSign className="w-12 h-12 text-[#3B82F6]" />,
                title: "Condições transparentes e competitivas.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="bg-white p-10 rounded-2xl shadow-[0_8px_30px_rgba(15,23,42,0.08)] hover:shadow-[0_12px_40px_rgba(15,23,42,0.12)] transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="bg-[#E8EDFF] p-4 rounded-full mb-5 flex items-center justify-center">
                  {item.icon}
                </div>
                <p className="text-lg font-medium text-[#0A2540] leading-relaxed">
                  {item.title}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA — AJUSTADO PARA SER GENÉRICO */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <span className="inline-block bg-[#0A2540] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Entenda mais
                </span>

                <h2 className="text-3xl md:text-4xl font-extrabold text-[#0A2540]">
                  Como funciona a Nitz Digital?
                </h2>

                <p className="text-[#475569] leading-relaxed">
                  A Nitz conecta você às melhores soluções financeiras de forma simples e digital.
                  O processo é o mesmo para todos os produtos: você simula, compara propostas
                  e contrata online, com segurança, transparência e rapidez.
                </p>

                <div>
                  <button
                    onClick={handleGoogleLogin}
                    className="inline-flex items-center justify-center bg-[#0A2540] text-white font-semibold py-3 px-6 rounded-full shadow hover:bg-[#072033] transition"
                  >
                    Fazer Simulação
                  </button>
                </div>
              </motion.div>
            </div>

            <div className="md:col-span-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative pl-8 md:pl-12"
              >
                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-[#0A2540]/20 hidden md:block" />

                <ol className="space-y-6 md:space-y-8">
                  {[
                    {
                      title: "Faça a simulação",
                      desc: "Informe seus dados e visualize as opções disponíveis para o seu perfil.",
                    },
                    {
                      title: "Compare as propostas",
                      desc: "Analise taxas, prazos e condições oferecidas pelos bancos parceiros.",
                    },
                    {
                      title: "Contrate online",
                      desc: "Escolha a melhor opção e finalize tudo digitalmente, sem burocracia.",
                    },
                    {
                      title: "Receba o valor",
                      desc: "Após a aprovação, o crédito é liberado direto na sua conta.",
                    },
                  ].map((step, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="relative bg-[#F8FAFC] rounded-lg p-6 border border-[#E6EEF7]"
                    >
                      <div className="absolute -left-10 top-6 flex items-center">
                        <div className="w-10 h-10 rounded-full bg-[#0A2540] text-white flex items-center justify-center font-bold">
                          {i + 1}
                        </div>
                      </div>
                      <h4 className="text-[#0A2540] font-semibold mb-2">
                        {step.title}
                      </h4>
                      <p className="text-[#475569] text-sm leading-relaxed">
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

      {/* CTA FINAL */}
      <section className="bg-[#0A2540] py-20 text-center text-white">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          Pronto para começar?
        </motion.h2>

        <p className="text-[#CBD5E1] max-w-2xl mx-auto mb-8">
          Simule agora e descubra a melhor solução financeira para você.
        </p>

        <button
          onClick={handleGoogleLogin}
          className="bg-[#3B82F6] text-white font-semibold py-3 px-8 rounded-full shadow hover:bg-[#2563EB] transition"
        >
          Simular Agora
        </button>
      </section>
    </main>
  );
};

export default Home;
