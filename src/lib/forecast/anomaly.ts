import { mean } from "./stats";

// Is this week's spending unusually high compared with the past weeks?
// Uses the z-score: how many standard deviations this week is above the average.
// z > 2 happens in only about 2–3 % of normal weeks, so it's a good warning level.
export function isUnusualWeek(pastWeeks: number[], thisWeek: number): boolean {
  if (pastWeeks.length < 4) return false; // not enough history to judge

  const average = mean(pastWeeks);
  const variance = pastWeeks.reduce((sum, week) => sum + (week - average) ** 2, 0) / pastWeeks.length;
  const standardDeviation = Math.sqrt(variance);

  // All past weeks were exactly the same: anything above them is unusual.
  if (standardDeviation === 0) return thisWeek > average;

  const z = (thisWeek - average) / standardDeviation;
  return z > 2;
}
