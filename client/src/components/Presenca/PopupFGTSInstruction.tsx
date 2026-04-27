import React, { useState, useEffect } from 'react';
import { X, Lock, Building2, CheckCircle2, Copy, Check, PlayCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
interface PopupFGTSInstructionProps {
  show: boolean;
  onClose: () => void;
  onContinue: () => void;
}

const bancosAutorizar = [
  "BMS SOCIEDADE DE CRÉDITO"
];

// --- Sub-component for the Bank Item ---
const BankItem = ({ name }: { name: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(name);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300"
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-50 text-[#0A2540] rounded-lg group-hover:bg-[#0A2540] group-hover:text-white transition-colors duration-300">
          <Building2 size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Instituição Parceira</span>
          <span className="font-bold text-[#0A2540] text-sm md:text-base">{name}</span>
        </div>
      </div>

      <button
        onClick={handleCopy}
        className="p-2 text-slate-400 hover:text-green-600 transition-colors"
        title="Copiar nome"
      >
        {copied ? <Check size={18} /> : <Copy size={18} />}
      </button>
    </motion.div>
  );
};

const PopupFGTSInstruction: React.FC<PopupFGTSInstructionProps> = ({
  show,
  onClose,
  onContinue,
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-all"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* --- Header --- */}
            <div className="flex-none px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100/50 rounded-full">
                  <Lock className="w-5 h-5 text-[#0A2540]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0A2540] leading-tight">
                    Autorização Necessária
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Libere o acesso para simularmos sua antecipação</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* --- Content (Scrollable) --- */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              
              {/* Step 1: Bank List (MOVED TO TOP) */}
              <section className="space-y-3">
                 <div className="flex items-center gap-2 mb-2">
                   <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0A2540] text-white text-xs font-bold">1</span>
                   <h3 className="font-semibold text-slate-800">Autorize este banco no App FGTS</h3>
                </div>
                
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                    Para que possamos calcular seu saldo, você precisa entrar no aplicativo do FGTS e autorizar a seguinte instituição:
                  </p>
                  
                  <div className="space-y-3">
                    {bancosAutorizar.map((banco, i) => (
                      <BankItem key={i} name={banco} />
                    ))}
                  </div>
                  
                  <div className="mt-4 flex items-start gap-3 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs md:text-sm text-amber-800 font-medium leading-snug">
                      Sem autorizar o banco <strong>BMS</strong>, a simulação não funcionará.
                    </p>
                  </div>
                </div>
              </section>

              {/* Step 2: Video (MOVED TO BOTTOM) */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                   <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-600 text-xs font-bold">2</span>
                   <h3 className="font-semibold text-slate-800">Não sabe como fazer? Assista o vídeo</h3>
                </div>
                
                <div className="relative group rounded-xl overflow-hidden bg-black shadow-lg ring-1 ring-slate-900/5">
                  <div className="aspect-video w-full">
                    <video
                      src="/videos/FGTS.mp4"
                      controls
                      className="w-full h-full object-contain bg-black"
                      playsInline
                    />
                  </div>
                  {/* Decorative Play Hint */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/10 group-hover:bg-transparent transition-all">
                    <PlayCircle className="w-12 h-12 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                  </div>
                </div>
              </section>

            </div>

            {/* --- Footer (Fixed) --- */}
            <div className="flex-none p-6 border-t border-slate-100 bg-white flex flex-col md:flex-row items-center justify-between gap-4">
              <button 
                onClick={onClose}
                className="text-sm font-semibold text-slate-500 hover:text-slate-800 px-4 py-2 order-2 md:order-1"
              >
                Cancelar
              </button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onContinue}
                className="w-full md:w-auto px-8 py-3.5 bg-[#0A2540] text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 hover:shadow-blue-900/30 hover:bg-[#0F355A] flex items-center justify-center gap-2 transition-all order-1 md:order-2"
              >
                <span>Já fiz a autorização</span>
                <CheckCircle2 size={18} />
              </motion.button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PopupFGTSInstruction;