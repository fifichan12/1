import React from 'react';
import { ShieldLogo } from './ShieldLogo';
import { SiteConfig } from '../data/siteStore';

interface FooterProps {
  siteConfig?: SiteConfig;
  onNavigate: (sectionId: string) => void;
  onOpenNextOpord: () => void;
}

export const Footer: React.FC<FooterProps> = ({ siteConfig, onNavigate, onOpenNextOpord }) => {
  const siteName = siteConfig?.siteName || 'FOST';
  const address = siteConfig?.terrainContact?.address || '17 Rue Maréchal Joffre, 57120 ROMBAS';
  const tribunal = siteConfig?.terrainContact?.tribunal || 'Registre des Associations du Tribunal Judiciaire de Metz';
  return (
    <footer className="w-full bg-[#0c0e10] border-t border-[#282a2c]">
      <div className="w-full px-4 sm:px-8 md:px-16 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1 */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <ShieldLogo size={34} showGlow={true} />
              <span className="font-['Space_Grotesk'] text-lg font-bold uppercase text-[#E2E3DF]">
                {siteName} AIRSOFT
              </span>
            </div>
            <p className="font-['Inter'] text-xs text-[#8E9297] mb-2 leading-relaxed">
              Association {siteConfig?.legalInfo?.associationName || "Force Opérationnelle de Simulation Tactique (F.O.S.T.)"} inscrite au {tribunal}.
            </p>
            <div className="text-[11px] font-mono text-[#8E9297] space-y-1 mb-3">
              <div>Siège : {address}</div>
              <div className="text-[#AECFB2]">Cotisations 2026 : Test 15€ • Membre 20€/an • Premium 80€/an</div>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="px-2 py-0.5 bg-[#3B4D3F] text-[#B7CCB9] rounded">MOSELLE (57)</span>
              <span className="px-2 py-0.5 bg-[#282a2c] text-[#AECFB2] rounded">SAISON 2026</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-[#E2E3DF] font-bold mb-3">
              Protocole & Sécurité
            </div>
            <ul className="space-y-1.5 font-['Inter'] text-xs text-[#8E9297]">
              <li>
                <span className="text-[#E87A1E] font-mono mr-1 font-bold">[01]</span> Port de lunettes balistiques homologuées (EN166B) obligatoire en permanence.
              </li>
              <li>
                <span className="text-[#E87A1E] font-mono mr-1 font-bold">[02]</span> Chrono 0.20g obligatoire : Max AEG 350 FPS / Anti-Snipe 400 FPS / Bolt 450 FPS.
              </li>
              <li>
                <span className="text-[#E87A1E] font-mono mr-1 font-bold">[03]</span> Billes biodégradables certifiées obligatoires sur tous les terrains FOST.
              </li>
              <li>
                <span className="text-[#E87A1E] font-mono mr-1 font-bold">[04]</span> Règle du 'Out' franc, respect absolu de la déclaration de touche.
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-[#E2E3DF] font-bold mb-3 flex items-center justify-between">
              <span>Canaux Opérationnels</span>
              <span className="text-[10px] text-[#2ECC71] bg-[#1A1D20] px-1.5 py-0.2 rounded border border-[#2ECC71]/30">7 RÉSEAUX</span>
            </div>
            <ul className="space-y-1.5 font-mono text-xs text-[#8E9297]">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2ECC71] text-sm shrink-0">radio</span>
                <span className="text-[#AECFB2]">RADIO : 446.00625 MHz (Ch. 1)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#5865F2] text-sm shrink-0">forum</span>
                <a 
                  href="https://discord.gg/fost-airsoft" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[#E2E3DF] hover:underline flex items-center justify-between w-full"
                >
                  <span>Discord : /fost-airsoft</span>
                  <span className="text-[10px] text-[#5865F2]">QG</span>
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#E1306C] text-sm shrink-0">photo_camera</span>
                <a 
                  href="https://instagram.com/fost_officiel" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[#E2E3DF] hover:underline flex items-center justify-between w-full"
                >
                  <span>Instagram : @fost_officiel</span>
                  <span className="text-[10px] text-[#E1306C]">HD</span>
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#FF0000] text-sm shrink-0">play_circle</span>
                <a 
                  href="https://youtube.com/@FOST_OFF" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[#E2E3DF] hover:underline flex items-center justify-between w-full"
                >
                  <span>YouTube : @FOST_OFF</span>
                  <span className="text-[10px] text-[#FF0000]">4K</span>
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#E2E3DF] text-sm shrink-0">videocam</span>
                <a 
                  href="https://tiktok.com/@fost_off" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[#E2E3DF] hover:underline flex items-center justify-between w-full"
                >
                  <span>TikTok : @fost_off</span>
                  <span className="text-[10px] text-[#8E9297]">Shorts</span>
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1877F2] text-sm shrink-0">public</span>
                <a 
                  href="https://facebook.com/fost.airsoft" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[#E2E3DF] hover:underline flex items-center justify-between w-full"
                >
                  <span>Facebook : FOST Airsoft</span>
                  <span className="text-[10px] text-[#1877F2]">Page</span>
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#E87A1E] text-sm shrink-0">mail</span>
                <a 
                  href="mailto:fost.contact.off@gmail.com" 
                  className="hover:text-[#E2E3DF] hover:underline flex items-center justify-between w-full truncate"
                >
                  <span className="truncate">Mail : fost.contact.off@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-[#E2E3DF] font-bold mb-3">
              Prochaine OP Confirmée
            </div>
            <div className="p-3.5 bg-[#1A1D20] border border-[#282a2c] rounded">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs text-[#E87A1E] font-bold">
                  OP : OMEGA DAWN
                </span>
                <span className="px-1.5 py-0.2 bg-[#3B4D3F] font-mono text-[10px] text-[#2ECC71] rounded font-bold">
                  OUVERT
                </span>
              </div>
              <p className="font-['Inter'] text-xs text-[#8E9297] mb-3">
                Secteur Forêt des Brumes. Briefing 08h30. 8 slots restants.
              </p>
              <button
                onClick={onOpenNextOpord}
                className="inline-flex items-center gap-1.5 font-mono text-xs uppercase text-[#E87A1E] hover:text-[#E2E3DF] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                Consulter l'Ordre de Mission
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Legal Copyright */}
        <div className="pt-6 border-t border-[#282a2c] flex flex-col md:flex-row items-center justify-between gap-4 text-[#8E9297] font-mono text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <span>© 2026 FOST Airsoft Association. Tous droits réservés.</span>
            <button onClick={() => onNavigate('faq')} className="hover:text-[#E2E3DF] text-[#E87A1E] transition-colors cursor-pointer font-bold">
              FAQ & Questions Fréquentes
            </button>
            <button onClick={() => onNavigate('reglement')} className="hover:text-[#E2E3DF] transition-colors cursor-pointer">
              Mentions Légales & Statuts
            </button>
            <button onClick={() => onNavigate('reglement')} className="hover:text-[#E2E3DF] transition-colors cursor-pointer">
              Charte Fair-Play & Sécurité
            </button>
          </div>
          <div className="flex items-center gap-1.5 text-[#AECFB2]">
            <span className="material-symbols-outlined text-[#E87A1E] text-sm">security</span>
            <span>AIRSOFT SOUS DÉCRET N°99-240 DU 24 MARS 1999</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
