import { useState } from 'react';
import { Send } from 'lucide-react';
import Badge from '@/components/Badge';
import Reveal from '@/components/Reveal';
import type { ReviewWorkflow } from '@/hooks/useReviewWorkflow';
import type { WorkflowStatus } from '@/types';

const STATUS_LABEL: Record<WorkflowStatus, string> = {
  draft: 'Draft',
  'in-review': 'Waiting for review',
  'changes-requested': 'Changes requested',
  approved: 'Approved',
  rejected: 'Rejected',
};

const STATUS_TONE: Record<WorkflowStatus, 'stone' | 'sky' | 'amber' | 'emerald' | 'rose'> = {
  draft: 'stone',
  'in-review': 'sky',
  'changes-requested': 'amber',
  approved: 'emerald',
  rejected: 'rose',
};

const STATUS_HELP: Record<WorkflowStatus, string> = {
  draft: 'Resolve or dismiss every finding, then send this draft to your approver.',
  'in-review': 'Your approver is reading this revision. It stays locked until they respond.',
  'changes-requested': 'Your approver asked for changes. Edit the draft in the Review tab, then resubmit.',
  approved: 'This revision is approved and ready to publish. The decision is in the activity log.',
  rejected: 'This revision was rejected. Read the note below, then edit and resubmit from the Review tab.',
};

export default function ApprovalView({ workflow }: { workflow: ReviewWorkflow }) {
  const { status, role, routedTo, requiredApprover, findings, log, canSubmit, revision } = workflow;
  const [comment, setComment] = useState('');
  const isApprover = status === 'in-review' && routedTo !== null && role === routedTo;
  const canDecide = isApprover && comment.trim() !== '';

  return (
    <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 lg:items-start">
      <Reveal>
      <section className="space-y-6">
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <h2 className="text-base font-semibold leading-[1.2] text-stone-900">Revision {revision}</h2>
            <Badge tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Badge>
          </div>
          <p className="text-[15px] leading-[1.5] text-stone-700">{STATUS_HELP[status]}</p>

          <dl className="mt-5 grid gap-4 border-t border-stone-100 pt-5 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-stone-500">Open findings</dt>
              <dd className="mt-1 font-medium text-stone-900">{findings.length}</dd>
            </div>
            <div>
              <dt className="text-stone-500">Approver for this revision</dt>
              <dd className="mt-1 font-medium text-stone-900">
                {routedTo ?? requiredApprover}
                {routedTo === null && <span className="font-normal text-stone-500"> (if submitted now)</span>}
              </dd>
            </div>
          </dl>
          {requiredApprover === 'Reviewer' && routedTo === null && (
            <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm leading-[1.5] text-amber-900">
              You dismissed a claim or fact finding, so a Reviewer must approve this copy.
            </p>
          )}
        </div>

        {role === 'Creator' && (status === 'draft' || status === 'changes-requested' || status === 'rejected') && (
          <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
            <h3 className="mb-1 font-semibold text-stone-900">Send for approval</h3>
            <p className="mb-4 text-sm leading-[1.5] text-stone-600">
              {findings.length > 0
                ? `Resolve or dismiss the ${findings.length} open ${findings.length === 1 ? 'finding' : 'findings'} first.`
                : 'Nothing is blocking submission.'}
            </p>
            <button
              type="button"
              disabled={!canSubmit}
              onClick={workflow.submitForApproval}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              Submit for approval
            </button>
          </div>
        )}

        {isApprover && (
          <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
            <h3 className="mb-1 font-semibold text-stone-900">Decision</h3>
            <p className="mb-4 text-sm leading-[1.5] text-stone-600">
              Add a note for the creator. A note is required to request changes or reject.
            </p>
            <label htmlFor="decision-note" className="sr-only">
              Comment
            </label>
            <textarea
              id="decision-note"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={3}
              placeholder="For example: Confirm the 2009 founding year with Communications."
              className="mb-4 w-full rounded-lg border border-stone-300 px-3 py-2 text-[15px] text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  workflow.decide('approve', comment);
                  setComment('');
                }}
                className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
              >
                Approve
              </button>
              <button
                type="button"
                disabled={!canDecide}
                onClick={() => {
                  workflow.decide('request-changes', comment);
                  setComment('');
                }}
                className="rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:text-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
              >
                Request changes
              </button>
              <button
                type="button"
                disabled={!canDecide}
                onClick={() => {
                  workflow.decide('reject', comment);
                  setComment('');
                }}
                className="rounded-lg border border-rose-300 bg-white px-4 py-2.5 text-sm font-medium text-rose-800 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:text-rose-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
              >
                Reject
              </button>
            </div>
          </div>
        )}

        {status === 'in-review' && !isApprover && (
          <p className="rounded-xl bg-sky-50 p-4 text-sm leading-[1.5] text-sky-900">
            Waiting for a {routedTo} to decide. Switch to that role in the header to review it.
          </p>
        )}
      </section>
      </Reveal>

      <Reveal delay={120}>
      <section aria-labelledby="activity-heading">
        <h2 id="activity-heading" className="mb-1 text-base font-semibold leading-[1.2] text-stone-900">
          Activity
        </h2>
        <p className="mb-4 text-sm text-stone-500">A record of every edit, decision and comment.</p>
        <ol className="space-y-3">
          {log.map((entry) => (
            <li key={entry.id} className="rounded-lg border border-stone-200 bg-white p-4">
              <div className="mb-1 flex items-center gap-2 text-xs text-stone-500">
                <span className="font-medium text-stone-700">{entry.actor}</span>
                <span aria-hidden="true">·</span>
                <time>{entry.time}</time>
              </div>
              <p className="text-sm leading-[1.5] text-stone-800">{entry.message}</p>
            </li>
          ))}
        </ol>
      </section>
      </Reveal>
    </div>
  );
}
