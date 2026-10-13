import React, { useState, useEffect } from 'react';
import { PaymentItem } from './PaymentModal';
import { OperationEvent, OPERATIONS } from '../data/fostData';
import { useAuth } from '../contexts/AuthContext';

interface EnrollmentModalProps {
  isOpen: boolean;
  operations?: OperationEvent[];
  selectedOpId?: string;
  onClose: () => void;
  onSuccess: (summary: string) => void;
  onOpenPayment?: (item: PaymentItem) => void;
}

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
  isOpen,
  operations = OPERATIONS,
  selectedOpId,
  onClose,
  onSuccess,
  onOpenPayment
}) => {
  const { userProfile } = useAuth();
  const [opId, setOpId] = useState<string>(selectedOpId || operations[0]?.id || OPERATIONS[0].id);
  const [callsign, setCallsign] = useState(userProfile?.callsign || '');
  const [fullName, setFullName] = useState(userProfile?.displayName || '');
  const [age, setAge] = useState('24');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [faction, setFaction] = useState<'tan' | 'black'>('tan');
  const [isMember, setIsMember] = useState(userProfile ? userProfile.memberTier !== 'NON_MEMBRE' : false);
  const [memberCallsign, setMemberCallsign] = useState('');
  const [optPack, setOptPack] = useState(false);
  const [optEnergy, setOptEnergy] = useState(false);
  const [optFood, setOptFood] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);

  useEffect(() => {
    if (userProfile) {
      if (!callsign) setCallsign(userProfile.callsign);
      if (!fullName) setFullName(userProfile.displayName);
      if (!email) setEmail(userProfile.email);
      if (userProfile.phone && !phone) setPhone(userProfile.phone);
      setIsMember(userProfile.memberTier !== 'NON_MEMBRE');
    }
  }, [userProfile]);

  useEffect(() => {
    if (selectedOpId) {
      setOpId(selectedOpId);
    } else if (operations.length > 0 && !operations.find(o => o.id === opId)) {
      setOpId(operations[0].id);
    }
  }, [selectedOpId, operations]);

  if (!isOpen) return null;

  const currentOp = operations.find((op) => op.id === opId) || operations[0] || OPERATIONS[0];
  const basePrice = isMember ? 0 : 5;
  const totalPrice = basePrice + (optPack ? 15 : 0) + (optEnergy ? 5 : 0) + (optFood ? 6 : 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAgreed) return;

    if (totalPrice > 0 && onOpenPayment) {
      onOpenPayment({
        title: `Réservation Slot // ${currentOp.title}`,
        category: 'OPERATION',
        amount: totalPrice,
        description: `Créneau de jeu sur ${currentOp.title} (${isMember ? 'Membre' : 'Non-Membre'}) avec options logistiques incluses.`
      });
      onClose();
      return;
    }

    onSuccess(
      `Slot réservé pour ${callsign || fullName} sur ${currentOp.title}. Statut: ${isMember ? 'Membre FOST (0 €)' : 'Non-Membre (5 €)'}. Total: ${totalPrice},00 €. Briefing GPS expédié à ${email}.`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111315]/95 backdrop-blur-xl overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#1A1D20] border border-[#333537] rounded shadow-[0_16px_48px_rgba(0,0,0,0.9)] p-6 md:p-8 my-8">
        {/* Top Header */}
        <div className="flex items-start justify-between pb-4 mb-4 border-b border-[#282a2c]">
          <div>
            <div className="flex items-center gap-1.5 text-[#E87A1E]">
              <span className="material-symbols-outlined text-sm">badge</span>
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                ORDRE D'ENGAGEMENT // FORMULAIRE D'ENRÔLEMENT
              </span>
            </div>
            <h2 className="font-['Space_Grotesk'] text-2xl uppercase text-[#E2E3DF] font-bold mt-1">
              RÉSERVATION OPÉRATIONNELLE
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded bg-[#282a2c] hover:bg-[#333537] text-[#8E9297] hover:text-[#E2E3DF] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Step-by-Step Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. Operation Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs uppercase text-[#8E9297]">
              01. OPÉRATION SÉLECTIONNÉE
            </label>
            <select
              value={opId}
              onChange={(e) => setOpId(e.target.value)}
              className="w-full bg-[#111315] text-[#E2E3DF] font-mono text-xs p-3 rounded border border-[#333537] focus:border-[#E87A1E] focus:outline-none cursor-pointer"
            >
              {operations.map((op) => (
                <option key={op.id} value={op.id} disabled={op.isCompleted}>
                  {op.title} {op.isCompleted ? '— [MISSION TERMINÉE]' : '(Réservation : 5 € / 0 € Membre)'}
                </option>
              ))}
            </select>
          </div>

          {/* Member Status Selector (0€ vs 5€) */}
          <div className="bg-[#141618] p-3.5 rounded border border-[#282a2c]">
            <label className="font-mono text-xs uppercase text-[#8E9297] block mb-2 font-bold">
              02. STATUT D'ADHÉSION DU JOUEUR (TARIF SESSION)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label 
                className={`flex items-start gap-3 p-3 rounded border cursor-pointer transition-all ${
                  isMember 
                    ? 'bg-[#15241b] border-[#2ECC71] shadow-[0_0_12px_rgba(46,204,113,0.2)]' 
                    : 'bg-[#111315] border-[#282a2c] hover:bg-[#1a1c1e]'
                }`}
              >
                <input
                  type="radio"
                  name="membership-status"
                  checked={isMember}
                  onChange={() => setIsMember(true)}
                  className="mt-0.5 text-[#2ECC71] accent-[#2ECC71]"
                />
                <div className="flex flex-col">
                  <span className="font-mono text-xs font-bold text-[#2ECC71] flex items-center gap-1.5">
                    <span>MEMBRE ADHÉRENT FOST</span>
                    <span className="px-1.5 py-0.2 bg-[#2ECC71]/20 text-[#2ECC71] text-[10px] rounded font-bold">0,00 €</span>
                  </span>
                  <span className="text-[11px] text-[#8E9297] mt-0.5">
                    Session gratuite, incluse dans votre cotisation annuelle (20€ ou 80€)
                  </span>
                </div>
              </label>

              <label 
                className={`flex items-start gap-3 p-3 rounded border cursor-pointer transition-all ${
                  !isMember 
                    ? 'bg-[#22262B] border-[#E87A1E] shadow-[0_0_12px_rgba(232,122,30,0.2)]' 
                    : 'bg-[#111315] border-[#282a2c] hover:bg-[#1a1c1e]'
                }`}
              >
                <input
                  type="radio"
                  name="membership-status"
                  checked={!isMember}
                  onChange={() => setIsMember(false)}
                  className="mt-0.5 text-[#E87A1E] accent-[#E87A1E]"
                />
                <div className="flex flex-col">
                  <span className="font-mono text-xs font-bold text-[#E87A1E] flex items-center gap-1.5">
                    <span>NON-MEMBRE / EXTÉRIEUR</span>
                    <span className="px-1.5 py-0.2 bg-[#E87A1E]/20 text-[#E87A1E] text-[10px] rounded font-bold">5,00 €</span>
                  </span>
                  <span className="text-[11px] text-[#8E9297] mt-0.5">
                    PAF de réservation de session pour joueur invité extérieur
                  </span>
                </div>
              </label>
            </div>
            {isMember && (
              <div className="mt-2.5 pt-2 border-t border-[#282a2c] flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-[#2ECC71]">verified</span>
                <span className="font-mono text-[11px] text-[#AECFB2]">
                  Accès session validé à 0,00 € au titre de votre statut membre de l'association.
                </span>
              </div>
            )}
          </div>

          {/* 3. Operator Identity */}
          <div>
            <label className="font-mono text-xs uppercase text-[#8E9297] block mb-2">
              03. IDENTIFICATION DE L'OPÉRATEUR
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div>
                <span className="text-[11px] font-mono text-[#E87A1E] block mb-1">CALLSIGN / INDICATIF *</span>
                <input
                  type="text"
                  required
                  value={callsign}
                  onChange={(e) => setCallsign(e.target.value)}
                  placeholder="Ex: GHOST-04"
                  className="w-full bg-[#111315] text-[#E2E3DF] font-mono text-xs p-2.5 rounded border border-[#333537] focus:border-[#E87A1E] focus:outline-none uppercase"
                />
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#8E9297] block mb-1">NOM COMPLET *</span>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nom & Prénom"
                  className="w-full bg-[#111315] text-[#E2E3DF] font-['Inter'] text-xs p-2.5 rounded border border-[#333537] focus:border-[#E87A1E] focus:outline-none"
                />
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#8E9297] block mb-1">ÂGE (18+ MAJEUR REQUIS) *</span>
                <input
                  type="number"
                  min="18"
                  max="75"
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-[#111315] text-[#E2E3DF] font-mono text-xs p-2.5 rounded border border-[#333537] focus:border-[#E87A1E] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] font-mono text-[#8E9297] block mb-1">EMAIL POUR LE BRIEFING GPS *</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operateur@tactical.fr"
                  className="w-full bg-[#111315] text-[#E2E3DF] font-['Inter'] text-xs p-2.5 rounded border border-[#333537] focus:border-[#E87A1E] focus:outline-none"
                />
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#8E9297] block mb-1">NUMÉRO MOBILE URGENCE TERRAIN *</span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="06 00 00 00 00"
                  className="w-full bg-[#111315] text-[#E2E3DF] font-mono text-xs p-2.5 rounded border border-[#333537] focus:border-[#E87A1E] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 3. Faction Choice */}
          <div>
            <label className="font-mono text-xs uppercase text-[#8E9297] block mb-2">
              03. CHOIX DE FACTION & CAMOUFLAGE
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label 
                className={`flex items-center gap-3 p-3 rounded border cursor-pointer transition-colors ${
                  faction === 'tan' 
                    ? 'bg-[#22262B] border-[#E87A1E]' 
                    : 'bg-[#111315] border-[#282a2c] hover:bg-[#1a1c1e]'
                }`}
              >
                <input
                  type="radio"
                  name="faction"
                  value="tan"
                  checked={faction === 'tan'}
                  onChange={() => setFaction('tan')}
                  className="text-[#E87A1E] accent-[#E87A1E]"
                />
                <div className="flex flex-col">
                  <span className="font-mono text-xs font-bold text-[#E2E3DF]">TASK FORCE COALITION</span>
                  <span className="text-[11px] text-[#8E9297]">Camouflage Tan / Multicam / Desert / Marpat</span>
                </div>
              </label>

              <label 
                className={`flex items-center gap-3 p-3 rounded border cursor-pointer transition-colors ${
                  faction === 'black' 
                    ? 'bg-[#22262B] border-[#E87A1E]' 
                    : 'bg-[#111315] border-[#282a2c] hover:bg-[#1a1c1e]'
                }`}
              >
                <input
                  type="radio"
                  name="faction"
                  value="black"
                  checked={faction === 'black'}
                  onChange={() => setFaction('black')}
                  className="text-[#E87A1E] accent-[#E87A1E]"
                />
                <div className="flex flex-col">
                  <span className="font-mono text-xs font-bold text-[#E2E3DF]">MILICE SÉCESSIONNISTE</span>
                  <span className="text-[11px] text-[#8E9297]">Camouflage Noir / Vert Woodland / Tenue Civile</span>
                </div>
              </label>
            </div>
          </div>

          {/* 4. Logistics Add-ons */}
          <div>
            <label className="font-mono text-xs uppercase text-[#8E9297] block mb-2">
              04. MODULES LOGISTIQUES & ÉQUIPEMENT EN OPTION
            </label>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-2.5 bg-[#111315] border border-[#282a2c] rounded cursor-pointer hover:bg-[#1a1c1e]">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={optPack}
                    onChange={(e) => setOptPack(e.target.checked)}
                    className="accent-[#E87A1E] w-4 h-4"
                  />
                  <span className="font-['Inter'] text-xs text-[#E2E3DF]">
                    Pack Matériel Complet (Réplique AEG G&G révisée + Masque + 1000 BBs Bio)
                  </span>
                </div>
                <span className="font-mono text-xs text-[#E87A1E] font-bold">+15,00 €</span>
              </label>

              <label className="flex items-center justify-between p-2.5 bg-[#111315] border border-[#282a2c] rounded cursor-pointer hover:bg-[#1a1c1e]">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={optEnergy}
                    onChange={(e) => setOptEnergy(e.target.checked)}
                    className="accent-[#E87A1E] w-4 h-4"
                  />
                  <span className="font-['Inter'] text-xs text-[#E2E3DF]">
                    Bouteille Gaz Haute Pression 130 PSI ou Prêt Batterie LiPo de rechange
                  </span>
                </div>
                <span className="font-mono text-xs text-[#E87A1E] font-bold">+5,00 €</span>
              </label>

              <label className="flex items-center justify-between p-2.5 bg-[#111315] border border-[#282a2c] rounded cursor-pointer hover:bg-[#1a1c1e]">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={optFood}
                    onChange={(e) => setOptFood(e.target.checked)}
                    className="accent-[#E87A1E] w-4 h-4"
                  />
                  <span className="font-['Inter'] text-xs text-[#E2E3DF]">
                    Ravitaillement QG : Repas BBQ Chaud & Boisson Énergisante
                  </span>
                </div>
                <span className="font-mono text-xs text-[#E87A1E] font-bold">+6,00 €</span>
              </label>
            </div>
          </div>

          {/* 5. Charter & Agreement */}
          <div className="p-3 bg-[#1e2022] border border-[#333537] rounded">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mt-0.5 accent-[#2ECC71] w-4 h-4"
              />
              <div className="font-['Inter'] text-xs text-[#8E9297] leading-tight">
                Je confirme être majeur(e) de 18 ans révolus, certifie utiliser exclusivement des billes biodégradables, avoir pris connaissance du barème chronographe (AEG max 350 FPS) et m'engage à appliquer rigoureusement la règle du 'Out' franc et le fair-play tactique.
              </div>
            </label>
          </div>

          {/* Real-time Total Calculator & Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#111315] border border-[#282a2c] rounded">
            <div>
              <span className="font-mono text-xs text-[#8E9297] uppercase block">
                TOTAL DÛ À L'ENRÔLEMENT
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-[#E87A1E]">
                  {totalPrice},00 €
                </span>
                <span className="font-mono text-xs text-[#AECFB2]">
                  Paiement sur place ou CB sécurisée
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-[#1A1D20] text-[#8E9297] hover:text-[#E2E3DF] rounded font-mono text-xs uppercase transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-[#E87A1E] text-[#111315] font-mono text-xs uppercase font-bold tracking-wider rounded hover:brightness-110 active:scale-95 transition-all shadow-[0_0_16px_rgba(232,122,30,0.35)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">send</span>
                CONFIRMER & RECEVOIR LE BRIEFING GPS
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
