"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="nl">
      <body className="flex min-h-screen flex-col items-center justify-center bg-[#FFFCF5] font-sans text-[#2D1B0A]">
        <h1 className="text-4xl font-bold text-[#D97B1A]">Oops</h1>
        <p className="mt-4">Er is iets misgegaan.</p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-lg bg-[#D97B1A] px-6 py-3 font-semibold text-white"
        >
          Opnieuw proberen
        </button>
      </body>
    </html>
  );
}
