// ============================================================
// FILE: src/routes/onboarding.tsx  — replace existing file
// ============================================================
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppNav } from "@/components/AppNav";
import { toast } from "sonner";
import { User, Calendar, Activity, Wind, Moon } from "lucide-react";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

function SectionHeader({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/15">
        <Icon className="h-4 w-4 text-teal-400" />
      </div>
      <span className="text-sm font-semibold text-teal-400">{label}</span>
    </div>
  );
}

function Onboarding() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ full_name: "", dob: "", sex: "", exercise: "", smoker: "", sleep_hours: "" });
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => { if (!loading && !user) nav({ to: "/auth" }); }, [user, loading, nav]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const { error } = await supabase.from("profiles").upsert({
      id: user.id, email: user.email, ...form, onboarded: true, updated_at: new Date().toISOString(),
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else nav({ to: "/panel" });
  }

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const step1Done = form.full_name && form.dob && form.sex;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #060d1a 0%, #0a1628 100%)" }}>
      <AppNav />
      <main className="container mx-auto max-w-lg px-4 py-12">

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500">Step {step} of 2</span>
            <span className="text-xs text-teal-400">{step === 1 ? "Personal Info" : "Lifestyle"}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: step === 1 ? "50%" : "100%", background: "linear-gradient(90deg, #0D7D6B, #22d3ee)" }} />
          </div>
        </div>

        <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-teal-400">Profile Setup</div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome to Welltyne</h1>
        <p className="text-slate-400 mb-8">Tell us a little about yourself. This personalises your biological age analysis.</p>

        <form onSubmit={submit} className="space-y-5">
          {step === 1 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-5">
              <SectionHeader icon={User} label="Personal Information" />
              <div>
                <Label className="text-slate-300">Full name</Label>
                <Input required value={form.full_name} onChange={e => set("full_name", e.target.value)}
                  placeholder="Your full name"
                  className="mt-1.5 border-white/15 bg-white/8 text-white placeholder:text-slate-600 focus:border-teal-500/50" />
              </div>
              <div>
                <Label className="text-slate-300">Date of birth</Label>
                <Input type="date" required value={form.dob} onChange={e => set("dob", e.target.value)}
                  className="mt-1.5 border-white/15 bg-white/8 text-white placeholder:text-slate-600 focus:border-teal-500/50" />
              </div>
              <div>
                <Label className="text-slate-300">Biological sex</Label>
                <Select value={form.sex} onValueChange={v => set("sex", v)}>
                  <SelectTrigger className="mt-1.5 border-white/15 bg-white/8 text-white focus:border-teal-500/50">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="button" disabled={!step1Done}
                onClick={() => setStep(2)}
                className="w-full font-semibold disabled:opacity-40"
                style={{ background: step1Done ? "linear-gradient(135deg, #0D7D6B, #0891b2)" : undefined }}>
                Continue →
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-5">
              <SectionHeader icon={Activity} label="Lifestyle Habits" />
              <div>
                <Label className="text-slate-300">How often do you exercise?</Label>
                <Select value={form.exercise} onValueChange={v => set("exercise", v)}>
                  <SelectTrigger className="mt-1.5 border-white/15 bg-white/8 text-white focus:border-teal-500/50">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Never">Never</SelectItem>
                    <SelectItem value="1-2x week">1–2x per week</SelectItem>
                    <SelectItem value="3-4x week">3–4x per week</SelectItem>
                    <SelectItem value="Daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-slate-300">Do you smoke?</Label>
                <Select value={form.smoker} onValueChange={v => set("smoker", v)}>
                  <SelectTrigger className="mt-1.5 border-white/15 bg-white/8 text-white focus:border-teal-500/50">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Former">Former smoker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-slate-300">Average sleep hours per night</Label>
                <Select value={form.sleep_hours} onValueChange={v => set("sleep_hours", v)}>
                  <SelectTrigger className="mt-1.5 border-white/15 bg-white/8 text-white focus:border-teal-500/50">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="<5">Less than 5 hours</SelectItem>
                    <SelectItem value="5-6">5–6 hours</SelectItem>
                    <SelectItem value="6-7">6–7 hours</SelectItem>
                    <SelectItem value="7-8">7–8 hours</SelectItem>
                    <SelectItem value="8+">8+ hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3 pt-1">
                <Button type="button" variant="outline" onClick={() => setStep(1)}
                  className="border-white/15 text-slate-300 hover:bg-white/10">← Back</Button>
                <Button type="submit" disabled={busy} className="flex-1 font-semibold"
                  style={{ background: "linear-gradient(135deg, #0D7D6B, #0891b2)" }}>
                  {busy ? "Saving…" : "Start My Analysis →"}
                </Button>
              </div>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
