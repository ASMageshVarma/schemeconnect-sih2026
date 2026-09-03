import React, { useState, useEffect, useCallback } from 'react';
import {
  Building2, Radio, ExternalLink, ShieldCheck,
  FileText, Settings, Search, CheckCircle2, Lock, Unlock,
  Sparkles, RefreshCw, Landmark, ArrowRight, X, Printer,
  IndianRupee, Database, AlertTriangle, Hash, Zap, BarChart3,
  TrendingUp, Send, Shield, Globe, Users, Activity, Clock,
  Check, Key, Layers, Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AlphaGazetteModal } from './components/AlphaGazetteModal';
import {
  getAlphaSchemes, updateAlphaScheme, resetAlphaSchemes,
  triggerQuickDemo, subscribeToAlphaChanges
} from './utils/realtimeSync';
import { navigateToSchemeConnect } from './config/portalConfig';

// ── Utility: Browser-side SHA-256 Hash Generator ──
async function generateSHA256Hash(message) {
  try {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    let h = 0;
    for (let i = 0; i < message.length; i++) {
      h = (Math.imul(31, h) + message.charCodeAt(i)) | 0;
    }
    return Math.abs(h).toString(16).padStart(64, '0');
  }
}

// ── RS256 Simulated Cryptographic Signature Generator ──
function generateRS256Signature(payload) {
  const header = { alg: "RS256", typ: "JWT", kid: "ALPHA-GOV-RS256-PUBKEY-0x9812A" };
  const b64H = btoa(JSON.stringify(header));
  const b64P = btoa(JSON.stringify(payload));
  const sig = btoa(`${b64H}.${b64P}.ALPHA_GOV_PRIVATE_KEY_SIH2026`).slice(0, 43);
  return `${b64H}.${b64P}.${sig}`;
}

