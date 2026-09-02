import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, AlertTriangle, Lock, Unlock, ArrowRight, 
  Volume2, VolumeX, Sparkles, Building2, ShieldCheck, IndianRupee, 
  Clock, Info, ChevronRight, UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { speakText, stopSpeaking } from '../utils/speech';

export function LiveSchemeCard({ 
  scheme, 
  userProfile, 
  lang = "en", 
  onSelect, 
  onOpenCalculator, 
  onOpenLocator,
  onApply 
}) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const [prevEligible, setPrevEligible] = useState(scheme.is_eligible);

  const isEligible = scheme.is_eligible === true;
  const matchPercentage = scheme.match_percentage || 0;

  // Detect Live Unlock from Alpha Portal Stream
  useEffect(() => {
    if (!prevEligible && isEligible) {
      setJustUnlocked(true);
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {}

      const timer = setTimeout(() => {
        setJustUnlocked(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
    setPrevEligible(isEligible);
  }, [isEligible, prevEligible]);

  const displayName = lang === 'ta' && scheme.scheme_name_ta 
    ? scheme.scheme_name_ta 
    : scheme.scheme_name;

  const handleAudio = (e) => {
    e.stopPropagation();
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const text = `${displayName}. ${scheme.ministry}. Sanctioned Amount: ₹${Number(scheme.sanctioned_amount).toLocaleString('en-IN')}. ${isEligible ? 'You are 100% eligible for this scheme.' : 'Currently locked. ' + scheme.failed_criteria.join('. ')}`;
      speakText(text, lang, () => setIsPlayingAudio(false));
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ 
        opacity: isEligible ? 1 : 0.7,
        scale: justUnlocked ? [1, 1.03, 1] : 1
      }}
      transition={{ duration: 0.35 }}
      className={`rounded-3xl border transition-all duration-300 flex flex-col justify-between p-5 sm:p-6 relative overflow-hidden ${
        isEligible
          ? (justUnlocked 
              ? 'bg-gradient-to-br from-emerald-50 via-white to-blue-50 border-emerald-500 shadow-xl ring-4 ring-emerald-400/30' 
              : 'bg-white border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-400')
          : 'bg-slate-50/80 border-dashed border-slate-300 grayscale-[60%] hover:grayscale-0 hover:bg-white'
      }`}
    >
      
      {/* Top Banner & Unlock Notification */}
      <AnimatePresence>
        {justUnlocked && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-emerald-600 text-white text-[11px] font-black px-3.5 py-1.5 rounded-xl mb-3 flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
              <span>UNLOCKED via Alpha Portal Live Admin Stream!</span>
            </div>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">100% MATCH</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        
        {/* Card Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          
          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
            isEligible 
              ? 'bg-blue-50 text-blue-800 border border-blue-200' 
              : 'bg-slate-200 text-slate-600'
          }`}>
            {scheme.highlight_badge || scheme.ministry}
          </span>

          <div className="flex items-center space-x-1.5">
            {/* Audio Voice Narration Button */}
            <button
              onClick={handleAudio}
              title="Voice Guidance"
              className={`p-1.5 rounded-full transition ${
                isPlayingAudio 
                  ? 'bg-blue-600 text-white animate-pulse' 
                  : 'bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-700'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {/* Match Percentage Pill */}
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black flex items-center gap-1 ${
              isEligible 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}>
              {isEligible ? <CheckCircle className="w-3 h-3 text-emerald-600" /> : <Lock className="w-3 h-3 text-amber-600" />}
              <span>{matchPercentage}% Match</span>
            </span>
          </div>

        </div>

        {/* Scheme Title & Ministry */}
        <h3 className={`font-black text-base leading-snug tracking-tight mb-1 ${isEligible ? 'text-slate-900' : 'text-slate-700'}`}>
          {displayName}
        </h3>
        <p className="text-xs text-slate-500 font-medium mb-4">
          {scheme.ministry}
        </p>

        {/* Sanctioned Amount & Key Specs Grid */}
        <div className={`p-3.5 rounded-2xl border mb-4 ${isEligible ? 'bg-slate-50 border-slate-200/80' : 'bg-slate-100/70 border-slate-200'}`}>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Sanctioned Amount</span>
              <span className={`text-sm font-black ${isEligible ? 'text-blue-700' : 'text-slate-700'}`}>
                ₹{Number(scheme.sanctioned_amount).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Age Bracket</span>
              <span className="text-xs font-bold text-slate-800">
                {scheme.age_min}–{scheme.age_max} Yrs
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Income Cap</span>
              <span className="text-xs font-bold text-slate-800">
                ≤ ₹{Number(scheme.income_cap).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">SHG Requirement</span>
              <span className={`text-xs font-bold ${scheme.shg_membership === 'Mandatory' ? 'text-purple-700' : 'text-slate-600'}`}>
                {scheme.shg_membership}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* FAILED CRITERIA BANNER (FOR INELIGIBLE / FROZEN SCHEMES)   */}
        {/* ========================================================= */}
        {!isEligible && scheme.failed_criteria?.length > 0 && (
          <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-3 mb-4 space-y-1.5">
            <div className="text-[10px] font-black uppercase text-amber-900 tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Ineligibility Diagnostics ({scheme.failed_criteria.length} Failed):</span>
            </div>
            {scheme.failed_criteria.map((fail, i) => (
              <div key={i} className="text-xs font-semibold text-amber-800 flex items-start gap-1.5 pl-1">
                <span className="text-amber-500 font-bold">•</span>
                <span>{fail}</span>
              </div>
            ))}
          </div>
        )}

        {/* PASSED REASONS (SAMPLE) */}
        {isEligible && scheme.passed_criteria?.length > 0 && (
          <div className="space-y-1 mb-4">
            {scheme.passed_criteria.slice(0, 2).map((pass, i) => (
              <div key={i} className="flex items-center space-x-1.5 text-xs text-slate-600">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{pass}</span>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* BOTTOM ACTION BAR (LOCKED VS UNLOCKED)                     */}
      {/* ========================================================= */}
      <div className="border-t border-slate-100 pt-3.5 flex items-center justify-between gap-2">
        
        {isEligible ? (
          <>
            <button
              onClick={() => onApply ? onApply(scheme) : onSelect(scheme)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black py-2.5 px-4 rounded-xl flex items-center justify-center space-x-1.5 shadow-md transition"
            >
              <span>Apply Now (100% Eligible)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onSelect(scheme)}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
              title="Full Details & Checklist"
            >
              <Info className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="w-full flex items-center justify-between gap-2">
            
            <button
              disabled
              className="flex-1 bg-slate-200 text-slate-400 cursor-not-allowed text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center space-x-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>🔒 Ineligible ({matchPercentage}% Match)</span>
            </button>

            <button
              onClick={() => onSelect(scheme)}
              className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition"
              title="View Ineligibility Audit"
            >
              <Info className="w-4 h-4" />
            </button>

          </div>
        )}

      </div>

    </motion.div>
  );
}
