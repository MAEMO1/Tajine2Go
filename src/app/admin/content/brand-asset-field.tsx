"use client";

import { useRef, useState } from "react";

type Props = {
  value: string;
  altValue: string;
  onUrlChange: (value: string) => void;
  onAltChange: (value: string) => void;
};

export function BrandAssetField({ value, altValue, onUrlChange, onAltChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);

    const body = new FormData();
    body.append("file", file);

    const response = await fetch("/api/admin/uploads/brand-asset", {
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
    onUrlChange(result.url);
  }

  return (
    <div className="rounded-xl border border-brand-warm2 p-4">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex h-40 w-full items-center justify-center overflow-hidden rounded-xl bg-brand-warm lg:w-56">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt={altValue || "Brand preview"} className="h-full w-full object-contain p-4" />
          ) : (
            <div className="px-4 text-center text-sm text-brand-brown-s">
              Geen logo geconfigureerd. De site valt terug op het standaard brand-logo.
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <label className="text-sm text-brand-brown-m">Logo-URL</label>
            <input
              value={value}
              onChange={(event) => onUrlChange(event.target.value)}
              placeholder="https://..."
              className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
            />
            <p className="mt-1 text-xs text-brand-brown-s">
              Upload is de standaardflow. Een manuele URL blijft toegestaan.
            </p>
          </div>

          <div>
            <label className="text-sm text-brand-brown-m">Alt-tekst logo</label>
            <input
              value={altValue}
              onChange={(event) => onAltChange(event.target.value)}
              placeholder="Tajine2Go"
              className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
            />
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
              {uploading ? "Uploaden..." : "Upload logo"}
            </button>
            <button
              type="button"
              onClick={() => onUrlChange("")}
              className="rounded-lg border border-brand-brown-s px-4 py-2 text-sm font-semibold text-brand-brown hover:bg-brand-warm"
            >
              Verwijder logo
            </button>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
