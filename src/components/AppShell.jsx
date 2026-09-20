import React from 'react';
import { Home, Star, ClipboardList, HelpCircle } from 'lucide-react';

/**
 * AppShell — Persistent 4-tab navigation shell.
 *
 * Desktop: horizontal tabs rendered below the Navbar (top).
 * Mobile : fixed bottom tab bar (z-50).
 *
 * Tabs:
 *   home          → 'find-schemes'  (or 'landing' if profile already done)
 *   my-matches    → 'recommendations'
 *   apply-track   → 'apply-track'
 *   help          → 'help'
 */

const TABS = [
  {
    id: 'home',
    views: ['home', 'landing', 'find-schemes', 'form'],
    icon: Home,
    label: { en: 'Home', ta: 'முகப்பு', hi: 'होम' },
  },
  {
    id: 'my-matches',
    views: ['recommendations', 'feed', 'results'],
    icon: Star,
    label: { en: 'My Matches', ta: 'என் பொருத்தங்கள்', hi: 'मेरे मैच' },
  },
  {
    id: 'apply-track',
    views: ['apply-track', 'calc', 'locator', 'beta-portal', 'all-schemes', 'catalog'],
    icon: ClipboardList,
    label: { en: 'Apply & Track', ta: 'விண்ணப்பி & கண்காணி', hi: 'आवेदन & ट्रैक' },
  },
  {
    id: 'help',
    views: ['help', 'counselor', 'alpha-portal', 'admin'],
    icon: HelpCircle,
    label: { en: 'Help', ta: 'உதவி', hi: 'सहायता' },
  },
];

function getActiveTabId(view) {
  for (const tab of TABS) {
    if (tab.views.includes(view)) return tab.id;
  }
  return 'home';
}

export function AppShell({ view, onNavigate, lang = 'en', hasProfile }) {
  const activeTabId = getActiveTabId(view);

  const handleTabClick = (tab) => {
    if (tab.id === 'home') {
      onNavigate('home');
    } else if (tab.id === 'my-matches') {
      onNavigate(hasProfile ? 'recommendations' : 'find-schemes');
    } else if (tab.id === 'apply-track') {
      onNavigate('apply-track');
    } else if (tab.id === 'help') {
      onNavigate('help');
    }
  };

  const getLabel = (tab) => tab.label[lang] || tab.label.en;

  return (
    <>
      {/* ── DESKTOP: top secondary nav bar ─────────────────────────────────── */}
      <nav
        className="hidden sm:flex sticky top-16 z-40 bg-white border-b border-slate-200 shadow-xs"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 w-full">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTabId === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                  isActive
                    ? 'border-blue-600 text-blue-700 bg-blue-50/60'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{getLabel(tab)}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── MOBILE: fixed bottom tab bar ────────────────────────────────────── */}
      <nav
        className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-[0_-2px_12px_rgba(0,0,0,0.08)]"
        aria-label="Bottom navigation"
      >
        <div className="flex items-stretch h-16">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTabId === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-colors cursor-pointer ${
                  isActive ? 'text-blue-700 bg-blue-50/80' : 'text-slate-500 hover:text-slate-800'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`}
                />
                <span className={`text-[10px] font-bold leading-none ${isActive ? 'text-blue-700' : ''}`}>
                  {getLabel(tab)}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom padding so content doesn't hide behind mobile tab bar */}
      <div className="sm:hidden h-16 shrink-0" aria-hidden="true" />
    </>
  );
}

export default AppShell;
