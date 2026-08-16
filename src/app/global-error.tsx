"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="nl">
      <body className="flex min-h-screen flex-col items-center justify-center bg-[#FFF8EA] font-sans text-[#3B1606]">
        <h1 className="text-4xl font-bold text-[#E75A0A]">Oops</h1>
        <p className="mt-4">Er is iets misgegaan.</p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-lg bg-[#E75A0A] px-6 py-3 font-semibold text-white"
        >
          Opnieuw proberen
        </button>
      </body>
    </html>
  );
}
