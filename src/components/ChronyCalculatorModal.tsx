import React, { useState } from 'react';
import { tacticalAudio } from '../utils/audio';

interface ChronyCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BB_WEIGHTS = [0.20, 0.23, 0.25, 0.28, 0.30, 0.32, 0.36, 0.40];

export const ChronyCalculatorModal: React.FC<ChronyCalculatorModalProps> = ({ isOpen, onClose }) => {
  const [bbWeight, setBbWeight] = useState<number>(0.20);
  const [fpsInput, setFpsInput] = useState<number>(345);
  const [replicaType, setReplicaType] = useState<'aeg' | 'cqb' | 'dmr' | 'bolt'>('aeg');

  if (!isOpen) return null;

  // Conversion calculations
  const velocityMs = fpsInput * 0.3048;
  const massKg = bbWeight / 1000;
  const joules = 0.5 * massKg * (velocityMs * velocityMs);
  const roundedJoules = Math.round(joules * 100) / 100;
  const roundedMs = Math.round(velocityMs * 10) / 10;

  // FOST Limits:
  // AEG Standard: 350 FPS (at 0.20g) -> 1.14 Joules
  // CQB: 300 FPS (at 0.20g) -> 0.84 Joules
  // DMR: 400 FPS (at 0.20g) -> 1.48 Joules (Semi-auto strict)
  // Bolt: 450 FPS (at 0.20g) -> 1.88 Joules
  const limits = {
    aeg: { maxJoules: 1.14, label: 'AEG / Fusil d\'Assaut', med: '5 Mètres (ou 0m en semi raisonné)', mode: 'Full / Burst / Semi autorisé' },
    cqb: { maxJoules: 0.84, label: 'CQB Intérieur Strict', med: '0 Mètre (Pan-t\'es-out si < 2m)', mode: 'Semi-Automatique strict' },
    dmr: { maxJoules: 1.48, label: 'Anti-Snipe (DMR)', med: '15 Mètres obligatoire', mode: 'Bloqué mécaniquement en Semi' },
    bolt: { maxJoules: 1.88, label: 'Sniper à Verrou (Bolt)', med: '20 Mètres obligatoire', mode: 'Réarmement manuel' },
  };

  const currentLimit = limits[replicaType];
  const isCompliant = joules <= currentLimit.maxJoules;
  const excess = roundedJoules - currentLimit.maxJoules;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-[#111315] border border-[#333537] rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header HUD */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#1A1D20] border-b border-[#333537]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#22262B] border border-[#E87A1E]/40 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#E87A1E] text-lg">
                speed
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Space_Grotesk'] text-sm font-bold uppercase tracking-wider text-[#E2E3DF]">
                  Calculateur Chrony & Balistique FOST
                </span>
                <span className="px-1.5 py-0.2 bg-[#E87A1E]/20 text-[#E87A1E] text-[10px] font-mono rounded font-bold">
                  ROE AIRSOFT
                </span>
              </div>
              <p className="font-mono text-[10px] text-[#8E9297]">
                CONVERSION FPS ➔ JOULES & DISTANCE DE SÉCURITÉ (MED)
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              tacticalAudio.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded bg-[#22262B] hover:bg-[#333537] text-[#8E9297] hover:text-[#E2E3DF] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Replica selector */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#8E9297] mb-2">
              1. Catégorie de Réplique
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(limits) as Array<keyof typeof limits>).map((cat) => {
                const isActive = replicaType === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      tacticalAudio.playClick();
                      setReplicaType(cat);
                    }}
                    className={`p-2.5 rounded border text-left font-mono transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#1E2022] border-[#E87A1E] text-[#E2E3DF] shadow-[0_0_10px_rgba(232,122,30,0.25)]'
                        : 'bg-[#16181A] border-[#282a2c] text-[#8E9297] hover:text-[#E2E3DF]'
                    }`}
                  >
                    <div className="text-[11px] font-bold uppercase truncate">
                      {limits[cat].label}
                    </div>
                    <div className="text-[10px] text-[#E87A1E] mt-0.5">
                      Max {limits[cat].maxJoules} J
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sliders and inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#16181A] p-4 rounded border border-[#282a2c]">
            {/* FPS input */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="text-[#8E9297] uppercase">Vitesse mesurée (FPS) :</span>
                <span className="text-base font-bold text-[#E87A1E]">{fpsInput} FPS</span>
              </div>
              <input
                type="range"
                min="200"
                max="550"
                step="1"
                value={fpsInput}
                onChange={(e) => {
                  setFpsInput(Number(e.target.value));
                }}
                className="w-full accent-[#E87A1E] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#8E9297] mt-1">
                <span>200 FPS</span>
                <span>350 FPS (Assaut)</span>
                <span>450 FPS (Bolt)</span>
                <span>550 FPS</span>
              </div>
            </div>

            {/* BB weight input */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="text-[#8E9297] uppercase">Grammage bille :</span>
                <span className="text-base font-bold text-[#2ECC71]">{bbWeight.toFixed(2)} g</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 mt-2">
                {BB_WEIGHTS.map((w) => (
                  <button
                    key={w}
                    onClick={() => {
                      tacticalAudio.playClick();
                      setBbWeight(w);
                    }}
                    className={`py-1 text-center font-mono text-[11px] rounded border transition-colors cursor-pointer ${
                      bbWeight === w
                        ? 'bg-[#2ECC71]/20 border-[#2ECC71] text-[#2ECC71] font-bold'
                        : 'bg-[#1A1D20] border-[#282a2c] text-[#8E9297] hover:text-[#E2E3DF]'
                    }`}
                  >
                    {w.toFixed(2)}g
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Display HUD */}
          <div className={`p-4 rounded border-2 transition-all ${
            isCompliant
              ? 'bg-[#152319] border-[#2ECC71]/60'
              : 'bg-[#281517] border-[#E74C3C]/80'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-2xl ${isCompliant ? 'text-[#2ECC71]' : 'text-[#E74C3C]'}`}>
                    {isCompliant ? 'verified' : 'gpp_bad'}
                  </span>
                  <span className={`font-mono text-sm uppercase font-bold tracking-wider ${isCompliant ? 'text-[#2ECC71]' : 'text-[#E74C3C]'}`}>
                    {isCompliant ? 'RÉPLIQUE CONFORME // BRACELET VERT ATTRIBUÉ' : 'NON CONFORME // REFUSÉ AU CHRONY'}
                  </span>
                </div>
                <p className="font-mono text-xs text-[#E2E3DF] mt-1">
                  {isCompliant
                    ? `Votre réplique respecte la limite de ${currentLimit.maxJoules} Joules pour la catégorie ${currentLimit.label}.`
                    : `Dépassement de +${excess.toFixed(2)} Joules ! La réplique doit être bridée (ressort plus faible ou NPAS/régulateur HPA) avant accès au terrain.`}
                </p>
              </div>

              {/* Energy Badge */}
              <div className="bg-[#111315] px-4 py-2.5 rounded border border-[#333537] text-right shrink-0">
                <div className="text-[10px] font-mono text-[#8E9297] uppercase">Énergie Développée</div>
                <div className="text-2xl font-bold font-mono text-[#E2E3DF]">
                  {roundedJoules} <span className="text-sm text-[#E87A1E]">JOULES</span>
                </div>
                <div className="text-[10px] font-mono text-[#8E9297]">
                  {roundedMs} m/s @ {bbWeight}g
                </div>
              </div>
            </div>

            {/* Tactical rules for this replica */}
            <div className="mt-4 pt-3 border-t border-black/40 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-black/30 p-2.5 rounded">
                <span className="text-[#8E9297] block text-[10px] uppercase">Distance Minimale d'Engagement (MED) :</span>
                <span className="text-[#E2E3DF] font-semibold">{currentLimit.med}</span>
              </div>
              <div className="bg-black/30 p-2.5 rounded">
                <span className="text-[#8E9297] block text-[10px] uppercase">Règle de tir autorisée :</span>
                <span className="text-[#E2E3DF] font-semibold">{currentLimit.mode}</span>
              </div>
            </div>
          </div>

          {/* Reference Table of FOST Association ROE */}
          <div className="bg-[#16181A] p-3.5 rounded border border-[#282a2c]">
            <div className="text-xs font-mono uppercase text-[#8E9297] mb-2 flex items-center justify-between">
              <span>Barème Officiel des Forces Opérationnelles FOST</span>
              <span className="text-[10px] text-[#AECFB2]">Mesure stricte Hop-up réglé</span>
            </div>
            <div className="overflow-x-auto text-[11px] font-mono">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#282a2c] text-[#8E9297]">
                    <th className="py-1 px-2">Catégorie</th>
                    <th className="py-1 px-2">Max Joules</th>
                    <th className="py-1 px-2">Équiv. 0.20g</th>
                    <th className="py-1 px-2">MED Sécurité</th>
                    <th className="py-1 px-2">Mode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#282a2c]/50 text-[#E2E3DF]">
                  <tr>
                    <td className="py-1.5 px-2 text-[#2ECC71] font-bold">CQB / Hangar</td>
                    <td className="py-1.5 px-2">0.84 J</td>
                    <td className="py-1.5 px-2">300 FPS</td>
                    <td className="py-1.5 px-2">0 mètre</td>
                    <td className="py-1.5 px-2 text-[#8E9297]">Semi strict</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 text-[#E87A1E] font-bold">AEG / Assaut / GBB</td>
                    <td className="py-1.5 px-2">1.14 J</td>
                    <td className="py-1.5 px-2">350 FPS</td>
                    <td className="py-1.5 px-2">5 mètres</td>
                    <td className="py-1.5 px-2 text-[#8E9297]">Rafales courtes</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 text-[#4AE183] font-bold">DMR (Anti-Snipe)</td>
                    <td className="py-1.5 px-2">1.48 J</td>
                    <td className="py-1.5 px-2">400 FPS</td>
                    <td className="py-1.5 px-2">15 mètres</td>
                    <td className="py-1.5 px-2 text-[#8E9297]">Semi verrouillé</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 text-[#38BDF8] font-bold">Bolt (Verrou)</td>
                    <td className="py-1.5 px-2">1.88 J</td>
                    <td className="py-1.5 px-2">450 FPS</td>
                    <td className="py-1.5 px-2">20 mètres</td>
                    <td className="py-1.5 px-2 text-[#8E9297]">Coup par coup</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#16181A] border-t border-[#282a2c] flex items-center justify-between text-[11px] font-mono text-[#8E9297]">
          <span>Législation Française : Limite légale absolue à 2.0 Joules (Décret n° 99-240)</span>
          <button
            onClick={() => {
              tacticalAudio.playClick();
              onClose();
            }}
            className="text-[#E87A1E] hover:underline font-bold"
          >
            Fermer le Calculateur
          </button>
        </div>
      </div>
    </div>
  );
};
