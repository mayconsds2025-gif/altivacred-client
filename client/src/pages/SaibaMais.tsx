import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Home,
  DollarSign,
  Users,
  Briefcase,
  Phone,
  CheckCircle,
  User,
  ArrowRight,
  Shield,
  Sparkles,
  Clock,
} from "lucide-react";

const SaibaMais: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    // Dados Pessoais
    nome: "",
    email: "",
    telefone: "",
    idade: "",

    // Situação Atual
    cidadeAtual: "",
    motivoMudanca: "",

    // Preferências de Localização
    cidadeInteresse: [] as string[],
    tipoImovel: "",

    // Situação Profissional
    situacaoProfissional: "",
    profissao: "",
    rendaFamiliar: "",

    // Detalhes da Compra
    pretensaoCompra: "",
    orcamento: "",
    tempoMudanca: "",

    // Composição Familiar
    estadoCivil: "",
    filhos: "",
    idadeFilhos: "",

    // Observações
    observacoes: "",
  });

  const cidades = ["Campinas", "Hortolândia", "Paulínia", "Sumaré"];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCityToggle = (city: string) => {
    setFormData((prev) => ({
      ...prev,
      cidadeInteresse: prev.cidadeInteresse.includes(city)
        ? prev.cidadeInteresse.filter((c) => c !== city)
        : [...prev.cidadeInteresse, city],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

      const response = await fetch(`${API_URL}/leads/captura`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          origem: "landing_page",
          dataCaptura: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        alert("Erro ao enviar formulário. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao enviar formulário. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const steps = [
    { num: 1, title: "Dados Pessoais", icon: <User className="w-5 h-5" /> },
    { num: 2, title: "Preferências", icon: <MapPin className="w-5 h-5" /> },
    { num: 3, title: "Situação Profissional", icon: <Briefcase className="w-5 h-5" /> },
    { num: 4, title: "Detalhes da Mudança", icon: <Home className="w-5 h-5" /> },
    { num: 5, title: "Informações Finais", icon: <Users className="w-5 h-5" /> },
  ];

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border-2 border-emerald-100">
            {/* Ícone de sucesso animado */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <CheckCircle className="w-14 h-14 text-white" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-black text-emerald-900 mb-4"
            >
              Solicitação Enviada com Sucesso!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-600 mb-8 leading-relaxed"
            >
              Obrigado, <strong className="text-emerald-700">{formData.nome}</strong>!
              <br />
              Um de nossos consultores parceiros entrará em contato em até{" "}
              <strong className="text-emerald-700">24 horas</strong> para auxiliar você nessa jornada.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 mb-8"
            >
              <div className="flex items-center justify-center gap-3 text-emerald-700 mb-4">
                <Clock className="w-6 h-6" />
                <span className="font-bold text-lg">Próximos Passos</span>
              </div>

              <div className="space-y-3 text-left">
                {[
                  "Você receberá um contato via WhatsApp ou telefone",
                  "Nosso consultor vai entender melhor suas necessidades",
                  "Apresentaremos as melhores opções de imóveis e bairros",
                  "Agendaremos visitas aos locais de seu interesse",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                      {i + 1}
                    </div>
                    <span className="text-gray-700">{step}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              
                href="/"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-4 px-8 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Voltar ao Início
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 font-bold text-sm px-5 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            Comece sua jornada agora
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-emerald-900 mb-4">
            Encontre seu Novo Lar no Interior
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Preencha o formulário e receba orientação personalizada de um consultor especializado
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.num}>
                <div className="flex flex-col items-center flex-1">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{
                      scale: currentStep >= step.num ? 1 : 0.8,
                    }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                      currentStep >= step.num
                        ? "bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-lg"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {currentStep > step.num ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      step.icon
                    )}
                  </motion.div>
                  <span
                    className={`text-xs font-semibold hidden md:block ${
                      currentStep >= step.num ? "text-emerald-700" : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>

                {index < (steps.length - 1) && 
                  <div className="flex-1 h-1 mx-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{
                        width: currentStep > step.num ? "100%" : "0%",
                      }}
                      transition={{ duration: 0.3 }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl border-2 border-emerald-100 overflow-hidden"
        >
          <form onSubmit={handleSubmit}>
            <div className="p-8 md:p-12">
              <AnimatePresence mode="wait">
                {/* STEP 1 - Dados Pessoais */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="text-2xl font-black text-emerald-900 mb-6 flex items-center gap-3">
                      <User className="w-7 h-7 text-emerald-600" />
                      Dados Pessoais
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Nome Completo *
                        </label>
                        <input
                          type="text"
                          name="nome"
                          value={formData.nome}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                          placeholder="Seu nome completo"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          E-mail *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                          placeholder="seu@email.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Telefone/WhatsApp *
                        </label>
                        <input
                          type="tel"
                          name="telefone"
                          value={formData.telefone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                          placeholder="(00) 00000-0000"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Idade
                        </label>
                        <input
                          type="number"
                          name="idade"
                          value={formData.idade}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                          placeholder="Sua idade"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Cidade Atual *
                        </label>
                        <input
                          type="text"
                          name="cidadeAtual"
                          value={formData.cidadeAtual}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                          placeholder="Onde você mora hoje"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Principal Motivo da Mudança *
                        </label>
                        <select
                          name="motivoMudanca"
                          value={formData.motivoMudanca}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                        >
                          <option value="">Selecione</option>
                          <option value="qualidade_vida">Qualidade de vida</option>
                          <option value="custo_vida">Reduzir custo de vida</option>
                          <option value="trabalho">Trabalho/Oportunidade</option>
                          <option value="familia">Próximo da família</option>
                          <option value="seguranca">Segurança</option>
                          <option value="aposentadoria">Aposentadoria</option>
                          <option value="outro">Outro</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2 - Preferências */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="text-2xl font-black text-emerald-900 mb-6 flex items-center gap-3">
                      <MapPin className="w-7 h-7 text-emerald-600" />
                      Preferências de Localização
                    </h3>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Quais cidades você tem interesse? * (selecione uma ou mais)
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {cidades.map((cidade) => (
                          <button
                            key={cidade}
                            type="button"
                            onClick={() => handleCityToggle(cidade)}
                            className={`p-4 rounded-xl border-2 font-semibold transition-all ${
                              formData.cidadeInteresse.includes(cidade)
                                ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white border-emerald-600 shadow-lg scale-105"
                                : "bg-white text-gray-700 border-gray-200 hover:border-emerald-300"
                            }`}
                          >
                            {cidade}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Tipo de Imóvel Desejado *
                      </label>
                      <select
                        name="tipoImovel"
                        value={formData.tipoImovel}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                      >
                        <option value="">Selecione</option>
                        <option value="apartamento">Apartamento</option>
                        <option value="casa_condominio">Casa em Condomínio</option>
                        <option value="casa">Casa</option>
                        <option value="terreno">Terreno</option>
                        <option value="rural">Chácara/Sítio</option>
                        <option value="ainda_nao_sei">Ainda não sei</option>
                      </select>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3 - Situação Profissional */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="text-2xl font-black text-emerald-900 mb-6 flex items-center gap-3">
                      <Briefcase className="w-7 h-7 text-emerald-600" />
                      Situação Profissional
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Situação Profissional *
                        </label>
                        <select
                          name="situacaoProfissional"
                          value={formData.situacaoProfissional}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                        >
                          <option value="">Selecione</option>
                          <option value="clt">CLT (Carteira Assinada)</option>
                          <option value="autonomo">Autônomo</option>
                          <option value="empresario">Empresário</option>
                          <option value="pj">PJ (Pessoa Jurídica)</option>
                          <option value="funcionario_publico">Funcionário Público</option>
                          <option value="aposentado">Aposentado</option>
                          <option value="desempregado">Desempregado</option>
                          <option value="outro">Outro</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Profissão/Área de Atuação
                        </label>
                        <input
                          type="text"
                          name="profissao"
                          value={formData.profissao}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                          placeholder="Ex: Engenheiro, Contador..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Renda Familiar Mensal *
                      </label>
                      <select
                        name="rendaFamiliar"
                        value={formData.rendaFamiliar}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                      >
                        <option value="">Selecione</option>
                        <option value="ate_3k">Até R$ 3.000</option>
                        <option value="3k_5k">R$ 3.000 - R$ 5.000</option>
                        <option value="5k_8k">R$ 5.000 - R$ 8.000</option>
                        <option value="8k_12k">R$ 8.000 - R$ 12.000</option>
                        <option value="12k_20k">R$ 12.000 - R$ 20.000</option>
                        <option value="acima_20k">Acima de R$ 20.000</option>
                        <option value="prefiro_nao_informar">Prefiro não informar</option>
                      </select>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4 - Detalhes da Mudança */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="text-2xl font-black text-emerald-900 mb-6 flex items-center gap-3">
                      <Home className="w-7 h-7 text-emerald-600" />
                      Detalhes da Mudança
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Pretensão de Compra *
                        </label>
                        <select
                          name="pretensaoCompra"
                          value={formData.pretensaoCompra}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                        >
                          <option value="">Selecione</option>
                          <option value="compra_vista">Compra à vista</option>
                          <option value="compra_financiamento">Compra com financiamento</option>
                          <option value="aluguel">Aluguel</option>
                          <option value="ainda_nao_decidi">Ainda não decidi</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Orçamento Disponível *
                        </label>
                        <select
                          name="orcamento"
                          value={formData.orcamento}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                        >
                          <option value="">Selecione</option>
                          <option value="ate_200k">Até R$ 200 mil</option>
                          <option value="200k_400k">R$ 200 mil - R$ 400 mil</option>
                          <option value="400k_600k">R$ 400 mil - R$ 600 mil</option>
                          <option value="600k_800k">R$ 600 mil - R$ 800 mil</option>
                          <option value="800k_1m">R$ 800 mil - R$ 1 milhão</option>
                          <option value="acima_1m">Acima de R$ 1 milhão</option>
                          <option value="ainda_nao_sei">Ainda não sei</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Prazo para Mudança *
                      </label>
                      <select
                        name="tempoMudanca"
                        value={formData.tempoMudanca}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                      >
                        <option value="">Selecione</option>
                        <option value="urgente">Urgente (até 1 mês)</option>
                        <option value="1_3_meses">1 a 3 meses</option>
                        <option value="3_6_meses">3 a 6 meses</option>
                        <option value="6_12_meses">6 a 12 meses</option>
                        <option value="acima_12_meses">Acima de 12 meses</option>
                        <option value="sem_prazo">Sem prazo definido</option>
                      </select>
                    </div>
                  </motion.div>
                )}

                {/* STEP 5 - Informações Finais */}
                {currentStep === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="text-2xl font-black text-emerald-900 mb-6 flex items-center gap-3">
                      <Users className="w-7 h-7 text-emerald-600" />
                      Informações Finais
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Estado Civil
                        </label>
                        <select
                          name="estadoCivil"
                          value={formData.estadoCivil}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                        >
                          <option value="">Selecione</option>
                          <option value="solteiro">Solteiro(a)</option>
                          <option value="casado">Casado(a)</option>
                          <option value="uniao_estavel">União Estável</option>
                          <option value="divorciado">Divorciado(a)</option>
                          <option value="viuvo">Viúvo(a)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Possui Filhos?
                        </label>
                        <select
                          name="filhos"
                          value={formData.filhos}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                        >
                          <option value="">Selecione</option>
                          <option value="nao">Não</option>
                          <option value="1">1 filho(a)</option>
                          <option value="2">2 filhos</option>
                          <option value="3">3 filhos</option>
                          <option value="4_ou_mais">4 ou mais</option>
                        </select>
                      </div>
                    </div>

                    {formData.filhos && formData.filhos !== "nao" && (
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Idade dos Filhos
                        </label>
                        <input
                          type="text"
                          name="idadeFilhos"
                          value={formData.idadeFilhos}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                          placeholder="Ex: 5, 8 e 12 anos"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Observações Adicionais
                      </label>
                      <textarea
                        name="observacoes"
                        value={formData.observacoes}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none resize-none"
                        placeholder="Conte-nos mais sobre suas necessidades, preferências específicas ou dúvidas..."
                      />
                    </div>

                    <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6">
                      <div className="flex items-start gap-3">
                        <Shield className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                        <div className="text-sm text-gray-700">
                          <p className="font-bold text-emerald-900 mb-2">
                            Seus dados estão seguros conosco
                          </p>
                          <p>
                            Utilizamos suas informações apenas para conectá-lo com consultores
                            parceiros qualificados. Não compartilhamos seus dados com terceiros.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="bg-gray-50 px-8 md:px-12 py-6 border-t-2 border-gray-100">
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`px-6 py-3 rounded-full font-bold transition-all ${
                    currentStep === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                  }`}
                >
                  Voltar
                </button>

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                  >
                    Próximo
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Enviar Solicitação
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-600"
        >
          {[
            { icon: <Shield className="w-5 h-5" />, text: "Dados 100% Seguros" },
            { icon: <Clock className="w-5 h-5" />, text: "Resposta em 24h" },
            { icon: <CheckCircle className="w-5 h-5" />, text: "Sem Compromisso" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                {item.icon}
              </div>
              <span className="font-semibold">{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default SaibaMais;