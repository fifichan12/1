import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ShieldLogo } from './ShieldLogo';
import { tacticalAudio } from '../utils/audio';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQG?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenQG
}) => {
  const { userProfile, logout } = useAuth();

  if (!isOpen || !userProfile) return null;

  const handleLogout = async () => {
    tacticalAudio.playClick();
    await logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-[#16181A] border-2 border-[#E87A1E]/80 rounded-lg shadow-[0_0_60px_rgba(232,122,30,0.3)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header HUD */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#1A1D20] border-b border-[#282a2c]">
          <div className="flex items-center gap-2.5">
            <ShieldLogo size={32} showGlow={true} />
            <div>
              <span className="font-['Space_Grotesk'] text-sm font-bold uppercase tracking-wider text-[#E2E3DF]">
                Dossier Opérateur // Profil Actif
              </span>
              <p className="font-mono text-[9px] text-[#2ECC71] uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC71] animate-ping" />
                Connecté au Réseau FOST
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              tacticalAudio.playClick();
              onClose();
            }}
            className="w-7 h-7 rounded bg-[#22262B] hover:bg-[#282a2c] text-[#8E9297] hover:text-[#E2E3DF] flex items-center justify-center cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Profile Card Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Badge & Avatar Header */}
          <div className="flex items-start gap-4 p-4 bg-[#111315] border border-[#282a2c] rounded">
            <img
              src={userProfile.photoURL || 'https://lh3.googleusercontent.com/aida/AEtjO1XQ4NPkLyCWHlFwZY6vqbsOVRlZQJnE6fgc8YNbgs_-dlBFdlCcoQ7JaDzwhmuyA56e3etRIIzPnSesbEB8475B3iSe8z3rVXUu0eOz-GhoWZ7nDzwBFhtkmnxeSrFUCONzNkTorhFEoX_7nMRbnvBizPp_T7BLbrEW7j_Ip6aYUQfv7I9zTaho-5ja84qg7wSco0VPUxcaESzHdh8bt87zMS68ZvOHYoHIXgHoUglRxVhM3Nf3ZICOMz5kky7pMOGEb4qVQXJ7Gw'}
              alt={userProfile.callsign}
              className="w-16 h-16 rounded object-cover border-2 border-[#E87A1E]/80 shadow shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#E2E3DF] truncate">
                  {userProfile.displayName}
                </h3>
                {userProfile.isStaff && (
                  <span className="px-1.5 py-0.2 bg-[#E87A1E]/20 text-[#E87A1E] font-mono text-[9px] rounded font-bold border border-[#E87A1E]/40">
                    STAFF
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-0.5 font-mono text-xs">
                <span className="text-[#E87A1E] font-bold">[{userProfile.callsign}]</span>
                <span className="text-[#8E9297]">•</span>
                <span className="text-[#AECFB2]">{userProfile.role}</span>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#2ECC71]/20 text-[#2ECC71] font-mono text-[10px] rounded font-bold border border-[#2ECC71]/40">
                  {userProfile.memberTier === 'TITULAIRE'
                    ? 'MEMBRE TITULAIRE (0€ LES SESSIONS)'
                    : userProfile.memberTier === 'PREMIUM'
                    ? 'MEMBRE PREMIUM ÉLITE'
                    : userProfile.memberTier === 'TEST'
                    ? 'MEMBRE TEST (ESSAI)'
                    : 'INVITÉ EXTÉRIEUR'}
                </span>
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div className="space-y-1.5 font-mono text-xs bg-[#111315] p-3 rounded border border-[#282a2c]">
            <div className="flex justify-between py-1 border-b border-[#282a2c]">
              <span className="text-[#8E9297]">Email Identifiant :</span>
              <span className="text-[#E2E3DF] font-semibold truncate max-w-[220px]">{userProfile.email}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#282a2c]">
              <span className="text-[#8E9297]">Tarif Session Réservée :</span>
              <span className="text-[#2ECC71] font-bold">
                {userProfile.memberTier !== 'NON_MEMBRE' ? '0,00 € (Inclus dans adhésion)' : '5,00 € (Tarif Extérieur)'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#282a2c]">
              <span className="text-[#8E9297]">Statut Armurerie :</span>
              <span className="text-[#E87A1E]">Prêt Backup & Remise Cerakote Actifs</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#8E9297]">Canal Radio Attribué :</span>
              <span className="text-[#AECFB2]">PMR-446 CH.01 (446.00625 MHz)</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-2 pt-2">
            {userProfile.isStaff && onOpenQG && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenQG();
                }}
                className="w-full py-2.5 bg-[#22262B] hover:bg-[#282a2c] text-[#E87A1E] font-mono text-xs font-bold uppercase rounded border border-[#E87A1E]/40 flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-sm">dashboard</span>
                <span>Ouvrir Console QG Command Staff</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-2.5 bg-[#2A1517] hover:bg-[#3D1A1E] text-[#E74C3C] font-mono text-xs font-bold uppercase rounded border border-[#E74C3C]/50 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              <span>Se Déconnecter de la Session</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
