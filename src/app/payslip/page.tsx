"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { calculatePayslip } from "@/lib/payslip";
import { MOLDOVA_TAX } from "@/config/moldova-tax";
import { formatBani, leiToBani } from "@/lib/money";
import Wave from "@/components/Wave";

export default function PayslipPage() {
  const { t } = useLanguage();
  const [gross, setGross] = useState("10000");
  const slip = calculatePayslip(leiToBani(Number(gross.replace(",", ".")) || 0));
  const percent = (rate: number) => `${Math.round(rate * 100)}%`;

  const deductions = [
    { label: t("payslip.social"), rate: percent(MOLDOVA_TAX.socialRateEmployee), bani: slip.socialBani, text: t("payslip.socialText") },
    { label: t("payslip.medical"), rate: percent(MOLDOVA_TAX.medicalRateEmployee), bani: slip.medicalBani, text: t("payslip.medicalText") },
    { label: t("payslip.incomeTax"), rate: percent(MOLDOVA_TAX.incomeTaxRate), bani: slip.incomeTaxBani, text: t("payslip.incomeTaxText") },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="h1">{t("payslip.title")}</h1>
        <p className="mt-1 text-ink-soft">{t("payslip.intro")}</p>
      </div>

      <div className="card">
        <label className="label" htmlFor="gross">{t("payslip.gross")}</label>
        <input
          id="gross"
          className="input big-number text-3xl"
          inputMode="decimal"
          value={gross}
          onChange={(e) => setGross(e.target.value.replace(/[^0-9.,]/g, ""))}
        />
      </div>

      <div className="relative overflow-hidden rounded-card bg-flow p-6 pb-14 text-white">
        <p className="text-foam">{t("payslip.net")}</p>
        <p className="big-number text-5xl">
          {formatBani(slip.netBani)} <span className="text-xl text-wave">{t("common.lei")}</span>
        </p>
        <Wave className="absolute inset-x-0 bottom-0 h-10 w-full" />
      </div>

      <section className="space-y-3">
        <h2 className="h2">{t("payslip.deductions")}</h2>
        {deductions.map((row) => (
          <div key={row.label} className="card flex items-start justify-between gap-4">
            <div>
              <p className="font-bold">
                {row.label} <span className="rounded-pill bg-foam px-2 py-0.5 text-sm text-flow">{row.rate}</span>
              </p>
              <p className="mt-1 text-sm text-ink-soft">{row.text}</p>
            </div>
            <p className="big-number shrink-0 text-xl text-coral">−{formatBani(row.bani)}</p>
          </div>
        ))}

        <div className="card text-sm">
          <p className="font-bold">{t("payslip.exemption")}: {formatBani(slip.exemptionBani)} {t("common.lei")}</p>
          <p className="text-ink-soft">{t("payslip.exemptionText")}</p>
          <p className="mt-2 font-bold">{t("payslip.taxable")}: {formatBani(slip.taxableBani)} {t("common.lei")}</p>
        </div>

        <div className="card border-dashed text-sm">
          <p className="font-bold">
            {t("payslip.employer")} ({percent(MOLDOVA_TAX.socialRateEmployer)}): {formatBani(slip.employerSocialBani)} {t("common.lei")}
          </p>
          <p className="text-ink-soft">{t("payslip.employerText")}</p>
        </div>
      </section>

      <p className="flex items-start gap-2 text-sm text-ink-soft">
        <Info size={16} className="mt-0.5 shrink-0" /> {t("payslip.disclaimer")}
      </p>
    </div>
  );
}
