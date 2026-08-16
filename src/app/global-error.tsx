"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="nl">
      <body className="flex min-h-screen flex-col items-center justify-center bg-[#FBF2DC] font-sans text-[#3B1606]">
        <h1 className="text-4xl font-bold text-[#D2691E]">Oops</h1>
        <p className="mt-4">Er is iets misgegaan.</p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-lg bg-[#B5540F] px-6 py-3 font-semibold text-white"
        >
          Opnieuw proberen
        </button>
      </body>
    </html>
  );
}
