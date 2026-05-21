import logoSrc from "@/assets/logo-splash.png";

export function WelltyneLogo({ size = 48, showWordmark = true }: { size?: number; showWordmark?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <img
        src={logoSrc}
        alt="Welltyne logo"
        style={{ width: size, height: size, objectFit: "contain" }}
        className="shrink-0"
      />
      {showWordmark && (
        <span className="text-lg font-semibold tracking-tight bg-gradient-to-r from-[hsl(var(--brand-green))] to-[hsl(var(--brand-blue))] bg-clip-text text-transparent">
          Welltyne
        </span>
      )}
    </div>
  );
}
