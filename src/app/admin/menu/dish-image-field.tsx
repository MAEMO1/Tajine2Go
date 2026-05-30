"use client";

import { useRef, useState } from "react";

type Props = {
  initialValue?: string | null;
};

export function DishImageField({ initialValue }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageUrl, setImageUrl] = useState(initialValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);

    const body = new FormData();
    body.append("file", file);

    const response = await fetch("/api/admin/uploads/dish-image", {
      method: "POST",
      body,
    });

    setUploading(false);

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      setError(result?.error ?? "Upload mislukt.");
      return;
    }

    const result = (await response.json()) as { url: string };
    setImageUrl(result.url);
  }

  return (
    <div className="rounded-xl border border-brand-warm2 p-4 sm:col-span-2">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="relative h-40 w-full overflow-hidden rounded-xl bg-brand-warm lg:w-56">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="Dish preview" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-brand-brown-s">
              Geen foto geselecteerd
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <label className="text-sm text-brand-brown-m">Afbeeldings-URL</label>
            <input
              name="image_url"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://..."
              className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
            />
            <p className="mt-1 text-xs text-brand-brown-s">
              Gebruik bij voorkeur upload. Handmatige URL&apos;s blijven mogelijk.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void handleUpload(file);
                }
                event.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:bg-brand-orange-hover disabled:opacity-50"
            >
              {uploading ? "Uploaden..." : "Upload foto"}
            </button>
            <button
              type="button"
              onClick={() => setImageUrl("")}
              className="rounded-lg border border-brand-brown-s px-4 py-2 text-sm font-semibold text-brand-brown hover:bg-brand-warm"
            >
              Verwijder afbeelding
            </button>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
