import React from 'react';
import { AlertTriangle } from 'lucide-react';

export function PrototypeDisclaimerBanner() {
  return (
    <aside 
      role="banner"
      aria-label="Prototype Disclaimer"
      className="bg-amber-400 text-slate-950 font-bold px-4 py-2 text-xs text-center border-b border-amber-500 shadow-xs flex items-center justify-center gap-2 z-[60] relative"
    >
      <AlertTriangle className="w-4 h-4 shrink-0 text-slate-950 animate-pulse" />
      <span className="tracking-wide">
        <strong>SIH/Project Expo Concept Prototype</strong> — simulates a possible future Government platform. Not an official Government of India service.
      </span>
    </aside>
  );
}
export default PrototypeDisclaimerBanner;
