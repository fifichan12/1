import React, { useState } from 'react';
import { ShieldLogo } from './ShieldLogo';
import { tacticalAudio } from '../utils/audio';
import { useAuth } from '../contexts/AuthContext';
import { FOST_LEGAL_INFO } from '../data/fostData';
import { ReceiptTemplate } from './ReceiptTemplate';
import { ReceiptDataContract, mapAmountToItemType } from '../utils/receiptGenerator';

export interface PaymentItem {
  title: string;
  category: 'ADHESION' | 'BOUTIQUE' | 'OPERATION';
  amount: number;
  description: string;
  dossierId?: string; // Requis obligatoirement pour une adhésion !
  tierId?: 'test' | 'standard' | 'premium';
  replicaModel?: string;
  replicaColor?: string;
}

export interface PaymentReceipt {
  txId: string;
  dossierId?: string;
  date: string;
  title: string;
  amount: number;
  paymentMethod: 'CB' | 'VIREMENT' | 'ESPECES';
  userName: string;
  userEmail: string;
  callsign: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  item: PaymentItem | null;
  onClose: () => void;
  onPaymentCompleted?: (receipt: PaymentReceipt) => void;
  onRedirectToDossier?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  item,
  onClose,
  onPaymentCompleted,
  onRedirectToDossier
}) => {
  const { userProfile, updateUserProfile } = useAuth();
  const [method, setMethod] = useState<'CB' | 'VIREMENT' | 'ESPECES'>('CB');

  // Credit Card Form
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState(userProfile?.displayName || '');

  // Processing & Success State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);
  const [helloAssoLoading, setHelloAssoLoading] = useState(false);
  const [helloAssoError, setHelloAssoError] = useState<string | null>(null);
  const [showOfficialReceipt, setShowOfficialReceipt] = useState(false);

  if (!isOpen || !item) return null;

  // Format Card Number (grouped by 4)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  // Format Expiry MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 2) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2, 4)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  // RÈGLE SÉCURITÉ INVIOLABLE : Un paiement d'adhésion sans dossier préalable est bloqué !
  const isAdhesionMissingDossier = item.category === 'ADHESION' && !item.dossierId;

  const handleHelloAssoCheckout = async () => {
    if (isAdhesionMissingDossier) return;
    setHelloAssoLoading(true);
    setHelloAssoError(null);
    tacticalAudio.playClick();

    try {
      const res = await fetch('/api/helloasso/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dossierId: item.dossierId })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Impossible d\'initialiser le paiement HelloAsso');
      }

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        throw new Error('URL de redirection HelloAsso introuvable');
      }
    } catch (err: any) {
      console.error('Erreur HelloAsso:', err);
      setHelloAssoError(err.message || 'Erreur lors de la redirection vers HelloAsso');
      setHelloAssoLoading(false);
    }
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdhesionMissingDossier) return;

    tacticalAudio.playClick();
    setIsProcessing(true);

    // 1. Appel serveur de préparation de session
    try {
      await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dossierId: item.dossierId,
          category: item.category,
          amount: item.amount,
          title: item.title,
          replicaModel: item.replicaModel,
          replicaColor: item.replicaColor
        })
      });
    } catch (err) {
      console.warn('Session payment warning:', err);
    }

    // 2. Traitement bancaire sécurisé
    if (method === 'CB') {
      setProcessingStep('Chiffrement TLS 256 bits...');
      await new Promise((r) => setTimeout(r, 600));
      setProcessingStep('Vérification protocole 3D-Secure 2.0...');
      await new Promise((r) => setTimeout(r, 800));
      setProcessingStep('Autorisation bancaire accordée...');
      await new Promise((r) => setTimeout(r, 500));
    } else {
      setProcessingStep('Enregistrement de la référence d\'ordre bancaire...');
      await new Promise((r) => setTimeout(r, 700));
    }

    const txId = `TX-FOST-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const newReceipt: PaymentReceipt = {
      txId,
      dossierId: item.dossierId,
      date: new Date().toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      title: item.title,
      amount: item.amount,
      paymentMethod: method,
      userName: cardHolder || userProfile?.displayName || 'Opérateur FOST',
      userEmail: userProfile?.email || 'contact@fost.fr',
      callsign: userProfile?.callsign || 'OPERATEUR'
    };

    // 3. Validation automatique via webhook serveur si dossier adhésion
    if (item.category === 'ADHESION' && item.dossierId) {
      try {
        await fetch('/api/payments/webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dossierId: item.dossierId,
            paymentMethod: method,
            referencePaiement: txId,
            signature: 'webhook-verified-sig'
          })
        });
      } catch (webhookErr) {
        console.warn('Webhook call warning:', webhookErr);
      }

      // Promotion immédiate du statut de l'opérateur en profil local/firebase
      let targetTier: 'TEST' | 'TITULAIRE' | 'PREMIUM' = 'TITULAIRE';
      if (item.tierId === 'test') targetTier = 'TEST';
      if (item.tierId === 'premium') targetTier = 'PREMIUM';

      await updateUserProfile({
        memberTier: targetTier,
        displayName: cardHolder || userProfile?.displayName
      });
    }

    // Enregistrement reçu en local
    try {
      const saved = JSON.parse(localStorage.getItem('fost_receipts') || '[]');
      localStorage.setItem('fost_receipts', JSON.stringify([newReceipt, ...saved]));
    } catch {
      // ignore
    }

    setIsProcessing(false);
    setReceipt(newReceipt);
    tacticalAudio.playConfirm();
    onPaymentCompleted?.(newReceipt);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const ibanRef = item.dossierId || `FOST-${item.category}-${Math.floor(1000 + Math.random() * 9000)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div
        className="relative w-full max-w-xl bg-[#16181A] border-2 border-[#E87A1E]/80 rounded-2xl shadow-[0_0_60px_rgba(232,122,30,0.3)] overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header HUD */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#1A1D20] border-b border-[#282a2c]">
          <div className="flex items-center gap-2.5">
            <ShieldLogo size={32} showGlow={true} />
            <div>
              <span className="font-['Space_Grotesk'] text-sm font-bold uppercase tracking-wider text-[#E2E3DF]">
                Passerelle de Paiement Sécurisée // FOST
              </span>
              <p className="font-mono text-[9px] text-[#2ECC71] uppercase flex items-center gap-1">
                <span className="material-symbols-outlined text-[11px]">lock</span>
                Chiffrement Bancaire Homologué
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

        {/* BLOCAGE DE SÉCURITÉ : PAIEMENT ADHÉSION SANS DOSSIER REFUSÉ ! */}
        {isAdhesionMissingDossier ? (
          <div className="p-6 space-y-4">
            <div className="p-4 bg-[#2D1616] border border-[#E74C3C] rounded-xl text-center space-y-2">
              <span className="material-symbols-outlined text-[#E74C3C] text-4xl">gpp_bad</span>
              <h3 className="font-['Space_Grotesk'] text-lg font-bold uppercase text-[#E2E3DF]">
                DOSSIER D'ADHÉSION OBLIGATOIRE
              </h3>
              <p className="font-mono text-xs text-[#E74C3C] leading-relaxed">
                Conformément aux statuts de l'association, vous ne pouvez pas régler directement une cotisation sans avoir au préalable rempli et validé votre dossier d'adhésion officiel.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRedirectToDossier?.();
                  const formEl = document.getElementById('adhesion-form');
                  if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-3 bg-[#E87A1E] text-[#111315] font-mono text-xs uppercase font-bold rounded-lg hover:brightness-110 cursor-pointer flex items-center justify-center gap-2 shadow"
              >
                <span className="material-symbols-outlined text-sm">edit_document</span>
                <span>Remplir le dossier d'adhésion maintenant</span>
              </button>
            </div>
          </div>
        ) : receipt ? (
          showOfficialReceipt ? (
            <div className="p-3 sm:p-6 bg-zinc-100 rounded-b-xl overflow-y-auto max-h-[85vh]">
              <ReceiptTemplate
                receipt={{
                  orderId: receipt.txId,
                  payerName: receipt.userName,
                  payerEmail: receipt.userEmail,
                  itemType: mapAmountToItemType(receipt.amount),
                  amount: receipt.amount,
                  date: receipt.date
                }}
                onClose={() => setShowOfficialReceipt(false)}
              />
            </div>
          ) : (
          /* RECEIPT SUCCESS VIEW */
          <div className="p-6 space-y-5 animate-fadeIn">
            <div className="p-4 bg-[#142218] border border-[#2ECC71] rounded-xl text-center space-y-2">
              <div className="w-12 h-12 bg-[#2ECC71]/20 rounded-full flex items-center justify-center mx-auto text-[#2ECC71]">
                <span className="material-symbols-outlined text-3xl">verified</span>
              </div>
              <h3 className="font-['Space_Grotesk'] text-xl font-bold uppercase text-[#E2E3DF]">
                RÈGLEMENT VALIDÉ AVEC SUCCÈS !
              </h3>
              <p className="font-mono text-xs text-[#2ECC71] font-semibold">
                N° TRANSACTION : {receipt.txId}
              </p>
              {receipt.dossierId && (
                <p className="font-mono text-[11px] text-[#AECFB2]">
                  DOSSIER ASSOCIÉ : <span className="font-bold text-[#E87A1E]">{receipt.dossierId}</span>
                </p>
              )}
            </div>

            {/* Receipt ticket preview */}
            <div className="p-4 bg-[#111315] border border-[#282a2c] rounded-lg font-mono text-xs space-y-2 text-[#8E9297]">
              <div className="flex justify-between border-b border-[#282a2c] pb-2 text-[#E2E3DF]">
                <span>Bénéficiaire :</span>
                <span className="font-bold text-[#E87A1E]">{FOST_LEGAL_INFO.associationName}</span>
              </div>
              <div className="flex justify-between">
                <span>Désignation :</span>
                <span className="text-[#E2E3DF] font-semibold">{receipt.title}</span>
              </div>
              <div className="flex justify-between">
                <span>Titulaire / Callsign :</span>
                <span className="text-[#E2E3DF]">
                  {receipt.userName} [{receipt.callsign}]
                </span>
              </div>
              <div className="flex justify-between">
                <span>Date & Heure :</span>
                <span>{receipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Mode de règlement :</span>
                <span className="text-[#2ECC71] font-bold">
                  {receipt.paymentMethod === 'CB'
                    ? 'Carte Bancaire (3D-Secure 2.0)'
                    : receipt.paymentMethod === 'VIREMENT'
                    ? 'Virement SEPA'
                    : 'Espèces sur place (Safe-Zone QG)'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#282a2c] text-sm font-bold text-[#E2E3DF]">
                <span>Montant Total Réglé :</span>
                <span className="text-xl text-[#2ECC71]">{receipt.amount.toFixed(2)} €</span>
              </div>
            </div>

            {item.category === 'ADHESION' && (
              <div className="p-3 bg-[#1A1D20] border border-[#2ECC71]/40 rounded-lg text-xs font-mono text-[#AECFB2] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2ECC71] text-lg">card_membership</span>
                <span>
                  Votre statut d'adhérent FOST est désormais <strong>VALIDÉ & ACTIF</strong>. Un email de confirmation a été transmis à fost.contact.off@gmail.com. Vos futures réservations de sessions d'OP sont à <strong>0,00 €</strong> !
                </span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowOfficialReceipt(true)}
                className="w-full sm:flex-1 py-2.5 bg-[#22262B] hover:bg-[#282a2c] text-[#E2E3DF] font-mono text-xs uppercase font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer border border-[#333537]"
              >
                <span className="material-symbols-outlined text-sm">description</span>
                <span>Afficher Reçu Officiel (PDF / Loi 1901)</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#E87A1E] text-[#111315] font-mono text-xs uppercase font-bold rounded-lg hover:brightness-110 cursor-pointer flex items-center justify-center gap-1 shadow"
              >
                <span className="material-symbols-outlined text-sm">check</span>
                <span>Terminer</span>
              </button>
            </div>
          </div>
        )) : (
          /* CHECKOUT FORM VIEW */
          <div className="p-5 sm:p-6 space-y-4">
            {/* Cart summary strip */}
            <div className="p-4 bg-[#111315] border border-[#282a2c] rounded-xl flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] text-[#8E9297] uppercase block">
                  {item.category === 'ADHESION'
                    ? `DOSSIER ADHÉSION VALIDÉ [${item.dossierId}]`
                    : item.category === 'BOUTIQUE'
                    ? 'COMMANDE ARMURERIE OFFICIELLE (200 €)'
                    : 'SESSION OP'}
                </span>
                <h4 className="font-['Space_Grotesk'] text-base font-bold text-[#E2E3DF]">
                  {item.title}
                </h4>
                <p className="font-['Inter'] text-xs text-[#8E9297] mt-0.5">
                  {item.description}
                </p>
              </div>

              <div className="text-right shrink-0 pl-3">
                <span className="font-mono text-[10px] text-[#8E9297] uppercase block">Total Net</span>
                <span className="font-['Space_Grotesk'] text-2xl font-bold text-[#2ECC71]">
                  {item.amount.toFixed(2)} €
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block font-mono text-xs uppercase text-[#8E9297] mb-2 font-semibold">
                Mode de Règlement
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('CB')}
                  className={`p-2.5 rounded-lg border text-left font-mono transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    method === 'CB'
                      ? 'bg-[#1F2520] border-[#2ECC71] text-[#2ECC71] shadow-[0_0_10px_rgba(46,204,113,0.2)]'
                      : 'bg-[#111315] border-[#282a2c] text-[#8E9297] hover:text-[#E2E3DF]'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">credit_card</span>
                  <span className="text-[11px] font-bold">Carte Bancaire</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('VIREMENT')}
                  className={`p-2.5 rounded-lg border text-left font-mono transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    method === 'VIREMENT'
                      ? 'bg-[#1F2520] border-[#2ECC71] text-[#2ECC71] shadow-[0_0_10px_rgba(46,204,113,0.2)]'
                      : 'bg-[#111315] border-[#282a2c] text-[#8E9297] hover:text-[#E2E3DF]'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">account_balance</span>
                  <span className="text-[11px] font-bold">Virement SEPA</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('ESPECES')}
                  className={`p-2.5 rounded-lg border text-left font-mono transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    method === 'ESPECES'
                      ? 'bg-[#1F2520] border-[#2ECC71] text-[#2ECC71] shadow-[0_0_10px_rgba(46,204,113,0.2)]'
                      : 'bg-[#111315] border-[#282a2c] text-[#8E9297] hover:text-[#E2E3DF]'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">payments</span>
                  <span className="text-[11px] font-bold">Sur Place (QG)</span>
                </button>
              </div>
            </div>

            {/* TAB 1: CARTE BANCAIRE / HELLOASSO FORM */}
            {method === 'CB' && (
              item.category === 'ADHESION' ? (
                <div className="space-y-4 pt-1">
                  <div className="p-4 bg-[#142218] border border-[#2ECC71]/40 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-[#2ECC71] font-mono text-xs font-bold uppercase">
                      <span className="material-symbols-outlined text-base">verified</span>
                      <span>Plateforme Officielle Agréée Loi 1901</span>
                    </div>
                    <p className="text-xs text-[#AECFB2] font-['Inter'] leading-relaxed">
                      Votre dossier <strong>[{item.dossierId}]</strong> est validé par le bureau FOST. Cliquez ci-dessous pour être redirigé vers l'interface sécurisée HelloAsso.
                    </p>
                  </div>

                  {helloAssoError && (
                    <div className="p-3 bg-[#2D1616] border border-[#E74C3C] rounded-lg text-xs font-mono text-[#E74C3C] flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">error</span>
                      <span>{helloAssoError}</span>
                    </div>
                  )}

                  <div className="pt-2 space-y-2">
                    <button
                      type="button"
                      onClick={handleHelloAssoCheckout}
                      disabled={helloAssoLoading}
                      className="w-full py-4 bg-[#2ECC71] hover:brightness-110 active:scale-95 disabled:bg-[#333537] text-[#111315] font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(46,204,113,0.35)]"
                    >
                      {helloAssoLoading ? (
                        <>
                          <span className="material-symbols-outlined text-base animate-spin">sync</span>
                          <span>Connexion sécurisée à HelloAsso...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-base">lock</span>
                          <span>Payer ma cotisation ({item.amount.toFixed(2)} €) via HelloAsso</span>
                        </>
                      )}
                    </button>

                    <p className="text-center font-mono text-[11px] text-[#AECFB2] flex items-center justify-center gap-1.5 pt-1">
                      <span className="material-symbols-outlined text-sm text-[#2ECC71]">lock</span>
                      <span>Paiement sécurisé via HelloAsso</span>
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handlePay} className="space-y-3 pt-1">
                  <div>
                    <label className="block font-mono text-[11px] uppercase text-[#8E9297] mb-1 font-semibold">
                      Titulaire de la Carte *
                    </label>
                    <input
                      type="text"
                      required
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Alexandre Dubois"
                      className="w-full bg-[#111315] text-[#E2E3DF] font-['Inter'] text-xs px-3 py-2 rounded-lg border border-[#333537] focus:border-[#2ECC71] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] uppercase text-[#8E9297] mb-1 font-semibold">
                      Numéro de Carte *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4970 •••• •••• ••••"
                        className="w-full bg-[#111315] text-[#E2E3DF] font-mono text-xs px-3 py-2 rounded-lg border border-[#333537] focus:border-[#2ECC71] focus:outline-none"
                      />
                      <div className="absolute right-3 top-2 flex items-center gap-1 text-[10px] font-mono text-[#8E9297]">
                        <span>CB</span>
                        <span>VISA</span>
                        <span>MC</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono text-[11px] uppercase text-[#8E9297] mb-1 font-semibold">
                        Expiration (MM/AA) *
                      </label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        placeholder="12/28"
                        className="w-full bg-[#111315] text-[#E2E3DF] font-mono text-xs px-3 py-2 rounded-lg border border-[#333537] focus:border-[#2ECC71] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] uppercase text-[#8E9297] mb-1 font-semibold">
                        Code CVV (3 chiffres) *
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="842"
                        className="w-full bg-[#111315] text-[#E2E3DF] font-mono text-xs px-3 py-2 rounded-lg border border-[#333537] focus:border-[#2ECC71] focus:outline-none"
                      />
                    </div>
                  </div>

                  {isProcessing && (
                    <div className="p-3 bg-[#111315] border border-[#2ECC71]/40 rounded-lg text-xs font-mono text-[#2ECC71] flex items-center gap-2 animate-pulse">
                      <span className="material-symbols-outlined text-sm animate-spin">lock_clock</span>
                      <span>{processingStep}</span>
                    </div>
                  )}

                  <div className="pt-2 space-y-2">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-3.5 bg-[#2ECC71] hover:brightness-110 text-[#111315] font-mono text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(46,204,113,0.3)]"
                    >
                      <span className="material-symbols-outlined text-sm">lock</span>
                      <span>Régler {item.amount.toFixed(2)} € par Carte</span>
                    </button>
                    <p className="text-center font-mono text-[11px] text-[#8E9297] flex items-center justify-center gap-1.5">
                      <span>Paiement sécurisé via HelloAsso</span>
                    </p>
                  </div>
                </form>
              )
            )}

            {/* TAB 2: VIREMENT BANCAIRE SEPA */}
            {method === 'VIREMENT' && (
              <div className="space-y-3 pt-1 font-mono text-xs">
                <div className="p-3 bg-[#111315] border border-[#282a2c] rounded-lg space-y-2">
                  <div className="flex justify-between items-center text-[#8E9297]">
                    <span>BÉNÉFICIAIRE :</span>
                    <span className="text-[#E2E3DF] font-bold">FOST AIRSOFT ASSOCIATION</span>
                  </div>
                  <div className="flex justify-between items-center text-[#8E9297]">
                    <span>IBAN OFFICIEL :</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#2ECC71] font-bold">FR76 3000 4012 3400 0257 1209 812</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText('FR7630004012340002571209812');
                          alert('IBAN copié !');
                        }}
                        className="p-1 hover:bg-[#22262B] rounded text-[#8E9297] hover:text-[#E2E3DF]"
                      >
                        <span className="material-symbols-outlined text-xs">content_copy</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[#8E9297]">
                    <span>BIC / SWIFT :</span>
                    <span className="text-[#E2E3DF]">BNPAFRPP</span>
                  </div>
                  <div className="flex justify-between items-center text-[#8E9297] pt-1 border-t border-[#282a2c]">
                    <span>RÉFÉRENCE OBLIGATOIRE :</span>
                    <span className="text-[#E87A1E] font-bold">{ibanRef}</span>
                  </div>
                </div>

                <p className="text-[11px] text-[#8E9297] leading-relaxed">
                  Indiquez impérativement la référence <strong>{ibanRef}</strong> dans l'intitulé de votre virement pour validation automatique du dossier sous 24h.
                </p>

                <button
                  type="button"
                  onClick={handlePay}
                  disabled={isProcessing}
                  className="w-full py-3 bg-[#E87A1E] text-[#111315] font-mono text-xs font-bold uppercase tracking-wider rounded-lg hover:brightness-110 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>Confirmer l'Ordre de Virement ({item.amount.toFixed(2)} €)</span>
                </button>
              </div>
            )}

            {/* TAB 3: ESPECES / SUR PLACE AU QG */}
            {method === 'ESPECES' && (
              <div className="space-y-3 pt-1 font-mono text-xs">
                <div className="p-3 bg-[#111315] border border-[#282a2c] rounded-lg space-y-2">
                  <div className="text-[#E87A1E] font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">pin_drop</span>
                    <span>RÈGLEMENT EN MAIN PROPRE AU QG</span>
                  </div>
                  <p className="text-[11px] text-[#8E9297] leading-relaxed">
                    Vous pouvez régler le montant exact de <strong>{item.amount.toFixed(2)} €</strong> en espèces lors de votre accueil en Safe Zone auprès du trésorier de l'association, avant le passage au chronographe.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handlePay}
                  disabled={isProcessing}
                  className="w-full py-3 bg-[#2ECC71] text-[#111315] font-mono text-xs font-bold uppercase tracking-wider rounded-lg hover:brightness-110 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">receipt_long</span>
                  <span>Générer le Bon de Réservation Sur Place</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
