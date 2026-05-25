import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Home, 
  MapPin, 
  Briefcase, 
  Heart, 
  Users, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  Star,
  Shield,
  Sparkles,
  Building2,
  GraduationCap,
  TreePine,
  Landmark,
  DollarSign,
  Clock,
  Award
} from "lucide-react";
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

const HomePage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeCity, setActiveCity] = useState(0);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Auto-rotate cidades
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCity((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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

  const cities = [
    {
      name: "Campinas",
      gradient: "from-emerald-600 to-teal-600",
      highlight: "Polo tecnológico e educacional",
      stats: { empresas: "15mil+", idh: "0.805", habitantes: "1.2M" },
      features: [
        { icon: <GraduationCap className="w-5 h-5" />, text: "Unicamp e PUC" },
        { icon: <Building2 className="w-5 h-5" />, text: "Hub de inovação" },
        { icon: <Landmark className="w-5 h-5" />, text: "Aeroporto internacional" },
      ],
    },
    {
      name: "Hortolândia",
      gradient: "from-green-600 to-emerald-600",
      highlight: "Crescimento acelerado",
      stats: { empresas: "3mil+", idh: "0.790", habitantes: "234mil" },
      features: [
        { icon: <Building2 className="w-5 h-5" />, text: "IBM e Dell" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Economia forte" },
        { icon: <TreePine className="w-5 h-5" />, text: "Áreas verdes" },
      ],
    },
    {
      name: "Paulínia",
      gradient: "from-teal-600 to-cyan-600",
      highlight: "Maior PIB per capita do Brasil",
      stats: { empresas: "2mil+", idh: "0.795", habitantes: "115mil" },
      features: [
        { icon: <TrendingUp className="w-5 h-5" />, text: "PIB R$ 120mil/hab" },
        { icon: <Building2 className="w-5 h-5" />, text: "Polo petroquímico" },
        { icon: <TreePine className="w-5 h-5" />, text: "Qualidade excepcional" },
      ],
    },
    {
      name: "Sumaré",
      gradient: "from-emerald-700 to-green-700",
      highlight: "Equilíbrio perfeito",
      stats: { empresas: "4mil+", idh: "0.762", habitantes: "285mil" },
      features: [
        { icon: <Home className="w-5 h-5" />, text: "Custo acessível" },
        { icon: <MapPin className="w-5 h-5" />, text: "Localização estratégica" },
        { icon: <Users className="w-5 h-5" />, text: "Comunidade acolhedora" },
      ],
    },
  ];

  const testimonials = [
    {
      name: "Ana Paula Silva",
      role: "Engenheira de Software",
      city: "Campinas",
      text: "Melhor decisão que tomei! Hoje trabalho remoto em um ambiente tranquilo, com qualidade de vida que nunca tive em SP.",
      rating: 5,
    },
    {
      name: "Carlos Mendes",
      role: "Gerente Comercial",
      city: "Paulínia",
      text: "Excelente custo-benefício! Meus filhos estudam em ótimas escolas e ainda sobra dinheiro no final do mês. Estamos muito felizes aqui.",
      rating: 5,
    },
    {
      name: "Fernanda Costa",
      role: "Designer",
      city: "Hortolândia",
      text: "Processo simples e rápido. Em 3 meses já estava morando no interior. Hoje tenho mais tempo com minha família e menos estresse.",
      rating: 5,
    },
  ];

  return (
    <main className="bg-white text-[#1F2937] font-sans overflow-x-hidden">

      {/* ========== HERO PREMIUM ========== */}
      <section className="relative min-h-screen flex items-center text-white overflow-hidden">
        {/* Background com Parallax */}
        <motion.img
          src={hero}
          alt="Interior de São Paulo"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity }}
        />

        {/* Overlay gradiente animado */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#065f46]/95 via-[#047857]/85 to-[#10B981]/75" />
        
        {/* Efeitos de luz */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-20 -left-20 w-96 h-96 bg-emerald-400 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-teal-400 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full py-32 md:py-40">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Coluna esquerda - Conteúdo */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="space-y-8"
            >
              {/* Badge Premium */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2"
              >
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span className="text-sm font-semibold text-emerald-100">
                  Guia completo para sua mudança
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight">
                Sua nova vida no
                <br />
                <span className="bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 bg-clip-text text-transparent">
                  interior paulista
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-emerald-50 leading-relaxed max-w-xl font-light">
                Deixe para trás o caos da capital. Descubra <strong className="font-semibold">qualidade de vida, segurança e prosperidade</strong> em Campinas, Hortolândia, Paulínia e Sumaré.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <motion.button
                  onClick={handleGoogleLogin}
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(16, 185, 129, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative bg-white text-emerald-700 font-bold py-4 px-10 rounded-full overflow-hidden shadow-2xl"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Explorar as Cidades
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-semibold py-4 px-8 rounded-full hover:bg-white/20 transition-all"
                >
                  <MapPin className="w-5 h-5" />
                  Ver no mapa
                </motion.button>
              </div>

              {/* Stats rápidos */}
              <div className="flex gap-8 pt-6">
                {[
                  { num: "4", label: "Cidades destacadas" },
                  { num: "45min", label: "De São Paulo" },
                  { num: "40%", label: "Mais em conta" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-black text-white">{stat.num}</div>
                    <div className="text-sm text-emerald-200">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Coluna direita - Card flutuante */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="hidden md:block"
            >
              <div className="relative">
                {/* Card principal */}
                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-emerald-400 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg">Vantagens Garantidas</div>
                      <div className="text-emerald-200 text-sm">Mudança inteligente</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      "Menos trânsito, mais qualidade",
                      "Custo de vida reduzido",
                      "Segurança e tranquilidade",
                      "Próximo da capital",
                      "Infraestrutura completa",
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        className="flex items-center gap-3 text-white"
                      >
                        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Badge flutuante */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-gradient-to-br from-amber-400 to-orange-500 text-white font-black text-sm px-6 py-3 rounded-full shadow-xl"
                >
                  ⭐ Guia 100% Gratuito
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60"
        >
          <span className="text-xs font-medium">Role para descobrir</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-white rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* ========== SOCIAL PROOF BAR ========== */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 py-4 border-y border-emerald-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2 text-emerald-700">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">Informações verificadas</span>
            </div>
            <div className="w-px h-6 bg-emerald-200 hidden sm:block" />
            <div className="flex items-center gap-2 text-emerald-700">
              <Star className="w-5 h-5 fill-emerald-500" />
              <span className="font-semibold">Dados atualizados 2024</span>
            </div>
            <div className="w-px h-6 bg-emerald-200 hidden sm:block" />
            <div className="flex items-center gap-2 text-emerald-700">
              <MapPin className="w-5 h-5" />
              <span className="font-semibold">4 cidades mapeadas</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========== POR QUE O INTERIOR ========== */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 font-bold text-sm px-5 py-2 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Vantagens exclusivas
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-emerald-900 mb-6"
            >
              Por que escolher o interior paulista?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              Mais do que uma mudança de endereço, é uma <strong className="text-emerald-700">transformação completa</strong> no seu estilo de vida.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Heart className="w-16 h-16" />,
                title: "Qualidade de vida incomparável",
                desc: "Menos trânsito, mais tempo com família, ar puro e contato com a natureza. Redescubra o prazer de viver.",
                stats: ["70% menos tempo no trânsito", "Áreas verdes abundantes"],
                color: "from-rose-500 to-pink-500",
              },
              {
                icon: <MapPin className="w-16 h-16" />,
                title: "Perto de tudo que importa",
                desc: "45-90 min de São Paulo. Trabalhe na capital quando necessário, mas viva com qualidade no interior.",
                stats: ["Acesso a aeroportos", "Rodovias modernas"],
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: <DollarSign className="w-16 h-16" />,
                title: "Economia inteligente",
                desc: "Imóveis até 40% mais acessíveis, menor custo de vida e mais espaço para sua família crescer.",
                stats: ["Economia de 30-40%/mês", "Imóveis espaçosos"],
                color: "from-emerald-500 to-teal-500",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -12, scale: 1.02 }}
                className="group relative bg-white rounded-3xl p-8 border-2 border-gray-100 hover:border-emerald-200 shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                {/* Ícone com gradiente */}
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} text-white mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  {item.icon}
                </div>

                <h3 className="text-2xl font-black text-emerald-900 mb-4">
                  {item.title}
                </h3>

                <p className="text-gray-600 leading-relaxed mb-6">
                  {item.desc}
                </p>

                {/* Stats */}
                <div className="space-y-2">
                  {item.stats.map((stat, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-emerald-700 font-semibold">
                      <CheckCircle className="w-4 h-4" />
                      {stat}
                    </div>
                  ))}
                </div>

                {/* Efeito hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CIDADES INTERATIVAS ========== */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-emerald-50/30 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-white border border-emerald-200 text-emerald-700 font-bold text-sm px-5 py-2 rounded-full mb-6 shadow-md"
            >
              <MapPin className="w-4 h-4" />
              4 cidades estratégicas
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-emerald-900 mb-6"
            >
              Descubra seu novo lar
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Cada cidade com oportunidades únicas para você e sua família
            </motion.p>
          </div>

          {/* Seletor de cidades */}
          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            {cities.map((city, index) => (
              <button
                key={index}
                onClick={() => setActiveCity(index)}
                className={`px-8 py-3 rounded-full font-bold transition-all duration-500 ${
                  activeCity === index
                    ? `bg-gradient-to-r ${city.gradient} text-white shadow-xl scale-110`
                    : "bg-white text-gray-600 border-2 border-gray-200 hover:border-emerald-300"
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>

          {/* Card da cidade ativa */}
          <motion.div
            key={activeCity}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-emerald-100"
          >
            <div className="grid md:grid-cols-2">
              {/* Esquerda - Info */}
              <div className="p-10 md:p-12">
                <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${cities[activeCity].gradient} text-white font-bold text-sm px-4 py-2 rounded-full mb-6`}>
                  <Star className="w-4 h-4 fill-white" />
                  {cities[activeCity].highlight}
                </div>

                <h3 className="text-4xl md:text-5xl font-black text-emerald-900 mb-6">
                  {cities[activeCity].name}
                </h3>

                {/* Stats principais */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-emerald-50 rounded-xl">
                    <div className="text-2xl font-black text-emerald-700">
                      {cities[activeCity].stats.empresas}
                    </div>
                    <div className="text-xs text-gray-600 font-semibold">Empresas</div>
                  </div>
                  <div className="text-center p-4 bg-emerald-50 rounded-xl">
                    <div className="text-2xl font-black text-emerald-700">
                      {cities[activeCity].stats.idh}
                    </div>
                    <div className="text-xs text-gray-600 font-semibold">IDH</div>
                  </div>
                  <div className="text-center p-4 bg-emerald-50 rounded-xl">
                    <div className="text-2xl font-black text-emerald-700">
                      {cities[activeCity].stats.habitantes}
                    </div>
                    <div className="text-xs text-gray-600 font-semibold">Habitantes</div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  {cities[activeCity].features.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors group"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cities[activeCity].gradient} text-white flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        {feature.icon}
                      </div>
                      <span className="font-semibold text-gray-700 group-hover:text-emerald-700">
                        {feature.text}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <button
                  onClick={handleGoogleLogin}
                  className={`mt-8 w-full bg-gradient-to-r ${cities[activeCity].gradient} text-white font-bold py-4 px-8 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2`}
                >
                  Explorar {cities[activeCity].name}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Direita - Visual */}
              <div className={`bg-gradient-to-br ${cities[activeCity].gradient} p-10 md:p-12 flex items-center justify-center relative overflow-hidden`}>
                {/* Decoração */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl" />
                  <div className="absolute bottom-10 left-10 w-80 h-80 bg-white rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 text-white text-center">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-48 h-48 mx-auto mb-8 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center border-4 border-white/30"
                  >
                    <MapPin className="w-24 h-24" />
                  </motion.div>

                  <h4 className="text-3xl font-black mb-4">
                    Seu futuro começa aqui
                  </h4>
                  <p className="text-lg opacity-90">
                    Descubra todas as oportunidades que {cities[activeCity].name} tem para oferecer
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== COMPARATIVO COM SP ========== */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 font-bold text-sm px-5 py-2 rounded-full mb-6"
            >
              <TrendingUp className="w-4 h-4" />
              Comparação inteligente
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-emerald-900 mb-6"
            >
              Interior vs. Capital
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Veja as diferenças que realmente importam
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* São Paulo */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-8 border-2 border-gray-300"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-800">São Paulo Capital</h3>
              </div>

              <div className="space-y-4">
                {[
                  { icon: <Clock />, text: "2-3h/dia no trânsito", negative: true },
                  { icon: <DollarSign />, text: "Custo de vida 40% maior", negative: true },
                  { icon: <Home />, text: "Imóveis pequenos e caros", negative: true },
                  { icon: <Heart />, text: "Alto nível de estresse", negative: true },
                  { icon: <TreePine />, text: "Poucas áreas verdes", negative: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-700">
                    <div className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Interior */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 border-2 border-emerald-300 relative overflow-hidden"
            >
              {/* Badge destaque */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black text-xs px-4 py-2 rounded-full">
                MELHOR ESCOLHA
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center">
                  <TreePine className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-black text-emerald-900">Interior Paulista</h3>
              </div>

              <div className="space-y-4">
                {[
                  { icon: <Clock />, text: "30min/dia no trânsito", positive: true },
                  { icon: <DollarSign />, text: "Economia de até 40%", positive: true },
                  { icon: <Home />, text: "Imóveis espaçosos e acessíveis", positive: true },
                  { icon: <Heart />, text: "Qualidade de vida superior", positive: true },
                  { icon: <TreePine />, text: "Natureza e áreas verdes", positive: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-emerald-900">
                    <div className="w-8 h-8 bg-emerald-200 text-emerald-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <span className="font-semibold">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== DEPOIMENTOS ========== */}
      <section className="py-24 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white relative overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-teal-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-sm px-5 py-2 rounded-full mb-6"
            >
              <Users className="w-4 h-4" />
              Histórias reais
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-black mb-6"
            >
              Quem já fez a mudança
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-emerald-100 max-w-2xl mx-auto"
            >
              Conheça pessoas que transformaram suas vidas
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -8 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-500"
              >
                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Texto */}
                <p className="text-lg text-white/90 leading-relaxed mb-6 italic">
                  "{testimonial.text}"
                </p>

                {/* Autor */}
                <div className="pt-6 border-t border-white/20">
                  <div className="font-bold text-white text-lg">{testimonial.name}</div>
                  <div className="text-emerald-300 text-sm font-semibold">{testimonial.role}</div>
                  <div className="text-emerald-200 text-sm mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Mora em {testimonial.city}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA FINAL PREMIUM ========== */}
      <section className="relative py-32 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white overflow-hidden">
        {/* Background animado */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [0, -90, 0],
            }}
            transition={{ duration: 25, repeat: Infinity }}
            className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-6 py-3">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span className="font-bold text-lg">Comece sua jornada hoje</span>
            </div>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
              Pronto para mudar<br />de vida?
            </h2>

            <p className="text-2xl md:text-3xl text-emerald-50 max-w-3xl mx-auto leading-relaxed font-light">
              Explore as <strong className="font-bold">melhores cidades</strong> do interior paulista e descubra onde você quer construir seu futuro.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <motion.button
                onClick={handleGoogleLogin}
                whileHover={{ scale: 1.05, boxShadow: "0 25px 50px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="group bg-white text-emerald-700 font-black py-5 px-12 rounded-full text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                Explorar as Cidades
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/10 backdrop-blur-md border-2 border-white/40 text-white font-bold py-5 px-10 rounded-full hover:bg-white/20 transition-all flex items-center justify-center gap-2 text-lg"
              >
                <MapPin className="w-5 h-5" />
                Ver no Mapa
              </motion.button>
            </div>

            {/* Garantias rápidas */}
            <div className="flex flex-wrap justify-center gap-6 pt-12 text-emerald-100">
              {[
                "✓ Guia completo",
                "✓ Informações atualizadas",
                "✓ 100% gratuito",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 border border-white/20"
                >
                  <span className="font-semibold text-lg">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== FOOTER INFORMATIVO ========== */}
      <footer className="bg-emerald-950 text-emerald-100 py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Coluna 1 - Sobre */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-black text-white mb-4">
                Interior Paulista
              </h3>
              <p className="text-emerald-200 leading-relaxed mb-6">
                Seu guia completo para descobrir e explorar as melhores cidades do interior de São Paulo. Informações atualizadas e verificadas.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-emerald-800 hover:bg-emerald-700 rounded-full flex items-center justify-center transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-emerald-800 hover:bg-emerald-700 rounded-full flex items-center justify-center transition-colors">
                  <MapPin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Coluna 2 - Cidades */}
            <div>
              <h4 className="text-white font-bold mb-4">Cidades</h4>
              <ul className="space-y-2">
                {cities.map((city, i) => (
                  <li key={i}>
                    <button className="text-emerald-300 hover:text-white transition-colors">
                      {city.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Coluna 3 - Links */}
            <div>
              <h4 className="text-white font-bold mb-4">Recursos</h4>
              <ul className="space-y-2 text-emerald-200">
                <li>
                  <button className="hover:text-white transition-colors">Guia de mudança</button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">Calculadora</button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">Blog</button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-emerald-800 mt-12 pt-8 text-center text-emerald-300 text-sm">
            © 2024 Interior Paulista. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </main>
  );
};

export default HomePage;