"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { useToast } from "@/components/admin/toast";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { UtensilsCrossed } from "lucide-react";
import type { Dish } from "@/types/database";
import { DishImageField } from "./dish-image-field";

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
          <div className="flex flex-col items-center gap-2 py-12 text-brand-brown-s">
            <UtensilsCrossed size={32} strokeWidth={1.5} />
            <p className="text-sm">Geen gerechten</p>
          </div>
        )}
      </div>
    </div>
  );
}

function DishCard({ dish }: { dish: Dish }) {
  const router = useRouter();
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const res = await fetch(`/api/admin/dishes/${dish.id}`, { method: "DELETE" });
    if (res.ok) {
      toast(`${dish.name_nl} verwijderd.`);
    } else {
      toast("Verwijderen mislukt.", "error");
    }
    setDeleting(false);
    router.refresh();
  }

  async function toggleActive() {
    await fetch(`/api/admin/dishes/${dish.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !dish.is_active }),
    });
    toast(dish.is_active ? "Gerecht gedeactiveerd." : "Gerecht geactiveerd.");
    router.refresh();
  }

  return (
    <>
      <div className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
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
            {dish.ingredients_nl.length > 0 && ` · ${dish.ingredients_nl.join(", ")}`}
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
            onClick={() => setConfirmDelete(true)}
            disabled={deleting}
            className="rounded px-3 py-1 text-xs text-red-500 hover:bg-red-50 disabled:opacity-50"
          >
            Verwijder
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Gerecht verwijderen"
        description={`Weet je zeker dat je "${dish.name_nl}" wilt verwijderen? Dit kan niet ongedaan worden.`}
        confirmLabel="Verwijderen"
        variant="danger"
        onConfirm={() => {
          setConfirmDelete(false);
          handleDelete();
        }}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  );
}

function DishForm({ onSaved }: { onSaved: () => void }) {
  const [saving, setSaving] = useState(false);

  function parseListField(form: FormData, name: string) {
    return (form.get(name) as string).split(",").map((value) => value.trim()).filter(Boolean);
  }

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
      ingredients_nl: parseListField(form, "ingredients_nl"),
      ingredients_fr: parseListField(form, "ingredients_fr"),
      ingredients_en: parseListField(form, "ingredients_en"),
      ingredients_ar: parseListField(form, "ingredients_ar"),
      price_cents: parseInt(form.get("price_cents") as string),
      image_url: form.get("image_url") || null,
      category: form.get("category"),
      allergens: parseListField(form, "allergens"),
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

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Input name="ingredients_nl" label="Ingrediënten NL (komma-gescheiden)" />
        <Input name="ingredients_fr" label="Ingrediënten FR (komma-gescheiden)" />
        <Input name="ingredients_en" label="Ingrediënten EN (komma-gescheiden)" />
        <Input name="ingredients_ar" label="Ingrediënten AR (komma-gescheiden)" />
      </div>

      <div className="mt-4">
        <DishImageField />
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
