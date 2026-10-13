import React, { useState } from 'react';
import { ShieldLogo } from './ShieldLogo';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdminOpen: boolean;
  isAdminAuthenticated: boolean;
  onAdminClick: () => void;
  onJoinClick: () => void;
  onOpenRadio: () => void;
  onOpenChrony: () => void;
  onOpenChecklist: () => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onOpenProfile: () => void;
  siteName?: string;
  unitName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isAdminOpen,
  isAdminAuthenticated,
  onAdminClick,
  onJoinClick,
  onOpenRadio,
  onOpenChrony,
  onOpenChecklist,
  onOpenAuth,
  onOpenProfile,
  siteName = 'FOST AIRSOFT',
  unitName = 'Forces Opérationnelles Spéciales Tactiques'
}) => {
  const { userProfile, logout } = useAuth();
  const { totalCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sfxEnabled, setSfxEnabled] = useState(true);

  const toggleSfx = () => {
    import('../utils/audio').then(({ tacticalAudio }) => {
      const state = tacticalAudio.toggle();
      setSfxEnabled(state);
    });
  };

  const navItems = [
    { id: 'accueil', label: 'Accueil' },
    { id: 'roster', label: "L'Escouade" },
    { id: 'armurerie', label: 'Armurerie' },
    { id: 'operations', label: 'Opérations' },
    { id: 'tarifs', label: 'Tarifs & Adhésion' },
    { id: 'contact', label: 'QG & Terrain' },
    { id: 'faq', label: 'FAQ' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    if (isAdminOpen) onAdminClick();

    const el = document.getElementById(id) || (id === 'tarifs' ? document.getElementById('tarifs-adhesion') : null);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-[#111315]/95 backdrop-blur-xl border-b border-[#333537]/60 shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
      {/* Top micro telemetry bar (responsive on md+) */}
      <div className="hidden md:flex items-center justify-between px-4 sm:px-6 lg:px-8 py-1 bg-[#090b0c] border-b border-[#282a2c]/60 text-[10px] font-mono text-[#8E9297]">
        <div className="flex items-center gap-3 sm:gap-4 truncate">
          <span className="flex items-center gap-1.5 text-[#2ECC71] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC71] animate-ping"></span>
            SYS-QG :: ONLINE
          </span>
          <span className="hidden lg:inline text-[#6E7277]">|</span>
          <span className="hidden lg:inline">ROMBAS-57120 // ZONE-ALPHA</span>
          <span className="hidden xl:inline text-[#6E7277]">|</span>
          <span className="hidden xl:inline text-[#AECFB2]">ADHÉSIONS 2026 OUVERTES</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <button
            onClick={onOpenRadio}
            className="flex items-center gap-1 text-[#E87A1E] font-semibold hover:underline cursor-pointer bg-[#1A1D20] px-2 py-0.5 rounded border border-[#E87A1E]/30 hover:border-[#E87A1E] transition-colors"
            title="Ouvrir le transmetteur radio PMR 446"
          >
            <span className="material-symbols-outlined text-[13px]">radio</span>
            <span>RADIO PMR</span>
          </button>

          <button
            onClick={onOpenChrony}
            className="flex items-center gap-1 text-[#2ECC71] hover:underline cursor-pointer bg-[#1A1D20] px-2 py-0.5 rounded border border-[#2ECC71]/30 hover:border-[#2ECC71] transition-colors"
            title="Calculateur Joules & Chrony"
          >
            <span className="material-symbols-outlined text-[13px]">speed</span>
            <span>CHRONY</span>
          </button>

          <button
            onClick={onOpenChecklist}
            className="flex items-center gap-1 text-[#4AE183] hover:underline cursor-pointer bg-[#1A1D20] px-2 py-0.5 rounded border border-[#4AE183]/30 hover:border-[#4AE183] transition-colors"
            title="Kitlist & Checklist Matériel"
          >
            <span className="material-symbols-outlined text-[13px]">checklist</span>
            <span>KITLIST</span>
          </button>

          <button
            onClick={toggleSfx}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded border cursor-pointer transition-colors ${
              sfxEnabled
                ? 'border-[#3B4D3F] text-[#AECFB2] bg-[#1A1D20]'
                : 'border-[#333537] text-[#8E9297] bg-[#121416]'
            }`}
            title={sfxEnabled ? 'Désactiver les sons tactiques' : 'Activer les sons tactiques'}
          >
            <span className="material-symbols-outlined text-[12px]">
              {sfxEnabled ? 'volume_up' : 'volume_off'}
            </span>
            <span>SFX {sfxEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Main navigation bar (Fixed alignment & clean spacing) */}
      <div className="h-18 w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
        {/* Brand identity */}
        <div
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
          onClick={() => handleNavClick('accueil')}
          title="Retour à l'accueil FOST"
        >
          <ShieldLogo size={38} showGlow={true} />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-['Space_Grotesk'] text-lg sm:text-xl font-bold uppercase tracking-tight text-[#E2E3DF] group-hover:text-[#E87A1E] transition-colors">
                {siteName}
              </span>
              <span className="text-[9px] px-1.5 py-0.2 bg-[#E87A1E]/20 text-[#E87A1E] font-mono rounded font-bold border border-[#E87A1E]/40">
                SQUAD
              </span>
            </div>
            <span className="font-mono text-[9px] sm:text-[10px] uppercase text-[#8E9297] tracking-wider truncate max-w-[180px] sm:max-w-[260px]">
              {unitName}
            </span>
          </div>
        </div>

        {/* Desktop Menu (hidden on mobile/tablet, cleanly aligned on desktop) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id && !isAdminOpen;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-3 py-1.5 font-mono text-[11px] xl:text-[12px] uppercase tracking-wider rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#E87A1E] text-[#111315] font-bold shadow-[0_0_12px_rgba(232,122,30,0.35)] ring-1 ring-[#FFA640]/50'
                    : 'text-[#8E9297] hover:bg-[#282a2c] hover:text-[#E2E3DF]'
                }`}
              >
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#2ECC71] animate-ping" />
                )}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action controls (Right side) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* USER AUTHENTICATION HUB */}
          {userProfile ? (
            <div className="flex items-center gap-1.5 bg-[#1A1D20] border border-[#2ECC71]/40 p-1 sm:p-1.5 rounded-lg shadow-sm">
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer text-left"
                title="Consulter mon profil d'opérateur"
              >
                <div className="relative">
                  <img
                    src={userProfile.photoURL || 'https://lh3.googleusercontent.com/aida/AEtjO1XQ4NPkLyCWHlFwZY6vqbsOVRlZQJnE6fgc8YNbgs_-dlBFdlCcoQ7JaDzwhmuyA56e3etRIIzPnSesbEB8475B3iSe8z3rVXUu0eOz-GhoWZ7nDzwBFhtkmnxeSrFUCONzNkTorhFEoX_7nMRbnvBizPp_T7BLbrEW7j_Ip6aYUQfv7I9zTaho-5ja84qg7wSco0VPUxcaESzHdh8bt87zMS68ZvOHYoHIXgHoUglRxVhM3Nf3ZICOMz5kky7pMOGEb4qVQXJ7Gw'}
                    alt={userProfile.callsign}
                    className="w-7 h-7 rounded-md object-cover border border-[#2ECC71]"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#2ECC71] ring-1 ring-[#111315]" />
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="font-mono text-[11px] font-bold text-[#E2E3DF] leading-tight truncate max-w-[90px]">
                    {userProfile.callsign}
                  </span>
                  <span className="font-mono text-[9px] text-[#2ECC71] leading-none">
                    {userProfile.memberTier === 'TITULAIRE'
                      ? 'MEMBRE'
                      : userProfile.memberTier === 'PREMIUM'
                      ? 'PREMIUM'
                      : 'CONNECTÉ'}
                  </span>
                </div>
              </button>

              <button
                onClick={logout}
                className="p-1 rounded hover:bg-[#282a2c] text-[#8E9297] hover:text-[#E74C3C] cursor-pointer transition-colors"
                title="Se déconnecter"
              >
                <span className="material-symbols-outlined text-base">logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-2.5 sm:px-3 py-1.5 bg-[#1A1D20] hover:bg-[#282a2c] text-[#E2E3DF] border border-[#333537] hover:border-[#E87A1E] font-mono text-[11px] uppercase rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <span className="material-symbols-outlined text-[14px] text-[#E87A1E]">login</span>
                <span>Connexion</span>
              </button>

              <button
                onClick={() => onOpenAuth('signup')}
                className="hidden sm:inline-flex px-2.5 sm:px-3 py-1.5 bg-[#22262B] hover:bg-[#2ECC71] hover:text-[#111315] text-[#2ECC71] border border-[#2ECC71]/40 font-mono text-[11px] uppercase font-bold rounded-lg transition-all cursor-pointer items-center gap-1 shadow-sm"
              >
                <span className="material-symbols-outlined text-[14px]">how_to_reg</span>
                <span>Inscription</span>
              </button>
            </div>
          )}

          {/* Shopping Cart Button */}
          <button
            onClick={openCart}
            className="relative flex items-center justify-center p-2 rounded-lg bg-[#1A1D20] hover:bg-[#282a2c] text-[#E2E3DF] border border-[#333537] hover:border-[#E87A1E] transition-all cursor-pointer shadow-sm group"
            title="Ouvrir le panier d'achat"
            aria-label="Panier d'achat"
          >
            <span className="material-symbols-outlined text-lg sm:text-xl text-[#E87A1E] group-hover:scale-110 transition-transform">
              shopping_cart
            </span>
            {totalCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-[#2ECC71] text-[#111315] font-mono text-[10px] font-black rounded-full flex items-center justify-center border border-[#111315] shadow-[0_0_8px_rgba(46,204,113,0.8)] animate-pulse">
                {totalCount}
              </span>
            )}
          </button>

          {/* Join Squad Button */}
          <button
            onClick={onJoinClick}
            className="hidden sm:inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-[#E87A1E] text-[#111315] font-mono text-[11px] uppercase font-bold tracking-wider rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-[0_0_12px_rgba(232,122,30,0.3)] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">person_add</span>
            <span>Adhésion</span>
          </button>

          {/* QG Admin Toggle Button */}
          <button
            onClick={onAdminClick}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all cursor-pointer border ${
              isAdminOpen
                ? 'bg-[#E87A1E] text-[#111315] border-[#E87A1E] shadow-[0_0_12px_rgba(232,122,30,0.4)]'
                : 'bg-[#1A1D20] text-[#8E9297] hover:text-[#E2E3DF] border-[#333537] hover:border-[#8E9297]'
            }`}
            title={isAdminOpen ? 'Quitter la console QG' : 'Console QG Staff'}
          >
            <span className="material-symbols-outlined text-base">
              {isAdminOpen ? 'close' : 'shield'}
            </span>
            <span className="hidden xl:inline font-mono text-[10px] font-bold uppercase">
              {isAdminOpen ? 'FERMER' : 'QG'}
            </span>
          </button>

          {/* Mobile hamburger (visible below lg) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center justify-center w-9 h-9 text-[#8E9297] hover:text-[#E2E3DF] rounded-lg bg-[#1A1D20] border border-[#333537] cursor-pointer transition-colors"
            aria-label="Menu de navigation"
          >
            <span className="material-symbols-outlined text-xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden w-full bg-[#111315]/98 border-b border-[#282a2c] p-4 flex flex-col gap-2.5 animate-fadeIn shadow-2xl">
          {/* Quick Tools on mobile top */}
          <div className="grid grid-cols-3 gap-2 pb-2 border-b border-[#282a2c]">
            <button
              onClick={() => {
                onOpenRadio();
                setMobileMenuOpen(false);
              }}
              className="p-2 bg-[#1A1D20] text-[#E87A1E] font-mono text-[10px] rounded-lg border border-[#E87A1E]/30 flex flex-col items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-base">radio</span>
              <span>RADIO</span>
            </button>
            <button
              onClick={() => {
                onOpenChrony();
                setMobileMenuOpen(false);
              }}
              className="p-2 bg-[#1A1D20] text-[#2ECC71] font-mono text-[10px] rounded-lg border border-[#2ECC71]/30 flex flex-col items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-base">speed</span>
              <span>CHRONY</span>
            </button>
            <button
              onClick={() => {
                onOpenChecklist();
                setMobileMenuOpen(false);
              }}
              className="p-2 bg-[#1A1D20] text-[#4AE183] font-mono text-[10px] rounded-lg border border-[#4AE183]/30 flex flex-col items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-base">checklist</span>
              <span>KITLIST</span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 py-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id && !isAdminOpen;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg font-mono text-xs uppercase tracking-wider transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-[#E87A1E] text-[#111315] font-bold'
                      : 'text-[#8E9297] hover:bg-[#1A1D20] hover:text-[#E2E3DF]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#2ECC71]" />}
                </button>
              );
            })}
          </div>

          {/* Panier mobile */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openCart();
            }}
            className="w-full py-2.5 px-3 bg-[#1A1D20] hover:bg-[#282a2c] border border-[#2ECC71]/40 text-[#2ECC71] font-mono text-xs uppercase font-bold rounded-xl transition-all flex items-center justify-between shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">shopping_cart</span>
              <span>Panier Tactique ({totalCount})</span>
            </div>
            <span className="px-2 py-0.5 bg-[#2ECC71]/20 text-[#2ECC71] rounded text-[10px]">
              Ouvrir
            </span>
          </button>

          {/* CTA Adhésion mobile */}
          <button
            onClick={() => {
              onJoinClick();
              setMobileMenuOpen(false);
            }}
            className="w-full py-3 bg-[#E87A1E] text-[#111315] font-mono text-xs uppercase font-bold tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            <span>Rejoindre l'Escouade // Adhésion 2026</span>
          </button>
        </div>
      )}
    </header>
  );
};
