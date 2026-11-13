import { ChartBar as BarChart3, FileText, ShieldCheck, Users } from 'lucide-react';
import Badge from '@/components/Badge';
import Reveal from '@/components/Reveal';
import { SOURCES } from '@/data/demoBrand';
import type { ReviewWorkflow } from '@/hooks/useReviewWorkflow';

export default function AdminView({ workflow }: { workflow: ReviewWorkflow }) {
  const { log, dismissals, revision, status, findings } = workflow;

  const guidelines = SOURCES.filter((s) => s.kind === 'Guideline');
  const facts = SOURCES.filter((s) => s.kind === 'Fact');
  const expiredFacts = facts.filter((f) => f.expires && new Date(f.expires) < new Date());

  const categoryCounts = dismissals.reduce<Record<string, number>>((acc, d) => {
    acc[d.category] = (acc[d.category] ?? 0) + 1;
    return acc;
  }, {});

  const statCards = [
    { label: 'Current revision', value: revision, icon: FileText, tone: 'sky' as const },
    { label: 'Current status', value: status, icon: ShieldCheck, tone: status === 'approved' ? 'emerald' as const : status === 'rejected' ? 'rose' as const : 'stone' as const },
    { label: 'Open findings', value: findings.length, icon: BarChart3, tone: 'amber' as const },
    { label: 'Dismissals', value: dismissals.length, icon: Users, tone: 'stone' as const },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <Reveal>
        <section>
          <h2 className="mb-1 text-lg font-semibold leading-[1.2] text-stone-900">Admin dashboard</h2>
          <p className="mb-5 text-sm text-stone-500">An overview of the current draft, the source library and recent activity. Visible to the Admin role.</p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 text-stone-700">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <span className="text-xs font-medium uppercase tracking-wide text-stone-500">{card.label}</span>
                  </div>
                  <p className="text-2xl font-semibold capitalize leading-tight text-stone-900">{String(card.value)}</p>
                </div>
              );
            })}
          </div>
        </section>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <Reveal delay={80}>
          <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-base font-semibold leading-[1.2] text-stone-900">Source library health</h3>
            <dl className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <dt className="text-sm text-stone-600">Guidelines</dt>
                <dd className="font-medium text-stone-900">{guidelines.length}</dd>
              </div>
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <dt className="text-sm text-stone-600">Approved facts</dt>
                <dd className="font-medium text-stone-900">{facts.length}</dd>
              </div>
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <dt className="text-sm text-stone-600">Expired facts</dt>
                <dd className="flex items-center gap-2">
                  {expiredFacts.length > 0 ? (
                    <>
                      <Badge tone="rose">{expiredFacts.length}</Badge>
                      <span className="text-xs text-stone-500">{expiredFacts.map((f) => f.id).join(', ')}</span>
                    </>
                  ) : (
                    <Badge tone="emerald">0</Badge>
                  )}
                </dd>
              </div>
              {expiredFacts.map((fact) => (
                <div key={fact.id} className="rounded-lg bg-rose-50 p-3">
                  <p className="text-sm font-medium text-rose-900">{fact.id}: {fact.title}</p>
                  <p className="mt-1 text-xs text-rose-700">Expired {fact.expires}. Owner: {fact.owner}. Update or remove before any finding relies on it.</p>
                </div>
              ))}
            </dl>
          </section>
        </Reveal>

        <Reveal delay={160}>
          <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-base font-semibold leading-[1.2] text-stone-900">Dismissal patterns</h3>
            {dismissals.length === 0 ? (
              <p className="text-sm text-stone-500">No dismissals yet. When creators dismiss findings, they will appear here grouped by category.</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(categoryCounts).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm text-stone-700">{category}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 rounded-full bg-stone-100">
                        <div
                          className="h-2 rounded-full bg-emerald-600"
                          style={{ width: `${Math.min(100, (count / dismissals.length) * 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-stone-900">{count}</span>
                    </div>
                  </div>
                ))}
                <p className="mt-4 rounded-lg bg-stone-50 p-3 text-xs leading-[1.5] text-stone-600">
                  Recurring dismissals in a category may mean the guideline is unclear or too strict. Review the source passages for the categories above.
                </p>
              </div>
            )}
          </section>
        </Reveal>
      </div>

      <Reveal delay={240}>
        <section>
          <h3 className="mb-4 text-base font-semibold leading-[1.2] text-stone-900">Recent activity</h3>
          <ol className="space-y-3">
            {log.slice(0, 8).map((entry) => (
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
