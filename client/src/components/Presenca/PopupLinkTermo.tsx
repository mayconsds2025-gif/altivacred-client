import React from "react";
import { motion, AnimatePresence } from "framer-motion";

type PopupLinkTermoProps = {
  link: string | null;
  fechar: () => void;
  abrirTermo: () => void;
};

export default function PopupLinkTermo(props: PopupLinkTermoProps) {
  const { link, fechar, abrirTermo } = props;

  return (
    <AnimatePresence>
      {link && (
        <motion.div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <motion.div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-8 text-center">
            <h2 className="text-xl font-bold mb-4">Autorização necessária</h2>
            <p className="text-gray-700 mb-4">Autorize a consulta de dados no sistema Dataprev</p>

            <a
              onClick={(e) => {
                e.preventDefault();
                abrirTermo();
              }}
              href={link}
              target="_blank"
              rel="noreferrer"
              className="block w-full bg-[#2563EB] text-white py-3 rounded-lg shadow font-semibold"
            >
              Autorizar e Assinar
            </a>

            <button
              onClick={fechar}
              className="mt-6 w-full bg-gray-200 py-3 rounded-lg"
            >
              Fechar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
