export function HeroVideo() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/hero-fallback.png"
        className="h-full w-full object-cover"
      >
        <source src="/hero-animation.webm" type="video/webm" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/70 via-brand-brown/30 to-transparent" />
    </div>
  );
}
