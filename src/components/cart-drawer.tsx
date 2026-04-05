"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/stores/cart";
import { formatPrice } from "@/lib/format";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("cart");
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotalCents = useCartStore((s) => s.subtotalCents);
  const itemCount = useCartStore((s) => s.itemCount);

  const count = itemCount();

  if (count === 0 && !isOpen) return null;

  return (
    <>
      {/* Desktop floating cart button */}
      <AnimatePresence>
        {!isOpen && count > 0 && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            type="button"
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 z-40 hidden items-center gap-2.5 rounded-full bg-brand-brown px-6 py-3.5 font-heading text-[15px] uppercase tracking-[0.1em] text-brand-cream shadow-[0_4px_24px_rgba(45,27,10,0.2)] transition-all duration-200 hover:bg-brand-brown/90 active:scale-[0.97] md:flex ltr:right-6 rtl:left-6"
          >
            <CartIcon />
            <span>{t("itemCount", { count })}</span>
            <span className="text-brand-brown-s">&middot;</span>
            <span className="text-brand-orange">{formatPrice(subtotalCents())}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Drawer overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brand-brown/25 backdrop-blur-[2px]"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Drawer panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed inset-y-0 z-50 flex w-full max-w-md flex-col border-brand-warm2 bg-brand-cream shadow-[-8px_0_30px_rgba(45,27,10,0.08)] ltr:right-0 ltr:border-l rtl:left-0 rtl:border-r"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4">
              <h2 className="font-heading text-2xl uppercase tracking-[0.12em] text-brand-brown">
                {t("title")}
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-brand-brown-s transition-colors hover:bg-brand-warm hover:text-brand-brown"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mx-5 h-px bg-gradient-to-r from-transparent via-brand-warm2 to-transparent" />

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <p className="py-8 text-center text-brand-brown-s">{t("empty")}</p>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.weekly_menu_id}
                      className="flex items-center gap-3 rounded-xl bg-brand-warm/50 p-3.5"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-heading text-[15px] uppercase tracking-[0.06em] text-brand-brown">
                          {item.name}
                        </p>
                        <p className="text-sm text-brand-brown-s">
                          {formatPrice(item.price_cents)}
                        </p>
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.weekly_menu_id, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-brand-warm2 text-brand-brown-m transition-colors hover:bg-brand-warm"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-heading text-[15px] text-brand-brown">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.weekly_menu_id, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-brand-warm2 text-brand-brown-m transition-colors hover:bg-brand-warm"
                        >
                          +
                        </button>
                      </div>

                      {/* Line total */}
                      <span className="w-16 text-end font-heading text-lg text-brand-orange">
                        {formatPrice(item.price_cents * item.quantity)}
                      </span>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => removeItem(item.weekly_menu_id)}
                        className="rounded-full p-1 text-brand-brown-s/50 transition-colors hover:text-red-500"
                        title={t("remove")}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-brand-warm2/60 px-5 py-5">
                <div className="flex items-center justify-between">
                  <span className="text-brand-brown-m">{t("subtotal")}</span>
                  <span className="font-heading text-2xl text-brand-orange">
                    {formatPrice(subtotalCents())}
                  </span>
                </div>
                <Link
                  href="/bestellen"
                  onClick={() => setIsOpen(false)}
                  className="mt-4 block w-full rounded-full bg-brand-orange py-3.5 text-center font-heading text-[15px] uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-brand-orange-hover hover:shadow-[0_4px_20px_rgba(217,123,26,0.25)]"
                >
                  {t("checkout")}
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function CartIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
      />
    </svg>
  );
}
