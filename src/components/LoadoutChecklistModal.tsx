import React, { useState } from 'react';
import { tacticalAudio } from '../utils/audio';

interface LoadoutChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChecklistItem {
  id: string;
  category: 'protection' | 'replica' | 'milsim' | 'survival';
  categoryLabel: string;
  title: string;
  desc: string;
  required: boolean;
  checked: boolean;
}

const INITIAL_ITEMS: ChecklistItem[] = [
  // Protection
  {
    id: 'goggles',
    category: 'protection',
    categoryLabel: 'Protection Balistique & Corporelle',
    title: 'Lunettes Oculaires EN166B / ANSI Z87+',
    desc: 'Obligatoire sans exception. Norme anti-impact éprouvée, pas de lunettes de soleil civiles.',
    required: true,
    checked: true,
  },
  {
    id: 'mask',
    category: 'protection',
    categoryLabel: 'Protection Balistique & Corporelle',
    title: 'Masque Bas de Visage Grillagé (Stalker)',
    desc: 'Protège les dents et les pommettes lors des engagements rapprochés.',
    required: true,
    checked: true,
  },
  {
    id: 'boots',
    category: 'protection',
    categoryLabel: 'Protection Balistique & Corporelle',
    title: 'Chaussures à Tige Montante (Rangers / Rando)',
    desc: 'Obligatoire sur terrain accidenté en sous-bois pour éviter les entorses.',
    required: true,
    checked: false,
  },
  {
    id: 'gloves',
    category: 'protection',
    categoryLabel: 'Protection Balistique & Corporelle',
    title: 'Gants Tactiques Coqués ou Renforcés',
    desc: 'Recommandé pour manipuler la végétation et les répliques en sécurité.',
    required: false,
    checked: false,
  },

  // Répliques
  {
    id: 'replica_chrono',
    category: 'replica',
    categoryLabel: 'Répliques & Munitions Homologuées',
    title: 'Réplique Principale Révisée (≤ 1.14 Joules)',
    desc: 'Passage chronographe systématique en zone neutre avant début de partie.',
    required: true,
    checked: true,
  },
  {
    id: 'bio_bbs',
    category: 'replica',
    categoryLabel: 'Répliques & Munitions Homologuées',
    title: 'Billes 100% Biodégradables (Certifiées)',
    desc: 'Billes plastiques strictes formellement interdites sur tout le domaine FOST.',
    required: true,
    checked: true,
  },
  {
    id: 'midcap',
    category: 'replica',
    categoryLabel: 'Répliques & Munitions Homologuées',
    title: 'Chargeurs Mid-Cap (Pas de molette / Hi-Cap)',
    desc: 'Pour l\'immersion MilSim et l\'égalité de tir entre opérateurs.',
    required: false,
    checked: false,
  },
  {
    id: 'batteries',
    category: 'replica',
    categoryLabel: 'Répliques & Munitions Homologuées',
    title: 'Batteries LiPo Chargées x2 + Sac Ignifuge',
    desc: 'Prévoir un accumulateur de rechange pour les parties longues ou nocturnes.',
    required: true,
    checked: false,
  },

  // MilSim & Signalisation
  {
    id: 'dead_rag',
    category: 'milsim',
    categoryLabel: 'Signalisation & Fair-Play',
    title: 'Chiffon Rouge (Dead Rag) ou Flash Rouge Nocturne',
    desc: 'À sortir immédiatement dès qu\'on est touché pour stopper les tirs ennemis.',
    required: true,
    checked: true,
  },
  {
    id: 'radio_pmr',
    category: 'milsim',
    categoryLabel: 'Signalisation & Fair-Play',
    title: 'Radio PMR-446 Réglée sur Canal FOST',
    desc: 'Canal 1 pour la stratégie, Canal 5 pour sécurité organisation.',
    required: false,
    checked: true,
  },
  {
    id: 'whistle',
    category: 'milsim',
    categoryLabel: 'Signalisation & Fair-Play',
    title: 'Sifflet de Sécurité (Arrêt de Jeu)',
    desc: '3 coups de sifflet prolongés = arrêt de jeu immédiat en cas d\'incident réel.',
    required: true,
    checked: false,
  },

  // Logistique & Survie
  {
    id: 'water',
    category: 'survival',
    categoryLabel: 'Logistique & Hydratation',
    title: 'Gourde ou Poche à Eau (Minimum 1.5L)',
    desc: 'Hydratation continue indispensable été comme hiver sur 25 hectares.',
    required: true,
    checked: true,
  },
  {
    id: 'first_aid',
    category: 'survival',
    categoryLabel: 'Logistique & Hydratation',
    title: 'Trousse de Premiers Soins Individuelle (IFAK)',
    desc: 'Pansements, désinfectant, bande de contention et couverture de survie.',
    required: false,
    checked: false,
  },
];

