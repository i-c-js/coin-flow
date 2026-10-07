"use client";

import { useEffect, useState } from "react";
import { ArrowLeftRight, TriangleAlert } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { foreignToMdl, mdlToForeign } from "@/lib/calculations";
import { CURRENCIES, SAMPLE_RATES, type Currency, type RatesResponse } from "@/lib/rates";
import Loading from "@/components/Loading";

export default function ConverterPage() {
  const { t } = useLanguage();
  const [data, setData] = useState<RatesResponse | null>(null);
  const [amount, setAmount] = useState("100");
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [fromMdl, setFromMdl] = useState(true); // true: MDL -> currency, false: currency -> MDL

  useEffect(() => {
    fetch("/api/rates")
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData({ rates: SAMPLE_RATES, date: "", sample: true }));
  }, []);

  if (!data) return <Loading />;

  const rate = data.rates[currency];
  const value = Number(amount.replace(",", ".")) || 0;
  const result = fromMdl ? mdlToForeign(value, rate) : foreignToMdl(value, rate);
  const fromCode = fromMdl ? "MDL" : currency;
  const toCode = fromMdl ? currency : "MDL";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="h1">{t("converter.title")}</h1>
        <p className="mt-1 text-ink-soft">{t("converter.intro")}</p>
      </div>

      {data.sample ? (
        <p className="flex items-start gap-2 rounded-2xl bg-sun/30 px-4 py-3 font-semibold">
          <TriangleAlert size={20} className="mt-0.5 shrink-0" />
          <span>
            {t("converter.sample")}. <span className="font-normal">{t("converter.sampleNote")}</span>
          </span>
        </p>
      ) : (
        <p className="text-sm font-semibold text-flow">{t("converter.official", { date: data.date })}</p>
      )}

      <div className="flex flex-wrap gap-2">
        {CURRENCIES.map((code) => (
          <button
            key={code}
            onClick={() => setCurrency(code)}
            className={`rounded-pill px-5 py-2 font-display font-bold ${currency === code ? "bg-flow text-white" : "bg-surface text-ink-soft border border-line"}`}
          >
            {code}
          </button>
        ))}
      </div>

      <div className="card space-y-4">
        <div>
          <label className="label" htmlFor="amount">{t("converter.amount")} ({fromCode})</label>
          <input
            id="amount"
            className="input big-number text-3xl"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.,]/g, ""))}
          />
        </div>

        <button className="btn-ghost w-full" onClick={() => setFromMdl(!fromMdl)}>
          <ArrowLeftRight size={18} /> {fromCode} → {toCode} · {t("converter.swap")}
        </button>

        <div className="rounded-2xl bg-flow p-5 text-white">
          <p className="text-foam">{toCode}</p>
          <p className="big-number text-4xl">
            {result.toLocaleString("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <p className="text-center text-sm text-ink-soft">
          {t("converter.rateLine", { code: currency, rate: rate.toFixed(4) })}
        </p>
      </div>
    </div>
  );
}
