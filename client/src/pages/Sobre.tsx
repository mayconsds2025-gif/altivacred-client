import React from "react";
import { motion } from "framer-motion";
import equipe from "../assets/trabalhador.jpg"; // Substitua por uma imagem da equipe ou conceito

const Sobre: React.FC = () => {
  return (
    <main className="bg-[#F9FAFB] text-[#0A2540] font-sans overflow-x-hidden">
      {/* HERO */}
      <section className="relative h-[70vh] flex items-center justify-center bg-[#0A2540] overflow-hidden text-center px-6">
        <div className="absolute inset-0">
          <img
            src={equipe}
            alt="Equipe Nitz Digital"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A2540]/95 via-[#0A2540]/90 to-[#0A2540]/60" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl md:text-6xl font-extrabold text-white mb-6"
          >
            Sobre a <span className="text-[#3B82F6]">Nitz Digital</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            A Nitz Digital nasceu com um propósito claro: simplificar o acesso ao crédito
            e ajudar pessoas a conquistarem autonomia financeira com segurança,
            transparência e tecnologia.
          </motion.p>
        </div>
      </section>

      {/* NOSSA HISTÓRIA */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A2540] mb-6">
              Transformando crédito em oportunidade
            </h2>
            <p className="text-[#475569] text-lg leading-relaxed mb-6">
              Acreditamos que o crédito é mais do que números e contratos. É um instrumento
              de transformação — um meio de realizar sonhos e alcançar estabilidade.
              Por isso, unimos tecnologia, dados e atendimento humano para entregar uma
              experiência simples, rápida e confiável.
            </p>
            <p className="text-[#475569] text-lg leading-relaxed">
              Com parcerias sólidas e uma estrutura digital moderna, a Nitz conecta pessoas
              e instituições financeiras com eficiência, clareza e propósito. Somos o elo
              entre o cliente e as melhores oportunidades do mercado.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(15,23,42,0.08)]">
              <img
                src={equipe}
                alt="Equipe Nitz Digital"
                className="w-full h-[420px] object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="py-24 bg-[#F9FAFB] text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-[#0A2540] mb-16"
        >
          Nossos diferenciais
        </motion.h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 px-6 md:px-10">
          {[
            {
              title: "Transparência e Confiança",
              text: "Processos claros, comunicação direta e zero letras miúdas. Você entende cada etapa da sua jornada financeira.",
            },
            {
              title: "Tecnologia que aproxima",
              text: "Automação e inteligência de dados a serviço das pessoas, não o contrário. Simplificamos o acesso sem perder o toque humano.",
            },
            {
              title: "Parcerias sólidas",
              text: "Trabalhamos com os principais bancos e instituições do Brasil, garantindo segurança e diversidade de ofertas.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-white rounded-2xl p-10 shadow-[0_8px_30px_rgba(15,23,42,0.08)] hover:shadow-[0_12px_40px_rgba(15,23,42,0.12)] border-t-4 border-[#3B82F6] transition-all duration-300"
            >
              <h3 className="text-2xl font-bold text-[#0A2540] mb-4">
                {item.title}
              </h3>
              <p className="text-[#475569] leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MISSÃO, VISÃO E VALORES */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold text-[#0A2540] mb-16"
          >
            Nossa essência
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-10 text-left md:text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#F9FAFB] rounded-2xl p-10 shadow-[0_8px_30px_rgba(15,23,42,0.08)]"
            >
              <h3 className="text-2xl font-bold text-[#3B82F6] mb-3">Missão</h3>
              <p className="text-[#475569] leading-relaxed">
                Tornar o crédito mais acessível, humano e inteligente — ajudando pessoas a
                conquistarem liberdade financeira com segurança e clareza.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-[#F9FAFB] rounded-2xl p-10 shadow-[0_8px_30px_rgba(15,23,42,0.08)]"
            >
              <h3 className="text-2xl font-bold text-[#3B82F6] mb-3">Visão</h3>
              <p className="text-[#475569] leading-relaxed">
                Ser referência em crédito digital no Brasil, reconhecida pela confiança,
                inovação e impacto positivo na vida financeira das pessoas.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-[#F9FAFB] rounded-2xl p-10 shadow-[0_8px_30px_rgba(15,23,42,0.08)]"
            >
              <h3 className="text-2xl font-bold text-[#3B82F6] mb-3">Valores</h3>
              <ul className="text-[#475569] leading-relaxed space-y-2">
                <li>• Transparência e ética em tudo o que fazemos.</li>
                <li>• Inovação guiada por propósito.</li>
                <li>• Respeito e empatia em cada atendimento.</li>
                <li>• Excelência e comprometimento com resultados.</li>
              </ul>
            </motion.div>
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
          Nitz Digital — crédito que liberta, conecta e transforma.
        </motion.h2>
        <p className="text-[#CBD5E1] max-w-2xl mx-auto mb-8 text-lg">
          Mais do que uma plataforma de crédito, somos um parceiro na sua jornada
          financeira. Transparente, humano e digital.
        </p>
      </section>
    </main>
  );
};

export default Sobre;
