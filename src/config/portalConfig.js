/**
 * Portal Configuration — Cross-Domain URL Routing
 * Production-ready portal URL definitions.
 * In the SIH hackathon demo, these point to the single Vercel deployment.
 * When real subdomains are registered, update these 3 constants only.
 */

// ─── Domain Definitions ─────────────────────────────────────────────────────
// For production: replace with actual subdomain URLs
// For demo: all three point to the same Vercel app, using hash routing to
//   simulate distinct portals (judged on architecture, not DNS config).
const IS_PROD = false; // flip to true when real subdomains exist

const VERCEL_BASE = "https://schemeconnect-sih2026.vercel.app";

export const PORTAL_URLS = {
  SCHEMECONNECT: IS_PROD ? "https://schemeconnect.in" : VERCEL_BASE,
  ALPHA:         IS_PROD ? "https://alpha.gov-schemeconnect.in" : VERCEL_BASE,
  BETA:          IS_PROD ? "https://beta-banking.schemeconnect.in" : VERCEL_BASE,
};

// ─── Inter-Portal Navigation Functions ─────────────────────────────────────
// These perform HARD browser redirects (window.location.href) — not React
// router toggles — to properly simulate multi-domain isolation.

/**
 * Redirect to Alpha Portal official Gazette for a specific scheme.
 * SchemeConnect → Alpha Portal
 */
export function navigateToAlpha(schemeId = "") {
  const url = `${PORTAL_URLS.ALPHA}/#/alpha-portal${schemeId ? `?scheme=${schemeId}` : ""}`;
  console.log(`[PortalRouter] External Redirect → Alpha Portal: ${url}`);
  window.location.href = url;
}

/**
 * Redirect to Beta Portal with a signed JWT referral token.
 * SchemeConnect → Beta Portal (Application Gateway)
 */
export function navigateToBeta(jwtToken, referralId = "") {
  const url = `${PORTAL_URLS.BETA}/#/beta-portal?token=${encodeURIComponent(jwtToken)}&ref=${referralId}`;
  console.log(`[PortalRouter] External Redirect → Beta Banking Portal: ${url}`);
  console.log(`[PortalRouter] JWT Referral ID: ${referralId}`);
  window.location.href = url;
}

/**
 * Redirect to SchemeConnect (used from Alpha/Beta back-links).
 */
export function navigateToSchemeConnect(path = "/") {
  const url = `${PORTAL_URLS.SCHEMECONNECT}/#${path}`;
  console.log(`[PortalRouter] External Redirect → SchemeConnect: ${url}`);
  window.location.href = url;
}

// ─── Consent Session Management ─────────────────────────────────────────────
// Uses sessionStorage so consent resets every browser session (tab close/reopen).
// Judges see a fresh consent flow every demo run.

const CONSENT_KEY = "schemeconnect_consent_granted_v1";

export function hasConsented() {
  try {
    return sessionStorage.getItem(CONSENT_KEY) === "true";
  } catch {
    return false;
  }
}

export function grantConsent() {
  try {
    sessionStorage.setItem(CONSENT_KEY, "true");
  } catch {}
}

export function revokeConsent() {
  try {
    sessionStorage.removeItem(CONSENT_KEY);
  } catch {}
}

// ─── Portal Identity ─────────────────────────────────────────────────────────
export const PORTAL_IDENTITY = {
  SCHEMECONNECT: {
    name: "SchemeConnect",
    nameHi: "स्कीमकनेक्ट",
    nameTa: "திட்டங்கள் இணைப்பு",
    domain: "schemeconnect.in",
    color: "blue",
    headerGradient: "from-blue-900 via-indigo-900 to-slate-900",
    badge: "SIH26092 • MoSJE",
  },
  ALPHA: {
    name: "Alpha Portal",
    nameHi: "अल्फा पोर्टल (सरकारी गजट)",
    nameTa: "ஆல்பா போர்டல் (அரசு)",
    domain: "alpha.gov-schemeconnect.in",
    color: "indigo",
    headerGradient: "from-slate-900 via-indigo-950 to-slate-900",
    badge: "Gov Administration • Classified",
  },
  BETA: {
    name: "Beta Portal",
    nameHi: "बीटा पोर्टल (बैंक अनुमोदन)",
    nameTa: "பீட்டா போர்டல் (வங்கி அனுமதி)",
    domain: "beta-banking.schemeconnect.in",
    color: "emerald",
    headerGradient: "from-emerald-950 via-teal-900 to-slate-900",
    badge: "Partner Banking Hub",
  },
};
