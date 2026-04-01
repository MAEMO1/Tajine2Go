"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/stores/cart";
import { formatPrice } from "@/lib/format";
import { Link } from "@/i18n/navigation";

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
      {/* Floating cart button (mobile) */}
      {!isOpen && count > 0 && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-brand-orange px-5 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-brand-orange-hover md:hidden"
        >
          <CartIcon />
          <span>{t("itemCount", { count })}</span>
          <span>{formatPrice(subtotalCents())}</span>
        </button>
      )}

      {/* Desktop sticky cart indicator */}
      {!isOpen && count > 0 && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 hidden items-center gap-2 rounded-full bg-brand-orange px-5 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-brand-orange-hover md:flex"
        >
          <CartIcon />
          <span>{t("itemCount", { count })}</span>
          <span>&middot;</span>
          <span>{formatPrice(subtotalCents())}</span>
        </button>
      )}

      {/* Drawer overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
          role="button"
          tabIndex={0}
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed inset-y-0 z-50 flex w-full max-w-md flex-col bg-brand-cream shadow-2xl transition-transform duration-300 ltr:right-0 rtl:left-0 ${
          isOpen
            ? "translate-x-0"
            : "ltr:translate-x-full rtl:-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brand-warm2 px-4 py-4">
          <h2 className="font-heading text-2xl text-brand-brown">{t("title")}</h2>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-brand-brown-s hover:text-brand-brown"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <p className="text-center text-brand-brown-s">{t("empty")}</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.weekly_menu_id}
                  className="flex items-center gap-3 rounded-lg bg-white p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-brand-brown">
                      {item.name}
                    </p>
                    <p className="text-sm text-brand-brown-s">
                      {formatPrice(item.price_cents)}
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.weekly_menu_id, item.quantity - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-brand-brown-s text-brand-brown-m hover:bg-brand-warm"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-medium text-brand-brown">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.weekly_menu_id, item.quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-brand-brown-s text-brand-brown-m hover:bg-brand-warm"
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
                    className="text-brand-brown-s hover:text-red-600"
                    title={t("remove")}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-brand-warm2 px-4 py-4">
            <div className="flex items-center justify-between text-lg">
              <span className="text-brand-brown-m">{t("subtotal")}</span>
              <span className="font-heading text-xl text-brand-orange">
                {formatPrice(subtotalCents())}
              </span>
            </div>
            <Link
              href="/bestellen"
              onClick={() => setIsOpen(false)}
              className="mt-4 block w-full rounded-lg bg-brand-orange py-3 text-center font-semibold text-white transition-colors hover:bg-brand-orange-hover"
            >
              {t("checkout")}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

function CartIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
      />
    </svg>
  );
}
