import { connection } from "next/server";
import { parseBnmXml, SAMPLE_RATES, type RatesResponse } from "@/lib/rates";

// GET /api/rates — today's official rates from the National Bank of Moldova (bnm.md).
// If anything goes wrong we answer with sample rates and `sample: true`.
export async function GET() {
  await connection(); // always run at request time, never at build time

  // Today's date in Moldova, as DD.MM.YYYY (the format BNM expects).
  const date = new Date().toLocaleDateString("ro-RO", {
    timeZone: "Europe/Chisinau",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  try {
    const response = await fetch(`https://www.bnm.md/en/official_exchange_rates?get_xml=1&date=${date}`, {
      signal: AbortSignal.timeout(8000),
    });
    const rates = response.ok ? parseBnmXml(await response.text()) : null;
    if (rates) return Response.json({ rates, date, sample: false } satisfies RatesResponse);
  } catch {
    // network error or timeout -> fall through to sample rates
  }

  return Response.json({ rates: SAMPLE_RATES, date, sample: true } satisfies RatesResponse);
}
