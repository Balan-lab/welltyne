import { createFileRoute, Link } from "@tanstack/react-router";
import { AppNav } from "@/components/AppNav";
import { Button } from "@/components/ui/button";
import { Activity, FileUp, Sparkles, ShieldCheck, ArrowRight, FlaskConical, Zap, Users } from "lucide-react";

export const Route = createFileRoute("/")({ component: Landing });

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="mt-1 text-sm text-teal-300/70">{label}</div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, accent }: { icon: any; title: string; desc: string; accent: string }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-all duration-300 hover:border-teal-400/40 hover:bg-white/8">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${accent}`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{desc}</p>
    </div>
  );
}

function StepBadge({ n, label, sub }: { n: string; label: string; sub: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 text-sm font-bold text-navy-900 shadow-lg shadow-teal-500/25">
        {n}
      </div>
      <div>
        <div className="font-semibold text-white">{label}</div>
        <div className="mt-0.5 text-sm text-slate-400">{sub}</div>
      </div>
    </div>
  );
}

function Landing() {
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #060d1a 0%, #0a1628 50%, #071420 100%)" }}>
      <AppNav />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-24 pt-20 sm:pt-32 text-center">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[600px] w-[600px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, #0D7D6B 0%, transparent 70%)" }} />
        </div>

        <div className="relative mx-auto max-w-4xl">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-xs font-medium text-teal-300">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
            Clinically designed by a licensed Physical Therapist
          </div>

<h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white leading-[1.1]">
  Your lab report holds<br />
  <span style={{ background: "linear-gradient(90deg, #00C97A 0%, #0aada0 30%, #0284c7 60%, #2563eb 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
    more than numbers.
  </span>
</h1>
<p className="mt-6 text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
  Most people leave without context — or a plan.
</p>
<p className="mt-4 text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
  Welltyne translates your bloodwork into your biological age and gives you a focused 7-point action plan tailored to your results.
</p>
<div className="mt-6 flex items-center justify-center gap-6">
  <div className="text-center">
    <div className="text-sm font-semibold text-teal-400">Clinical Precision.</div>
  </div>
  <div className="w-px h-5 bg-white/20" />
  <div className="text-center">
    <div className="text-sm font-semibold text-teal-400">Clear, Human Insight.</div>
  </div>
</div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth">
              <Button size="lg" className="h-13 px-8 text-base font-semibold shadow-lg shadow-teal-500/20" style={{ background: "linear-gradient(135deg, #0D7D6B, #0891b2)" }}>
                Analyse My Blood Panel
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            </div>

          {/* Trust line */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-teal-500" />
            Health data encrypted &amp; never sold · Educational use only
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="mx-4 mb-20 rounded-2xl border border-white/10 bg-white/5 py-8 backdrop-blur sm:mx-auto sm:max-w-3xl">
        <div className="grid grid-cols-3 divide-x divide-white/10">
          <StatCard value="20+" label="Biomarkers analysed" />
          <StatCard value="7" label="Point action plan" />
          <StatCard value="PT-designed" label="Functional assessment" />
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-4 pb-24">
        <div className="mb-12 text-center">
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-teal-400">How It Works</div>
          <h2 className="text-3xl font-bold text-white">Your blood. Your age. Your plan.</h2>
          <p className="mt-3 text-slate-400 max-w-xl mx-auto">Three steps from lab report to personalised longevity protocol.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          <FeatureCard
            icon={FileUp}
            title="Enter Your Blood Panel"
            desc="Input values from your most recent lab report — 20 longevity-relevant biomarkers across metabolic, immune, hormonal and organ health."
            accent="bg-teal-500/15 text-teal-400"
          />
          <FeatureCard
            icon={Activity}
            title="Get Your Biological Age"
            desc="See how your body is truly ageing, not just your calendar age. Our AI compares your panel to longevity-optimised ranges, not standard lab normals."
            accent="bg-cyan-500/15 text-cyan-400"
          />
          <FeatureCard
            icon={Sparkles}
            title="Receive Your Action Plan"
            desc="A personalised 7-point protocol — movement, nutrition, sleep, recovery — designed by our Physical Therapist and powered by your specific results."
            accent="bg-blue-500/15 text-blue-400"
          />
        </div>
      </section>

      {/* How it works steps */}
      <section className="mx-auto max-w-3xl px-4 pb-24">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <div className="mb-8 text-xs font-semibold uppercase tracking-widest text-teal-400">Step by Step</div>
          <div className="space-y-7">
            <StepBadge n="1" label="Create your free account" sub="Sign up in 30 seconds — just email and password." />
            <StepBadge n="2" label="Complete your profile" sub="Age, sex, lifestyle habits — takes 2 minutes and personalises your results." />
            <StepBadge n="3" label="Enter your blood test values" sub="Copy the numbers from your lab report into our 20-biomarker form." />
            <StepBadge n="4" label="Receive your biological age" sub="Instant AI-powered analysis with your score, biomarker breakdown, and full action plan." />
          </div>
        </div>
      </section>

      {/* PT callout */}
      <section className="mx-4 mb-24 overflow-hidden rounded-2xl sm:mx-auto sm:max-w-5xl" style={{ background: "linear-gradient(135deg, #0D7D6B20, #0891b220)" }}>
        <div className="flex flex-col sm:flex-row items-center gap-8 p-8 sm:p-10 border border-teal-500/20 rounded-2xl">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-teal-500/15">
            <Users className="h-10 w-10 text-teal-400" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-2">Clinical Expertise</div>
            <h3 className="text-xl font-bold text-white">Designed by a Physical Therapist</h3>
            <p className="mt-2 text-slate-400 leading-relaxed">
              Welltyne's action plans and functional assessments are designed by a licensed PT — not just algorithms. Every recommendation is clinically reviewed before it reaches you.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-28 text-center">
        <h2 className="text-3xl font-bold text-white">Ready to know your biological age?</h2>
        <p className="mt-3 text-slate-400">Takes 5 minutes. Your first analysis is free.</p>
        <Link to="/auth" className="mt-8 inline-block">
          <Button size="lg" className="h-13 px-10 text-base font-semibold shadow-xl shadow-teal-500/20" style={{ background: "linear-gradient(135deg, #0D7D6B, #0891b2)" }}>
            Get Started Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} Welltyne · welltyne.com · Educational use only — not medical advice.
      </footer>
    </div>
  );
}
