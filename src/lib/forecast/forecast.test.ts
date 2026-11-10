import { describe, expect, it } from "vitest";
import { bestHoltParams, bestSesAlpha, dampedHolt, holt, naive, ses, sma } from "./methods";
import { mae, rmse, smape } from "./metrics";
import { normalCdf, wilcoxonSignedRank } from "./stats";
import { generateLedger, toWeeks } from "./synthetic";

describe("forecasting methods on series with a known answer", () => {
  const constant = [200, 200, 200, 200, 200, 200];
  const line = [100, 120, 140, 160, 180, 200]; // +20 lei every week

  it("all methods predict a constant series exactly", () => {
    expect(naive(constant)).toBe(200);
    expect(sma(constant)).toBe(200);
    expect(ses(constant, 0.3)).toBeCloseTo(200);
    expect(holt(constant, 0.3, 0.1)).toBeCloseTo(200);
  });

  it("only Holt continues a perfect straight line", () => {
    expect(holt(line, 0.5, 0.5)).toBeCloseTo(220);
    expect(sma(line)).toBe(170); // average of the last 4 weeks lags behind
    expect(naive(line)).toBe(200);
  });

  it("SES with alpha = 1 equals the last value", () => {
    expect(ses([10, 50, 30], 1)).toBe(30);
  });

  it("the automatic tuning finds sensible parameters", () => {
    expect(bestSesAlpha(constant)).toBeGreaterThan(0);
    const { alpha, beta } = bestHoltParams(line);
    expect(holt(line, alpha, beta)).toBeCloseTo(220, 0);
  });

  it("damped trend continues a line, but less than Holt", () => {
    const damped = dampedHolt(line, 0.5, 0.5, 0.9);
    expect(damped).toBeGreaterThan(200);
    expect(damped).toBeLessThan(holt(line, 0.5, 0.5));
    expect(dampedHolt(line, 0.5, 0.5, 1)).toBeCloseTo(holt(line, 0.5, 0.5)); // phi = 1 is plain Holt
  });

  it("Holt never forecasts negative spending", () => {
    expect(holt([300, 200, 100, 0], 0.9, 0.9)).toBeGreaterThanOrEqual(0);
  });
});

describe("error metrics", () => {
  it("are 0 for a perfect forecast", () => {
    expect(mae([1, 2], [1, 2])).toBe(0);
    expect(rmse([1, 2], [1, 2])).toBe(0);
    expect(smape([0, 2], [0, 2])).toBe(0);
  });
  it("RMSE punishes one big error more than MAE", () => {
    expect(mae([0, 0], [0, 10])).toBe(5);
    expect(rmse([0, 0], [0, 10])).toBeCloseTo(7.07, 2);
  });
});

describe("statistics", () => {
  it("normal CDF matches known values", () => {
    expect(normalCdf(0)).toBeCloseTo(0.5, 6);
    expect(normalCdf(1.96)).toBeCloseTo(0.975, 3);
  });
  it("Wilcoxon finds no difference for identical samples and a clear one for shifted samples", () => {
    const a = Array.from({ length: 30 }, (_, i) => i);
    expect(wilcoxonSignedRank(a, a).p).toBe(1);
    const shifted = wilcoxonSignedRank(a, a.map((x) => x + 5));
    expect(shifted.p).toBeLessThan(0.001);
    expect(shifted.z).toBeLessThan(0); // a is smaller
  });
});

describe("synthetic data", () => {
  it("is reproducible from the seed", () => {
    expect(generateLedger("rising", 42)).toEqual(generateLedger("rising", 42));
    expect(generateLedger("rising", 42)).not.toEqual(generateLedger("rising", 43));
  });
  it("has 26 weeks and no negative days", () => {
    const days = generateLedger("shocks", 7);
    expect(toWeeks(days)).toHaveLength(26);
    expect(days.every((d) => d >= 0)).toBe(true);
  });
  it("rising ledgers really spend more at the end", () => {
    const weeks = toWeeks(generateLedger("rising", 1000));
    const firstMonth = weeks.slice(0, 4).reduce((s, x) => s + x, 0);
    const lastMonth = weeks.slice(-4).reduce((s, x) => s + x, 0);
    expect(lastMonth).toBeGreaterThan(firstMonth);
  });
});
