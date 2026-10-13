import React, { useState, useRef } from 'react';
import { PaymentItem } from './PaymentModal';
import { useCart } from '../contexts/CartContext';
import { tacticalAudio } from '../utils/audio';

/* =========================================================================
 * CONFIGURATION UNIQUE DE L'ARMURERIE FOST // LES 3 MODÈLES OFFICIELS (200 €)
 * Vous pouvez modifier directement les modèles, couleurs, descriptions et images ici.
 * ========================================================================= */

export interface ArmoryColorOption {
  id: string;
  name: string;
  hex: string;
  image?: string;
  inStock: boolean;
}

export interface WeaponModelData {
  id: 'mp5' | 'mk' | 'ak';
  code: string;
  name: string;
  badge: string;
  price: number; // 200 € fixe
  shortDesc: string;
  fullDesc: string;
  defaultImage: string;
  specs: {
    fps: string;
    rps: string;
    range: string;
    electronics: string;
    hopUp: string;
    weight: string;
    poidsBilles: string;
  };
  colors: ArmoryColorOption[];
}

// 13 Teintes Cerakote officielles de l'atelier FOST
export const FOST_CERAKOTE_PALETTE: ArmoryColorOption[] = [
  { id: 'noir-stealth', name: 'Noir Tactique // Stealth', hex: '#141619', inStock: true },
  { id: 'sniper-gray', name: 'Sniper Gray // Mat', hex: '#53565A', inStock: true },
  { id: 'od-green', name: 'Olive Drab // Woodland Moss', hex: '#3B4D3F', inStock: true },
  { id: 'magpul-fde', name: 'Magpul FDE // Flat Dark Earth', hex: '#B89758', inStock: true },
  { id: 'coyote-tan', name: 'Coyote Tan // Desert Spec', hex: '#967140', inStock: true },
  { id: 'cobalt-metallic', name: 'Cobalt Metallic // Deep Blue', hex: '#2B3D52', inStock: true },
  { id: 'burnt-bronze', name: 'Burnt Bronze // Metallic', hex: '#8C6239', inStock: true },
  { id: 'tungsten', name: 'Tungsten // Gunmetal', hex: '#3E4144', inStock: true },
  { id: 'desert-sand', name: 'Desert Sand // Dune', hex: '#C2B280', inStock: true },
  { id: 'midnight-blue', name: 'Midnight Blue // Night Ops', hex: '#1B263B', inStock: true },
  { id: 'titanium', name: 'Titanium // Silver Frost', hex: '#8A8D8F', inStock: true },
  { id: 'snow-camo', name: 'Alpine White // Snow Camo', hex: '#E5E8EB', inStock: true },
  { id: 'crimson-tactical', name: 'Crimson Red // Strike Spec', hex: '#800020', inStock: true },
];

