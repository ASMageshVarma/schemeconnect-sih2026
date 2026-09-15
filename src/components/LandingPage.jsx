import React from 'react';
import { 
  Sparkles, ArrowRight, ShieldCheck, Building2,
  CheckCircle2, Radio, Mic, Camera, Zap, Users, TrendingUp, Lock
} from 'lucide-react';

const FEATURES = [
  {
    icon: Mic,
    color: "blue",
    tag: "Voice-to-Text Module",
    tagTa: "குரல் வழி உள்ளீடு",
    title: "Speak in Your Mother Tongue",
    titleTa: "தாய்மொழியில் பேசி விண்ணப்பிக்க",
    desc: "Auto-fills the 7-parameter eligibility form in seconds using your voice in Tamil, Hindi, or English.",
    descTa: "தமிழ், இந்தி அல்லது ஆங்கிலத்தில் பேசி விண்ணப்பப் படிவத்தை நிரப்பவும்.",
    cta: "Try Voice Intake",
    ctaTa: "குரல் வழியை தொடங்க",
    nav: "find-schemes"
  },
  {
    icon: Camera,
    color: "indigo",
    tag: "OCR Document Scanner",
    tagTa: "ஆவண ஸ்கேனர் (OCR)",
    title: "Scan Aadhaar & ID Cards",
    titleTa: "ஆதார் / சாதி அட்டை ஸ்கேன்",
    desc: "Upload any citizen ID card to extract Name, Age, and Address in-browser using Tesseract OCR.",
    descTa: "ஆதார் அல்லது ரேஷன் அட்டையை பதிவேற்றி 5 நொடிகளில் தகவல்களை பிரித்தெடுக்கலாம்.",
    cta: "Scan ID Card",
    ctaTa: "ஆவணத்தை ஸ்கேன் செய்ய",
    nav: "find-schemes"
  },
  {
    icon: Radio,
    color: "emerald",
    tag: "Live Ministry Sync",
    tagTa: "நிகழ்நேர அமைச்சக இணைப்பு",
    title: "Real-Time Policy Updates",
    titleTa: "உடனடி அரசு கொள்கை மாற்றம்",
    desc: "When ministry adjusts age/income caps in Alpha Portal, eligibility recalculates live without a page refresh.",
    descTa: "அரசு கொள்கை மாற்றங்கள் நிகழ்நேரத்தில் புதுப்பிக்கப்பட்டு தகுதி நிலை மாறும்.",
    cta: "View Live Sync",
    ctaTa: "செயல்விளக்கத்தை பார்க்க",
    nav: "demo-split"
  }
];

const STATS = [
  { value: "20+", label: "Active Schemes", labelTa: "அங்கீகரிக்கப்பட்ட திட்டங்கள்", color: "text-slate-900" },
  { value: "5–8%", label: "Concessional Rates", labelTa: "சலுகை வட்டி விகிதங்கள்", color: "text-blue-600" },
  { value: "<10ms", label: "WebSocket Latency", labelTa: "நேரலை தாமத நேரம்", color: "text-emerald-600" },
  { value: "100%", label: "Deterministic Match", labelTa: "துல்லியமான பொருத்தம்", color: "text-purple-600" }
];

const COLOR_MAP = {
  blue:    { bg: "bg-blue-50",   icon: "text-blue-600",   tag: "text-blue-600",   cta: "text-blue-600",   hover: "hover:border-blue-300" },
  indigo:  { bg: "bg-indigo-50", icon: "text-indigo-600", tag: "text-indigo-600", cta: "text-indigo-600", hover: "hover:border-indigo-300" },
  emerald: { bg: "bg-emerald-50",icon: "text-emerald-600",tag: "text-emerald-600",cta: "text-emerald-600",hover: "hover:border-emerald-300" }
};

