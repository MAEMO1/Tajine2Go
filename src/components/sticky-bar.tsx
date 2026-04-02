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
          className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-orange-hover bg-brand-orange px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.15)] md:hidden"
        >
          <Link
            href="/bestellen"
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-brand-orange">
                {count}
              </span>
              <span className="font-heading uppercase tracking-[0.08em] text-white">
                {t("checkout")}
              </span>
            </div>
            <span className="font-heading text-lg text-white">
              {formatPrice(subtotalCents())}
            </span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
