import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FlaskConical, History, LogOut } from "lucide-react";

export function AppNav() {
  const { user } = useAuth();
  const nav = useNavigate();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
        background: "rgba(6,13,26,0.85)",
        height: 110,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div style={{
        width: "100%",
        maxWidth: 1150,
        margin: "0 auto",
        padding: "0 2px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        {/* Logo only — no text */}
        <Link to="/" style={{ textDecoration: "none" }}>
  <div style={{ position: "relative", display: "inline-block" }}>
    
    {/* Logo image */}
    <img
      src="/assets/logo-splash.png"
      alt="Welltyne"
      style={{
        height: 150,
        width: "auto",
        mixBlendMode: "screen",
        filter: "brightness(1.2)",
        display: "block",
      }}
    />

    {/* Animated dot overlaid on the logo */}
    <div style={{
      position: "absolute",
      top: "31%",
      left: "46.5%",
      width: 10,
      height: 10,
      borderRadius: "42%",
      background: "radial-gradient(circle, #00e5cc, #0DB8A0)",
      animation: "dotGlow 2s ease-in-out infinite",
    }} />

    <style>{`
      @keyframes dotFloat {
        0%, 100% { transform: translateY(0px); }
        50%       { transform: translateY(-4px); }
      }
      @keyframes dotGlow {
        0%, 100% { box-shadow: 0 0 5px 2px rgba(13,200,180,0.5); }
        50%       { box-shadow: 0 0 12px 5px rgba(13,200,180,0.9); }
      }
    `}</style>

  </div>
</Link>

        {/* Nav links */}
        <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {user ? (
            <>
              <Link to="/panel">
                <Button
                  variant="ghost"
                  size="sm"
                  style={{ color: "#94a3b8", gap: 6, display: "flex", alignItems: "center" }}
                >
                  <FlaskConical size={16} />
                  <span>New Panel</span>
                </Button>
              </Link>
              <Link to="/history">
                <Button
                  variant="ghost"
                  size="sm"
                  style={{ color: "#94a3b8", gap: 6, display: "flex", alignItems: "center" }}
                >
                  <History size={16} />
                  <span>History</span>
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                style={{ color: "#64748b", gap: 6, display: "flex", alignItems: "center" }}
                onClick={async () => {
                  await supabase.auth.signOut();
                  nav({ to: "/" });
                }}
              >
                <LogOut size={16} />
                <span>Sign out</span>
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button
                size="sm"
                style={{
                  background: "linear-gradient(135deg, #0D7D6B, #0891b2)",
                  fontWeight: 600,
                  padding: "0 20px",
                  height: 38,
                }}
              >
                Sign in
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
