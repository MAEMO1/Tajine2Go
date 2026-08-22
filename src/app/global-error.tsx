"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="nl">
      <body className="flex min-h-screen flex-col items-center justify-center bg-[#FDF3E2] font-sans text-[#440C00]">
        <h1 className="text-4xl font-bold text-[#B84A10]">Oops</h1>
        <p className="mt-4">Er is iets misgegaan.</p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-lg bg-[#B84A10] px-6 py-3 font-semibold text-white"
        >
          Opnieuw proberen
        </button>
      </body>
    </html>
  );
}
