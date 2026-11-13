import type { Audience, Finding } from '@/types';

interface ToneFindingResponse {
  category: 'Tone';
  severity: 'low' | 'medium';
  status: 'suggested-fix';
  confidence: 'Medium';
  matched: string;
  reason: string;
  fix: string;
}

interface ToneCheckResponse {
  findings: ToneFindingResponse[];
  error?: string;
}

export async function fetchAiToneFindings(text: string, audience: Audience): Promise<Finding[]> {
  if (text.trim().length === 0) return [];

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) return [];

  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/ai-tone-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ text, audience }),
    });

    if (!response.ok) return [];

    const data: ToneCheckResponse = await response.json();
    if (data.error || !Array.isArray(data.findings)) return [];

    return data.findings.map((item, index) => {
      const start = text.indexOf(item.matched);
      const end = start >= 0 ? start + item.matched.length : 0;
      return {
        id: `ai-tone-${index}-${start >= 0 ? start : 0}`,
        ruleId: 'ai-tone-check',
        category: 'Tone',
        severity: item.severity,
        status: 'suggested-fix',
        confidence: item.confidence,
        start: start >= 0 ? start : 0,
        end,
        matched: item.matched,
        reason: item.reason.replace(/\s*\(Audience:[^)]*Verified: true\)\s*$/, ''),
        sourceId: 'G-03',
        quote: 'Avoid filler intensifiers, exaggerated adjectives and hedging language. Prefer specific, confident wording that tells the reader what is true.',
        fix: item.fix,
        dismissKey: `ai-tone|${item.matched}|${text.slice(Math.max(0, (start >= 0 ? start : 0) - 24), end + 24)}`,
      };
    });
  } catch {
    return [];
  }
}
