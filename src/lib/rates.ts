// Currency rates: how many MDL one unit of each currency costs.

export const CURRENCIES = ["EUR", "USD", "RON", "UAH"] as const;
export type Currency = (typeof CURRENCIES)[number];
export type Rates = Record<Currency, number>;

export type RatesResponse = { rates: Rates; date: string; sample: boolean };

// Used when the National Bank of Moldova site can't be reached.
export const SAMPLE_RATES: Rates = { EUR: 20.0, USD: 17.8, RON: 3.75, UAH: 0.43 };

// Reads the BNM XML. Example piece:
// <Valute><CharCode>EUR</CharCode><Nominal>1</Nominal><Value>20.0391</Value></Valute>
export function parseBnmXml(xml: string): Rates | null {
  const rates: Partial<Rates> = {};
  for (const block of xml.split("<Valute").slice(1)) {
    const code = block.match(/<CharCode>(\w+)<\/CharCode>/)?.[1] as Currency | undefined;
    const nominal = Number(block.match(/<Nominal>([\d.]+)<\/Nominal>/)?.[1]);
    const value = Number(block.match(/<Value>([\d.]+)<\/Value>/)?.[1]);
    if (code && CURRENCIES.includes(code) && nominal > 0 && value > 0) {
      rates[code] = value / nominal;
    }
  }
  return CURRENCIES.every((code) => rates[code]) ? (rates as Rates) : null;
}
