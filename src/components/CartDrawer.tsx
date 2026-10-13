import React, { useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { tacticalAudio } from '../utils/audio';

interface CartDrawerProps {
  onNavigateToArmory?: () => void;
  onNavigateToOps?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onNavigateToArmory,
  onNavigateToOps
}) => {
  const {
    items,
    totalCount,
    total,
    isCartOpen,
    closeCart,
    openCheckout,
    removeItem,
    updateQuantity,
    clearCart,
    hasReplicas
  } = useCart();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Dark backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={closeCart}
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-md bg-[#111315] border-l border-[#333537] shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col h-full z-10 animate-slideInRight text-[#E2E3DF]">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-[#282a2c] bg-[#141618] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#E87A1E]/15 border border-[#E87A1E]/40 flex items-center justify-center text-[#E87A1E]">
              <span className="material-symbols-outlined text-xl">shopping_cart</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-['Space_Grotesk'] text-base sm:text-lg font-bold uppercase tracking-tight text-[#E2E3DF]">
                  PANIER TACTIQUE
                </h2>
                <span className="px-2 py-0.5 bg-[#2ECC71]/20 text-[#2ECC71] border border-[#2ECC71]/40 rounded-full font-mono text-[10px] font-bold">
                  {totalCount} {totalCount > 1 ? 'ARTICLES' : 'ARTICLE'}
                </span>
              </div>
              <p className="font-mono text-[10px] text-[#8E9297] uppercase tracking-wider">
                DOTATIONS // PASS OP // ADHÉSIONS
              </p>
            </div>
          </div>

          <button
            onClick={closeCart}
            className="w-8 h-8 rounded-lg bg-[#1A1D20] hover:bg-[#282a2c] text-[#8E9297] hover:text-[#E2E3DF] border border-[#333537] flex items-center justify-center cursor-pointer transition-colors"
            title="Fermer le panier"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            /* Empty State */
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 my-auto">
              <div className="w-16 h-16 rounded-2xl bg-[#1A1D20] border border-[#333537] flex items-center justify-center text-[#6E7277]">
                <span className="material-symbols-outlined text-3xl">remove_shopping_cart</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#E2E3DF] uppercase">
                  VOTRE PANIER EST VIDE
                </h3>
                <p className="font-mono text-xs text-[#8E9297] max-w-xs">
                  Aucun pass de jeu, adhésion ou réplique n'a été ajouté pour le moment.
                </p>
              </div>

              <div className="pt-2 w-full space-y-2">
                {onNavigateToArmory && (
                  <button
                    onClick={() => {
                      closeCart();
                      onNavigateToArmory();
                    }}
                    className="w-full py-2.5 px-4 bg-[#1E2226] hover:bg-[#282a2c] border border-[#E87A1E]/40 hover:border-[#E87A1E] text-[#E87A1E] font-mono text-xs uppercase font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">hardware</span>
                    <span>Consulter l'Armurerie (200 €)</span>
                  </button>
                )}
                {onNavigateToOps && (
                  <button
                    onClick={() => {
                      closeCart();
                      onNavigateToOps();
                    }}
                    className="w-full py-2.5 px-4 bg-[#1E2226] hover:bg-[#282a2c] border border-[#2ECC71]/40 hover:border-[#2ECC71] text-[#2ECC71] font-mono text-xs uppercase font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">calendar_month</span>
                    <span>Voir les Opérations & Pass OP (5 €)</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Cart Items List */
            <div className="space-y-3">
              {items.map((item) => {
                const itemTotal = item.price * item.quantity;
                return (
                  <div
                    key={item.id}
                    className="p-3 bg-[#16191C] border border-[#282a2c] hover:border-[#3B4D3F] rounded-xl flex gap-3 transition-colors relative group"
                  >
                    {/* Item Thumbnail */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-[#0E1012] border border-[#282a2c] overflow-hidden shrink-0 flex items-center justify-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-2xl text-[#8E9297]">
                          {item.category === 'REPLICA'
                            ? 'hardware'
                            : item.category === 'EVENT_PASS'
                            ? 'confirmation_number'
                            : 'badge'}
                        </span>
                      )}
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-['Space_Grotesk'] text-xs sm:text-sm font-bold text-[#E2E3DF] uppercase truncate">
                            {item.title}
                          </h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-[#8E9297] hover:text-[#E74C3C] p-1 rounded transition-colors cursor-pointer shrink-0"
                            title="Supprimer cet article"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>

                        {item.variant && (
                          <p className="font-mono text-[11px] text-[#FFA640] truncate mt-0.5">
                            {item.variant}
                          </p>
                        )}

                        <div className="flex items-center gap-2 mt-1">
                          {item.category === 'REPLICA' && (
                            <span className="px-1.5 py-0.2 bg-[#E74C3C]/15 text-[#E74C3C] border border-[#E74C3C]/40 rounded font-mono text-[9px] font-bold">
                              18+ DÉCRET 99-240
                            </span>
                          )}
                          {item.category === 'EVENT_PASS' && (
                            <span className="px-1.5 py-0.2 bg-[#2ECC71]/15 text-[#2ECC71] border border-[#2ECC71]/40 rounded font-mono text-[9px] font-bold">
                              PASS OP
                            </span>
                          )}
                          {item.category === 'MEMBERSHIP' && (
                            <span className="px-1.5 py-0.2 bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/40 rounded font-mono text-[9px] font-bold">
                              ADHÉSION
                            </span>
                          )}
                          {item.depositRequired && (
                            <span className="px-1.5 py-0.2 bg-[#FFA640]/15 text-[#FFA640] border border-[#FFA640]/40 rounded font-mono text-[9px] font-bold">
                              CAUTION 100€
                            </span>
                          )}
                          {item.category === 'EQUIPMENT' && !item.depositRequired && (
                            <span className="px-1.5 py-0.2 bg-[#A855F7]/15 text-[#C084FC] border border-[#A855F7]/40 rounded font-mono text-[9px] font-bold">
                              LOCATION
                            </span>
                          )}
                        </div>
                        {item.depositNotice && (
                          <p className="font-mono text-[10px] text-[#AECFB2] mt-1 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px] text-[#FFA640]">verified_user</span>
                            <span>{item.depositNotice}</span>
                          </p>
                        )}
                      </div>

                      {/* Quantity & Unit Price */}
                      <div className="flex items-center justify-between pt-2 mt-1 border-t border-[#22262B]">
                        {/* Quantity modifier */}
                        <div className="flex items-center border border-[#333537] bg-[#111315] rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.quantity <= 1}
                            className="w-6 h-6 flex items-center justify-center text-[#8E9297] hover:text-[#E2E3DF] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                          >
                            -
                          </button>
                          <span className="w-7 text-center font-mono text-xs font-bold text-[#E2E3DF]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-6 h-6 flex items-center justify-center text-[#8E9297] hover:text-[#E2E3DF] cursor-pointer transition-colors"
                          >
                            +
                          </button>
                        </div>

                        {/* Price computation */}
                        <div className="text-right">
                          <span className="font-mono text-xs font-bold text-[#2ECC71]">
                            {itemTotal.toFixed(2)} €
                          </span>
                          {item.quantity > 1 && (
                            <span className="block font-mono text-[9px] text-[#8E9297]">
                              ({item.price.toFixed(2)} € / u)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="flex justify-end pt-1">
                <button
                  onClick={clearCart}
                  className="font-mono text-[10px] text-[#8E9297] hover:text-[#E74C3C] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-xs">remove_circle_outline</span>
                  <span>Vider tout le panier</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Checkout Summary */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#282a2c] bg-[#141618] space-y-3">
            {/* 18+ Warning notice if replica inside */}
            {hasReplicas && (
              <div className="p-2.5 bg-[#E74C3C]/10 border border-[#E74C3C]/40 rounded-lg flex items-start gap-2 text-[10px] text-[#FF8577] font-mono leading-tight">
                <span className="material-symbols-outlined text-sm text-[#E74C3C] shrink-0 mt-0.5">
                  warning
                </span>
                <span>
                  Ce panier contient une réplique d'airsoft. Réservé aux personnes majeures (18 ans révolus - Décret n° 99-240 du 24 mars 1999).
                </span>
              </div>
            )}

            {/* Calculations & VAT */}
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-[#8E9297]">
                <span>Sous-total articles :</span>
                <span>{total.toFixed(2)} €</span>
              </div>

              <div className="flex justify-between text-[11px] text-[#2ECC71]">
                <span>Régime fiscal :</span>
                <span className="text-[10px] font-bold">TVA non applicable (art. 261-7-1° a CGI)</span>
              </div>

              <div className="pt-2 border-t border-[#282a2c] flex justify-between items-baseline">
                <span className="font-['Space_Grotesk'] text-base uppercase font-bold text-[#E2E3DF]">
                  TOTAL À RÉGLER :
                </span>
                <span className="font-['Space_Grotesk'] text-2xl font-bold text-[#2ECC71]">
                  {total.toFixed(2)} € TTC
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  tacticalAudio.playClick();
                  openCheckout();
                }}
                className="w-full py-3.5 px-4 bg-[#2ECC71] hover:brightness-110 active:scale-98 text-[#111315] font-mono text-xs uppercase font-bold tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(46,204,113,0.35)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">lock</span>
                <span>Valider le panier & Commander ({total.toFixed(2)} €)</span>
              </button>

              <button
                onClick={closeCart}
                className="w-full py-2.5 px-4 bg-[#1A1D20] hover:bg-[#22262B] text-[#8E9297] hover:text-[#E2E3DF] border border-[#333537] font-mono text-xs uppercase rounded-xl transition-colors flex items-center justify-center cursor-pointer"
              >
                Continuer mes achats
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
