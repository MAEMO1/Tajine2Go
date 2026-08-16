"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/stores/cart";
import { formatPrice } from "@/lib/format";

export function StickyBar() {
  const t = useTranslations("cart");
  const itemCount = useCartStore((s) => s.itemCount);
  const subtotalCents = useCartStore((s) => s.subtotalCents);
  const openCart = useCartStore((s) => s.openCart);
  const count = itemCount();

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", damping: 25, stiffness: 250 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-warm2/80 bg-brand-cream/95 px-4 py-3 shadow-[0_-2px_16px_rgba(45,27,10,0.06)] backdrop-blur-md md:hidden"
        >
          <button
            type="button"
            onClick={openCart}
            className="flex w-full items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <motion.span
                key={count}
                data-cart-target
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 400 }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-orange font-mono text-sm font-bold text-white shadow-[0_2px_8px_rgba(217,123,26,0.25)]"
              >
                {count}
              </motion.span>
              <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-brand-brown">
                {t("title")}
              </span>
            </div>
            <span className="font-mono text-lg font-bold text-brand-orange">
              {formatPrice(subtotalCents())}
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
