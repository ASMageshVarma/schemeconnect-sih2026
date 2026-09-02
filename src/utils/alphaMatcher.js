/**
 * Deterministic Weighted Recommender Engine for SchemeConnect & Alpha Portal
 * Evaluates citizen profile parameters against alpha_schemes rules.
 * Supports dynamic bilingual audit diagnostics (English & Tamil).
 */

export function evaluateSchemeEligibility(scheme, user, lang = "en") {
  const audits = [];
  const isTa = lang === "ta";

  // 1. Age Rule
  const userAge = Number(user.age) || 18;
  const isAgeValid = userAge >= scheme.age_min && userAge <= scheme.age_max;
  audits.push({
    criterion: isTa ? "வயது தகுதி" : "Age Eligibility",
    passed: isAgeValid,
    reason: isAgeValid
      ? (isTa ? `வயது ${userAge} அனுமதிக்கப்பட்ட வரம்பிற்குள் உள்ளது (${scheme.age_min}–${scheme.age_max} ஆண்டுகள்)` : `Age ${userAge} falls within allowed bracket (${scheme.age_min}–${scheme.age_max} yrs)`)
      : (isTa ? `தகுதி தோல்வி: அதிகபட்ச வயது வரம்பு ${scheme.age_max} ஆண்டுகள் (உங்கள் வயது ${userAge})` : `Failed: Maximum eligible age is ${scheme.age_max} years (Your age is ${userAge})`)
  });

  // 2. Area / Geography Rule
  const userArea = user.area || "Urban";
  const isAreaValid = scheme.area === "Both" || scheme.area === "All" || scheme.area.toLowerCase() === userArea.toLowerCase();
  audits.push({
    criterion: isTa ? "இருப்பிட பகுதி" : "Geographic Area",
    passed: isAreaValid,
    reason: isAreaValid
      ? (isTa ? `'${userArea === "Urban" ? "நகர்ப்புறம்" : "கிராமப்புறம்"}' பகுதி அனுமதிக்கப்பட்டுள்ளது` : `Area '${userArea}' is eligible under ${scheme.area} guideline`)
      : (isTa ? `தகுதி தோல்வி: இத்திட்டம் ${scheme.area === "Urban" ? "நகர்ப்புறத்திற்கு" : "கிராமப்புறத்திற்கு"} மட்டுமே பொருந்தும்` : `Failed: Scheme restricted to ${scheme.area} areas (Your area is ${userArea})`)
  });

  // 3. Sector / Trade Rule
  const userSector = user.sector || "Street Vendor";
  const isSectorValid = scheme.sector === "All" || scheme.sector.toLowerCase() === userSector.toLowerCase();
  audits.push({
    criterion: isTa ? "தொழில் பிரிவு" : "Trade / Sector",
    passed: isSectorValid,
    reason: isSectorValid
      ? (isTa ? `'${userSector}' தொழில் இத்திட்டத்தின் கீழ் அங்கீகரிக்கப்பட்டுள்ளது` : `Trade '${userSector}' is explicitly recognized`)
      : (isTa ? `தகுதி தோல்வி: இத்திட்டம் '${scheme.sector}' தொழிலுக்கு மட்டுமே பொருந்தும் (உங்கள் தொழில்: '${userSector}')` : `Failed: Target sector is '${scheme.sector}' (Your sector is '${userSector}')`)
  });

  // 4. Gender Rule
  const userGender = user.gender || "Male";
  const isGenderValid = scheme.gender === "All" || scheme.gender.toLowerCase() === userGender.toLowerCase();
  audits.push({
    criterion: isTa ? "பாலினம்" : "Gender Specification",
    passed: isGenderValid,
    reason: isGenderValid
      ? (isTa ? `பாலினம் '${userGender === "Male" ? "ஆண்" : (userGender === "Female" ? "பெண்" : userGender)}' அனுமதிக்கப்பட்டுள்ளது` : `Gender '${userGender}' is permitted`)
      : (isTa ? `தகுதி தோல்வி: இத்திட்டம் பெண்களுக்கு (Women) மட்டுமே பிரத்யேகமானது` : `Failed: Scheme is reserved for ${scheme.gender} applicants only`)
  });

  // 5. Social Category / Caste Rule
  const userCaste = user.caste || user.social_category || "SC/ST";
  const isCasteValid = scheme.social_category === "All" || 
    (scheme.social_category === "SC/ST" && (userCaste === "SC" || userCaste === "ST" || userCaste === "SC/ST")) ||
    (scheme.social_category === userCaste);
  audits.push({
    criterion: isTa ? "சமூகப் பிரிவு" : "Social Category",
    passed: isCasteValid,
    reason: isCasteValid
      ? (isTa ? `'${userCaste}' பிரிவு இச்சலுகைக்கு தகுதியானது` : `Category '${userCaste}' qualifies for target benefit`)
      : (isTa ? `தகுதி தோல்வி: இத்திட்டம் ${scheme.social_category} பிரிவினருக்கு மட்டுமே பொருந்தும்` : `Failed: Scheme requires ${scheme.social_category} category (Your category is ${userCaste})`)
  });

  // 6. Household Income Cap Rule
  const userIncome = Number(user.income || user.annual_income || 0);
  const isIncomeValid = userIncome <= Number(scheme.income_cap);
  audits.push({
    criterion: isTa ? "வருமான வரம்பு" : "Household Income Cap",
    passed: isIncomeValid,
    reason: isIncomeValid
      ? (isTa ? `வருமானம் ₹${userIncome.toLocaleString('en-IN')} உச்சவரம்பிற்குள் (₹${Number(scheme.income_cap).toLocaleString('en-IN')}) உள்ளது` : `Annual income ₹${userIncome.toLocaleString('en-IN')} is within ceiling of ₹${Number(scheme.income_cap).toLocaleString('en-IN')}`)
      : (isTa ? `தகுதி தோல்வி: ஆண்டு வருமானம் ₹${userIncome.toLocaleString('en-IN')} உச்சவரம்பை (₹${Number(scheme.income_cap).toLocaleString('en-IN')}) விட அதிகம்` : `Failed: Annual income ₹${userIncome.toLocaleString('en-IN')} exceeds ceiling of ₹${Number(scheme.income_cap).toLocaleString('en-IN')}`)
  });

  // 7. SHG Membership Rule
  const isShgMember = user.shg_membership === "Yes" || user.is_shg_member === true || user.shg_member === true;
  const isShgValid = scheme.shg_membership === "Not Required" || 
    scheme.shg_membership === "Preferred" || 
    (scheme.shg_membership === "Mandatory" && isShgMember);
  audits.push({
    criterion: isTa ? "சுயஉதவிக்குழு நிலை" : "SHG Membership",
    passed: isShgValid,
    reason: isShgValid
      ? (isTa ? (scheme.shg_membership === "Mandatory" ? "சுயஉதவிக்குழு உறுப்பினர் தகுதி சரிபார்க்கப்பட்டது" : "சுயஉதவிக்குழு கட்டாயமில்லை") : (scheme.shg_membership === "Mandatory" ? "Verified active Self-Help Group (SHG) membership" : "SHG membership not mandatory"))
      : (isTa ? "தகுதி தோல்வி: மகளிர் சுயஉதவிக்குழு (SHG) உறுப்பினர் சான்று கட்டாயம்" : "Failed: Requires active Self-Help Group (SHG) membership")
  });

  // Score Calculation
  const totalCriteria = audits.length; // 7 criteria
  const passedCount = audits.filter(a => a.passed).length;
  const matchPercentage = Math.round((passedCount / totalCriteria) * 100);
  const isEligible = matchPercentage === 100;

  const passedCriteria = audits.filter(a => a.passed).map(a => a.reason);
  const failedCriteria = audits.filter(a => !a.passed).map(a => a.reason);

  return {
    ...scheme,
    total_criteria: totalCriteria,
    passed_criteria_count: passedCount,
    match_percentage: matchPercentage,
    readiness_score: matchPercentage,
    is_eligible: isEligible,
    passed_criteria: passedCriteria,
    failed_criteria: failedCriteria,
    matched_reasons: passedCriteria,
    unmatched_reasons: failedCriteria,
    audits: audits
  };
}

/**
 * Ranks all schemes for a given user profile
 * Prioritizes 100% eligible schemes first, then by match percentage and sanctioned amount.
 */
export function rankAlphaSchemes(schemesList, userProfile, lang = "en") {
  const evaluated = schemesList.map(scheme => evaluateSchemeEligibility(scheme, userProfile, lang));

  return evaluated.sort((a, b) => {
    // 100% eligible always on top
    if (a.is_eligible && !b.is_eligible) return -1;
    if (!a.is_eligible && b.is_eligible) return 1;
    
    // Higher match percentage
    if (b.match_percentage !== a.match_percentage) {
      return b.match_percentage - a.match_percentage;
    }

    // Higher sanctioned amount
    return Number(b.sanctioned_amount || 0) - Number(a.sanctioned_amount || 0);
  });
}
