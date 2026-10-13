import React from 'react';
import { OperationEvent } from '../data/fostData';

interface OpordModalProps {
  operation: OperationEvent | null;
  onClose: () => void;
  onEnroll: (op: OperationEvent) => void;
}

export const OpordModal: React.FC<OpordModalProps> = ({ operation, onClose, onEnroll }) => {
  if (!operation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111315]/95 backdrop-blur-xl overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#1A1D20] border border-[#333537] rounded shadow-[0_16px_48px_rgba(0,0,0,0.9)] overflow-hidden my-8">
        {/* Top Military Document Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#111315] border-b border-[#282a2c]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#E87A1E]">description</span>
            <span className="font-mono text-xs uppercase text-[#E87A1E] font-bold tracking-widest">
              ORDRE D'OPÉRATION OFFICIEL // {operation.code}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded bg-[#282a2c] hover:bg-[#333537] text-[#8E9297] hover:text-[#E2E3DF] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Document Content */}
        <div className="p-6 md:p-8 space-y-6 font-mono text-xs text-[#8E9297] bg-[#141719] max-h-[75vh] overflow-y-auto">
          {/* Classification Banner */}
          <div className="text-center py-1.5 bg-[#E87A1E]/10 border border-[#E87A1E]/30 text-[#E87A1E] font-bold tracking-widest uppercase">
            // DOCUMENT CLASSÉ DIFFUSION RESTREINTE // ESCADRON FOST 04
          </div>

          <div>
            <h2 className="font-['Space_Grotesk'] text-2xl text-[#E2E3DF] font-bold uppercase mb-1">
              {operation.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#AECFB2]">
              <span>DATE : {operation.specs.calendar}</span>
              <span>•</span>
              <span>SECTEUR : {operation.specs.location}</span>
              <span>•</span>
              <span>CANAL RADIO : PMR 446.00625 MHz (CH.01)</span>
            </div>
          </div>

          {/* Section 1: Situation */}
          <div className="p-4 bg-[#1A1D20] border border-[#282a2c] rounded">
            <h3 className="font-['Space_Grotesk'] text-sm text-[#E2E3DF] font-bold uppercase mb-2 text-[#E87A1E]">
              1. SITUATION TACTIQUE
            </h3>
            <p className="font-['Inter'] text-xs text-[#8E9297] leading-relaxed">
              {operation.description}
            </p>
          </div>

          {/* Section 2: Mission & Objectifs */}
          <div className="p-4 bg-[#1A1D20] border border-[#282a2c] rounded">
            <h3 className="font-['Space_Grotesk'] text-sm text-[#E2E3DF] font-bold uppercase mb-2 text-[#E87A1E]">
              2. DIRECTIVES D'ENGAGEMENT (R.O.E.)
            </h3>
            <ul className="space-y-1.5 list-disc list-inside text-xs text-[#E2E3DF]/90 font-['Inter']">
              <li><strong>Puissance balistique :</strong> {operation.specs.limitFps} mesuré à la 0.20g.</li>
              <li><strong>Règles Médic :</strong> {operation.specs.medic}.</li>
              <li><strong>Dotation munitions :</strong> {operation.specs.ammo}. Billes 100% biodégradables.</li>
              <li><strong>Protocole contact :</strong> {operation.specs.engagement}.</li>
              <li><strong>Règle du Out :</strong> Annonce franche 'OUT' à haute voix dès la première touche bille (corps ou réplique).</li>
            </ul>
          </div>

          {/* Section 3: Logistique & Intendance */}
          <div className="p-4 bg-[#1A1D20] border border-[#282a2c] rounded">
            <h3 className="font-['Space_Grotesk'] text-sm text-[#E2E3DF] font-bold uppercase mb-2 text-[#E87A1E]">
              3. SOUTIEN LOGISTIQUE & TERRAIN
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#8E9297] block">Participation aux Frais (PAF) :</span>
                <span className="text-[#E2E3DF] font-bold">5,00 € (0,00 € pour les Membres Adhérents FOST)</span>
              </div>
              <div>
                <span className="text-[#8E9297] block">Capacité Tactique :</span>
                <span className="text-[#2ECC71] font-bold">{operation.bookedSlots} / {operation.maxSlots} Joueurs</span>
              </div>
              <div>
                <span className="text-[#8E9297] block">Équipement obligatoire :</span>
                <span className="text-[#E2E3DF]">{operation.specs.requirement}</span>
              </div>
              <div>
                <span className="text-[#8E9297] block">Sécurité médicale :</span>
                <span className="text-[#2ECC71]">Trousse IFAK Safe Zone + Tél SAMU 15 / 112</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#111315] border-t border-[#282a2c] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              window.print();
            }}
            className="px-4 py-2 bg-[#1A1D20] text-[#8E9297] hover:text-[#E2E3DF] border border-[#333537] rounded font-mono text-xs uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">print</span>
            Imprimer l'Ordre de Mission
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#282a2c] text-[#8E9297] hover:text-[#E2E3DF] rounded font-mono text-xs uppercase transition-colors cursor-pointer"
            >
              Fermer
            </button>
            <button
              onClick={() => {
                onClose();
                onEnroll(operation);
              }}
              className="px-5 py-2 bg-[#E87A1E] text-[#111315] font-mono text-xs uppercase font-bold rounded hover:brightness-110 transition-all shadow-[0_0_12px_rgba(232,122,30,0.35)] flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">how_to_reg</span>
              Réserver mon Slot sur cette OP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
