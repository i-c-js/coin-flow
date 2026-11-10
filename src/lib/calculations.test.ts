import { describe, expect, it } from "vitest";
import { estimateGoal, foreignToMdl, goalPercent, mdlToForeign, monthlyNeededForDeadline, whatIfTotals } from "./calculations";
import { calculatePayslip } from "./payslip";
import { formatBani, leiToBani } from "./money";
import { parseBnmXml } from "./rates";

describe("money helpers", () => {
  it("converts lei to bani without rounding errors", () => {
    expect(leiToBani(0.1 + 0.2)).toBe(30);
    expect(leiToBani(35)).toBe(3500);
  });
  it("formats bani nicely", () => {
    expect(formatBani(123450)).toBe("1 234,50");
    expect(formatBani(100000)).toBe("1 000");
  });
});

describe("goal estimate", () => {
  const today = new Date(2026, 0, 15);

  it("counts the months needed", () => {
    // 1 200 lei target, 0 saved, 200 lei per month -> 6 months
    const result = estimateGoal(120000, 0, 20000, today);
    expect(result.months).toBe(6);
    expect(result.reachDate).toEqual(new Date(2026, 6, 15));
  });
  it("rounds up partial months", () => {
    expect(estimateGoal(100000, 10000, 20000, today).months).toBe(5); // 900 / 200 = 4.5 -> 5
  });
  it("is done when saved >= target", () => {
    expect(estimateGoal(50000, 60000, 0, today).done).toBe(true);
  });
  it("cannot estimate without a monthly amount", () => {
    expect(estimateGoal(50000, 0, 0, today).months).toBeNull();
  });
  it("calculates the monthly amount for a deadline", () => {
    expect(monthlyNeededForDeadline(120000, new Date(2026, 4, 1), today)).toBe(30000); // 4 months
  });
  it("caps the fill level at 100%", () => {
    expect(goalPercent(10000, 2500)).toBe(25);
    expect(goalPercent(10000, 50000)).toBe(100);
  });
});

describe("what-if totals", () => {
  it("multiplies a 35 lei daily coffee", () => {
    expect(whatIfTotals(3500)).toEqual({ month: 105000, year: 1277500, fiveYears: 6387500 });
  });
});

describe("payslip (Moldova 2026 rules)", () => {
  it("calculates a 10 000 lei gross salary", () => {
    const slip = calculatePayslip(1000000);
    expect(slip.socialBani).toBe(0); // employee pays no social contribution since 2021
    expect(slip.medicalBani).toBe(90000); // 9%
    expect(slip.exemptionBani).toBe(247500); // 29 700 / 12
    expect(slip.taxableBani).toBe(662500); // 10 000 - 900 - 2 475
    expect(slip.incomeTaxBani).toBe(79500); // 12% of 6 625
    expect(slip.netBani).toBe(830500); // 8 305 lei, same as public 2026 calculators
    expect(slip.employerSocialBani).toBe(240000); // 24% paid on top by the employer
  });
  it("never has negative tax for small salaries", () => {
    const slip = calculatePayslip(200000);
    expect(slip.incomeTaxBani).toBe(0);
    expect(slip.netBani).toBe(200000 - 18000);
  });
  it("adds 825 lei/month exemption for each dependant", () => {
    const slip = calculatePayslip(1000000, 2);
    expect(slip.exemptionBani).toBe(247500 + 2 * 82500);
    expect(slip.incomeTaxBani).toBe(Math.round((1000000 - 90000 - 412500) * 0.12));
  });
  it("gives no exemption when yearly taxable income is 360 000 lei or more", () => {
    const slip = calculatePayslip(4000000); // 40 000 lei/month -> 436 800 lei/year after medical
    expect(slip.exemptionBani).toBe(0);
    expect(slip.netBani).toBe(4000000 - 360000 - 436800);
  });
});

describe("currency conversion", () => {
  it("converts both ways", () => {
    expect(mdlToForeign(200, 20)).toBe(10);
    expect(foreignToMdl(10, 19.5)).toBe(195);
    expect(mdlToForeign(100, 17.8236)).toBe(5.61);
  });
  it("reads the BNM XML", () => {
    const xml = ["EUR:1:20.0391", "USD:1:17.8236", "RON:1:3.7485", "UAH:10:4.3"]
      .map((row) => row.split(":"))
      .map(([code, nominal, value]) => `<Valute><CharCode>${code}</CharCode><Nominal>${nominal}</Nominal><Value>${value}</Value></Valute>`)
      .join("");
    expect(parseBnmXml(xml)).toEqual({ EUR: 20.0391, USD: 17.8236, RON: 3.7485, UAH: 0.43 });
  });
  it("returns null when currencies are missing", () => {
    expect(parseBnmXml("<ValCurs></ValCurs>")).toBeNull();
  });
});