export const FOST_ARMORY_CATALOG: WeaponModelData[] = [
  {
    id: 'mp5',
    code: 'MOD-01 // MP5 CQB',
    name: 'MP5 CQB SPEC',
    badge: '01 // SMG COMPACT',
    price: 200,
    shortDesc: 'Ultra-compacte, cadence élevée et maniabilité extrême en espace confiné.',
    fullDesc: 'Plateforme SMG éprouvée pour les assauts rapides et le CQB en milieu clos (complexe industriel de Rombas). Bloc hop-up rotatif PDI 6.03mm, mosfet Gate Aster V2 optique et crosse rétractable 3 positions.',
    defaultImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCdDxzlc4wch80yRJhaadSEfawWF1tsVCKM-hNeVyROUyXi5wdN1bVZdxlEswnZXLuVvzEemUrvy4URGiMTgnQzZhQWzwkTxX1MgXxhmBV7_KND6POAFVIJsWOcoK67JHHUoUTYfHFmpLvVhOK21L6al5ze4KjKKuhWni_CQug_qUFNnKB-3fhFrVQARvkoPtdVq4m8pigTzVesj34kEAV6AokrU_6U77x3KPSJ98IZPyDXCx_5de_',
    specs: {
      fps: '300 FPS (0.84 Joule)',
      rps: '24 Billes / Sec (LiPo 11.1V)',
      range: '42 Mètres Précision',
      electronics: 'MOSFET Gate Aster V2 Optique',
      hopUp: 'Bloc Rotatif PDI 6.03mm (229mm)',
      weight: '2.150 kg',
      poidsBilles: '0.25g Bio conseillé'
    },
    colors: FOST_CERAKOTE_PALETTE
  },
  {
    id: 'mk',
    code: 'MOD-02 // MK MOD-1',
    name: 'MK MOD-1 CARBINE',
    badge: '02 // CARABINE MODULAIRE',
    price: 200,
    shortDesc: 'Polyvalence mid-range, rails M-LOK usinés CNC et contrôle de recul optimisé.',
    fullDesc: 'Carabine d\'assaut tout-terrain modulaire. Idéale pour les engagements mixtes en forêt et lisières. Canon externe flûté, système de changement de ressort rapide ESA et rail Picatinny supérieur continu.',
    defaultImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBB9IrjWfO8MLS3WcLCFxkG-5u7eo7ixte06xCCTT7jmLgV1lowO8xSgvBy7m1stDZ5UNBOJ_6qIhTv-qgkDqYkSaXYpcNf0UyOObbwRyDtYadEkqEkrEbDJM-Pofg5oNT1wh8Vp4UviZv0BgnJ7j4mcQdNr4cOPEp2DmSYqbfZ-ebvxK0pdkPWhE6UuDc-Lb02GmtZ0r1_TvxoaFJ5I959dWQb7I42NUswL9QRw2ruE7nnqIE5PIga',
    specs: {
      fps: '345 FPS (1.10 Joules)',
      rps: '21 Billes / Sec',
      range: '58 Mètres Précision',
      electronics: 'ETU Kestrel V2 Bluetooth',
      hopUp: 'Chambre CNC Maxx Model + Maple Leaf 60°',
      weight: '2.620 kg',
      poidsBilles: '0.28g Bio conseillé'
    },
    colors: FOST_CERAKOTE_PALETTE
  },
  {
    id: 'ak',
    code: 'MOD-03 // AK HEAVY',
    name: 'AK TACTICAL HEAVY',
    badge: '03 // HEAVY PLATFORM',
    price: 200,
    shortDesc: 'Ergonomie moderne Zenitco, tir tendu et stabilité balistique maximale.',
    fullDesc: 'Plateforme moderne renforcée avec garde-main Zenitco B-30/B-31, crosse télescopique PT-1 et sélecteur élargi tactique. Engrenages usinés en acier trempé 13:1 et moteur High-Torque néodyme.',
    defaultImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6j0HGTRPOYb_6G7ZP1QrBYNJL3fwI3usIW6C96otwSYi3EidRdabhCT9-6wzKbDAhQ4iwYB9iGYH-5dbzjTmYYckCg5zRyzaJYGbtt_lIQrbmonabGeFm_Jod9uVmeMBdrBLUxJ4wNUhMf46SELSOC03IOURCYY5uZFLm1oic2fk04f4l3ni2LPw35gyCwxMIQSc9RaLVLEqeuPibMOwmRpiLRdPAmBidN4bHZNnfEk1-5AYP4ton',
    specs: {
      fps: '350 FPS (1.14 Joules)',
      rps: '19 Billes / Sec',
      range: '62 Mètres Précision',
      electronics: 'MOSFET Perun V3 Optical',
      hopUp: 'Canon Inox Prometheus 6.03mm (363mm)',
      weight: '3.100 kg',
      poidsBilles: '0.28g Bio conseillé'
    },
    colors: FOST_CERAKOTE_PALETTE
  }
];

interface ArmorySectionProps {
  onOrderReplica: (modelName: string, colorName: string) => void;
  onOpenPayment?: (item: PaymentItem) => void;
}