export const LoadoutChecklistModal: React.FC<LoadoutChecklistModalProps> = ({ isOpen, onClose }) => {
  const [items, setItems] = useState<ChecklistItem[]>(INITIAL_ITEMS);

  if (!isOpen) return null;

  const toggleItem = (id: string) => {
    tacticalAudio.playClick();
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleCheckAll = () => {
    tacticalAudio.playConfirm();
    setItems((prev) => prev.map((item) => ({ ...item, checked: true })));
  };

  const handleReset = () => {
    tacticalAudio.playClick();
    setItems((prev) => prev.map((item) => ({ ...item, checked: false })));
  };

  const checkedCount = items.filter((i) => i.checked).length;
  const progressPercent = Math.round((checkedCount / items.length) * 100);

  const requiredItems = items.filter((i) => i.required);
  const requiredChecked = requiredItems.filter((i) => i.checked).length;
  const allRequiredReady = requiredChecked === requiredItems.length;

  // Group by category
  const categories = Array.from(new Set(items.map((i) => i.categoryLabel)));

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
                checklist
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Space_Grotesk'] text-sm font-bold uppercase tracking-wider text-[#E2E3DF]">
                  Kitlist Opérateur // Checklist OP
                </span>
                <span className={`px-1.5 py-0.2 text-[10px] font-mono rounded font-bold ${
                  allRequiredReady ? 'bg-[#2ECC71]/20 text-[#2ECC71]' : 'bg-[#E87A1E]/20 text-[#E87A1E]'
                }`}>
                  {allRequiredReady ? 'ÉQUIPEMENT PRÊT' : 'INCOMPLET'}
                </span>
              </div>
              <p className="font-mono text-[10px] text-[#8E9297]">
                CONTRÔLE DU MATÉRIEL AVANT LE DÉPART SUR THÉÂTRE D'OPÉRATIONS
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

        {/* Progress bar banner */}
        <div className="px-5 py-3 bg-[#16181A] border-b border-[#282a2c] flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#8E9297] uppercase">Préparation du Pack de Mission :</span>
            <span className="text-[#E87A1E] font-bold">
              {checkedCount} / {items.length} éléments ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-[#1A1D20] h-2 rounded-full overflow-hidden border border-[#282a2c]">
            <div
              className={`h-full transition-all duration-300 ${
                progressPercent === 100 ? 'bg-[#2ECC71]' : 'bg-[#E87A1E]'
              }`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-[#8E9297]">
            <span>{requiredChecked}/{requiredItems.length} indispensables de sécurité cochés</span>
            <div className="flex gap-2">
              <button
                onClick={handleCheckAll}
                className="text-[#2ECC71] hover:underline cursor-pointer"
              >
                Tout cocher
              </button>
              <span>•</span>
              <button
                onClick={handleReset}
                className="text-[#8E9297] hover:underline cursor-pointer"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Checklist items list */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {categories.map((catLabel) => {
            const catItems = items.filter((i) => i.categoryLabel === catLabel);
            return (
              <div key={catLabel} className="bg-[#16181A] rounded border border-[#282a2c] overflow-hidden">
                <div className="px-3.5 py-2 bg-[#1A1D20] border-b border-[#282a2c] text-xs font-mono font-bold uppercase text-[#AECFB2] flex items-center justify-between">
                  <span>{catLabel}</span>
                  <span className="text-[10px] text-[#8E9297]">
                    {catItems.filter((i) => i.checked).length} / {catItems.length}
                  </span>
                </div>
                <div className="divide-y divide-[#282a2c]/60">
                  {catItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className="p-3 flex items-start gap-3 hover:bg-[#1E2022] transition-colors cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => {}}
                        className="mt-0.5 accent-[#E87A1E] w-4 h-4 rounded cursor-pointer shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-mono font-semibold ${item.checked ? 'text-[#E2E3DF] line-through opacity-70' : 'text-[#E2E3DF]'}`}>
                            {item.title}
                          </span>
                          {item.required && (
                            <span className="text-[9px] px-1.5 py-0.2 bg-[#E74C3C]/20 text-[#E74C3C] font-mono rounded font-bold uppercase">
                              OBLIGATOIRE
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#8E9297] mt-0.5 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-[#16181A] border-t border-[#282a2c] flex items-center justify-between text-[11px] font-mono text-[#8E9297]">
          <span>Tout manquement à la protection oculaire entraîne l'exclusion immédiate.</span>
          <button
            onClick={() => {
              tacticalAudio.playConfirm();
              onClose();
            }}
            className="px-3 py-1.5 bg-[#E87A1E] text-[#111315] font-bold rounded uppercase hover:brightness-110 cursor-pointer"
          >
            Valider mon Pack
          </button>
        </div>
      </div>
    </div>
  );
};
