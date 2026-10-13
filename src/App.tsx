/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { RosterSection } from './components/RosterSection';
import { ArmorySection } from './components/ArmorySection';
import { OperationsSection } from './components/OperationsSection';
import { CharterAndRecruitmentSection } from './components/CharterAndRecruitmentSection';
import { TerrainAndContactSection } from './components/TerrainAndContactSection';
import { FaqSection } from './components/FaqSection';
import { QgAdminView } from './components/QgAdminView';
import { AdminAuthModal } from './components/AdminAuthModal';
import { OperatorModal } from './components/OperatorModal';
import { OpordModal } from './components/OpordModal';
import { EnrollmentModal } from './components/EnrollmentModal';
import { TacticalRadioModal } from './components/TacticalRadioModal';
import { ChronyCalculatorModal } from './components/ChronyCalculatorModal';
import { LoadoutChecklistModal } from './components/LoadoutChecklistModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { PaymentModal, PaymentItem } from './components/PaymentModal';
import { TacticalChatbotModal } from './components/TacticalChatbotModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { Footer } from './components/Footer';
import { Operator, OperationEvent, OPERATIONS } from './data/fostData';
import { useAuth } from './contexts/AuthContext';

export default function App() {
  const { userProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<string>('accueil');
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(false);
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [opordModalOp, setOpordModalOp] = useState<OperationEvent | null>(null);
  const [enrollModalOpen, setEnrollModalOpen] = useState<boolean>(false);
  const [selectedEnrollOpId, setSelectedEnrollOpId] = useState<string | undefined>(undefined);
  const [prefilledReplicaRequest, setPrefilledReplicaRequest] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Authentication Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Payment Checkout Modal
  const [activePaymentItem, setActivePaymentItem] = useState<PaymentItem | null>(null);

  // Tactical tools modals
  const [isRadioOpen, setIsRadioOpen] = useState<boolean>(false);
  const [isChronyOpen, setIsChronyOpen] = useState<boolean>(false);
  const [isChecklistOpen, setIsChecklistOpen] = useState<boolean>(false);

  // HelloAsso Return Page State (Lecture du statut réel côté serveur)
  const [returnStatusInfo, setReturnStatusInfo] = useState<{
    isOpen: boolean;
    statut: 'VALIDEE' | 'EN_ATTENTE_DE_PAIEMENT' | 'ERROR' | 'SIMULATION';
    dossierId: string;
    nom?: string;
    prenom?: string;
    montant?: number;
    referencePaiement?: string;
    message?: string;
  } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment_status');
    const cartOrderId = params.get('cart_order_id');
    if (cartOrderId) {
      if (paymentStatus === 'success') {
        showToast(`COMMANDE TACTIQUE VALIDÉE // Commande #${cartOrderId} confirmée avec succès !`);
      } else if (paymentStatus === 'cancel') {
        showToast(`Paiement de la commande #${cartOrderId} annulé. Vos articles restent dans votre panier.`);
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const dossierId = params.get('dossier_id');
    const checkoutId = params.get('checkout_id');

    if (dossierId && paymentStatus) {
      // Interroger le serveur pour lire le statut RÉEL vérifié
      fetch(`/api/adhesions/${dossierId}/verify-status${checkoutId ? `?checkout_id=${checkoutId}` : ''}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.statut === 'VALIDEE') {
            setReturnStatusInfo({
              isOpen: true,
              statut: 'VALIDEE',
              dossierId,
              nom: data.nom,
              prenom: data.prenom,
              montant: data.montant,
              referencePaiement: data.referencePaiement,
              message: 'Paiement HelloAsso validé avec succès par le serveur !'
            });
            showToast(`COTISATION VALIDÉE // Bienvenue dans l'escouade FOST ${data.prenom || ''} !`);
          } else if (paymentStatus === 'simulation') {
            setReturnStatusInfo({
              isOpen: true,
              statut: 'SIMULATION',
              dossierId,
              montant: data.montant,
              message: 'Mode simulation activé : HelloAsso attend vos identifiants dans le fichier .env.'
            });
          } else {
            setReturnStatusInfo({
              isOpen: true,
              statut: 'EN_ATTENTE_DE_PAIEMENT',
              dossierId,
              nom: data.nom,
              prenom: data.prenom,
              montant: data.montant,
              message:
                paymentStatus === 'cancel'
                  ? 'Paiement annulé sur HelloAsso. Votre dossier reste enregistré en attente de règlement.'
                  : "Le paiement n'a pas pu être validé. Vous pouvez réessayer à tout moment."
            });
          }
        })
        .catch((err) => {
          console.error('Erreur vérification retour HelloAsso:', err);
        });

      // Nettoyer l'URL sans recharger la page
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleRetryHelloAsso = async (dossierId: string) => {
    try {
      const res = await fetch('/api/helloasso/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dossierId })
      });
      const data = await res.json();
      if (res.ok && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        showToast(data.error || 'Erreur lors de la redirection vers HelloAsso');
      }
    } catch {
      showToast('Impossible de joindre le serveur HelloAsso');
    }
  };

  // Auto-sync staff role if user is authorized officer
  useEffect(() => {
    if (userProfile?.isStaff) {
      setIsAdminAuthenticated(true);
    }
  }, [userProfile]);

  // Scroll spy to update activeTab in real-time as the user scrolls through the site
  useEffect(() => {
    if (isAdminOpen) return;

    // Primary navigation tabs and their corresponding element IDs in DOM order
    const navSections: { id: string; tab: string }[] = [
      { id: 'accueil', tab: 'accueil' },
      { id: 'roster', tab: 'roster' },
      { id: 'armurerie', tab: 'armurerie' },
      { id: 'operations', tab: 'operations' },
      { id: 'tarifs', tab: 'tarifs' },
      { id: 'contact', tab: 'contact' },
      { id: 'faq', tab: 'faq' }
    ];

    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const fullHeight = document.documentElement.scrollHeight;

        // Top of page: always 'accueil'
        if (scrollY < 120) {
          setActiveTab('accueil');
          ticking = false;
          return;
        }

        // Bottom of page: always 'faq' when user reached the footer area
        if (windowHeight + scrollY >= fullHeight - 80) {
          setActiveTab('faq');
          ticking = false;
          return;
        }

        // Calculate active section: find the latest section whose top has reached or passed headerOffset
        const headerOffset = 180;
        let matchedTab = 'accueil';

        for (const item of navSections) {
          const el = document.getElementById(item.id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= headerOffset) {
              matchedTab = item.tab;
            }
          }
        }

        setActiveTab(matchedTab);
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isAdminOpen]);

  // Operational Schedule State (Persisted in localStorage)
  const [operations, setOperations] = useState<OperationEvent[]>(() => {
    try {
      const saved = localStorage.getItem('fost_operations_v2');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load operations from localStorage', e);
    }
    return OPERATIONS;
  });

  const handleUpdateOperations = (newOps: OperationEvent[]) => {
    setOperations(newOps);
    try {
      localStorage.setItem('fost_operations_v2', JSON.stringify(newOps));
    } catch (e) {
      console.error('Failed to save operations to localStorage', e);
    }
  };

  const handleAddOperation = (newOp: OperationEvent) => {
    const updated = [newOp, ...operations];
    handleUpdateOperations(updated);
    showToast(`OPÉRATION PROGRAMMÉE // ${newOp.title} ajoutée au calendrier.`);
  };

  const handleDeleteOperation = (opId: string) => {
    const target = operations.find((o) => o.id === opId);
    const updated = operations.filter((o) => o.id !== opId);
    handleUpdateOperations(updated);
    showToast(`OPÉRATION SUPPRIMÉE // ${target ? target.title : opId} retirée de la grille.`);
  };

  const handleToggleCompleteOperation = (opId: string) => {
    const updated = operations.map((op) => {
      if (op.id === opId) {
        const nextCompleted = !op.isCompleted;
        return {
          ...op,
          isCompleted: nextCompleted,
          statusText: nextCompleted ? 'TERMINÉE // MISSION CLÔTURÉE' : 'OUVERT // ENGAGEMENT ACTIF',
          statusUrgency: (nextCompleted ? 'normal' : 'normal') as 'normal' | 'warning' | 'urgent'
        };
      }
      return op;
    });
    handleUpdateOperations(updated);
    const target = updated.find((o) => o.id === opId);
    showToast(
      target?.isCompleted
        ? `MISSION TERMINÉE // ${target.title} clôturée avec succès.`
        : `MISSION RÉACTIVÉE // ${target?.title} remise en jeu.`
    );
  };

  const handleResetOperations = () => {
    handleUpdateOperations(OPERATIONS);
    showToast('GRILLE RÉINITIALISÉE // Calendrier restauré aux 3 opérations de référence.');
  };

  // Trigger feedback toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  const handleAdminClick = () => {
    if (isAdminOpen) {
      // Toggle off QG view
      setIsAdminOpen(false);
    } else {
      // Access requires staff authorization
      if (isAdminAuthenticated || userProfile?.isStaff) {
        setIsAdminOpen(true);
      } else {
        setIsAdminAuthModalOpen(true);
      }
    }
  };

  const handleAdminAuthSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsAdminAuthModalOpen(false);
    setIsAdminOpen(true);
    showToast("AUTHENTIFICATION CONFIRMÉE // BIENVENUE COMMANDANT DANS LE QG STAFF ACTIF");
  };

  const handleJoinClick = () => {
    if (isAdminOpen) setIsAdminOpen(false);
    setActiveTab('tarifs');
    const el =
      document.getElementById('tarifs-adhesion') ||
      document.getElementById('tarifs') ||
      document.getElementById('reglement');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleArmoryClick = () => {
    if (isAdminOpen) setIsAdminOpen(false);
    setActiveTab('armurerie');
    const el = document.getElementById('armurerie');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCalendarClick = () => {
    if (isAdminOpen) setIsAdminOpen(false);
    setActiveTab('operations');
    const el = document.getElementById('operations');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOrderReplica = (modelName: string, colorName: string) => {
    const text = `Demande de réservation : Modèle ${modelName} en finition Cerakote ${colorName}.`;
    setPrefilledReplicaRequest(text);
    const el = document.getElementById('recrutement') || document.getElementById('adhesion-form') || document.getElementById('tarifs');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenEnrollModal = (opId: string) => {
    setSelectedEnrollOpId(opId);
    setEnrollModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#121416] text-[#E2E2E5] selection:bg-[#E87A1E] selection:text-[#111315]">
      {/* Primary Fixed Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdminOpen={isAdminOpen}
        isAdminAuthenticated={isAdminAuthenticated || !!userProfile?.isStaff}
        onAdminClick={handleAdminClick}
        onJoinClick={handleJoinClick}
        onOpenRadio={() => setIsRadioOpen(true)}
        onOpenChrony={() => setIsChronyOpen(true)}
        onOpenChecklist={() => setIsChecklistOpen(true)}
        onOpenAuth={(m) => {
          setAuthModalMode(m || 'login');
          setIsAuthModalOpen(true);
        }}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Content Area */}
      {isAdminOpen ? (
        <main className="pt-20">
          <QgAdminView
            onCloseAdmin={() => setIsAdminOpen(false)}
            operations={operations}
            onAddOperation={handleAddOperation}
            onDeleteOperation={handleDeleteOperation}
            onToggleCompleteOperation={handleToggleCompleteOperation}
            onUpdateOperations={handleUpdateOperations}
            onResetOperations={handleResetOperations}
          />
        </main>
      ) : (
        <main className="w-full">
          {/* 1. Hero Section */}
          <section id="accueil" className="scroll-mt-28">
            <HeroSection
              onJoinClick={handleJoinClick}
              onArmoryClick={handleArmoryClick}
              onCalendarClick={handleCalendarClick}
            />
          </section>

          {/* 2. Roster Section */}
          <section id="roster" className="scroll-mt-28">
            <RosterSection
              onSelectOperator={(op) => setSelectedOperator(op)}
            />
          </section>

          {/* 3. Armory Section */}
          <section id="armurerie" className="scroll-mt-28">
            <ArmorySection
              onOrderReplica={handleOrderReplica}
              onOpenPayment={(it) => setActivePaymentItem(it)}
            />
          </section>

          {/* 4. Operations & Calendar Section */}
          <section id="operations" className="scroll-mt-28">
            <OperationsSection
              operations={operations}
              onOpenEnrollModal={handleOpenEnrollModal}
              onOpenOpordModal={(op) => setOpordModalOp(op)}
            />
          </section>

          {/* 5. Charter & Recruitment / Tarifs Section */}
          <section id="tarifs" className="scroll-mt-28">
            <div id="tarifs-adhesion" className="scroll-mt-28" />
            <div id="reglement" className="scroll-mt-28" />
            <CharterAndRecruitmentSection
              prefilledReplicaRequest={prefilledReplicaRequest}
              onOpenPayment={(it) => setActivePaymentItem(it)}
              onOpenAuth={(m) => {
                setAuthModalMode(m || 'login');
                setIsAuthModalOpen(true);
              }}
            />
          </section>

          {/* 6. Terrain Access, Logistics & Contact Section */}
          <section id="contact" className="scroll-mt-28">
            <TerrainAndContactSection />
          </section>

          {/* 7. Questions Fréquentes (FAQ) */}
          <section id="faq" className="scroll-mt-28">
            <FaqSection
              onNavigateToContact={() => {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenEnrollModal={handleOpenEnrollModal}
            />
          </section>
        </main>
      )}

      {/* Footer */}
      {!isAdminOpen && (
        <Footer
          onNavigate={(id) => {
            const el = document.getElementById(id) || document.getElementById('tarifs');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenNextOpord={() => setOpordModalOp(operations[0] || OPERATIONS[0])}
        />
      )}

      {/* Modals */}
      <OperatorModal
        operator={selectedOperator}
        onClose={() => setSelectedOperator(null)}
        onSelectReplicaOrder={(loadout) => {
          handleOrderReplica(loadout, 'Noir Tactique // Stealth');
        }}
      />

      <OpordModal
        operation={opordModalOp}
        onClose={() => setOpordModalOp(null)}
        onEnroll={(op) => {
          handleOpenEnrollModal(op.id);
        }}
      />

      <EnrollmentModal
        isOpen={enrollModalOpen}
        operations={operations}
        selectedOpId={selectedEnrollOpId}
        onClose={() => setEnrollModalOpen(false)}
        onSuccess={(msg) => showToast(msg)}
        onOpenPayment={(it) => setActivePaymentItem(it)}
      />

      {/* Payment Checkout Modal */}
      <PaymentModal
        isOpen={!!activePaymentItem}
        item={activePaymentItem}
        onClose={() => setActivePaymentItem(null)}
        onPaymentCompleted={(rec) => {
          showToast(`RÈGLEMENT CONFIRMÉ // Reçu ${rec.txId} émis (${rec.amount.toFixed(2)} €). Bienvenue !`);
        }}
        onRedirectToDossier={() => handleJoinClick()}
      />

      {/* Authentication & Profile Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          showToast("SESSION VALIDÉE // BIENVENUE DANS LE RÉSEAU FOST AIRSOFT");
        }}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onOpenQG={() => {
          setIsAdminOpen(true);
        }}
      />

      {/* Tactical Auxiliary Modals */}
      <TacticalRadioModal
        isOpen={isRadioOpen}
        onClose={() => setIsRadioOpen(false)}
      />

      <ChronyCalculatorModal
        isOpen={isChronyOpen}
        onClose={() => setIsChronyOpen(false)}
      />

      <LoadoutChecklistModal
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
      />

      {/* Admin Command Staff Security Gate */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onAuthenticateSuccess={handleAdminAuthSuccess}
      />

      {/* Floating Tactical Toolkit Hub (Bottom-Left) */}
      {!isAdminOpen && (
        <div className="fixed bottom-5 left-5 z-40 flex items-center gap-2 bg-[#111315]/90 backdrop-blur border border-[#333537] p-1.5 rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
          <button
            onClick={() => setIsRadioOpen(true)}
            className="w-9 h-9 rounded-full bg-[#1A1D20] hover:bg-[#E87A1E] text-[#E87A1E] hover:text-[#111315] border border-[#E87A1E]/30 flex items-center justify-center transition-all cursor-pointer shadow-sm group"
            title="Transmetteur Radio PMR 446"
          >
            <span className="material-symbols-outlined text-[18px]">radio</span>
          </button>
          <button
            onClick={() => setIsChronyOpen(true)}
            className="w-9 h-9 rounded-full bg-[#1A1D20] hover:bg-[#2ECC71] text-[#2ECC71] hover:text-[#111315] border border-[#2ECC71]/30 flex items-center justify-center transition-all cursor-pointer shadow-sm group"
            title="Calculateur Chrony & FPS"
          >
            <span className="material-symbols-outlined text-[18px]">speed</span>
          </button>
          <button
            onClick={() => setIsChecklistOpen(true)}
            className="w-9 h-9 rounded-full bg-[#1A1D20] hover:bg-[#4AE183] text-[#4AE183] hover:text-[#111315] border border-[#4AE183]/30 flex items-center justify-center transition-all cursor-pointer shadow-sm group"
            title="Kitlist Opérateur & Checklist"
          >
            <span className="material-symbols-outlined text-[18px]">checklist</span>
          </button>
        </div>
      )}

      {/* Floating Tactical QG Chatbot (Bottom-Right) */}
      {!isAdminOpen && <TacticalChatbotModal />}

      {/* HelloAsso Return Status Modal (Statut réel lu côté serveur) */}
      {returnStatusInfo?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div
            className={`relative w-full max-w-lg bg-[#16181A] border-2 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-4 ${
              returnStatusInfo.statut === 'VALIDEE'
                ? 'border-[#2ECC71] shadow-[0_0_40px_rgba(46,204,113,0.3)]'
                : 'border-[#E87A1E] shadow-[0_0_40px_rgba(232,122,30,0.3)]'
            }`}
          >
            {returnStatusInfo.statut === 'VALIDEE' ? (
              <>
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-[#2ECC71]/20 border-2 border-[#2ECC71] mx-auto flex items-center justify-center text-[#2ECC71] shadow-[0_0_20px_rgba(46,204,113,0.3)]">
                    <span className="material-symbols-outlined text-3xl">verified</span>
                  </div>
                  <span className="font-mono text-xs text-[#2ECC71] uppercase font-bold tracking-wider block">
                    Statut Réel : VALIDÉE // MEMBRE OFFICIEL
                  </span>
                  <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-[#E2E3DF] uppercase">
                    Paiement Confirmé via HelloAsso
                  </h3>
                  <p className="font-mono text-xs text-[#AECFB2]">
                    Dossier d'adhésion <strong>[{returnStatusInfo.dossierId}]</strong>
                  </p>
                </div>

                <div className="p-4 bg-[#111315] rounded-xl border border-[#282a2c] space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-[#8E9297]">
                    <span>Adhérent :</span>
                    <span className="text-[#E2E3DF] font-bold">
                      {returnStatusInfo.prenom} {returnStatusInfo.nom}
                    </span>
                  </div>
                  {returnStatusInfo.montant && (
                    <div className="flex justify-between text-[#8E9297]">
                      <span>Montant Réglé :</span>
                      <span className="text-[#2ECC71] font-bold">
                        {returnStatusInfo.montant.toFixed(2)} €
                      </span>
                    </div>
                  )}
                  {returnStatusInfo.referencePaiement && (
                    <div className="flex justify-between text-[#8E9297]">
                      <span>Référence HelloAsso :</span>
                      <span className="text-[#FFA640]">{returnStatusInfo.referencePaiement}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-[#282a2c] text-[#AECFB2]">
                    ✓ Gratuité activée sur toutes les sessions d'OP MilSim 2026.
                  </div>
                </div>

                <p className="text-center font-mono text-[11px] text-[#8E9297] flex items-center justify-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#2ECC71]">lock</span>
                  <span>Paiement sécurisé via HelloAsso</span>
                </p>

                <button
                  type="button"
                  onClick={() => setReturnStatusInfo(null)}
                  className="w-full py-3.5 bg-[#2ECC71] text-[#111315] font-mono text-xs uppercase font-bold tracking-wider rounded-xl hover:brightness-110 cursor-pointer shadow-lg"
                >
                  Accéder au Portail FOST
                </button>
              </>
            ) : (
              <>
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-[#E87A1E]/20 border-2 border-[#E87A1E] mx-auto flex items-center justify-center text-[#E87A1E]">
                    <span className="material-symbols-outlined text-3xl">pending_actions</span>
                  </div>
                  <span className="font-mono text-xs text-[#E87A1E] uppercase font-bold tracking-wider block">
                    Statut Réel : EN ATTENTE DE RÈGLEMENT
                  </span>
                  <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#E2E3DF] uppercase">
                    Règlement Non Finalisé
                  </h3>
                  <p className="font-['Inter'] text-xs text-[#8E9297] leading-relaxed">
                    {returnStatusInfo.message}
                  </p>
                </div>

                <div className="p-3 bg-[#111315] rounded-xl border border-[#282a2c] text-xs font-mono text-[#8E9297] text-center">
                  Dossier conservé : <strong className="text-[#E2E3DF]">{returnStatusInfo.dossierId}</strong>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleRetryHelloAsso(returnStatusInfo.dossierId)}
                    className="w-full py-3.5 bg-[#2ECC71] hover:brightness-110 text-[#111315] font-mono text-xs uppercase font-bold tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(46,204,113,0.3)]"
                  >
                    <span className="material-symbols-outlined text-sm">replay</span>
                    <span>Réessayer le paiement via HelloAsso</span>
                  </button>

                  <p className="text-center font-mono text-[11px] text-[#8E9297] flex items-center justify-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-[#2ECC71]">lock</span>
                    <span>Paiement sécurisé via HelloAsso</span>
                  </p>

                  <button
                    type="button"
                    onClick={() => setReturnStatusInfo(null)}
                    className="w-full py-2 bg-[#1A1D20] text-[#8E9297] hover:text-[#E2E3DF] font-mono text-xs uppercase rounded-xl transition-all cursor-pointer"
                  >
                    Fermer
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* E-Commerce Shopping Cart System */}
      <CartDrawer
        onNavigateToArmory={() => {
          setActiveTab('armurerie');
          document.getElementById('armurerie')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onNavigateToOps={() => {
          setActiveTab('operations');
          document.getElementById('operations')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />
      <CheckoutModal />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#22262B] border border-[#2ECC71]/50 p-4 rounded shadow-[0_8px_32px_rgba(0,0,0,0.85)] flex items-start gap-3 animate-slideUp">
          <span className="material-symbols-outlined text-[#2ECC71] text-2xl shrink-0 mt-0.5">
            check_circle
          </span>
          <div>
            <h5 className="font-mono text-xs text-[#E2E3DF] uppercase font-bold">
              ORDRE DE MISSION CONFIRMÉ !
            </h5>
            <p className="font-['Inter'] text-xs text-[#8E9297] mt-0.5 leading-relaxed">
              {toastMessage}
            </p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-[#8E9297] hover:text-[#E2E3DF] ml-auto"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}
    </div>
  );
}
