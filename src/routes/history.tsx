// ============================================================
// FILE: src/routes/history.tsx  — replace existing file
// ============================================================
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppNav } from "@/components/AppNav";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, TrendingDown, TrendingUp, Minus, ArrowRight, FlaskConical } from "lucide-react";

export const Route = createFileRoute("/history")({ component: HistoryPage });

function DiffBadge({ bioAge, panels, index }: { bioAge: number; panels: any[]; index: number }) {
  if (index === panels.length - 1) return (
    <span className="text-xs text-slate-600">First scan</span>
  );
  const prev = panels[index + 1]?.bio_age_score;
  if (!prev) return null;
  const diff = Math.round(bioAge - Number(prev));
  if (diff < 0) return <span className="flex items-center gap-1 text-xs text-emerald-400"><TrendingDown className="h-3 w-3" />{Math.abs(diff)} yrs younger</span>;
  if (diff > 0) return <span className="flex items-center gap-1 text-xs text-rose-400"><TrendingUp className="h-3 w-3" />+{diff} yrs</span>;
  return <span className="flex items-center gap-1 text-xs text-amber-400"><Minus className="h-3 w-3" />No change</span>;
}

function HistoryPage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [rows, setRows] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => { if (!loading && !user) nav({ to: "/auth" }); }, [user, loading, nav]);

  useEffect(() => {
    if (!user) return;
    supabase.from("panels").select("id, created_at, bio_age_score")
      .order("created_at", { ascending: false })
      .then(({ data }) => { setRows(data ?? []); setFetching(false); });
  }, [user]);

  const best = rows.length > 0 ? Math.min(...rows.map(r => Number(r.bio_age_score)).filter(Boolean)) : null;
  const latest = rows[0]?.bio_age_score ? Math.round(Number(rows[0].bio_age_score)) : null;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #060d1a 0%, #0a1628 100%)" }}>
      <AppNav />
      <main className="container mx-auto max-w-3xl px-4 py-10">

        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-teal-400">Panel History</div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Your Results</h1>
            <p className="mt-1 text-slate-500 text-sm">Track how your biological age changes over time.</p>
          </div>
          <Link to="/panel">
            <Button className="gap-2 font-semibold" style={{ background: "linear-gradient(135deg, #0D7D6B, #0891b2)" }}>
              <Plus className="h-4 w-4" /> New Panel
            </Button>
          </Link>
        </div>

        {/* Summary stats */}
        {rows.length > 0 && (
          <div className="mb-6 grid grid-cols-3 gap-4">
            {[
              { label: "Total Scans", value: String(rows.length) },
              { label: "Latest Bio Age", value: latest !== null ? String(latest) : "—" },
              { label: "Best Score", value: best !== null ? String(Math.round(best)) : "—" },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="mt-1 text-xs text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {fetching ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/3 p-16 text-center">
            <FlaskConical className="mx-auto mb-4 h-10 w-10 text-slate-700" />
            <p className="text-slate-500 mb-4">No panels submitted yet.</p>
            <Link to="/panel">
              <Button style={{ background: "linear-gradient(135deg, #0D7D6B, #0891b2)" }}>
                Enter Your First Panel
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <div className="border-b border-white/10 px-5 py-4">
              <div className="grid grid-cols-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                <span>Date</span>
                <span className="text-center">Bio Age</span>
                <span className="text-center">Change</span>
                <span className="text-right">Report</span>
              </div>
            </div>
            <div className="divide-y divide-white/5">
              {rows.map((r, i) => {
                const bioAge = r.bio_age_score ? Math.round(Number(r.bio_age_score)) : null;
                return (
                  <div key={r.id} className="grid grid-cols-4 items-center px-5 py-4 hover:bg-white/3 transition-colors">
                    <div>
                      <div className="text-sm text-white font-medium">
                        {new Date(r.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        {new Date(r.created_at).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    <div className="text-center">
                      {bioAge !== null ? (
                        <span className="text-lg font-bold text-white tabular-nums">{bioAge}</span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </div>
                    <div className="flex justify-center">
                      {bioAge !== null && <DiffBadge bioAge={bioAge} panels={rows} index={i} />}
                    </div>
                    <div className="flex justify-end">
                      <Link to="/results/$panelId" params={{ panelId: r.id }}>
                        <Button variant="outline" size="sm" className="gap-1.5 border-white/15 text-slate-400 hover:bg-white/10 hover:text-white text-xs">
                          View <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
