import React from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

type SimuladorPresencaProps = {
  banco: {
    id: string;
    nome: string;
    tipo: string;
    logo: string;
  };
  valores: Record<string, number>;
  parcelas: Record<string, number>;
  setValores: (val: any) => void;
  setParcelas: (val: any) => void;
  abrirPopup: () => void;
};

export default function SimuladorPresenca({
  banco,
  valores,
  parcelas,
  setValores,
  setParcelas,
  abrirPopup
}: SimuladorPresencaProps) {
  return (
    <>
      <div className="flex justify-between mb-2">
        <p>Valor desejado:</p>
        <p className="font-bold text-lg">
          R$ {valores[banco.id].toLocaleString("pt-BR")}
        </p>
      </div>

      <input
        type="range"
        min="500"
        max="30000"
        step="500"
        value={valores[banco.id]}
        onChange={(e) =>
          setValores((p: any) => ({ ...p, [banco.id]: Number(e.target.value) }))
        }
        className="w-full h-2 rounded-full bg-gray-200 mb-4"
      />

      <p className="mb-2">Parcelas:</p>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[6, 12, 18, 24].map((n) => (
          <button
            key={n}
            onClick={() =>
              setParcelas((p: any) => ({ ...p, [banco.id]: n }))
            }
            className={`py-2 rounded-lg border text-sm font-semibold ${
              parcelas[banco.id] === n
                ? "bg-[#2563EB] text-white"
                : "bg-white border-gray-300"
            }`}
          >
            {n}x
          </button>
        ))}
      </div>

      <motion.button
        onClick={abrirPopup}
        className="w-full bg-[#2563EB] text-white py-3 rounded-full flex items-center justify-center gap-2"
      >
        SIMULAR AGORA <ChevronRight className="w-5 h-5" />
      </motion.button>
    </>
  );
}
