import React, { useState } from 'react';
import { 
  Sparkles, Mic, Camera, FileText, ArrowRight, ShieldCheck, 
  Building2, Users, CheckCircle2, TrendingUp, Landmark, Award, 
  MapPin, Calculator, Bot, ChevronRight, Zap, Radio, Laptop
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { FormVerificationPage } from './components/FormVerificationPage';
import { RecommendationsGridPage } from './components/RecommendationsGridPage';
import { AlphaPortalConsole } from './components/AlphaPortalConsole';
import { SplitDemoView } from './components/SplitDemoView';
import { FinancialCalculator } from './components/FinancialCalculator';
import { CenterLocator } from './components/CenterLocator';
import { AdminCMS } from './components/AdminCMS';
import { AiCounselorChat } from './components/AiCounselorChat';

import { TRANSLATIONS } from './data/translations';

export default function App() {
  const [lang, setLang] = useState('en'); // Default 'en' or 'ta'
  const [view, setView] = useState('landing'); // 'landing', 'find-schemes', 'recommendations', 'alpha-portal', 'demo-split', 'calc', 'locator', 'counselor', 'admin'
  
  // Default Benchmark Test State:
  // Age: 39 | Area: Urban | Sector: Street Vendor | Income: ₹2,00,000 | SHG Member: No
  const [currentProfile, setCurrentProfile] = useState({
    name: "Rajan S.",
    age: 39,
    area: "Urban",
    sector: "Street Vendor",
    income: 200000,
    annual_income: 200000,
    shg_membership: "No",
    gender: "Male",
    caste: "SC/ST",
    district: "Tiruchirappalli",
    state: "Tamil Nadu",
    documents: ["Aadhaar Card", "Bank Account Passbook", "Community Certificate", "Income Certificate"]
  });

  const [fontSize, setFontSize] = useState('base'); // 'sm', 'base', 'lg'

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const handleProfileSubmitted = (profile) => {
    setCurrentProfile(profile);
    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
    setView('recommendations');
  };

  const getFontSizeClass = () => {
    if (fontSize === 'lg') return 'text-lg';
    if (fontSize === 'sm') return 'text-sm';
    return 'text-base';
  };

  // Split-Screen Judge Pitch View
  if (view === 'demo-split' || view === 'split-demo') {
    return (
      <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between ${getFontSizeClass()}`}>
        <Navbar
          lang={lang}
          setLang={setLang}
          t={t}
          view={view}
          setView={setView}
          isOnline={true}
          fontSize={fontSize}
          setFontSize={setFontSize}
        />
        <SplitDemoView
          userProfile={currentProfile}
          lang={lang}
          t={t}
          onEditProfile={() => setView('find-schemes')}
          onOpenCalculator={() => setView('calc')}
          onOpenLocator={() => setView('locator')}
          onOpenCounselor={() => setView('counselor')}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-50/70 text-slate-900 flex flex-col justify-between ${getFontSizeClass()}`}>
      
      {/* Top Navigation Bar */}
      <Navbar
        lang={lang}
        setLang={setLang}
        t={t}
        view={view}
        setView={setView}
        isOnline={true}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />

      {/* Main View Area */}
      <main className="flex-1">
        
        {/* PAGE 1: LANDING PAGE (/) */}
        {(view === 'landing' || view === 'home') && (
          <LandingPage
            lang={lang}
            setLang={setLang}
            t={t}
            onNavigate={(page) => setView(page)}
          />
        )}

        {/* PAGE 2: FORM & VERIFICATION PAGE (/find-schemes) */}
        {(view === 'find-schemes' || view === 'form') && (
          <FormVerificationPage
            initialProfile={currentProfile}
            lang={lang}
            t={t}
            onSubmit={handleProfileSubmitted}
            onBack={() => setView('landing')}
          />
        )}

        {/* PAGE 3: RECOMMENDATION RESULTS GRID (/recommendations) */}
        {(view === 'recommendations' || view === 'feed' || view === 'results') && (
          <RecommendationsGridPage
            userProfile={currentProfile}
            lang={lang}
            t={t}
            onEditProfile={() => setView('find-schemes')}
            onOpenCalculator={() => setView('calc')}
            onOpenLocator={() => setView('locator')}
            onOpenCounselor={() => setView('counselor')}
            onOpenSplitDemo={() => setView('demo-split')}
            onOpenAdmin={() => setView('alpha-portal')}
          />
        )}

        {/* PAGE 4: ALPHA PORTAL ADMIN CONSOLE (/alpha-portal) */}
        {view === 'alpha-portal' && (
          <AlphaPortalConsole
            onOpenSplitDemo={() => setView('demo-split')}
          />
        )}

        {/* FINANCIAL CALCULATOR */}
        {view === 'calc' && (
          <div className="py-4">
            <FinancialCalculator
              initialProjectCost={currentProfile?.estimated_cost || 140000}
              lang={lang}
              t={t}
            />
          </div>
        )}

        {/* GEO-SPATIAL PARTNER LOCATOR */}
        {view === 'locator' && (
          <div className="py-4">
            <CenterLocator
              lang={lang}
              t={t}
              defaultDistrict={currentProfile?.district || "Tiruchirappalli"}
            />
          </div>
        )}

        {/* AI MITRA COUNSELOR */}
        {view === 'counselor' && (
          <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center space-x-2 text-purple-700 font-bold text-sm mb-2">
                <Bot className="w-5 h-5" />
                <span>AI Mitra Welfare Counselor</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-4">
                Conversational Welfare Counselor (English & தமிழ்)
              </h2>
              <AiCounselorChat lang={lang} t={t} isEmbedded={true} currentProfile={currentProfile} />
            </div>
          </div>
        )}

        {/* ADMIN CMS */}
        {view === 'admin' && (
          <AdminCMS
            lang={lang}
            t={t}
          />
        )}

      </main>

      {/* Floating AI Mitra Chat Drawer */}
      {view !== 'counselor' && view !== 'demo-split' && (
        <AiCounselorChat lang={lang} t={t} currentProfile={currentProfile} />
      )}

      {/* Clean Footer */}
      {view !== 'demo-split' && (
        <footer className="bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="font-semibold text-slate-700">
              SchemeConnect & Alpha Portal — SIH 2026 Proof of Concept
            </span>
            <span>
              Developed by <strong>Team TechTitans</strong> (SIH-9E972H) • Saranathan College of Engineering
            </span>
          </div>
        </footer>
      )}

    </div>
  );
}
