"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/stores/cart";
import { formatPrice } from "@/lib/format";
import { Link } from "@/i18n/navigation";

export function StickyBar() {
  const t = useTranslations("cart");
  const itemCount = useCartStore((s) => s.itemCount);
  const subtotalCents = useCartStore((s) => s.subtotalCents);
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
          <Link
            href="/bestellen"
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-orange text-sm font-bold text-white shadow-[0_2px_8px_rgba(217,123,26,0.25)]">
                {count}
              </span>
              <span className="font-heading text-[15px] uppercase tracking-[0.12em] text-brand-brown">
                {t("checkout")}
              </span>
            </div>
            <span className="font-heading text-xl text-brand-orange">
              {formatPrice(subtotalCents())}
            </span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
