// ============================================================
// FILE: src/routes/auth.tsx  — replace existing file
// ============================================================
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { WelltyneLogo } from "@/components/WelltyneLogo";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/auth")({ component: AuthPage });

function AuthPage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) routeAfterAuth();
  }, [user, loading]);

  async function routeAfterAuth() {
    const { data } = await supabase.from("profiles").select("onboarded").maybeSingle();
    nav({ to: data?.onboarded ? "/panel" : "/onboarding" });
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/auth` },
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Check your email to confirm your account, then sign in.");
  }

  async function signIn(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast.error(error.message);
  }

  async function google() {
    setBusy(true);
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (r.error) { setBusy(false); toast.error("Google sign in failed"); }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "linear-gradient(135deg, #060d1a 0%, #0a1628 100%)" }}>
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-20">
        <div className="h-[500px] w-[500px] rounded-full" style={{ background: "radial-gradient(circle, #0D7D6B 0%, transparent 70%)" }} />
      </div>

      <Link to="/" className="relative mb-8 flex flex-col items-center gap-3">
        <WelltyneLogo size={44} />
        <span className="text-xs font-semibold uppercase tracking-widest text-teal-400">welltyne.com</span>
      </Link>

      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <h1 className="mb-1 text-center text-xl font-bold text-white">Welcome to Welltyne</h1>
        <p className="mb-6 text-center text-sm text-slate-500">Know your biological age. Extend your healthspan.</p>

        <Tabs defaultValue="signin">
          <TabsList className="grid grid-cols-2 w-full mb-6 bg-white/5 border border-white/10">
            <TabsTrigger value="signin" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-slate-400">Sign in</TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-slate-400">Create account</TabsTrigger>
          </TabsList>

          <Button type="button" variant="outline" className="w-full mb-4 border-white/15 text-slate-300 hover:bg-white/10 hover:text-white" onClick={google} disabled={busy}>
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M21.35 11.1h-9.17v2.92h5.27c-.23 1.49-1.74 4.37-5.27 4.37-3.17 0-5.76-2.62-5.76-5.86s2.59-5.86 5.76-5.86c1.81 0 3.02.77 3.71 1.43l2.53-2.44C16.86 3.91 14.74 3 12.18 3 6.93 3 2.7 7.23 2.7 12.48S6.93 21.96 12.18 21.96c7.04 0 9.36-4.93 9.36-7.46 0-.5-.05-.88-.19-1.4z" />
            </svg>
            Continue with Google
          </Button>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
            <span className="relative flex justify-center text-xs"><span className="bg-transparent px-2 text-slate-600">or continue with email</span></span>
          </div>

          <TabsContent value="signin">
            <form onSubmit={signIn} className="space-y-4">
              <div>
                <Label className="text-slate-300">Email</Label>
                <Input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="mt-1.5 border-white/15 bg-white/8 text-white placeholder:text-slate-600 focus:border-teal-500/50" />
              </div>
              <div>
                <Label className="text-slate-300">Password</Label>
                <Input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  className="mt-1.5 border-white/15 bg-white/8 text-white placeholder:text-slate-600 focus:border-teal-500/50" />
              </div>
              <Button type="submit" className="w-full font-semibold" disabled={busy}
                style={{ background: "linear-gradient(135deg, #0D7D6B, #0891b2)" }}>
                Sign in
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={signUp} className="space-y-4">
              <div>
                <Label className="text-slate-300">Email</Label>
                <Input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="mt-1.5 border-white/15 bg-white/8 text-white placeholder:text-slate-600 focus:border-teal-500/50" />
              </div>
              <div>
                <Label className="text-slate-300">Password</Label>
                <Input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)}
                  className="mt-1.5 border-white/15 bg-white/8 text-white placeholder:text-slate-600 focus:border-teal-500/50" />
              </div>
              <Button type="submit" className="w-full font-semibold" disabled={busy}
                style={{ background: "linear-gradient(135deg, #0D7D6B, #0891b2)" }}>
                Create account
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-600">
          <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
          Health data encrypted · Never sold · Not medical advice
        </div>
      </div>
    </div>
  );
}
