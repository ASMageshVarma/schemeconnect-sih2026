import React, { useState } from 'react';
import { 
  Sparkles, Mic, Camera, FileText, ArrowRight, ShieldCheck, 
  Building2, Users, CheckCircle2, TrendingUp, Landmark, Award, 
  MapPin, Calculator, Bot, ChevronRight, Zap, Radio, Laptop
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { Navbar } from './components/Navbar';
import { SchemeConnectFeed } from './components/SchemeConnectFeed';
import { AlphaPortalConsole } from './components/AlphaPortalConsole';
import { SplitDemoView } from './components/SplitDemoView';
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
  const [lang, setLang] = useState('en'); // Default to English / Tamil
  const [view, setView] = useState('feed'); // 'feed', 'alpha-portal', 'split-demo', 'calc', 'locator', 'counselor', 'form', 'voice', 'ocr', 'results', 'admin'
  const [currentProfile, setCurrentProfile] = useState({
    name: "Rajan S.",
    age: 39,
    gender: "Male",
    caste: "SC/ST",
    project_type: "Micro Business / Street Vending",
    estimated_cost: 140000,
    education_status: "10th / 12th Pass",
    occupation: "Street Vendor",
    annual_income: 200000,
    income: 200000,
    area: "Urban",
    sector: "Street Vendor",
    shg_membership: "No",
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
      const clientResults = matchSchemesClient(profile);
      setMatchResults(clientResults);
      setIsOnline(false);
    }

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

  // If in full split-screen judge demo view
  if (view === 'split-demo') {
    return (
      <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between ${getFontSizeClass()}`}>
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
        <SplitDemoView
          lang={lang}
          t={t}
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
        isOnline={isOnline}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />

      {/* Main Viewport */}
      <main className="flex-1">
        
        {/* VIEW: SCHEMECONNECT FEED (DEFAULT CITIZEN FEED) */}
        {(view === 'feed' || view === 'home') && (
          <SchemeConnectFeed
            lang={lang}
            t={t}
            onOpenCalculator={() => setView('calc')}
            onOpenLocator={() => setView('locator')}
            onOpenCounselor={() => setView('counselor')}
            onOpenSplitDemo={() => setView('split-demo')}
            onOpenAdmin={() => setView('alpha-portal')}
          />
        )}

        {/* VIEW: ALPHA PORTAL CONSOLE */}
        {view === 'alpha-portal' && (
          <AlphaPortalConsole
            onOpenSplitDemo={() => setView('split-demo')}
          />
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

        {/* VIEW: AI MITRA COUNSELOR */}
        {view === 'counselor' && (
          <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center space-x-2 text-purple-700 font-bold text-sm mb-2">
                <Bot className="w-5 h-5" />
                <span>AI Mitra Welfare Counselor</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-4">
                Conversational Assistant for Eligible & Ineligible Entrepreneurs
              </h2>
              <AiCounselorChat lang={lang} t={t} isEmbedded={true} currentProfile={currentProfile} />
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

        {/* VIEW: LEGACY RESULTS DASHBOARD */}
        {view === 'results' && (
          <BeneficiaryDashboard
            results={matchResults}
            currentProfile={currentProfile}
            lang={lang}
            t={t}
            onReset={() => setView('feed')}
            onOpenCenterLocator={() => setView('locator')}
            onOpenCalculator={() => setView('calc')}
            onOpenCounselor={() => setView('counselor')}
            onSimulateProfile={(newProfile) => handleProfileReceived(newProfile)}
          />
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
      {view !== 'counselor' && view !== 'split-demo' && (
        <AiCounselorChat lang={lang} t={t} currentProfile={currentProfile} />
      )}

      {/* Clean Footer */}
      {view !== 'split-demo' && (
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
