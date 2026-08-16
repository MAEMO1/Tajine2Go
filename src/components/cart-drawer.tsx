"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useCartStore } from "@/stores/cart";
import { formatPrice } from "@/lib/format";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const openCart = useCartStore((s) => s.openCart);
  const closeCart = useCartStore((s) => s.closeCart);
  const t = useTranslations("cart");
  const locale = useLocale();
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotalCents = useCartStore((s) => s.subtotalCents);
  const itemCount = useCartStore((s) => s.itemCount);

  const count = itemCount();
  // The panel is anchored to the inline-end side; mirror its slide for RTL.
  const offscreenX = locale === "ar" ? "-100%" : "100%";

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
            onClick={() => openCart()}
            className="fixed bottom-6 z-40 hidden items-center gap-2.5 rounded-full bg-brand-brown px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-brand-cream shadow-[0_4px_24px_rgba(45,27,10,0.25)] transition-all duration-200 hover:bg-brand-brown/90 active:scale-[0.97] md:flex ltr:right-6 rtl:left-6"
          >
            <CartIcon />
            <span>{t("itemCount", { count })}</span>
            <span className="text-brand-brown-s">&middot;</span>
            <span className="font-mono text-brand-orange">{formatPrice(subtotalCents())}</span>
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
            className="fixed inset-0 z-50 bg-brand-brown/30 backdrop-blur-[3px]"
            onClick={() => closeCart()}
          />
        )}
      </AnimatePresence>

      {/* Drawer panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: offscreenX }}
            animate={{ x: 0 }}
            exit={{ x: offscreenX }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            data-lenis-prevent
            className="fixed inset-y-0 z-50 flex w-full max-w-md flex-col border-brand-warm2 bg-brand-cream shadow-[0_0_60px_rgba(45,27,10,0.18)] ltr:right-0 ltr:border-l rtl:left-0 rtl:border-r"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4">
              <h2 className="text-xl font-bold uppercase tracking-[0.02em] text-brand-brown">
                {t("title")}
                {count > 0 && (
                  <span className="ms-2.5 align-middle font-mono text-xs font-bold text-brand-orange">
                    {t("itemCount", { count })}
                  </span>
                )}
              </h2>
              <button
                type="button"
                onClick={() => closeCart()}
                aria-label={t("title")}
                className="rounded-full p-1.5 text-brand-brown-s transition-all duration-200 hover:rotate-90 hover:bg-brand-warm hover:text-brand-brown"
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
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.weekly_menu_id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: locale === "ar" ? -40 : 40 }}
                        transition={{ duration: 0.25 }}
                        className="flex items-center gap-3 rounded-xl bg-brand-warm/50 p-3"
                      >
                        {/* Thumbnail */}
                        {item.image_url ? (
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                            <Image
                              src={item.image_url}
                              alt={item.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-warm2/60">
                            <svg
                              className="h-6 w-6 text-brand-orange/30"
                              viewBox="0 0 48 48"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                d="M8 36h32M10 36c0-12 4-20 14-20s14 8 14 20"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold uppercase tracking-[0.02em] text-brand-brown">
                            {item.name}
                          </p>
                          <p className="font-mono text-xs text-brand-brown-s">
                            {formatPrice(item.price_cents)}
                          </p>

                          {/* Quantity controls */}
                          <div className="mt-1.5 flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.weekly_menu_id, item.quantity - 1)}
                              className="flex h-6 w-6 items-center justify-center rounded-full border border-brand-brown-s/40 text-brand-brown-m transition-all duration-150 hover:border-brand-orange hover:text-brand-orange active:scale-90"
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-mono text-sm font-bold text-brand-brown">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.weekly_menu_id, item.quantity + 1)}
                              className="flex h-6 w-6 items-center justify-center rounded-full border border-brand-brown-s/40 text-brand-brown-m transition-all duration-150 hover:border-brand-orange hover:text-brand-orange active:scale-90"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Line total */}
                        <span className="w-16 text-end font-mono text-base font-bold text-brand-orange">
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
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-brand-warm2/60 px-5 py-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-brand-brown-m">
                    {t("subtotal")}
                  </span>
                  <span className="font-mono text-2xl font-bold text-brand-orange">
                    {formatPrice(subtotalCents())}
                  </span>
                </div>
                <Link
                  href="/bestellen"
                  onClick={() => closeCart()}
                  className="mt-4 block w-full rounded-full bg-brand-orange-hover py-3.5 text-center font-mono text-xs font-bold uppercase tracking-[0.24em] text-white transition-all duration-300 hover:bg-brand-orange-deep hover:shadow-[0_4px_20px_rgba(181,84,15,0.3)] active:scale-[0.99]"
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
