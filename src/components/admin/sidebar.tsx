"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Package,
  CalendarDays,
  UtensilsCrossed,
  FileText,
  PartyPopper,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Bestellingen", icon: Package },
  { href: "/admin/planning", label: "Planning", icon: CalendarDays },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/catering", label: "Catering", icon: PartyPopper },
  { href: "/admin/klanten", label: "Klanten", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/instellingen", label: "Instellingen", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between p-4">
        <div>
          <Link
            href="/admin/dashboard"
            onClick={() => setMobileOpen(false)}
            className="font-heading text-xl text-brand-orange"
          >
            Tajine2Go
          </Link>
          <p className="text-xs text-brand-brown-s">Adminpaneel</p>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="rounded-lg p-1 text-brand-brown-s hover:bg-brand-warm md:hidden"
          aria-label="Menu sluiten"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4" aria-label="Hoofdnavigatie">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange ${
                isActive
                  ? "bg-brand-warm font-medium text-brand-orange"
                  : "text-brand-brown-m hover:bg-brand-warm hover:text-brand-brown"
              }`}
            >
              <Icon size={18} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-brand-warm2 p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-brand-brown-s transition-colors hover:bg-brand-warm hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
        >
          <LogOut size={18} aria-hidden="true" />
          Uitloggen
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <div className="fixed left-0 right-0 top-0 z-40 flex items-center border-b border-brand-warm2 bg-white px-4 py-3 md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-1 text-brand-brown-m hover:bg-brand-warm"
          aria-label="Menu openen"
        >
          <Menu size={22} />
        </button>
        <span className="ml-3 font-heading text-lg text-brand-orange">Tajine2Go</span>
      </div>

      {/* Mobile overlay + drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-brand-warm2 bg-white md:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden w-56 flex-shrink-0 flex-col border-r border-brand-warm2 bg-white md:flex">
        {sidebarContent}
      </aside>
    </>
  );
}
