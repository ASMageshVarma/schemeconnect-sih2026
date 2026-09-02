/**
 * Deterministic Weighted Recommender Engine for SchemeConnect & Alpha Portal
 * Evaluates citizen profile parameters against alpha_schemes rules.
 * Computes:
 * - Match Percentage = (Passed Criteria / Total Criteria) * 100
 * - is_eligible (boolean: true only if Match == 100%)
 * - passed_criteria (Array of passed audit points)
 * - failed_criteria (Array of precise failed rule explanations)
 */

export function evaluateSchemeEligibility(scheme, user) {
  const audits = [];

  // 1. Age Rule
  const userAge = Number(user.age) || 18;
  const isAgeValid = userAge >= scheme.age_min && userAge <= scheme.age_max;
  audits.push({
    criterion: "Age Eligibility",
    passed: isAgeValid,
    reason: isAgeValid
      ? `Age ${userAge} falls within allowed bracket (${scheme.age_min}–${scheme.age_max} yrs)`
      : `Failed: Maximum eligible age is ${scheme.age_max} years (Your age is ${userAge})`
  });

  // 2. Area / Geography Rule
  const userArea = user.area || "Urban";
  const isAreaValid = scheme.area === "Both" || scheme.area === "All" || scheme.area.toLowerCase() === userArea.toLowerCase();
  audits.push({
    criterion: "Geographic Area",
    passed: isAreaValid,
    reason: isAreaValid
      ? `Area '${userArea}' is eligible under ${scheme.area} guideline`
      : `Failed: Scheme restricted to ${scheme.area} areas (Your area is ${userArea})`
  });

  // 3. Sector / Trade Rule
  const userSector = user.sector || "Street Vendor";
  const isSectorValid = scheme.sector === "All" || scheme.sector.toLowerCase() === userSector.toLowerCase();
  audits.push({
    criterion: "Trade / Sector",
    passed: isSectorValid,
    reason: isSectorValid
      ? `Trade '${userSector}' is explicitly recognized`
      : `Failed: Target sector is '${scheme.sector}' (Your sector is '${userSector}')`
  });

  // 4. Gender Rule
  const userGender = user.gender || "Male";
  const isGenderValid = scheme.gender === "All" || scheme.gender.toLowerCase() === userGender.toLowerCase();
  audits.push({
    criterion: "Gender Specification",
    passed: isGenderValid,
    reason: isGenderValid
      ? `Gender '${userGender}' is permitted`
      : `Failed: Scheme is reserved for ${scheme.gender} applicants only`
  });

  // 5. Social Category / Caste Rule
  const userCaste = user.caste || user.social_category || "SC/ST";
  const isCasteValid = scheme.social_category === "All" || 
    (scheme.social_category === "SC/ST" && (userCaste === "SC" || userCaste === "ST" || userCaste === "SC/ST")) ||
    (scheme.social_category === userCaste);
  audits.push({
    criterion: "Social Category",
    passed: isCasteValid,
    reason: isCasteValid
      ? `Category '${userCaste}' qualifies for target benefit`
      : `Failed: Scheme requires ${scheme.social_category} category (Your category is ${userCaste})`
  });

  // 6. Household Income Cap Rule
  const userIncome = Number(user.income || user.annual_income || 0);
  const isIncomeValid = userIncome <= Number(scheme.income_cap);
  audits.push({
    criterion: "Household Income Cap",
    passed: isIncomeValid,
    reason: isIncomeValid
      ? `Annual income ₹${userIncome.toLocaleString('en-IN')} is within ceiling of ₹${Number(scheme.income_cap).toLocaleString('en-IN')}`
      : `Failed: Annual income ₹${userIncome.toLocaleString('en-IN')} exceeds ceiling of ₹${Number(scheme.income_cap).toLocaleString('en-IN')}`
  });

  // 7. SHG Membership Rule
  const isShgMember = user.shg_membership === "Yes" || user.is_shg_member === true || user.shg_member === true;
  const isShgValid = scheme.shg_membership === "Not Required" || 
    scheme.shg_membership === "Preferred" || 
    (scheme.shg_membership === "Mandatory" && isShgMember);
  audits.push({
    criterion: "SHG Membership",
    passed: isShgValid,
    reason: isShgValid
      ? (scheme.shg_membership === "Mandatory" ? "Verified active Self-Help Group (SHG) membership" : "SHG membership not mandatory")
      : "Failed: Requires active Self-Help Group (SHG) membership"
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
export function rankAlphaSchemes(schemesList, userProfile) {
  const evaluated = schemesList.map(scheme => evaluateSchemeEligibility(scheme, userProfile));

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
