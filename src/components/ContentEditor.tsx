import type { Audience, Channel, Finding, Severity } from '@/types';
import { AUDIENCES, CHANNELS } from '@/data/demoBrand';

const MARK_TONES: Record<Severity, string> = {
  high: 'bg-rose-100 text-rose-900',
  medium: 'bg-amber-100 text-amber-900',
  low: 'bg-stone-200 text-stone-900',
};

interface ContentEditorProps {
  text: string;
  channel: Channel;
  audience: Audience;
  readOnly: boolean;
  findings: Finding[];
  onTextChange: (text: string) => void;
  onChannelChange: (channel: Channel) => void;
  onAudienceChange: (audience: Audience) => void;
}

function HighlightedPreview({ text, findings }: { text: string; findings: Finding[] }) {
  const parts: (string | JSX.Element)[] = [];
  let cursor = 0;
  for (const finding of findings) {
    if (finding.start < cursor) continue;
    parts.push(text.slice(cursor, finding.start));
    parts.push(
      <mark key={finding.id} className={`rounded px-0.5 ${MARK_TONES[finding.severity]}`}>
        {finding.matched}
      </mark>
    );
    cursor = finding.end;
  }
  parts.push(text.slice(cursor));
  return <p className="whitespace-pre-wrap text-[15px] leading-[1.5] text-stone-800">{parts}</p>;
}

export default function ContentEditor({
  text,
  channel,
  audience,
  readOnly,
  findings,
  onTextChange,
  onChannelChange,
  onAudienceChange,
}: ContentEditorProps) {
  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold leading-[1.2] text-stone-900">Your draft</h2>
            <p className="text-sm text-stone-500">{text.length} characters</p>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex items-center gap-2 text-sm text-stone-600">
              Channel
              <select
                value={channel}
                disabled={readOnly}
                onChange={(event) => onChannelChange(event.target.value as Channel)}
                className="rounded-md border border-stone-300 bg-white px-2.5 py-1.5 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:bg-stone-100 disabled:text-stone-500"
              >
                {CHANNELS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm text-stone-600">
              Audience
              <select
                value={audience}
                disabled={readOnly}
                onChange={(event) => onAudienceChange(event.target.value as Audience)}
                className="rounded-md border border-stone-300 bg-white px-2.5 py-1.5 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:bg-stone-100 disabled:text-stone-500"
              >
                {AUDIENCES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <label htmlFor="draft-text" className="sr-only">
          Draft copy
        </label>
        <textarea
          id="draft-text"
          value={text}
          readOnly={readOnly}
          onChange={(event) => onTextChange(event.target.value)}
          rows={9}
          className="w-full resize-y rounded-lg border border-stone-300 bg-white p-4 text-[15px] leading-[1.5] text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 read-only:bg-stone-50"
          placeholder="Paste or write your copy here."
        />
        {readOnly && (
          <p className="mt-2 text-sm text-stone-500">This revision is locked while it is being reviewed.</p>
        )}
        {audience === 'Internal team' && !readOnly && (
          <p className="mt-2 rounded-lg bg-sky-50 p-2.5 text-xs leading-[1.5] text-sky-800">
            Internal audience: tone checks for exclamation marks and all-caps are relaxed. Terminology, claims and fact checks still apply.
          </p>
        )}
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="mb-1 text-base font-semibold leading-[1.2] text-stone-900">Highlighted view</h2>
        <p className="mb-4 text-sm text-stone-500">Text that needs attention is marked by how serious it is.</p>
        <div className="rounded-lg bg-stone-50 p-4">
          {text.trim() ? (
            <HighlightedPreview text={text} findings={findings} />
          ) : (
            <p className="text-sm text-stone-500">Nothing to show yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
