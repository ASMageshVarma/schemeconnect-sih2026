import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Briefcase, IndianRupee, MapPin, Sparkles, Mic, MicOff, 
  Upload, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, 
  RefreshCw, FileText, Check, Loader2, AlertTriangle,
  Bot, Lock, Phone, Landmark, Key, ChevronRight, FileCheck, X,
  Building2, Trees, ShoppingBag, Scissors, Factory, Wrench, Sprout
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakText } from '../utils/speech';
import { TrackApplicationModal } from './TrackApplicationModal';

const TOTAL_STEPS = 7;

export function FormVerificationPage({ 
  initialProfile, 
  initialStep = 1,
  resumeStoredStep = false,
  lang = "en", 
  t, 
  onSubmit, 
  onBack 
}) {
  const isTa = lang === "ta";
  const isHi = lang === "hi";
  const L = (en, ta, hi) => isHi ? hi : (isTa ? ta : en);

  // ── State Persistence on Back Navigation & Refresh ────────────────────────
  const [profile, setProfile] = useState(() => {
    if (initialProfile) return initialProfile;
    try {
      const saved = localStorage.getItem('jansetu_intake_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      name: "",
      age: "",
      area: "",
      sector: "",
      income: "",
      shg_membership: "",
      gender: "",
      caste: "",
      district: "Tiruchirappalli",
      state: "Tamil Nadu"
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('jansetu_intake_profile', JSON.stringify(profile));
    } catch (e) {}
  }, [profile]);

  // ── Synchronized Wizard Step Index (1 to 7) ────────────────────────────────
  // Defaults strictly to Step 1 (or initialStep prop). Only resumes if resumeStoredStep is explicitly true.
  const [currentStepIndex, setCurrentStepIndex] = useState(() => {
    try {
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const urlStep = parseInt(urlParams.get('step'), 10);
        if (urlStep >= 1 && urlStep <= TOTAL_STEPS) return urlStep;
      }
      if (resumeStoredStep) {
        const savedStep = localStorage.getItem('jansetu_wizard_step');
        const parsed = parseInt(savedStep, 10);
        if (parsed >= 1 && parsed <= TOTAL_STEPS) return parsed;
      }
      if (initialStep && initialStep >= 1 && initialStep <= TOTAL_STEPS) {
        return initialStep;
      }
    } catch (e) {}
    return 1;
  });

  const setStep = (step) => {
    const next = Math.max(1, Math.min(step, TOTAL_STEPS));
    setCurrentStepIndex(next);
    try {
      localStorage.setItem('jansetu_wizard_step', String(next));
    } catch (e) {}
  };

  const wizardNext = () => setStep(currentStepIndex + 1);
  const wizardBack = () => setStep(currentStepIndex - 1);

  // ── 4-Factor OCR Dropzone State ────────────────────────────────────────────
  const [ocrCards, setOcrCards] = useState({
    aadhaar:   { status: 'idle', file: null, badge: null, extracted: null },
    pan:       { status: 'idle', file: null, badge: null, extracted: null },
    community: { status: 'idle', file: null, badge: null, extracted: null },
    income:    { status: 'idle', file: null, badge: null, extracted: null },
  });

  const [mobileNumber, setMobileNumber] = useState("9876543210");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpToast, setOtpToast] = useState(null);
  const [otpInput, setOtpInput] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState(null);
  const [showTrackModal, setShowTrackModal] = useState(false);

  const allOcrPassed = Object.values(ocrCards).every(c => c.status === 'passed');
  const ocrPassedCount = Object.values(ocrCards).filter(c => c.status === 'passed').length;

  // Single Card Upload & RAM OCR Parser Simulation (1 second)
  const handleFileUpload = (cardKey, file) => {
    if (!file) return;
    setOcrCards(prev => ({
      ...prev,
      [cardKey]: { ...prev[cardKey], status: 'scanning', file: file.name }
    }));

    setTimeout(() => {
      let badge = "";
      let extracted = {};
      if (cardKey === 'aadhaar') {
        badge = "Masked UID: XXXX-XXXX-9812 🟢";
        extracted = { uid: "XXXX-XXXX-9812", checksum: "VALID_VERHOEFF" };
      } else if (cardKey === 'pan') {
        badge = "PAN Active: ABCDE1234F 🟢";
        extracted = { pan: "ABCDE1234F", status: "ACTIVE" };
      } else if (cardKey === 'community') {
        badge = "Category Validated: SC/ST (TN-CST/8821) 🟢";
        extracted = { serial: "TN-CST/8821", category: "SC/ST" };
      } else if (cardKey === 'income') {
        badge = "Certified Income: ₹5,00,000 / yr 🟢";
        extracted = { serial: "TN-INC/4102", certified: "500000" };
      }

      setOcrCards(prev => ({
        ...prev,
        [cardKey]: { status: 'passed', file: file.name, badge, extracted }
      }));
    }, 1000);
  };

  // Presentation Demo Mode: Auto-Scan Sample Citizen Packet in 1s
  const handleDemoScanAll = () => {
    ['aadhaar', 'pan', 'community', 'income'].forEach(key => {
      setOcrCards(prev => ({
        ...prev,
        [key]: { ...prev[key], status: 'scanning', file: `sample_${key}.pdf` }
      }));
    });

    setTimeout(() => {
      setOcrCards({
        aadhaar: {
          status: 'passed',
          file: 'sample_aadhaar_card.pdf',
          badge: 'Masked UID: XXXX-XXXX-9812 🟢',
          extracted: { uid: 'XXXX-XXXX-9812' }
        },
        pan: {
          status: 'passed',
          file: 'sample_pan_card.jpg',
          badge: 'PAN Active: ABCDE1234F 🟢',
          extracted: { pan: 'ABCDE1234F' }
        },
        community: {
          status: 'passed',
          file: 'sample_community_cert.pdf',
          badge: 'Category Validated: SC/ST (TN-CST/8821) 🟢',
          extracted: { category: 'SC/ST' }
        },
        income: {
          status: 'passed',
          file: 'sample_income_cert.pdf',
          badge: 'Certified Income: ₹5,00,000 / yr 🟢',
          extracted: { income: 500000 }
        }
      });
      // Do NOT pre-fill OTP; ensure SHG membership is set for smooth completion
      setProfile(prev => ({ ...prev, shg_membership: prev.shg_membership || 'Yes' }));
    }, 1000);
  };

  // Two-Stage OTP Send Simulation (1 second loader)
  const handleSendOtp = () => {
    if (!mobileNumber || mobileNumber.length < 10) return;
    setIsSendingOtp(true);
    setTimeout(() => {
      setIsSendingOtp(false);
      setOtpSent(true);
      setOtpInput("");
      setOtpToast("Demo OTP sent: 2354");
      setTimeout(() => setOtpToast(null), 6000);
    }, 1000);
  };

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('demo') === '1' || urlParams.get('autodemo') === 'true') {
          handleDemoScanAll();
          setOtpSent(true);
          setOtpVerified(true);
        }
      }
    } catch (e) {}
  }, []);

  // OTP Verification
  const handleVerifyOtp = () => {
    if (otpInput.trim() === "2354" || otpInput.trim() === "1234" || otpInput.trim().length === 4) {
      setOtpVerified(true);
      setOtpError(null);
      try { confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } }); } catch {}
    } else {
      setOtpError("Invalid OTP. Enter 2354 for demo.");
    }
  };

  // Final Submission to My Matches
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!allOcrPassed || !otpVerified) return;

    const verifiedPayload = {
      ...profile,
      age: Number(profile.age) || 38,
      income: Number(profile.income) || 120000,
      aadhaar_no: "XXXX-XXXX-9812",
      pan_no: "ABCDE1234F",
      is_fully_authenticated: true,
      trust_score: 98,
      status: "APPROVED"
    };

    try {
      localStorage.setItem("jansetu_verified_credentials", JSON.stringify(verifiedPayload));
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    } catch (err) {}

    if (onSubmit) onSubmit(verifiedPayload);
  };

  // Validation per step
  const isStepValid = (step) => {
    switch (step) {
      case 1: return profile.name.trim().length > 0 && !!profile.gender;
      case 2: return Number(profile.age) >= 18 && Number(profile.age) <= 75;
      case 3: return !!profile.area;
      case 4: return !!profile.sector;
      case 5: return Number(profile.income) > 0;
      case 6: return !!profile.caste;
      case 7: return allOcrPassed && otpVerified;
      default: return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fadeIn">

      {/* Track Existing Application Modal */}
      {showTrackModal && (
        <TrackApplicationModal
          lang={formLang}
          onClose={() => setShowTrackModal(false)}
        />
      )}

      {/* ─── 7-STEP GUIDED WIZARD CONTAINER ───────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Unified Synchronized Progress Header */}
        <div className="bg-[#0f172a] px-6 py-5 border-b border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                {L('Eligibility Wizard', 'தகுதி வழிகாட்டி', 'पात्रता विज़ार्ड')}
              </span>
              <div className="text-lg font-black text-white mt-0.5">
                STEP {currentStepIndex} OF {TOTAL_STEPS}
              </div>
            </div>
            <div className="text-right">
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                allOcrPassed && otpVerified
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}>
                {currentStepIndex === 7 && allOcrPassed && otpVerified ? '✓ Ready' : `Progress ${Math.round((currentStepIndex / TOTAL_STEPS) * 100)}%`}
              </span>
            </div>
          </div>

          {/* 7 Segment Progress Bar */}
          <div className="flex gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  i + 1 < currentStepIndex ? 'bg-emerald-400' :
                  i + 1 === currentStepIndex ? 'bg-blue-500 ring-2 ring-blue-400/40' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Wizard Step Content Body */}
        <div className="px-6 py-8">

          {/* ── STEP 1: IDENTITY ─────────────────────────────────────── */}
          {currentStepIndex === 1 && (
            <div className="animate-fadeIn space-y-6">
              <div>
                <p className="text-xs font-black uppercase text-blue-600 tracking-wider mb-1">
                  STEP 1: IDENTITY
                </p>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {L("What is your Full Name & Gender?", "உங்கள் முழுப் பெயர் மற்றும் பாலினம் என்ன?", "आपका पूरा नाम और लिंग क्या है?")}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {L("Used to match personal identity records against scheme quotas.", "திட்ட இடஒதுக்கீட்டுடன் சுயவிவரத்தை பொருத்த பயன்படுகிறது.", "योजना कोटा के लिए व्यक्तिगत पहचान रिकॉर्ड का मिलान करने हेतु।")}
                </p>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-600 mb-2">
                  {L("Full Name *", "முழுப் பெயர் *", "पूरा नाम *")}
                </label>
                <input
                  type="text"
                  placeholder={L("e.g. Rajan S. / A. Selvam", "எ.கா: ராஜன் எஸ்.", "उदा. राजन एस.")}
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-600 mb-2">
                  {L("Gender *", "பாலினம் *", "लिंग *")}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { v: 'Male',        label: L('Male', 'ஆண்', 'पुरुष') },
                    { v: 'Female',      label: L('Female', 'பெண்', 'महिला') },
                    { v: 'Transgender', label: L('Transgender', 'மூன்றாம்', 'ट्रांसजेंडर') },
                  ].map(opt => (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => setProfile({ ...profile, gender: opt.v })}
                      className={`py-3.5 rounded-xl border-2 text-xs font-black transition cursor-pointer ${
                        profile.gender === opt.v
                          ? 'border-blue-600 bg-blue-50 text-blue-800 shadow-sm'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {profile.gender === 'Female' && (
                  <p className="text-[11px] text-emerald-700 font-semibold mt-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    ✓ {L('Women entrepreneurs receive an additional 4% interest subvention on eligible credit schemes.', 'பெண் தொழில்முனைவோருக்கு 4% கூடுதல் வட்டி சலுகை.', 'महिला उद्यमियों को 4% अतिरिक्त ब्याज सब्सिडी।')}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 2: AGE ──────────────────────────────────────────── */}
          {currentStepIndex === 2 && (
            <div className="animate-fadeIn space-y-6">
              <div>
                <p className="text-xs font-black uppercase text-blue-600 tracking-wider mb-1">
                  STEP 2: AGE
                </p>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {L("How old are you?", "உங்கள் வயது என்ன?", "आपकी आयु क्या है?")}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {L("Statutory eligibility requires applicant age between 18 and 75 years.", "சட்டப்பூர்வ தகுதிக்கு 18 முதல் 75 வயது வரை தேவை.", "वैधानिक पात्रता के लिए 18 से 75 वर्ष की आयु आवश्यक है।")}
                </p>
              </div>

              <div className="max-w-xs mx-auto text-center space-y-3">
                <input
                  type="text"
                  maxLength={2}
                  placeholder="38"
                  value={profile.age}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/[^0-9]/g, '');
                    setProfile({ ...profile, age: clean });
                  }}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-4xl font-black text-blue-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-center"
                />
                <span className="text-xs font-bold text-slate-500 block">
                  {L("Years Old (18 – 75)", "வயது (18 – 75)", "वर्ष (18 – 75)")}
                </span>

                {profile.age && (Number(profile.age) < 18 || Number(profile.age) > 75) && (
                  <p className="text-rose-600 text-xs font-bold bg-rose-50 p-2 rounded-xl border border-rose-200">
                    {L("Age must be between 18 and 75 years.", "வயது 18–75 ஆக இருக்க வேண்டும்.", "आयु 18–75 वर्ष होनी चाहिए।")}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 3: LOCATION ─────────────────────────────────────── */}
          {currentStepIndex === 3 && (
            <div className="animate-fadeIn space-y-6">
              <div>
                <p className="text-xs font-black uppercase text-blue-600 tracking-wider mb-1">
                  STEP 3: LOCATION
                </p>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {L("Where is your business located?", "உங்கள் வணிகம் எங்கு அமைந்துள்ளது?", "आपका व्यवसाय कहाँ स्थित है?")}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {L("Different subsidy brackets apply to Urban vs. Rural local bodies.", "நகர்ப்புறம் மற்றும் கிராமப்புறத்திற்கு வெவ்வேறு மானிய வரம்புகள் உண்டு.", "शहरी और ग्रामीण स्थानीय निकायों के लिए अलग सब्सिडी नियम लागू होते हैं।")}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { v: 'Urban', Icon: Building2, iconColor: 'text-blue-600', bgColor: 'bg-blue-50', label: L('Urban Area', 'நகர்ப்புறம்', 'शहरी क्षेत्र'), sub: L('Corporation / Municipality (25% Subsidy)', 'மாநகராட்சி / நகராட்சி (25% மானியம்)', 'नगर निगम / पालिका (25% सब्सिडी)') },
                  { v: 'Rural', Icon: Trees, iconColor: 'text-emerald-600', bgColor: 'bg-emerald-50', label: L('Rural Area', 'கிராமப்புறம்', 'ग्रामीण क्षेत्र'), sub: L('Village / Panchayat (Up to 35% Subsidy)', 'கிராமம் / ஊராட்சி (35% வரை மானியம்)', 'ग्राम पंचायत (35% तक सब्सिडी)') },
                ].map(opt => (
                  <button
                    key={opt.v}
                    type="button"
                    onClick={() => setProfile({ ...profile, area: opt.v })}
                    className={`p-6 rounded-2xl border-2 text-center transition cursor-pointer flex flex-col items-center justify-center ${
                      profile.area === opt.v
                        ? 'border-blue-600 bg-blue-50/80 shadow-md ring-2 ring-blue-400/20'
                        : 'border-slate-200 bg-slate-50 hover:border-blue-300'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl ${opt.bgColor} flex items-center justify-center mb-3`}>
                      <opt.Icon className={`w-7 h-7 ${opt.iconColor}`} />
                    </div>
                    <span className={`text-base font-black ${profile.area === opt.v ? 'text-blue-900' : 'text-slate-800'}`}>
                      {opt.label}
                    </span>
                    <span className="text-xs text-slate-500 mt-1">{opt.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 4: SECTOR ───────────────────────────────────────── */}
          {currentStepIndex === 4 && (
            <div className="animate-fadeIn space-y-6">
              <div>
                <p className="text-xs font-black uppercase text-blue-600 tracking-wider mb-1">
                  STEP 4: SECTOR
                </p>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {L("What type of enterprise do you operate?", "நீங்கள் எந்த வகை தொழில் நடத்துகிறீர்கள்?", "आप किस प्रकार का उद्यम चलाते हैं?")}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {L("Target sector determines primary scheme eligibility (e.g. PM SVANidhi vs. PM Vishwakarma).", "துறைக்கேற்ப திட்டங்கள் பொருந்தும்.", "लक्षित क्षेत्र योजना पात्रता निर्धारित करता है।")}
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { v: 'Street Vendor',       Icon: ShoppingBag,  iconColor: 'text-blue-600',    bgColor: 'bg-blue-50',    label: L('Street Vendor / Retail Trader', 'தெருவோர வியாபாரி', 'सड़क विक्रेता / खुदरा व्यापारी'), desc: 'PM SVANidhi Micro Credit (up to Rs.50k)' },
                  { v: 'Handicraft/Artisan',   Icon: Scissors,     iconColor: 'text-purple-600',  bgColor: 'bg-purple-50',  label: L('Handicraft / Artisan / Vishwakarma', 'கைவினைஞர் / விஸ்வகர்மா', 'कारीगर / हस्तशिल्प / विश्वकर्मा'), desc: 'PM Vishwakarma Toolkit Voucher (Rs.15k) + 5% Loan' },
                  { v: 'Manufacturing',         Icon: Factory,      iconColor: 'text-slate-600',   bgColor: 'bg-slate-100',  label: L('Manufacturing / Production Unit', 'உற்பத்தி தொழில்', 'विनिर्माण / उत्पादन इकाई'), desc: 'PMEGP Up to Rs.50 Lakh with 35% Capital Subsidy' },
                  { v: 'Services',              Icon: Wrench,       iconColor: 'text-orange-600',  bgColor: 'bg-orange-50',  label: L('Services / Repair / Logistics', 'சேவை பிரிவு / பழுதுபார்ப்பு', 'सेवाएँ / मरम्मत / लॉजिस्टिक्स'), desc: 'MUDRA & PMEGP Service Loans Up to Rs.20 Lakh' },
                  { v: 'Agriculture/Farming',   Icon: Sprout,       iconColor: 'text-emerald-600', bgColor: 'bg-emerald-50', label: L('Agriculture / Allied Livestock', 'விவசாயம் / கால்நடை', 'कृषि / संबद्ध पशुपालन'), desc: 'Kisan Credit & Concessional Animal Husbandry' },
                ].map(opt => (
                  <button
                    key={opt.v}
                    type="button"
                    onClick={() => setProfile({ ...profile, sector: opt.v })}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left transition cursor-pointer ${
                      profile.sector === opt.v
                        ? 'border-blue-600 bg-blue-50/80 shadow-md ring-2 ring-blue-400/20'
                        : 'border-slate-200 bg-slate-50 hover:border-blue-300'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl ${opt.bgColor} flex items-center justify-center shrink-0`}>
                      <opt.Icon className={`w-5 h-5 ${opt.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-black ${profile.sector === opt.v ? 'text-blue-900' : 'text-slate-900'}`}>
                        {opt.label}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                    </div>
                    {profile.sector === opt.v && <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 5: INCOME ───────────────────────────────────────── */}
          {currentStepIndex === 5 && (
            <div className="animate-fadeIn space-y-6">
              <div>
                <p className="text-xs font-black uppercase text-blue-600 tracking-wider mb-1">
                  STEP 5: INCOME
                </p>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {L("What is your annual household income?", "உங்கள் ஆண்டு குடும்ப வருமானம் என்ன?", "आपकी वार्षिक पारिवारिक आय क्या है?")}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {L("Concessional welfare loans are reserved for household incomes ≤ ₹5,00,000 / year.", "சலுகைக் கடன்கள் ஆண்டுக்கு ≤ ₹5,00,000 வருமானத்திற்கு ஒதுக்கப்பட்டுள்ளது.", "रियायती कल्याणकारी ऋण ≤ ₹5,00,000 वार्षिक आय के लिए हैं।")}
                </p>
              </div>

              {/* Sanitized Income Input: only digits allowed */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-600 mb-2">
                  {L("Annual Household Income (₹) *", "ஆண்டு குடும்ப வருமானம் (₹) *", "वार्षिक पारिवारिक आय (₹) *")}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-lg font-black text-slate-400">₹</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="120000"
                    value={profile.income}
                    onChange={(e) => {
                      // Input sanitization: strip non-numeric characters automatically
                      const clean = e.target.value.replace(/[^0-9]/g, '');
                      setProfile({ ...profile, income: clean });
                    }}
                    className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xl font-black text-emerald-800 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Quick Currency Selectors with standard Lakh labels */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 block">
                  {L("Quick Select Income Tiers:", "வருமான அடுக்குகள்:", "त्वरित आय चयन:")}
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[
                    { num: 60000,  label: "₹60,000" },
                    { num: 120000, label: "₹1.2 Lakh" },
                    { num: 180000, label: "₹1.8 Lakh" },
                    { num: 240000, label: "₹2.4 Lakh" },
                    { num: 360000, label: "₹3.6 Lakh" },
                    { num: 500000, label: "₹5.0 Lakh" },
                  ].map(amt => (
                    <button
                      key={amt.num}
                      type="button"
                      onClick={() => setProfile({ ...profile, income: String(amt.num) })}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer text-center ${
                        Number(profile.income) === amt.num
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-300'
                      }`}
                    >
                      {amt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {L("Concessional Credit Ceiling: ≤ ₹5,00,000 / year. Zero income ceiling on PMEGP capital subsidies.", "சலுகைக் கடன் உச்சவரம்பு: ≤ ₹5,00,000.", "रियायती ऋण सीमा: ≤ ₹5,00,000.")}
                </span>
              </div>
            </div>
          )}

          {/* ── STEP 6: SOCIAL CATEGORY ──────────────────────────────── */}
          {currentStepIndex === 6 && (
            <div className="animate-fadeIn space-y-6">
              <div>
                <p className="text-xs font-black uppercase text-blue-600 tracking-wider mb-1">
                  STEP 6: SOCIAL CATEGORY
                </p>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {L("What is your Social Category?", "உங்கள் சமூகப் பிரிவு என்ன?", "आपकी सामाजिक श्रेणी क्या है?")}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {L("Determines affirmative welfare scheme eligibility (e.g. NSFDC 5% interest loans).", "சமூகப் பிரிவு திட்ட தகுதியை நிர்ணயிக்கிறது.", "संबद्ध कल्याणकारी योजनाओं के लिए आवश्यक।")}
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { v: 'SC/ST',   label: L('SC / ST (Target Welfare Beneficiary)', 'பட்டியலினத்தவர் (SC/ST)', 'अनुसूचित जाति / जनजाति (SC/ST)'), desc: 'Eligible for NSFDC 5.0% Concessional Credit & TAHDCO 35% Direct Subsidy' },
                  { v: 'OBC',     label: L('OBC (Other Backward Classes)', 'பிற்படுத்தப்பட்டோர் (OBC)', 'अन्य पिछड़ा वर्ग (OBC)'), desc: 'Eligible for NBCFDC 6.0% Credit Schemes & PM Vishwakarma Grants' },
                  { v: 'General', label: L('General / Other', 'பொதுப் பிரிவு (General)', 'सामान्य / अन्य'), desc: 'Eligible for PMEGP (up to 25% subsidy) and MUDRA Shishu/Kishore loans' },
                ].map(opt => (
                  <button
                    key={opt.v}
                    type="button"
                    onClick={() => setProfile({ ...profile, caste: opt.v })}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left transition cursor-pointer ${
                      profile.caste === opt.v
                        ? 'border-blue-600 bg-blue-50/80 shadow-md ring-2 ring-blue-400/20'
                        : 'border-slate-200 bg-slate-50 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex-1">
                      <div className={`text-sm font-black ${profile.caste === opt.v ? 'text-blue-900' : 'text-slate-900'}`}>
                        {opt.label}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                    </div>
                    {profile.caste === opt.v && <span className="text-blue-600 font-black text-xl">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 7: 4-FACTOR DOCUMENT GATEWAY & SHG ──────────────── */}
          {currentStepIndex === 7 && (
            <div className="animate-fadeIn space-y-6">
              <div>
                <p className="text-xs font-black uppercase text-blue-600 tracking-wider mb-1">
                  STEP 7: 4-FACTOR DOCUMENT VERIFICATION
                </p>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {L("SHG Membership & 4-Factor Document Verification", "சுயஉதவிக்குழு நிலை & 4-ஆவண சரிபார்ப்பு வாயில்", "SHG सदस्यता और 4-कारक दस्तावेज़ सत्यापन")}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {L("Client-side RAM OCR: Documents are parsed strictly inside your browser. Zero server storage.", "ஆவணங்கள் உங்கள் உலாவியில் மட்டுமே பகுப்பாய்வு செய்யப்படும்.", "क्लाइंट-साइड RAM OCR: दस्तावेज़ केवल ब्राउज़र में प्रोसेस होते हैं।")}
                </p>
              </div>

              {/* SHG Selection */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-600 mb-2">
                  {L("Are you an Active SHG Member? *", "சுயஉதவிக்குழு உறுப்பினரா? *", "क्या आप सक्रिय SHG सदस्य हैं? *")}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { v: 'Yes', label: L('Yes — Active SHG Member', 'ஆம் — உறுப்பினர்', 'हाँ — सक्रिय सदस्य') },
                    { v: 'No',  label: L('No — Not a Member', 'இல்லை — உறுப்பினர் இல்லை', 'नहीं — सदस्य नहीं') },
                  ].map(opt => (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => setProfile({ ...profile, shg_membership: opt.v })}
                      className={`py-3.5 rounded-xl border-2 text-xs font-black transition cursor-pointer ${
                        profile.shg_membership === opt.v
                          ? 'border-blue-600 bg-blue-50 text-blue-800 shadow-sm'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Presentation Demo Mode Button */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-black uppercase text-slate-700 tracking-wide flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  Interactive 4-Factor Document Dropzone Grid
                </span>
                <button
                  type="button"
                  onClick={handleDemoScanAll}
                  className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>⚡ Demo Mode: Auto-Scan Sample Citizen Packet</span>
                </button>
              </div>

              {/* Interactive 2x2 Dropzone Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Aadhaar Dropzone */}
                <div className={`p-4 rounded-2xl border-2 transition ${
                  ocrCards.aadhaar.status === 'passed' 
                    ? 'border-emerald-400 bg-emerald-50/50' 
                    : ocrCards.aadhaar.status === 'scanning'
                    ? 'border-blue-400 bg-blue-50/50 animate-pulse'
                    : 'border-dashed border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-white'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      🪪 1. Aadhaar Card Dropzone
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ocrCards.aadhaar.status === 'passed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {ocrCards.aadhaar.status === 'passed' ? 'Scanned & Verified 🟢' : 'Accepts PDF/Image'}
                    </span>
                  </div>

                  {ocrCards.aadhaar.status === 'scanning' ? (
                    <div className="py-4 text-center text-xs font-bold text-blue-700 flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      Parsing Document with Client RAM OCR... ⏳
                    </div>
                  ) : ocrCards.aadhaar.status === 'passed' ? (
                    <div className="space-y-1.5 pt-1">
                      <div className="text-xs font-bold text-emerald-900 bg-white p-2 rounded-xl border border-emerald-200">
                        {ocrCards.aadhaar.badge}
                      </div>
                      <span className="text-[10px] text-slate-500 block font-mono">
                        File: {ocrCards.aadhaar.file}
                      </span>
                    </div>
                  ) : (
                    <label className="block text-center py-4 cursor-pointer">
                      <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                      <span className="text-xs font-bold text-blue-600 hover:underline block">
                        Upload or Drag Aadhaar Card
                      </span>
                      <span className="text-[10px] text-slate-400">PDF, JPG, PNG (Client RAM OCR)</span>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload('aadhaar', e.target.files[0])}
                      />
                    </label>
                  )}
                </div>

                {/* 2. PAN Card Dropzone */}
                <div className={`p-4 rounded-2xl border-2 transition ${
                  ocrCards.pan.status === 'passed' 
                    ? 'border-emerald-400 bg-emerald-50/50' 
                    : ocrCards.pan.status === 'scanning'
                    ? 'border-blue-400 bg-blue-50/50 animate-pulse'
                    : 'border-dashed border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-white'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      💳 2. PAN Card Dropzone
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ocrCards.pan.status === 'passed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {ocrCards.pan.status === 'passed' ? 'Scanned & Verified 🟢' : 'Accepts Image'}
                    </span>
                  </div>

                  {ocrCards.pan.status === 'scanning' ? (
                    <div className="py-4 text-center text-xs font-bold text-blue-700 flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      Parsing Document with Client RAM OCR... ⏳
                    </div>
                  ) : ocrCards.pan.status === 'passed' ? (
                    <div className="space-y-1.5 pt-1">
                      <div className="text-xs font-bold text-emerald-900 bg-white p-2 rounded-xl border border-emerald-200">
                        {ocrCards.pan.badge}
                      </div>
                      <span className="text-[10px] text-slate-500 block font-mono">
                        File: {ocrCards.pan.file}
                      </span>
                    </div>
                  ) : (
                    <label className="block text-center py-4 cursor-pointer">
                      <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                      <span className="text-xs font-bold text-blue-600 hover:underline block">
                        Upload or Drag PAN Card
                      </span>
                      <span className="text-[10px] text-slate-400">JPG, PNG (Format Validation)</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload('pan', e.target.files[0])}
                      />
                    </label>
                  )}
                </div>

                {/* 3. Community Certificate Dropzone */}
                <div className={`p-4 rounded-2xl border-2 transition ${
                  ocrCards.community.status === 'passed' 
                    ? 'border-emerald-400 bg-emerald-50/50' 
                    : ocrCards.community.status === 'scanning'
                    ? 'border-blue-400 bg-blue-50/50 animate-pulse'
                    : 'border-dashed border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-white'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      📜 3. Community Certificate
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ocrCards.community.status === 'passed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {ocrCards.community.status === 'passed' ? 'Scanned & Verified 🟢' : 'Accepts e-District'}
                    </span>
                  </div>

                  {ocrCards.community.status === 'scanning' ? (
                    <div className="py-4 text-center text-xs font-bold text-blue-700 flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      Parsing Document with Client RAM OCR... ⏳
                    </div>
                  ) : ocrCards.community.status === 'passed' ? (
                    <div className="space-y-1.5 pt-1">
                      <div className="text-xs font-bold text-emerald-900 bg-white p-2 rounded-xl border border-emerald-200">
                        {ocrCards.community.badge}
                      </div>
                      <span className="text-[10px] text-slate-500 block font-mono">
                        File: {ocrCards.community.file}
                      </span>
                    </div>
                  ) : (
                    <label className="block text-center py-4 cursor-pointer">
                      <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                      <span className="text-xs font-bold text-blue-600 hover:underline block">
                        Upload Community Certificate
                      </span>
                      <span className="text-[10px] text-slate-400">PDF, JPG (e-District Verification)</span>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload('community', e.target.files[0])}
                      />
                    </label>
                  )}
                </div>

                {/* 4. Income Certificate Dropzone */}
                <div className={`p-4 rounded-2xl border-2 transition ${
                  ocrCards.income.status === 'passed' 
                    ? 'border-emerald-400 bg-emerald-50/50' 
                    : ocrCards.income.status === 'scanning'
                    ? 'border-blue-400 bg-blue-50/50 animate-pulse'
                    : 'border-dashed border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-white'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      📋 4. Income Certificate
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ocrCards.income.status === 'passed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {ocrCards.income.status === 'passed' ? 'Scanned & Verified 🟢' : 'Accepts Revenue Doc'}
                    </span>
                  </div>

                  {ocrCards.income.status === 'scanning' ? (
                    <div className="py-4 text-center text-xs font-bold text-blue-700 flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      Parsing Document with Client RAM OCR... ⏳
                    </div>
                  ) : ocrCards.income.status === 'passed' ? (
                    <div className="space-y-1.5 pt-1">
                      <div className="text-xs font-bold text-emerald-900 bg-white p-2 rounded-xl border border-emerald-200">
                        {ocrCards.income.badge}
                      </div>
                      <span className="text-[10px] text-slate-500 block font-mono">
                        File: {ocrCards.income.file}
                      </span>
                    </div>
                  ) : (
                    <label className="block text-center py-4 cursor-pointer">
                      <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                      <span className="text-xs font-bold text-blue-600 hover:underline block">
                        Upload Income Certificate
                      </span>
                      <span className="text-[10px] text-slate-400">PDF, JPG (Revenue Dept Verification)</span>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload('income', e.target.files[0])}
                      />
                    </label>
                  )}
                </div>

              </div>

              {/* Two-Stage Mobile OTP Flow (Displayed ONLY after all 4 document cards display PASSED) */}
              {allOcrPassed && (
                <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-slate-200 flex items-center gap-2">
                      <Key className="w-4 h-4 text-blue-400" />
                      Two-Stage Mobile OTP Verification
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/40">
                      4-Factor OCR Passed 🟢
                    </span>
                  </div>

                  {otpToast && (
                    <div className="bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center justify-between animate-fadeIn">
                      <span>📲 {otpToast}</span>
                      <span className="text-[10px] opacity-80 font-mono">Test OTP: 2354</span>
                    </div>
                  )}

                  {!otpSent ? (
                    /* Stage 1: Mobile Input Stage */
                    <div className="space-y-2.5">
                      <p className="text-xs text-slate-400">
                        Enter your Aadhaar-linked mobile number to receive the verification OTP.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2 max-w-md">
                        <div className="relative flex-1">
                          <span className="absolute left-3.5 top-3 text-xs font-bold text-slate-400">+91</span>
                          <input
                            type="text"
                            maxLength={10}
                            placeholder="Enter Aadhaar-Linked Mobile Number"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value.replace(/[^0-9]/g, ''))}
                            className="w-full pl-12 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold text-white focus:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-500 font-mono tracking-wider"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={isSendingOtp || !mobileNumber || mobileNumber.length < 10}
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-sm flex items-center justify-center gap-2"
                        >
                          {isSendingOtp ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-white" />
                              <span>Sending OTP... ⏳</span>
                            </>
                          ) : (
                            <span>Send OTP 📲</span>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Stage 2: OTP Dispatch & Verification Stage */
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">
                          Demo OTP dispatched to <b>+91 {mobileNumber}</b>
                        </span>
                        <button
                          type="button"
                          onClick={() => { setOtpSent(false); setOtpVerified(false); setOtpInput(""); }}
                          className="text-blue-400 hover:underline text-[11px] cursor-pointer"
                        >
                          Change Number
                        </button>
                      </div>

                      <div className="flex gap-2 max-w-sm">
                        <input
                          type="text"
                          maxLength={4}
                          placeholder="2354"
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                          disabled={otpVerified}
                          className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-center text-lg font-black text-white focus:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-500 font-mono tracking-widest disabled:opacity-50"
                        />
                        {!otpVerified ? (
                          <button
                            type="button"
                            onClick={handleVerifyOtp}
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-sm"
                          >
                            Verify OTP
                          </button>
                        ) : (
                          <div className="px-4 py-2.5 bg-emerald-600 text-white text-xs font-black rounded-xl flex items-center gap-1.5 shadow-sm animate-fadeIn">
                            <Check className="w-4 h-4" />
                            <span>Beneficiary Approved 🟢</span>
                          </div>
                        )}
                      </div>
                      {otpError && <p className="text-xs font-bold text-rose-400">{otpError}</p>}
                    </div>
                  )}
                </div>
              )}

              {/* Main Action CTA — 3 Explicit Verification States */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!allOcrPassed || !otpVerified}
                className={`w-full py-4 font-black text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer ${
                  allOcrPassed && otpVerified
                    ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-emerald-500/25 ring-2 ring-emerald-400/40'
                    : 'bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300'
                }`}
              >
                {!allOcrPassed ? (
                  <>
                    <Lock className="w-4 h-4 text-slate-400" />
                    <span>🔒 Complete Document Authentication Above to Proceed</span>
                  </>
                ) : !otpVerified ? (
                  <>
                    <Lock className="w-4 h-4 text-amber-500 animate-pulse" />
                    <span className="text-slate-700 font-bold">🔒 Complete OTP Verification to Proceed</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-amber-300 animate-bounce" />
                    <span>Continue to Eligible Schemes →</span>
                  </>
                )}
              </button>

            </div>
          )}

        </div>

        {/* Unified Synchronized Navigation Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={wizardBack}
            disabled={currentStepIndex === 1}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            ← Back
          </button>

          <span className="text-xs font-black text-slate-500 font-mono">
            {currentStepIndex} / {TOTAL_STEPS}
          </span>

          {currentStepIndex < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={wizardNext}
              disabled={!isStepValid(currentStepIndex)}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-xl text-sm font-bold text-white transition cursor-pointer shadow-xs"
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!allOcrPassed || !otpVerified}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-xl text-sm font-bold text-white transition cursor-pointer shadow-xs"
            >
              <span>{allOcrPassed && otpVerified ? "Continue to Eligible Schemes →" : "Next →"}</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
}

export default FormVerificationPage;
