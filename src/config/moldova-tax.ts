// Moldovan payroll tax rates used by the payslip explainer.
//
// IMPORTANT: check these numbers against official Moldovan sources before presenting
// (Serviciul Fiscal de Stat – sfs.md, Codul Fiscal on legis.md, CNAS and CNAM).
// Rates and the personal exemption can change every year.

export const MOLDOVA_TAX = {
  year: 2026,
  // Income tax (impozit pe venit), flat rate on taxable income.
  incomeTaxRate: 0.12,
  // Personal exemption (scutire personală) per YEAR, in bani. Taxable income is reduced by this.
  personalExemptionYearBani: 30_000_00,
  // Employee social insurance contribution (contribuția individuală de asigurări sociale – CNAS).
  socialRateEmployee: 0.06,
  // Employee medical insurance premium (prima de asigurare medicală – CNAM).
  medicalRateEmployee: 0.09,
  // Employer social contribution — paid by the employer on top of the gross salary (not taken from you).
  socialRateEmployer: 0.24,
};
