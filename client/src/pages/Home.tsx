import React from "react";
import { motion } from "framer-motion";
import { Home, MapPin, Briefcase, Heart, Users, TrendingUp } from "lucide-react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../firebaseConfig";

// Imagens - você pode substituir por fotos do interior/cidades
import hero from "../assets/hero.jpg";

const Home: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <main className="bg-white text-[#1F2937] font-sans overflow-x-hidden">

      {/* HERO */}
      <section className="relative min-h-[85vh] flex items-center text-white overflow-hidden">
        <img
          src={hero}
          alt="Interior de São Paulo"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div
          className="
            absolute inset-0
            bg-gradient-to-r
            from-[#065f46]/85
            via-[#047857]/60
            to-transparent
          "
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col items-start justify-center py-20 md:py-24">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
            className="space-y-7 max-w-2xl"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
              Sua nova vida no
              <br />
              <span className="text-[#D1FAE5]">interior de São Paulo</span>
            </h1>

            <p className="text-gray-100 text-lg md:text-xl max-w-xl leading-relaxed">
              Descubra a qualidade de vida, segurança e tranquilidade que você merece.
              Conecte-se com oportunidades reais em <strong>Hortolândia, Paulínia, Sumaré e Campinas.</strong>
            </p>

            <button
              onClick={handleGoogleLogin}
              className="inline-flex items-center justify-center bg-white text-[#047857] font-bold py-4 px-10 rounded-full shadow-xl hover:bg-gray-50 hover:shadow-2xl transition-all duration-300 text-lg"
            >
              Comece sua jornada
            </button>
          </motion.div>
        </div>
      </section>

      {/* FAIXA DESTAQUE */}
      <div className="w-full bg-[#ECFDF5] text-center py-3 border-b border-[#A7F3D0]">
        <p className="text-[#065f46] font-semibold text-sm md:text-base">
          ✨ <span className="font-bold">Consultoria personalizada</span> para sua mudança com segurança e planejamento
        </p>
      </div>

      {/* POR QUE O INTERIOR? */}
      <section className="bg-white py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-5xl font-bold text-[#065f46] mb-6"
          >
            Por que escolher o interior paulista?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#4B5563] text-lg max-w-3xl mx-auto mb-16 leading-relaxed"
          >
            Mais do que uma mudança de endereço, é uma transformação no seu estilo de vida.
            Conheça os benefícios reais de viver perto da capital, mas longe do caos.
          </motion.p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Heart className="w-14 h-14 text-[#047857]" />,
                title: "Qualidade de vida elevada",
                desc: "Menos trânsito, mais verde, ar puro e tempo para o que realmente importa.",
              },
              {
                icon: <MapPin className="w-14 h-14 text-[#047857]" />,
                title: "Perto da capital",
                desc: "Acesso rápido a São Paulo para trabalho, eventos e aeroportos.",
              },
              {
                icon: <TrendingUp className="w-14 h-14 text-[#047857]" />,
                title: "Custo de vida equilibrado",
                desc: "Imóveis mais acessíveis, menor custo com transporte e serviços.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="bg-[#F0FDF4] p-8 rounded-2xl border-2 border-[#A7F3D0] hover:border-[#6EE7B7] hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="bg-white p-5 rounded-full mb-6 shadow-md flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-[#065f46] mb-3">
                  {item.title}
                </h3>
                <p className="text-[#4B5563] leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AS CIDADES */}
      <section className="py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#065f46] mb-4">
              Conheça as cidades que atendemos
            </h2>
            <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">
              Cada cidade com suas particularidades, infraestrutura e oportunidades únicas.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Campinas",
                highlight: "Polo tecnológico e educacional",
                features: ["Unicamp e PUC", "Aeroporto internacional", "Indústrias de tecnologia"],
              },
              {
                name: "Hortolândia",
                highlight: "Crescimento acelerado",
                features: ["IBM e outras empresas", "Infraestrutura moderna", "Próxima a Campinas"],
              },
              {
                name: "Paulínia",
                highlight: "Maior PIB per capita do Brasil",
                features: ["Polo petroquímico", "Excelente IDH", "Parques e lazer"],
              },
              {
                name: "Sumaré",
                highlight: "Equilíbrio e acessibilidade",
                features: ["Boa infraestrutura", "Comércio forte", "Acesso fácil à região"],
              },
            ].map((city, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-[#E5E7EB]"
              >
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-[#10B981] rounded-full mr-3" />
                  <h3 className="text-2xl font-bold text-[#065f46]">
                    {city.name}
                  </h3>
                </div>
                <p className="text-[#047857] font-semibold mb-4 text-sm">
                  {city.highlight}
                </p>
                <ul className="space-y-2">
                  {city.features.map((feat, i) => (
                    <li key={i} className="text-[#6B7280] text-sm flex items-start">
                      <span className="text-[#10B981] mr-2">•</span>
                      {feat}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA A CONSULTORIA */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-5">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6 sticky top-8"
              >
                <span className="inline-block bg-[#065f46] text-white text-xs font-bold px-4 py-1.5 rounded-full">
                  Como funciona
                </span>

                <h2 className="text-3xl md:text-4xl font-bold text-[#065f46]">
                  Sua mudança planejada do início ao fim
                </h2>

                <p className="text-[#4B5563] leading-relaxed text-lg">
                  Oferecemos uma consultoria completa e personalizada para que você tome
                  a melhor decisão e faça uma transição tranquila para o interior.
                </p>

                <div className="pt-4">
                  <button
                    onClick={handleGoogleLogin}
                    className="inline-flex items-center justify-center bg-[#047857] text-white font-bold py-3.5 px-8 rounded-full shadow-lg hover:bg-[#065f46] transition-all duration-300"
                  >
                    Agendar Consultoria
                  </button>
                </div>
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
                  {[
                    {
                      title: "Análise do seu perfil",
                      desc: "Entendemos suas necessidades, objetivos, orçamento e estilo de vida para indicar a cidade ideal.",
                    },
                    {
                      title: "Pesquisa de bairros e imóveis",
                      desc: "Mapeamos as melhores regiões, infraestrutura, segurança, escolas e opções de moradia.",
                    },
                    {
                      title: "Visitas guiadas",
                      desc: "Organizamos visitas presenciais ou virtuais aos bairros e imóveis selecionados.",
                    },
                    {
                      title: "Conexão com profissionais",
                      desc: "Indicamos corretores, empresas de mudança, escolas, clínicas e outros serviços locais.",
                    },
                    {
                      title: "Planejamento da mudança",
                      desc: "Apoio na documentação, logística e adaptação à nova cidade.",
                    },
                    {
                      title: "Acompanhamento pós-mudança",
                      desc: "Suporte contínuo para você se sentir em casa no novo lar.",
                    },
                  ].map((step, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.08 }}
                      className="relative bg-[#F0FDF4] rounded-xl p-6 border-l-4 border-[#10B981] shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="absolute -left-11 top-7 flex items-center">
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

      {/* DIFERENCIAIS */}
      <section className="bg-[#ECFDF5] py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-[#065f46] text-center mb-14"
          >
            Por que escolher nossa consultoria?
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-12 h-12" />,
                title: "Conhecimento local",
                desc: "Especialistas que conhecem profundamente cada cidade da região.",
              },
              {
                icon: <Home className="w-12 h-12" />,
                title: "Atendimento personalizado",
                desc: "Cada família tem necessidades únicas. Criamos soluções sob medida.",
              },
              {
                icon: <Briefcase className="w-12 h-12" />,
                title: "Rede de parceiros",
                desc: "Acesso a corretores, escolas, médicos e prestadores de confiança.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
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
                <p className="text-[#6B7280] leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
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
            Pronto para a melhor decisão da sua vida?
          </motion.h2>

          <p className="text-[#D1FAE5] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Agende uma consultoria gratuita e descubra como podemos ajudá-lo
            a conquistar a qualidade de vida que você sempre sonhou.
          </p>

          <button
            onClick={handleGoogleLogin}
            className="bg-white text-[#047857] font-bold py-4 px-12 rounded-full shadow-2xl hover:bg-gray-50 hover:scale-105 transition-all duration-300 text-lg"
          >
            Falar com um Consultor
          </button>

          <p className="text-[#A7F3D0] text-sm mt-6">
            ✨ Primeira consulta totalmente gratuita
          </p>
        </div>
      </section>
    </main>
  );
};

export default Home;