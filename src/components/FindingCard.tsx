import { useState } from 'react';
import { TriangleAlert as AlertTriangle, CircleCheck as CheckCircle2, Pencil } from 'lucide-react';
import Badge from '@/components/Badge';
import type { Finding, SourceChunk, Severity } from '@/types';

const SEVERITY_TONE: Record<Severity, 'rose' | 'amber' | 'stone'> = {
  high: 'rose',
  medium: 'amber',
  low: 'stone',
};

const SEVERITY_LABEL: Record<Severity, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

type Mode = 'idle' | 'editing' | 'dismissing';

interface FindingCardProps {
  finding: Finding;
  source: SourceChunk | undefined;
  canAct: boolean;
  onAccept: (replacement: string) => void;
  onDismiss: (reason: string) => void;
}

export default function FindingCard({ finding, source, canAct, onAccept, onDismiss }: FindingCardProps) {
  const [mode, setMode] = useState<Mode>('idle');
  const [draft, setDraft] = useState('');
  const isFix = finding.status === 'suggested-fix';

  const startEdit = () => {
    setDraft(finding.fix ?? '');
    setMode('editing');
  };

  const startDismiss = () => {
    setDraft('');
    setMode('dismissing');
  };

  return (
    <article className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge tone="sky">{finding.category}</Badge>
        <Badge tone={SEVERITY_TONE[finding.severity]}>{SEVERITY_LABEL[finding.severity]} severity</Badge>
        {isFix ? (
          <Badge tone="emerald">Suggested fix</Badge>
        ) : (
          <Badge tone="amber">Needs a decision</Badge>
        )}
        {finding.ruleId === 'ai-tone-check' && (
          <Badge tone="sky">AI analysis</Badge>
        )}
        <span className="ml-auto text-xs text-stone-500">Confidence: {finding.confidence}</span>
      </div>

      <p className="mb-3 text-sm text-stone-600">
        Flagged text: <span className="rounded bg-rose-50 px-1.5 py-0.5 font-medium text-rose-900">{finding.matched}</span>
      </p>
      <p className="mb-4 text-[15px] leading-[1.5] text-stone-800">{finding.reason}</p>

      <div className="mb-4 rounded-lg border-l-4 border-emerald-600 bg-stone-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
          Approved source {finding.sourceId}
          {source ? `: ${source.title} (${source.version}, owner: ${source.owner})` : ''}
        </p>
        <p className="mt-1.5 text-sm italic leading-[1.5] text-stone-700">"{finding.quote}"</p>
      </div>

      {isFix && finding.fix !== null ? (
        <div className="mb-4">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-stone-500">Suggested change</p>
          <p className="text-[15px] leading-[1.5]">
            <span className="rounded bg-rose-50 px-1 text-rose-800 line-through">{finding.matched}</span>
            <span className="mx-2 text-stone-400" aria-hidden="true">
              to
            </span>
            <span className="rounded bg-emerald-50 px-1 font-medium text-emerald-800">{finding.fix}</span>
          </p>
        </div>
      ) : (
        <p className="mb-4 flex items-start gap-2 text-sm text-stone-600">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
          No automatic rewrite is offered. Edit the copy yourself, or dismiss with a reason.
        </p>
      )}

      {canAct && mode === 'idle' && (
        <div className="flex flex-wrap gap-2">
          {isFix && finding.fix !== null && (
            <button
              type="button"
              onClick={() => onAccept(finding.fix as string)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Accept fix
            </button>
          )}
          {isFix && finding.fix !== null && (
            <button
              type="button"
              onClick={startEdit}
              className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3.5 py-2 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
              Edit fix
            </button>
          )}
          <button
            type="button"
            onClick={startDismiss}
            className="rounded-lg px-3.5 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            Dismiss with reason
          </button>
        </div>
      )}

      {canAct && mode === 'editing' && (
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (draft.trim() === '') return;
            onAccept(draft.trim());
          }}
        >
          <label htmlFor={`edit-${finding.id}`} className="block text-sm font-medium text-stone-800">
            Your wording
          </label>
          <input
            id={`edit-${finding.id}`}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-[15px] text-stone-900 focus:border-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={draft.trim() === ''}
              className="rounded-lg bg-emerald-700 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              Apply my wording
            </button>
            <button
              type="button"
              onClick={() => setMode('idle')}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {canAct && mode === 'dismissing' && (
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (draft.trim() === '') return;
            onDismiss(draft.trim());
          }}
        >
          <label htmlFor={`dismiss-${finding.id}`} className="block text-sm font-medium text-stone-800">
            Why is this copy correct as written? (required)
          </label>
          <textarea
            id={`dismiss-${finding.id}`}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={2}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-[15px] text-stone-900 focus:border-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={draft.trim() === ''}
              className="rounded-lg bg-stone-800 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-900 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              Dismiss finding
            </button>
            <button
              type="button"
              onClick={() => setMode('idle')}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {!canAct && (
        <p className="text-sm text-stone-500">Findings can only be resolved by the creator while the draft is open for edits.</p>
      )}
    </article>
  );
}
