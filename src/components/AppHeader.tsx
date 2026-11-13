import { ShieldCheck } from 'lucide-react';
import type { Role, Tab } from '@/types';
import { BRAND_NAME } from '@/data/demoBrand';

const BASE_TABS: { id: Tab; label: string }[] = [
  { id: 'review', label: 'Review' },
  { id: 'approval', label: 'Approval' },
  { id: 'sources', label: 'Sources' },
];

const ADMIN_TAB = { id: 'admin' as Tab, label: 'Admin' };

const ROLES: Role[] = ['Creator', 'Manager', 'Reviewer', 'Admin'];

interface AppHeaderProps {
  tab: Tab;
  role: Role;
  onRoleChange: (role: Role) => void;
}

export default function AppHeader({ tab, role, onRoleChange }: AppHeaderProps) {
  const tabs = role === 'Admin' ? [...BASE_TABS, ADMIN_TAB] : BASE_TABS;
  const colCount = tabs.length;

  return (
    <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-2.5 px-4 py-2.5 sm:gap-3 sm:py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-700 text-white">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-base font-semibold leading-tight text-stone-900">BrandLoom</p>
            <p className="hidden text-xs leading-tight text-stone-500 sm:block">Demo brand: {BRAND_NAME} (fictional)</p>
          </div>
        </div>

        <nav aria-label="Main" className="grid gap-1 rounded-lg bg-stone-100 p-1 lg:flex lg:items-center" style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}>
          {tabs.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={tab === item.id ? 'page' : undefined}
              className={`flex min-h-[40px] items-center justify-center rounded-md px-3 py-2 text-center text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 sm:min-h-0 sm:py-1.5 ${
                tab === item.id ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-2 text-sm sm:justify-end">
          <div role="group" aria-label="Switch demo role" className="flex rounded-lg border border-stone-200 bg-white p-0.5">
            {ROLES.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={role === item}
                onClick={() => onRoleChange(item)}
                className={`min-h-[36px] rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 sm:min-h-0 sm:py-1 ${
                  role === item ? 'bg-emerald-700 text-white' : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
