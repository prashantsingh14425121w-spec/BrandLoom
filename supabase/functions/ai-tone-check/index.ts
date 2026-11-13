const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CandidateFinding {
  matched: string;
  reason: string;
  fix: string;
  severity: "low" | "medium";
  type: "filler" | "hyperbole" | "hedging";
}

// Brand voice rules that the verifier checks each candidate against
const VERIFIER_RULES: { type: CandidateFinding["type"]; test: RegExp }[] = [
  { type: "filler", test: /\b(very|really|so)\s+\w/i },
  { type: "hyperbole", test: /\b(amazing|incredible|awesome|stunning|unbelievable|phenomenal)\b/i },
  { type: "hedging", test: /\b(just|just about|pretty much|more or less|kind of|sort of)\b/i },
];

// Pass 1: detect candidate tone issues
function detectCandidates(text: string): CandidateFinding[] {
  const candidates: CandidateFinding[] = [];
  const patterns: { regex: RegExp; reason: string; fix: (m: string) => string; severity: "low" | "medium"; type: CandidateFinding["type"] }[] = [
    { regex: /\b(very\s+\w+)/gi, reason: "The word 'very' weakens copy. A stronger adjective is more confident and plain.", fix: (m) => m.replace(/very\s+/i, ""), severity: "low", type: "filler" },
    { regex: /\b(really\s+\w+)/gi, reason: "The word 'really' is a filler intensifier. Our voice is confident without it.", fix: (m) => m.replace(/really\s+/i, ""), severity: "low", type: "filler" },
    { regex: /\b(just\s+\w+)/gi, reason: "The word 'just' hedges the statement. Consider removing it for a more confident tone.", fix: (m) => m.replace(/just\s+/i, ""), severity: "low", type: "hedging" },
    { regex: /\bso\s+(?:good|great|amazing|fast|light|warm|strong|comfortable)\b/gi, reason: "'So' as an intensifier is informal and off-brand for public copy.", fix: (m) => m.replace(/so\s+/i, ""), severity: "low", type: "filler" },
    { regex: /\b(amazing|incredible|awesome|stunning|unbelievable|phenomenal)\b/gi, reason: "Hyperbolic adjectives are off-brand. Our voice is confident and plain, not sensational.", fix: () => "excellent", severity: "medium", type: "hyperbole" },
    { regex: /\b(just about|pretty much|more or less|kind of|sort of)\b/gi, reason: "Vague qualifiers undermine precision. Our voice is confident and specific.", fix: () => "", severity: "medium", type: "hedging" },
  ];

  for (const p of patterns) {
    for (const match of text.matchAll(p.regex)) {
      candidates.push({
        matched: match[0],
        reason: p.reason,
        fix: p.fix(match[0]),
        severity: p.severity,
        type: p.type,
      });
    }
  }

  return candidates;
}

// Pass 2: verifier — confirm each candidate violates a brand voice rule
function verifyFindings(candidates: CandidateFinding[], audience: string): CandidateFinding[] {
  return candidates
    .map((candidate) => {
      const rule = VERIFIER_RULES.find((r) => r.type === candidate.type);
      if (!rule) return null;

      const isVerified = rule.test.test(candidate.matched);
      if (!isVerified) return null;

      // For internal audience, downgrade filler/hedging — they're acceptable internally
      if (audience === "Internal team" && (candidate.type === "filler" || candidate.type === "hedging")) {
        return null;
      }

      return candidate;
    })
    .filter((f): f is CandidateFinding => f !== null);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const text: string = body.text;
    const audience: string = body.audience ?? "General public";

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return new Response(JSON.stringify({ findings: [], candidates: 0, verified: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Pass 1: detect
    const candidates = detectCandidates(text);

    // Pass 2: verify against brand voice rules
    const verified = verifyFindings(candidates, audience);

    const output = verified.map((f) => ({
      category: "Tone" as const,
      severity: f.severity,
      status: "suggested-fix" as const,
      confidence: "Medium" as const,
      matched: f.matched,
      reason: `${f.reason} (Audience: ${audience}, Verified: true)`,
      fix: f.fix,
    }));

    return new Response(JSON.stringify({
      findings: output,
      candidates: candidates.length,
      verified: verified.length,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
