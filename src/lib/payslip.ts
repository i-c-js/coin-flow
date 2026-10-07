import { MOLDOVA_TAX } from "@/config/moldova-tax";

export type Payslip = {
  grossBani: number;
  socialBani: number;     // 6% social insurance (for your future pension)
  medicalBani: number;    // 9% medical insurance
  exemptionBani: number;  // monthly part of the personal exemption
  taxableBani: number;    // income the 12% tax is applied to
  incomeTaxBani: number;  // 12% income tax
  netBani: number;        // what you actually receive
  employerSocialBani: number; // paid extra by the employer
};

// Monthly payslip from a monthly gross salary (all values in bani).
export function calculatePayslip(grossBani: number, rates = MOLDOVA_TAX): Payslip {
  const gross = Math.max(0, Math.round(grossBani));
  const socialBani = Math.round(gross * rates.socialRateEmployee);
  const medicalBani = Math.round(gross * rates.medicalRateEmployee);
  const exemptionBani = Math.round(rates.personalExemptionYearBani / 12);
  const taxableBani = Math.max(0, gross - socialBani - medicalBani - exemptionBani);
  const incomeTaxBani = Math.round(taxableBani * rates.incomeTaxRate);
  const netBani = gross - socialBani - medicalBani - incomeTaxBani;
  const employerSocialBani = Math.round(gross * rates.socialRateEmployer);
  return { grossBani: gross, socialBani, medicalBani, exemptionBani, taxableBani, incomeTaxBani, netBani, employerSocialBani };
}
