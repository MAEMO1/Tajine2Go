"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";
import type { Dish } from "@/types/database";

type Props = {
  dishes: Dish[];
};

export function DishesManager({ dishes }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl text-brand-brown">Menu beheer</h1>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:bg-brand-orange-hover"
        >
          {showForm ? "Annuleren" : "+ Nieuw gerecht"}
        </button>
      </div>

      {showForm && <DishForm onSaved={() => { setShowForm(false); router.refresh(); }} />}

      <div className="mt-6 space-y-3">
        {dishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
        {dishes.length === 0 && (
          <p className="text-center text-brand-brown-s">Geen gerechten</p>
        )}
      </div>
    </div>
  );
}

function DishCard({ dish }: { dish: Dish }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`${dish.name_nl} verwijderen?`)) return;
    setDeleting(true);
    await fetch(`/api/admin/dishes/${dish.id}`, { method: "DELETE" });
    router.refresh();
  }

  async function toggleActive() {
    await fetch(`/api/admin/dishes/${dish.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !dish.is_active }),
    });
    router.refresh();
  }

  return (
    <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-brand-brown">{dish.name_nl}</h3>
          <span className="rounded bg-brand-warm px-2 py-0.5 text-xs text-brand-brown-s">
            {dish.category}
          </span>
          {!dish.is_active && (
            <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-600">Inactief</span>
          )}
        </div>
        <p className="mt-1 text-sm text-brand-brown-s">
          {dish.slug} &middot; {formatPrice(dish.price_cents)}
          {dish.allergens.length > 0 && ` · ${dish.allergens.join(", ")}`}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={toggleActive}
          className="rounded px-3 py-1 text-xs text-brand-brown-s hover:bg-brand-warm"
        >
          {dish.is_active ? "Deactiveer" : "Activeer"}
        </button>
        <a
          href={`/admin/menu/${dish.id}`}
          className="rounded px-3 py-1 text-xs text-brand-orange hover:bg-brand-warm"
        >
          Bewerken
        </a>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="rounded px-3 py-1 text-xs text-red-500 hover:bg-red-50 disabled:opacity-50"
        >
          Verwijder
        </button>
      </div>
    </div>
  );
}

function DishForm({ onSaved }: { onSaved: () => void }) {
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

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

    const res = await fetch("/api/admin/dishes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSaving(false);
    if (res.ok) onSaved();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 rounded-xl bg-white p-6 shadow-sm">
      <h2 className="font-heading text-xl text-brand-bronze">Nieuw gerecht</h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Input name="slug" label="Slug" required />
        <Input name="category" label="Categorie" defaultValue="main" required />
        <Input name="price_cents" label="Prijs (centen)" type="number" required />
        <Input name="allergens" label="Allergenen (komma-gescheiden)" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Input name="name_nl" label="Naam NL" required />
        <Input name="name_fr" label="Naam FR" />
        <Input name="name_en" label="Naam EN" />
        <Input name="name_ar" label="Naam AR" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <TextArea name="description_nl" label="Beschrijving NL" />
        <TextArea name="description_fr" label="Beschrijving FR" />
        <TextArea name="description_en" label="Beschrijving EN" />
        <TextArea name="description_ar" label="Beschrijving AR" />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="mt-6 rounded-lg bg-brand-orange px-6 py-2 font-semibold text-white hover:bg-brand-orange-hover disabled:opacity-50"
      >
        {saving ? "Opslaan..." : "Opslaan"}
      </button>
    </form>
  );
}

function Input({ name, label, ...props }: { name: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
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

function TextArea({ name, label }: { name: string; label: string }) {
  return (
    <div>
      <label className="text-sm text-brand-brown-m">{label}</label>
      <textarea
        name={name}
        rows={2}
        className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
      />
    </div>
  );
}