export const ArmorySection: React.FC<ArmorySectionProps> = ({
  onOrderReplica,
  onOpenPayment
}) => {
  const { addItem, openCheckout } = useCart();
  const [selectedModelIndex, setSelectedModelIndex] = useState<number>(0);
  const [selectedColorIds, setSelectedColorIds] = useState<Record<string, string>>({
    mp5: 'noir-stealth',
    mk: 'magpul-fde',
    ak: 'burnt-bronze'
  });
  const [imgError, setImgError] = useState<Record<string, boolean>>({});
  const [videoError, setVideoError] = useState<boolean>(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // États pour le service de Location GoPro Pack Tactical
  const [goProPack, setGoProPack] = useState<'basic' | 'full'>('basic');
  const [goProMount, setGoProMount] = useState<string>('Fixation Casque');
  const [goProDepositAgreed, setGoProDepositAgreed] = useState<boolean>(false);
  const [goProError, setGoProError] = useState<string | null>(null);
  const [goProSuccessMsg, setGoProSuccessMsg] = useState<string | null>(null);

  const currentModel = FOST_ARMORY_CATALOG[selectedModelIndex] || FOST_ARMORY_CATALOG[0];
  const activeColorId = selectedColorIds[currentModel.id] || 'noir-stealth';
  const activeColor =
    currentModel.colors.find((c) => c.id === activeColorId) || currentModel.colors[0];

  const isMp5Stealth = currentModel.id === 'mp5' && activeColor.id === 'noir-stealth';

  const handleColorSelect = (modelId: string, colorId: string) => {
    setSelectedColorIds((prev) => ({
      ...prev,
      [modelId]: colorId
    }));
  };

  const handleImageError = (key: string) => {
    setImgError((prev) => ({ ...prev, [key]: true }));
  };

  return (
    <div className="w-full py-16 md:py-24 px-4 sm:px-8 md:px-16 bg-[#0c0e10] relative overflow-hidden">
      {/* Header section */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-[#E87A1E] text-[#111315] font-mono text-xs rounded uppercase font-bold">
                ARMURERIE FOST // 2026
              </span>
              <span className="font-mono text-xs text-[#8E9297]">
                // 3 MODÈLES OFFICIELS • 13 COLORIS CERAKOTE
              </span>
            </div>
            <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#E2E3DF] font-bold">
              ARMURERIE FOST // LES 3 MODÈLES OFFICIELS
            </h2>
            <p className="font-['Inter'] text-sm md:text-base text-[#8E9297] mt-2 max-w-3xl leading-relaxed">
              Trois architectures d'élite homologuées pour nos opérations MilSim : <span className="text-[#E2E3DF] font-semibold">MP5 CQB</span>, <span className="text-[#E2E3DF] font-semibold">MK MOD-1</span> et <span className="text-[#E2E3DF] font-semibold">AK TACTICAL</span>. Chaque modèle est réalisable dans l'ensemble de nos 13 teintes Cerakote au <span className="text-[#2ECC71] font-bold">tarif unique de 200,00 €</span>.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#1A1D20] px-4 py-2 rounded-lg border border-[#3B4D3F] shrink-0 self-start md:self-auto shadow-md">
            <span className="material-symbols-outlined text-[#2ECC71] text-xl">sell</span>
            <div>
              <span className="font-mono text-[10px] text-[#8E9297] uppercase block">Prix Unique Officiel</span>
              <span className="font-['Space_Grotesk'] text-xl font-bold text-[#2ECC71]">200,00 € TTC</span>
            </div>
          </div>
        </div>

        {/* 3 MODEL SELECTOR TABS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {FOST_ARMORY_CATALOG.map((model, idx) => {
            const isSelected = selectedModelIndex === idx;
            const chosenColorId = selectedColorIds[model.id] || 'noir-stealth';
            const chosenColor = model.colors.find((c) => c.id === chosenColorId) || model.colors[0];

            return (
              <button
                key={model.id}
                onClick={() => setSelectedModelIndex(idx)}
                className={`flex flex-col items-start p-4 rounded-xl text-left transition-all border-2 cursor-pointer shadow-lg relative overflow-hidden ${
                  isSelected
                    ? 'bg-[#1E2328] border-[#E87A1E] shadow-[0_0_24px_rgba(232,122,30,0.25)]'
                    : 'bg-[#141618] border-[#282a2c] hover:border-[#3B4D3F]'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <span className="font-mono text-xs uppercase font-bold text-[#E87A1E]">
                    {model.badge}
                  </span>
                  <span className="px-2 py-0.5 bg-[#2ECC71]/20 text-[#2ECC71] font-mono text-[11px] rounded font-bold border border-[#2ECC71]/30">
                    200 €
                  </span>
                </div>

                <div className="font-['Space_Grotesk'] text-lg text-[#E2E3DF] font-bold">
                  {model.name}
                </div>

                <p className="font-['Inter'] text-xs text-[#8E9297] line-clamp-2 mt-1">
                  {model.shortDesc}
                </p>

                <div className="mt-3 pt-2 border-t border-[#282a2c] w-full flex items-center justify-between font-mono text-[11px] text-[#8E9297]">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/40"
                      style={{ backgroundColor: chosenColor.hex }}
                    />
                    <span className="text-[#E2E3DF]">{chosenColor.name.split('//')[0]}</span>
                  </span>
                  <span className="text-[#2ECC71] font-semibold">{model.specs.fps}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE MODEL HERO SHOWCASE */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
        {/* Visualizer Interactive HUD (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-[#141618] border-2 border-[#282a2c] rounded-2xl p-5 md:p-7 shadow-2xl relative overflow-hidden">
          {/* Telemetry Header */}
          <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-[#282a2c] gap-2">
            <div>
              <span className="font-mono text-xs text-[#8E9297] uppercase block">{currentModel.code}</span>
              <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-[#E2E3DF] uppercase">
                {currentModel.name} // <span className="text-[#E87A1E]">{activeColor.name}</span>
              </h3>
            </div>

            <div className="text-right">
              <span className="font-mono text-[10px] text-[#8E9297] uppercase block">Tarif Homologué</span>
              <span className="font-['Space_Grotesk'] text-3xl font-bold text-[#2ECC71]">200,00 €</span>
            </div>
          </div>

          {/* Dynamic Weapon Display with Elegant Fallback */}
          <div className="relative w-full aspect-[16/10] bg-gradient-to-b from-[#181B1F] to-[#101214] border border-[#282a2c] rounded-xl overflow-hidden flex items-center justify-center my-auto min-h-[320px] shadow-inner">
            {/* SVG Blueprint Grid decor */}
            <svg
              className="absolute inset-0 w-full h-full opacity-15 pointer-events-none text-[#8E9297]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="armory-grid-pattern" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" fill="url(#armory-grid-pattern)" height="100%" />
              <circle cx="50%" cy="50%" r="130" fill="none" stroke="currentColor" strokeDasharray="4,4" strokeWidth="0.75" />
              <circle cx="50%" cy="50%" r="6" fill="currentColor" />
            </svg>

            {/* Weapon Video / Image / Blueprint Display */}
            {isMp5Stealth && !videoError ? (
              <div className="relative z-10 w-full h-full flex items-center justify-center overflow-hidden">
                <video
                  ref={videoRef}
                  src="/mp5_commercial.mp4"
                  poster={activeColor.image || currentModel.defaultImage}
                  autoPlay
                  loop
                  muted={isVideoMuted}
                  playsInline
                  onError={() => setVideoError(true)}
                  className="w-full h-full object-cover transition-all duration-300 drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)]"
                />

                {/* Boutons Son et Pause Vidéo */}
                <div className="absolute bottom-3 left-3 z-30 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (videoRef.current) {
                        if (isVideoPlaying) {
                          videoRef.current.pause();
                          setIsVideoPlaying(false);
                        } else {
                          videoRef.current.play();
                          setIsVideoPlaying(true);
                        }
                      }
                    }}
                    className="p-2 rounded-lg bg-[#111315]/85 hover:bg-[#1A1D20] text-[#E2E3DF] hover:text-[#E87A1E] border border-[#282a2c] backdrop-blur-md transition-all shadow-md flex items-center justify-center cursor-pointer"
                    title={isVideoPlaying ? 'Mettre en pause' : 'Lire la vidéo'}
                  >
                    <span className="material-symbols-outlined text-base">
                      {isVideoPlaying ? 'pause' : 'play_arrow'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (videoRef.current) {
                        const nextMuted = !isVideoMuted;
                        videoRef.current.muted = nextMuted;
                        setIsVideoMuted(nextMuted);
                      }
                    }}
                    className="p-2 rounded-lg bg-[#111315]/85 hover:bg-[#1A1D20] text-[#E2E3DF] hover:text-[#E87A1E] border border-[#282a2c] backdrop-blur-md transition-all shadow-md flex items-center justify-center cursor-pointer"
                    title={isVideoMuted ? 'Activer le son' : 'Couper le son'}
                  >
                    <span className="material-symbols-outlined text-base">
                      {isVideoMuted ? 'volume_off' : 'volume_up'}
                    </span>
                  </button>
                </div>
              </div>
            ) : !imgError[`${currentModel.id}-${activeColor.id}`] ? (
              <img
                src={activeColor.image || currentModel.defaultImage}
                alt={`${currentModel.name} en finition ${activeColor.name}`}
                onError={() => handleImageError(`${currentModel.id}-${activeColor.id}`)}
                className="relative z-10 w-full h-full object-contain p-6 transition-all duration-300 drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] hover:scale-105"
              />
            ) : (
              <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center border-2 shadow-lg"
                  style={{ backgroundColor: `${activeColor.hex}30`, borderColor: activeColor.hex }}
                >
                  <span className="material-symbols-outlined text-4xl" style={{ color: activeColor.hex }}>
                    military_tech
                  </span>
                </div>
                <div>
                  <h4 className="font-['Space_Grotesk'] text-lg font-bold text-[#E2E3DF] uppercase">
                    {currentModel.name}
                  </h4>
                  <p className="font-mono text-xs text-[#E87A1E]">
                    Finition Cerakote : {activeColor.name}
                  </p>
                </div>
                <span className="font-mono text-[10px] text-[#8E9297] bg-[#111315] px-3 py-1 rounded border border-[#282a2c]">
                  ÉCHANTILLON ATELIER // 200,00 € TTC
                </span>
              </div>
            )}

            {/* Overlays */}
            <div className="absolute top-3 left-3 font-mono text-[11px] text-[#8E9297] flex items-center gap-1.5 bg-[#111315]/80 px-2 py-0.5 rounded border border-[#282a2c]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC71] animate-ping" />
              <span>CHRONO CONFORME :: {currentModel.specs.fps}</span>
            </div>

            <div className="absolute bottom-3 right-3 font-mono text-[10px] text-[#8E9297] bg-[#111315]/80 px-2.5 py-1 rounded border border-[#282a2c]">
              FINITION CERAKOTE APPLIQUÉE
            </div>
          </div>

          {/* Color Swatch Picker */}
          <div className="pt-5 mt-3 border-t border-[#282a2c]">
            <div className="flex items-center justify-between mb-3 text-xs font-mono text-[#8E9297] uppercase">
              <span>Sélectionnez votre finition ({currentModel.colors.length} couleurs disponibles) :</span>
              <span className="text-[#E87A1E] font-bold">{activeColor.name.split('//')[0]}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {currentModel.colors.map((color) => {
                const isActive = activeColor.id === color.id;
                return (
                  <button
                    key={color.id}
                    onClick={() => handleColorSelect(currentModel.id, color.id)}
                    className={`p-2 rounded-lg font-mono text-[11px] transition-all cursor-pointer flex items-center gap-2 border text-left ${
                      isActive
                        ? 'bg-[#22262B] text-[#E2E3DF] border-[#E87A1E] shadow-[0_0_10px_rgba(232,122,30,0.35)] ring-1 ring-[#FFA640]/40'
                        : 'bg-[#111315] text-[#8E9297] hover:text-[#E2E3DF] border-[#282a2c] hover:border-[#3B4D3F]'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm border border-black/40"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="truncate">{color.name.split('//')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Specifications & Direct Checkout Actions (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-[#141618] border-2 border-[#282a2c] rounded-2xl p-5 md:p-7 shadow-2xl">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#282a2c]">
              <span className="font-mono text-xs text-[#E87A1E] font-bold uppercase">
                FICHE TECHNIQUE OFFICIELLE
              </span>
              <span className="px-2.5 py-0.5 bg-[#2ECC71]/20 text-[#2ECC71] font-mono text-xs rounded font-bold border border-[#2ECC71]/40">
                PRIX FIXE : 200 €
              </span>
            </div>

            <h4 className="font-['Space_Grotesk'] text-xl font-bold text-[#E2E3DF] uppercase mb-2">
              {currentModel.name}
            </h4>
            <p className="font-['Inter'] text-xs text-[#8E9297] leading-relaxed mb-5">
              {currentModel.fullDesc}
            </p>

            {/* Spec breakdown table */}
            <div className="space-y-2 font-mono text-xs">
              <div className="p-2.5 bg-[#181B1F] rounded-lg flex items-center justify-between border border-[#282a2c]">
                <span className="text-[#8E9297] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#E87A1E]">speed</span>
                  Vélocité Chrony
                </span>
                <span className="text-[#E2E3DF] font-bold">{currentModel.specs.fps}</span>
              </div>

              <div className="p-2.5 bg-[#181B1F] rounded-lg flex items-center justify-between border border-[#282a2c]">
                <span className="text-[#8E9297] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#2ECC71]">bolt</span>
                  Cadence de Tir
                </span>
                <span className="text-[#E2E3DF] font-bold">{currentModel.specs.rps}</span>
              </div>

              <div className="p-2.5 bg-[#181B1F] rounded-lg flex items-center justify-between border border-[#282a2c]">
                <span className="text-[#8E9297] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#FFA640]">target</span>
                  Portée Efficace
                </span>
                <span className="text-[#E2E3DF] font-bold">{currentModel.specs.range}</span>
              </div>

              <div className="p-2.5 bg-[#181B1F] rounded-lg flex items-center justify-between border border-[#282a2c]">
                <span className="text-[#8E9297] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#38BDF8]">memory</span>
                  Électronique
                </span>
                <span className="text-[#E2E3DF] font-bold">{currentModel.specs.electronics}</span>
              </div>

              <div className="p-2.5 bg-[#181B1F] rounded-lg flex items-center justify-between border border-[#282a2c]">
                <span className="text-[#8E9297] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#AECFB2]">tune</span>
                  Hop-Up & Canon
                </span>
                <span className="text-[#E2E3DF] font-bold">{currentModel.specs.hopUp}</span>
              </div>

              <div className="p-2.5 bg-[#181B1F] rounded-lg flex items-center justify-between border border-[#282a2c]">
                <span className="text-[#8E9297] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#E87A1E]">palette</span>
                  Finition Cerakote Sélectionnée
                </span>
                <span className="text-[#E87A1E] font-bold">{activeColor.name.split('//')[0]}</span>
              </div>
            </div>
          </div>

          {/* Action Order & Payment Buttons */}
          <div className="mt-6 pt-4 border-t border-[#282a2c] space-y-3">
            <div className="p-3 bg-[#18241C] border border-[#2ECC71]/40 rounded-lg flex items-center justify-between text-xs font-mono">
              <span className="text-[#AECFB2]">Montant Total Réplique :</span>
              <span className="text-xl font-bold text-[#2ECC71]">200,00 € TTC</span>
            </div>

            {/* Bouton Ajouter au Panier */}
            <button
              onClick={() => {
                addItem({
                  id: `replica-${currentModel.id}-${activeColor.id}`,
                  productId: currentModel.id,
                  title: `${currentModel.name} // Spec Ops`,
                  category: 'REPLICA',
                  variant: `Finition Cerakote : ${activeColor.name.split('//')[0].trim()}`,
                  price: 200,
                  image: activeColor.image || currentModel.defaultImage,
                  requiresAgeCheck: true,
                  metadata: {
                    model: currentModel.name,
                    color: activeColor.name,
                    fps: currentModel.specs.fps
                  }
                });
              }}
              className="w-full py-3.5 bg-[#E87A1E] hover:brightness-110 active:scale-95 text-[#111315] font-mono text-xs uppercase tracking-wider font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(232,122,30,0.35)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">add_shopping_cart</span>
              <span>Ajouter au Panier Tactique (200,00 €)</span>
            </button>

            {onOpenPayment && (
              <button
                onClick={() =>
                  onOpenPayment({
                    title: `Commande Réplique ${currentModel.name} // Finition Cerakote ${activeColor.name.split('//')[0]}`,
                    category: 'BOUTIQUE',
                    amount: 200,
                    description: `Achat réplique officielle ${currentModel.name} prête à jouer, personnalisée en atelier Cerakote (${activeColor.name}) - 200,00 € TTC.`,
                    replicaModel: currentModel.name,
                    replicaColor: activeColor.name
                  })
                }
                className="w-full py-3 bg-[#2ECC71] hover:brightness-110 active:scale-95 text-[#111315] font-mono text-xs uppercase tracking-wider font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(46,204,113,0.3)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">shopping_cart_checkout</span>
                <span>Commander & Régler Immédiatement (200,00 €)</span>
              </button>
            )}

            <button
              onClick={() => onOrderReplica(currentModel.name, activeColor.name)}
              className="w-full py-2.5 bg-[#1E2226] hover:bg-[#282a2c] text-[#8E9297] hover:text-[#E87A1E] border border-[#333537] hover:border-[#E87A1E]/40 font-mono text-xs uppercase tracking-wider font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">description</span>
              <span>Demande de Réservation / Devis Atelier</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
       * SERVICE EXCLUSIF FOST // LOCATION GOPRO PACK TACTICAL (POV MILSIM)
       * ========================================================================= */}
      {(() => {
        const goProPrice = goProPack === 'full' ? 15.0 : 10.0;

        const handleAddGoProToCart = () => {
          tacticalAudio.playClick();
          if (!goProDepositAgreed) {
            tacticalAudio.playWarning();
            setGoProError("Attention : vous devez obligatoirement valider l'engagement de caution (100€ ou pièce d'identité requise le jour J) pour réserver ce matériel.");
            return;
          }
          setGoProError(null);

          const mountShort = goProMount.split('(')[0].trim();
          addItem({
            id: `gopro-${goProPack}-${mountShort.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
            productId: 'gopro-pack-tactical',
            title: 'Location GoPro Pack Tactical',
            category: 'EQUIPMENT',
            variant: `${goProPack === 'full' ? 'Pack Full (+ SD 64GB)' : 'Pack Basic'} // ${mountShort}`,
            price: goProPrice,
            image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=600&q=80',
            depositRequired: true,
            depositNotice: "Caution 100€ ou pièce d'identité requise le jour J",
            mountType: mountShort,
            optionType: goProPack,
            metadata: {
              mount: mountShort,
              pack: goProPack
            }
          });

          setGoProSuccessMsg(`Pack GoPro ajouté au Panier (${goProPrice.toFixed(2)} €) !`);
          setTimeout(() => setGoProSuccessMsg(null), 3000);
        };

        const handleCheckoutGoProDirect = () => {
          tacticalAudio.playClick();
          if (!goProDepositAgreed) {
            tacticalAudio.playWarning();
            setGoProError("Attention : vous devez obligatoirement valider l'engagement de caution (100€ ou pièce d'identité requise le jour J) pour réserver ce matériel.");
            return;
          }
          setGoProError(null);

          const mountShort = goProMount.split('(')[0].trim();
          addItem({
            id: `gopro-${goProPack}-${mountShort.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
            productId: 'gopro-pack-tactical',
            title: 'Location GoPro Pack Tactical',
            category: 'EQUIPMENT',
            variant: `${goProPack === 'full' ? 'Pack Full (+ SD 64GB)' : 'Pack Basic'} // ${mountShort}`,
            price: goProPrice,
            image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=600&q=80',
            depositRequired: true,
            depositNotice: "Caution 100€ ou pièce d'identité requise le jour J",
            mountType: mountShort,
            optionType: goProPack,
            metadata: {
              mount: mountShort,
              pack: goProPack
            }
          });

          openCheckout();
        };

        return (
          <div className="mt-16 bg-[#16181B] border border-[#2ECC71]/30 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)]">
            {/* Tactical glow accents */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#2ECC71]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FFA640]/5 rounded-full blur-3xl pointer-events-none" />

            {/* Header with tactical badges */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#282a2c] relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-[#2ECC71]/20 border border-[#2ECC71]/50 text-[#2ECC71] font-mono text-[10px] font-bold uppercase tracking-wider">
                    SERVICE TACTIQUE FOST
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#FFA640]/20 border border-[#FFA640]/50 text-[#FFA640] font-mono text-[10px] font-bold uppercase tracking-wider">
                    POV 4K EMBARQUÉ
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#1A1D20] text-[#8E9297] border border-[#333537] font-mono text-[10px] uppercase">
                    LOC-GOPRO-2026
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black uppercase text-[#E2E3DF] tracking-tight font-['Space_Grotesk'] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#2ECC71] text-2xl">videocam</span>
                  <span>Location GoPro Pack Tactical</span>
                </h3>
                <p className="font-['Inter'] text-xs text-[#8E9297] mt-1 max-w-2xl leading-relaxed">
                  Immersion totale : enregistrez vos assauts CQB et phases de progression tactique à la première personne en haute résolution (4K/60 FPS). Matériel étanche, antichoc et batteries haute autonomie.
                </p>
              </div>

              <div className="text-left md:text-right shrink-0">
                <span className="text-[11px] font-mono text-[#8E9297] uppercase block">Tarif de Location :</span>
                <div className="text-2xl sm:text-3xl font-black font-mono text-[#2ECC71]">
                  {goProPrice.toFixed(2)} €
                  <span className="text-xs text-[#8E9297] font-normal ml-1">TTC / session</span>
                </div>
                <span className="text-[10px] font-mono text-[#FFA640] block mt-0.5">
                  TVA non applicable, art. 261-7-1° a du CGI
                </span>
              </div>
            </div>

            {/* Configuration Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 relative z-10">
              {/* Left visual & specs */}
              <div className="lg:col-span-5 flex flex-col justify-between p-4 bg-[#111315] border border-[#282a2c] rounded-xl">
                <div className="relative rounded-lg overflow-hidden border border-[#333537] bg-[#0E1012] aspect-video flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=700&q=80"
                    alt="Pack GoPro Tactical FOST"
                    className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-[#2ECC71]/40 text-[#2ECC71] font-mono text-[9px] uppercase font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC71] animate-pulse" />
                    <span>REC READY // 4K 60FPS</span>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[#E2E3DF] font-mono text-[10px]">
                    {goProPack === 'full' ? 'PACK FULL : SD 64GB INCLUSE' : 'PACK BASIC : PRÊT À TOURNER'}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                  <div className="p-2 bg-[#16181B] border border-[#282a2c] rounded-lg">
                    <span className="text-[10px] font-mono text-[#8E9297] block uppercase">Résolution</span>
                    <span className="text-xs font-mono font-bold text-[#E2E3DF]">4K / 60 FPS</span>
                  </div>
                  <div className="p-2 bg-[#16181B] border border-[#282a2c] rounded-lg">
                    <span className="text-[10px] font-mono text-[#8E9297] block uppercase">Stabilisation</span>
                    <span className="text-xs font-mono font-bold text-[#2ECC71]">HyperSmooth</span>
                  </div>
                  <div className="p-2 bg-[#16181B] border border-[#282a2c] rounded-lg">
                    <span className="text-[10px] font-mono text-[#8E9297] block uppercase">Autonomie</span>
                    <span className="text-xs font-mono font-bold text-[#FFA640]">2x Li-Ion</span>
                  </div>
                </div>
              </div>

              {/* Right selection form */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                {/* Step 1: Option Pack Select */}
                <div>
                  <label className="font-mono text-xs text-[#E2E3DF] uppercase font-bold tracking-wider block mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#2ECC71]" />
                    <span>1. Choisissez votre Pack GoPro :</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Pack Basic */}
                    <div
                      onClick={() => {
                        tacticalAudio.playClick();
                        setGoProPack('basic');
                      }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        goProPack === 'basic'
                          ? 'bg-[#18241C] border-[#2ECC71] shadow-[0_0_15px_rgba(46,204,113,0.2)]'
                          : 'bg-[#111315] border-[#282a2c] hover:border-[#3B4D3F]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-['Space_Grotesk'] text-sm font-bold text-[#E2E3DF] uppercase">
                          Pack Basic
                        </span>
                        <span className="font-mono text-sm font-bold text-[#2ECC71]">10,00 €</span>
                      </div>
                      <p className="font-['Inter'] text-[11px] text-[#8E9297] leading-relaxed">
                        GoPro 4K + Fixation sélectionnée (Casque, Torse ou Réplique). Carte mémoire personnelle requise.
                      </p>
                    </div>

                    {/* Pack Full */}
                    <div
                      onClick={() => {
                        tacticalAudio.playClick();
                        setGoProPack('full');
                      }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        goProPack === 'full'
                          ? 'bg-[#241E18] border-[#FFA640] shadow-[0_0_15px_rgba(255,166,64,0.2)]'
                          : 'bg-[#111315] border-[#282a2c] hover:border-[#FFA640]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-['Space_Grotesk'] text-sm font-bold text-[#E2E3DF] uppercase flex items-center gap-1">
                          <span>Pack Full</span>
                          <span className="px-1.5 py-0.2 bg-[#FFA640]/20 text-[#FFA640] rounded font-mono text-[9px]">RECOMMANDÉ</span>
                        </span>
                        <span className="font-mono text-sm font-bold text-[#FFA640]">15,00 €</span>
                      </div>
                      <p className="font-['Inter'] text-[11px] text-[#8E9297] leading-relaxed">
                        GoPro 4K + Fixation sélectionnée + Carte MicroSD 64GB Extreme Pro fournie (vous conservez la carte).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 2: Mount Type Select */}
                <div>
                  <label className="font-mono text-xs text-[#E2E3DF] uppercase font-bold tracking-wider block mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FFA640]" />
                    <span>2. Type de Fixation Tactique :</span>
                  </label>
                  <select
                    value={goProMount}
                    onChange={(e) => {
                      tacticalAudio.playClick();
                      setGoProMount(e.target.value);
                    }}
                    className="w-full bg-[#111315] border border-[#333537] focus:border-[#2ECC71] rounded-xl px-4 py-3 text-xs font-mono text-[#E2E3DF] uppercase outline-none transition-colors cursor-pointer"
                  >
                    <option value="Fixation Casque">Fixation Casque (Support NVG / Rail Fast Helmet)</option>
                    <option value="Fixation Torse">Fixation Torse (Harnais Tactique Chest Rig)</option>
                    <option value="Fixation Réplique">Fixation Réplique (Rail Picatinny 20mm)</option>
                  </select>
                </div>

                {/* Step 3: Mandatory Caution Checkbox */}
                <div className="p-3.5 bg-[#14181B] border border-[#333537] rounded-xl">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={goProDepositAgreed}
                      onChange={(e) => {
                        tacticalAudio.playClick();
                        setGoProDepositAgreed(e.target.checked);
                        if (e.target.checked) setGoProError(null);
                      }}
                      className="mt-0.5 w-4 h-4 rounded border-[#333537] bg-[#111315] text-[#2ECC71] focus:ring-0 cursor-pointer accent-[#2ECC71]"
                    />
                    <div className="text-xs font-mono">
                      <span className="text-[#E2E3DF] font-bold block">
                        Caution 100€ ou pièce d'identité requise le jour J *
                      </span>
                      <p className="text-[11px] text-[#8E9297] font-['Inter'] mt-0.5 leading-relaxed">
                        Régime fiscal : « TVA non applicable, art. 261-7-1° a du CGI ». Engagement officiel : « Caution restituée après contrôle du matériel ».
                      </p>
                    </div>
                  </label>
                </div>

                {/* Error Message */}
                {goProError && (
                  <div className="p-3 bg-[#2D1515] border border-[#E74C3C]/50 rounded-xl text-xs font-mono text-[#FF8585] flex items-center gap-2 animate-fadeIn">
                    <span className="material-symbols-outlined text-sm shrink-0">error</span>
                    <span>{goProError}</span>
                  </div>
                )}

                {/* Success Message */}
                {goProSuccessMsg && (
                  <div className="p-3 bg-[#142318] border border-[#2ECC71]/50 rounded-xl text-xs font-mono text-[#2ECC71] flex items-center gap-2 animate-fadeIn">
                    <span className="material-symbols-outlined text-sm shrink-0">check_circle</span>
                    <span>{goProSuccessMsg}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleAddGoProToCart}
                    className="w-full py-3 px-4 bg-[#E87A1E] hover:brightness-110 active:scale-95 text-[#111315] font-mono text-xs uppercase tracking-wider font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(232,122,30,0.3)] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">add_shopping_cart</span>
                    <span>Ajouter au Panier ({goProPrice.toFixed(2)} €)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCheckoutGoProDirect}
                    className="w-full py-3 px-4 bg-[#2ECC71] hover:brightness-110 active:scale-95 text-[#111315] font-mono text-xs uppercase tracking-wider font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(46,204,113,0.3)] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">shopping_cart_checkout</span>
                    <span>Régler via HelloAsso ({goProPrice.toFixed(2)} €)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
