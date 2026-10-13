import React, { useState } from 'react';
import { TerrainContactConfig } from '../data/siteStore';

interface TerrainAndContactSectionProps {
  terrainContact?: TerrainContactConfig;
}

export const TerrainAndContactSection: React.FC<TerrainAndContactSectionProps> = ({
  terrainContact
}) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    callsign: '',
    fullname: '',
    email: '',
    phone: '',
    subject: 'recrutement',
    message: '',
    rgpd: false
  });

  const gpsRaw = terrainContact?.gpsRaw || '47.4568, 0.6892';
  const gpsDisplay = terrainContact?.gpsDisplay || '47.4568° N, 0.6892° E';
  const hqName = terrainContact?.hqName || 'FOST // HQ TRANS-09';
  const address = terrainContact?.address || '17 Rue Maréchal Joffre, 57120 ROMBAS';
  const postalRegion = terrainContact?.postalRegion || 'MOSELLE (57) • GRAND EST';
  const emailContact = terrainContact?.email || 'fost.contact.off@gmail.com';
  const commLink = terrainContact?.commLink || 'PMR-446 CH-01 ACTIVE';
  const discordLink = terrainContact?.socialLinks?.discord || 'https://discord.gg/fost-airsoft';
  const instagramLink = terrainContact?.socialLinks?.instagram || 'https://instagram.com/fost_officiel';
  const youtubeLink = terrainContact?.socialLinks?.youtube || 'https://youtube.com/@FOST_OFF';
  const tiktokLink = terrainContact?.socialLinks?.tiktok || 'https://tiktok.com/@fost_off';
  const facebookLink = terrainContact?.socialLinks?.facebook || 'https://facebook.com/fost.airsoft';

  const handleCopyGps = () => {
    navigator.clipboard.writeText(gpsRaw);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.rgpd) return;
    setFormSubmitted(true);
  };

  return (
    <div className="w-full bg-[#121416] py-16 md:py-24 px-4 sm:px-8 md:px-16">
      {/* Top Telemetry Strip */}
      <div className="w-full bg-[#0c0e10] py-2 px-4 rounded border border-[#282a2c] mb-8 shadow-sm">
        <div className="w-full flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center gap-4 flex-wrap text-[#8E9297]">
            <span className="flex items-center gap-1.5 text-[#E87A1E] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#2ECC71] animate-pulse"></span>
              GRID POS: {gpsDisplay}
            </span>
            <span className="hidden md:inline text-[#333537]">|</span>
            <span className="text-[#E2E3DF]">SEC-ID: ROMBAS-57120 // ZONE-04</span>
            <span className="hidden md:inline text-[#333537]">|</span>
            <span className="text-[#8E9297]">COMM-LINK: {commLink}</span>
          </div>
          <div className="flex items-center gap-2 text-[#2ECC71]">
            <span className="material-symbols-outlined text-sm">verified</span>
            <span className="uppercase tracking-widest text-[#AECFB2] font-semibold">
              Terrain Déclaré Préfecture 57 & TJ Metz
            </span>
          </div>
        </div>
      </div>

      {/* Hero Sector Title */}
      <div className="flex flex-col gap-3 max-w-5xl mb-10">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-[#1A1D20] font-mono text-xs text-[#E87A1E] rounded uppercase font-bold">
            {hqName}
          </span>
          <span className="text-[#8E9297] font-mono text-xs">{postalRegion}</span>
          <span className="px-2 py-0.5 bg-[#3B4D3F] text-[#B7CCB9] font-mono text-xs rounded">DEFCON-4 PRÊT</span>
        </div>

        <h1 className="font-['Space_Grotesk'] text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#E2E3DF] font-bold">
          QG & Secteur d'Engagement // <span className="text-[#E87A1E]">FOST Airsoft</span>
        </h1>

        <p className="font-['Inter'] text-sm md:text-base text-[#8E9297] max-w-3xl leading-relaxed">
          Coordonnées de déploiement tactique, accès logistique au terrain boisé de Rombas, charte officielle de sécurité balistique et transmission directe avec l'état-major de l'association.
        </p>

        {/* Tactical Info 3 Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="flex items-center gap-3 p-3.5 bg-[#1A1D20] border border-[#282a2c] rounded shadow">
            <div className="w-10 h-10 bg-[#282a2c] rounded flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#E87A1E] text-xl">verified_user</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-mono text-[10px] text-[#8E9297] uppercase">Statut Zone</span>
              <span className="font-['Space_Grotesk'] text-base text-[#E2E3DF] font-bold truncate">Terrain Homologué</span>
              <span className="font-mono text-[10px] text-[#AECFB2]">Rombas 57120 (Moselle)</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 bg-[#1A1D20] border border-[#282a2c] rounded shadow">
            <div className="w-10 h-10 bg-[#282a2c] rounded flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#2ECC71] text-xl">radio</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-mono text-[10px] text-[#8E9297] uppercase">Fréquence Tactique</span>
              <span className="font-['Space_Grotesk'] text-base text-[#E2E3DF] font-bold">PMR CH-01</span>
              <span className="font-mono text-[10px] text-[#2ECC71]">446.00625 MHz (FOST HQ)</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 bg-[#1A1D20] border border-[#282a2c] rounded shadow">
            <div className="w-10 h-10 bg-[#282a2c] rounded flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#E74C3C] text-xl">emergency</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-mono text-[10px] text-[#8E9297] uppercase">Canal Médical</span>
              <span className="font-['Space_Grotesk'] text-base text-[#E2E3DF] font-bold">SAMU 15 // 112</span>
              <span className="font-mono text-[10px] text-[#ffb4ab]">Trousse IFAK Safe Zone</span>
            </div>
          </div>
        </div>
      </div>

      {/* PLAN D'ACCÈS TACTIQUE & SATELLITE HUD */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#E87A1E] rounded"></span>
            <span className="font-mono text-xs font-bold text-[#E87A1E] uppercase tracking-wider">
              [ SECTEUR ALPHA // LOGISTIQUE ] PLAN D'ACCÈS TACTIQUE & STATIONNEMENT
            </span>
          </div>
          <span className="font-mono text-xs text-[#8E9297]">
            DEP: 57 • SIÈGE ENREGISTRÉ AU TRIBUNAL JUDICIAIRE DE METZ
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Visual Map (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-3">
            <div className="relative w-full h-[420px] bg-[#1A1D20] border border-[#333537] rounded overflow-hidden shadow-xl flex flex-col justify-between p-4">
              {/* Satellite Background */}
              <div
                className="absolute inset-0 w-full h-full bg-cover bg-center filter grayscale contrast-125 brightness-75 opacity-75"
                style={{
                  backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBB9IrjWfO8MLS3WcLCFxkG-5u7eo7ixte06xCCTT7jmLgV1lowO8xSgvBy7m1stDZ5UNBOJ_6qIhTv-qgkDqYkSaXYpcNf0UyOObbwRyDtYadEkqEkrEbDJM-Pofg5oNT1wh8Vp4UviZv0BgnJ7j4mcQdNr4cOPEp2DmSYqbfZ-ebvxK0pdkPWhE6UuDc-Lb02GmtZ0r1_TvxoaFJ5I959dWQb7I42NUswL9QRw2ruE7nnqIE5PIga')"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111315] via-[#1A1D20]/50 to-[#111315]/80" />

              {/* Top HUD Compass */}
              <div className="relative z-10 flex items-center justify-between font-mono text-xs text-[#E2E3DF] bg-[#111315]/90 backdrop-blur-md px-3 py-1.5 rounded border border-[#282a2c]">
                <span className="flex items-center gap-1.5 text-[#E87A1E]">
                  <span className="material-symbols-outlined text-sm">explore</span> CAP NORD 012° • ALT. 310M
                </span>
                <span className="hidden sm:inline text-[#8E9297]">CARTO SATELLITE MIL-SPEC // ROMBAS VAL</span>
                <span className="text-[#2ECC71] font-bold">GPS LOCK [HIGH ACCURACY]</span>
              </div>

              {/* Waypoints */}
              <div className="relative z-10 flex-1 my-4">
                {/* Point 1: Parking */}
                <div className="absolute top-[65%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
                  <div className="flex items-center gap-1.5 bg-[#111315]/95 px-2.5 py-1 rounded shadow-lg border border-[#E87A1E]/50 group-hover:scale-105 transition-transform">
                    <span className="w-3 h-3 rounded-full bg-[#E87A1E] flex items-center justify-center text-[8px] font-bold text-[#111315]">P</span>
                    <span className="font-mono text-xs text-[#E2E3DF]">PARKING VÉHICULES</span>
                  </div>
                  <div className="w-2 h-2 bg-[#E87A1E] rounded-full mx-auto mt-0.5 animate-ping" />
                </div>

                {/* Point 2: Safe Zone */}
                <div className="absolute top-[45%] left-[48%] transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
                  <div className="flex items-center gap-1.5 bg-[#3B4D3F] px-2.5 py-1 rounded shadow-lg border border-[#2ECC71]/40 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[#2ECC71] text-sm">shield</span>
                    <span className="font-mono text-xs text-[#E2E3DF]">SAFE ZONE // CHRONO</span>
                  </div>
                  <div className="w-2 h-2 bg-[#2ECC71] rounded-full mx-auto mt-0.5 animate-pulse" />
                </div>

                {/* Point 3: Zone Bois */}
                <div className="absolute top-[20%] left-[72%] transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
                  <div className="flex items-center gap-1.5 bg-[#93000A]/90 px-2.5 py-1 rounded shadow-lg border border-[#ffb4ab]/40 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[#ffb4ab] text-sm">file_download_done</span>
                    <span className="font-mono text-xs text-[#E2E3DF]">ZONE ENGAGEMENT (BOIS)</span>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Action Strip */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-[#111315]/90 backdrop-blur-md p-3 rounded border border-[#282a2c]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#E87A1E] text-base">my_location</span>
                  <span className="font-mono text-sm text-[#E2E3DF] font-bold tracking-wider">
                    {gpsDisplay}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyGps}
                    className="px-3 py-1.5 bg-[#1A1D20] text-[#E2E3DF] font-mono text-xs uppercase rounded hover:bg-[#E87A1E] hover:text-[#111315] border border-[#333537] transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                    <span>Copier GPS</span>
                  </button>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(gpsRaw)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[#E87A1E] text-[#111315] font-mono text-xs uppercase font-bold rounded hover:brightness-110 transition-all flex items-center gap-1.5 shadow"
                  >
                    <span className="material-symbols-outlined text-sm">navigation</span>
                    <span>Google Maps / Waze</span>
                  </a>
                </div>
              </div>
            </div>

            {copySuccess && (
              <div className="font-mono text-xs text-[#2ECC71] bg-[#1A1D20] border border-[#2ECC71]/40 p-2 rounded flex items-center gap-2 animate-fadeIn">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>Coordonnées GPS copiées dans le presse-papier avec succès. Prêt pour calcul d'itinéraire.</span>
              </div>
            )}
          </div>

          {/* Logistics & Transit Protocol (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="p-4 bg-[#1A1D20] border border-[#333537] rounded flex flex-col gap-2">
              <span className="font-mono text-xs text-[#E87A1E] uppercase font-bold tracking-wider block mb-1">
                [ SIÈGE OPÉRATIONNEL & JURIDIQUE ]
              </span>
              <div className="font-['Space_Grotesk'] text-lg text-[#E2E3DF] font-bold">
                Association F.O.S.T. Airsoft
              </div>
              <p className="font-['Inter'] text-xs text-[#8E9297] leading-relaxed">
                {address}<br />
                {postalRegion}<br />
                <span className="font-mono text-[#AECFB2]">
                  Registre : Tribunal Judiciaire de Metz (Loi 1908/1901)
                </span>
              </p>
            </div>

            <div className="p-4 bg-[#1e2022] border border-[#333537] rounded flex flex-col gap-3 flex-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#E87A1E] text-base">gavel</span>
                <span className="font-['Space_Grotesk'] text-base text-[#E2E3DF] font-bold uppercase">
                  Règles d'Arrivée
                </span>
              </div>
              <div className="space-y-2.5 font-['Inter'] text-xs text-[#8E9297]">
                <div className="flex items-start gap-2">
                  <span className="font-mono text-xs text-[#E87A1E] font-bold shrink-0 pt-0.5">REQ-01</span>
                  <div>
                    <strong className="text-[#E2E3DF] block font-semibold">Housses et mallettes closes :</strong>
                    Aucune réplique apparente sur la voie publique. Transport strictement neutre et verrouillé jusqu'à la Safe Zone.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-xs text-[#E87A1E] font-bold shrink-0 pt-0.5">REQ-02</span>
                  <div>
                    <strong className="text-[#E2E3DF] block font-semibold">Aucun camouflage en agglomération :</strong>
                    Tenue civile obligatoire lors des trajets extérieurs et lors du transit dans la commune de Rombas.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-xs text-[#E87A1E] font-bold shrink-0 pt-0.5">REQ-03</span>
                  <div>
                    <strong className="text-[#E2E3DF] block font-semibold">Stationnement tactique balisé :</strong>
                    Véhicules garés en marche arrière (prêt à l'évacuation) uniquement sur les emplacements autorisés.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TRANSMISSION FORM SECTION */}
      <div className="bg-[#1A1D20] border border-[#333537] p-6 md:p-8 rounded shadow-xl mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b border-[#282a2c]">
          <div>
            <div className="flex items-center gap-2 text-[#E87A1E] mb-1">
              <span className="w-2.5 h-2.5 bg-[#E87A1E] rounded"></span>
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                [ CANAL ÉTAT-MAJOR // TRANSMISSION SÉCURISÉE ]
              </span>
            </div>
            <h2 className="font-['Space_Grotesk'] text-2xl uppercase text-[#E2E3DF] font-bold">
              Contacter le Bureau & Commandement FOST
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#AECFB2]">
            <span className="material-symbols-outlined text-sm text-[#2ECC71]">mark_email_read</span>
            CANAL OUVERT AUX OPÉRATEURS & ASSOCIATIONS
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Quick Direct info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 bg-[#141719] border border-[#282a2c] rounded">
              <span className="font-mono text-xs text-[#E87A1E] uppercase font-bold tracking-wider block mb-1">
                [ BOÎTE COURRIEL CENTRALE ]
              </span>
              <div className="font-['Space_Grotesk'] text-base text-[#E2E3DF] font-semibold mb-2">
                QG Tactique & Partenariats
              </div>
              <div className="p-2.5 bg-[#111315] border border-[#282a2c] rounded flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-[#E87A1E] font-bold truncate">
                  {emailContact}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(emailContact);
                    alert('Adresse courriel FOST copiée !');
                  }}
                  className="px-2 py-1 bg-[#1A1D20] text-[#E2E3DF] rounded hover:bg-[#E87A1E] hover:text-[#111315] text-xs font-mono transition-colors"
                >
                  <span className="material-symbols-outlined text-xs">content_copy</span>
                </button>
              </div>
            </div>

            <div className="p-4 bg-[#141719] border border-[#282a2c] rounded">
              <span className="font-mono text-xs text-[#AECFB2] uppercase font-bold block mb-1">
                [ PROTOCOLE DE RÉPONSE RAPIDE ]
              </span>
              <p className="font-['Inter'] text-xs text-[#8E9297] leading-relaxed">
                Le bureau associatif traite les transmissions sous un délai moyen de <strong>24 à 48 heures</strong> ouvrées. En cas d'événement majeur le week-end, contactez les coordinateurs via le Discord officiel ou le canal radio PMR lors du jour J.
              </p>
              <div className="mt-3 pt-2 border-t border-[#282a2c] flex items-center gap-2 font-mono text-[11px] text-[#2ECC71]">
                <span className="material-symbols-outlined text-sm">security</span>
                Données protégées RGPD & Statuts FOST
              </div>
            </div>
          </div>

          {/* Form (8 cols) */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs uppercase text-[#8E9297]">
                    Indicatif Tactique / Callsign (Optionnel)
                  </label>
                  <input
                    type="text"
                    value={formData.callsign}
                    onChange={(e) => setFormData({ ...formData, callsign: e.target.value })}
                    placeholder="ex: Ghost-57, Viper, Bravo-Leader"
                    className="bg-[#111315] px-3 py-2 rounded border border-[#333537] text-[#E2E3DF] font-mono text-xs focus:border-[#E87A1E] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs uppercase text-[#8E9297]">
                    Nom & Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullname}
                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                    placeholder="Jean Dupont"
                    className="bg-[#111315] px-3 py-2 rounded border border-[#333537] text-[#E2E3DF] font-['Inter'] text-xs focus:border-[#E87A1E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs uppercase text-[#8E9297]">
                    Adresse Email Opérationnelle *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="votre.nom@domaine.fr"
                    className="bg-[#111315] px-3 py-2 rounded border border-[#333537] text-[#E2E3DF] font-['Inter'] text-xs focus:border-[#E87A1E] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs uppercase text-[#8E9297]">
                    Numéro de Téléphone (Urgence / Suivi)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+33 6 00 00 00 00"
                    className="bg-[#111315] px-3 py-2 rounded border border-[#333537] text-[#E2E3DF] font-mono text-xs focus:border-[#E87A1E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs uppercase text-[#8E9297]">
                  Objet de la Transmission *
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="bg-[#111315] px-3 py-2 rounded border border-[#333537] text-[#E2E3DF] font-mono text-xs focus:border-[#E87A1E] focus:outline-none cursor-pointer"
                >
                  <option value="recrutement">Demande d'adhésion & Recrutement Escouade</option>
                  <option value="operation">Question sur une OP / Inscription Partie Dominicale</option>
                  <option value="partenariat">Partenariat, Échange Inter-Escouades & Sponsoring</option>
                  <option value="signalement">Signalement Terrain / Urgence Matériel / Autre</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs uppercase text-[#8E9297]">
                  Message Tactique *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Précisez votre demande, vos disponibilités, votre réplique principale ou votre escouade d'origine..."
                  className="bg-[#111315] px-3 py-2 rounded border border-[#333537] text-[#E2E3DF] font-['Inter'] text-xs focus:border-[#E87A1E] focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  required
                  id="contact-rgpd"
                  checked={formData.rgpd}
                  onChange={(e) => setFormData({ ...formData, rgpd: e.target.checked })}
                  className="mt-1 accent-[#E87A1E] rounded w-4 h-4 cursor-pointer"
                />
                <label htmlFor="contact-rgpd" className="font-['Inter'] text-xs text-[#8E9297] cursor-pointer">
                  J'accepte le traitement de mes données conformément aux statuts FOST et à la charte de confidentialité. Les informations recueillies sont strictement réservées à la coordination des opérations et à la sécurité du terrain.
                </label>
              </div>

              {formSubmitted && (
                <div className="p-3 bg-[#111315] border border-[#2ECC71]/40 rounded flex items-center gap-2 text-xs font-mono text-[#2ECC71] animate-fadeIn">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>Rapport transmis avec succès. Le commandement FOST vous contactera dans les 24h.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-[#E87A1E] text-[#111315] font-mono text-xs uppercase font-bold tracking-wider rounded hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(232,122,30,0.35)] cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">send</span>
                TRANSMETTRE AU BUREAU FOST
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* SOCIAL MEDIA & PMR RADIO BEACON */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#E87A1E] rounded"></span>
            <span className="font-mono text-xs font-bold text-[#E87A1E] uppercase tracking-wider">
              [ LIAISONS EXTÉRIEURES // RÉSEAU OFFICIEL ] CANAUX OPÉRATIONNELS & RÉSEAUX SOCIAUX F.O.S.T.
            </span>
          </div>
          <span className="font-mono text-xs text-[#8E9297]">
            REJOIGNEZ LA COMMUNAUTÉ TACTIQUE
          </span>
        </div>

        {/* 5 Social cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <a
            href={discordLink}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-[#1A1D20] border border-[#333537] hover:border-[#2ECC71] rounded shadow flex flex-col justify-between group transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 bg-[#282a2c] rounded flex items-center justify-center text-[#2ECC71]">
                <span className="material-symbols-outlined">forum</span>
              </div>
              <span className="font-mono text-xs text-[#8E9297] group-hover:text-[#E87A1E]">VOIR</span>
            </div>
            <div>
              <span className="font-['Space_Grotesk'] text-base text-[#E2E3DF] font-bold block">Discord FOST</span>
              <span className="font-mono text-xs text-[#8E9297] truncate block">{discordLink.replace('https://', '')}</span>
              <span className="font-mono text-xs text-[#2ECC71] mt-1 block">Briefings & Roster</span>
            </div>
          </a>

          <a
            href={instagramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-[#1A1D20] border border-[#333537] hover:border-[#E87A1E] rounded shadow flex flex-col justify-between group transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 bg-[#282a2c] rounded flex items-center justify-center text-[#E87A1E]">
                <span className="material-symbols-outlined">photo_camera</span>
              </div>
              <span className="font-mono text-xs text-[#8E9297] group-hover:text-[#E87A1E]">VOIR</span>
            </div>
            <div>
              <span className="font-['Space_Grotesk'] text-base text-[#E2E3DF] font-bold block">Instagram</span>
              <span className="font-mono text-xs text-[#8E9297] block">@fost_officiel</span>
              <span className="font-mono text-xs text-[#AECFB2] mt-1 block">Photos & Stories OP</span>
            </div>
          </a>

          <a
            href={youtubeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-[#1A1D20] border border-[#333537] hover:border-[#E74C3C] rounded shadow flex flex-col justify-between group transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 bg-[#282a2c] rounded flex items-center justify-center text-[#E74C3C]">
                <span className="material-symbols-outlined">play_circle</span>
              </div>
              <span className="font-mono text-xs text-[#8E9297] group-hover:text-[#E87A1E]">VOIR</span>
            </div>
            <div>
              <span className="font-['Space_Grotesk'] text-base text-[#E2E3DF] font-bold block">YouTube</span>
              <span className="font-mono text-xs text-[#8E9297] block">@FOST_OFF</span>
              <span className="font-mono text-xs text-[#8E9297] mt-1 block">Gameplay 4K & Debriefs</span>
            </div>
          </a>

          <a
            href={tiktokLink}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-[#1A1D20] border border-[#333537] hover:border-[#E2E3DF] rounded shadow flex flex-col justify-between group transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 bg-[#282a2c] rounded flex items-center justify-center text-[#E2E3DF]">
                <span className="material-symbols-outlined">videocam</span>
              </div>
              <span className="font-mono text-xs text-[#8E9297] group-hover:text-[#E87A1E]">VOIR</span>
            </div>
            <div>
              <span className="font-['Space_Grotesk'] text-base text-[#E2E3DF] font-bold block">TikTok</span>
              <span className="font-mono text-xs text-[#8E9297] block">@fost_off</span>
              <span className="font-mono text-xs text-[#8E9297] mt-1 block">Shorts & Action Cam</span>
            </div>
          </a>

          <a
            href={facebookLink}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-[#1A1D20] border border-[#333537] hover:border-[#E87A1E] rounded shadow flex flex-col justify-between group transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 bg-[#282a2c] rounded flex items-center justify-center text-[#E87A1E]">
                <span className="material-symbols-outlined">public</span>
              </div>
              <span className="font-mono text-xs text-[#8E9297] group-hover:text-[#E87A1E]">VOIR</span>
            </div>
            <div>
              <span className="font-['Space_Grotesk'] text-base text-[#E2E3DF] font-bold block">Facebook</span>
              <span className="font-mono text-xs text-[#8E9297] block">FOST Airsoft Officiel</span>
              <span className="font-mono text-xs text-[#AECFB2] mt-1 block">Événements & Photos</span>
            </div>
          </a>
        </div>

        {/* Radio PMR Beacon Strip */}
        <div className="p-4 md:p-6 bg-[#1A1D20] border border-[#333537] rounded flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#111315] rounded flex items-center justify-center shrink-0 border border-[#282a2c]">
              <span className="material-symbols-outlined text-[#2ECC71] text-2xl">podcasts</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-['Space_Grotesk'] text-lg text-[#E2E3DF] font-bold uppercase">
                  Canal Radio PMR 446 d'Urgence Terrain
                </span>
                <span className="px-2 py-0.5 bg-[#3B4D3F] text-[#AECFB2] font-mono text-[10px] rounded">
                  STAND-BY 24/7 EN PARTIE
                </span>
              </div>
              <p className="font-['Inter'] text-xs text-[#8E9297]">
                Toutes les escouades et marshalls écoutent en continu le <strong>Canal PMR 01 (Sous-canal CTCSS 00)</strong> pour les signalements sécurité et l'arrêt immédiat des tirs ("Arrêt de Jeu").
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0 bg-[#111315] p-3 rounded border border-[#282a2c]">
            <div className="flex flex-col text-right">
              <span className="font-mono text-[10px] text-[#8E9297]">FRÉQUENCE DIRECTE</span>
              <span className="font-mono text-lg text-[#2ECC71] font-bold">446.00625 MHz</span>
            </div>
            <div className="w-9 h-9 bg-[#1A1D20] rounded flex items-center justify-center text-[#E87A1E]">
              <span className="material-symbols-outlined">sensors</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
