import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppNav } from "@/components/AppNav";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { BIOMARKERS } from "@/lib/biomarkers";
import { analyzePanel } from "@/lib/analyze.functions";
import { Loader2, Sparkles, ArrowRight, TrendingUp, TrendingDown, Minus, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/results/$panelId")({ component: ResultsPage });

type PlanItem = { title: string; advice: string };
type StatusItem = { name: string; status: string };

const STATUS_CONFIG = {
  Optimal: {
    label: "Optimal",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    dot: "bg-emerald-400",
    bar: "#10b981",
  },
  Monitor: {
    label: "Monitor",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    dot: "bg-amber-400",
    bar: "#f59e0b",
  },
  "Action Needed": {
    label: "Action Needed",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    dot: "bg-rose-400",
    bar: "#f43f5e",
  },
};

const ACTION_ICONS = ["🏃", "🥗", "😴", "🧘", "💊", "💧", "🩺"];

function BiologicalAgeGauge({ bioAge, chronoAge }: { bioAge: number; chronoAge: number | null }) {
  const diff = chronoAge !== null ? bioAge - chronoAge : null;
  const isYounger = diff !== null && diff < 0;
  const isOlder = diff !== null && diff > 0;

  const gaugeColor = isYounger ? "#10b981" : isOlder ? "#f43f5e" : "#f59e0b";
  const glowColor = isYounger ? "rgba(16,185,129,0.25)" : isOlder ? "rgba(244,63,94,0.25)" : "rgba(245,158,11,0.25)";

  // Arc: 75% of circle, starting from bottom-left
  const r = 80;
  const circumference = 2 * Math.PI * r;
  const arcLen = circumference * 0.75;
  // Clamp age to 20–100 for display purposes
  const pct = Math.min(Math.max((bioAge - 20) / 80, 0), 1);
  const fillLen = arcLen * pct;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 200, height: 200 }}>
        {/* Glow */}
        <div
          className="absolute inset-0 rounded-full transition-all duration-700"
          style={{ boxShadow: `0 0 60px 10px ${glowColor}`, opacity: 0.6 }}
        />
        <svg viewBox="0 0 200 200" className="h-full w-full" style={{ transform: "rotate(135deg)" }}>
          {/* Track */}
          <circle cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="14"
            strokeDasharray={`${arcLen} ${circumference}`} strokeLinecap="round" />
          {/* Fill */}
          <circle cx="100" cy="100" r={r} fill="none" stroke={gaugeColor} strokeWidth="14"
            strokeDasharray={`${fillLen} ${circumference}`} strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${gaugeColor})`, transition: "stroke-dasharray 1s ease" }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-6xl font-bold tabular-nums text-white" style={{ textShadow: `0 0 30px ${gaugeColor}` }}>
            {bioAge}
          </div>
          <div className="mt-1 text-xs font-medium text-slate-400 uppercase tracking-wider">biological age</div>
        </div>
      </div>

      {/* Diff badge */}
      {diff !== null && (
        <div className={`mt-4 flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold border ${
          isYounger ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
          isOlder ? "bg-rose-500/10 border-rose-500/30 text-rose-400" :
          "bg-amber-500/10 border-amber-500/30 text-amber-400"
        }`}>
          {isYounger ? <TrendingDown className="h-4 w-4" /> : isOlder ? <TrendingUp className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
          {isYounger
            ? `${Math.abs(diff)} years younger than your age`
            : isOlder
            ? `${diff} years older than your age`
            : "Right on your chronological age"}
        </div>
      )}
      {chronoAge && (
        <p className="mt-2 text-xs text-slate-600">Chronological age: {chronoAge}</p>
      )}
    </div>
  );
}

function ResultsPage() {
  const { panelId } = Route.useParams();
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [panel, setPanel] = useState<any>(null);
  const [plan, setPlan] = useState<PlanItem[]>([]);
  const [chronoAge, setChronoAge] = useState<number | null>(null);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState<"biomarkers" | "plan">("biomarkers");

  useEffect(() => { if (!loading && !user) nav({ to: "/auth" }); }, [user, loading, nav]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: p } = await supabase.from("panels").select("*").eq("id", panelId).maybeSingle();
      setPanel(p);
      const { data: ap } = await supabase.from("action_plans").select("plan_json").eq("panel_id", panelId).order("created_at", { ascending: false }).limit(1).maybeSingle();
      if (ap?.plan_json) setPlan(ap.plan_json as PlanItem[]);
      const { data: profile } = await supabase.from("profiles").select("dob").maybeSingle();
      if (profile?.dob) setChronoAge(Math.floor((Date.now() - new Date(profile.dob).getTime()) / 31557600000));
      setFetching(false);
    })();
  }, [user, panelId]);

  if (fetching) return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #060d1a 0%, #0a1628 100%)" }}>
      <AppNav />
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-teal-400" />
        <p className="text-slate-400 text-sm">Loading your results…</p>
      </div>
    </div>
  );

  if (!panel) return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #060d1a 0%, #0a1628 100%)" }}>
      <AppNav />
      <p className="text-center py-24 text-slate-500">Panel not found.</p>
    </div>
  );

  const bioAge = panel.bio_age_score ? Math.round(Number(panel.bio_age_score)) : null;
  const statuses: StatusItem[] = (panel.biomarker_status as StatusItem[]) ?? [];
  const findStatus = (label: string) => statuses.find(s => s.name?.toLowerCase().includes(label.toLowerCase().split(" ")[0]))?.status as keyof typeof STATUS_CONFIG | undefined;

  const optimalCount = statuses.filter(s => s.status === "Optimal").length;
  const monitorCount = statuses.filter(s => s.status === "Monitor").length;
  const actionCount = statuses.filter(s => s.status === "Action Needed").length;

  return (
    <div className="min-h-screen pb-16" style={{ background: "linear-gradient(135deg, #060d1a 0%, #0a1628 100%)" }}>
      <AppNav />
      <main className="container mx-auto max-w-4xl px-4 py-10 space-y-8">

        {/* Hero score card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur text-center">
          {/* Background radial glow */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30">
            <div className="h-64 w-64 rounded-full" style={{ background: "radial-gradient(circle, #0D7D6B 0%, transparent 70%)" }} />
          </div>

          <div className="relative">
            <div className="mb-6 text-xs font-semibold uppercase tracking-widest text-teal-400">Your Results</div>
            {bioAge !== null ? (
              <BiologicalAgeGauge bioAge={bioAge} chronoAge={chronoAge} />
            ) : (
              <p className="text-slate-400">Score unavailable</p>
            )}

            {/* Quick summary stats */}
            <div className="mt-8 grid grid-cols-3 divide-x divide-white/10 rounded-xl border border-white/10 bg-white/5">
              <div className="py-4 text-center">
                <div className="text-2xl font-bold text-emerald-400">{optimalCount}</div>
                <div className="mt-1 text-xs text-slate-500">Optimal</div>
              </div>
              <div className="py-4 text-center">
                <div className="text-2xl font-bold text-amber-400">{monitorCount}</div>
                <div className="mt-1 text-xs text-slate-500">Monitor</div>
              </div>
              <div className="py-4 text-center">
                <div className="text-2xl font-bold text-rose-400">{actionCount}</div>
                <div className="mt-1 text-xs text-slate-500">Action Needed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 rounded-xl border border-white/10 bg-white/5 p-1">
          {(["biomarkers", "plan"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                activeTab === tab
                  ? "text-white shadow"
                  : "text-slate-500 hover:text-slate-300"
              }`}
              style={activeTab === tab ? { background: "linear-gradient(135deg, #0D7D6B, #0891b2)" } : {}}
            >
              {tab === "biomarkers" ? "Biomarker Breakdown" : "7-Point Action Plan"}
            </button>
          ))}
        </div>

        {/* Biomarkers tab */}
        {activeTab === "biomarkers" && (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <div className="px-5 py-4 border-b border-white/10">
              <h2 className="font-semibold text-white">All Biomarkers</h2>
              <p className="text-xs text-slate-500 mt-0.5">Assessed against longevity-optimised ranges, not standard lab normals</p>
            </div>
            <div className="divide-y divide-white/5">
              {BIOMARKERS.map(b => {
                const status = findStatus(b.label);
                const cfg = status ? STATUS_CONFIG[status] : null;
                return (
                  <div key={b.key} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/3 transition-colors">
                    {/* Status dot */}
                    <div className={`h-2 w-2 shrink-0 rounded-full ${cfg?.dot ?? "bg-slate-600"}`} />
                    {/* Name */}
                    <span className="flex-1 text-sm text-slate-300">{b.label}</span>
                    {/* Value */}
                    <span className="text-sm tabular-nums font-medium text-white">
                      {panel[b.key] !== null && panel[b.key] !== undefined ? panel[b.key] : "—"}
                      {panel[b.key] !== null && panel[b.key] !== undefined && <span className="ml-1 text-xs text-slate-500">{b.unit}</span>}
                    </span>
                    {/* Badge */}
                    {cfg ? (
                      <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                        {cfg.label}
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-slate-600">
                        Not entered
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action plan tab */}
        {activeTab === "plan" && (
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-teal-400" />
              <h2 className="font-semibold text-white">Your Personalised Action Plan</h2>
            </div>
            {plan.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-500">
                Action plan not available for this panel.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {plan.map((p, i) => (
                  <div key={i} className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-5 transition-all hover:border-teal-500/30 hover:bg-white/8">
                    <div className="absolute top-0 left-0 h-1 w-full" style={{ background: `linear-gradient(90deg, #0D7D6B, transparent)` }} />
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/8 text-lg">
                        {ACTION_ICONS[i] ?? "✦"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-teal-400">{String(i + 1).padStart(2, "0")}</span>
                          <h3 className="font-semibold text-white text-sm">{p.title}</h3>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">{p.advice}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <Link to="/panel">
            <Button variant="outline" className="border-white/15 text-slate-300 hover:bg-white/10 hover:text-white gap-2">
              <RotateCcw className="h-4 w-4" />
              New Panel
            </Button>
          </Link>
          <Link to="/history">
            <Button className="gap-2" style={{ background: "linear-gradient(135deg, #0D7D6B, #0891b2)" }}>
              View History
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-slate-700 pt-2">
          This analysis is for educational purposes only and does not constitute medical advice. Always consult a qualified healthcare professional.
        </p>
      </main>
    </div>
  );
}
