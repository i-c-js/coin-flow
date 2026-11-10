// Generator of synthetic teen spending ledgers (182 days = 26 weeks each).
// Same seed -> exactly the same data, so anyone can repeat the experiment.

export type Profile = "stable" | "rising" | "falling" | "allowance" | "shocks";
export const PROFILES: Profile[] = ["stable", "rising", "falling", "allowance", "shocks"];
export const DAYS = 182;

// Small, well-known pseudo-random generator (mulberry32). Returns numbers in [0, 1).
export function randomGenerator(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Normal random number (Box–Muller).
function normal(random: () => number): number {
  const u = Math.max(random(), 1e-12);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * random());
}

// How spending changes over time for each profile (multiplier on the usual daily amount).
function profileMultiplier(profile: Profile, day: number, strength: number): number {
  switch (profile) {
    case "stable":
    case "shocks":
      return 1;
    case "rising": // e.g. started a summer job, spends more and more
      return 1 + strength * (day / DAYS);
    case "falling": // e.g. decided to save for a goal
      return 1 - 0.5 * strength * (day / DAYS);
    case "allowance": {
      // Monthly pocket money: spends a lot in the first week of each 4-week month, little in the last.
      const weekOfMonth = Math.floor(day / 7) % 4;
      return [1.7, 1.1, 0.75, 0.45][weekOfMonth];
    }
  }
}

// Returns spending in lei for each day.
//  - usual daily amount: 30–110 lei (chosen per ledger)
//  - ~15% of days with no spending
//  - day-to-day variation: log-normal noise (σ = 0.45 by default; changed only in the sensitivity analysis)
//  - weekends: +30%
//  - "shocks" profile: 4% chance per day of an impulse purchase of 250–1 200 lei
export function generateLedger(profile: Profile, seed: number, noise = 0.45): number[] {
  const random = randomGenerator(seed);
  const usualDaily = 30 + random() * 80;
  const strength = 0.6 + random() * 0.9;

  return Array.from({ length: DAYS }, (_, day) => {
    if (random() < 0.15) return 0;
    const weekend = day % 7 >= 5 ? 1.3 : 1;
    const variation = Math.exp(noise * normal(random) - noise ** 2 / 2); // average 1
    let amount = usualDaily * profileMultiplier(profile, day, strength) * weekend * variation;
    if (profile === "shocks" && random() < 0.04) amount += 250 + random() * 950;
    return Math.round(amount);
  });
}

// Adds the days up into weekly totals.
export function toWeeks(days: number[]): number[] {
  const weeks: number[] = [];
  for (let i = 0; i + 7 <= days.length; i += 7) {
    weeks.push(days.slice(i, i + 7).reduce((sum, x) => sum + x, 0));
  }
  return weeks;
}
