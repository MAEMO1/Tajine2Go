"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  settings: Record<string, unknown>;
};

export function SettingsForm({ settings }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const takeawayActive = (settings.takeaway_active as { active: boolean })?.active ?? false;
  const minOrder = (settings.min_order_cents as { amount: number })?.amount ?? 2000;
  const deliveryConfig = settings.delivery_config as {
    enabled: boolean;
    fee_cents: number;
    free_delivery_above_cents: number;
    zip_codes: string[];
  } | undefined;
  const notifications = settings.notifications as {
    admin_email: string;
    whatsapp_enabled: boolean;
    email_enabled: boolean;
  } | undefined;

  async function updateSetting(key: string, value: unknown) {
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    setSaving(false);
    setSaved(true);
    router.refresh();
  }

  return (
    <div>
      <h1 className="font-heading text-3xl text-brand-brown">Instellingen</h1>

      {saved && <p className="mt-2 text-sm text-green-600">Opgeslagen!</p>}

      <div className="mt-6 space-y-6">
        {/* Takeaway active */}
        <Section title="Takeaway status">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={takeawayActive}
              onChange={(e) => updateSetting("takeaway_active", { active: e.target.checked })}
              disabled={saving}
              className="h-4 w-4"
            />
            <span className="text-sm text-brand-brown">Bestellingen open</span>
          </label>
        </Section>

        {/* Min order */}
        <Section title="Minimumbedrag (centen)">
          <input
            type="number"
            defaultValue={minOrder}
            onBlur={(e) => updateSetting("min_order_cents", { amount: parseInt(e.target.value) })}
            disabled={saving}
            className="w-32 rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
          />
        </Section>

        {/* Delivery */}
        <Section title="Leveringsinstellingen">
          <div className="space-y-3 text-sm">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={deliveryConfig?.enabled ?? true}
                onChange={(e) =>
                  updateSetting("delivery_config", {
                    ...deliveryConfig,
                    enabled: e.target.checked,
                  })
                }
                disabled={saving}
                className="h-4 w-4"
              />
              <span className="text-brand-brown">Levering ingeschakeld</span>
            </label>
            <div>
              <label className="text-brand-brown-s">Leveringskosten (centen)</label>
              <input
                type="number"
                defaultValue={deliveryConfig?.fee_cents ?? 500}
                onBlur={(e) =>
                  updateSetting("delivery_config", {
                    ...deliveryConfig,
                    fee_cents: parseInt(e.target.value),
                  })
                }
                disabled={saving}
                className="ml-2 w-24 rounded-lg border border-brand-brown-s px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="text-brand-brown-s">Postcodes (komma-gescheiden)</label>
              <input
                type="text"
                defaultValue={deliveryConfig?.zip_codes?.join(", ") ?? ""}
                onBlur={(e) =>
                  updateSetting("delivery_config", {
                    ...deliveryConfig,
                    zip_codes: e.target.value.split(",").map((z) => z.trim()).filter(Boolean),
                  })
                }
                disabled={saving}
                className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm"
              />
            </div>
          </div>
        </Section>

        {/* Notifications */}
        <Section title="Notificaties">
          <div className="space-y-3 text-sm">
            <div>
              <label className="text-brand-brown-s">Admin e-mail</label>
              <input
                type="email"
                defaultValue={notifications?.admin_email ?? ""}
                onBlur={(e) =>
                  updateSetting("notifications", {
                    ...notifications,
                    admin_email: e.target.value,
                  })
                }
                disabled={saving}
                className="mt-1 w-full max-w-sm rounded-lg border border-brand-brown-s px-3 py-2 text-sm"
              />
            </div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={notifications?.whatsapp_enabled ?? false}
                onChange={(e) =>
                  updateSetting("notifications", {
                    ...notifications,
                    whatsapp_enabled: e.target.checked,
                  })
                }
                disabled={saving}
                className="h-4 w-4"
              />
              <span className="text-brand-brown">WhatsApp notificaties</span>
            </label>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="font-heading text-xl text-brand-bronze">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}
