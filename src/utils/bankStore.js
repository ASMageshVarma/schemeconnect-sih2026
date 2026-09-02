/**
 * Beta Portal Bank Applications Store
 * Conforms to Supabase / PostgreSQL Schema:
 * CREATE TABLE bank_applications (
 *   application_id UUID PRIMARY KEY,
 *   scheme_id TEXT REFERENCES alpha_schemes(scheme_id),
 *   scheme_name TEXT NOT NULL,
 *   bank_name TEXT NOT NULL,
 *   applicant_name TEXT NOT NULL,
 *   applicant_age INT NOT NULL,
 *   annual_income NUMERIC NOT NULL,
 *   sanction_amount NUMERIC NOT NULL,
 *   interest_rate NUMERIC NOT NULL,
 *   verification_status TEXT DEFAULT 'PRE_VERIFIED', -- 'PRE_VERIFIED', 'IN_REVIEW', 'SANCTIONED', 'REJECTED'
 *   sanction_letter_id TEXT,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 */

const STORAGE_KEY = "beta_bank_applications_store_v1";
const CHANNEL_NAME = "beta_bank_realtime_sync";

export const PARTICIPATING_BANKS = [
  {
    id: "STATE_BANK_OF_INDIA",
    name: "State Bank of India (Lead Bank)",
    name_ta: "பாரத ஸ்டேட் வங்கி (முதன்மை வங்கி)",
    branch: "Tiruchirappalli Main Commercial Branch",
    ifsc: "SBIN0001234",
    lead_officer: "M. Saravanan (Chief Nodal Manager)",
    npa_status: "Active (2.1% Low NPA)",
    interest_concession: "0.25% Extra Subvention"
  },
  {
    id: "INDIAN_OVERSEAS_BANK",
    name: "Indian Overseas Bank (SCA Nodal Partner)",
    name_ta: "இந்தியன் ஓவர்சீஸ் வங்கி",
    branch: "Cantonment SME Branch, Trichy",
    ifsc: "IOBA0005678",
    lead_officer: "K. Priyadharshini (Senior Credit Officer)",
    npa_status: "Active (2.4% Verified)",
    interest_concession: "Fast-Track 24-Hr Sanction"
  },
  {
    id: "TAMIL_NADU_GRAMA_BANK",
    name: "Tamil Nadu Grama Bank (RRB Financial Partner)",
    name_ta: "தமிழ்நாடு கிராம வங்கி (RRB)",
    branch: "Tiruchirappalli Rural Division",
    ifsc: "TNGB0009101",
    lead_officer: "P. Vigneshwaran (Rural Loan Officer)",
    npa_status: "Active (1.8% Low NPA)",
    interest_concession: "Zero Processing Fee"
  },
  {
    id: "CANARA_BANK",
    name: "Canara Bank (MSME Specialized Branch)",
    name_ta: "கனரா வங்கி (MSME சிறப்பு கிளை)",
    branch: "Thillai Nagar Branch, Trichy",
    ifsc: "CNRB0001122",
    lead_officer: "R. Anbarasan (Credit Lead)",
    npa_status: "Active (2.8% Verified)",
    interest_concession: "100% Digital Fast-Track"
  }
];

export const INITIAL_APPLICATIONS = [
  {
    application_id: "APP-SC-98214",
    scheme_id: "PM_SVANIDHI",
    scheme_name: "PM SVANidhi Working Capital Loan",
    bank_name: "State Bank of India (Lead Bank)",
    applicant_name: "Rajan S.",
    applicant_age: 39,
    annual_income: 200000,
    sanction_amount: 50000,
    interest_rate: 7.0,
    verification_status: "PRE_VERIFIED",
    ekyc_status: "VERIFIED",
    match_score: 100,
    district: "Tiruchirappalli",
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    application_id: "APP-SC-76431",
    scheme_id: "TAHDCO_TERM",
    scheme_name: "TAHDCO 35% Capital Subsidy Scheme",
    bank_name: "Indian Overseas Bank (SCA Nodal Partner)",
    applicant_name: "Kavitha M.",
    applicant_age: 34,
    annual_income: 180000,
    sanction_amount: 350000,
    interest_rate: 6.5,
    verification_status: "SANCTIONED",
    sanction_letter_id: "SNCT-TAHDCO-2026-883",
    ekyc_status: "VERIFIED",
    match_score: 100,
    district: "Tiruchirappalli",
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Broadcast Channel setup
let broadcastChannel = null;
if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
}

export function getBankApplications() {
  if (typeof window === "undefined") return INITIAL_APPLICATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}

  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_APPLICATIONS));
  return INITIAL_APPLICATIONS;
}

