import Badge from '@/components/Badge';
import Reveal from '@/components/Reveal';
import { SOURCES } from '@/data/demoBrand';
import type { SourceChunk } from '@/types';

function isExpired(source: SourceChunk) {
  return Boolean(source.expires) && new Date(source.expires as string) < new Date();
}

function SourceCard({ source }: { source: SourceChunk }) {
  const expired = isExpired(source);
  return (
    <article className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-xs font-semibold text-stone-600">
          {source.id}
        </span>
        <h3 className="font-semibold leading-[1.2] text-stone-900">{source.title}</h3>
        {source.expires && (
          <Badge tone={expired ? 'rose' : 'emerald'}>
            {expired ? `Expired ${source.expires}` : `Valid until ${source.expires}`}
          </Badge>
        )}
      </div>
      <p className="text-[15px] leading-[1.5] text-stone-700">{source.text}</p>
      <p className="mt-3 text-xs text-stone-500">
        Version {source.version} · Owner: {source.owner}
      </p>
    </article>
  );
}

const HOW_IT_WORKS = [
  'Every check runs against the sources on this page. Nothing outside them is treated as a rule.',
  'Each finding shows the exact passage it relies on. A finding without a matching passage is never shown.',
  'Fixes are suggestions. You accept, edit or dismiss each one, and a dismissal needs a reason.',
  'Claims and expired facts are never corrected automatically. A person makes that call.',
  'No AI model is used. Rules run in your browser, and the tone check runs in our own Supabase edge function. While you edit, your draft text is sent to that function and saved to our demo database. It is not sent to any third-party AI service. Demo data is fictional, so do not paste confidential text.',
];

export default function SourcesView() {
  const guidelines = SOURCES.filter((source) => source.kind === 'Guideline');
  const facts = SOURCES.filter((source) => source.kind === 'Fact');

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start">
      <div className="space-y-10">
        <Reveal>
          <section aria-labelledby="guidelines-heading" className="space-y-4">
            <div>
              <h2 id="guidelines-heading" className="text-lg font-semibold leading-[1.2] text-stone-900">
                Guidelines and terminology
              </h2>
              <p className="mt-1 text-sm text-stone-500">The rules that tone, wording and claims are checked against.</p>
            </div>
            {guidelines.map((source) => (
              <SourceCard key={source.id} source={source} />
            ))}
          </section>
        </Reveal>

        <Reveal delay={100}>
          <section aria-labelledby="facts-heading" className="space-y-4">
            <div>
              <h2 id="facts-heading" className="text-lg font-semibold leading-[1.2] text-stone-900">
                Approved facts
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                A fact past its expiry date is flagged for its owner to confirm before anything relies on it.
              </p>
            </div>
            {facts.map((source) => (
              <SourceCard key={source.id} source={source} />
            ))}
          </section>
        </Reveal>
      </div>

      <Reveal delay={150}>
        <aside className="space-y-6 lg:sticky lg:top-28">
          <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
            <img
              src="https://images.pexels.com/photos/590798/pexels-photo-590798.jpeg?auto=compress&cs=tinysrgb&w=1000"
              alt="Two friends walking a forest trail with backpacks"
              width={1000}
              height={667}
              loading="lazy"
              className="h-48 w-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="p-5">
              <h2 className="mb-3 text-lg font-semibold leading-[1.2] text-stone-900">How the review works</h2>
              <ul className="space-y-3 text-[15px] leading-[1.5] text-stone-700">
                {HOW_IT_WORKS.map((line) => (
                  <li key={line} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" aria-hidden="true" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </Reveal>
    </div>
  );
}
