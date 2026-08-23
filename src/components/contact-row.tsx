/*
 * Contactregel met ronde merkoranje badge en papierkleurige glyph — zoals het
 * drukwerk. Bron: design system, components/core/ContactRow.
 */

type Icon = "pin" | "phone" | "mail" | "instagram" | "facebook";

export function ContactRow({ icon, children }: { icon: Icon; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand-orange text-brand-cream">
        <Glyph icon={icon} />
      </span>
      <span>{children}</span>
    </li>
  );
}

function Glyph({ icon }: { icon: Icon }) {
  const common = { className: "h-3.5 w-3.5", viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true } as const;
  switch (icon) {
    case "pin":
      return (
        <svg {...common}>
          <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" />
        </svg>
      );
    case "phone":
      return (
        <svg {...common}>
          <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <path d="M3 5h18a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1zm9 8L4.4 7h15.2L12 13z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common}>
          <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.22 1 .48 1.4.9.43.42.7.83.9 1.4.18.44.38 1.05.43 2.24.06 1.28.07 1.66.07 4.88s-.01 3.6-.07 4.88c-.05 1.19-.25 1.8-.42 2.23-.22.57-.48.98-.9 1.4-.42.43-.83.7-1.4.9-.44.18-1.05.38-2.24.43-1.28.06-1.66.07-4.88.07s-3.6-.01-4.88-.07c-1.19-.05-1.8-.25-2.23-.42a3.8 3.8 0 01-1.4-.9 3.8 3.8 0 01-.9-1.4c-.18-.44-.38-1.05-.43-2.24C2.21 15.6 2.2 15.22 2.2 12s.01-3.6.07-4.88c.05-1.19.25-1.8.42-2.23.22-.57.48-.98.9-1.4.42-.43.83-.7 1.4-.9.44-.18 1.05-.38 2.24-.43C8.4 2.21 8.78 2.2 12 2.2zm0 3.24a6.56 6.56 0 100 13.12 6.56 6.56 0 000-13.12zm0 10.82a4.26 4.26 0 110-8.52 4.26 4.26 0 010 8.52zm8.35-11.08a1.53 1.53 0 11-3.06 0 1.53 1.53 0 013.06 0z" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...common}>
          <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H16.7V3.6c-.29-.04-1.28-.13-2.43-.13-2.4 0-4.05 1.47-4.05 4.17V9.9H7.5V13h2.72v8z" />
        </svg>
      );
  }
}
