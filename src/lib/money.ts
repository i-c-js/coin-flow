// Money is always stored as whole numbers in bani (1 leu = 100 bani).
// This avoids rounding problems like 0.1 + 0.2 = 0.30000000000000004.

export function leiToBani(lei: number): number {
  return Math.round(lei * 100);
}

export function baniToLei(bani: number): number {
  return bani / 100;
}

// 123450 -> "1 234,50"   |   100000 -> "1 000"
export function formatBani(bani: number): string {
  const negative = bani < 0;
  const abs = Math.abs(Math.round(bani));
  const lei = Math.floor(abs / 100);
  const rest = abs % 100;
  const leiText = String(lei).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const text = rest === 0 ? leiText : `${leiText},${String(rest).padStart(2, "0")}`;
  return negative ? `-${text}` : text;
}

// "YYYY-MM-DD" for a date, using the local time zone.
export function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Monday of the week that contains `date`.
export function startOfWeek(date: Date): Date {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = (result.getDay() + 6) % 7; // Monday = 0 ... Sunday = 6
  result.setDate(result.getDate() - day);
  return result;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
