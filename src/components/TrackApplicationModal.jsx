import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, Landmark, ShieldCheck, FileText, AlertCircle } from 'lucide-react';
import { getBankApplications } from '../utils/bankStore';

export function TrackApplicationModal({ lang = "en", onClose }) {
  const isTa = lang === "ta";
  const isHi = lang === "hi";
  const L = (en, ta, hi) => isHi ? hi : (isTa ? ta : en);

  const applications = getBankApplications();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState(applications[0] || null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setHasSearched(true);
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    const found = applications.find(
      (a) => a.application_id.toLowerCase().includes(q) || 
             a.applicant_name.toLowerCase().includes(q) ||
             a.scheme_name.toLowerCase().includes(q)
    );
    setSelectedApp(found || null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#0f172a] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                {L("Track Existing Application Status", "விண்ணப்ப நிலையை கண்காணித்தல்", "मौजूदा आवेदन स्थिति ट्रैक करें")}
              </h3>
              <p className="text-[11px] text-slate-400">
                {L("Live query against Central & Partner Banking nodes", "மத்திய மற்றும் வங்கி முனையங்களில் நிகழ்நேர நிலை", "केंद्रीय एवं बैंक नोड्स से रीयल-टाइम स्थिति")}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder={L("Enter Application ID (e.g. APP-SC-98214 or APP-2026)", "விண்ணப்ப எண்ணை உள்ளிடவும் (எ.கா. APP-SC-98214)", "आवेदन आईडी दर्ज करें (उदा. APP-SC-98214)")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#1e293b] hover:bg-[#0f172a] text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-xs"
            >
              {L("Track", "தேடு", "ट्रैक")}
            </button>
          </form>

          {/* Quick Recent Applications Pills */}
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-2">
              {L("Recent Submissions:", "சமீபத்திய விண்ணப்பங்கள்:", "हाल के आवेदन:")}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {applications.slice(0, 4).map((app) => (
                <button
                  key={app.application_id}
                  type="button"
                  onClick={() => {
                    setSelectedApp(app);
                    setSearchQuery(app.application_id);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition cursor-pointer border ${
                    selectedApp?.application_id === app.application_id
                      ? "bg-blue-50 text-blue-900 border-blue-300"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200"
                  }`}
                >
                  {app.application_id} ({app.applicant_name})
                </button>
              ))}
            </div>
          </div>

          {/* Application Detail Card */}
          {selectedApp ? (
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3.5 text-xs">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Application Reference</span>
                  <span className="font-mono font-bold text-sm text-slate-900">{selectedApp.application_id}</span>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                  selectedApp.verification_status === "SANCTIONED"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                    : "bg-blue-50 text-blue-700 border-blue-200"
                }`}>
                  {selectedApp.verification_status === "SANCTIONED" ? "✓ SANCTIONED & DISBURSED 🟢" : `● ${selectedApp.verification_status || "IN_REVIEW"}`}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">{L("Beneficiary Name:", "பயனாளி பெயர்:", "लाभार्थी का नाम:")}</span>
                  <span className="font-bold text-slate-900">{selectedApp.applicant_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">{L("Lending Partner Bank:", "வழங்கும் வங்கி:", "ऋणदाता बैंक:")}</span>
                  <span className="font-semibold text-slate-800">{selectedApp.bank_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">{L("Welfare Scheme:", "நலத்திட்டம்:", "कल्याण योजना:")}</span>
                  <span className="font-semibold text-slate-800 truncate block">{selectedApp.scheme_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">{L("Sanction Amount:", "ஒப்புதல் தொகை:", "स्वीकृत राशि:")}</span>
                  <span className="font-bold text-slate-900 text-sm">₹{Number(selectedApp.sanction_amount || 140000).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>eKYC Authenticated 🟢</span>
                </span>
                <span>Updated: {new Date(selectedApp.updated_at || Date.now()).toLocaleDateString()}</span>
              </div>

            </div>
          ) : hasSearched ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{L("No matching application found. Please check the ID or submit a new registration.", "பொருந்தும் விண்ணப்பம் கிடைக்கவில்லை. தயவுசெய்து எண்ணை சரிபார்க்கவும்.", "कोई मिलान नहीं मिला। कृपया आवेदन आईडी जांचें या नया पंजीकरण करें।")}</span>
            </div>
          ) : null}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-lg transition cursor-pointer"
          >
            {L("Close Window", "மூடுக", "बंद करें")}
          </button>
        </div>

      </div>
    </div>
  );
}
export default TrackApplicationModal;
