// Statistics used to decide if one method is REALLY better than another, not just by luck.

export function mean(values: number[]): number {
  return values.reduce((sum, x) => sum + x, 0) / values.length;
}

export function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

// Standard normal cumulative distribution Φ(z), using the Abramowitz & Stegun 7.1.26 approximation of erf.
export function normalCdf(z: number): number {
  const x = Math.abs(z) / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * x);
  const erf = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return z >= 0 ? (1 + erf) / 2 : (1 - erf) / 2;
}

// Wilcoxon signed-rank test for paired samples (same ledgers, two methods).
// H0: the median difference between a and b is 0. Uses the normal approximation (fine for n > 20).
// Returns z, the two-sided p-value and the effect size r = |z| / √n.
export function wilcoxonSignedRank(a: number[], b: number[]) {
  const differences = a.map((x, i) => x - b[i]).filter((d) => d !== 0);
  const n = differences.length;
  if (n === 0) return { n, wPlus: 0, z: 0, p: 1, r: 0 };

  // Rank the absolute differences (ties get the average rank).
  const sorted = differences.map((d) => ({ d, abs: Math.abs(d) })).sort((x, y) => x.abs - y.abs);
  const ranks = new Array<number>(n);
  for (let i = 0; i < n; ) {
    let j = i;
    while (j + 1 < n && sorted[j + 1].abs === sorted[i].abs) j++;
    const averageRank = (i + j + 2) / 2;
    for (let k = i; k <= j; k++) ranks[k] = averageRank;
    i = j + 1;
  }

  const wPlus = sorted.reduce((sum, item, i) => sum + (item.d > 0 ? ranks[i] : 0), 0);
  const expected = (n * (n + 1)) / 4;
  const sd = Math.sqrt((n * (n + 1) * (2 * n + 1)) / 24);
  const z = (wPlus - expected) / sd;
  const p = 2 * (1 - normalCdf(Math.abs(z)));
  return { n, wPlus, z, p, r: Math.abs(z) / Math.sqrt(n) };
}
