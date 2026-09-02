import React, { useState, useEffect } from 'react';
import { 
  Building2, Radio, Sparkles, RefreshCw, Save, CheckCircle2, 
  AlertTriangle, Shield, Sliders, ArrowUpRight, Lock, Unlock, 
  Activity, Database, Laptop, Send, Zap, Users, IndianRupee
} from 'lucide-react';
import { 
  getAlphaSchemes, updateAlphaScheme, resetAlphaSchemes, 
  triggerQuickDemo, subscribeToAlphaChanges 
} from '../utils/realtimeSync';

export function AlphaPortalConsole({ onOpenSplitDemo }) {
  const [schemes, setSchemes] = useState(getAlphaSchemes());
  const [activeTab, setActiveTab] = useState("table"); // 'table', 'logs', 'settings'
  const [logs, setLogs] = useState([
    {
      id: 1,
      time: new Date().toLocaleTimeString(),
      event: "ALPHA_PORTAL_INITIALIZED",
      detail: "Supabase Realtime WebSocket & Local Broadcast Channel Ready."
    }
  ]);
  const [broadcastCount, setBroadcastCount] = useState(1);
  const [saveSuccessId, setSaveSuccessId] = useState(null);

  // Subscribe to external updates
  useEffect(() => {
    const unsubscribe = subscribeToAlphaChanges((updatedSchemes, meta) => {
      setSchemes(updatedSchemes);
      if (meta?.reason) {
        setLogs(prev => [
          {
            id: Date.now(),
            time: new Date().toLocaleTimeString(),
            event: meta.action || "REALTIME_BROADCAST",
            detail: `${meta.schemeId || 'ALL'}: ${meta.reason}`
          },
          ...prev.slice(0, 15)
        ]);
        setBroadcastCount(c => c + 1);
      }
    });
    return unsubscribe;
  }, []);

  const handleSchemeFieldChange = (schemeId, field, value) => {
    const parsedValue = (field === 'sanctioned_amount' || field === 'age_min' || field === 'age_max' || field === 'income_cap')
      ? Number(value)
      : value;

    const updated = updateAlphaScheme(schemeId, { [field]: parsedValue }, `Updated ${field} to ${value}`);
    setSchemes(updated);
    setSaveSuccessId(schemeId);
    setTimeout(() => setSaveSuccessId(null), 2000);
  };

  const handleQuickDemo = (type) => {
    const updated = triggerQuickDemo(type);
    if (updated) setSchemes(updated);
  };

  const handleReset = () => {
    const updated = resetAlphaSchemes();
    setSchemes(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      
      {/* Top Console Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl mb-8 border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                Alpha Portal • Government Administration Console
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Real-Time Scheme Parameter Policy Controller
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Modify scheme age ceilings, income thresholds, or SHG mandates. Changes stream immediately via Supabase WebSockets & BroadcastChannel to citizen clients.
            </p>
          </div>

          {/* Quick Realtime Stats & Split Demo Button */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10 text-center">
              <span className="text-xl font-black text-emerald-400 block">{broadcastCount}</span>
              <span className="text-[10px] text-slate-300 font-bold uppercase">Live Broadcasts</span>
            </div>

            {onOpenSplitDemo && (
              <button
                onClick={onOpenSplitDemo}
                className="px-5 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black text-xs shadow-lg flex items-center gap-2 transition"
              >
                <Laptop className="w-4 h-4 text-amber-300" />
                <span>Open Split-Screen Judge Demo</span>
              </button>
            )}
          </div>
        </div>

        {/* 1-Click Fast Track Hackathon Demo Action Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>1-Click Hackathon Judge Triggers (Watch SchemeConnect Unlock in Realtime!):</span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            
            {/* Trigger 1: Age Extension (Unlock for 39yo) */}
            <button
              onClick={() => handleQuickDemo("EXTEND_AGE_40")}
              className="px-3.5 py-2 bg-emerald-600/80 hover:bg-emerald-600 text-white rounded-xl text-xs font-black border border-emerald-400/40 shadow-sm flex items-center gap-1.5 transition"
            >
              <Unlock className="w-3.5 h-3.5 text-emerald-200" />
              <span>Extend NSFDC Age: 38 ➔ 40 (Unlock for Rajan 39yo)</span>
            </button>

            {/* Trigger 2: Revert Age to 38 */}
            <button
              onClick={() => handleQuickDemo("RESTRICT_AGE_38")}
              className="px-3.5 py-2 bg-amber-600/80 hover:bg-amber-600 text-white rounded-xl text-xs font-black border border-amber-400/40 shadow-sm flex items-center gap-1.5 transition"
            >
              <Lock className="w-3.5 h-3.5 text-amber-200" />
              <span>Revert NSFDC Age: 40 ➔ 38 (Freeze Card)</span>
            </button>

            {/* Trigger 3: Waive SHG */}
            <button
              onClick={() => handleQuickDemo("RAISE_MAHILA_INCOME")}
              className="px-3.5 py-2 bg-purple-600/80 hover:bg-purple-600 text-white rounded-xl text-xs font-black border border-purple-400/40 shadow-sm flex items-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-200" />
              <span>Waive Mahila SHG Requirement & Raise Cap</span>
            </button>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 shadow-sm flex items-center gap-1.5 transition ml-auto"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Benchmark State</span>
            </button>

          </div>
        </div>

      </div>

      {/* Main Admin Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-black text-slate-900">
              Live Policy Parameter Table (`alpha_schemes`)
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {schemes.length} Schemes Loaded in Realtime Sync
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Scheme ID & Name</th>
                <th className="py-3 px-4">Sanctioned Amount (₹)</th>
                <th className="py-3 px-4">Age Bracket (Min–Max)</th>
                <th className="py-3 px-4">Income Cap (₹)</th>
                <th className="py-3 px-4">Target Sector</th>
                <th className="py-3 px-4">SHG Requirement</th>
                <th className="py-3 px-4 text-right">Status / Sync</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {schemes.map((s) => (
                <tr key={s.scheme_id} className="hover:bg-slate-50/80 transition">
                  
                  {/* Scheme Name */}
                  <td className="py-3 px-4">
                    <span className="font-black text-slate-900 block">{s.scheme_name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{s.scheme_id} • {s.ministry}</span>
                  </td>

                  {/* Sanctioned Amount */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <IndianRupee className="w-3 h-3 text-slate-400" />
                      <input
                        type="number"
                        step="10000"
                        value={s.sanctioned_amount}
                        onChange={(e) => handleSchemeFieldChange(s.scheme_id, 'sanctioned_amount', e.target.value)}
                        className="w-24 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-black text-blue-700 focus:bg-white focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </td>

                  {/* Age Min / Max Slider */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold w-4 text-slate-500">{s.age_min}</span>
                      <input
                        type="range"
                        min="18"
                        max="65"
                        value={s.age_max}
                        onChange={(e) => handleSchemeFieldChange(s.scheme_id, 'age_max', e.target.value)}
                        className="w-24 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                      <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                        {s.age_max} yrs
                      </span>
                    </div>
                  </td>

                  {/* Income Cap */}
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      step="50000"
                      value={s.income_cap}
                      onChange={(e) => handleSchemeFieldChange(s.scheme_id, 'income_cap', e.target.value)}
                      className="w-28 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-black text-emerald-700 focus:bg-white focus:ring-1 focus:ring-emerald-500"
                    />
                  </td>

                  {/* Target Sector */}
                  <td className="py-3 px-4">
                    <select
                      value={s.sector}
                      onChange={(e) => handleSchemeFieldChange(s.scheme_id, 'sector', e.target.value)}
                      className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:bg-white"
                    >
                      <option value="Street Vendor">Street Vendor</option>
                      <option value="Handicraft/Artisan">Handicraft/Artisan</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Services">Services</option>
                      <option value="All">All Sectors</option>
                    </select>
                  </td>

                  {/* SHG Requirement */}
                  <td className="py-3 px-4">
                    <select
                      value={s.shg_membership}
                      onChange={(e) => handleSchemeFieldChange(s.scheme_id, 'shg_membership', e.target.value)}
                      className={`px-2 py-1 border rounded-lg text-xs font-bold ${
                        s.shg_membership === 'Mandatory' 
                          ? 'bg-purple-50 text-purple-800 border-purple-200' 
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <option value="Not Required">Not Required</option>
                      <option value="Mandatory">Mandatory</option>
                      <option value="Preferred">Preferred</option>
                    </select>
                  </td>

                  {/* Live Sync Status */}
                  <td className="py-3 px-4 text-right">
                    {saveSuccessId === s.scheme_id ? (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse">
                        ✓ Broadcasted!
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-400">
                        Synced
                      </span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Live Broadcast Activity Stream Log */}
      <div className="bg-slate-950 text-slate-300 rounded-3xl p-5 border border-slate-800 font-mono text-xs shadow-lg">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="font-bold text-white text-xs uppercase tracking-wider">
              Supabase / WebSocket Realtime Stream Audit Log
            </span>
          </div>
          <span className="text-[10px] text-slate-500">Auto-Scrolling Payload Feed</span>
        </div>

        <div className="space-y-1.5 max-h-36 overflow-y-auto">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start space-x-2 text-[11px] leading-relaxed">
              <span className="text-slate-500">[{log.time}]</span>
              <span className="text-emerald-400 font-bold">{log.event}:</span>
              <span className="text-slate-200">{log.detail}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