export function LandingPage({ lang = "en", setLang, t, onNavigate }) {
  const isTa = lang === "ta";

  return (
    <div className="w-full bg-slate-50 text-slate-900">

      {/* ─── Hero ─── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16 text-center">

        {/* Ministry badge */}
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-4 py-1.5 rounded-full text-[11px] font-black border border-blue-200 mb-6 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{isTa ? "சமூக நீதி & அதிகாரமளித்தல் அமைச்சகம் • SIH26092" : "Ministry of Social Justice & Empowerment • Problem Statement SIH26092"}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-black text-slate-900 tracking-tight leading-[1.12] mb-5">
          {isTa
            ? "விளிம்புநிலை தொழில்முனைவோருக்கான AI அரசு நலத்திட்ட வழிகாட்டி"
            : <>AI-Powered Welfare Scheme<br className="hidden sm:block" /> Matching Engine</>}
        </h1>

        <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto mb-10">
          {isTa
            ? "தெருவோர வியாபாரிகள் மற்றும் சிறு வணிகர்களுக்கான 20+ அரசு திட்டங்களை 2 நிமிடங்களில் கண்டறியுங்கள்."
            : "Discover 20+ verified government concessional loans and capital subsidies for micro-entrepreneurs in under 2 minutes — with voice input, OCR scanning, and live ministry sync."}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
          <button
            onClick={() => onNavigate("find-schemes")}
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-2xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2.5 group"
          >
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <span>{isTa ? "திட்டங்களைக் கண்டறியவும்" : "Find Eligible Schemes"}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition shrink-0" />
          </button>

          <button
            onClick={() => onNavigate("alpha-portal")}
            className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-sm rounded-2xl shadow-sm transition flex items-center justify-center gap-2"
          >
            <Radio className="w-4 h-4 text-indigo-500 animate-pulse shrink-0" />
            <span>{isTa ? "அரசு Alpha Portal" : "Alpha Gov Portal"}</span>
          </button>
        </div>

        {/* Trust Row */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-semibold text-slate-400 mb-14">
          {[
            { icon: ShieldCheck, text: isTa ? "ZKP ஒற்றுமை சரிபார்ப்பு" : "Zero-Knowledge Proof Verification" },
            { icon: Lock,        text: isTa ? "RS256 JWT அங்கீகாரம்"    : "RS256 JWT Authentication" },
            { icon: CheckCircle2, text: isTa ? "DPDP Act 2023 இணங்கல்"  : "DPDP Act 2023 Compliant" },
            { icon: Zap,         text: isTa ? "DBT நேரடி பிரிவு"        : "APB Direct Benefit Transfer" },
          ].map(({ icon: Icon, text }) => (
            <span key={text} className="flex items-center gap-1.5">
              <Icon className="w-3.5 h-3.5 text-blue-400" />
              {text}
            </span>
          ))}
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
          {FEATURES.map((f) => {
            const c = COLOR_MAP[f.color];
            const Icon = f.icon;
            return (
              <div
                key={f.nav + f.tag}
                onClick={() => onNavigate(f.nav)}
                className={`bg-white p-6 rounded-3xl border border-slate-200 shadow-sm ${c.hover} hover:shadow-lg transition cursor-pointer flex flex-col justify-between group`}
              >
                <div>
                  <div className={`w-11 h-11 rounded-2xl ${c.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                    <Icon className={`w-5 h-5 ${c.icon}`} />
                  </div>
                  <div className={`text-[10px] font-black uppercase tracking-widest ${c.tag} mb-1.5`}>
                    {isTa ? f.tagTa : f.tag}
                  </div>
                  <h3 className="text-sm font-black text-slate-900 mb-2 leading-snug">
                    {isTa ? f.titleTa : f.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                    {isTa ? f.descTa : f.desc}
                  </p>
                </div>
                <div className={`flex items-center gap-1.5 text-[11px] font-black ${c.cta}`}>
                  <span>{isTa ? f.ctaTa : f.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section className="border-t border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100">
          {STATS.map(({ value, label, labelTa, color }) => (
            <div key={label} className="py-6 px-4 text-center">
              <span className={`text-2xl sm:text-3xl font-black block ${color}`}>{value}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-1 block">
                {isTa ? labelTa : label}
              </span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
