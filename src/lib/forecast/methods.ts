// Four ways to forecast next week's spending from the past weekly totals.
// Every method gets `weeks` = spending per week (oldest first) and returns the forecast for the next week.

// 1. NAIVE (baseline): next week will be the same as last week.
export function naive(weeks: number[]): number {
  return weeks[weeks.length - 1] ?? 0;
}

// 2. SMA — simple moving average of the last `window` weeks.
export function sma(weeks: number[], window = 4): number {
  const recent = weeks.slice(-window);
  return recent.length === 0 ? 0 : recent.reduce((sum, x) => sum + x, 0) / recent.length;
}

// 3. SES — simple exponential smoothing.
// The "level" is a running average where each new week counts with weight alpha (0..1).
// alpha close to 1 = react fast to changes, close to 0 = smooth and stable.
export function ses(weeks: number[], alpha: number): number {
  if (weeks.length === 0) return 0;
  let level = weeks[0];
  for (let t = 1; t < weeks.length; t++) {
    level = alpha * weeks[t] + (1 - alpha) * level;
  }
  return level;
}

// 4. HOLT — double exponential smoothing: a level (like SES) plus a trend (how much spending grows per week).
// beta (0..1) controls how fast the trend adapts.
export function holt(weeks: number[], alpha: number, beta: number): number {
  if (weeks.length === 0) return 0;
  if (weeks.length === 1) return weeks[0];
  let level = weeks[0];
  let trend = weeks[1] - weeks[0];
  for (let t = 1; t < weeks.length; t++) {
    const previousLevel = level;
    level = alpha * weeks[t] + (1 - alpha) * (level + trend);
    trend = beta * (level - previousLevel) + (1 - beta) * trend;
  }
  // Spending can't be negative.
  return Math.max(0, level + trend);
}

// 5. DAMPED — Holt with a damped trend (Gardner & McKenzie, 1985).
// The trend is multiplied by phi (< 1) every step, so the forecast doesn't overshoot when the "trend" is just noise.
// Added after the main experiment, because plain Holt overreacted to noise (exploratory method).
export function dampedHolt(weeks: number[], alpha: number, beta: number, phi: number): number {
  if (weeks.length === 0) return 0;
  if (weeks.length === 1) return weeks[0];
  let level = weeks[0];
  let trend = weeks[1] - weeks[0];
  for (let t = 1; t < weeks.length; t++) {
    const previousLevel = level;
    level = alpha * weeks[t] + (1 - alpha) * (level + phi * trend);
    trend = beta * (level - previousLevel) + (1 - beta) * phi * trend;
  }
  return Math.max(0, level + phi * trend);
}

// ---------- Choosing alpha and beta automatically ----------
// We try every value on a grid and keep the one that would have predicted the PAST best
// (each past week forecast from the weeks before it). Future weeks are never used.

const GRID = Array.from({ length: 19 }, (_, i) => Math.round((0.05 + i * 0.05) * 100) / 100); // 0.05 … 0.95

function pastSquaredError(weeks: number[], forecast: (past: number[]) => number): number {
  let total = 0;
  for (let t = 2; t < weeks.length; t++) {
    const error = weeks[t] - forecast(weeks.slice(0, t));
    total += error * error;
  }
  return total;
}

export function bestSesAlpha(weeks: number[]): number {
  let best = { alpha: 0.3, error: Infinity };
  for (const alpha of GRID) {
    const error = pastSquaredError(weeks, (past) => ses(past, alpha));
    if (error < best.error) best = { alpha, error };
  }
  return best.alpha;
}

export function bestHoltParams(weeks: number[]): { alpha: number; beta: number } {
  let best = { alpha: 0.3, beta: 0.1, error: Infinity };
  for (const alpha of GRID) {
    for (const beta of GRID.filter((b) => b <= 0.5)) {
      const error = pastSquaredError(weeks, (past) => holt(past, alpha, beta));
      if (error < best.error) best = { alpha, beta, error };
    }
  }
  return { alpha: best.alpha, beta: best.beta };
}

const PHI_GRID = [0.8, 0.85, 0.9, 0.95, 0.98];

export function bestDampedParams(weeks: number[]): { alpha: number; beta: number; phi: number } {
  let best = { alpha: 0.3, beta: 0.1, phi: 0.9, error: Infinity };
  for (const phi of PHI_GRID) {
    for (const alpha of GRID) {
      for (const beta of GRID.filter((b) => b <= 0.5)) {
        const error = pastSquaredError(weeks, (past) => dampedHolt(past, alpha, beta, phi));
        if (error < best.error) best = { alpha, beta, phi, error };
      }
    }
  }
  return { alpha: best.alpha, beta: best.beta, phi: best.phi };
}

// ---------- One function per method, ready to use ----------

export type MethodName = "NAIVE" | "SMA" | "SES" | "HOLT" | "DAMPED";
export const METHODS: MethodName[] = ["NAIVE", "SMA", "SES", "HOLT", "DAMPED"];

export function forecastNextWeek(method: MethodName, weeks: number[]): number {
  switch (method) {
    case "NAIVE":
      return naive(weeks);
    case "SMA":
      return sma(weeks);
    case "SES":
      return ses(weeks, bestSesAlpha(weeks));
    case "HOLT": {
      const { alpha, beta } = bestHoltParams(weeks);
      return holt(weeks, alpha, beta);
    }
    case "DAMPED": {
      const { alpha, beta, phi } = bestDampedParams(weeks);
      return dampedHolt(weeks, alpha, beta, phi);
    }
  }
}
