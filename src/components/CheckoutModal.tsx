import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { tacticalAudio } from '../utils/audio';
import { ReceiptTemplate } from './ReceiptTemplate';
import { ReceiptDataContract } from '../utils/receiptGenerator';

export const CheckoutModal: React.FC = () => {
  const {
    items,
    total,
    isCheckoutOpen,
    closeCheckout,
    clearCart,
    hasReplicas,
    hasGoProRental
  } = useCart();
  const { userProfile } = useAuth();

  // Workflow steps: 1 = Details & Age Check, 2 = Payment Gateway, 3 = Confirmation & Receipt
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [callsign, setCallsign] = useState('');
  const [isAgeConfirmed, setIsAgeConfirmed] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Payment states
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Success / Receipt states
  const [orderId, setOrderId] = useState<string>('');
  const [receiptData, setReceiptData] = useState<ReceiptDataContract | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Pre-fill user profile info when modal opens or userProfile changes
  useEffect(() => {
    if (userProfile) {
      if (!fullName) setFullName(userProfile.displayName || '');
      if (!email) setEmail(userProfile.email || '');
      if (!callsign) setCallsign(userProfile.callsign || '');
    }
  }, [userProfile, isCheckoutOpen]);

  // Reset steps when closed
  const handleClose = () => {
    tacticalAudio.playClick();
    if (currentStep === 3) {
      clearCart();
    }
    setCurrentStep(1);
    setFormError(null);
    setPaymentError(null);
    closeCheckout();
  };

  if (!isCheckoutOpen) return null;

  // Validation Step 1
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    tacticalAudio.playClick();
    setFormError(null);

    if (!fullName.trim()) {
      setFormError('Veuillez renseigner votre nom complet.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Veuillez renseigner une adresse email valide pour la réception du reçu.');
      return;
    }
    if (hasReplicas && !isAgeConfirmed) {
      setFormError("Vous devez certifier être majeur (+18 ans) conformément au Décret n° 99-240 pour commander une réplique.");
      return;
    }
    if (!isTermsAccepted) {
      setFormError("Veuillez accepter le règlement intérieur de l'association F.O.S.T.");
      return;
    }

    // Si total est 0€ (ex: réservation Pass Membre Gratuit), on valide directement en étape 3
    if (total === 0) {
      completeZeroCostOrder();
      return;
    }

    setCurrentStep(2);
  };

  const completeZeroCostOrder = () => {
    const generatedId = `PASS-MEMBER-${Date.now().toString().slice(-6)}`;
    setOrderId(generatedId);
    const contract: ReceiptDataContract = {
      orderId: generatedId,
      payerName: fullName,
      payerEmail: email,
      itemType: 'MEMBER_OP_PASS',
      amount: 0.0,
      date: new Date().toISOString()
    };
    setReceiptData(contract);
    clearCart();
    setCurrentStep(3);
  };

  // Trigger HelloAsso Checkout Gateway
  const handleTriggerHelloAsso = async () => {
    tacticalAudio.playClick();
    setIsLoadingPayment(true);
    setPaymentError(null);

    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          payer: {
            fullName,
            email,
            phone,
            callsign: callsign || userProfile?.callsign
          },
          totalAmount: total,
          hasReplicas
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la préparation du paiement HelloAsso.');
      }

      // Si redirection externe vers HelloAsso Checkout
      if (data.redirectUrl && !data.isSimulation) {
        window.location.href = data.redirectUrl;
        return;
      }

      // Mode direct / simulation locale : Validation immédiate avec reçu
      const confirmedOrderId = data.orderId || `CMD-FOST-${Date.now().toString().slice(-6)}`;
      setOrderId(confirmedOrderId);

      // Reçu officiel contractuel
      const receiptContract: ReceiptDataContract = data.receiptData || {
        orderId: confirmedOrderId,
        payerName: fullName,
        payerEmail: email,
        itemType: hasReplicas
          ? 'REPLICA_PURCHASE'
          : items[0]?.category === 'MEMBERSHIP'
          ? 'MEMBERSHIP_ANNUAL'
          : 'FREELANCE_OP_PASS',
        amount: total,
        date: new Date().toISOString()
      };

      setReceiptData(receiptContract);
      clearCart();
      setCurrentStep(3);
    } catch (err: any) {
      console.error('Erreur Checkout HelloAsso:', err);
      setPaymentError(err.message || 'Impossible de joindre la passerelle de paiement.');
    } finally {
      setIsLoadingPayment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Dark backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={handleClose}
      />

      {/* Modal card */}
      <div className="relative w-full max-w-2xl bg-[#111315] border border-[#333537] rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.95)] z-20 overflow-hidden text-[#E2E3DF] animate-fadeIn max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 bg-[#16181B] border-b border-[#282a2c] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2ECC71]/15 border border-[#2ECC71]/40 flex items-center justify-center text-[#2ECC71]">
              <span className="material-symbols-outlined text-2xl">
                {currentStep === 3 ? 'verified' : 'shopping_cart_checkout'}
              </span>
            </div>
            <div>
              <h2 className="font-['Space_Grotesk'] text-base sm:text-lg font-bold uppercase tracking-tight text-[#E2E3DF]">
                {currentStep === 1 && "COMMANDE TACTIQUE // ÉTAPE 1/2"}
                {currentStep === 2 && "RÈGLEMENT SÉCURISÉ // ÉTAPE 2/2"}
                {currentStep === 3 && "COMMANDE VALIDÉE // REÇU OFFICIEL"}
              </h2>
              <p className="font-mono text-[10px] text-[#8E9297] uppercase tracking-wider">
                PASSERELLE SÉCURISÉE HELLOASSO V5 // ASSOCIATION F.O.S.T.
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg bg-[#1F2226] hover:bg-[#282a2c] text-[#8E9297] hover:text-[#E2E3DF] border border-[#333537] flex items-center justify-center cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Step Navigation Progress */}
        <div className="bg-[#0D0F11] px-4 py-2 border-b border-[#282a2c] flex items-center justify-between text-[11px] font-mono shrink-0">
          <div className={`flex items-center gap-1.5 ${currentStep >= 1 ? 'text-[#2ECC71] font-bold' : 'text-[#8E9297]'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 1 ? 'bg-[#2ECC71] text-[#111315] font-bold' : 'bg-[#1F2226]'}`}>1</span>
            <span>Coordonnées & Âge</span>
          </div>
          <span className="text-[#333537]">┈┈┈</span>
          <div className={`flex items-center gap-1.5 ${currentStep >= 2 ? 'text-[#2ECC71] font-bold' : 'text-[#8E9297]'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 2 ? 'bg-[#2ECC71] text-[#111315] font-bold' : 'bg-[#1F2226]'}`}>2</span>
            <span>Paiement HelloAsso</span>
          </div>
          <span className="text-[#333537]">┈┈┈</span>
          <div className={`flex items-center gap-1.5 ${currentStep === 3 ? 'text-[#2ECC71] font-bold' : 'text-[#8E9297]'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep === 3 ? 'bg-[#2ECC71] text-[#111315] font-bold' : 'bg-[#1F2226]'}`}>3</span>
            <span>Reçu & Confirmation</span>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* STEP 1: SUMMARY REVIEW & BUYER DETAILS */}
          {currentStep === 1 && (
            <form onSubmit={handleProceedToPayment} className="space-y-5">
              {/* Items Mini Summary Box */}
              <div className="p-3.5 bg-[#141619] border border-[#282a2c] rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-[#22262B]">
                  <span className="text-[#8E9297] uppercase">Articles à commander ({items.length})</span>
                  <span className="text-[#2ECC71] font-bold">Total TTC : {total.toFixed(2)} €</span>
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {items.map((it) => (
                    <div key={it.id} className="flex items-center justify-between text-xs py-1">
                      <div className="truncate pr-2">
                        <span className="font-bold text-[#E2E3DF]">{it.title}</span>
                        {it.variant && <span className="text-[11px] text-[#FFA640] block truncate">{it.variant}</span>}
                      </div>
                      <div className="font-mono text-right shrink-0">
                        <span className="text-[#8E9297] text-[11px] mr-1">x{it.quantity}</span>
                        <span className="font-bold text-[#E2E3DF]">{(it.price * it.quantity).toFixed(2)} €</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-[10px] font-mono text-[#2ECC71] pt-1">
                  ✓ TVA non applicable, art. 261-7-1° a du CGI (Association sans but lucratif)
                </div>
              </div>

              {/* Form Inputs */}
              <div className="space-y-3">
                <h3 className="font-mono text-xs uppercase font-bold text-[#E87A1E] tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">person</span>
                  <span>Coordonnées de l'Opérateur</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[11px] text-[#8E9297] mb-1">
                      Nom & Prénom <span className="text-[#E74C3C]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ex: Thomas VASSEUR"
                      className="w-full px-3 py-2 bg-[#181B1F] border border-[#282a2c] focus:border-[#2ECC71] rounded-lg text-xs font-mono text-[#E2E3DF] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] text-[#8E9297] mb-1">
                      Email de réception du reçu <span className="text-[#E74C3C]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre.email@domaine.fr"
                      className="w-full px-3 py-2 bg-[#181B1F] border border-[#282a2c] focus:border-[#2ECC71] rounded-lg text-xs font-mono text-[#E2E3DF] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] text-[#8E9297] mb-1">
                      Numéro de Téléphone (optionnel)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="06 XX XX XX XX"
                      className="w-full px-3 py-2 bg-[#181B1F] border border-[#282a2c] focus:border-[#2ECC71] rounded-lg text-xs font-mono text-[#E2E3DF] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] text-[#8E9297] mb-1">
                      Indicatif / Callsign (optionnel)
                    </label>
                    <input
                      type="text"
                      value={callsign}
                      onChange={(e) => setCallsign(e.target.value)}
                      placeholder="Ex: VIPER-01"
                      className="w-full px-3 py-2 bg-[#181B1F] border border-[#282a2c] focus:border-[#2ECC71] rounded-lg text-xs font-mono text-[#E2E3DF] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Age Validation Check for Replicas (Decree 99-240) */}
              {hasReplicas && (
                <div className="p-3.5 bg-[#E74C3C]/10 border-2 border-[#E74C3C]/60 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-[#E74C3C]">
                    <span className="material-symbols-outlined text-lg">gavel</span>
                    <span className="font-mono text-xs font-bold uppercase tracking-wider">
                      MENTION LÉGALE OBLIGATOIRE // DÉCRET N° 99-240
                    </span>
                  </div>
                  <p className="font-['Inter'] text-xs text-[#FF9E93] leading-relaxed">
                    La distribution, le prêt ou la vente de répliques d'armes dont l'énergie est supérieure à 0,08 Joule sont strictement interdits aux personnes mineures par le décret n° 99-240 du 24 mars 1999.
                  </p>
                  <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAgeConfirmed}
                      onChange={(e) => setIsAgeConfirmed(e.target.checked)}
                      className="mt-0.5 accent-[#E74C3C] w-4 h-4 cursor-pointer"
                    />
                    <span className="font-mono text-xs text-[#E2E3DF] font-bold">
                      Je certifie sur l'honneur être âgé(e) d'au moins 18 ans révolus à la date de cette commande.
                    </span>
                  </label>
                </div>
              )}

              {/* Terms Acceptance */}
              <div className="p-3 bg-[#16191C] border border-[#282a2c] rounded-lg">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTermsAccepted}
                    onChange={(e) => setIsTermsAccepted(e.target.checked)}
                    className="mt-0.5 accent-[#2ECC71] w-4 h-4 cursor-pointer"
                  />
                  <span className="font-mono text-[11px] text-[#8E9297]">
                    J'accepte le règlement intérieur, la charte de fair-play et les conditions d'adhésion de l'association F.O.S.T. (Rombas, 57120).
                  </span>
                </label>
              </div>

              {formError && (
                <div className="p-3 bg-[#E74C3C]/20 border border-[#E74C3C] rounded-lg text-xs font-mono text-[#FF8577] flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">error</span>
                  <span>{formError}</span>
                </div>
              )}

              {/* Step 1 Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 bg-[#1A1D20] hover:bg-[#22262B] text-[#8E9297] hover:text-[#E2E3DF] border border-[#333537] rounded-xl font-mono text-xs uppercase cursor-pointer transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#2ECC71] hover:brightness-110 text-[#111315] rounded-xl font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-[0_0_15px_rgba(46,204,113,0.3)] flex items-center gap-2 cursor-pointer"
                >
                  <span>Passer au Paiement ({total.toFixed(2)} €)</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: PAYMENT GATEWAY TRIGGER (HELLOASSO V5) */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-4 bg-[#141618] border border-[#282a2c] rounded-xl space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#282a2c]">
                  <div>
                    <h3 className="font-['Space_Grotesk'] text-base font-bold text-[#E2E3DF] uppercase">
                      RÉCAPITULATIF DE LA TRANSACTION
                    </h3>
                    <p className="font-mono text-[11px] text-[#8E9297]">
                      Bénéficiaire : Association F.O.S.T. Airsoft (Loi 1901)
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[10px] text-[#8E9297] block">MONTANT NET</span>
                    <span className="font-['Space_Grotesk'] text-2xl font-bold text-[#2ECC71]">
                      {total.toFixed(2)} € TTC
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 bg-[#1A1D20] rounded border border-[#282a2c]">
                    <span className="text-[#8E9297] text-[10px] block">PAYEUR</span>
                    <span className="text-[#E2E3DF] font-bold truncate block">{fullName}</span>
                  </div>
                  <div className="p-2 bg-[#1A1D20] rounded border border-[#282a2c]">
                    <span className="text-[#8E9297] text-[10px] block">EMAIL DE CONTACT</span>
                    <span className="text-[#E2E3DF] truncate block">{email}</span>
                  </div>
                </div>
              </div>

              {/* HelloAsso Integration Card */}
              <div className="p-5 bg-gradient-to-br from-[#131920] to-[#111315] border-2 border-[#2ECC71]/50 rounded-2xl shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#2ECC71]/20 border border-[#2ECC71]/40 flex items-center justify-center text-[#2ECC71]">
                      <span className="material-symbols-outlined text-2xl">lock</span>
                    </div>
                    <div>
                      <h4 className="font-['Space_Grotesk'] text-base font-bold text-[#E2E3DF] uppercase">
                        PASSERELLE SÉCURISÉE HELLOASSO
                      </h4>
                      <p className="font-mono text-[11px] text-[#2ECC71]">
                        Paiement sécurisé via HelloAsso • Sans commission obligatoire
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-[#2ECC71]/20 text-[#2ECC71] border border-[#2ECC71]/40 rounded-full font-mono text-[10px] font-bold">
                    API V5 PROTOCOL
                  </span>
                </div>

                <p className="font-['Inter'] text-xs text-[#8E9297] leading-relaxed">
                  Vous allez être redirigé vers l'interface de paiement chiffrée SSL d'HelloAsso. Carte bancaire, 3D Secure et génération automatique du récépissé officiel F.O.S.T.
                </p>

                {paymentError && (
                  <div className="p-3 bg-[#E74C3C]/20 border border-[#E74C3C] rounded-lg text-xs font-mono text-[#FF8577] flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">error</span>
                    <span>{paymentError}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleTriggerHelloAsso}
                  disabled={isLoadingPayment}
                  className="w-full py-4 bg-[#2ECC71] hover:brightness-110 active:scale-98 text-[#111315] font-mono text-sm uppercase font-bold tracking-wider rounded-xl transition-all shadow-[0_0_25px_rgba(46,204,113,0.4)] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingPayment ? (
                    <>
                      <span className="material-symbols-outlined text-lg animate-spin">refresh</span>
                      <span>Connexion à la passerelle HelloAsso...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">payment</span>
                      <span>Régler {total.toFixed(2)} € via HelloAsso</span>
                    </>
                  )}
                </button>
              </div>

              {/* Back to Step 1 */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 bg-[#1A1D20] hover:bg-[#22262B] text-[#8E9297] hover:text-[#E2E3DF] border border-[#333537] rounded-xl font-mono text-xs uppercase cursor-pointer transition-colors"
                >
                  ← Modifier mes coordonnées
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS & RECEIPT DOWNLOAD */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-fadeIn">
              {/* Success Banner */}
              <div className="p-5 bg-[#142318] border border-[#2ECC71]/50 rounded-2xl text-center space-y-2">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#2ECC71]/20 border border-[#2ECC71] flex items-center justify-center text-[#2ECC71] shadow-[0_0_20px_rgba(46,204,113,0.3)]">
                  <span className="material-symbols-outlined text-3xl">task_alt</span>
                </div>
                <h3 className="font-['Space_Grotesk'] text-xl font-bold uppercase text-[#E2E3DF]">
                  COMMANDE VALIDÉE & ACQUITTÉE
                </h3>
                <p className="font-mono text-xs text-[#2ECC71]">
                  Réf. Commande : <span className="font-bold underline">{orderId}</span>
                </p>
                <p className="font-['Inter'] text-xs text-[#8E9297] max-w-md mx-auto">
                  Votre règlement a bien été enregistré. Un e-mail de confirmation avec votre reçu a été généré pour <strong>{email}</strong>.
                </p>
              </div>

              {/* Legal Notes */}
              <div className="p-3 bg-[#16191C] border border-[#282a2c] rounded-xl text-[11px] font-mono space-y-1">
                <div className="text-[#8E9297]">
                  • Association : F.O.S.T. Airsoft (Forces Opérationnelles Spéciales Tactiques)
                </div>
                <div className="text-[#2ECC71]">
                  • Régime fiscal : TVA non applicable, art. 261-7-1° a du CGI
                </div>
                {hasGoProRental && (
                  <div className="text-[#2ECC71] font-bold">
                    • Matériel loué : Caution restituée après contrôle du matériel
                  </div>
                )}
                {hasReplicas && (
                  <div className="text-[#FFA640]">
                    • Cadre légal : Vente réservée aux personnes majeures (Décret n° 99-240)
                  </div>
                )}
              </div>

              {/* Action Buttons: Print/View Receipt & Close */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    tacticalAudio.playClick();
                    setShowPrintModal(true);
                  }}
                  className="w-full py-3.5 bg-[#E87A1E] hover:brightness-110 text-[#111315] font-mono text-xs uppercase font-bold tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(232,122,30,0.35)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">receipt_long</span>
                  <span>Télécharger / Imprimer le Reçu Officiel (PDF)</span>
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-2.5 bg-[#1A1D20] hover:bg-[#22262B] text-[#E2E3DF] border border-[#333537] rounded-xl font-mono text-xs uppercase cursor-pointer transition-colors"
                >
                  Terminer & Retourner au site
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Official Receipt Full Modal View */}
      {showPrintModal && receiptData && (
        <div className="fixed inset-0 z-[120] bg-black/90 p-4 sm:p-8 overflow-y-auto flex items-center justify-center animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-2xl p-2 sm:p-6 my-auto">
            <ReceiptTemplate
              receipt={receiptData}
              onClose={() => setShowPrintModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
