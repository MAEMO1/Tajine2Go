"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <h1 className="font-heading text-4xl text-brand-orange">Oops</h1>
      <p className="mt-4 text-brand-brown-m">Er is iets misgegaan.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-lg bg-brand-orange px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-orange-hover"
      >
        Opnieuw proberen
      </button>
    </div>
  );
}
