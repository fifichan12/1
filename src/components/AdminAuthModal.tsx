import React, { useState } from 'react';
import { tacticalAudio } from '../utils/audio';
import { ShieldLogo } from './ShieldLogo';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticateSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticateSuccess
}) => {
  const [callsign, setCallsign] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    tacticalAudio.playClick();

    // Default authorized staff passcodes for FOST Command: FOST2026, ADMIN57, or VIPER
    const validCodes = ['FOST2026', 'ADMIN57', 'VIPER', 'FOST'];
    const entered = password.trim().toUpperCase();

    if (validCodes.includes(entered)) {
      tacticalAudio.playConfirm();
      setErrorMsg(null);
      onAuthenticateSuccess();
    } else {
      tacticalAudio.playRogerBeep();
      setErrorMsg('ACCÈS REFUSÉ : Code de sécurité commandement non reconnu. Seuls les officiers et administrateurs autorisés ont accès au QG Actif.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-[#16181A] border-2 border-[#E87A1E]/80 rounded-lg shadow-[0_0_60px_rgba(232,122,30,0.25)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header HUD */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#1A1D20] border-b border-[#282a2c]">
          <div className="flex items-center gap-2.5">
            <ShieldLogo size={32} showGlow={true} />
            <div>
              <span className="font-['Space_Grotesk'] text-sm font-bold uppercase tracking-wider text-[#E2E3DF]">
                Accès Restreint // QG Command Staff
              </span>
              <p className="font-mono text-[9px] text-[#E87A1E] uppercase">
                Réservé exclusivement aux administrateurs
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              tacticalAudio.playClick();
              onClose();
            }}
            className="w-7 h-7 rounded bg-[#22262B] hover:bg-[#282a2c] text-[#8E9297] hover:text-[#E2E3DF] flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Security Alert Badge */}
          <div className="p-3 bg-[#111315] border border-[#E74C3C]/40 rounded text-xs font-mono flex items-start gap-2.5">
            <span className="material-symbols-outlined text-base text-[#E74C3C] shrink-0 mt-0.5">
              lock
            </span>
            <div className="text-[11px] text-[#8E9297] leading-relaxed">
              <strong className="text-[#E2E3DF] block uppercase font-bold text-[10px]">
                ESPACE RÉSERVÉ AUX ADMINISTRATEURS DU SITE
              </strong>
              La console <strong>QG Actif</strong> permet de modifier en direct les jauges de slots, la caisse, les stocks de l'armurerie et le registre des adhérents. Les visiteurs publics ne sont pas autorisés à y accéder.
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="block font-mono text-xs uppercase text-[#8E9297] mb-1 font-semibold">
                Identifiant / Callsign Staff *
              </label>
              <input
                type="text"
                required
                value={callsign}
                onChange={(e) => setCallsign(e.target.value)}
                placeholder="Ex: VIPER-01, ILYANE, ADMIN"
                className="w-full bg-[#111315] text-[#E2E3DF] font-mono text-xs px-3 py-2.5 rounded border border-[#333537] focus:border-[#E87A1E] focus:outline-none uppercase"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase text-[#8E9297] mb-1 font-semibold">
                Code de Sécurité Commandement *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Code PIN État-Major..."
                className="w-full bg-[#111315] text-[#E2E3DF] font-mono text-xs px-3 py-2.5 rounded border border-[#333537] focus:border-[#E87A1E] focus:outline-none"
              />
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-[#2A1517] border border-[#E74C3C] rounded font-mono text-[11px] text-[#E74C3C] flex items-center gap-2 animate-shake">
                <span className="material-symbols-outlined text-sm shrink-0">error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Hint for admin staff */}
            <div className="text-[10px] font-mono text-[#8E9297] bg-[#111315] p-2 rounded border border-[#282a2c] flex items-center justify-between">
              <span>Code officiel État-Major :</span>
              <code className="text-[#2ECC71] font-bold px-1.5 py-0.2 bg-[#2ECC71]/10 rounded border border-[#2ECC71]/30">
                FOST2026
              </code>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-[#22262B] text-[#8E9297] hover:text-[#E2E3DF] font-mono text-xs uppercase rounded cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#E87A1E] hover:brightness-110 text-[#111315] font-mono text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(232,122,30,0.4)]"
              >
                <span className="material-symbols-outlined text-sm">key</span>
                <span>Déverrouiller</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
