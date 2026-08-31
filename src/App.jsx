import React, { useState } from 'react';
import { 
  Sparkles, Mic, Camera, FileText, ArrowRight, ShieldCheck, 
  Building2, Users, CheckCircle2, TrendingUp, Landmark, Award, 
  MapPin, Calculator, Bot, ChevronRight, Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { Navbar } from './components/Navbar';
import { VoiceIntake } from './components/VoiceIntake';
import { DocumentOCR } from './components/DocumentOCR';
import { ProfileForm } from './components/ProfileForm';
import { BeneficiaryDashboard } from './components/BeneficiaryDashboard';
import { FinancialCalculator } from './components/FinancialCalculator';
import { CenterLocator } from './components/CenterLocator';
import { AdminCMS } from './components/AdminCMS';
import { AiCounselorChat } from './components/AiCounselorChat';

import { TRANSLATIONS } from './data/translations';
import { matchSchemesClient } from './utils/matcher';

export default function App() {
  const [lang, setLang] = useState('ta'); // Default to Tamil as requested
  const [view, setView] = useState('home'); // 'home', 'voice', 'ocr', 'form', 'calc', 'locator', 'counselor', 'results', 'admin'
  const [currentProfile, setCurrentProfile] = useState({
    name: "Rajan S.",
    age: 38,
    gender: "Male",
    caste: "SC",
    project_type: "Micro Business / Street Vending",
    estimated_cost: 140000,
    education_status: "10th / 12th Pass",
    occupation: "Street Vendor",
    annual_income: 180000,
    state: "Tamil Nadu",
    district: "Tiruchirappalli",
    documents: ["Aadhaar Card", "Bank Account Passbook", "Community Certificate", "Income Certificate"]
  });
  const [matchResults, setMatchResults] = useState(null);
  const [isOnline, setIsOnline] = useState(true);

  // Accessibility font state
  const [fontSize, setFontSize] = useState('base'); // 'sm', 'base', 'lg'

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const handleProfileReceived = async (profile) => {
    setCurrentProfile(profile);
    
    // Try calling FastAPI backend first; fallback to client deterministic engine seamlessly
    try {
      const response = await fetch('http://localhost:8000/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (response.ok) {
        const data = await response.json();
        setMatchResults(data);
        setIsOnline(true);
      } else {
        throw new Error("Backend response error");
      }
    } catch (err) {
      // Client-side deterministic match fallback
      const clientResults = matchSchemesClient(profile);
      setMatchResults(clientResults);
      setIsOnline(false);
    }

    // Trigger celebratory confetti on high match score
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    setView('results');
  };

  const getFontSizeClass = () => {
    if (fontSize === 'lg') return 'text-lg';
    if (fontSize === 'sm') return 'text-sm';
    return 'text-base';
  };

  return (
    <div className={`min-h-screen bg-slate-50/70 text-slate-900 flex flex-col justify-between ${getFontSizeClass()}`}>
      
      {/* Top Clean Navbar */}
      <Navbar
        lang={lang}
        setLang={setLang}
        t={t}
        view={view}
        setView={setView}
        isOnline={isOnline}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />

      {/* Main View Area */}
      <main className="flex-1">
        
        {/* VIEW: HOME HERO */}
        {view === 'home' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
            
            {/* Hero Header */}
            <div className="text-center max-w-4xl mx-auto mb-14">
              
              <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-900 px-4 py-1.5 rounded-full text-xs font-black border border-blue-200 shadow-xs mb-5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>{t.ministry_badge}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.14] mb-5">
                {t.hero_title}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto mb-8">
                {t.hero_subtitle}
              </p>

              {/* 3 Core Hero Solution Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left mb-10">
                
                {/* Pillar 1: Smart Scheme Recommender */}
                <div 
                  onClick={() => setView('form')}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div className="text-[10px] font-black text-blue-600 uppercase tracking-wider mb-1">
                      {t.p1_tag}
                    </div>
                    <h3 className="text-base font-black text-slate-900 mb-2 group-hover:text-blue-600 transition">
                      {t.p1_title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      {t.p1_desc}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-600">
                    <span>{t.p1_cta}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </div>
                </div>

                {/* Pillar 2: Dynamic Financial Calculator */}
                <div 
                  onClick={() => setView('calc')}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                      <Calculator className="w-6 h-6" />
                    </div>
                    <div className="text-[10px] font-black text-emerald-600 uppercase tracking-wider mb-1">
                      {t.p2_tag}
                    </div>
                    <h3 className="text-base font-black text-slate-900 mb-2 group-hover:text-emerald-600 transition">
                      {t.p2_title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      {t.p2_desc}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-600">
                    <span>{t.p2_cta}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </div>
                </div>

                {/* Pillar 3: Geo-Spatial Partner Locator & Router */}
                <div 
                  onClick={() => setView('locator')}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div className="text-[10px] font-black text-purple-600 uppercase tracking-wider mb-1">
                      {t.p3_tag}
                    </div>
                    <h3 className="text-base font-black text-slate-900 mb-2 group-hover:text-purple-600 transition">
                      {t.p3_title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      {t.p3_desc}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-purple-600">
                    <span>{t.p3_cta}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </div>
                </div>

              </div>

              {/* Quick Profile Run Bar */}
              <div className="p-5 bg-gradient-to-r from-slate-900 to-blue-950 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left">
                  <div className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                    {t.demo_title}
                  </div>
                  <div className="text-sm sm:text-base font-black">
                    {t.demo_desc}
                  </div>
                </div>
                <button
                  onClick={() => handleProfileReceived(currentProfile)}
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-2xl transition flex items-center gap-2 shadow-md shrink-0"
                >
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>{t.demo_btn}</span>
                </button>
              </div>

            </div>

            {/* Bottom Key Metric Badges */}
            <div className="border-t border-slate-200 pt-8 max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xl sm:text-2xl font-black text-slate-900 block">≤ ₹5.00L</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">{t.metric_income}</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xl sm:text-2xl font-black text-blue-600 block">6.5% – 8%</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">{t.metric_rate}</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xl sm:text-2xl font-black text-emerald-600 block">Up to 90%</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">{t.metric_share}</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xl sm:text-2xl font-black text-purple-600 block">100+</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">{t.metric_partners}</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
                <span className="text-xl sm:text-2xl font-black text-slate-900 block">&lt; 2 Mins</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">{t.metric_speed}</span>
              </div>
            </div>

          </div>
        )}

        {/* VIEW: SMART PROFILER (FORM) */}
        {view === 'form' && (
          <div className="py-8 px-4">
            <ProfileForm
              lang={lang}
              t={t}
              initialProfile={currentProfile}
              onFindSchemes={handleProfileReceived}
            />
          </div>
        )}

        {/* VIEW: VOICE INTAKE */}
        {view === 'voice' && (
          <div className="py-8 px-4">
            <VoiceIntake
              lang={lang}
              t={t}
              onProfileExtracted={handleProfileReceived}
              onSwitchToForm={() => setView('form')}
            />
          </div>
        )}

        {/* VIEW: DOCUMENT OCR */}
        {view === 'ocr' && (
          <div className="py-8 px-4">
            <DocumentOCR
              lang={lang}
              t={t}
              onProfileExtracted={handleProfileReceived}
            />
          </div>
        )}

        {/* VIEW: FINANCIAL CALCULATOR */}
        {view === 'calc' && (
          <div className="py-4">
            <FinancialCalculator
              initialProjectCost={currentProfile?.estimated_cost || 140000}
              lang={lang}
              t={t}
            />
          </div>
        )}

        {/* VIEW: GEO-SPATIAL PARTNER LOCATOR */}
        {view === 'locator' && (
          <div className="py-4">
            <CenterLocator
              lang={lang}
              t={t}
              defaultDistrict={currentProfile?.district || "Tiruchirappalli"}
            />
          </div>
        )}

        {/* VIEW: RESULTS DASHBOARD */}
        {view === 'results' && (
          <BeneficiaryDashboard
            results={matchResults}
            currentProfile={currentProfile}
            lang={lang}
            t={t}
            onReset={() => setView('form')}
            onOpenCenterLocator={() => setView('locator')}
            onOpenCalculator={() => setView('calc')}
            onOpenCounselor={() => setView('counselor')}
            onSimulateProfile={(newProfile) => handleProfileReceived(newProfile)}
          />
        )}

        {/* VIEW: AI MITRA COUNSELOR */}
        {view === 'counselor' && (
          <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center space-x-2 text-purple-700 font-bold text-sm mb-2">
                <Bot className="w-5 h-5" />
                <span>{t.mitra_title}</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-4">
                {t.mitra_subtitle}
              </h2>
              <AiCounselorChat lang={lang} t={t} isEmbedded={true} currentProfile={currentProfile} />
            </div>
          </div>
        )}

        {/* VIEW: ADMIN CMS */}
        {view === 'admin' && (
          <AdminCMS
            lang={lang}
            t={t}
          />
        )}

      </main>

      {/* Floating AI Mitra Chat Drawer */}
      {view !== 'counselor' && <AiCounselorChat lang={lang} t={t} currentProfile={currentProfile} />}

      {/* Clean Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-semibold text-slate-700">
            SchemeConnect — Smart India Hackathon (SIH 2026)
          </span>
          <span>
            {lang === 'ta' ? "உருவாக்கம்: குழு டெக் டைட்டன்ஸ் (SIH-9E972H) • சாரநாதன் பொறியியல் கல்லூரி" : (lang === 'hi' ? "विकसित: टीम टेक टाइटन्स (SIH-9E972H) • सरनाथन कॉलेज" : "Developed by Team TechTitans (SIH-9E972H) • Saranathan College of Engineering")}
          </span>
        </div>
      </footer>

    </div>
  );
}
