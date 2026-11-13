import { CircleCheck as CheckCircle2, ShieldCheck } from 'lucide-react';
import ContentEditor from '@/components/ContentEditor';
import FindingCard from '@/components/FindingCard';
import Reveal from '@/components/Reveal';
import type { ReviewWorkflow } from '@/hooks/useReviewWorkflow';
import { SOURCES } from '@/data/demoBrand';

export default function ReviewView({ workflow }: { workflow: ReviewWorkflow }) {
  const { findings, canEdit, aiLoading } = workflow;
  const sourceById = new Map(SOURCES.map((source) => [source.id, source]));

  return (
    <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 lg:items-start">
      <Reveal>
        <ContentEditor
          text={workflow.text}
          channel={workflow.channel}
          audience={workflow.audience}
          readOnly={!canEdit}
          findings={findings}
          onTextChange={workflow.setText}
          onChannelChange={workflow.setChannel}
          onAudienceChange={workflow.setAudience}
        />
      </Reveal>

      <Reveal delay={120}>
        <section aria-labelledby="findings-heading" className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 id="findings-heading" className="text-lg font-semibold leading-[1.2] text-stone-900">
                Findings
              </h2>
              <p className="mt-1 text-sm text-stone-500">Each one links to the approved source it relies on.</p>
              {aiLoading && (
                <p className="mt-1 flex items-center gap-1.5 text-xs text-sky-600">
                  <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-sky-300 border-t-sky-600" />
                  Running tone check…
                </p>
              )}
            </div>
            <span
              className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium ${
                findings.length === 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-900'
              }`}
            >
              {findings.length} open
            </span>
          </div>

          {findings.length === 0 ? (
            <div className="flex items-start gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-emerald-700 shadow-sm">
                {canEdit ? (
                  <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                )}
              </div>
              <div>
                <p className="font-semibold text-emerald-950">All clear</p>
                <p className="mt-1 text-sm leading-[1.5] text-emerald-900">
                  {canEdit
                    ? 'This draft matches the approved sources. Head to Approval to send it to your reviewer.'
                    : 'This revision has no open findings.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {findings.map((finding) => (
                <FindingCard
                  key={finding.id}
                  finding={finding}
                  source={sourceById.get(finding.sourceId)}
                  canAct={canEdit}
                  onAccept={(replacement) => workflow.acceptFix(finding, replacement)}
                  onDismiss={(reason) => workflow.dismissFinding(finding, reason)}
                />
              ))}
            </div>
          )}
        </section>
      </Reveal>
    </div>
  );
}
