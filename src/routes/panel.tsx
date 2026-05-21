import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AppNav } from "@/components/AppNav";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { BIOMARKERS } from "@/lib/biomarkers";
import { analyzePanel } from "@/lib/analyze.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, FlaskConical, Heart, Droplets, Shield, Kidney, Pill, Zap } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/panel")({ component: PanelPage });

const CATEGORIES = [
  {
    key: "metabolic",
    label: "Metabolic Health",
    icon: Zap,
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    iconBg: "bg-amber-500/15",
    keys: ["glucose", "hba1c"],
  },
  {
    key: "lipids",
    label: "Heart & Lipids",
    icon: Heart,
    color: "text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/20",
    iconBg: "bg-rose-500/15",
    keys: ["total_cholesterol", "ldl", "hdl", "triglycerides"],
  },
  {
    key: "inflammation",
    label: "Inflammation",
    icon: Shield,
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
    iconBg: "bg-orange-500/15",
    keys: ["hscrp"],
  },
  {
    key: "blood",
    label: "Blood Count",
    icon: Droplets,
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    iconBg: "bg-red-500/15",
    keys: ["hemoglobin", "wbc", "platelets"],
  },
  {
    key: "kidney",
    label: "Kidney Function",
    icon: Kidney,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    iconBg: "bg-blue-500/15",
    keys: ["creatinine", "egfr"],
  },
  {
    key: "liver",
    label: "Liver Function",
    icon: FlaskConical,
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    iconBg: "bg-purple-500/15",
    keys: ["alt", "ast", "albumin"],
  },
  {
    key: "hormones",
    label: "Hormones & Thyroid",
    icon: Zap,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
    iconBg: "bg-cyan-500/15",
    keys: ["tsh"],
  },
  {
    key: "vitamins",
    label: "Vitamins & Minerals",
    icon: Pill,
    color: "text-teal-400",
    bg: "bg-teal-500/10 border-teal-500/20",
    iconBg: "bg-teal-500/15",
    keys: ["vitamin_d", "vitamin_b12", "ferritin", "uric_acid"],
  },
];

function PanelPage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const analyze = useServerFn(analyzePanel);
  const [values, setValues] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (!loading && !user) nav({ to: "/auth" }); }, [user, loading, nav]);

  const filled = Object.values(values).filter(v => v !== "").length;
  const total = BIOMARKERS.length;
  const pct = Math.round((filled / total) * 100);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    try {
      const numeric: Record<string, number> = {};
      for (const b of BIOMARKERS) {
        const v = parseFloat(values[b.key]);
        if (!isNaN(v)) numeric[b.key] = v;
      }
      const { data: panel, error } = await supabase.from("panels")
        .insert({ user_id: user.id, ...numeric }).select().single();
      if (error || !panel) throw error ?? new Error("Failed to save");

      const { data: profile } = await supabase.from("profiles").select("dob, sex, exercise, smoker, sleep_hours").maybeSingle();
      const age = profile?.dob ? Math.floor((Date.now() - new Date(profile.dob).getTime()) / 31557600000) : null;

      await analyze({
        data: {
          panelId: panel.id,
          biomarkers: numeric,
          profile: {
            age, sex: profile?.sex ?? null, exercise: profile?.exercise ?? null,
            smoker: profile?.smoker ?? null, sleep_hours: profile?.sleep_hours ?? null,
          },
        },
      });
      nav({ to: "/results/$panelId", params: { panelId: panel.id } });
    } catch (err: any) {
      toast.error(err?.message ?? "Analysis temporarily unavailable. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #060d1a 0%, #0a1628 100%)" }}>
      <AppNav />
      <main className="container mx-auto max-w-3xl px-4 py-10">

        {/* Page header */}
        <div className="mb-8">
          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-teal-400">Blood Panel Input</div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Enter Your Blood Test Results</h1>
          <p className="mt-2 text-slate-400">Copy values from your most recent lab report. You can leave fields blank if a marker wasn't tested.</p>
        </div>

        {/* Progress */}
        <div className="mb-8 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-slate-400">Fields completed</span>
            <span className="font-semibold text-teal-400">{filled} / {total}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, background: "linear-gradient(90deg, #0D7D6B, #22d3ee)" }}
            />
          </div>
        </div>

        <form onSubmit={submit} className="space-y-6">
          {CATEGORIES.map(cat => {
            const catBiomarkers = BIOMARKERS.filter(b => cat.keys.includes(b.key));
            const Icon = cat.icon;
            return (
              <div key={cat.key} className={`rounded-2xl border p-6 ${cat.bg}`}>
                <div className="mb-5 flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${cat.iconBg}`}>
                    <Icon className={`h-5 w-5 ${cat.color}`} />
                  </div>
                  <h2 className={`font-semibold ${cat.color}`}>{cat.label}</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {catBiomarkers.map(b => (
                    <div key={b.key}>
                      <Label className="text-slate-300 text-sm">{b.label}</Label>
                      <div className="relative mt-1.5">
                        <Input
                          type="number"
                          step="any"
                          inputMode="decimal"
                          value={values[b.key] ?? ""}
                          onChange={e => setValues(v => ({ ...v, [b.key]: e.target.value }))}
                          placeholder="—"
                          className="pr-20 border-white/15 bg-white/8 text-white placeholder:text-slate-600 focus:border-teal-500/50 focus:ring-teal-500/20"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">{b.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="pt-2">
            <Button
              type="submit"
              disabled={busy || filled === 0}
              className="w-full h-13 text-base font-semibold shadow-lg shadow-teal-500/20 disabled:opacity-40"
              style={{ background: busy || filled === 0 ? undefined : "linear-gradient(135deg, #0D7D6B, #0891b2)" }}
            >
              {busy ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analysing your panel…</>
              ) : (
                "Analyse My Results"
              )}
            </Button>
            <p className="mt-3 text-center text-xs text-slate-600">
              Analysis typically takes 15–30 seconds · Results are not medical advice
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
