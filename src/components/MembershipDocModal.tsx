import React, { useState } from 'react';
import { FOST_LEGAL_INFO } from '../data/fostData';

interface MembershipDocModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTier?: 'test' | 'standard' | 'premium';
}

export const MembershipDocModal: React.FC<MembershipDocModalProps> = ({
  isOpen,
  onClose,
  activeTier = 'standard'
}) => {
  const [docType, setDocType] = useState<'majeur' | 'mineur' | 'image'>('majeur');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl bg-[#111315] border border-[#333537] rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header HUD */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#1A1D20] border-b border-[#333537]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#22262B] border border-[#E87A1E]/40 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#E87A1E] text-lg">
                description
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Space_Grotesk'] text-sm font-bold uppercase tracking-wider text-[#E2E3DF]">
                  Fiche Officielle d'Adhésion FOST // {FOST_LEGAL_INFO.saison}
                </span>
                <span className="px-1.5 py-0.2 bg-[#2ECC71]/20 text-[#2ECC71] text-[10px] font-mono rounded font-bold">
                  HOMOLOGUÉ
                </span>
              </div>
              <p className="font-mono text-[10px] text-[#8E9297]">
                {FOST_LEGAL_INFO.associationName} • {FOST_LEGAL_INFO.tribunal}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-2.5 py-1 bg-[#22262B] hover:bg-[#333537] text-[#E2E3DF] text-xs font-mono rounded border border-[#333537] flex items-center gap-1 cursor-pointer transition-colors"
              title="Imprimer le document officiel"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              <span className="hidden sm:inline">Imprimer</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded bg-[#22262B] hover:bg-[#333537] text-[#8E9297] hover:text-[#E2E3DF] flex items-center justify-center transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-[#282a2c] bg-[#16181A] px-4 pt-2 gap-2 text-xs font-mono">
          <button
            onClick={() => setDocType('majeur')}
            className={`py-2 px-3 border-b-2 font-bold transition-colors cursor-pointer ${
              docType === 'majeur'
                ? 'border-[#E87A1E] text-[#E87A1E] bg-[#1A1D20]'
                : 'border-transparent text-[#8E9297] hover:text-[#E2E3DF]'
            }`}
          >
            Fiche Adhésion Majeur
          </button>
          <button
            onClick={() => setDocType('mineur')}
            className={`py-2 px-3 border-b-2 font-bold transition-colors cursor-pointer ${
              docType === 'mineur'
                ? 'border-[#E87A1E] text-[#E87A1E] bg-[#1A1D20]'
                : 'border-transparent text-[#8E9297] hover:text-[#E2E3DF]'
            }`}
          >
            Fiche Adhésion Mineur (&le; 0.08J)
          </button>
          <button
            onClick={() => setDocType('image')}
            className={`py-2 px-3 border-b-2 font-bold transition-colors cursor-pointer ${
              docType === 'image'
                ? 'border-[#E87A1E] text-[#E87A1E] bg-[#1A1D20]'
                : 'border-transparent text-[#8E9297] hover:text-[#E2E3DF]'
            }`}
          >
            Droit à l'Image & RGPD
          </button>
        </div>

        {/* Document Body (Clean Printable Layout) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-[#E2E2E5] font-['Inter'] text-xs leading-relaxed bg-[#141618]">
          {/* Header of paper */}
          <div className="border border-[#282a2c] p-4 bg-[#1A1D20] rounded space-y-2">
            <div className="text-center font-mono space-y-1">
              <h2 className="font-bold text-sm tracking-wide text-[#E87A1E] uppercase">
                {FOST_LEGAL_INFO.associationName}
              </h2>
              <p className="text-[11px] text-[#8E9297]">
                Siège social : {FOST_LEGAL_INFO.siegeSocial}
              </p>
              <p className="text-[11px] text-[#AECFB2]">
                {FOST_LEGAL_INFO.tribunal}
              </p>
              <div className="pt-2">
                <span className="inline-block px-3 py-1 bg-[#111315] border border-[#E87A1E]/40 text-[#E2E3DF] text-xs font-bold uppercase tracking-wider rounded">
                  {docType === 'majeur' && "FICHE D'ADHÉSION – SAISON 2026"}
                  {docType === 'mineur' && "FICHE D'ADHÉSION MEMBRE MINEUR – SAISON 2026"}
                  {docType === 'image' && "AUTORISATION DE DROIT À L'IMAGE & PROTECTION DES DONNÉES"}
                </span>
              </div>
            </div>

            {/* Official Cotisation reminder */}
            <div className="pt-2 border-t border-[#282a2c] flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
              <div>
                <span className="text-[#8E9297]">TARIFS OFFICIELS FOST : </span>
                <span className="text-[#2ECC71] font-bold">20,00 € / an (Membre)</span>
                <span className="text-[#8E9297]"> • </span>
                <span className="text-[#E87A1E] font-bold">80,00 € / an (Premium)</span>
                <span className="text-[#8E9297]"> • </span>
                <span className="text-[#38BDF8] font-bold">15,00 € (Test 6 mois)</span>
              </div>
              <span className="text-[#8E9297]">Email : {FOST_LEGAL_INFO.email}</span>
            </div>
          </div>

          {/* Section 1: Informations du membre */}
          {docType !== 'image' && (
            <div className="space-y-3 bg-[#181B1E] p-4 rounded border border-[#282a2c]">
              <h4 className="font-mono text-xs uppercase font-bold text-[#E87A1E] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E87A1E]"></span>
                1. INFORMATIONS DU MEMBRE {docType === 'mineur' && '(À remplir par le représentant légal)'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
                <div className="p-2 bg-[#111315] border border-[#282a2c] rounded">
                  <span className="text-[#8E9297] block">Nom & Prénom :</span>
                  <span className="text-[#E2E3DF] italic">......................................................</span>
                </div>
                <div className="p-2 bg-[#111315] border border-[#282a2c] rounded">
                  <span className="text-[#8E9297] block">Date de naissance :</span>
                  <span className="text-[#E2E3DF] italic">.... / .... / ........</span>
                </div>
                <div className="p-2 bg-[#111315] border border-[#282a2c] rounded sm:col-span-2">
                  <span className="text-[#8E9297] block">Adresse du domicile :</span>
                  <span className="text-[#E2E3DF] italic">............................................................................................................</span>
                </div>
                <div className="p-2 bg-[#111315] border border-[#282a2c] rounded">
                  <span className="text-[#8E9297] block">Téléphone {docType === 'mineur' ? 'Urgence (24h24)' : ''} :</span>
                  <span className="text-[#E2E3DF] italic">......................................................</span>
                </div>
                <div className="p-2 bg-[#111315] border border-[#282a2c] rounded">
                  <span className="text-[#8E9297] block">Email de contact :</span>
                  <span className="text-[#E2E3DF] italic">......................................................</span>
                </div>
                {docType === 'mineur' && (
                  <>
                    <div className="p-2 bg-[#111315] border border-[#282a2c] rounded">
                      <span className="text-[#8E9297] block">Représentant légal [Nom & Prénom] :</span>
                      <span className="text-[#E2E3DF] italic">......................................................</span>
                    </div>
                    <div className="p-2 bg-[#111315] border border-[#282a2c] rounded">
                      <span className="text-[#8E9297] block">Qualité [Père / Mère / Tuteur] :</span>
                      <span className="text-[#E2E3DF] italic">......................................................</span>
                    </div>
                  </>
                )}
                {docType === 'majeur' && (
                  <div className="p-2 bg-[#111315] border border-[#282a2c] rounded sm:col-span-2">
                    <span className="text-[#8E9297] block">Compétences particulières (secourisme, bricolage, vidéo, arbitrage) :</span>
                    <span className="text-[#E2E3DF] italic">............................................................................................................</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section 2: Parrainage */}
          {docType !== 'image' && (
            <div className="space-y-2 bg-[#181B1E] p-4 rounded border border-[#282a2c]">
              <h4 className="font-mono text-xs uppercase font-bold text-[#E87A1E] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E87A1E]"></span>
                2. PARRAINAGE (Obligatoire pour les nouveaux membres)
              </h4>
              <p className="text-[11px] text-[#8E9297]">
                Tout nouveau membre doit être recommandé par un membre actif de l'association (ex: Ilyane, Sofiane, Ilian, Noah, Luciano ou un parrain certifié).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px] pt-1">
                <div className="p-2 bg-[#111315] border border-[#282a2c] rounded">
                  <span className="text-[#8E9297] block">Nom du Parrain :</span>
                  <span className="text-[#E2E3DF] italic">......................................................</span>
                </div>
                <div className="p-2 bg-[#111315] border border-[#282a2c] rounded">
                  <span className="text-[#8E9297] block">Signature du Parrain :</span>
                  <span className="text-[#8E9297] italic">[Mention "Recommandé"]</span>
                </div>
              </div>
            </div>
          )}

          {/* Mineur Specific : Rappel légal et E.P.I. */}
          {docType === 'mineur' && (
            <div className="space-y-3 bg-[#181B1E] p-4 rounded border border-[#E74C3C]/40">
              <h4 className="font-mono text-xs uppercase font-bold text-[#E74C3C] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E74C3C]"></span>
                3. SÉCURITÉ, DÉCRET N° 99-240 & ÉQUIPEMENTS (E.P.I.) OBLIGATOIRES
              </h4>
              <p className="text-[11px] text-[#E2E3DF]">
                La mise à disposition de répliques développant une énergie à la bouche supérieure à <strong>0,08 Joule</strong> est strictement interdite aux mineurs. Le mineur participera uniquement avec matériel adapté (&le; 0,08J) ou dans un rôle de soutien sécurisé sans réplique.
              </p>
              <div className="text-[11px] space-y-1 text-[#8E9297] bg-[#111315] p-3 rounded border border-[#282a2c]">
                <div>• <strong>Protection oculaire et faciale</strong> : Masque intégral rigide balistique (EN 166 B au minimum).</div>
                <div>• <strong>Chaussures montantes</strong> : Chaussures de randonnée avec maintien rigide de la cheville (baskets interdites).</div>
                <div>• <strong>Mains & Articulations</strong> : Gants renforcés intégraux, genouillères et coudières tactiques.</div>
                <div>• <strong>Tenue</strong> : Vêtements épais couvrant 100% de la peau (manches longues et pantalons robustes).</div>
              </div>
            </div>
          )}

          {/* Droit à l'image & RGPD */}
          <div className="space-y-2 bg-[#181B1E] p-4 rounded border border-[#282a2c]">
            <h4 className="font-mono text-xs uppercase font-bold text-[#AECFB2] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#AECFB2]"></span>
              {docType === 'image' ? '1. CESSION DE DROIT À L\'IMAGE & 2. RGPD' : 'DROIT À L\'IMAGE & PROTECTION DES DONNÉES (RGPD)'}
            </h4>
            <p className="text-[11px] text-[#8E9297]">
              J'autorise l'association F.O.S.T. à photographier et filmer lors des événements, et à diffuser à titre gracieux sur : Site officiel, Réseaux sociaux (Instagram, Discord, YouTube) et supports promotionnels.
            </p>
            <p className="text-[11px] text-[#8E9297]">
              Conservation des données pour gestion des adhésions et assurances. Exercice des droits d'accès et rectification auprès du Secrétaire à <strong>{FOST_LEGAL_INFO.email}</strong>.
            </p>
          </div>

          {/* Signatures box */}
          <div className="border border-[#282a2c] p-4 rounded bg-[#111315] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-[#8E9297]">
              <span>Fait à : ...................................................</span>
              <span>Le : ..... / ..... / 2026</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-[#16181A] rounded border border-[#282a2c]">
                <div className="text-[10px] font-mono uppercase text-[#8E9297] mb-1">
                  {docType === 'mineur' ? 'Signature Représentant Légal :' : 'Signature de l\'Adhérent :'}
                </div>
                <div className="text-[10px] text-[#8E9297] italic mb-6">
                  (Précédée de "Lu et approuvé, bon pour accord")
                </div>
                <div className="border-b border-[#333537] w-full"></div>
              </div>

              <div className="p-3 bg-[#16181A] rounded border border-[#282a2c]">
                <div className="text-[10px] font-mono uppercase text-[#8E9297] mb-1">
                  Cadre Réservé Administration FOST :
                </div>
                <div className="text-[10px] text-[#AECFB2] font-mono">
                  Cotisation réglée : [ ] 15€ [ ] 20€ [ ] 80€<br />
                  Mode : [ ] Espèces [ ] Virement [ ] Autre
                </div>
                <div className="border-b border-[#333537] w-full mt-4"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer controls */}
        <div className="p-3.5 bg-[#16181A] border-t border-[#282a2c] flex items-center justify-between text-xs font-mono">
          <span className="text-[#8E9297] hidden sm:inline">
            Vous pouvez également remplir le formulaire en ligne ci-dessous pour pré-valider votre inscription.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#E87A1E] text-[#111315] font-bold rounded uppercase hover:brightness-110 cursor-pointer ml-auto"
          >
            Fermer le Document
          </button>
        </div>
      </div>
    </div>
  );
};
