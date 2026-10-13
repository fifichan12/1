import React, { createContext, useContext, useState, useEffect } from 'react';
import { tacticalAudio } from '../utils/audio';

export type CartItemCategory = 'REPLICA' | 'EVENT_PASS' | 'MEMBERSHIP' | 'EQUIPMENT';

export interface CartItem {
  id: string; // ID unique du panier (ex: replica-mp5-noir-stealth ou gopro-pack-basic-casque)
  productId: string; // ID du produit
  title: string;
  category: CartItemCategory;
  variant?: string; // e.g. "Pack Basic // Fixation Casque" ou "Finition Cerakote : Noir Tactique"
  price: number; // Prix unitaire en EUR (ex: 10, 15, 200, 5, 0, 20, 80)
  quantity: number;
  image?: string;
  requiresAgeCheck?: boolean; // Décret 99-240 pour les répliques
  depositRequired?: boolean; // Caution 100€ pour location matériel
  depositNotice?: string; // "Caution 100€ ou pièce d'identité requise le jour J"
  mountType?: string; // "Fixation Casque", "Fixation Torse", "Fixation Réplique"
  optionType?: 'basic' | 'full'; // 'basic' (10€) ou 'full' (15€)
  metadata?: Record<string, any>;
}

export interface CartContextType {
  items: CartItem[];
  totalCount: number;
  subtotal: number;
  total: number;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  hasReplicas: boolean;
  hasGoProRental: boolean;
}

const CART_STORAGE_KEY = 'fost_airsoft_cart_v1';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (err) {
      console.warn('Erreur chargement panier localStorage:', err);
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Sauvegarde persistante dans localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.warn('Erreur sauvegarde panier localStorage:', err);
    }
  }, [items]);

  const totalCount = items.reduce((acc, it) => acc + (it.quantity || 1), 0);
  const subtotal = items.reduce((acc, it) => acc + (it.price * (it.quantity || 1)), 0);
  const total = subtotal; // TVA non applicable, art. 261-7-1° a du CGI
  const hasReplicas = items.some((it) => it.requiresAgeCheck || it.category === 'REPLICA');
  const hasGoProRental = items.some(
    (it) => it.productId?.includes('gopro') || it.title?.toLowerCase().includes('gopro') || it.depositRequired
  );

  const openCart = () => {
    tacticalAudio.playClick();
    setIsCartOpen(true);
  };

  const closeCart = () => {
    tacticalAudio.playClick();
    setIsCartOpen(false);
  };

  const toggleCart = () => {
    tacticalAudio.playClick();
    setIsCartOpen((prev) => !prev);
  };

  const openCheckout = () => {
    tacticalAudio.playClick();
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => {
    tacticalAudio.playClick();
    setIsCheckoutOpen(false);
  };

  const addItem = (itemToAdd: Omit<CartItem, 'quantity'>, quantityToAdd: number = 1) => {
    tacticalAudio.playClick();
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((it) => it.id === itemToAdd.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantityToAdd
        };
        return updated;
      } else {
        return [...prevItems, { ...itemToAdd, quantity: quantityToAdd }];
      }
    });
    // Ouvre automatiquement le panier pour confirmer l'action à l'utilisateur
    setIsCartOpen(true);
  };

  const removeItem = (id: string) => {
    tacticalAudio.playClick();
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    tacticalAudio.playClick();
    setItems((prev) =>
      prev
        .map((it) => {
          if (it.id === id) {
            const newQty = it.quantity + delta;
            return newQty > 0 ? { ...it, quantity: newQty } : null;
          }
          return it;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    tacticalAudio.playClick();
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalCount,
        subtotal,
        total,
        isCartOpen,
        isCheckoutOpen,
        openCart,
        closeCart,
        toggleCart,
        openCheckout,
        closeCheckout,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        hasReplicas,
        hasGoProRental
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart doit être utilisé à l\'intérieur d\'un CartProvider');
  }
  return context;
};
