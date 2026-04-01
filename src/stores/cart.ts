"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  weekly_menu_id: string;
  dish_id: string;
  name: string;
  price_cents: number;
  quantity: number;
  image_url: string | null;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (weeklyMenuId: string) => void;
  updateQuantity: (weeklyMenuId: string, quantity: number) => void;
  clearCart: () => void;
  subtotalCents: () => number;
  itemCount: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.weekly_menu_id === item.weekly_menu_id,
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.weekly_menu_id === item.weekly_menu_id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        });
      },

      removeItem: (weeklyMenuId) => {
        set((state) => ({
          items: state.items.filter((i) => i.weekly_menu_id !== weeklyMenuId),
        }));
      },

      updateQuantity: (weeklyMenuId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(weeklyMenuId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.weekly_menu_id === weeklyMenuId ? { ...i, quantity } : i,
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      subtotalCents: () =>
        get().items.reduce(
          (sum, item) => sum + item.price_cents * item.quantity,
          0,
        ),

      itemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: "tajine2go-cart",
    },
  ),
);
