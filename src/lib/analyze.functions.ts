import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const BiomarkerSchema = z.record(z.string(), z.number());
const InputSchema = z.object({
  panelId: z.string().uuid(),
  biomarkers: BiomarkerSchema,
  profile: z.object({
    age: z.number().nullable(),
    sex: z.string().nullable(),
    exercise: z.string().nullable(),
    smoker: z.string().nullable(),
    sleep_hours: z.string().nullable(),
  }),
});

const SYSTEM = `You are a longevity-focused clinical analyst. The user has submitted their blood panel results. Based on these values and their profile, do three things:
1. Estimate their biological age as a single number. Be specific — give a number, not a range.
2. For each biomarker, classify it as Optimal, Monitor, or Action Needed based on longevity-optimised reference ranges, not just standard lab normals.
3. Generate a 7-point personalised action plan. Each point should have a short title and 2 sentences of specific, actionable advice tied directly to their results.
Return your response as JSON in this exact format:
{ "bio_age": number, "biomarker_status": [{ "name": string, "status": "Optimal"|"Monitor"|"Action Needed" }], "action_plan": [{ "title": string, "advice": string }] }`;

export const analyzePanel = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data, context }) => {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) throw new Error("Analysis temporarily unavailable. Please try again.");

    const userMsg = `User profile:\n${JSON.stringify(data.profile, null, 2)}\n\nBlood panel results:\n${JSON.stringify(data.biomarkers, null, 2)}\n\nReturn ONLY valid JSON, no markdown.`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        system: SYSTEM,
        messages: [{ role: "user", content: userMsg }],
      }),
    });

    if (!res.ok) {
      console.error("Anthropic error", res.status, await res.text());
      throw new Error("Analysis temporarily unavailable. Please try again.");
    }
    const json = await res.json() as any;
    const text: string = json?.content?.[0]?.text ?? "";
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Analysis temporarily unavailable. Please try again.");

    let parsed: any;
    try { parsed = JSON.parse(match[0]); }
    catch { throw new Error("Analysis temporarily unavailable. Please try again."); }

    const { supabase, userId } = context;
    await supabase.from("panels").update({
      bio_age_score: parsed.bio_age,
      biomarker_status: parsed.biomarker_status,
    }).eq("id", data.panelId).eq("user_id", userId);

    await supabase.from("action_plans").insert({
      panel_id: data.panelId, user_id: userId, plan_json: parsed.action_plan,
    });

    return parsed as {
      bio_age: number;
      biomarker_status: { name: string; status: string }[];
      action_plan: { title: string; advice: string }[];
    };
  });
