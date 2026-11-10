// Moldovan payroll rules used by the payslip explainer (fiscal year 2026).
//
// IMPORTANT: check these numbers against official Moldovan sources before presenting
// (Serviciul Fiscal de Stat – sfs.md, Codul Fiscal on legis.md, CNAS and CNAM).
// Rates and the personal exemption can change every year.
//
// Verified 10 November 2026 against:
//  - CNAS: the employee's 6% individual social contribution was abolished from January 2021;
//    since then the employer pays the whole social contribution (24% in the private sector).
//  - Codul Fiscal / sfs.md: income tax 12%; personal exemption 29 700 lei/year (2 475 lei/month)
//    for residents with annual taxable income under 360 000 lei; dependant exemption 9 900 lei/year.
//  - The employee's 9% medical insurance premium (CNAM) is deducted before the income tax is calculated.
//  Cross-check: 10 000 lei gross -> 8 305 lei net (matches public 2026 salary calculators).

export const MOLDOVA_TAX = {
  year: 2026,
  // Income tax (impozit pe venit), flat rate on taxable income.
  incomeTaxRate: 0.12,
  // Personal exemption (scutire personală) per YEAR, in bani.
  personalExemptionYearBani: 29_700_00,
  // Exemption for each dependant (scutire pentru persoanele întreținute) per YEAR, in bani.
  dependantExemptionYearBani: 9_900_00,
  // No exemptions if the yearly taxable income is this much or more, in bani.
  exemptionIncomeLimitYearBani: 360_000_00,
  // Employee medical insurance premium (prima de asigurare obligatorie de asistență medicală – CNAM).
  medicalRateEmployee: 0.09,
  // Employee social insurance contribution: 0% since 2021 (kept here so the rule is visible).
  socialRateEmployee: 0,
  // Employer social contribution (CNAS) — paid by the employer ON TOP of the gross salary, not taken from you.
  socialRateEmployer: 0.24,
};
