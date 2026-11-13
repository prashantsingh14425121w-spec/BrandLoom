import type { ReactNode } from 'react';

type Tone = 'emerald' | 'amber' | 'rose' | 'stone' | 'sky';

const TONES: Record<Tone, string> = {
  emerald: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  amber: 'bg-amber-50 text-amber-900 ring-amber-200',
  rose: 'bg-rose-50 text-rose-800 ring-rose-200',
  stone: 'bg-stone-100 text-stone-700 ring-stone-200',
  sky: 'bg-sky-50 text-sky-800 ring-sky-200',
};

export default function Badge({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}
