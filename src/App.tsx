import { useEffect, useState } from 'react';
import AppHeader from '@/components/AppHeader';
import AdminView from '@/components/AdminView';
import ApprovalView from '@/components/ApprovalView';
import PageHero, { type HeroImage } from '@/components/PageHero';
import ReviewView from '@/components/ReviewView';
import SourcesView from '@/components/SourcesView';
import { useReviewWorkflow } from '@/hooks/useReviewWorkflow';
import { applyPageMeta, type PageMeta } from '@/lib/pageMeta';
import type { Role, Tab } from '@/types';

interface TabContent extends PageMeta {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: HeroImage;
}

const TAB_IDS: Tab[] = ['review', 'approval', 'sources', 'admin'];

const CONTENT: Record<Tab, TabContent> = {
  review: {
    title: 'Catch brand issues before your audience does',
    description: 'Check marketing copy against brand guidelines, terminology and approved facts before you publish. Every finding cites its source.',
    eyebrow: 'Pre-publication review',
    subtitle: 'Paste a draft and get findings that each point to the guideline or fact behind them. Nothing changes unless you accept it.',
    image: { src: 'https://images.pexels.com/photos/35746663/pexels-photo-35746663.jpeg?auto=compress&cs=tinysrgb&w=1600', alt: 'Hiker in a red jacket walking along a foggy mountain trail', credit: 'Ali Alcántara' },
  },
  approval: {
    title: 'Every publishing decision has a named owner',
    description: 'Route brand-checked drafts to a manager or reviewer. Every request, comment and approval is logged with who decided and when.',
    eyebrow: 'Approval workflow',
    subtitle: 'Risky claims go to a reviewer automatically. Each request, comment and approval is logged, so you always know who decided what and when.',
    image: { src: 'https://images.pexels.com/photos/4956502/pexels-photo-4956502.jpeg?auto=compress&cs=tinysrgb&w=1600', alt: 'Group of hikers in bright raincoats walking through misty mountains', credit: 'Yu Lin Chen' },
  },
  sources: {
    title: 'Every finding traces back to an approved source',
    description: 'Browse the guidelines, terminology and approved facts behind every brand check, with versions, owners and expiry dates.',
    eyebrow: 'Source library',
    subtitle: 'Guidelines, terminology and approved facts, each with an owner and an expiry date. Keep them current and the checks stay accurate.',
    image: { src: 'https://images.pexels.com/photos/8728418/pexels-photo-8728418.jpeg?auto=compress&cs=tinysrgb&w=1600', alt: 'Hiker with a backpack on a rocky forest path', credit: 'Katya Wolf' },
  },
  admin: {
    title: 'See the health of your brand guidelines at a glance',
    description: 'An admin-only dashboard showing draft status, source library health, dismissal patterns and recent activity.',
    eyebrow: 'Admin dashboard',
    subtitle: 'Track which guidelines cause the most dismissals, which facts have expired, and who has been doing what.',
    image: { src: 'https://images.pexels.com/photos/35746663/pexels-photo-35746663.jpeg?auto=compress&cs=tinysrgb&w=1600', alt: 'Hiker in a red jacket walking along a foggy mountain trail', credit: 'Ali Alcántara' },
  },
};

const PAGE_TITLES: Record<Tab, string> = {
  review: 'Review a draft', approval: 'Approval workflow', sources: 'Source library', admin: 'Admin dashboard',
};

const tabFromHash = (): Tab => {
  const id = window.location.hash.replace('#', '');
  return TAB_IDS.find((item) => item === id) ?? 'review';
};

export default function App() {
  const [tab, setTab] = useState<Tab>(tabFromHash);
  const [roleOverride, setRoleOverride] = useState<Role | null>(null);
  const workflow = useReviewWorkflow();

  const effectiveRole: Role = roleOverride ?? 'Creator';

  useEffect(() => {
    const onHashChange = () => setTab(tabFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const content = CONTENT[tab] ?? CONTENT.review;

  useEffect(() => {
    applyPageMeta({ title: `${PAGE_TITLES[tab]} | BrandLoom`, description: content.description });
  }, [tab, content.description]);

  const isAdmin = effectiveRole === 'Admin';
  const showAdminTab = tab === 'admin' && isAdmin;
  const effectiveTab: Tab = tab === 'admin' && !isAdmin ? 'review' : tab;
  const effectiveContent = CONTENT[effectiveTab] ?? CONTENT.review;

  const handleRoleChange = (newRole: Role) => {
    setRoleOverride(newRole);
    if (tab === 'admin' && newRole !== 'Admin') window.location.hash = '#review';
  };

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-stone-900">
      <AppHeader
        tab={effectiveTab}
        role={effectiveRole}
        onRoleChange={handleRoleChange}
      />
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 py-5 sm:space-y-10 sm:px-6 sm:py-10 lg:px-8">
        {!workflow.loaded && (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-stone-500">Loading the review workspace…</p>
          </div>
        )}
        {workflow.loaded && workflow.persistenceError && (
          <div role="status" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {workflow.persistenceError}
          </div>
        )}
        {workflow.loaded && showAdminTab ? (
          <>
            <PageHero key="admin" eyebrow={content.eyebrow} title={content.title} subtitle={content.subtitle} image={content.image} />
            <AdminView workflow={workflow} />
          </>
        ) : workflow.loaded && tab === 'admin' && !isAdmin ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
            <p className="text-base font-semibold text-amber-900">Admin access required</p>
            <p className="mt-2 text-sm text-amber-800">Your account does not have the Admin role. Ask an administrator to update your role.</p>
          </div>
        ) : workflow.loaded ? (
          <>
            <PageHero key={effectiveTab} eyebrow={effectiveContent.eyebrow} title={effectiveContent.title} subtitle={effectiveContent.subtitle} image={effectiveContent.image} />
            {effectiveTab === 'review' && <ReviewView workflow={workflow} />}
            {effectiveTab === 'approval' && <ApprovalView workflow={workflow} />}
            {effectiveTab === 'sources' && <SourcesView />}
          </>
        ) : null}
      </main>
      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-stone-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>BrandLoom is a prototype built by Team Alpha for the Inkloom AI Brand-Governance Challenge.</p>
          <p>The demo brand, Northwind Outdoor, is fictional. No real customer data is used.</p>
        </div>
      </footer>
    </div>
  );
}