export function saveAndBroadcastBankApps(apps, meta = {}) {
  if (typeof window === "undefined") return;

  const payload = {
    applications: apps,
    meta: {
      ...meta,
      timestamp: new Date().toISOString()
    }
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));

  if (broadcastChannel) {
    broadcastChannel.postMessage(payload);
  }

  window.dispatchEvent(new CustomEvent("beta_bank_live_event", { detail: payload }));
}

/**
 * Creates a new pre-verified bank loan application referred from SchemeConnect
 */
export function createBankApplication(scheme, userProfile, selectedBank) {
  const current = getBankApplications();
  const appId = `APP-SC-${Math.floor(10000 + Math.random() * 90000)}`;

  const newApp = {
    application_id: appId,
    scheme_id: scheme.scheme_id,
    scheme_name: scheme.scheme_name,
    bank_name: selectedBank?.name || "State Bank of India (Lead Bank)",
    applicant_name: userProfile.name || "Rajan S.",
    applicant_age: Number(userProfile.age) || 39,
    annual_income: Number(userProfile.income) || 200000,
    sanction_amount: Number(scheme.sanctioned_amount) || 140000,
    interest_rate: Number(scheme.concessional_interest_rate) || 5.0,
    verification_status: "PRE_VERIFIED",
    ekyc_status: "VERIFIED",
    match_score: scheme.match_percentage || 100,
    district: userProfile.district || "Tiruchirappalli",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const updated = [newApp, ...current];
  saveAndBroadcastBankApps(updated, {
    action: "NEW_APPLICATION_SUBMITTED",
    appId,
    applicant: newApp.applicant_name,
    scheme: newApp.scheme_name
  });

  return newApp;
}

/**
 * Bank Officer updates application status (e.g. Sanction Loan)
 */
export function updateBankAppStatus(appId, newStatus) {
  const current = getBankApplications();
  let sanctionLetterId = null;

  if (newStatus === "SANCTIONED") {
    sanctionLetterId = `SNCT-${Math.floor(100000 + Math.random() * 900000)}`;
  }

  const updated = current.map(app => {
    if (app.application_id === appId) {
      return {
        ...app,
        verification_status: newStatus,
        sanction_letter_id: sanctionLetterId || app.sanction_letter_id,
        updated_at: new Date().toISOString()
      };
    }
    return app;
  });

  saveAndBroadcastBankApps(updated, {
    action: "APPLICATION_STATUS_UPDATED",
    appId,
    newStatus,
    sanctionLetterId
  });

  return updated;
}

export function subscribeToBankApplications(callback) {
  if (typeof window === "undefined") return () => {};

  const handleCustomEvent = (e) => {
    if (e.detail?.applications) {
      callback(e.detail.applications, e.detail.meta);
    }
  };

  const handleBroadcast = (e) => {
    if (e.data?.applications) {
      callback(e.data.applications, e.data.meta);
    }
  };

  const handleStorage = (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        callback(parsed, { action: "STORAGE_SYNC" });
      } catch (err) {}
    }
  };

  window.addEventListener("beta_bank_live_event", handleCustomEvent);
  window.addEventListener("storage", handleStorage);
  if (broadcastChannel) {
    broadcastChannel.addEventListener("message", handleBroadcast);
  }

  return () => {
    window.removeEventListener("beta_bank_live_event", handleCustomEvent);
    window.removeEventListener("storage", handleStorage);
    if (broadcastChannel) {
      broadcastChannel.removeEventListener("message", handleBroadcast);
    }
  };
}
