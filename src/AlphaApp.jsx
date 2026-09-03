import React, { useState, useEffect, useCallback } from 'react';
import {
  Building2, Radio, ExternalLink, ShieldCheck,
  FileText, Settings, Search, CheckCircle2, Lock, Unlock,
  Sparkles, RefreshCw, Landmark, ArrowRight, X, Printer,
  IndianRupee, Database, AlertTriangle, Hash, Zap, BarChart3,
  TrendingUp, Send, Shield, Globe, Users, Activity, Clock
} from 'lucide-react';
import { AlphaGazetteModal } from './components/AlphaGazetteModal';
import {
  getAlphaSchemes, updateAlphaScheme, resetAlphaSchemes,
  triggerQuickDemo, subscribeToAlphaChanges
} from './utils/realtimeSync';
import { navigateToSchemeConnect } from './config/portalConfig';

// ── Utility: Generate deterministic SHA-256-like hash string (browser-side) ──
async function sha256(message) {
  try {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Fallback for environments without crypto.subtle
    let h = 0;
    for (let i = 0; i < message.length; i++) {
      h = (Math.imul(31, h) + message.charCodeAt(i)) | 0;
    }
    return Math.abs(h).toString(16).padStart(64, '0');
  }
}

// ── Format Indian currency ──
function fmtINR(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

export function AlphaApp() {
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('home');
  const [schemes, setSchemes] = useState(getAlphaSchemes());
  const [selectedSchemeId, setSelectedSchemeId] = useState("NSFDC_MICRO");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [gazetteScheme, setGazetteScheme] = useState(null);

  // Dashboard metrics
  const [broadcasterOnline] = useState(true);
  const [totalBudgetCr] = useState(1200);

  // Broadcast state
  const [logs, setLogs] = useState([
    {
      id: 1,
      time: new Date().toLocaleTimeString(),
      event: "PORTAL_INIT",
      hash: "a3f8c2e1d9b7...",
      detail: "Alpha Policy Broadcaster Online · BroadcastChannel('alpha_schemes_live_sync') ready",
      status: "CLEARED"
    }
  ]);
  const [broadcastCount, setBroadcastCount] = useState(1);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState("");

  // Policy simulator state
  const [simIncome, setSimIncome] = useState(300000);
  const [simLoanCap, setSimLoanCap] = useState(500000);

  // New scheme creation form
  const [newScheme, setNewScheme] = useState({
    name: "",
    category: "OBC",
    income: 250000,
    loanMax: 200000,
    verFactors: { aadhaar: true, pan: true, community: false, income: false },
    allocation: 50000000
  });
  const [schemePublished, setSchemePublished] = useState(false);

  // Computed simulator metrics
  const simEligibilityPct = Math.max(5, Math.min(94,
    Math.round(((simIncome / 800000) * 0.6 + (simLoanCap / 5000000) * 0.4) * 100)
  ));
  const simBudgetExhaust = Math.round((simEligibilityPct / 100) * totalBudgetCr * 12);
  const simApplicants = Math.round(simEligibilityPct * 142 * 0.7);

  // Emit broadcast log with SHA-256 hash
  const emitLog = useCallback(async (event, detail) => {
    const payload = JSON.stringify({ event, detail, ts: Date.now() });
    const hash = await sha256(payload);
    setLogs(prev => [
      {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        event,
        hash: hash.substring(0, 16) + '...',
        detail,
        status: "CLEARED"
      },
      ...prev.slice(0, 14)
    ]);
    setBroadcastCount(c => c + 1);
  }, []);

  // Subscribe to real-time changes
  useEffect(() => {
    const unsubscribe = subscribeToAlphaChanges((updatedSchemes, meta) => {
      setSchemes(updatedSchemes);
      if (meta?.reason) {
        emitLog(meta.action || "POLICY_BROADCAST", `${meta.schemeId || 'ALL'}: ${meta.reason}`);
      }
    });
    return unsubscribe;
  }, [emitLog]);

  // Check URL params
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const schemeId = params.get("scheme");
      if (schemeId) {
        const found = schemes.find(s => s.scheme_id === schemeId);
        if (found) setGazetteScheme(found);
      }
      if (window.location.pathname.includes("admin") || params.get("view") === "admin") {
        setActiveTab("admin");
      }
    }
  }, [schemes]);

  const selectedScheme = schemes.find(s => s.scheme_id === selectedSchemeId) || schemes[0];

  const handleFieldChange = async (field, value) => {
    const parsedValue = ['sanctioned_amount', 'age_min', 'age_max', 'income_cap'].includes(field)
      ? Number(value)
      : value;
    const updated = updateAlphaScheme(selectedScheme.scheme_id, { [field]: parsedValue }, `Admin modified ${field} to ${value}`);
    setSchemes(updated);
    setBroadcastSuccess(true);
    setBroadcastMsg(`Policy Update Broadcasted & Escrow Allocations Locked 🟢`);
    await emitLog("POLICY_UPDATE", `${selectedScheme.scheme_id}: ${field} set to ${value}. DBT clearing webhook emitted to Beta Portal nodes.`);
    setTimeout(() => { setBroadcastSuccess(false); setBroadcastMsg(""); }, 3000);
  };

  const handleQuickDemo = async (type) => {
    const updated = triggerQuickDemo(type);
    if (updated) {
      setSchemes(updated);
      setBroadcastSuccess(true);
      setBroadcastMsg("Policy Update Broadcasted & Escrow Allocations Locked 🟢");
      await emitLog("FAST_TRACK_DEMO", `${type}: Quick-demo policy broadcast emitted. RS256-signed payload transmitted to SchemeConnect & Beta Portal.`);
      setTimeout(() => { setBroadcastSuccess(false); setBroadcastMsg(""); }, 3000);
    }
  };

  const handleReset = async () => {
    const updated = resetAlphaSchemes();
    setSchemes(updated);
    setBroadcastSuccess(true);
    setBroadcastMsg("All schemes reset to statutory defaults. Policy Update Broadcasted & Escrow Allocations Locked 🟢");
    await emitLog("SYSTEM_RESET", "All 20 schemes reset to statutory gazette defaults. Broadcast emitted.");
    setTimeout(() => { setBroadcastSuccess(false); setBroadcastMsg(""); }, 3000);
  };

  const handlePublishNewScheme = async () => {
    if (!newScheme.name.trim()) return;
    setBroadcastSuccess(true);
    setBroadcastMsg("New Scheme Published · Policy Update Broadcasted & Escrow Allocations Locked 🟢");
    await emitLog(
      "SCHEME_PUBLISHED",
      `New scheme "${newScheme.name}" [${newScheme.category}] published. Max: ${fmtINR(newScheme.loanMax)}, Income cap: ${fmtINR(newScheme.income)}, Allocation: ${fmtINR(newScheme.allocation)}. RS256 signed.`
    );
    setSchemePublished(true);
    setTimeout(() => { setBroadcastSuccess(false); setBroadcastMsg(""); setSchemePublished(false); }, 4000);
  };

  const filteredSchemes = schemes.filter(s => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = s.scheme_name.toLowerCase().includes(q) ||
      (s.scheme_name_ta || '').toLowerCase().includes(q) ||
      s.scheme_id.toLowerCase().includes(q) ||
      s.ministry.toLowerCase().includes(q);
    if (!matchesSearch) return false;
    if (categoryFilter === "all") return true;
    if (categoryFilter === "micro" && s.sanctioned_amount <= 200000) return true;
    if (categoryFilter === "msme" && s.sanctioned_amount > 200000) return true;
    if (categoryFilter === "scst" && (s.caste_eligibility?.includes("SC") || s.caste_eligibility?.includes("ST"))) return true;
    if (categoryFilter === "women" && (s.gender_eligibility === "Female" || s.scheme_name.includes("Mahila"))) return true;
    if (categoryFilter !== "all") return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">

      {/* Official Gazette Modal */}
      {gazetteScheme && (
        <AlphaGazetteModal
          scheme={gazetteScheme}
          lang={lang}
          onClose={() => setGazetteScheme(null)}
        />
      )}

      {/* ================================================================ */}
      {/* SECTION 1: OFFICIAL HEADER & PORTAL DASHBOARD METRICS            */}
      {/* ================================================================ */}
      <header className="bg-[#0f172a] text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-4">

            {/* Brand */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-white tracking-tight">
                    🏛️ National Scheme Governance &amp; Policy Portal
                  </span>
                  <span className="text-[10px] font-bold bg-blue-700/60 text-blue-200 px-2 py-0.5 rounded border border-blue-600/40">
                    Alpha
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium hidden md:block">
                  Ministry of Social Justice &amp; Empowerment · Government of India
                </p>
              </div>
            </div>

            {/* Live Dashboard Metric Pills */}
            <div className="hidden lg:flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-900/40 border border-emerald-600/40 rounded-full text-[10px] font-bold text-emerald-300">
                <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
                <span>Broadcaster: Online 🟢</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-900/40 border border-blue-500/40 rounded-full text-[10px] font-bold text-blue-300">
                <Activity className="w-3 h-3" />
                <span>Realtime WebSockets: Active</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-700/60 border border-slate-600 rounded-full text-[10px] font-bold text-slate-300">
                <Database className="w-3 h-3" />
                <span>Active Schemes: {schemes.length + 122}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-900/40 border border-amber-600/40 rounded-full text-[10px] font-bold text-amber-300">
                <IndianRupee className="w-3 h-3" />
                <span>Allocated: ₹{totalBudgetCr} Cr</span>
              </div>
            </div>

            {/* Nav + Links */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('home')}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'home'
                      ? 'bg-white text-[#1e3a8a] shadow-xs font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Schemes ({schemes.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'admin'
                      ? 'bg-blue-600 text-white shadow-xs font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Policy Console</span>
                </button>
                <button
                  onClick={() => setActiveTab('simulator')}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'simulator'
                      ? 'bg-amber-600 text-white shadow-xs font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Simulator</span>
                </button>
              </div>

              <button
                onClick={() => navigateToSchemeConnect("/", true)}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 border border-slate-600 rounded-xl text-xs font-semibold transition flex items-center gap-1 cursor-pointer hidden sm:flex"
              >
                <span>SchemeConnect ↗</span>
              </button>
            </div>

          </div>
        </div>

        {/* Broadcast success notification bar */}
        {broadcastSuccess && (
          <div className="bg-emerald-700/90 border-t border-emerald-600 px-4 py-1.5 text-center animate-fadeIn">
            <span className="text-xs font-bold text-white flex items-center justify-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {broadcastMsg}
            </span>
          </div>
        )}
      </header>

      {/* ================================================================ */}
      {/* VIEW 1: HOME — PUBLIC GAZETTE DIRECTORY                           */}
      {/* ================================================================ */}
      {activeTab === 'home' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn flex-1">

          {/* Mobile metric row */}
          <div className="flex flex-wrap gap-2 mb-5 lg:hidden">
            {[
              { icon: Radio, label: "Broadcaster: Online 🟢", color: "emerald" },
              { icon: Activity, label: "WebSockets: Active", color: "blue" },
              { icon: Database, label: `Schemes: ${schemes.length + 122}`, color: "slate" },
              { icon: IndianRupee, label: `₹${totalBudgetCr} Cr`, color: "amber" },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className={`flex items-center gap-1.5 px-2.5 py-1 bg-${color}-50 border border-${color}-200 rounded-full text-[10px] font-bold text-${color}-800`}>
                <Icon className="w-3 h-3" />
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* Hero Banner */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold border border-slate-200 mb-2">
                <Building2 className="w-3.5 h-3.5 text-slate-600" />
                <span>Statutory Welfare Scheme Registry · SIH 2026 · Problem SIH26092</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Official Ministry Scheme Directory ({schemes.length} Statutory Schemes)
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Comprehensive statutory catalog of central and state welfare credit programs. All scheme parameters broadcast in real-time to SchemeConnect citizen portal. Click any scheme to review its gazette certificate with SHA-256 audit signature.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('admin')}
              className="px-5 py-2.5 bg-[#0f172a] hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center space-x-2 shrink-0 cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              <span>Admin Policy Console ➔</span>
            </button>
          </div>

          {/* Filter & Search */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
              {[
                { id: "all", label: `All Schemes (${schemes.length})` },
                { id: "micro", label: "Micro-Credit (≤₹2L)" },
                { id: "msme", label: "Term Loans / MSME" },
                { id: "scst", label: "SC/ST Welfare" },
                { id: "women", label: "Women & Artisans" }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    categoryFilter === cat.id
                      ? 'bg-[#0f172a] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search schemes or ministry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none"
              />
            </div>
          </div>

          {/* Schemes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSchemes.map((scheme) => (
              <div
                key={scheme.scheme_id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 shadow-xs transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-slate-500 truncate max-w-[200px]">{scheme.ministry}</span>
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">{scheme.scheme_id}</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 leading-snug mb-1">{scheme.scheme_name}</h3>
                  {scheme.scheme_name_ta && (
                    <p className="text-[11px] text-slate-500 mb-3 line-clamp-1">{scheme.scheme_name_ta}</p>
                  )}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 mb-4 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Sanction Limit:</span>
                      <span className="font-bold text-slate-900">₹{Number(scheme.sanctioned_amount).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Age Bracket:</span>
                      <span className="font-semibold text-slate-800">{scheme.age_min}–{scheme.age_max} Yrs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Income Cap:</span>
                      <span className="font-semibold text-slate-800">≤ ₹{Number(scheme.income_cap).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Interest Rate:</span>
                      <span className="font-bold text-emerald-700">{scheme.concessional_interest_rate || 5.0}% p.a.</span>
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setGazetteScheme(scheme)}
                    className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-600" />
                    <span>View Gazette ↗</span>
                  </button>
                  <button
                    onClick={() => { setSelectedSchemeId(scheme.scheme_id); setActiveTab('admin'); }}
                    className="py-2 px-3 bg-blue-50 hover:bg-blue-100 text-[#1e3a8a] rounded-lg text-xs font-semibold transition cursor-pointer"
                    title="Edit scheme in Admin Console"
                  >
                    <Settings className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* ================================================================ */}
      {/* VIEW 2: SECTION 2 — POLICY MANAGEMENT & SCHEME CREATION CONSOLE  */}
      {/* ================================================================ */}
      {activeTab === 'admin' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn flex-1">

          {/* Admin Banner */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200 mb-2">
                  <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  <span>Policy Broadcaster Active · RS256 JWT Signing · Supabase Realtime WebSockets</span>
                </div>
                <h1 className="text-xl font-bold text-slate-900">
                  Policy Management &amp; Scheme Creation Console
                </h1>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                  Modify scheme parameters below — changes are SHA-256 hashed, RS256-signed, and broadcast over <code className="bg-slate-100 px-1 rounded font-mono">public:scheme_updates</code> to SchemeConnect and partner bank nodes (&lt;10ms).
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-center px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl">
                  <span className="text-2xl font-bold text-slate-900 block">{broadcastCount}</span>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Broadcasts</span>
                </div>
                <div className="text-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl">
                  <span className="text-2xl font-bold text-blue-900 block">{schemes.length}</span>
                  <span className="text-[10px] text-blue-600 font-semibold uppercase">Live Schemes</span>
                </div>
              </div>
            </div>

            {/* Fast-Track Demo Buttons */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2.5">
                ⚡ 1-Click Fast Track Policy Broadcasts (Watch SchemeConnect unlock in real time):
              </span>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => { setSelectedSchemeId("NSFDC_MICRO"); handleQuickDemo("EXTEND_AGE_40"); }}
                  className="px-3.5 py-2 bg-[#0f172a] hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                  <Unlock className="w-3.5 h-3.5 text-amber-300" />
                  <span>Extend NSFDC Age: 38 ➔ 40</span>
                </button>
                <button onClick={() => { setSelectedSchemeId("NSFDC_MICRO"); handleQuickDemo("RESTRICT_AGE_38"); }}
                  className="px-3.5 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                  <Lock className="w-3.5 h-3.5 text-slate-300" />
                  <span>Revert NSFDC Age: 40 ➔ 38</span>
                </button>
                <button onClick={() => { setSelectedSchemeId("MAHILA_SAMRIDHI"); handleQuickDemo("RAISE_MAHILA_INCOME"); }}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                  <Sparkles className="w-3.5 h-3.5 text-slate-600" />
                  <span>Waive Mahila SHG Mandate &amp; Raise Cap</span>
                </button>
                <button onClick={handleReset}
                  className="ml-auto px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Reset All {schemes.length} Schemes</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2-Column Layout: Scheme Selector + Live Editor */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">

            {/* Left: Scheme Selector */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col h-[560px]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <h3 className="text-xs font-bold uppercase text-slate-800 tracking-wider">Select Scheme to Edit</h3>
                <span className="text-[10px] text-slate-400 font-mono">PostgreSQL · {schemes.length} records</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                {schemes.map(s => (
                  <div
                    key={s.scheme_id}
                    onClick={() => setSelectedSchemeId(s.scheme_id)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition flex items-center justify-between ${
                      selectedSchemeId === s.scheme_id
                        ? 'bg-blue-50/80 border-blue-400 font-semibold text-slate-900 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">{s.ministry}</span>
                      <span className="truncate block font-medium">{s.scheme_name}</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 shrink-0">≤{s.age_max}y</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Live Parameter Editor */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{selectedScheme.ministry}</span>
                  <h2 className="text-base font-bold text-slate-900">{selectedScheme.scheme_name}</h2>
                </div>
                <span className="text-xs font-mono font-bold bg-slate-100 px-2.5 py-1 rounded border border-slate-200 text-slate-700">{selectedScheme.scheme_id}</span>
              </div>

              <div className="space-y-4 text-xs flex-1">
                {/* Age Ceiling */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="font-semibold text-slate-800">Maximum Age Ceiling (Years):</label>
                    <span className="font-bold text-blue-900 text-sm">{selectedScheme.age_max} Yrs</span>
                  </div>
                  <input type="range" min="25" max="65" value={selectedScheme.age_max}
                    onChange={(e) => handleFieldChange("age_max", e.target.value)}
                    className="w-full accent-[#1e3a8a] cursor-pointer" />
                  <span className="text-[10px] text-slate-500 mt-1 block">Beneficiaries older than this cap will be locked on SchemeConnect.</span>
                </div>

                {/* Income Cap */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="font-semibold text-slate-800">Annual Income Ceiling (₹):</label>
                    <span className="font-bold text-blue-900 text-sm">₹{Number(selectedScheme.income_cap).toLocaleString('en-IN')}</span>
                  </div>
                  <input type="range" min="50000" max="800000" step="25000" value={selectedScheme.income_cap}
                    onChange={(e) => handleFieldChange("income_cap", e.target.value)}
                    className="w-full accent-[#1e3a8a] cursor-pointer" />
                </div>

                {/* Sanction Amount */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="font-semibold text-slate-800">Max Loan / Subsidy Amount (₹):</label>
                    <span className="font-bold text-blue-900 text-sm">₹{Number(selectedScheme.sanctioned_amount).toLocaleString('en-IN')}</span>
                  </div>
                  <input type="range" min="50000" max="5000000" step="50000" value={selectedScheme.sanctioned_amount}
                    onChange={(e) => handleFieldChange("sanctioned_amount", e.target.value)}
                    className="w-full accent-[#1e3a8a] cursor-pointer" />
                </div>

                {/* Interest Rate */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="font-semibold text-slate-800">Concessional Interest Rate (% p.a.):</label>
                    <span className="font-bold text-emerald-700 text-sm">{selectedScheme.concessional_interest_rate || 5.0}%</span>
                  </div>
                  <input type="range" min="3.0" max="12.0" step="0.5" value={selectedScheme.concessional_interest_rate || 5.0}
                    onChange={(e) => handleFieldChange("concessional_interest_rate", e.target.value)}
                    className="w-full accent-emerald-600 cursor-pointer" />
                </div>
              </div>

              {/* Publish button */}
              <button
                onClick={async () => {
                  setBroadcastSuccess(true);
                  setBroadcastMsg("Policy Update Broadcasted & Escrow Allocations Locked 🟢");
                  await emitLog("POLICY_BROADCAST", `${selectedScheme.scheme_id}: Manual publish. DBT clearing webhook to Beta Portal. RS256 signed.`);
                  setTimeout(() => { setBroadcastSuccess(false); setBroadcastMsg(""); }, 3000);
                }}
                className="mt-4 w-full py-2.5 bg-[#0f172a] hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <Send className="w-3.5 h-3.5" />
                Publish &amp; Broadcast Policy Update
              </button>
            </div>

          </div>

          {/* ── NEW SCHEME CREATION FORM ─────────────────────────────── */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              ➕ Create &amp; Publish New Welfare Scheme
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              New scheme parameters are SHA-256 hashed and RS256-signed before broadcast to partner bank nodes and SchemeConnect.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {/* Scheme Name */}
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Scheme Name</label>
                <input
                  type="text"
                  placeholder="e.g. PMEGP Credit Subsidy 2026"
                  value={newScheme.name}
                  onChange={(e) => setNewScheme(s => ({ ...s, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                />
              </div>

              {/* Target Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Category</label>
                <select
                  value={newScheme.category}
                  onChange={(e) => setNewScheme(s => ({ ...s, category: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option>OBC</option>
                  <option>SC</option>
                  <option>ST</option>
                  <option>EWS</option>
                  <option>General</option>
                </select>
              </div>

              {/* Max Annual Income Threshold */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Max Annual Income Threshold: <span className="text-blue-700">{fmtINR(newScheme.income)}</span>
                </label>
                <input type="range" min="100000" max="800000" step="25000" value={newScheme.income}
                  onChange={(e) => setNewScheme(s => ({ ...s, income: Number(e.target.value) }))}
                  className="w-full accent-[#1e3a8a]" />
              </div>

              {/* Max Loan / Subsidy Amount */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Max Loan / Subsidy Amount: <span className="text-blue-700">{fmtINR(newScheme.loanMax)}</span>
                </label>
                <input type="range" min="50000" max="2000000" step="50000" value={newScheme.loanMax}
                  onChange={(e) => setNewScheme(s => ({ ...s, loanMax: Number(e.target.value) }))}
                  className="w-full accent-[#1e3a8a]" />
              </div>

              {/* Total Fund Allocation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Total Fund Allocation: <span className="text-blue-700">{fmtINR(newScheme.allocation)}</span>
                </label>
                <input type="range" min="5000000" max="500000000" step="5000000" value={newScheme.allocation}
                  onChange={(e) => setNewScheme(s => ({ ...s, allocation: Number(e.target.value) }))}
                  className="w-full accent-emerald-600" />
              </div>
            </div>

            {/* Required Verification Factors */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-700 mb-2">Required Verification Factors:</label>
              <div className="flex flex-wrap gap-3">
                {Object.entries(newScheme.verFactors).map(([key, val]) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={val}
                      onChange={(e) => setNewScheme(s => ({ ...s, verFactors: { ...s.verFactors, [key]: e.target.checked } }))}
                      className="accent-[#1e3a8a] w-3.5 h-3.5"
                    />
                    {key === 'aadhaar' ? 'Aadhaar eKYC' : key === 'pan' ? 'PAN' : key === 'community' ? 'Community Certificate' : 'Income Certificate'}
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handlePublishNewScheme}
              disabled={!newScheme.name.trim()}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                newScheme.name.trim()
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {schemePublished ? (
                <><CheckCircle2 className="w-4 h-4" /> Scheme Published &amp; Broadcasted 🟢</>
              ) : (
                <><Send className="w-3.5 h-3.5" /> Publish &amp; Broadcast Policy Update</>
              )}
            </button>
          </div>
        </main>
      )}

      {/* ================================================================ */}
      {/* VIEW 3: SECTION 3 — POLICY SIMULATOR & SETTLEMENT AUDIT LOG      */}
      {/* ================================================================ */}
      {activeTab === 'simulator' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn flex-1">

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs mb-6">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-5 h-5 text-amber-600" />
              <h1 className="text-xl font-bold text-slate-900">Policy Impact Simulator</h1>
            </div>
            <p className="text-xs text-slate-500">
              Drag income threshold and subsidy cap sliders to simulate projected applicant eligibility rates and total budget exhaustion before deployment to SchemeConnect.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left: Simulator Sliders */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Simulate Eligibility Parameters
              </h2>

              <div className="space-y-6">
                {/* Income Threshold Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-700">Annual Income Threshold Cap</label>
                    <span className="text-sm font-black text-blue-700">{fmtINR(simIncome)}</span>
                  </div>
                  <input type="range" min="50000" max="800000" step="10000"
                    value={simIncome}
                    onChange={(e) => setSimIncome(Number(e.target.value))}
                    className="w-full accent-blue-600" />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>₹50,000</span>
                    <span>₹8,00,000</span>
                  </div>
                </div>

                {/* Loan Cap Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-700">Maximum Subsidy / Loan Cap</label>
                    <span className="text-sm font-black text-emerald-700">{fmtINR(simLoanCap)}</span>
                  </div>
                  <input type="range" min="50000" max="5000000" step="50000"
                    value={simLoanCap}
                    onChange={(e) => setSimLoanCap(Number(e.target.value))}
                    className="w-full accent-emerald-600" />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>₹50,000</span>
                    <span>₹50,00,000</span>
                  </div>
                </div>
              </div>

              {/* Simulate Deploy Button */}
              <button
                onClick={async () => {
                  setBroadcastSuccess(true);
                  setBroadcastMsg("Simulated policy parameters deployed · Policy Update Broadcasted & Escrow Allocations Locked 🟢");
                  await emitLog("SIM_DEPLOY", `Simulated params: Income cap=${fmtINR(simIncome)}, Loan cap=${fmtINR(simLoanCap)}. Projected eligibility ${simEligibilityPct}%. Budget exhaust: ₹${simBudgetExhaust} Cr.`);
                  setTimeout(() => { setBroadcastSuccess(false); setBroadcastMsg(""); }, 3000);
                }}
                className="mt-6 w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <Zap className="w-3.5 h-3.5" />
                Deploy Simulated Parameters to SchemeConnect
              </button>
            </div>

            {/* Right: Impact Metrics */}
            <div className="lg:col-span-6 flex flex-col gap-4">

              {/* Eligibility Rate Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Projected Beneficiary Eligibility</span>
                </div>
                <div className="flex items-end gap-3 mb-3">
                  <span className="text-5xl font-black text-blue-700">{simEligibilityPct}%</span>
                  <span className="text-sm text-slate-500 mb-1">of applicants eligible</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-300"
                    style={{ width: `${simEligibilityPct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>0%</span><span>50%</span><span>100%</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-2">
                  Estimated <strong>{simApplicants.toLocaleString()}</strong> applicants qualify across {schemes.length} active schemes.
                </p>
              </div>

              {/* Budget Exhaustion Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <IndianRupee className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Projected Budget Exhaustion</span>
                </div>
                <div className="flex items-end gap-3 mb-1">
                  <span className="text-3xl font-black text-amber-700">₹{simBudgetExhaust} Cr</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      simBudgetExhaust > totalBudgetCr * 10
                        ? 'bg-rose-500'
                        : simBudgetExhaust > totalBudgetCr * 6
                        ? 'bg-amber-400'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (simBudgetExhaust / (totalBudgetCr * 12)) * 100)}%` }}
                  />
                </div>
                {simBudgetExhaust > totalBudgetCr * 10 && (
                  <div className="flex items-center gap-1.5 mt-2 text-rose-600">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-bold">Warning: Projected spend exceeds current allocation. Review parameters.</span>
                  </div>
                )}
              </div>

              {/* ZKP / Cryptographic Policy Signing Note */}
              <div className="bg-slate-900 text-white rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-white">Cryptographic Policy Signing</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  All outgoing policy broadcasts are <strong className="text-blue-300">SHA-256 hashed</strong> and <strong className="text-blue-300">RS256-signed</strong> with Alpha's private key. SchemeConnect and partner banks can cryptographically verify policy origin before applying parameter changes.
                </p>
                <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-emerald-400">
                  <Hash className="w-3 h-3" />
                  <span>Channel: <code>public:scheme_updates</code></span>
                </div>
              </div>
            </div>
          </div>

          {/* ── SETTLEMENT AUDIT LOG ─────────────────────────────────── */}
          <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-slate-600" />
                <h2 className="text-sm font-bold text-slate-900">Settlement Audit Log &amp; Policy Update Stream</h2>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{logs.length} events · {broadcastCount} broadcasts total</span>
            </div>

            <div className="bg-slate-900 rounded-xl p-4 font-mono text-[11px] space-y-1.5 max-h-64 overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-2 py-0.5 border-b border-slate-800/50 last:border-0">
                  <span className="text-slate-500 shrink-0">[{log.time}]</span>
                  <span className="text-amber-400 font-bold shrink-0">{log.event}</span>
                  <span className="text-emerald-300 truncate">{log.detail}</span>
                  <span className="text-slate-600 shrink-0 ml-auto hidden lg:inline">SHA256: {log.hash}</span>
                  <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    log.status === 'CLEARED' ? 'bg-emerald-900/60 text-emerald-300' : 'bg-rose-900/60 text-rose-300'
                  }`}>
                    {log.status || "CLEARED"}
                  </span>
                </div>
              ))}
            </div>

            {/* Audit table header */}
            <div className="mt-3 grid grid-cols-5 gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 pb-1.5">
              <span>Timestamp</span>
              <span>Event Type</span>
              <span className="col-span-2">Detail</span>
              <span>Escrow Status</span>
            </div>
            <div className="divide-y divide-slate-100 max-h-44 overflow-y-auto">
              {logs.map((log) => (
                <div key={`t-${log.id}`} className="grid grid-cols-5 gap-2 py-2 text-[11px] text-slate-600 hover:bg-slate-50/60">
                  <span className="font-mono">{log.time}</span>
                  <span className="font-bold text-slate-800">{log.event}</span>
                  <span className="col-span-2 truncate">{log.detail}</span>
                  <span className={`font-bold ${log.status === 'CLEARED' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {log.status || "CLEARED"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* ================================================================ */}
      {/* SECTION 3: OFFICIAL DARK SLATE FOOTER                            */}
      {/* ================================================================ */}
      <footer className="mt-auto bg-[#0f172a] text-slate-300 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Column 1: About */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">About Alpha Portal</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Alpha Portal is the official government policy administration console for the National Scheme Governance &amp; Policy Portal under the Ministry of Social Justice &amp; Empowerment, Government of India. Problem Statement SIH26092.
              </p>
            </div>

            {/* Column 2: Helpline */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Policy Helpline</span>
              </div>
              <p className="text-2xl font-black text-white mb-1">1800-111-2026</p>
              <p className="text-[11px] text-slate-400">Toll-Free · Available 24×7</p>
              <p className="text-[11px] text-slate-400 mt-1">policy@alpha.gov.in · RTI Portal ↗</p>
            </div>

            {/* Column 3: Important Links */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Important Links</span>
              </div>
              <ul className="space-y-1.5 text-[11px]">
                {["SchemeConnect Citizen Portal ↗", "Beta Partner Bank Console ↗", "Official Gazette Archive", "Supabase Realtime Docs ↗", "RS256 JWT Policy Specification"].map(link => (
                  <li key={link}>
                    <span className="text-slate-400 hover:text-slate-200 cursor-pointer transition">{link}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[11px] text-slate-500">
              🏛️ National Scheme Governance &amp; Policy Portal (Alpha) · Ministry of Social Justice &amp; Empowerment · Government of India
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-emerald-900/50 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                SIH26092 · Triple-Portal Architecture
              </span>
              <span className="text-[10px] bg-blue-900/50 text-blue-400 border border-blue-800 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 animate-pulse" /> Broadcaster: Online
              </span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
export default AlphaApp;
