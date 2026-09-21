import React, { useState, useRef } from 'react';
import { 
  Sparkles, ArrowRight, ShieldCheck, Building2, Users, 
  CheckCircle2, TrendingUp, Landmark, Award, MapPin, 
  Calculator, Bot, Radio, Laptop, FileText, Zap, Mic, Camera
} from 'lucide-react';
import { motion } from 'framer-motion';

export function LandingPage({ 
  lang = "en", 
  setLang, 
  t, 
  onNavigate,
  onAiSearch
}) {
  const isTa = lang === "ta";
  const isHi = lang === "hi";

  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = isTa ? "ta-IN" : isHi ? "hi-IN" : "en-IN";
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
        if (onAiSearch) {
          onAiSearch(transcript);
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  return (
    <div className="w-full bg-slate-50/70 text-slate-900 animate-fadeIn">
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-16 sm:pb-24">
        
        {/* National Portal Emblem Badge */}
        <div className="text-center max-w-4xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-blue-50 text-blue-900 px-4 py-1.5 rounded-full text-xs font-black border border-blue-200/80 shadow-xs mb-6"
          >
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>
              {isTa 
                ? "ப்ராஜெக்ட் எக்ஸ்போ மாதிரி முன்மாதிரி • JanSetu AI நலத்திட்ட மாதிரி தளம்" 
                : "Project Expo Concept Prototype • JanSetu AI Civic FinTech Simulation"}
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.14] mb-6"
          >
            {isTa 
              ? "விளிம்புநிலை தொழில்முனைவோருக்கான AI அரசு நலத்திட்ட வழிகாட்டி" 
              : "AI-Powered Multilingual Micro-Entrepreneur Scheme Matching Engine"}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto mb-10"
          >
            {isTa 
              ? "தெருவோர வியாபாரிகள், கைவினைஞர்கள் மற்றும் பட்டியலின சிறு வணிகர்களுக்கான 20+ மத்திய மற்றும் மாநில அரசு சலுகைக் கடன்களை துல்லியமாக கண்டறியுங்கள். நிகழ்நேர அரசு நிர்வாக இணைப்புடன் (Alpha Portal) இணைக்கப்பட்டுள்ளது."
              : "Discover verified government concessional micro-credit (≤₹1.40L), term loans (≤₹50L), and 35% capital subsidies in under 2 minutes with voice-to-text input, OCR verification, and real-time ministry sync."}
          </motion.p>

          {/* Prominent Voice/Text Input tied to AI Mitra Advisor */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="w-full max-w-2xl mx-auto mb-10 bg-white rounded-3xl p-3 sm:p-4 shadow-xl border-2 border-blue-600/30 text-left ring-4 ring-blue-500/10"
          >
            <div className="flex items-center justify-between px-2 pb-2 text-xs font-black text-slate-700">
              <div className="flex items-center space-x-2 text-blue-700">
                <Bot className="w-4 h-4 text-purple-600" />
                <span>{isTa ? "AI மித்ரா நேரடி தேடல்" : "AI Mitra Smart Scheme Matcher"}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold hidden sm:inline">
                {isTa ? "குரல் அல்லது எழுத்து மூலம் கேட்கவும்" : "Type or speak to find matches directly"}
              </span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (onAiSearch) {
                  onAiSearch(searchQuery);
                } else {
                  onNavigate("find-schemes");
                }
              }}
              className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isTa 
                  ? "எ.கா: 'தெருவோர வியாபார கடன்' அல்லது 'கைவினைஞர் மானியம்'..." 
                  : "e.g. 'loan for street vendor shop' or 'subsidy for handicraft'..."}
                className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
              />

              {/* Mic Button */}
              <button
                type="button"
                onClick={handleVoiceInput}
                title={isListening ? "Stop Listening" : "Speak to AI Mitra"}
                className={`p-2.5 rounded-xl transition cursor-pointer shrink-0 ${
                  isListening 
                    ? "bg-rose-600 text-white animate-pulse" 
                    : "bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>

              {/* Submit / Match CTA */}
              <button
                type="submit"
                className="px-4 sm:px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{isTa ? "பொருத்துக" : "Find Matches"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Quick Suggestions Chips */}
            <div className="flex flex-wrap gap-1.5 mt-3 px-1">
              <span className="text-[10px] font-black uppercase text-slate-400 py-1 mr-1">
                {isTa ? "பரிந்துரைகள்:" : "Quick:"}
              </span>
              {[
                { label: isTa ? "🛒 தெருவோர வியாபாரம் (PM SVANidhi)" : "🛒 Street Vendor (₹50k)", query: "street vendor loan PM SVANidhi" },
                { label: isTa ? "🪡 கைவினைஞர் கருவி (Vishwakarma)" : "🪡 Artisan Toolkit (₹15k)", query: "artisan Vishwakarma toolkit" },
                { label: isTa ? "🏭 உற்பத்தி மானியம் (PMEGP 35%)" : "🏭 Manufacturing 35% Subsidy", query: "manufacturing subsidy PMEGP" },
                { label: isTa ? "💼 SC/ST சலுகைக் கடன் (NSFDC)" : "💼 SC/ST Concessional (NSFDC)", query: "SC/ST concessional loan NSFDC" },
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSearchQuery(chip.query);
                    if (onAiSearch) onAiSearch(chip.query);
                  }}
                  className="text-[11px] font-semibold bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 px-2.5 py-1 rounded-xl transition cursor-pointer"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Core Multi-Page CTAs */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
          >
            
            {/* Primary CTA: 7-Step Guided Wizard / New Applicant Registration */}
            <button
              onClick={() => {
                try {
                  localStorage.removeItem('jansetu_wizard_step');
                  sessionStorage.removeItem('jansetu_wizard_step');
                } catch (e) {}
                onNavigate("find-schemes", { resume: false });
              }}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-sm rounded-2xl shadow-xl hover:shadow-2xl transition flex items-center justify-center space-x-3 group transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>{isTa ? "புதிய விண்ணப்பப் பதிவு (New Applicant Registration)" : "New Applicant Registration (7-Step Wizard)"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition" />
            </button>

            {/* Catalog CTA */}
            <button
              onClick={() => onNavigate("all-schemes")}
              className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold text-xs rounded-2xl shadow-sm transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>{isTa ? "அனைத்து 20+ திட்டங்களை பார்க்க" : "Browse All 20+ Schemes"}</span>
            </button>

          </motion.div>

          {/* Quick Input Features Featurettes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left mb-16">
            
            {/* Feature 1: Voice-to-Text */}
            <div 
              onClick={() => {
                try { localStorage.removeItem('jansetu_wizard_step'); } catch (e) {}
                onNavigate("find-schemes", { resume: false });
              }}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Mic className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-black text-blue-600 uppercase tracking-wider mb-1">
                  {isTa ? "குரல் வழி உள்ளீடு" : "Voice-to-Text Module"}
                </div>
                <h3 className="text-base font-black text-slate-900 mb-2">
                  {isTa ? "தாய்மொழியில் பேசி விண்ணப்பிக்க" : "Speak Details in Your Mother Tongue"}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {isTa 
                    ? "தமிழ் அல்லது ஆங்கிலத்தில் உங்கள் வயது, தொழில், வருமானத்தை பேசினால் படிவம் தானாக நிரம்பும்."
                    : "Speak your age, sector, and income into the mic to auto-populate the 7-parameter eligibility form in seconds."}
                </p>
              </div>
              <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-600">
                <span>{isTa ? "குரல் வழியை தொடங்க" : "Try Voice Intake"}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>

            {/* Feature 2: OCR Document Auto-Fill */}
            <div 
              onClick={() => {
                try { localStorage.removeItem('jansetu_wizard_step'); } catch (e) {}
                onNavigate("find-schemes", { resume: false });
              }}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-400 transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-black text-indigo-600 uppercase tracking-wider mb-1">
                  {isTa ? "ஆவண ஸ்கேனர் (OCR)" : "Client-Side OCR Scanning"}
                </div>
                <h3 className="text-base font-black text-slate-900 mb-2">
                  {isTa ? "ஆதார் / சாதி அட்டை ஸ்கேன்" : "Aadhaar & ID Auto-Extraction"}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {isTa 
                    ? "ஆதார் அல்லது ரேஷன் அட்டையை பதிவேற்றி 5 நொடிகளில் வயது, முகவரி மற்றும் பெயரை பிரித்தெடுக்கலாம்."
                    : "Upload citizen ID cards to automatically parse Name, Age, and Area using in-browser Tesseract OCR."}
                </p>
              </div>
              <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-600">
                <span>{isTa ? "ஆவணத்தை ஸ்கேன் செய்ய" : "Scan ID Card"}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>

            {/* Feature 3: Realtime Alpha Portal Sync */}
            <div 
              onClick={() => onNavigate("demo-split")}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-400 transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Radio className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-black text-emerald-600 uppercase tracking-wider mb-1">
                  {isTa ? "நிகழ்நேர அமைச்சக இணைப்பு" : "Live Ministry Sync"}
                </div>
                <h3 className="text-base font-black text-slate-900 mb-2">
                  {isTa ? "உடனடி அன்லாக் (Live Unlock)" : "Dynamic Realtime Card Unlocking"}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {isTa 
                    ? "அரசு கொள்கை மாற்றங்கள் நிகழ்நேரத்தில் ஸ்ட்ரீம் செய்யப்பட்டு தகுதி நிலையை உடனடியாக மாற்றுகிறது."
                    : "When ministries adjust age or income caps in Alpha Portal, JanSetu AI unlocks frozen cards live without refresh."}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate("demo-split");
                }}
                className="flex items-center space-x-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-800 transition cursor-pointer bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl w-fit"
              >
                <span>{isTa ? "செயல்விளக்கத்தை பார்க்க" : "View Live Sync"}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </button>
            </div>

          </div>

        </div>

        {/* Live National Welfare Statistics Bar */}
        <div className="border-t border-slate-200 pt-10 max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 block">20+</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase">{isTa ? "அங்கீகரிக்கப்பட்ட அரசு திட்டங்கள்" : "Active Welfare Schemes"}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-2xl sm:text-3xl font-black text-blue-600 block">5.0% – 8.0%</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase">{isTa ? "சலுகை வட்டி விகிதங்கள்" : "Concessional Rates"}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 block">&lt; 10ms</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase">{isTa ? "நிகழ்நேர நேரலை இணைப்பு" : "WebSocket Sync Latency"}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-2xl sm:text-3xl font-black text-purple-600 block">100%</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase">{isTa ? "துல்லியமான விதிமுறை பொருத்தம்" : "Deterministic Accuracy"}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
