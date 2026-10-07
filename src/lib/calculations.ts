// Pure money calculations. They are covered by unit tests in calculations.test.ts.

// ---------- Savings goal estimate ----------

export type GoalEstimate = {
  remainingBani: number;
  done: boolean;
  months: number | null; // null = cannot estimate (nothing saved per month)
  reachDate: Date | null;
};

// How long until a goal is reached if you save `monthlyBani` every month?
export function estimateGoal(targetBani: number, savedBani: number, monthlyBani: number, today = new Date()): GoalEstimate {
  const remainingBani = Math.max(0, targetBani - savedBani);
  if (remainingBani === 0) {
    return { remainingBani, done: true, months: 0, reachDate: today };
  }
  if (monthlyBani <= 0) {
    return { remainingBani, done: false, months: null, reachDate: null };
  }
  const months = Math.ceil(remainingBani / monthlyBani);
  const reachDate = new Date(today.getFullYear(), today.getMonth() + months, today.getDate());
  return { remainingBani, done: false, months, reachDate };
}

// How much you must save each month to reach the goal by the deadline.
export function monthlyNeededForDeadline(remainingBani: number, deadline: Date, today = new Date()): number {
  const monthsLeft =
    (deadline.getFullYear() - today.getFullYear()) * 12 + (deadline.getMonth() - today.getMonth());
  return Math.ceil(remainingBani / Math.max(1, monthsLeft));
}

// Fill level of a goal, from 0 to 100.
export function goalPercent(targetBani: number, savedBani: number): number {
  if (targetBani <= 0) return 0;
  return Math.min(100, Math.round((savedBani / targetBani) * 100));
}

// ---------- What-if simulator ----------

export const DAYS_IN_MONTH = 30;
export const DAYS_IN_YEAR = 365;

export function whatIfTotals(dailyBani: number) {
  return {
    month: dailyBani * DAYS_IN_MONTH,
    year: dailyBani * DAYS_IN_YEAR,
    fiveYears: dailyBani * DAYS_IN_YEAR * 5,
  };
}

// ---------- Currency conversion ----------
// `rate` = how many lei one unit of the foreign currency costs (e.g. 1 EUR = 19.5 MDL).

export function mdlToForeign(amountMdl: number, rate: number): number {
  return Math.round((amountMdl / rate) * 100) / 100;
}

export function foreignToMdl(amountForeign: number, rate: number): number {
  return Math.round(amountForeign * rate * 100) / 100;
}
