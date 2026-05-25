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
  Calendar,
  Star,
  Shield,
  Sparkles,
  Building2,
  GraduationCap,
  TreePine,
  Landmark
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
      city: "Mudou para Campinas",
      text: "A consultoria foi fundamental para encontrar o bairro ideal. Hoje trabalho remoto em um ambiente tranquilo, com qualidade de vida que nunca tive em SP.",
      rating: 5,
    },
    {
      name: "Carlos Mendes",
      role: "Gerente Comercial",
      city: "Mudou para Paulínia",
      text: "Excelente custo-benefício! A equipe me ajudou desde a escolha do bairro até indicações de escolas para meus filhos. Estamos muito felizes aqui.",
      rating: 5,
    },
    {
      name: "Fernanda Costa",
      role: "Designer",
      city: "Mudou para Hortolândia",
      text: "Processo totalmente personalizado. Entenderam minhas necessidades e me guiaram em cada etapa. Hoje tenho mais tempo com minha família.",
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
                  Consultoria especializada em relocação
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
                    Agendar Consultoria Gratuita
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-semibold py-4 px-8 rounded-full hover:bg-white/20 transition-all"
                >
                  <Phone className="w-5 h-5" />
                  Falar com especialista
                </motion.button>
              </div>

              {/* Stats rápidos */}
              <div className="flex gap-8 pt-6">
                {[
                  { num: "500+", label: "Famílias relocadas" },
                  { num: "4", label: "Cidades atendidas" },
                  { num: "98%", label: "Satisfação" },
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
                      <div className="text-white font-bold text-lg">Processo Garantido</div>
                      <div className="text-emerald-200 text-sm">100% personalizado</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      "Análise de perfil e necessidades",
                      "Pesquisa de bairros ideais",
                      "Visitas guiadas presenciais",
                      "Conexão com parceiros locais",
                      "Suporte pós-mudança",
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
                  ⭐ 1ª consulta GRÁTIS
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
              <span className="font-semibold">Consultoria certificada</span>
            </div>
            <div className="w-px h-6 bg-emerald-200 hidden sm:block" />
            <div className="flex items-center gap-2 text-emerald-700">
              <Star className="w-5 h-5 fill-emerald-500" />
              <span className="font-semibold">4.9/5 avaliação média</span>
            </div>
            <div className="w-px h-6 bg-emerald-200 hidden sm:block" />
            <div className="flex items-center gap-2 text-emerald-700">
              <Users className="w-5 h-5" />
              <span className="font-semibold">500+ famílias atendidas</span>
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
                icon: <TrendingUp className="w-16 h-16" />,
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

      {/* ========== COMO FUNCIONA ========== */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Esquerda - Conteúdo */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 font-bold text-sm px-5 py-2 rounded-full mb-6"
              >
                <Briefcase className="w-4 h-4" />
                Metodologia comprovada
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-black text-emerald-900 mb-6"
              >
                Sua mudança planejada do <span className="text-emerald-600">início ao fim</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-lg text-gray-600 leading-relaxed mb-8"
              >
                Nossa consultoria completa e personalizada garante que você tome a melhor decisão e faça uma transição tranquila para o interior, sem estresse ou imprevistos.
              </motion.p>

              <div className="flex gap-4 mb-8">
                <button
                  onClick={handleGoogleLogin}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-4 px-8 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  Começar agora
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button className="bg-white border-2 border-emerald-600 text-emerald-700 font-bold py-4 px-8 rounded-full hover:bg-emerald-50 transition-all flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Agendar reunião
                </button>
              </div>

              {/* Garantias */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <Shield />, text: "Processo 100% seguro" },
                  { icon: <Star />, text: "Satisfação garantida" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl">
                    <div className="w-10 h-10 bg-emerald-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <span className="text-sm font-bold text-emerald-900">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direita - Steps */}
            <div className="relative">
              {/* Linha conectora */}
              <div className="absolute left-8 top-12 bottom-12 w-1 bg-gradient-to-b from-emerald-400 via-teal-400 to-emerald-400 rounded-full hidden md:block" />

              <div className="space-y-6">
                {[
                  {
                    num: "01",
                    title: "Análise do seu perfil",
                    desc: "Entendemos necessidades, objetivos, orçamento e estilo de vida para indicar a cidade perfeita.",
                  },
                  {
                    num: "02",
                    title: "Pesquisa estratégica",
                    desc: "Mapeamos bairros, infraestrutura, segurança, escolas e opções de moradia sob medida.",
                  },
                  {
                    num: "03",
                    title: "Visitas personalizadas",
                    desc: "Organizamos tours presenciais ou virtuais pelos bairros e imóveis selecionados.",
                  },
                  {
                    num: "04",
                    title: "Rede de parceiros",
                    desc: "Indicamos corretores, empresas de mudança, escolas, médicos e prestadores de confiança.",
                  },
                  {
                    num: "05",
                    title: "Planejamento completo",
                    desc: "Apoio em documentação, logística, adaptação e todos os detalhes da mudança.",
                  },
                  {
                    num: "06",
                    title: "Suporte contínuo",
                    desc: "Acompanhamento pós-mudança para garantir que você se sinta em casa.",
                  },
                ].map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    whileHover={{ x: 8 }}
                    className="relative bg-gradient-to-br from-white to-emerald-50 rounded-2xl p-6 border-2 border-emerald-100 hover:border-emerald-300 shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      {/* Número */}
                      <div className="relative z-10 w-14 h-14 bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                        {step.num}
                      </div>

                      <div className="flex-1">
                        <h4 className="text-xl font-black text-emerald-900 mb-2 group-hover:text-emerald-600 transition-colors">
                          {step.title}
                        </h4>
                        <p className="text-gray-600 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>

                    {/* Efeito hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 to-teal-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                ))}
              </div>
            </div>
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
              O que nossos clientes dizem
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-emerald-100 max-w-2xl mx-auto"
            >
              Transformamos vidas através de mudanças bem planejadas
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
                    {testimonial.city}
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
              <span className="font-bold text-lg">Oferta por tempo limitado</span>
            </div>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
              Pronto para transformar<br />sua vida?
            </h2>

            <p className="text-2xl md:text-3xl text-emerald-50 max-w-3xl mx-auto leading-relaxed font-light">
              Agende uma <strong className="font-bold">consultoria 100% gratuita</strong> e descubra como conquistar a qualidade de vida que você sempre sonhou.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <motion.button
                onClick={handleGoogleLogin}
                whileHover={{ scale: 1.05, boxShadow: "0 25px 50px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="group bg-white text-emerald-700 font-black py-5 px-12 rounded-full text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                Quero minha consultoria grátis
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/10 backdrop-blur-md border-2 border-white/40 text-white font-bold py-5 px-10 rounded-full hover:bg-white/20 transition-all flex items-center justify-center gap-2 text-lg"
              >
                <Phone className="w-5 h-5" />
                (19) 99999-9999
              </motion.button>
            </div>

            {/* Garantias rápidas */}
            <div className="flex flex-wrap justify-center gap-6 pt-12 text-emerald-100">
              {[
                "✓ Sem compromisso",
                "✓ Totalmente gratuito",
                "✓ Resposta em 24h",
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
                Consultoria Interior SP
              </h3>
              <p className="text-emerald-200 leading-relaxed mb-6">
                Especialistas em relocação para o interior paulista. Ajudamos você a encontrar qualidade de vida, segurança e prosperidade.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-emerald-800 hover:bg-emerald-700 rounded-full flex items-center justify-center transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-emerald-800 hover:bg-emerald-700 rounded-full flex items-center justify-center transition-colors">
                  <Phone className="w-5 h-5" />
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

            {/* Coluna 3 - Contato */}
            <div>
              <h4 className="text-white font-bold mb-4">Contato</h4>
              <ul className="space-y-3 text-emerald-200">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  (19) 99999-9999
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  contato@exemplo.com
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-emerald-800 mt-12 pt-8 text-center text-emerald-300 text-sm">
            © 2024 Consultoria Interior SP. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </main>
  );
};

export default HomePage;