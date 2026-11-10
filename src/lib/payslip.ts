import { MOLDOVA_TAX } from "@/config/moldova-tax";

export type Payslip = {
  grossBani: number;
  socialBani: number;     // employee social contribution (0% in 2026)
  medicalBani: number;    // 9% medical insurance (CNAM)
  exemptionBani: number;  // monthly personal + dependant exemptions
  taxableBani: number;    // income the 12% tax is applied to
  incomeTaxBani: number;  // 12% income tax
  netBani: number;        // what you actually receive
  employerSocialBani: number; // 24% paid extra by the employer (CNAS)
};

// Monthly payslip from a monthly gross salary (all values in bani).
//   taxable = gross − medical premium − exemptions
//   net     = gross − medical premium − income tax
export function calculatePayslip(grossBani: number, dependants = 0, rates = MOLDOVA_TAX): Payslip {
  const gross = Math.max(0, Math.round(grossBani));
  const socialBani = Math.round(gross * rates.socialRateEmployee);
  const medicalBani = Math.round(gross * rates.medicalRateEmployee);

  // Exemptions only apply if the yearly taxable income stays under the limit.
  const yearlyTaxableBeforeExemptions = (gross - socialBani - medicalBani) * 12;
  const exemptionYearBani =
    yearlyTaxableBeforeExemptions < rates.exemptionIncomeLimitYearBani
      ? rates.personalExemptionYearBani + Math.max(0, dependants) * rates.dependantExemptionYearBani
      : 0;
  const exemptionBani = Math.round(exemptionYearBani / 12);

  const taxableBani = Math.max(0, gross - socialBani - medicalBani - exemptionBani);
  const incomeTaxBani = Math.round(taxableBani * rates.incomeTaxRate);
  const netBani = gross - socialBani - medicalBani - incomeTaxBani;
  const employerSocialBani = Math.round(gross * rates.socialRateEmployer);
  return { grossBani: gross, socialBani, medicalBani, exemptionBani, taxableBani, incomeTaxBani, netBani, employerSocialBani };
}
