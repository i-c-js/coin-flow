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

// Reads what the user typed ("12,50" or "12.5") and returns bani, or null if it isn't a positive amount.
export function parseLeiInput(text: string): number | null {
  const lei = Number(text.trim().replace(",", "."));
  if (!Number.isFinite(lei) || lei <= 0 || lei > 10_000_000) return null;
  return leiToBani(lei);
}

// Shows a "YYYY-MM-DD" date the way people read it in the chosen language, e.g. "7 oct. 2026".
export function formatDate(isoDate: string, lang: string): string {
  return parseDate(isoDate).toLocaleDateString(lang, { day: "numeric", month: "short", year: "numeric" });
}

// "YYYY-MM-DD" -> Date at local midnight (new Date("2026-10-07") would use UTC instead).
export function parseDate(isoDate: string): Date {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(y, m - 1, d);
}
