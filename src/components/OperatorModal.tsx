import React from 'react';
import { Operator } from '../data/fostData';

interface OperatorModalProps {
  operator: Operator | null;
  onClose: () => void;
  onSelectReplicaOrder: (modelName: string) => void;
}

export const OperatorModal: React.FC<OperatorModalProps> = ({
  operator,
  onClose,
  onSelectReplicaOrder
}) => {
  if (!operator) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111315]/95 backdrop-blur-xl overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#1A1D20] border border-[#333537] rounded shadow-[0_16px_48px_rgba(0,0,0,0.9)] overflow-hidden my-8">
        {/* Header HUD Strip */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#111315] border-b border-[#282a2c]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#E87A1E] rounded-full animate-pulse"></span>
            <span className="font-mono text-xs uppercase text-[#E87A1E] font-bold tracking-widest">
              DOSSIER MIL-SPEC // ID: {operator.code}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded bg-[#282a2c] hover:bg-[#333537] text-[#8E9297] hover:text-[#E2E3DF] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Operator Detailed Body */}
        <div className="p-6 flex flex-col md:flex-row gap-6">
          {/* Portrait Column */}
          <div className="w-full md:w-56 shrink-0 flex flex-col">
            <div className="relative aspect-[3/4] w-full rounded overflow-hidden bg-[#111315] border border-[#333537]">
              <img
                src={operator.image}
                alt={operator.name}
                className="w-full h-full object-cover object-top filter contrast-105"
              />
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                <span className="px-2 py-0.5 bg-[#E87A1E] text-[#111315] font-mono text-xs font-bold uppercase rounded shadow">
                  {operator.callsign}
                </span>
                <span className="px-2 py-0.5 bg-[#111315]/80 text-[#2ECC71] font-mono text-[10px] rounded backdrop-blur-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC71]"></span> {operator.status}
                </span>
              </div>
              <div className="absolute bottom-2 right-2 font-mono text-[10px] text-[#8E9297] bg-[#111315]/80 px-2 py-0.5 rounded">
                FOST-{operator.code}
              </div>
            </div>
            
            <div className="mt-3 p-2 bg-[#111315] border border-[#282a2c] rounded font-mono text-xs text-center text-[#AECFB2]">
              {operator.specsTag}
            </div>
          </div>

          {/* Intel Details Column */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-[#E2E3DF]">
                  {operator.name} "{operator.callsign}"
                </h3>
                <span className="px-2 py-0.5 bg-[#3B4D3F] text-[#B7CCB9] font-mono text-xs rounded uppercase">
                  {operator.category}
                </span>
              </div>
              <div className="font-mono text-xs text-[#E87A1E] font-semibold uppercase mb-3">
                {operator.role}
              </div>

              <p className="font-['Inter'] text-sm text-[#8E9297] leading-relaxed mb-4 bg-[#111315]/60 p-3 rounded border border-[#282a2c]">
                {operator.bio}
              </p>

              {/* Tactical Specs Grid */}
              <div className="space-y-2 font-mono text-xs bg-[#111315] p-3 rounded border border-[#282a2c]">
                <div className="flex justify-between items-center py-1 border-b border-[#282a2c]/60">
                  <span className="text-[#8E9297]">Réplique Principale :</span>
                  <span className="text-[#E2E3DF] font-semibold text-right">{operator.loadout}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#282a2c]/60">
                  <span className="text-[#8E9297]">Arme Secondaire :</span>
                  <span className="text-[#E2E3DF] text-right">{operator.secondary}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#282a2c]/60">
                  <span className="text-[#8E9297]">Camouflage / Pattern :</span>
                  <span className="text-[#AECFB2] text-right">{operator.camo}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#282a2c]/60">
                  <span className="text-[#8E9297]">Protection Balistique :</span>
                  <span className="text-[#E2E3DF] text-right">{operator.protection}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#282a2c]/60">
                  <span className="text-[#8E9297]">Puissance Chrony :</span>
                  <span className="text-[#2ECC71] font-bold text-right">{operator.joules}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[#8E9297]">Expérience Unité :</span>
                  <span className="text-[#E87A1E] text-right">{operator.experience}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-4 pt-3 border-t border-[#282a2c] flex items-center justify-between gap-3">
              <span className="font-mono text-[11px] text-[#8E9297]">
                Couleur favorite : <span className="text-[#E2E3DF]">{operator.favoriteColor}</span>
              </span>
              <button
                onClick={() => {
                  onClose();
                  onSelectReplicaOrder(operator.loadout);
                }}
                className="px-4 py-2 bg-[#E87A1E] text-[#111315] font-mono text-xs uppercase font-bold rounded hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">construction</span>
                Commander ce Loadout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
