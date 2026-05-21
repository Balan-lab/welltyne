import { useEffect, useState } from "react";

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 800);
    const t2 = setTimeout(() => setPhase("exit"), 2200);
    const t3 = setTimeout(() => onDone(), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0D1B2E",
        transition: "opacity 0.6s ease",
        opacity: phase === "exit" ? 0 : 1,
        pointerEvents: phase === "exit" ? "none" : "all",
      }}
    >
      {/* Radial glow behind logo */}
      <div style={{
        position: "absolute",
        width: 400,
        height: 400,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(13,125,107,0.35) 0%, transparent 70%)",
        transition: "transform 1.2s ease, opacity 1.2s ease",
        transform: phase === "enter" ? "scale(0.6)" : "scale(1)",
        opacity: phase === "enter" ? 0 : 1,
      }} />

      {/* Logo */}
      <div style={{
        position: "relative",
        transition: "transform 0.8s cubic-bezier(0.34,1.56,0.64,1), opacity 0.8s ease",
        transform: phase === "enter" ? "scale(0.7) translateY(20px)" : "scale(1) translateY(0)",
        opacity: phase === "enter" ? 0 : 1,
      }}>
        <img
          src="/src/assets/logo-splash.png"
          alt="Welltyne"
          style={{ width: 380, height: "auto", filter: "drop-shadow(0 0 40px rgba(13,125,107,0.6)) brightness(1.15)" }}
        />
      </div>
      
      {/* Subtle loading bar */}
      <div style={{
        position: "absolute",
        bottom: 48,
        width: 120,
        height: 2,
        borderRadius: 2,
        background: "rgba(255,255,255,0.06)",
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          borderRadius: 2,
          background: "linear-gradient(90deg, #0D7D6B, #22d3ee)",
          transition: "width 1.8s ease 0.3s",
          width: phase === "enter" ? "0%" : "100%",
        }} />
      </div>
    </div>
  );
}