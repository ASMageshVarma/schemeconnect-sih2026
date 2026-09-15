import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle2, Clock, ShieldCheck, Landmark, Building2, 
  ArrowRight, Phone, Send, Check, AlertCircle, RefreshCw, FileText, 
  HelpCircle, Sparkles, IndianRupee, ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function DbtLifecycleTrackerModal({ isOpen, onClose, userProfile, scheme, lang = "en" }) {
  if (!isOpen) return null;

  const isTa = lang === "ta";
  const isHi = lang === "hi";
  const L = (en, ta, hi) => isHi ? hi : (isTa ? ta : en);

  // Generate deterministic tracking serial based on name/time
  const trackingId = `APB-DBT-2026-${(userProfile?.name?.slice(0, 3) || "CIT").toUpperCase()}-8821`;
  const beneficiaryName = userProfile?.name || "Rajan Shanmugam";
  const maskedAadhaar = "XXXX-XXXX-9812";
  const maskedBankAc = "SBIN0001842 - A/C 6201••••8812";
  const sanctionedAmount = scheme?.sanctioned_amount || 200000;

  // Active step simulation
  const [currentStep, setCurrentStep] = useState(3); // Stage 3: Bank Credit in progress
  const [smsDispatched, setSmsDispatched] = useState(false);
  const [slaTimeLeft, setSlaTimeLeft] = useState(47 * 3600 + 42 * 60); // 47 hours 42 mins

  const stages = [
    {
      step: 1,
      title: L("ZKP Demographic & 4-Factor Audit", "ZKP ஆவண சரிபார்ப்பு ஒப்புதல்", "जेडकेपी जनसांख्यिकीय एवं 4-कारक ऑडिट"),
      subtitle: L("Client-Side Verhoeff Checksum & NSDL Validation", "தொலைபேசி OTP மற்றும் ஆவண சரிபார்ப்பு முடிந்தது", "क्लाइंट-साइड वेरहॉफ चेकसम एवं एनएसडीएल सत्यापन"),
      status: "COMPLETED",
      time: "10:14 AM (Instant)",
      officer: "System AI Zero-Knowledge Engine",
      hash: "0x89F2A14D90CE7B31"
    },
    {
      step: 2,
      title: L("Ministry Escrow Allocation Locked", "அமைச்சக மானிய நிதி ஒதுக்கீடு", "मंत्रालय एस्क्रो आवंटन लॉक"),
      subtitle: L("Alpha Portal Broadcaster Criteria Hash Signed", "மத்திய அமைச்சக நிதியிலிருந்து ₹2,00,000 ஒதுக்கப்பட்டது", "अल्फा पोर्टल द्वारा मानदंड हैश हस्ताक्षरित"),
      status: "COMPLETED",
      time: "10:15 AM (Instant)",
      officer: "MoSJE Nodal Policy Registry",
      hash: "0x7CA459D108BA128E"
    },
    {
      step: 3,
      title: L("Institutional Credit Sanction & Multi-Sig", "வங்கி ஒப்புதல் & டிஜிட்டல் கையொப்பம்", "संस्थागत ऋण स्वीकृति एवं मल्टी-सिग"),
      subtitle: L("Zeta Bank RS256 Token Audited • Nonce Burned", "வங்கி மேலாளர் மற்றும் கடன் அதிகாரி அனுமதி வழங்கினர்", "जीटा बैंक RS256 टोकन ऑडिट • गैर-दोहराव सत्यापन"),
      status: "COMPLETED",
      time: "10:16 AM (Instant)",
      officer: "Credit Officer & Branch GM (Dual Multi-Sig)",
      hash: "0x3FE1990AC125DF89"
    },
    {
      step: 4,
      title: L("APB Aadhaar Payment Bridge Clearing", "நேரடி வங்கி கணக்கில் பணம் வரவு", "एपीबी आधार भुगतान ब्रिज क्लियरिंग"),
      subtitle: L("NPCI NACH / DBT Clearing into Jan Dhan Bank Account", "ரிசர்வ் வங்கி விதிமுறைப்படி 24 மணி நேரத்திற்குள் வரவு", "एनपीसीआई डीबीटी के माध्यम से जनधन खाते में सीधा हस्तांतरण"),
      status: "IN_PROGRESS",
      time: L("Estimated Clearing: Within 48 Hours", "48 மணி நேரத்திற்குள் வரவு வைக்கப்படும்", "अनुमानित समय: 48 घंटे के भीतर"),
      officer: "NPCI Clearing Gateway / RBI Escrow",
      hash: "APB-TXN-PENDING-STAGE-4"
    }
  ];

  const handleSimulateSms = () => {
    setSmsDispatched(true);
    try { confetti({ particleCount: 50, spread: 60 }); } catch (e) {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden text-white">
        
        {/* Header Bar */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Landmark className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-wider uppercase bg-blue-500/20 text-blue-300 border border-blue-400/40 px-2 py-0.5 rounded-full">
                  APB-DBT Direct Benefit Transfer Life-Cycle
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold animate-pulse">● LIVE AUDIT</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                {L("Transparent 'Locker-to-Pocket' Tracking", "வெளிப்படையான நேரடி மானிய கண்காணிப்பு", "पारदर्शी प्रत्यक्ष लाभ अंतरण ट्रैकिंग")}
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Beneficiary & Escrow Summary Strip */}
        <div className="px-6 py-3.5 bg-slate-800/60 border-b border-slate-700/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block">{L("Tracking ID", "கண்காணிப்பு எண்", "ट्रैकिंग आईडी")}</span>
            <span className="font-mono font-bold text-amber-400">{trackingId}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">{L("Beneficiary", "பயனாளி", "लाभार्थी")}</span>
            <span className="font-semibold text-white truncate block">{beneficiaryName}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">{L("Target Account", "வங்கி கணக்கு", "बैंक खाता")}</span>
            <span className="font-mono text-slate-300 truncate block">{maskedBankAc}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">{L("Subsidy Value", "மானிய மதிப்பு", "सब्सिडी मूल्य")}</span>
            <span className="font-bold text-emerald-400">₹{Number(sanctionedAmount).toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Stage-by-Stage Transparent Timeline */}
        <div className="p-6 max-h-[50vh] overflow-y-auto space-y-4">
          {stages.map((st) => {
            const isDone = st.status === "COMPLETED";
            return (
              <div key={st.step} className="flex items-start space-x-3.5 relative">
                {st.step < 4 && (
                  <div className={`absolute left-4 top-8 w-0.5 h-12 ${isDone ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                )}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                  isDone 
                    ? 'bg-emerald-500 text-slate-950 font-black' 
                    : 'bg-amber-500/20 text-amber-400 border border-amber-400/40 animate-pulse'
                }`}>
                  {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : <Clock className="w-4 h-4" />}
                </div>
                <div className="flex-1 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-black text-white">{st.title}</span>
                    <span className="text-[10px] font-mono text-slate-400">{st.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mb-2">{st.subtitle}</p>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono pt-2 border-t border-slate-700/40">
                    <span className="text-slate-400">Authority: <span className="text-indigo-300">{st.officer}</span></span>
                    <span className="text-slate-400">Hash: <span className="text-emerald-400">{st.hash}</span></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Citizen Dispatch Alert Strip & Footer */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-slate-300 text-[11px]">
              {L("Statutory Citizen Charter SLA: Guaranteed direct disbursement under 48 hours.", "அரசு உறுதிமொழி: 48 மணி நேரத்திற்குள் உங்கள் வங்கி கணக்கில் நேரடியாக வரவு வைக்கப்படும்.", "नागरिक चार्टर गारंटी: 48 घंटे के भीतर सीधे बैंक खाते में भुगतान।")}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {!smsDispatched ? (
              <button
                type="button"
                onClick={handleSimulateSms}
                className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{L("Send Citizen SMS Alert", "எஸ்.எம்.எஸ் அனுப்புக", "एसएमएस अलर्ट भेजें")}</span>
              </button>
            ) : (
              <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 rounded-xl text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{L("Alert Dispatched to +91 98•••9812", "எஸ்.எம்.எஸ் அனுப்பப்பட்டது", "एसएमएस भेजा गया")}</span>
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              {L("Close", "மூடுக", "बंद करें")}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
