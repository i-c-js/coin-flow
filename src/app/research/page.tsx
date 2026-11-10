"use client";

import { FlaskConical, CircleCheck, CircleX, ExternalLink } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { ErrorByMethodChart, SensitivityChart } from "@/components/ResearchCharts";
import results from "../../../research/results.json";

const METHODS = ["NAIVE", "SMA", "SES", "HOLT", "DAMPED"] as const;
const PROFILES = ["stable", "rising", "falling", "allowance", "shocks"] as const;

export default function ResearchPage() {
  const { t } = useLanguage();
  const overall = results.overall as Record<string, { mae: number; rmse: number; smape: number; msPerForecast: number }>;
  const byProfile = results.byProfile as Record<string, Record<string, { mae: number }>>;
  const best = results.hypotheses.bestMethod;
  const chartData = METHODS.map((method) => ({ method, mae: overall[method].mae }));

  const verdicts = [
    { key: "h1", supported: results.hypotheses.h1Supported },
    { key: "h2", supported: results.hypotheses.h2Supported },
  ];

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="flex items-center gap-2 font-semibold text-flow"><FlaskConical size={18} /> {t("research.kicker")}</p>
        <h1 className="h1 mt-1">{t("research.title")}</h1>
        <p className="mt-2 text-ink-soft">{t("research.intro")}</p>
      </div>

      <section className="card space-y-2">
        <h2 className="h2">{t("research.questionTitle")}</h2>
        <p>{t("research.question")}</p>
        <p className="text-sm text-ink-soft">{t("research.design", { ledgers: results.config.ledgers, forecasts: results.config.forecastsPerMethod })}</p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        {verdicts.map(({ key, supported }) => (
          <div key={key} className={`card border-2 ${supported ? "border-leaf/40" : "border-coral/40"}`}>
            <p className={`flex items-center gap-2 font-bold ${supported ? "text-leaf" : "text-coral"}`}>
              {supported ? <CircleCheck size={18} /> : <CircleX size={18} />}
              {key.toUpperCase()}: {supported ? t("research.supported") : t("research.notSupported")}
            </p>
            <p className="mt-1 text-sm">{t(`research.${key}`)}</p>
          </div>
        ))}
      </section>

      <section className="card">
        <h2 className="h2">{t("research.chartTitle")}</h2>
        <p className="mb-3 text-sm text-ink-soft">{t("research.chartSubtitle")}</p>
        <ErrorByMethodChart data={chartData} best={best} />
      </section>

      <section className="card overflow-x-auto">
        <h2 className="h2 mb-3">{t("research.profileTitle")}</h2>
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="text-left text-ink-soft">
              <th className="py-2 font-semibold">{t("research.profile")}</th>
              {METHODS.map((m) => <th key={m} className="py-2 text-right font-semibold">{m}</th>)}
            </tr>
          </thead>
          <tbody>
            {PROFILES.map((profile) => {
              const bestHere = METHODS.reduce((x, y) => (byProfile[profile][x].mae <= byProfile[profile][y].mae ? x : y));
              return (
                <tr key={profile} className="border-t border-line">
                  <td className="py-2 font-semibold">{t(`research.profiles.${profile}`)}</td>
                  {METHODS.map((m) => (
                    <td key={m} className={`py-2 text-right tabular-nums ${m === bestHere ? "font-bold text-flow" : ""}`}>
                      {byProfile[profile][m].mae.toFixed(0)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-ink-soft">{t("research.tableNote")}</p>
      </section>

      <section className="card">
        <h2 className="h2">{t("research.sensitivityTitle")}</h2>
        <p className="mb-3 text-sm text-ink-soft">{t("research.sensitivitySubtitle")}</p>
        <SensitivityChart data={results.sensitivity} />
      </section>

      <section className="card space-y-2 bg-foam">
        <h2 className="h2">{t("research.conclusionTitle")}</h2>
        <p>{t("research.conclusion")}</p>
        <p className="text-sm">{t("research.inApp")}</p>
      </section>

      <a href="https://github.com/i-c-js/coin-flow/tree/main/research" className="btn-ghost" target="_blank" rel="noreferrer">
        <ExternalLink size={18} /> {t("research.reproduce")}
      </a>
    </article>
  );
}
