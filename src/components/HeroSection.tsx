import React from 'react';
import { ShieldLogo } from './ShieldLogo';
import { HeroConfig } from '../data/siteStore';

interface HeroSectionProps {
  heroConfig?: HeroConfig;
  onJoinClick: () => void;
  onArmoryClick: () => void;
  onCalendarClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  heroConfig,
  onJoinClick,
  onArmoryClick,
  onCalendarClick
}) => {
  const bgImg = heroConfig?.bgImage || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnEPiIs4tkFQO9SBDGHHEgoZCLqrcxpgaj_k81rLoVOsv2wjpIORwPph18B2c3IfcnJJDlaUd8dH8VGtAJ0pwfwm8EuezId5vjMsFtYVGjP2Ne18NPiRiAcsQzrdO_yn7IXkeSDEJGDQkwXpRy4m172tKY6FW-jlaOtBScDL67NyzwzyMEdgGO61ncMop_qqOZvpc-Ix2uUHXuto1bvPUjYD33MDDjxGOLFZjanpiNDRrzv2ymXt5lzK_gTUzYNQC9sQ';
  const statusBadge = heroConfig?.statusBadge || 'Statut : Recrutement Ouvert';
  const nextOpBadge = heroConfig?.nextOpBadge || 'Prochaine OP : Samedi 08:30';
  const fpsBadge = heroConfig?.fpsBadge || 'Puissance : 350 FPS Max';
  const tagText = heroConfig?.tagText || "Forces d'Opérations Spéciales Tactiques // Écusson FOST";
  const mainTitle = heroConfig?.mainTitle || 'Bienvenue chez la F.O.S.T.';
  const subtitle = heroConfig?.subtitle || "Association d'airsoft d'élite axée sur le fair-play absolu, la simulation tactique militaire (MilSim) et une camaraderie indéfectible. Déploiement en terrain boisé dense et environnements CQB immersifs.";
  const btnJoin = heroConfig?.btnJoinText || "Rejoindre l'Escouade";
  const btnArmory = heroConfig?.btnArmoryText || '[ Découvrir nos Répliques ]';
  const btnOps = heroConfig?.btnOpsText || 'Calendrier des OP';

  return (
    <section className="relative w-full overflow-hidden bg-[#111315] pt-24 md:pt-28">
      {/* Background Military Image with immersive gradient */}
      <div className="relative w-full min-h-[88vh] md:min-h-[92vh] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-1000 ease-out" 
          style={{
            backgroundImage: `url('${bgImg}')`
          }}
        />

        {/* Tactical vignette and HUD dark veil */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121416] via-[#121416]/75 to-[#121416]/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(17,19,21,0.5)_60%,rgba(17,19,21,0.95)_100%)]" />

        {/* Decorative HUD crosshairs & telemetry grid */}
        <div className="absolute inset-0 pointer-events-none opacity-20 flex flex-col justify-between p-6">
          <div className="flex justify-between items-center font-mono text-[11px] text-[#AECFB2]">
            <span className="tracking-widest">TACTICAL // OPS-ID: FOST-GRID-04</span>
            <span>LAT 47.4568° N // LON 0.6892° E</span>
          </div>
          <div className="flex justify-between items-end font-mono text-[11px] text-[#8E9297]">
            <span>SEC: SECTOR-ALPHA // FOREST PATROL</span>
            <span>SYSTEM: READY // COMMS: FREQ 446.006 MHz</span>
          </div>
        </div>

        {/* Hero Central Content */}
        <div className="relative z-10 w-full px-4 sm:px-8 md:px-16 pt-16 pb-20 flex flex-col items-start max-w-6xl mx-auto">
          {/* Real-time status badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1A1D20]/90 text-[#2ECC71] font-mono text-[11px] uppercase tracking-wider rounded backdrop-blur-md shadow-md border border-[#2ECC71]/30">
              <span className="w-2 h-2 rounded-full bg-[#2ECC71] animate-ping"></span>
              {statusBadge}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1A1D20]/90 text-[#E87A1E] font-mono text-[11px] uppercase tracking-wider rounded backdrop-blur-md shadow-md border border-[#E87A1E]/30">
              <span className="material-symbols-outlined text-sm">schedule</span> 
              {nextOpBadge}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#3B4D3F]/90 text-[#B7CCB9] font-mono text-[11px] uppercase tracking-wider rounded backdrop-blur-md border border-[#AECFB2]/20">
              <span className="material-symbols-outlined text-sm">speed</span> 
              {fpsBadge}
            </span>
          </div>

          {/* Subtitle tag with shield emblem */}
          <div className="mb-3 flex items-center gap-3">
            <ShieldLogo size={36} showGlow={true} />
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-6 bg-[#E87A1E]"></span>
              <span className="font-mono text-[12px] font-bold text-[#E87A1E] uppercase tracking-widest">
                {tagText}
              </span>
            </div>
          </div>

          {/* Display Hero Title */}
          <h1 className="font-['Space_Grotesk'] text-3xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-tight text-[#E2E3DF] font-bold max-w-4xl drop-shadow-xl mb-4 leading-tight">
            {mainTitle}
          </h1>

          {/* Description */}
          <p className="font-['Inter'] text-base md:text-lg text-[#8E9297] max-w-2xl mb-8 leading-relaxed">
            {subtitle}
          </p>

          {/* Tactical CTA Hub */}
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <button
              onClick={onJoinClick}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#E87A1E] text-[#111315] font-mono text-sm uppercase font-bold tracking-wider rounded hover:brightness-110 active:scale-95 transition-all shadow-[0_0_24px_rgba(232,122,30,0.45)] cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">person_add</span>
              {btnJoin}
            </button>
            <button
              onClick={onArmoryClick}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#1A1D20]/90 text-[#E2E3DF] border border-[#333537] hover:border-[#E87A1E] font-mono text-sm uppercase font-medium tracking-wider rounded hover:bg-[#282a2c] transition-all backdrop-blur-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-[#E87A1E] text-base">construction</span>
              {btnArmory}
            </button>
            <button
              onClick={onCalendarClick}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#1a1c1e]/80 text-[#AECFB2] border border-[#3B4D3F] font-mono text-sm uppercase font-medium tracking-wider rounded hover:text-[#E2E3DF] hover:bg-[#1A1D20] transition-colors backdrop-blur-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">event</span>
              {btnOps}
            </button>
          </div>

          {/* Telemetry bar below Hero */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 w-full pt-4 bg-[#1A1D20]/80 border border-[#333537]/80 backdrop-blur-md rounded p-4 shadow-xl">
            <div className="flex flex-col">
              <span className="font-mono text-[11px] text-[#8E9297] uppercase">Effectif Actif</span>
              <span className="font-['Space_Grotesk'] text-2xl md:text-3xl text-[#E2E3DF] font-bold">
                28 <span className="text-[#E87A1E] text-xs font-normal">Opérateurs</span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[11px] text-[#8E9297] uppercase">Taux de Fair-Play</span>
              <span className="font-['Space_Grotesk'] text-2xl md:text-3xl text-[#2ECC71] font-bold">
                100% <span className="text-[#8E9297] text-xs font-normal">Zéro litige</span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[11px] text-[#8E9297] uppercase">Secteur Principal</span>
              <span className="font-['Space_Grotesk'] text-2xl md:text-3xl text-[#E2E3DF] font-bold">
                69 / 57 <span className="text-[#8E9297] text-xs font-normal">Forest & CQB</span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[11px] text-[#8E9297] uppercase">Fréquence Radio</span>
              <span className="font-['Space_Grotesk'] text-2xl md:text-3xl text-[#E87A1E] font-bold">
                PMR446 <span className="text-[#8E9297] text-xs font-normal">Canal 01</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
