import type { Transaction } from "../types";
import { addDays, toDateString } from "../money";
import { sma } from "./methods";

// Spending per week for the `count` full weeks before `monday` (oldest first), in bani.
export function weeklyExpenseTotals(transactions: Transaction[], monday: Date, count: number): number[] {
  return Array.from({ length: count }, (_, i) => {
    const from = toDateString(addDays(monday, -7 * (count - i)));
    const to = toDateString(addDays(monday, -7 * (count - i - 1)));
    return transactions
      .filter((tx) => tx.type === "expense" && tx.date >= from && tx.date < to)
      .reduce((sum, tx) => sum + tx.amount_bani, 0);
  });
}

// CoinFlow's in-app forecast. Our benchmark (research/RESULTS.md) found the 4-week moving average
// to be the most accurate method on teen spending, so that is what the app uses.
// Returns null when there isn't enough history (fewer than 2 weeks with any spending).
export function forecastNextWeekBani(weeks: number[]): number | null {
  const weeksWithData = weeks.filter((w) => w > 0).length;
  if (weeksWithData < 2) return null;
  return Math.round(sma(weeks, 4));
}
