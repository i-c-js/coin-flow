"use client";

import { useState } from "react";
import { Coffee, Cookie, Zap, Ellipsis } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { whatIfTotals } from "@/lib/calculations";
import { formatBani, leiToBani } from "@/lib/money";
import Wave from "@/components/Wave";

// Preset habits with a typical daily price in lei.
const HABITS = [
  { id: "coffee", icon: Coffee, lei: 35 },
  { id: "snack", icon: Cookie, lei: 20 },
  { id: "energy", icon: Zap, lei: 25 },
  { id: "custom", icon: Ellipsis, lei: 50 },
];

export default function WhatIfPage() {
  const { t } = useLanguage();
  const [habit, setHabit] = useState("coffee");
  const [dailyLei, setDailyLei] = useState(35);
  const totals = whatIfTotals(leiToBani(dailyLei));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="h1">{t("whatIf.title")}</h1>
        <p className="mt-1 text-ink-soft">{t("whatIf.intro")}</p>
      </div>

      <div className="card space-y-5">
        <span className="label">{t("whatIf.habit")}</span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {HABITS.map(({ id, icon: Icon, lei }) => (
            <button
              key={id}
              onClick={() => {
                setHabit(id);
                setDailyLei(lei);
              }}
              className={`flex items-center justify-center gap-2 rounded-2xl border-2 p-3 font-semibold ${
                habit === id ? "border-flow bg-foam" : "border-transparent bg-mist text-ink-soft"
              }`}
            >
              <Icon size={20} /> {t(`whatIf.habits.${id}`)}
            </button>
          ))}
        </div>

        <div>
          <p className="big-number text-5xl text-flow">
            {dailyLei} <span className="text-xl text-ink-soft">{t("whatIf.perDay")}</span>
          </p>
          <input
            type="range"
            min={1}
            max={200}
            value={dailyLei}
            onChange={(e) => setDailyLei(Number(e.target.value))}
            className="mt-4 w-full accent-[#0b6e6e]"
            aria-label={t("whatIf.perDay")}
          />
        </div>
      </div>

      {/* The totals grow like rising water */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Total label={t("whatIf.month")} bani={totals.month} lei={t("common.lei")} level={1} />
        <Total label={t("whatIf.year")} bani={totals.year} lei={t("common.lei")} level={2} />
        <Total label={t("whatIf.fiveYears")} bani={totals.fiveYears} lei={t("common.lei")} level={3} />
      </div>

      <p className="card font-semibold">{t("whatIf.hint", { amount: formatBani(totals.fiveYears / 2) })}</p>
    </div>
  );
}

function Total({ label, bani, lei, level }: { label: string; bani: number; lei: string; level: 1 | 2 | 3 }) {
  const styles = { 1: "bg-foam text-ink", 2: "bg-wave text-ink", 3: "bg-flow text-white" };
  return (
    <div className={`relative overflow-hidden rounded-card p-6 pb-12 ${styles[level]}`}>
      <p className="font-semibold opacity-80">{label}</p>
      <p className="big-number mt-1 text-3xl">
        {formatBani(bani)} <span className="text-base">{lei}</span>
      </p>
      <Wave color={level === 3 ? "#3cc3b0" : "#0b6e6e"} className="absolute inset-x-0 bottom-0 h-6 w-full opacity-30" />
    </div>
  );
}
