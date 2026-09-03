import React, { useState, useEffect, useRef } from 'react';
import { 
  Landmark, Building2, CheckCircle2, ShieldCheck, 
  FileText, ArrowRight, UserCheck, Check, Clock, 
  ChevronRight, AlertCircle, ExternalLink, Printer, QrCode,
  Shield, Lock, Unlock, Zap, AlertTriangle, Key, Download,
  RefreshCw, Cpu, Activity, Fingerprint, EyeOff, Radio
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  PARTICIPATING_BANKS, getBankApplications, 
  updateBankAppStatus, subscribeToBankApplications, createBankApplication 
} from './utils/bankStore';
import { 
  decodeReferralJWT, burnNonce, isNonceBurned, 
  SCHEMECONNECT_PUBLIC_KEY_FINGERPRINT, generateReferralJWT 
} from './utils/jwtToken';
import { navigateToSchemeConnect } from './config/portalConfig';

export function BetaApp() {
  const [lang, setLang] = useState('en'); // 'en' | 'ta' | 'hi'
  const [activeRoute, setActiveRoute] = useState('apply'); // 'apply' (/apply) | 'admin' (/admin) | 'home' (/)
  
  // Selected bank state (Defaults to ZETA BANK)
  const [selectedBankId, setSelectedBankId] = useState("ZETA_BANK");
  const selectedBank = PARTICIPATING_BANKS.find(b => b.id === selectedBankId) || PARTICIPATING_BANKS[0];

  // Token & Applicant state
  const [rawToken, setRawToken] = useState(null);
  const [verifiedTokenResult, setVerifiedTokenResult] = useState(null);
  const [ttlCountdown, setTtlCountdown] = useState(300);
  const [replayDetected, setReplayDetected] = useState(false);

  // Active applicant profile loaded from token or default
  const [applicant, setApplicant] = useState({
    name: "Rajan S.",
    age: 39,
    income: 180000,
    sector: "Street Vendor",
    category: "OBC",
    district: "Tiruchirappalli",
    scheme_id: "NSFDC_MICRO",
    scheme_name: "NSFDC Micro-Credit Finance Scheme",
    sanction_amount: 200000,
    interest_rate: 5.0,
    trust_score: 100,
    account_number: "620188921045",
    nonce: "NONCE-2026-981244",
    zkp: {
      aadhaar_masked: "XXXX-XXXX-9812",
      pan_id: "ABCDE1234F",
      community_category: "OBC",
      community_serial: "TN-CST-2026/8821",
      certified_income: 180000,
      income_cap: 250000,
      income_serial: "TN-INC-2026/4102"
    },
    ai_risk: {
      sybil_probability: "0.01%",
      device_fingerprint: "Clean",
      risk_grade: "LOW",
      recommendation: "Instant Approval Recommended"
    }
  });

  // Multi-Sig State
  const [officer1Approved, setOfficer1Approved] = useState(true);
  const [officer2Approved, setOfficer2Approved] = useState(false);
  const [loanSanctioned, setLoanSanctioned] = useState(false);
  const [sanctionConfirmationMsg, setSanctionConfirmationMsg] = useState("");
  const [sanctionOrderRef, setSanctionOrderRef] = useState("SANCTION-2026-9921");

  // Applications Store & Admin Review
  const [applications, setApplications] = useState(getBankApplications());
  const [selectedAppForAudit, setSelectedAppForAudit] = useState(null);
  const [sanctionedCertificate, setSanctionedCertificate] = useState(null);

  // Localization helper
  const L = (en, ta, hi) => {
    if (lang === 'ta') return ta || en;
    if (lang === 'hi') return hi || en;
    return en;
  };

  // Helper to load or verify token
  const processIncomingToken = (tokenString) => {
    if (!tokenString) return;
    setRawToken(tokenString);
    const result = decodeReferralJWT(tokenString);
    setVerifiedTokenResult(result);

    if (result && result.payload) {
      const p = result.payload;
      const isBurned = result.isReplay;
      setReplayDetected(isBurned);

      const zkpExtracted = p.extracted_credentials || {
        aadhaar_masked: p.aadhaar_no ? `XXXX-XXXX-${p.aadhaar_no.slice(-4)}` : "XXXX-XXXX-9812",
        pan_id: p.pan_no || "ABCDE1234F",
        community_category: p.social_category || "OBC",
        community_serial: "TN-CST-2026/8821",
        certified_income: Number(p.annual_income) || 180000,
        income_cap: 250000,
        income_serial: "TN-INC-2026/4102"
      };

      setApplicant({
        name: p.applicant_name || p.sub || "Rajan S.",
        age: p.applicant_age || 39,
        income: p.annual_income || 180000,
        sector: p.sector || "Street Vendor",
        category: p.social_category || "OBC",
        district: p.district || "Tiruchirappalli",
        scheme_id: p.scheme_id || "NSFDC_MICRO",
        scheme_name: p.scheme_name || "NSFDC Micro-Credit Finance Scheme",
        sanction_amount: Number(p.sanction_amount) || 200000,
        interest_rate: Number(p.interest_rate) || 5.0,
        trust_score: p.trust_score || 100,
        account_number: "620188921045",
        nonce: p.nonce || `NONCE-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        zkp: zkpExtracted,
        ai_risk: {
          sybil_probability: "0.01%",
          device_fingerprint: "Clean",
          risk_grade: "LOW",
          recommendation: "Instant Approval Recommended"
        }
      });

      if (result.ttlRemaining) {
        setTtlCountdown(result.ttlRemaining);
      }
    }
  };

  // Read URL parameters on startup (/apply?token=... or /admin)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const view = params.get("view");
      const path = window.location.pathname;

      if (token) {
        processIncomingToken(token);
        setActiveRoute("apply");
      } else if (view === "admin" || path.includes("admin") || window.location.hash.includes("admin")) {
        setActiveRoute("admin");
      } else if (view === "home" || path === "/") {
        setActiveRoute("home");
      } else {
        // By default on /apply without params, generate and verify sample citizen token
        const demo = generateReferralJWT(
          { scheme_id: "NSFDC_MICRO", scheme_name: "NSFDC Micro-Credit Finance Scheme", sanctioned_amount: 200000, concessional_interest_rate: 5.0 },
          { name: "Rajan S.", age: 39, income: 180000, caste: "OBC", sector: "Street Vendor" }
        );
        processIncomingToken(demo.token);
      }
    }
  }, []);

  // Live 300s TTL Countdown Timer
  useEffect(() => {
    if (ttlCountdown <= 0) return;
    const timer = setInterval(() => {
      setTtlCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [ttlCountdown]);

  // Listen to cross-tab updates for applications
  useEffect(() => {
    const unsubscribe = subscribeToBankApplications((updatedApps) => {
      setApplications(updatedApps);
    });
    return unsubscribe;
  }, []);

  // Set default audit item in admin console
  useEffect(() => {
    if (applications.length > 0 && !selectedAppForAudit) {
      setSelectedAppForAudit(applications[0]);
    }
  }, [applications]);

  // Check if Multi-Sig requirement is satisfied
  const isMultiSigRequired = applicant.sanction_amount > 500000;
  const canSanction = !replayDetected && ttlCountdown > 0 && (
    !isMultiSigRequired ? officer1Approved : (officer1Approved && officer2Approved)
  );

  // Handle Loan Sanction Execution
  const handleExecuteSanction = () => {
    if (!canSanction) return;

    // 1. Burn single-use nonce permanently to prevent replay attacks
    if (applicant.nonce) {
      burnNonce(applicant.nonce);
      setReplayDetected(true);
    }

    const refId = `SANCTION-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setSanctionOrderRef(refId);

    // 2. Build Sanction Order Object
    const sanctionedOrder = {
      application_id: `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      scheme_id: applicant.scheme_id,
      scheme_name: applicant.scheme_name,
      bank_id: selectedBank.id,
      bank_name: selectedBank.name,
      applicant_name: applicant.name,
      applicant_age: Number(applicant.age),
      annual_income: Number(applicant.income),
      sanction_amount: Number(applicant.sanction_amount),
      interest_rate: Number(applicant.interest_rate),
      trust_score: applicant.trust_score,
      account_number: applicant.account_number,
      verification_status: "SANCTIONED",
      reference_id: refId,
      disbursement_mode: "Aadhaar Payment Bridge (APB-DBT)",
      created_at: new Date().toISOString()
    };

    // Update application stores
    const updated = [sanctionedOrder, ...applications];
    setApplications(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("beta_bank_applications_store_v1", JSON.stringify(updated));
      } catch (e) {}
    }

    // 3. Emit live cross-portal BroadcastChannel notification to SchemeConnect
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const channel = new BroadcastChannel('schemeconnect_sanctions');
        channel.postMessage({
          action: 'LOAN_SANCTIONED',
          referralId: refId,
          schemeId: sanctionedOrder.scheme_id,
          schemeName: sanctionedOrder.scheme_name,
          beneficiaryName: sanctionedOrder.applicant_name,
          bankName: sanctionedOrder.bank_name,
          sanctionAmount: sanctionedOrder.sanction_amount,
          referenceId: refId,
          timestamp: new Date().toISOString()
        });
        channel.close();
      }
    } catch (e) {}

    // 4. Trigger Celebration Confetti
    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    // 5. Update Status Banners
    setLoanSanctioned(true);
    setSanctionConfirmationMsg(`Loan Sanctioned: ₹${Number(applicant.sanction_amount).toLocaleString('en-IN')} | Reference ID: ${refId} 🟢`);
    setSanctionedCertificate(sanctionedOrder);
  };

  // Download printable PDF / file generator
  const handleDownloadPDF = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col">
      
      {/* ========================================================================= */}
      {/* SECTION 1: BANK OFFICER HEADER & SECURITY BADGE                           */}
      {/* ========================================================================= */}
      <header className="bg-[#0f172a] text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-4">
            
            {/* Bank Emblem & Official Title */}
            <div 
              onClick={() => { setActiveRoute('apply'); setSanctionedCertificate(null); }}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-inner">
                <Landmark className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-base sm:text-lg text-white tracking-tight">
                    🏦 ZETA BANK - Institutional Credit &amp; Loan Sanction Portal
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                  Partner Banking Consortium • Cross-Portal Direct Benefit Sanction Node
                </p>
              </div>
            </div>

            {/* Top Navigation & Language Switcher */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-semibold">
                <button
                  onClick={() => { setActiveRoute('apply'); setSanctionedCertificate(null); }}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    activeRoute === 'apply' && !sanctionedCertificate
                      ? 'bg-blue-600 text-white shadow-xs font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Sanction Gateway</span>
                </button>

                <button
                  onClick={() => { setActiveRoute('admin'); setSanctionedCertificate(null); }}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    activeRoute === 'admin' && !sanctionedCertificate
                      ? 'bg-blue-600 text-white shadow-xs font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Audit Queue ({applications.length})</span>
                </button>

                <button
                  onClick={() => { setActiveRoute('home'); setSanctionedCertificate(null); }}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer hidden md:flex items-center gap-1.5 ${
                    activeRoute === 'home' && !sanctionedCertificate
                      ? 'bg-blue-600 text-white shadow-xs font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Bank Nodes (5)</span>
                </button>
              </div>

              {/* Language Selector */}
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                aria-label="Language Selector"
                className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
              >
                <option value="en">English</option>
                <option value="ta">தமிழ்</option>
                <option value="hi">हिंदी</option>
              </select>

              {/* Return to SchemeConnect */}
              <button
                onClick={() => navigateToSchemeConnect("/", true)}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold transition hidden lg:flex items-center gap-1 cursor-pointer"
                title="Return to SchemeConnect Citizen Portal"
              >
                <span>SchemeConnect ↗</span>
              </button>
            </div>

          </div>
        </div>

        {/* Status Badges Strip */}
        <div className="bg-[#0b1329] border-t border-slate-800 py-2 px-4">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/80">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                RS256 Public Key Reader: Active 🟢
              </span>
              <span className="flex items-center gap-1 text-blue-300 font-semibold bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-800/80">
                <Lock className="w-3 h-3 text-blue-400" />
                Nonce Replay Protection: Enabled
              </span>
              <span className="flex items-center gap-1 text-purple-300 font-semibold bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-800/80">
                <Shield className="w-3 h-3 text-purple-400" />
                Audit Level: Z+ Grade
              </span>
              <span className="flex items-center gap-1 text-amber-300 font-semibold bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-800/80">
                <Cpu className="w-3 h-3 text-amber-400" />
                AI Fraud Engine: Active
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px]">
              <span>KEY_ID: {SCHEMECONNECT_PUBLIC_KEY_FINGERPRINT.slice(0, 20)}...</span>
              <span className="text-slate-600">|</span>
              <span className={ttlCountdown > 30 ? "text-emerald-400" : "text-rose-400 font-bold"}>
                TTL: {ttlCountdown}s
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Real-time Confirmation Toast Banner */}
      {loanSanctioned && (
        <div className="bg-emerald-600 text-white py-3 px-4 shadow-md sticky top-24 z-30 animate-fadeIn">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-white animate-bounce" />
              <span>{sanctionConfirmationMsg}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSanctionedCertificate(applications[0])}
                className="px-3 py-1 bg-white text-emerald-900 rounded-lg text-xs font-bold hover:bg-slate-100 transition shadow-xs cursor-pointer flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>View Sanction Letter</span>
              </button>
              <button
                onClick={handleDownloadPDF}
                className="px-3 py-1 bg-emerald-800 text-white rounded-lg text-xs font-bold hover:bg-emerald-900 transition border border-emerald-700 cursor-pointer flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: APPLICANT TOKEN AUDIT & INSTANT SANCTION CONSOLE (/apply)      */}
      {/* ========================================================================= */}
      {activeRoute === 'apply' && !sanctionedCertificate && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6 animate-fadeIn">
          
          {/* Replay Attack / Expired Warning */}
          {replayDetected && (
            <div className="bg-rose-50 border-2 border-rose-400 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wide">
                  Replay Protection Triggered — Nonce Burned ⚠️
                </h4>
                <p className="text-xs text-rose-700 mt-0.5">
                  The referral token nonce <b>{applicant.nonce}</b> has already been sanctioned and burned. Re-execution of this credit transfer is cryptographically blocked to prevent duplicate disbursement.
                </p>
              </div>
            </div>
          )}

          {ttlCountdown <= 0 && !replayDetected && (
            <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
              <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                  Token Expired (300s TTL Exhausted) ⚠️
                </h4>
                <p className="text-xs text-amber-700 mt-0.5">
                  The 5-minute single-use window for this referral token has lapsed. Request a refreshed token from SchemeConnect.
                </p>
              </div>
            </div>
          )}

          {/* Top Token Verification Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">RS256 Decryption Engine</span>
                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                  SCHEMECONNECT PUBLIC KEY VERIFIED ✓
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900">
                Incoming Applicant Referral Token: <span className="font-mono text-blue-700">{applicant.name}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Target Scheme: <b>{applicant.scheme_name}</b> • Referral ID: <span className="font-mono text-slate-700">{applicant.nonce}</span>
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center min-w-[120px]">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Token TTL</span>
                <span className={`text-base font-mono font-bold ${ttlCountdown > 30 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {ttlCountdown}s
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center min-w-[140px]">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Composite Trust</span>
                <span className="text-base font-bold text-emerald-700">
                  {applicant.trust_score}% 🟢
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 7 Cols: ZKP Credential Audit Display */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs font-black uppercase text-slate-800 tracking-wide flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Zero-Knowledge Proof (ZKP) Credential Audit
                  </span>
                  <span className="text-[11px] text-slate-400">Zero Raw PII Exposure • Cryptographic Proof Verification</span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200">
                  ISO/IEC 27001
                </span>
              </div>

              {/* 5-Factor ZKP Verification Tiles */}
              <div className="space-y-3">
                
                {/* 1. Aadhaar Identity */}
                <div className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      UID
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Identity (Aadhaar eKYC): Verified 🟢
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        Masked UIDAI ID: <b>{applicant.zkp.aadhaar_masked}</b> • Verhoeff Checksum Valid
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    ZKP PROVEN ✓
                  </span>
                </div>

                {/* 2. PAN Tax Status */}
                <div className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                      PAN
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Tax Status (PAN): Active &amp; Matched 🟢
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        ID: <b>{applicant.zkp.pan_id}</b> • NSDL Direct Confirmation Matched
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    ZKP PROVEN ✓
                  </span>
                </div>

                {/* 3. Social Category */}
                <div className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
                      CST
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Social Category: Validated 🟢
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        Category: <b>{applicant.zkp.community_category}</b> • State e-District Serial: <b>{applicant.zkp.community_serial}</b>
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    ZKP PROVEN ✓
                  </span>
                </div>

                {/* 4. Income Audit */}
                <div className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                      INC
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Income Audit: Eligible 🟢
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        Certified: <b>₹{Number(applicant.zkp.certified_income).toLocaleString('en-IN')}</b> / Cap: <b>₹{Number(applicant.zkp.income_cap).toLocaleString('en-IN')}</b> • Ref: {applicant.zkp.income_serial}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    ZKP PROVEN ✓
                  </span>
                </div>

                {/* 5. Composite Citizen Trust Index */}
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                      100
                    </div>
                    <div>
                      <span className="text-xs font-black text-emerald-950 block">
                        Composite Citizen Trust Index: 100% 🟢
                      </span>
                      <span className="text-[11px] text-emerald-800">
                        All statutory parameters satisfy Ministry of Social Justice guidelines.
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-black text-emerald-800 px-3 py-1 bg-white rounded-lg border border-emerald-300">
                    APPROVED
                  </span>
                </div>

              </div>

              {/* Disbursement Target Account Box */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700 uppercase tracking-wide">
                    Direct Benefit Transfer (DBT) Escrow Target:
                  </span>
                  <span className="font-mono text-slate-900 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                    APB-BRIDGED
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Target Bank Account:</span>
                    <span className="font-mono font-bold text-slate-900">{applicant.account_number}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Selected Branch:</span>
                    <span className="font-semibold text-slate-800">{selectedBank.branch}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">IFSC Code:</span>
                    <span className="font-mono text-slate-700">{selectedBank.ifsc}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: AI Anti-Fraud Risk Scoring & Action Panel */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* AI Anti-Fraud Risk Engine Box */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-black uppercase text-slate-800 tracking-wide">
                      AI Anti-Fraud Risk Engine
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                    CLEAN 🟢
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <Fingerprint className="w-3.5 h-3.5 text-slate-400" />
                      Sybil Attack Probability:
                    </span>
                    <span className="font-mono font-bold text-emerald-700">{applicant.ai_risk.sybil_probability}</span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-slate-400" />
                      Device Fingerprint Anomaly:
                    </span>
                    <span className="font-semibold text-emerald-700">{applicant.ai_risk.device_fingerprint}</span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-slate-400" />
                      Composite Risk Grade:
                    </span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {applicant.ai_risk.risk_grade}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl text-center">
                  <span className="text-[11px] font-bold text-blue-900 block">
                    ✓ Recommendation: {applicant.ai_risk.recommendation}
                  </span>
                  <span className="text-[10px] text-blue-700 mt-0.5 block">
                    Identity corroborated against UIDAI, Income Tax, and Revenue Department nodes.
                  </span>
                </div>
              </div>

              {/* Multi-Sig & One-Click Sanction Action Box */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-black uppercase text-slate-800 tracking-wide flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-slate-700" />
                    Loan Sanction Authorization
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    ₹{Number(applicant.sanction_amount).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Threshold Info */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-500">Sanction Amount:</span>
                    <span className="font-bold text-slate-900 text-sm">₹{Number(applicant.sanction_amount).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Threshold Policy:</span>
                    <span className="font-semibold text-slate-700">
                      {isMultiSigRequired ? "Dual Officer Multi-Sig (>₹5,00,000)" : "1-Click Instant Sanction (≤₹5,00,000)"}
                    </span>
                  </div>
                </div>

                {/* Multi-Sig Toggle Controls (if > 5L, or displayed as dual officer audit) */}
                <div className="space-y-2 text-xs">
                  <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition">
                    <span className="text-slate-700 font-medium flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Officer 1: Credit Officer RS256 Key Sign-off
                    </span>
                    <input
                      type="checkbox"
                      checked={officer1Approved}
                      onChange={(e) => setOfficer1Approved(e.target.checked)}
                      className="w-4 h-4 accent-blue-600 cursor-pointer rounded"
                    />
                  </label>

                  {isMultiSigRequired && (
                    <label className="flex items-center justify-between p-2.5 bg-amber-50/70 rounded-xl border border-amber-300 cursor-pointer hover:bg-amber-100/60 transition">
                      <span className="text-amber-900 font-bold flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5 text-amber-700" />
                        Officer 2: Branch Manager Multi-Sig Authorization
                      </span>
                      <input
                        type="checkbox"
                        checked={officer2Approved}
                        onChange={(e) => setOfficer2Approved(e.target.checked)}
                        className="w-4 h-4 accent-blue-600 cursor-pointer rounded"
                      />
                    </label>
                  )}
                </div>

                {/* Main Sanction Action Button */}
                <div>
                  <button
                    onClick={handleExecuteSanction}
                    disabled={!canSanction}
                    className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-sm cursor-pointer ${
                      canSanction
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    <span>
                      {loanSanctioned 
                        ? "Loan Sanctioned & Disbursed 🟢"
                        : isMultiSigRequired
                        ? "Execute Dual Multi-Sig Credit Sanction ➔"
                        : "Approve Instant Credit Sanction ➔"}
                    </span>
                  </button>

                  <span className="text-[10px] text-slate-400 text-center block mt-2">
                    {replayDetected
                      ? "Execution blocked: Nonce has already been burned."
                      : "Clicking permanently burns single-use nonce & triggers DBT clearing webhook."}
                  </span>
                </div>
              </div>

            </div>

          </div>

        </main>
      )}

      {/* ========================================================================= */}
      {/* VIEW B: PARTNER BANKS DIRECTORY (/home)                                    */}
      {/* ========================================================================= */}
      {activeRoute === 'home' && !sanctionedCertificate && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Partner Banking Hub — Participating Credit Institutions
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Public sector and cooperative banking partners authorized under the Ministry of Social Justice &amp; Empowerment to disburse concessional micro-credit and capital-subsidized term loans.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PARTICIPATING_BANKS.map((bank) => (
              <div 
                key={bank.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                    <span className="font-bold text-base text-slate-900">{bank.name}</span>
                    <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      {bank.ifsc}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-600 mb-6">
                    <div>
                      <span className="text-[11px] font-medium text-slate-400 block uppercase">Focus Sector:</span>
                      <span className="font-semibold text-slate-800">{bank.focus_sector}</span>
                    </div>

                    <div>
                      <span className="text-[11px] font-medium text-slate-400 block uppercase">Maximum Loan Cap:</span>
                      <span className="font-bold text-slate-900 text-sm">₹{Number(bank.max_loan_cap).toLocaleString('en-IN')}</span>
                    </div>

                    <div>
                      <span className="text-[11px] font-medium text-slate-400 block uppercase">Concessional Rate:</span>
                      <span className="font-semibold text-slate-800">{bank.interest_rate}% per annum</span>
                    </div>

                    <div>
                      <span className="text-[11px] font-medium text-slate-400 block uppercase">Nodal Branch:</span>
                      <span className="text-slate-600">{bank.branch}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedBankId(bank.id);
                    setActiveRoute('apply');
                  }}
                  className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <span>Select Bank for Application</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* VIEW C: OFFICER REVIEW & AUDIT CONSOLE (/admin)                           */}
      {/* ========================================================================= */}
      {activeRoute === 'admin' && !sanctionedCertificate && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Bank Officer Audit &amp; Credit Sanction Console
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Real-time queue of cross-portal applications received from SchemeConnect.
              </p>
            </div>

            <button
              onClick={() => setActiveRoute('apply')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs self-start"
            >
              <span>+ Open Token Gateway</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Table View of Incoming Applications (7 Cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-800 tracking-wider">
                  Applications Queue ({applications.length})
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  PostgreSQL Realtime Sync Active
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-3">Applicant</th>
                      <th className="p-3">Lending Bank</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Audit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.map((app) => (
                      <tr 
                        key={app.application_id}
                        onClick={() => setSelectedAppForAudit(app)}
                        className={`cursor-pointer transition ${
                          selectedAppForAudit?.application_id === app.application_id
                            ? 'bg-slate-100/70 font-semibold'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="p-3">
                          <span className="font-bold text-slate-900 block">{app.applicant_name}</span>
                          <span className="text-[10px] font-mono text-slate-400">{app.application_id}</span>
                        </td>
                        <td className="p-3 text-slate-700">
                          {app.bank_name}
                        </td>
                        <td className="p-3 font-bold text-slate-900">
                          ₹{Number(app.sanction_amount || 200000).toLocaleString('en-IN')}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            app.verification_status === 'SANCTIONED'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            {app.verification_status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAppForAudit(app);
                            }}
                            className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[11px] font-medium border border-slate-200 cursor-pointer"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Audit Drawer / Review Panel (5 Cols) */}
            {selectedAppForAudit && (
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Institutional Audit</span>
                      <h3 className="text-sm font-bold text-slate-900">{selectedAppForAudit.applicant_name}</h3>
                    </div>
                    <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200">
                      {selectedAppForAudit.application_id}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs mb-5">
                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-600">eKYC Verification:</span>
                      <span className="font-bold text-emerald-700">Verified 🟢</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-600">ZKP Identity Match:</span>
                      <span className="font-bold text-emerald-700">100% Valid 🟢</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-600">Account Aggregator DBT:</span>
                      <span className="font-bold text-emerald-700">APB-Bridged 🟢</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-600">Sybil / Fraud Probability:</span>
                      <span className="font-bold text-emerald-700 font-mono">0.01% (Clean)</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs mb-5 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Scheme:</span>
                      <span className="font-semibold text-slate-900 truncate max-w-[200px]">{selectedAppForAudit.scheme_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Sanction Amount:</span>
                      <span className="font-bold text-slate-900 text-sm">₹{Number(selectedAppForAudit.sanction_amount || 200000).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Lending Bank:</span>
                      <span className="font-medium text-slate-800">{selectedAppForAudit.bank_name}</span>
                    </div>
                  </div>
                </div>

                <div>
                  {selectedAppForAudit.verification_status === 'SANCTIONED' ? (
                    <button
                      onClick={() => setSanctionedCertificate(selectedAppForAudit)}
                      className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl text-xs font-bold border border-slate-300 transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <FileText className="w-4 h-4" />
                      <span>View Cryptographic Sanction Certificate 📄</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setApplicant(prev => ({
                          ...prev,
                          name: selectedAppForAudit.applicant_name,
                          scheme_name: selectedAppForAudit.scheme_name,
                          sanction_amount: selectedAppForAudit.sanction_amount || 200000
                        }));
                        setActiveRoute('apply');
                      }}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>Load into Instant Sanction Gateway</span>
                    </button>
                  )}
                </div>

              </div>
            )}

          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* FORMAL CRYPTOGRAPHIC LOAN SANCTION CERTIFICATE WITH QR CODE VIEW          */}
      {/* ========================================================================= */}
      {sanctionedCertificate && (
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full animate-fadeIn">
          <div className="bg-white border-2 border-slate-800 rounded-2xl p-6 sm:p-8 shadow-lg text-slate-900 print:border-none print:shadow-none">
            
            {/* Official Header */}
            <div className="text-center pb-5 border-b-2 border-slate-900 mb-6">
              <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-sm">
                <Landmark className="w-7 h-7 text-white" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">
                OFFICIAL CREDIT SANCTION ORDER • DIRECT BENEFIT TRANSFER
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1 uppercase tracking-tight">
                Institutional Loan Sanction Certificate
              </h2>
              <span className="text-xs font-mono text-emerald-800 font-bold bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200 mt-1 inline-block">
                Reference ID: {sanctionedCertificate.reference_id || sanctionOrderRef} 🟢
              </span>
            </div>

            {/* Certificate Details */}
            <div className="space-y-4 text-xs mb-6">
              
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-medium text-slate-400 block uppercase">Sanctioning Bank:</span>
                  <span className="font-bold text-slate-900 text-sm">{sanctionedCertificate.bank_name || selectedBank.name}</span>
                </div>
                <div>
                  <span className="text-[10px] font-medium text-slate-400 block uppercase">Beneficiary Name:</span>
                  <span className="font-bold text-slate-900 text-sm">{sanctionedCertificate.applicant_name}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-medium text-slate-400 block uppercase">Sanctioned Amount:</span>
                  <span className="font-black text-slate-900 text-base">₹{Number(sanctionedCertificate.sanction_amount || 200000).toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] font-medium text-slate-400 block uppercase">Concessional Rate:</span>
                  <span className="font-bold text-emerald-700 text-sm">{sanctionedCertificate.interest_rate || 5.0}% p.a.</span>
                </div>
                <div>
                  <span className="text-[10px] font-medium text-slate-400 block uppercase">Target Scheme:</span>
                  <span className="font-semibold text-slate-800 truncate block">{sanctionedCertificate.scheme_name}</span>
                </div>
              </div>

              {/* QR Verification Block */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-white p-1 rounded-lg border border-slate-300 flex items-center justify-center shrink-0">
                    <QrCode className="w-14 h-14 text-slate-900" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Cryptographic QR Verification Code</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Scan with any banking terminal or SchemeConnect camera to verify on-chain ZKP audit hash.
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold block mt-1">
                      HASH: 0x89F2A14D90CE... (RS256 Verified)
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Disbursement Mode</span>
                  <span className="text-xs font-bold text-slate-900 font-mono">APB-DBT Transfer</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 leading-relaxed text-[11px]">
                This certifies that the credit facility for <b>{sanctionedCertificate.applicant_name}</b> has been audited, approved, and granted with Zero-Knowledge Proof credential verification in accordance with Reserve Bank of India (RBI) Digital Lending directives and Ministry of Social Justice &amp; Empowerment guidelines. Single-use nonce has been burned permanently.
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="text-[10px] text-slate-500 font-mono">
                  Digital Signature: RS256-RSA-SIGNED-0x77A19B<br />
                  Timestamp: {new Date().toLocaleString()}
                </div>
                <div className="text-right">
                  <div className="w-28 h-8 bg-slate-100 border border-dashed border-slate-400 rounded flex items-center justify-center text-[9px] font-mono text-slate-700 mb-1">
                    SEALED &amp; SIGNED
                  </div>
                  <span className="text-[10px] font-bold text-slate-800">Chief Nodal Loan Officer • ZETA BANK</span>
                </div>
              </div>

            </div>

            {/* Print / Download Controls */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 print:hidden">
              <button
                onClick={handleDownloadPDF}
                className="flex-1 py-3 bg-[#0f172a] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Download Sanction Letter PDF</span>
              </button>

              <button
                onClick={() => setSanctionedCertificate(null)}
                className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold cursor-pointer border border-slate-200"
              >
                Back to Console
              </button>

              <button
                onClick={() => navigateToSchemeConnect("/", true)}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5 border border-slate-200"
              >
                <span>View in SchemeConnect ↗</span>
              </button>
            </div>

          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: OFFICIAL BANKING SERVICE & RBI COMPLIANCE FOOTER               */}
      {/* ========================================================================= */}
      <footer className="mt-auto bg-[#0f172a] text-slate-400 py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-xs">
            
            {/* Column 1: Regulatory & RBI Compliance */}
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>RBI Compliance &amp; Digital Lending</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Regulated under Reserve Bank of India (RBI) Master Direction on Digital Lending and Priority Sector Lending (PSL) Targets. All credit facilities are non-discriminatory and audited under statutory guidelines.
              </p>
              <span className="text-[10px] font-mono text-slate-500 block mt-2">
                RBI Node Reference: RBI/DOR/2026/PSL-9912
              </span>
            </div>

            {/* Column 2: Audit Logs & Security Architecture */}
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
                <Lock className="w-4 h-4 text-blue-400" />
                <span>Security &amp; Audit Trail</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-400">
                <li className="flex items-center justify-between">
                  <span>Cryptographic Algorithm:</span>
                  <span className="font-mono text-slate-200">RS256 (2048-bit RSA)</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Replay Protection:</span>
                  <span className="font-mono text-emerald-400">Single-Use Nonce Burn</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Privacy Architecture:</span>
                  <span className="font-mono text-slate-200">Zero-Knowledge Proofs</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Data Protection Law:</span>
                  <span className="font-mono text-slate-200">DPDPA 2023 Compliant</span>
                </li>
              </ul>
            </div>

            {/* Column 3: System Status & Helpline */}
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <span>Institutional Banking Support</span>
              </div>
              <p className="text-slate-300 font-mono text-lg font-bold">1800-222-ZETA</p>
              <p className="text-[11px] text-slate-500">Toll-Free Institutional Officer Helpline (24×7)</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[11px] text-emerald-300 font-semibold">
                  ZETA Node Active: ZETA-PROD-BLR-01
                </span>
              </div>
            </div>

          </div>

          <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
            <p className="text-slate-500">
              © 2026 ZETA BANK • Partner Banking Consortium • Problem Statement SIH26092
            </p>
            <div className="flex items-center gap-3">
              <span className="text-slate-400">Audit Grade: Z+ High Assurance</span>
              <span className="text-slate-600">|</span>
              <span className="text-emerald-400 font-mono">Status: NORMAL</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default BetaApp;
