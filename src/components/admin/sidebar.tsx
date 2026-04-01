"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/orders", label: "Bestellingen", icon: "📦" },
  { href: "/admin/menu", label: "Menu", icon: "🍽️" },
  { href: "/admin/catering", label: "Catering", icon: "🎉" },
  { href: "/admin/klanten", label: "Klanten", icon: "👥" },
  { href: "/admin/analytics", label: "Analytics", icon: "📈" },
  { href: "/admin/instellingen", label: "Instellingen", icon: "⚙️" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <aside className="flex w-56 flex-shrink-0 flex-col border-r border-brand-warm2 bg-white">
      <div className="p-4">
        <Link href="/admin/dashboard" className="font-heading text-xl text-brand-orange">
          Tajine2Go
        </Link>
        <p className="text-xs text-brand-brown-s">Adminpaneel</p>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-brand-warm text-brand-orange font-medium"
                  : "text-brand-brown-m hover:bg-brand-warm hover:text-brand-brown"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-brand-warm2 p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-lg px-3 py-2 text-sm text-brand-brown-s hover:bg-brand-warm hover:text-red-600"
        >
          Uitloggen
        </button>
      </div>
    </aside>
  );
}
