import type { Audience, Category, Confidence, Finding, FindingStatus, Severity, SourceChunk } from '@/types';

interface Verdict {
  category: Category;
  severity: Severity;
  status: FindingStatus;
  confidence: Confidence;
  reason: string;
  sourceId: string;
  quote: string;
  fix: ((matched: string) => string) | null;
}

interface Rule {
  id: string;
  pattern: RegExp;
  check: (match: RegExpMatchArray, sources: Map<string, SourceChunk>) => Verdict | null;
  audiences?: Audience[];
}

export interface ReviewResult {
  findings: Finding[];
  discarded: number;
}

const isExpired = (source: SourceChunk) =>
  Boolean(source.expires) && new Date(source.expires as string) < new Date();

function factVerdict(fact: SourceChunk, claimed: string, reason: string): Verdict | null {
  if (isExpired(fact)) {
    return {
      category: 'Facts',
      severity: 'high',
      status: 'needs-human',
      confidence: 'High',
      reason: `Approved fact ${fact.id} expired on ${fact.expires}. Confirm the current figure before publishing.`,
      sourceId: fact.id,
      quote: fact.text,
      fix: null,
    };
  }
  if (claimed === fact.value) return null;
  return {
    category: 'Facts',
    severity: 'high',
    status: 'suggested-fix',
    confidence: 'High',
    reason,
    sourceId: fact.id,
    quote: fact.text,
    fix: (matched) => matched.replace(claimed, fact.value ?? claimed),
  };
}

const TONE_AUDIENCES: Audience[] = ['General public', 'Existing customers', 'Industry / B2B'];

const RULES: Rule[] = [
  {
    id: 'terminology-waterproof',
    pattern: /\bwaterproof\b/gi,
    check: () => ({
      category: 'Terminology',
      severity: 'medium',
      status: 'suggested-fix',
      confidence: 'High',
      reason: "Our guideline asks for 'water-resistant' on shell jackets, because no garment stays dry in sustained heavy rain.",
      sourceId: 'T-01',
      quote: "Use 'water-resistant', not 'waterproof', for shell jackets.",
      fix: (matched) => (matched[0] === matched[0].toUpperCase() ? 'Water-resistant' : 'water-resistant'),
    }),
  },
  {
    id: 'terminology-trailpack',
    pattern: /\btrail packs?\b/gi,
    check: () => ({
      category: 'Terminology',
      severity: 'medium',
      status: 'suggested-fix',
      confidence: 'High',
      reason: "The product name is written as one word, 'Trailpack', with a capital T.",
      sourceId: 'T-02',
      quote: "Write the product name as 'Trailpack' (one word, capital T). Do not write 'trail pack'.",
      fix: (matched) => (matched.endsWith('s') ? 'Trailpacks' : 'Trailpack'),
    }),
  },
  {
    id: 'tone-exclamation',
    pattern: /!/g,
    audiences: TONE_AUDIENCES,
    check: () => ({
      category: 'Tone',
      severity: 'low',
      status: 'suggested-fix',
      confidence: 'High',
      reason: 'Product copy does not use exclamation marks. Our voice is confident and plain.',
      sourceId: 'G-01',
      quote: 'Avoid exclamation marks in product copy.',
      fix: () => '.',
    }),
  },
  {
    id: 'tone-all-caps',
    pattern: /\b[A-Z]{4,}\b/g,
    audiences: TONE_AUDIENCES,
    check: () => ({
      category: 'Tone',
      severity: 'low',
      status: 'suggested-fix',
      confidence: 'Medium',
      reason: 'Words in capitals are used for emphasis, which our guideline does not allow for public-facing copy.',
      sourceId: 'G-01',
      quote: 'Do not use all-caps words for emphasis.',
      fix: (matched) => matched[0] + matched.slice(1).toLowerCase(),
    }),
  },
  {
    id: 'claims-superlative',
    pattern: /\b(best|the only|number one)\b/gi,
    check: () => ({
      category: 'Claims',
      severity: 'high',
      status: 'needs-human',
      confidence: 'High',
      reason: 'No approved fact supports this superlative. A person must add evidence or remove the claim.',
      sourceId: 'G-02',
      quote: "Superlatives such as 'best', 'the only' or 'number one' need an approved fact behind them, or they must be removed.",
      fix: null,
    }),
  },
  {
    id: 'claims-absolute',
    pattern: /\b100%(?!\s+recycled)|\bguaranteed forever\b|\bguaranteed\b/gi,
    check: () => ({
      category: 'Claims',
      severity: 'high',
      status: 'needs-human',
      confidence: 'High',
      reason: 'Absolute guarantees need legal review before publication.',
      sourceId: 'G-02',
      quote: "Absolute guarantees such as '100%' or 'guaranteed forever' need legal review.",
      fix: null,
    }),
  },
  {
    id: 'facts-recycled-share',
    pattern: /\b(\d{1,3})% recycled\b/gi,
    check: (match, sources) => {
      const fact = sources.get('F-03');
      return fact ? factVerdict(fact, match[1], `Approved fact ${fact.id} says at least ${fact.value}% of the shell face fabric is recycled nylon.`) : null;
    },
  },
  {
    id: 'facts-founding-year',
    pattern: /\bfounded in (\d{4})\b/gi,
    check: (match, sources) => {
      const fact = sources.get('F-01');
      return fact ? factVerdict(fact, match[1], `Approved fact ${fact.id} gives the founding year as ${fact.value}.`) : null;
    },
  },
  {
    id: 'facts-weight',
    pattern: /\bweighs ([\d.]+) ?kg\b/gi,
    check: (match, sources) => {
      const fact = sources.get('F-02');
      return fact ? factVerdict(fact, match[1], `Approved fact ${fact.id} gives the weight as ${fact.value} kg.`) : null;
    },
  },
  {
    id: 'facts-price',
    pattern: /£(\d+)\b/g,
    check: (match, sources) => {
      const fact = sources.get('F-04');
      return fact ? factVerdict(fact, match[1], `Approved fact ${fact.id} gives the UK price as £${fact.value}.`) : null;
    },
  },
];

function isVerified(finding: Finding, content: string, sources: Map<string, SourceChunk>) {
  const source = sources.get(finding.sourceId);
  return Boolean(source?.text.includes(finding.quote)) && content.slice(finding.start, finding.end) === finding.matched;
}

export function runReview(content: string, sources: SourceChunk[], audience: Audience = 'General public'): ReviewResult {
  const byId = new Map(sources.map((source) => [source.id, source]));
  const findings: Finding[] = [];
  let discarded = 0;

  for (const rule of RULES) {
    if (rule.audiences && !rule.audiences.includes(audience)) continue;

    for (const match of content.matchAll(rule.pattern)) {
      const verdict = rule.check(match, byId);
      if (!verdict) continue;

      const start = match.index ?? 0;
      const matched = match[0];
      const end = start + matched.length;
      const finding: Finding = {
        id: `${rule.id}-${start}`,
        ruleId: rule.id,
        category: verdict.category,
        severity: verdict.severity,
        status: verdict.status,
        confidence: verdict.confidence,
        start,
        end,
        matched,
        reason: verdict.reason,
        sourceId: verdict.sourceId,
        quote: verdict.quote,
        fix: verdict.fix ? verdict.fix(matched) : null,
        dismissKey: `${rule.id}|${matched}|${content.slice(Math.max(0, start - 24), end + 24)}`,
      };

      if (isVerified(finding, content, byId)) {
        findings.push(finding);
      } else {
        discarded += 1;
      }
    }
  }

  findings.sort((a, b) => a.start - b.start);
  return { findings, discarded };
}
