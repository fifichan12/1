import React, { useState, useEffect } from 'react';
import { MEMBERSHIP_TIERS, FOST_LEGAL_INFO, MembershipTier } from '../data/fostData';
import { MembershipDocModal } from './MembershipDocModal';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { PaymentItem } from './PaymentModal';

interface CharterAndRecruitmentSectionProps {
  prefilledReplicaRequest?: string;
  onOpenPayment?: (item: PaymentItem) => void;
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
}

export const CharterAndRecruitmentSection: React.FC<CharterAndRecruitmentSectionProps> = ({
  prefilledReplicaRequest = '',
  onOpenPayment,
  onOpenAuth
}) => {
  const { userProfile } = useAuth();
  const { addItem } = useCart();
  const [selectedTier, setSelectedTier] = useState<'test' | 'standard' | 'premium'>('standard');
  const [membershipType, setMembershipType] = useState<'standard' | 'premium' | 'test'>('standard');

  // Form Fields
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [callsign, setCallsign] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [adresse, setAdresse] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [sponsorName, setSponsorName] = useState('');
  const [isMinor, setIsMinor] = useState(false);
  const [legalGuardian, setLegalGuardian] = useState('');
  const [message, setMessage] = useState(prefilledReplicaRequest);

  // Anti-Spam Honeypot field (invisible to humans)
  const [honeypot, setHoneypot] = useState('');

  // Legal Agreements
  const [agreedStatuts, setAgreedStatuts] = useState(false);
  const [agreedImage, setAgreedImage] = useState(true);
  const [agreedRgpd, setAgreedRgpd] = useState(true);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [registeredDossierId, setRegisteredDossierId] = useState<string | null>(null);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);

  // Auto-fill from connected user profile
  useEffect(() => {
    if (userProfile) {
      if (!callsign && userProfile.callsign) setCallsign(userProfile.callsign);
      if (!email && userProfile.email) setEmail(userProfile.email);
      if (!phone && userProfile.phone) setPhone(userProfile.phone);

      if (userProfile.displayName && (!nom || !prenom)) {
        const parts = userProfile.displayName.split(' ');
        if (parts.length > 1) {
          if (!prenom) setPrenom(parts[0]);
          if (!nom) setNom(parts.slice(1).join(' '));
        } else if (!prenom) {
          setPrenom(userProfile.displayName);
        }
      }
    }
  }, [userProfile]);

  // Sync if prefilled replica changes
  useEffect(() => {
    if (prefilledReplicaRequest) {
      setMessage(prefilledReplicaRequest);
    }
  }, [prefilledReplicaRequest]);

  // Scroll to form when selecting a tier card
  const handleSelectTier = (tier: MembershipTier) => {
    setSelectedTier(tier.id);
    setMembershipType(tier.id);
    const formEl = document.getElementById('adhesion-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getTierPrice = (type: 'test' | 'standard' | 'premium') => {
    if (type === 'test') return 15;
    if (type === 'premium') return 80;
    return 20;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Validation des cases obligatoires
    if (!agreedStatuts) {
      setSubmitError("Vous devez accepter les Statuts, le Règlement Intérieur et la Charte de Sécurité FOST.");
      return;
    }

    if (isMinor && !legalGuardian.trim()) {
      setSubmitError("Le nom et prénom du représentant légal sont obligatoires pour les candidats mineurs.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        nom,
        prenom,
        callsign,
        dateNaissance,
        adresse,
        email,
        telephone: phone,
        formule: membershipType,
        sponsorName,
        reglementAccepte: agreedStatuts,
        charteAccepte: agreedStatuts,
        droitImageAccepte: agreedImage,
        isMinor,
        nomTuteur: isMinor ? legalGuardian : undefined,
        message,
        honeypot,
        userId: userProfile?.uid
      };

      const res = await fetch('/api/adhesions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l\'enregistrement du dossier');
      }

      setRegisteredDossierId(data.dossierId);
      setIsSubmitting(false);

      // Déclenchement automatique de la passerelle de paiement sécurisée liée au dossier !
      if (onOpenPayment) {
        const targetTier = MEMBERSHIP_TIERS.find((t) => t.id === membershipType) || MEMBERSHIP_TIERS[1];
        onOpenPayment({
          dossierId: data.dossierId,
          title: `Cotisation ${targetTier.name} // Saison 2026`,
          category: 'ADHESION',
          amount: data.montant || targetTier.price,
          description: `Règlement cotisation officielle FOST (Dossier ${data.dossierId}) - ${targetTier.name}`,
          tierId: targetTier.id
        });
      }
    } catch (err: any) {
      console.error('Erreur soumission dossier:', err);
      setSubmitError(err.message || 'Erreur de transmission réseau');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full py-16 md:py-24 px-4 sm:px-8 md:px-16 bg-[#1a1c1e] relative">
      {/* SECTION 1: HEADER & GRILLE TARIFAIRE DES ADHÉSIONS */}
      <div className="max-w-7xl mx-auto mb-16 scroll-mt-28" id="tarifs-adhesion">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs">
              <span className="px-2 py-0.5 bg-[#111315] text-[#E87A1E] rounded font-bold uppercase">
                COTISATIONS // SAISON 2026
              </span>
              <span className="text-[#8E9297]">•</span>
              <span className="text-[#AECFB2]">{FOST_LEGAL_INFO.tribunal}</span>
            </div>
            <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#E2E3DF] font-bold">
              Tarifs d'Adhésion & <span className="text-[#E87A1E]">Formules Membres</span>
            </h2>
            <p className="font-['Inter'] text-sm md:text-base text-[#8E9297] max-w-2xl mt-2 leading-relaxed">
              Rejoignez l'association FOST avec des cotisations transparentes et homologuées. Choisissez votre formule puis complétez le dossier officiel en ligne pour validation sécurisée.
            </p>
          </div>

          <button
            onClick={() => setIsDocModalOpen(true)}
            className="self-start md:self-auto px-4 py-2.5 bg-[#22262B] hover:bg-[#282a2c] text-[#E2E3DF] hover:text-[#E87A1E] border border-[#333537] hover:border-[#E87A1E] font-mono text-xs uppercase font-bold rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <span className="material-symbols-outlined text-base">description</span>
            <span>Consulter la Fiche Officielle 2026</span>
          </button>
        </div>

        {/* 3 PRICING CARDS SANS AUCUN PAIEMENT DIRECT (RÈGLE DEMANDE 4) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MEMBERSHIP_TIERS.map((tier) => {
            const isSelected = membershipType === tier.id;
            return (
              <div
                key={tier.id}
                className={`relative bg-[#141618] rounded-2xl border-2 transition-all p-6 flex flex-col justify-between shadow-xl ${
                  tier.highlight
                    ? 'border-[#2ECC71] shadow-[0_0_30px_rgba(46,204,113,0.15)] bg-gradient-to-b from-[#19241c] to-[#141618]'
                    : isSelected
                    ? 'border-[#E87A1E]'
                    : 'border-[#282a2c] hover:border-[#3B4D3F]'
                }`}
              >
                {/* Badge top */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: `${tier.color}20`,
                      color: tier.color,
                      border: `1px solid ${tier.color}40`,
                    }}
                  >
                    {tier.badge}
                  </span>
                  {tier.highlight && (
                    <span className="flex items-center gap-1 font-mono text-[10px] text-[#2ECC71] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC71] animate-ping"></span>
                      OFFICIEL
                    </span>
                  )}
                </div>

                {/* Card Title & Price */}
                <div>
                  <h3 className="font-['Space_Grotesk'] text-xl font-bold uppercase text-[#E2E3DF]">
                    {tier.name}
                  </h3>
                  <p className="font-mono text-xs text-[#8E9297] mb-4">
                    {tier.subtitle}
                  </p>

                  <div className="flex items-baseline gap-2 mb-4 pb-4 border-b border-[#282a2c]">
                    <span
                      className="font-['Space_Grotesk'] text-4xl sm:text-5xl font-bold tracking-tight"
                      style={{ color: tier.color }}
                    >
                      {tier.price} €
                    </span>
                    <span className="font-mono text-xs text-[#8E9297] uppercase">
                      / {tier.period}
                    </span>
                  </div>

                  <p className="font-['Inter'] text-xs text-[#E2E3DF] mb-4 leading-relaxed">
                    {tier.description}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {tier.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-start gap-2 text-xs font-mono">
                        <span className="material-symbols-outlined text-sm shrink-0 mt-0.5 text-[#2ECC71]">
                          check
                        </span>
                        <span className="text-[#E2E3DF]">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA BUTTONS : REMPLIR LE DOSSIER OU AJOUTER AU PANIER */}
                <div className="mt-4 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectTier(tier)}
                    className={`w-full py-3 font-mono text-xs uppercase font-bold tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
                      tier.highlight
                        ? 'bg-[#2ECC71] hover:brightness-110 text-[#111315] shadow-[0_0_16px_rgba(46,204,113,0.3)]'
                        : tier.id === 'premium'
                        ? 'bg-[#E87A1E] hover:brightness-110 text-[#111315] shadow-[0_0_16px_rgba(232,122,30,0.3)]'
                        : 'bg-[#22262B] hover:bg-[#282a2c] text-[#38BDF8] border border-[#38BDF8]/40'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">edit_document</span>
                    <span>Remplir le Dossier ({tier.price} €)</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addItem({
                        id: `membership-${tier.id}`,
                        productId: `tier-${tier.id}`,
                        title: tier.name,
                        category: 'MEMBERSHIP',
                        variant: `${tier.subtitle} (${tier.price} € / ${tier.period})`,
                        price: tier.price,
                        requiresAgeCheck: false,
                        metadata: {
                          tierId: tier.id,
                          badge: tier.badge
                        }
                      });
                    }}
                    className="w-full py-2 bg-[#1A1D20] hover:bg-[#22262B] text-[#AECFB2] hover:text-[#2ECC71] border border-[#282a2c] hover:border-[#2ECC71]/40 font-mono text-[11px] uppercase rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Ajouter cette formule d'adhésion au panier"
                  >
                    <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                    <span>Ajouter au Panier ({tier.price} €)</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: LES 4 PILIERS & FORMULAIRE D'ADHÉSION OFFICIEL EN LIGNE */}
      <div id="recrutement" className="scroll-mt-28" />
      <div
        className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start scroll-mt-28"
        id="adhesion-form"
      >
        {/* Les 4 Piliers Inviolables (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 bg-[#1A1D20] font-mono text-xs text-[#E87A1E] rounded uppercase">
                Éthique d'Engagement
              </span>
              <span className="font-mono text-xs text-[#8E9297]">
                // CODE MILITAIRE FOST
              </span>
            </div>

            <h3 className="font-['Space_Grotesk'] text-2xl md:text-3xl uppercase tracking-tight text-[#E2E3DF] font-bold mb-3">
              Les 4 Piliers Inviolables
            </h3>

            <p className="font-['Inter'] text-xs md:text-sm text-[#8E9297] mb-6 leading-relaxed">
              Rejoindre FOST, c'est signer un pacte de respect mutuel sur le terrain. L'airsoft repose sur la sincérité du tir et l'honneur de chaque joueur.
            </p>

            <div className="space-y-3.5">
              {/* Pilier 1 */}
              <div className="flex items-start gap-3 bg-[#1A1D20] border border-[#282a2c] p-3.5 rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-[#E87A1E]/20 text-[#E87A1E] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-lg">verified_user</span>
                </div>
                <div>
                  <h4 className="font-['Space_Grotesk'] text-sm text-[#E2E3DF] font-bold mb-0.5">
                    100% Fair-Play & Auto-Déclaration
                  </h4>
                  <p className="font-['Inter'] text-xs text-[#8E9297] leading-relaxed">
                    Toute bille touchant le corps ou la réplique entraîne l'annonce immédiate du "OUT". Aucun compromis n'est toléré.
                  </p>
                </div>
              </div>

              {/* Pilier 2 */}
              <div className="flex items-start gap-3 bg-[#1A1D20] border border-[#282a2c] p-3.5 rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-[#2ECC71]/20 text-[#2ECC71] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-lg">visibility</span>
                </div>
                <div>
                  <h4 className="font-['Space_Grotesk'] text-sm text-[#E2E3DF] font-bold mb-0.5">
                    Sécurité Balistique EN166B
                  </h4>
                  <p className="font-['Inter'] text-xs text-[#8E9297] leading-relaxed">
                    Port des protections oculaires normalisées obligatoire dès l'accès à la zone de jeu. Masque bas grillagé vivement recommandé en CQB.
                  </p>
                </div>
              </div>

              {/* Pilier 3 */}
              <div className="flex items-start gap-3 bg-[#1A1D20] border border-[#282a2c] p-3.5 rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-[#38BDF8]/20 text-[#38BDF8] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-lg">eco</span>
                </div>
                <div>
                  <h4 className="font-['Space_Grotesk'] text-sm text-[#E2E3DF] font-bold mb-0.5">
                    Billes Bio 100% Dégradables
                  </h4>
                  <p className="font-['Inter'] text-xs text-[#8E9297] leading-relaxed">
                    Respect absolu des 25 hectares de forêt et des infrastructures industrielles de Rombas. Zéro déchet plastique sur site.
                  </p>
                </div>
              </div>

              {/* Pilier 4 */}
              <div className="flex items-start gap-3 bg-[#1A1D20] border border-[#282a2c] p-3.5 rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-[#FFA640]/20 text-[#FFA640] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-lg">military_tech</span>
                </div>
                <div>
                  <h4 className="font-['Space_Grotesk'] text-sm text-[#E2E3DF] font-bold mb-0.5">
                    Esprit d'Escouade & Fraternité
                  </h4>
                  <p className="font-['Inter'] text-xs text-[#8E9297] leading-relaxed">
                    Accueil bienveillant des nouveaux joueurs, entraide mécanique au chrony et cohésion d'équipe lors des briefings tactiques.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DOSSIER D'ADHÉSION COMPLET (7 cols) */}
        <div className="lg:col-span-7 bg-[#16181A] border-2 border-[#282a2c] rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#282a2c]">
            <div>
              <span className="font-mono text-xs text-[#E87A1E] font-bold uppercase">
                FORMULAIRE OFFICIEL D'INSCRIPTION 2026
              </span>
              <h3 className="font-['Space_Grotesk'] text-xl sm:text-2xl uppercase tracking-tight text-[#E2E3DF] font-bold mt-0.5">
                DOSSIER D'ADHÉSION // FOST SQUAD
              </h3>
            </div>
            <div className="text-right">
              <span className="font-mono text-[10px] text-[#8E9297] uppercase block">Cotisation</span>
              <span className="font-['Space_Grotesk'] text-2xl font-bold text-[#2ECC71]">
                {getTierPrice(membershipType)} €
              </span>
            </div>
          </div>

          {/* BANDEAU SI DÉCONNECTÉ OU CONNECTÉ */}
          {!userProfile ? (
            <div className="mb-5 p-3 bg-[#1E2226] border border-[#E87A1E]/30 rounded-xl flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-[#E87A1E]">
                <span className="material-symbols-outlined text-base">info</span>
                <span>Vous possédez déjà un compte opérateur ?</span>
              </div>
              {onOpenAuth && (
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="px-3 py-1 bg-[#E87A1E] text-[#111315] font-bold rounded hover:brightness-110 cursor-pointer"
                >
                  Se connecter
                </button>
              )}
            </div>
          ) : (
            <div className="mb-5 p-3 bg-[#142218] border border-[#2ECC71]/40 rounded-xl flex items-center justify-between text-xs font-mono text-[#2ECC71]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">verified</span>
                <span>Compte connecté : [{userProfile.callsign}] ({userProfile.email})</span>
              </div>
              <span className="text-[10px] bg-[#2ECC71]/20 px-2 py-0.5 rounded font-bold">
                PRÉ-REMPLI
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Champ Honeypot invisible anti-spam */}
            <input
              type="text"
              name="website_security_trap"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="hidden opacity-0 pointer-events-none absolute -left-[9999px]"
              tabIndex={-1}
              autoComplete="off"
            />

            {/* Sélecteur de Formule */}
            <div>
              <label className="block font-mono text-xs uppercase text-[#8E9297] mb-2 font-semibold">
                01. FORMULE D'ADHÉSION SÉLECTIONNÉE *
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setMembershipType('test')}
                  className={`p-3 rounded-xl border text-left font-mono transition-all cursor-pointer ${
                    membershipType === 'test'
                      ? 'bg-[#15232d] border-[#38BDF8] text-[#38BDF8] shadow-[0_0_12px_rgba(56,189,248,0.2)]'
                      : 'bg-[#111315] border-[#282a2c] text-[#8E9297] hover:text-[#E2E3DF]'
                  }`}
                >
                  <div className="text-[11px] font-bold">Découverte (15 €)</div>
                  <div className="text-[10px] text-[#8E9297]">Session d'essai</div>
                </button>

                <button
                  type="button"
                  onClick={() => setMembershipType('standard')}
                  className={`p-3 rounded-xl border text-left font-mono transition-all cursor-pointer ${
                    membershipType === 'standard'
                      ? 'bg-[#15241b] border-[#2ECC71] text-[#2ECC71] shadow-[0_0_12px_rgba(46,204,113,0.2)]'
                      : 'bg-[#111315] border-[#282a2c] text-[#8E9297] hover:text-[#E2E3DF]'
                  }`}
                >
                  <div className="text-[11px] font-bold">Titulaire (20 €)</div>
                  <div className="text-[10px] text-[#8E9297]">Saison 2026 (0€/OP)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setMembershipType('premium')}
                  className={`p-3 rounded-xl border text-left font-mono transition-all cursor-pointer ${
                    membershipType === 'premium'
                      ? 'bg-[#271d15] border-[#E87A1E] text-[#E87A1E] shadow-[0_0_12px_rgba(232,122,30,0.2)]'
                      : 'bg-[#111315] border-[#282a2c] text-[#8E9297] hover:text-[#E2E3DF]'
                  }`}
                >
                  <div className="text-[11px] font-bold">Premium (80 €)</div>
                  <div className="text-[10px] text-[#8E9297]">Tactical Élite</div>
                </button>
              </div>
            </div>

            {/* Identité : Nom, Prénom, Callsign */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs uppercase text-[#8E9297]">Nom Civil *</label>
                <input
                  type="text"
                  required
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Dubois"
                  className="bg-[#111315] px-3 py-2 rounded-lg border border-[#333537] text-[#E2E3DF] font-['Inter'] text-xs focus:border-[#E87A1E] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs uppercase text-[#8E9297]">Prénom Civil *</label>
                <input
                  type="text"
                  required
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Alexandre"
                  className="bg-[#111315] px-3 py-2 rounded-lg border border-[#333537] text-[#E2E3DF] font-['Inter'] text-xs focus:border-[#E87A1E] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs uppercase text-[#8E9297]">Callsign Terrain *</label>
                <input
                  type="text"
                  required
                  value={callsign}
                  onChange={(e) => setCallsign(e.target.value)}
                  placeholder="Ex: SHADOW"
                  className="bg-[#111315] px-3 py-2 rounded-lg border border-[#333537] text-[#E2E3DF] font-['Inter'] text-xs focus:border-[#E87A1E] focus:outline-none"
                />
              </div>
            </div>

            {/* Date de naissance & Adresse postale */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs uppercase text-[#8E9297]">Date de Naissance *</label>
                <input
                  type="date"
                  required
                  value={dateNaissance}
                  onChange={(e) => setDateNaissance(e.target.value)}
                  className="bg-[#111315] px-3 py-2 rounded-lg border border-[#333537] text-[#E2E3DF] font-['Inter'] text-xs focus:border-[#E87A1E] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs uppercase text-[#8E9297]">Adresse Postale Complète *</label>
                <input
                  type="text"
                  required
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  placeholder="12 rue des Usines, 57120 Rombas"
                  className="bg-[#111315] px-3 py-2 rounded-lg border border-[#333537] text-[#E2E3DF] font-['Inter'] text-xs focus:border-[#E87A1E] focus:outline-none"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs uppercase text-[#8E9297]">Email de Contact *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alexandre@exemple.fr"
                  className="bg-[#111315] px-3 py-2 rounded-lg border border-[#333537] text-[#E2E3DF] font-['Inter'] text-xs focus:border-[#E87A1E] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs uppercase text-[#8E9297]">Téléphone d'Urgence *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="06 12 34 56 78"
                  className="bg-[#111315] px-3 py-2 rounded-lg border border-[#333537] text-[#E2E3DF] font-['Inter'] text-xs focus:border-[#E87A1E] focus:outline-none"
                />
              </div>
            </div>

            {/* Parrain recommandant */}
            <div className="p-3 bg-[#111315] rounded-xl border border-[#282a2c] space-y-1">
              <label className="font-mono text-xs uppercase text-[#8E9297] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#E87A1E]">handshake</span>
                <span>Membre Parrain Recommandant *</span>
              </label>
              <input
                type="text"
                required
                value={sponsorName}
                onChange={(e) => setSponsorName(e.target.value)}
                placeholder="Ex: Ilyane (Viper), Sofiane, Ilian, Noah, Luciano, ou autre opérateur actif"
                className="w-full bg-[#16181A] px-3 py-2 rounded-lg border border-[#333537] text-[#E2E3DF] font-['Inter'] text-xs focus:border-[#E87A1E] focus:outline-none"
              />
            </div>

            {/* Statut Mineur */}
            <div className="p-3 bg-[#141618] rounded-xl border border-[#282a2c] space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="minor-check"
                  checked={isMinor}
                  onChange={(e) => setIsMinor(e.target.checked)}
                  className="accent-[#E87A1E] w-4 h-4 rounded cursor-pointer"
                />
                <label htmlFor="minor-check" className="font-mono text-xs text-[#E2E3DF] cursor-pointer">
                  Le candidat est MINEUR (&lt; 18 ans au jour de l'adhésion)
                </label>
              </div>

              {isMinor && (
                <div className="pt-2 border-t border-[#282a2c] space-y-2 animate-fadeIn">
                  <p className="text-[11px] text-[#E74C3C] font-mono leading-relaxed">
                    Conformément au <strong>décret n° 99-240</strong>, l'accès aux répliques développant une énergie &gt; 0,08 Joule est strictement interdit aux mineurs.
                  </p>
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-xs text-[#8E9297] uppercase">
                      Nom & Prénom du Représentant Légal (Père / Mère / Tuteur) *
                    </label>
                    <input
                      type="text"
                      required={isMinor}
                      value={legalGuardian}
                      onChange={(e) => setLegalGuardian(e.target.value)}
                      placeholder="Ex: M. Dubois Patrick"
                      className="bg-[#111315] px-3 py-2 rounded-lg border border-[#333537] text-[#E2E3DF] text-xs font-['Inter'] focus:border-[#E87A1E] focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Précisions / Message */}
            <div className="flex flex-col gap-1">
              <label className="font-mono text-xs uppercase text-[#8E9297]">
                Précisions matériel ou compétences particulières (secourisme, mécanique, photo...)
              </label>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ex: Possède réplique MP5, brevet PSC1, dispo les week-ends..."
                className="bg-[#111315] px-3 py-2 rounded-lg border border-[#333537] text-[#E2E3DF] font-['Inter'] text-xs focus:border-[#E87A1E] focus:outline-none resize-none"
              />
            </div>

            {/* Cases à cocher légales */}
            <div className="space-y-2 pt-2 border-t border-[#282a2c] text-xs font-['Inter'] text-[#8E9297]">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  required
                  id="statuts-check"
                  checked={agreedStatuts}
                  onChange={(e) => setAgreedStatuts(e.target.checked)}
                  className="accent-[#E87A1E] w-4 h-4 rounded cursor-pointer mt-0.5"
                />
                <label htmlFor="statuts-check" className="cursor-pointer">
                  J'atteste avoir pris connaissance des <strong>Statuts FOST</strong>, du <strong>Règlement Intérieur</strong> et de la <strong>Charte de Sécurité</strong> et m'engage à respecter les règles de fair-play. *
                </label>
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="image-check"
                  checked={agreedImage}
                  onChange={(e) => setAgreedImage(e.target.checked)}
                  className="accent-[#E87A1E] w-4 h-4 rounded cursor-pointer mt-0.5"
                />
                <label htmlFor="image-check" className="cursor-pointer">
                  J'autorise l'association à diffuser les photos/vidéos prises lors des parties sur les médias officiels FOST.
                </label>
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  required
                  id="rgpd-check"
                  checked={agreedRgpd}
                  onChange={(e) => setAgreedRgpd(e.target.checked)}
                  className="accent-[#E87A1E] w-4 h-4 rounded cursor-pointer mt-0.5"
                />
                <label htmlFor="rgpd-check" className="cursor-pointer">
                  Conformité RGPD : Les données saisies sont exclusivement utilisées par le bureau FOST pour la gestion de l'adhésion et ne sont jamais cédées à des tiers. *
                </label>
              </div>
            </div>

            {/* Feedback d'erreur */}
            {submitError && (
              <div className="p-3 bg-[#2D1616] border border-[#E74C3C] rounded-xl text-xs font-mono text-[#E74C3C] flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                <span>{submitError}</span>
              </div>
            )}

            {/* Feedback succès dossier */}
            {registeredDossierId && (
              <div className="p-4 bg-[#142218] border border-[#2ECC71] rounded-xl text-xs font-mono text-[#2ECC71] space-y-3 animate-fadeIn">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <span className="material-symbols-outlined text-lg">verified</span>
                  <span>DOSSIER D'ADHÉSION ENREGISTRÉ [{registeredDossierId}]</span>
                </div>
                <p className="text-[#AECFB2]">
                  Un e-mail récapitulatif complet a été expédié au bureau (<strong>fost.contact.off@gmail.com</strong>) et un accusé de réception a été envoyé à <strong>{email}</strong>.
                </p>
                <div className="pt-1 space-y-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenPayment) {
                        const targetTier = MEMBERSHIP_TIERS.find((t) => t.id === membershipType) || MEMBERSHIP_TIERS[1];
                        onOpenPayment({
                          dossierId: registeredDossierId,
                          title: `Cotisation ${targetTier.name} // Saison 2026`,
                          category: 'ADHESION',
                          amount: getTierPrice(membershipType),
                          description: `Règlement cotisation officielle FOST (Dossier ${registeredDossierId}) - ${targetTier.name}`,
                          tierId: targetTier.id
                        });
                      }
                    }}
                    className="w-full py-3.5 bg-[#2ECC71] hover:brightness-110 active:scale-95 text-[#111315] font-mono text-xs uppercase font-bold tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(46,204,113,0.35)] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">lock</span>
                    <span>Procéder au Règlement ({getTierPrice(membershipType)} €) via HelloAsso</span>
                  </button>
                  <p className="text-center font-mono text-[11px] text-[#AECFB2]">
                    🔒 Paiement sécurisé via HelloAsso
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#2ECC71] hover:brightness-110 active:scale-95 disabled:bg-[#333537] text-[#111315] font-mono text-xs uppercase font-bold tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(46,204,113,0.35)] cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined text-base animate-spin">sync</span>
                    <span>Enregistrement du dossier en cours...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">how_to_reg</span>
                    <span>
                      Valider le Dossier & Procéder au Paiement ({getTierPrice(membershipType)} €)
                    </span>
                  </>
                )}
              </button>
              <p className="text-center font-mono text-xs text-[#8E9297] flex items-center justify-center gap-1.5 pt-1">
                <span className="material-symbols-outlined text-sm text-[#2ECC71]">lock</span>
                <span>Paiement sécurisé via HelloAsso</span>
              </p>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-[#282a2c] flex flex-wrap items-center justify-between text-xs text-[#8E9297] font-mono">
            <span>RÉPONSE DU BUREAU : &lt; 24H</span>
            <span className="text-[#AECFB2]">NOTIFICATION EMAIL : fost.contact.off@gmail.com</span>
          </div>
        </div>
      </div>

      {/* Modal Fiche Officielle 2026 */}
      <MembershipDocModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        activeTier={selectedTier}
      />
    </div>
  );
};