// ── Format Indian currency ──
function fmtINR(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

export function AlphaApp() {
  const [lang, setLang] = useState('en');
  const [viewMode, setViewMode] = useState('console'); // 'console' (All 3 Sections) | 'registry' (20 Statutory Schemes Directory)
  const [schemes, setSchemes] = useState(getAlphaSchemes());
  const [selectedSchemeId, setSelectedSchemeId] = useState("NSFDC_MICRO");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [gazetteScheme, setGazetteScheme] = useState(null);

  // Portal metrics
  const [totalSchemesCount] = useState(142);
  const [totalBudgetCr] = useState(1200);

  // Real-time broadcast logs (Settlement Audit Log)
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 1,
      time: new Date().toLocaleTimeString(),
      adminId: "ADM-POL-091",
      event: "GENESIS_POLICY_CLEARANCE",
      hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      detail: "Alpha Broadcaster Genesis Block • Supabase WebSockets 'public:scheme_updates' Active",
      escrowStatus: "CLEARED 🟢"
    },
    {
      id: 2,
      time: new Date(Date.now() - 45000).toLocaleTimeString(),
      adminId: "ADM-POL-044",
      event: "ESCROW_LOCK_ALLOCATION",
      hash: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
      detail: "DBT Clearing Webhook Emitted to Partner Bank Consortium (ZETA, EPSILON, MYBANK)",
      escrowStatus: "CLEARED 🟢"
    }
  ]);

  const [broadcastCount, setBroadcastCount] = useState(2);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);
  const [broadcastBannerMsg, setBroadcastBannerMsg] = useState("");

  // Section 2: Interactive Scheme Creation Form State
  const [newScheme, setNewScheme] = useState({
    name: "PMEGP Credit Subsidy 2026",
    category: "OBC",
    incomeThreshold: 250000,
    maxLoanAmount: 200000,
    verFactors: {
      aadhaar: true,
      pan: true,
      community: true,
      income: true
    },
    totalAllocation: 500000000 // ₹50,00,00,000
  });
  const [creationSuccess, setCreationSuccess] = useState(false);

  // Section 3: Policy Impact Simulator State
  const [simIncomeThreshold, setSimIncomeThreshold] = useState(250000);
  const [simSubsidyCap, setSimSubsidyCap] = useState(200000);

  // Dynamic Simulator Calculations
  const simEligibilityRate = Math.max(5, Math.min(96,
    Math.round(((simIncomeThreshold / 800000) * 0.55 + (simSubsidyCap / 2500000) * 0.45) * 100)
  ));
  const simProjectedBeneficiaries = Math.round((simEligibilityRate / 100) * 14200);
  const simBudgetExhaustionCr = Math.round((simProjectedBeneficiaries * (simSubsidyCap * 0.35)) / 10000000);
  const simExhaustionPct = Math.min(100, Math.round((simBudgetExhaustionCr / totalBudgetCr) * 100));

  // Current selected scheme in editor
  const selectedScheme = schemes.find(s => s.scheme_id === selectedSchemeId) || schemes[0];

  // Emit Broadcast Helper (Supabase WebSockets + DBT clearing webhook + SHA-256 + RS256)
  const broadcastPolicyUpdate = useCallback(async (actionType, schemeData, description) => {
    const timestamp = new Date().toLocaleTimeString();
    const adminId = "ADM-POL-091";

    // 1. Generate SHA-256 hash of criteria
    const criteriaString = JSON.stringify({
      scheme_id: schemeData.scheme_id || "SCHEME-2026-CUSTOM",
      name: schemeData.scheme_name || schemeData.name,
      category: schemeData.target_category || schemeData.category || "OBC",
      income_cap: schemeData.income_cap || schemeData.incomeThreshold,
      max_loan: schemeData.sanctioned_amount || schemeData.maxLoanAmount,
      timestamp: Date.now()
    });
    const hash = await generateSHA256Hash(criteriaString);

    // 2. Cryptographic RS256 Policy Signing
    const signedJWT = generateRS256Signature({
      iss: "alpha-governance.gov.in",
      aud: ["schemeconnect.in", "beta-banking.schemeconnect.in"],
      sha256_criteria: hash,
      action: actionType,
      admin: adminId,
      timestamp: Date.now()
    });

    // 3. Broadcast payload over Supabase WebSockets channel `public:scheme_updates` + BroadcastChannel
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const channel = new BroadcastChannel('public:scheme_updates');
        channel.postMessage({
          channel: 'public:scheme_updates',
          event: actionType,
          hash: hash,
          jwt_token: signedJWT,
          scheme: schemeData,
          dbt_clearing_webhook: true,
          timestamp: new Date().toISOString()
        });
        channel.close();

        // 4. Emit DBT clearing webhook to partner bank nodes (Beta Portal)
        const dbtChannel = new BroadcastChannel('schemeconnect_sanctions');
        dbtChannel.postMessage({
          action: 'DBT_CLEARING_WEBHOOK',
          source: 'ALPHA_POLICY_NODE',
          schemeId: schemeData.scheme_id,
          schemeName: schemeData.scheme_name || schemeData.name,
          hash: hash,
          escrow_status: 'LOCKED_AND_CLEARED',
          timestamp: new Date().toISOString()
        });
        dbtChannel.close();
      }
    } catch (e) {
      console.warn("Realtime BroadcastChannel note:", e);
    }

    // 5. Append to Settlement Audit Log
    setAuditLogs(prev => [
      {
        id: Date.now(),
        time: timestamp,
        adminId: adminId,
        event: actionType,
        hash: hash,
        detail: description,
        escrowStatus: "CLEARED 🟢"
      },
      ...prev.slice(0, 19)
    ]);

    setBroadcastCount(c => c + 1);
    setBroadcastSuccess(true);
    setBroadcastBannerMsg("Policy Update Broadcasted & Escrow Allocations Locked 🟢");
    setTimeout(() => {
      setBroadcastSuccess(false);
      setBroadcastBannerMsg("");
    }, 3500);

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.2 } });
    } catch (e) {}
  }, []);

  // Modify policy parameter on existing scheme
  const handleFieldChange = async (field, value) => {
    const parsedValue = ['sanctioned_amount', 'age_min', 'age_max', 'income_cap'].includes(field)
      ? Number(value)
      : value;
    const updated = updateAlphaScheme(selectedScheme.scheme_id, { [field]: parsedValue }, `Admin updated ${field} to ${value}`);
    setSchemes(updated);
    
    await broadcastPolicyUpdate(
      "POLICY_PARAM_UPDATE",
      { ...selectedScheme, [field]: parsedValue },
      `${selectedScheme.scheme_id}: Modified ${field} ➔ ${value}. SHA-256 hashed & RS256 signed.`
    );
  };

  // 1-Click Fast Track Demos
  const handleQuickDemo = async (type) => {
    const updated = triggerQuickDemo(type);
    if (updated) {
      setSchemes(updated);
      await broadcastPolicyUpdate(
        type,
        selectedScheme,
        `Fast-track demonstration '${type}' triggered. Cross-tab WebSocket sync emitted.`
      );
    }
  };

  // Reset to statutory defaults
  const handleResetAll = async () => {
    const updated = resetAlphaSchemes();
    setSchemes(updated);
    await broadcastPolicyUpdate(
      "SCHEME_RESET_DEFAULT",
      { scheme_id: "ALL_SCHEMES" },
      "All statutory scheme parameters reset to official gazette baselines."
    );
  };

  // Handle New Scheme Publication
  const handlePublishNewScheme = async (e) => {
    e.preventDefault();
    if (!newScheme.name.trim()) return;

    const newSchemeRecord = {
      scheme_id: `SCHEME-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      scheme_name: newScheme.name,
      ministry: "Ministry of Social Justice & Empowerment",
      target_category: newScheme.category,
      caste_eligibility: [newScheme.category],
      income_cap: Number(newScheme.incomeThreshold),
      sanctioned_amount: Number(newScheme.maxLoanAmount),
      total_allocation: Number(newScheme.totalAllocation),
      concessional_interest_rate: 4.5,
      age_min: 18,
      age_max: 55,
      verification_factors: newScheme.verFactors
    };

    setCreationSuccess(true);
    await broadcastPolicyUpdate(
      "NEW_SCHEME_PUBLISHED",
      newSchemeRecord,
      `Published "${newScheme.name}" [${newScheme.category}] with ${fmtINR(newScheme.totalAllocation)} fund allocation.`
    );

    setTimeout(() => {
      setCreationSuccess(false);
    }, 4000);
  };

  // Subscribe to real-time changes
  useEffect(() => {
    const unsubscribe = subscribeToAlphaChanges((updatedSchemes) => {
      setSchemes(updatedSchemes);
    });
    return unsubscribe;
  }, []);

  // Filter schemes for Statutory Registry View
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
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col">
      
      {/* Official Gazette Modal */}
      {gazetteScheme && (
        <AlphaGazetteModal
          scheme={gazetteScheme}
          lang={lang}
          onClose={() => setGazetteScheme(null)}
        />
      )}

      {/* ========================================================================= */}
      {/* SECTION 1: OFFICIAL HEADER & PORTAL METRICS                                */}
      {/* ========================================================================= */}
      <header className="bg-[#0f172a] text-white sticky top-0 z-40 shadow-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-4">
            
            {/* Title & Brand */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setViewMode('console')}>
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-inner">
                <Landmark className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-base sm:text-lg text-white tracking-tight">
                    🏛️ National Scheme Governance &amp; Policy Portal (Alpha)
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                  Ministry of Social Justice &amp; Empowerment • Government of India • Policy Authority
                </p>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-semibold">
                <button
                  onClick={() => setViewMode('console')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'console'
                      ? 'bg-blue-600 text-white shadow-xs font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Policy &amp; Simulator Console</span>
                </button>

                <button
                  onClick={() => setViewMode('registry')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'registry'
                      ? 'bg-blue-600 text-white shadow-xs font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Scheme Registry ({schemes.length})</span>
                </button>
              </div>

              {/* Link to SchemeConnect */}
              <button
                onClick={() => navigateToSchemeConnect("/", true)}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold transition hidden md:flex items-center gap-1 cursor-pointer"
                title="Open SchemeConnect Citizen Portal in a separate tab"
              >
                <span>SchemeConnect ↗</span>
              </button>
            </div>

          </div>
        </div>

        {/* Live Status Indicators Strip */}
        <div className="bg-[#0b1329] border-t border-slate-800 py-2 px-4">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[11px]">
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* Indicator 1: Broadcaster Status */}
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-950/60 px-3 py-0.5 rounded-full border border-emerald-800/80">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                Broadcaster Status: Online 🟢
              </span>

              {/* Indicator 2: Realtime WebSockets */}
              <span className="flex items-center gap-1.5 text-blue-300 font-semibold bg-blue-950/60 px-3 py-0.5 rounded-full border border-blue-800/80">
                <Activity className="w-3 h-3 text-blue-400" />
                Realtime WebSockets: Active
              </span>

              {/* Indicator 3: Active Schemes */}
              <span className="flex items-center gap-1.5 text-purple-300 font-semibold bg-purple-950/60 px-3 py-0.5 rounded-full border border-purple-800/80">
                <Database className="w-3 h-3 text-purple-400" />
                Active Schemes: {totalSchemesCount}
              </span>

              {/* Indicator 4: Allocated Budget */}
              <span className="flex items-center gap-1.5 text-amber-300 font-semibold bg-amber-950/60 px-3 py-0.5 rounded-full border border-amber-800/80">
                <IndianRupee className="w-3 h-3 text-amber-400" />
                Allocated Budget: ₹{totalBudgetCr.toLocaleString('en-IN')} Cr
              </span>

            </div>

            {/* RS256 Key & Broadcast Channel Info */}
            <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px]">
              <span className="text-emerald-400 font-semibold">Channel: public:scheme_updates</span>
              <span className="text-slate-600">|</span>
              <span>RS256 Private Key: Signed</span>
            </div>
          </div>
        </div>
      </header>

      {/* Real-time Broadcast Confirmation Toast Banner */}
      {broadcastSuccess && (
        <div className="bg-emerald-600 text-white py-2.5 px-4 shadow-md sticky top-24 z-30 animate-fadeIn">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs font-bold">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-white animate-bounce" />
              <span>{broadcastBannerMsg}</span>
            </div>
            <span className="text-[10px] font-mono bg-emerald-700 px-2 py-0.5 rounded border border-emerald-500">
              Supabase Channel &amp; DBT Webhook Cleared ✓
            </span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAIN VIEW: ENTERPRISE 3-SECTION CONSOLE                                   */}
      {/* ========================================================================= */}
      {viewMode === 'console' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8 animate-fadeIn">
          
          {/* Fast-Track Demo Controls Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                1-Click Fast Track Policy Broadcasts (Observe SchemeConnect live unlock):
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Broadcasts criteria adjustments across browser tabs in &lt;10ms via WebSockets &amp; BroadcastChannel.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setSelectedSchemeId("NSFDC_MICRO"); handleQuickDemo("EXTEND_AGE_40"); }}
                className="px-3 py-1.5 bg-[#0f172a] hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Unlock className="w-3.5 h-3.5 text-amber-300" />
                <span>Extend NSFDC Age (38 ➔ 40)</span>
              </button>

              <button
                onClick={() => { setSelectedSchemeId("NSFDC_MICRO"); handleQuickDemo("RESTRICT_AGE_38"); }}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Lock className="w-3.5 h-3.5 text-slate-300" />
                <span>Revert NSFDC Age (40 ➔ 38)</span>
              </button>

              <button
                onClick={handleResetAll}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset Schemes</span>
              </button>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* SECTION 2: POLICY MANAGEMENT & SCHEME CREATION CONSOLE                  */}
          {/* ======================================================================= */}
          <section className="space-y-6">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-600" />
                  Section 2: Policy Management &amp; Scheme Creation Console
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Publish brand-new welfare schemes or fine-tune statutory parameters with automated escrow allocation.
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-800 px-2.5 py-1 rounded-lg border border-blue-200">
                POSTGRESQL SYNC • RS256 SIGNED
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column (5 Cols): Scheme Selector & Live Parameter Modifier */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <span className="text-xs font-black uppercase text-slate-800 tracking-wider">
                      Select Active Scheme ({schemes.length})
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Live Policy Editor</span>
                  </div>

                  <select
                    value={selectedSchemeId}
                    onChange={(e) => setSelectedSchemeId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {schemes.map(s => (
                      <option key={s.scheme_id} value={s.scheme_id}>
                        {s.scheme_name} ({s.ministry.slice(0, 25)}...)
                      </option>
                    ))}
                  </select>

                  {/* Current Scheme Parameter Sliders */}
                  <div className="space-y-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-center mb-1">
                        <label className="font-semibold text-slate-700">Max Age Ceiling:</label>
                        <span className="font-bold text-blue-700">{selectedScheme.age_max} Years</span>
                      </div>
                      <input
                        type="range"
                        min="25"
                        max="65"
                        value={selectedScheme.age_max}
                        onChange={(e) => handleFieldChange("age_max", e.target.value)}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-center mb-1">
                        <label className="font-semibold text-slate-700">Annual Income Ceiling:</label>
                        <span className="font-bold text-blue-700">₹{Number(selectedScheme.income_cap).toLocaleString('en-IN')}</span>
                      </div>
                      <input
                        type="range"
                        min="50000"
                        max="800000"
                        step="25000"
                        value={selectedScheme.income_cap}
                        onChange={(e) => handleFieldChange("income_cap", e.target.value)}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-center mb-1">
                        <label className="font-semibold text-slate-700">Max Sanction / Subsidy:</label>
                        <span className="font-bold text-blue-700">₹{Number(selectedScheme.sanctioned_amount).toLocaleString('en-IN')}</span>
                      </div>
                      <input
                        type="range"
                        min="50000"
                        max="5000000"
                        step="50000"
                        value={selectedScheme.sanctioned_amount}
                        onChange={(e) => handleFieldChange("sanctioned_amount", e.target.value)}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => broadcastPolicyUpdate("POLICY_PARAM_BROADCAST", selectedScheme, `Re-broadcasted ${selectedScheme.scheme_name} statutory parameters.`)}
                  className="w-full py-2.5 bg-[#0f172a] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish &amp; Broadcast Scheme Criteria</span>
                </button>
              </div>

              {/* Right Column (7 Cols): Interactive Scheme Creation Form */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-emerald-600" />
                      Create &amp; Publish New Welfare Scheme
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Calculates SHA-256 criteria hash, signs RS256 JWT, and transmits DBT webhook.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
                    REALTIME BROADCAST
                  </span>
                </div>

                <form onSubmit={handlePublishNewScheme} className="space-y-4 text-xs">
                  {/* Scheme Name */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Scheme Name:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., PMEGP Credit Subsidy 2026"
                      value={newScheme.name}
                      onChange={(e) => setNewScheme({ ...newScheme, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Target Category */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Target Category:
                      </label>
                      <select
                        value={newScheme.category}
                        onChange={(e) => setNewScheme({ ...newScheme, category: e.target.value })}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="OBC">OBC (Other Backward Classes)</option>
                        <option value="SC">SC (Scheduled Caste)</option>
                        <option value="ST">ST (Scheduled Tribe)</option>
                        <option value="EWS">EWS (Economically Weaker Section)</option>
                        <option value="General">General Category</option>
                      </select>
                    </div>

                    {/* Total Fund Allocation Input Field */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Total Fund Allocation (INR):
                      </label>
                      <input
                        type="number"
                        required
                        min="10000000"
                        step="5000000"
                        value={newScheme.totalAllocation}
                        onChange={(e) => setNewScheme({ ...newScheme, totalAllocation: Number(e.target.value) })}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        Formatted: {fmtINR(newScheme.totalAllocation)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Maximum Annual Income Threshold */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-center mb-1">
                        <label className="font-bold text-slate-700">Max Annual Income Threshold:</label>
                        <span className="font-bold text-emerald-700">{fmtINR(newScheme.incomeThreshold)}</span>
                      </div>
                      <input
                        type="range"
                        min="100000"
                        max="800000"
                        step="25000"
                        value={newScheme.incomeThreshold}
                        onChange={(e) => setNewScheme({ ...newScheme, incomeThreshold: Number(e.target.value) })}
                        className="w-full accent-emerald-600 cursor-pointer"
                      />
                    </div>

                    {/* Max Loan / Subsidy Amount */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-center mb-1">
                        <label className="font-bold text-slate-700">Max Loan / Subsidy Amount:</label>
                        <span className="font-bold text-emerald-700">{fmtINR(newScheme.maxLoanAmount)}</span>
                      </div>
                      <input
                        type="range"
                        min="50000"
                        max="2000000"
                        step="50000"
                        value={newScheme.maxLoanAmount}
                        onChange={(e) => setNewScheme({ ...newScheme, maxLoanAmount: Number(e.target.value) })}
                        className="w-full accent-emerald-600 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Required Verification Factors Checkboxes */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-2">
                      Required Verification Factors (ZKP Enforcement):
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { key: "aadhaar", label: "Aadhaar eKYC" },
                        { key: "pan", label: "PAN Structure" },
                        { key: "community", label: "Community Cert." },
                        { key: "income", label: "Income Cert." }
                      ].map(item => (
                        <label
                          key={item.key}
                          className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center space-x-2 cursor-pointer transition ${
                            newScheme.verFactors[item.key]
                              ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={newScheme.verFactors[item.key]}
                            onChange={(e) => setNewScheme({
                              ...newScheme,
                              verFactors: { ...newScheme.verFactors, [item.key]: e.target.checked }
                            })}
                            className="w-3.5 h-3.5 accent-blue-600 rounded"
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-mono">
                      Target: public:scheme_updates
                    </span>

                    <button
                      type="submit"
                      className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-sm cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Publish &amp; Broadcast Policy Update</span>
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </section>

          {/* ======================================================================= */}
          {/* SECTION 3: POLICY SIMULATOR & SETTLEMENT AUDIT LOG                      */}
          {/* ======================================================================= */}
          <section className="space-y-6">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-amber-600" />
                  Section 3: Policy Simulator &amp; Settlement Audit Log
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dynamic visual simulation of applicant eligibility rates, budget exhaustion, and live cryptographic audit log stream.
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200">
                AUDIT TRAIL • SHA-256 HASHED
              </span>
            </div>

            {/* Policy Impact Simulator */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  Policy Impact Simulator (Pre-Deployment Risk &amp; Budget Modeling)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Real-time Formula Engine
                </span>
              </div>

              {/* Simulator Sliders & Outputs Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                {/* Sliders (6 Cols) */}
                <div className="lg:col-span-6 space-y-4">
                  
                  {/* Slider 1: Income Threshold */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-slate-800">
                        Simulated Annual Income Cap:
                      </label>
                      <span className="text-sm font-black text-blue-700 font-mono">
                        {fmtINR(simIncomeThreshold)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="100000"
                      max="800000"
                      step="25000"
                      value={simIncomeThreshold}
                      onChange={(e) => setSimIncomeThreshold(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>₹1,00,000 (Strict EWS)</span>
                      <span>₹8,00,000 (Broad Eligibility)</span>
                    </div>
                  </div>

                  {/* Slider 2: Subsidy / Loan Cap */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-slate-800">
                        Simulated Max Subsidy / Loan Amount:
                      </label>
                      <span className="text-sm font-black text-emerald-700 font-mono">
                        {fmtINR(simSubsidyCap)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="50000"
                      max="2500000"
                      step="50000"
                      value={simSubsidyCap}
                      onChange={(e) => setSimSubsidyCap(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>₹50,000 (Micro)</span>
                      <span>₹25,00,000 (MSME Scale)</span>
                    </div>
                  </div>

                </div>

                {/* Simulated Metrics Visual Displays (6 Cols) */}
                <div className="lg:col-span-6 grid grid-cols-2 gap-4">
                  
                  {/* Output Card 1: Projected Eligibility Rate */}
                  <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-blue-800 uppercase block">
                        Projected Citizen Eligibility
                      </span>
                      <span className="text-3xl font-black text-blue-900 mt-1 block">
                        {simEligibilityRate}%
                      </span>
                    </div>
                    <p className="text-[11px] text-blue-700 mt-2">
                      Approx. <b>{simProjectedBeneficiaries.toLocaleString('en-IN')}</b> qualified applicants in state pool.
                    </p>
                  </div>

                  {/* Output Card 2: Budget Exhaustion */}
                  <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-amber-800 uppercase block">
                        Est. Budget Exhaustion
                      </span>
                      <span className="text-3xl font-black text-amber-900 mt-1 block">
                        ₹{simBudgetExhaustionCr} Cr
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-800 mt-2">
                      Represents <b>{simExhaustionPct}%</b> of total ₹{totalBudgetCr} Cr allocation.
                    </p>
                  </div>

                </div>

              </div>
            </div>

            {/* Settlement Audit Log Stream Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black uppercase text-slate-800 tracking-wider block">
                    Settlement Audit Log &amp; Policy Stream
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Real-time immutable log of policy broadcasts, admin clearances, and SHA-256 hashes
                  </span>
                </div>

                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                  Total Broadcasts: {broadcastCount}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-3.5">Timestamp</th>
                      <th className="p-3.5">Admin ID</th>
                      <th className="p-3.5">Event Action</th>
                      <th className="p-3.5">SHA-256 Policy Hash</th>
                      <th className="p-3.5">Escrow Clearance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 transition">
                        <td className="p-3.5 text-slate-500">{log.time}</td>
                        <td className="p-3.5 font-bold text-slate-800">{log.adminId}</td>
                        <td className="p-3.5 text-blue-900 font-sans font-semibold">
                          {log.event}
                          <span className="block text-[10px] text-slate-400 font-mono font-normal">
                            {log.detail}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-600">
                          <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[10px]">
                            {log.hash.slice(0, 18)}...{log.hash.slice(-8)}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                            {log.escrowStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </section>

        </main>
      )}

      {/* ========================================================================= */}
      {/* VIEW B: SCHEME REGISTRY VIEW (STATUTORY DIRECTORY)                        */}
      {/* ========================================================================= */}
      {viewMode === 'registry' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full animate-fadeIn">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Statutory Scheme Registry ({schemes.length} Active Schemes)
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Central &amp; state government welfare credit schemes with gazette certificates.
              </p>
            </div>

            <button
              onClick={() => setViewMode('console')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs self-start"
            >
              <span>← Back to Policy &amp; Simulator Console</span>
            </button>
          </div>

          {/* Filter & Search Controls */}
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
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
              />
            </div>
          </div>

          {/* 20 Schemes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSchemes.map((scheme) => (
              <div 
                key={scheme.scheme_id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 shadow-xs transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-slate-500 truncate max-w-[200px]">
                      {scheme.ministry}
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      {scheme.scheme_id}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 leading-snug mb-1">
                    {scheme.scheme_name}
                  </h3>

                  <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 my-3 space-y-1 text-xs">
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
                    onClick={() => {
                      setSelectedSchemeId(scheme.scheme_id);
                      setViewMode('console');
                    }}
                    className="py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg text-xs font-semibold transition cursor-pointer"
                    title="Edit in Section 2 Console"
                  >
                    <Settings className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* GLOBAL FOOTER: GOVERNMENT POLICY & AUDIT SPECIFICATION                    */}
      {/* ========================================================================= */}
      <footer className="mt-auto bg-[#0f172a] text-slate-400 py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-xs">
            
            {/* Column 1: Ministry Authority */}
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
                <Building2 className="w-4 h-4 text-blue-400" />
                <span>Statutory Governance Authority</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Official Ministry Scheme Administration Console under Ministry of Social Justice &amp; Empowerment (MoSJE), Ministry of MSME, and Ministry of Housing and Urban Affairs (MoHUA), Government of India.
              </p>
              <span className="text-[10px] font-mono text-slate-500 block mt-2">
                Statutory Gazette Order: SO/2026/POL-98214
              </span>
            </div>

            {/* Column 2: Cryptographic Infrastructure */}
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Cryptographic Broadcaster Specs</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-400">
                <li className="flex items-center justify-between">
                  <span>Channel:</span>
                  <span className="font-mono text-slate-200">public:scheme_updates</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Hashing Standard:</span>
                  <span className="font-mono text-emerald-400">SHA-256 (FIPS 180-4)</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Digital Signature:</span>
                  <span className="font-mono text-slate-200">RS256 Private Key</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>DBT Escrow Clearing:</span>
                  <span className="font-mono text-slate-200">Direct Partner Webhooks</span>
                </li>
              </ul>
            </div>

            {/* Column 3: Policy Helpline & Node Status */}
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
                <Radio className="w-4 h-4 text-purple-400" />
                <span>Realtime Operations &amp; Support</span>
              </div>
              <p className="text-slate-300 font-mono text-lg font-bold">1800-111-2026</p>
              <p className="text-[11px] text-slate-500">National Policy Helpline (Toll-Free • 24×7)</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[11px] text-emerald-300 font-semibold">
                  Alpha Broadcaster Node: ALPHA-GOV-DELHI-01
                </span>
              </div>
            </div>

          </div>

          <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
            <p className="text-slate-500">
              © 2026 ALPHA PORTAL • Ministry of Social Justice &amp; Empowerment • Problem Statement SIH26092
            </p>
            <div className="flex items-center gap-3">
              <span className="text-slate-400">Decoupled Triple-Portal Ecosystem</span>
              <span className="text-slate-600">|</span>
              <span className="text-emerald-400 font-mono">WebSockets: ACTIVE</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default AlphaApp;
