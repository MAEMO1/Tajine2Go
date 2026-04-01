"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Dish } from "@/types/database";

type Props = {
  dish: Dish;
};

export function DishEditor({ dish }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const form = new FormData(e.currentTarget);
    const body = {
      slug: form.get("slug"),
      name_nl: form.get("name_nl"),
      name_fr: form.get("name_fr") || null,
      name_en: form.get("name_en") || null,
      name_ar: form.get("name_ar") || null,
      description_nl: form.get("description_nl") || null,
      description_fr: form.get("description_fr") || null,
      description_en: form.get("description_en") || null,
      description_ar: form.get("description_ar") || null,
      price_cents: parseInt(form.get("price_cents") as string),
      category: form.get("category"),
      allergens: (form.get("allergens") as string).split(",").map((a) => a.trim()).filter(Boolean),
    };

    const res = await fetch(`/api/admin/dishes/${dish.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSaving(false);
    if (res.ok) {
      setSaved(true);
      router.refresh();
    }
  }

  return (
    <div>
      <h1 className="font-heading text-3xl text-brand-brown">Gerecht bewerken</h1>

      <form onSubmit={handleSubmit} className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="slug" label="Slug" defaultValue={dish.slug} required />
          <Field name="category" label="Categorie" defaultValue={dish.category} required />
          <Field name="price_cents" label="Prijs (centen)" type="number" defaultValue={dish.price_cents} required />
          <Field name="allergens" label="Allergenen" defaultValue={dish.allergens.join(", ")} />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field name="name_nl" label="Naam NL" defaultValue={dish.name_nl} required />
          <Field name="name_fr" label="Naam FR" defaultValue={dish.name_fr ?? ""} />
          <Field name="name_en" label="Naam EN" defaultValue={dish.name_en ?? ""} />
          <Field name="name_ar" label="Naam AR" defaultValue={dish.name_ar ?? ""} />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <TA name="description_nl" label="Beschrijving NL" defaultValue={dish.description_nl ?? ""} />
          <TA name="description_fr" label="Beschrijving FR" defaultValue={dish.description_fr ?? ""} />
          <TA name="description_en" label="Beschrijving EN" defaultValue={dish.description_en ?? ""} />
          <TA name="description_ar" label="Beschrijving AR" defaultValue={dish.description_ar ?? ""} />
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-brand-orange px-6 py-2 font-semibold text-white hover:bg-brand-orange-hover disabled:opacity-50"
          >
            {saving ? "Opslaan..." : "Opslaan"}
          </button>
          {saved && <span className="text-sm text-green-600">Opgeslagen!</span>}
        </div>
      </form>
    </div>
  );
}

function Field({ name, label, ...props }: { name: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-sm text-brand-brown-m">{label}</label>
      <input
        name={name}
        className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
        {...props}
      />
    </div>
  );
}

function TA({ name, label, defaultValue }: { name: string; label: string; defaultValue: string }) {
  return (
    <div>
      <label className="text-sm text-brand-brown-m">{label}</label>
      <textarea
        name={name}
        rows={2}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
      />
    </div>
  );
}
