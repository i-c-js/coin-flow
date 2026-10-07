"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, PiggyBank } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import EmptyState from "@/components/EmptyState";
import CategoryChart from "@/components/CategoryChart";
import { useLanguage } from "@/i18n/LanguageProvider";
import { supabase } from "@/lib/supabase";
import { addDays, formatBani, startOfWeek, toDateString } from "@/lib/money";
import { spendingByCategory, sumByType } from "@/lib/summary";
import type { Transaction } from "@/lib/types";

export default function SummaryPage() {
  return <AuthGuard>{() => <Summary />}</AuthGuard>;
}

function Summary() {
  const { t, lang } = useLanguage();
  const [weekOffset, setWeekOffset] = useState(0); // 0 = this week, -1 = last week...
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const monday = addDays(startOfWeek(new Date()), weekOffset * 7);
  const sunday = addDays(monday, 6);
  const from = toDateString(monday);
  const to = toDateString(addDays(monday, 7));

  useEffect(() => {
    supabase
      .from("transactions")
      .select("*")
      .eq("type", "expense")
      .gte("date", from)
      .lt("date", to)
      .then(({ data }) => setTransactions(data ?? []));
  }, [from, to]);

  const total = sumByType(transactions, "expense");
  const byCategory = spendingByCategory(transactions);
  const range = `${monday.toLocaleDateString(lang, { day: "numeric", month: "short" })} – ${sunday.toLocaleDateString(lang, { day: "numeric", month: "short" })}`;

  return (
    <div className="space-y-6">
      <h1 className="h1">{t("summary.title")}</h1>

      <div className="flex items-center justify-between">
        <button className="btn-ghost px-3 py-2" onClick={() => setWeekOffset(weekOffset - 1)} aria-label={t("summary.prev")}>
          <ChevronLeft />
        </button>
        <p className="font-display font-bold">{range}</p>
        <button className="btn-ghost px-3 py-2" onClick={() => setWeekOffset(weekOffset + 1)} disabled={weekOffset >= 0} aria-label={t("summary.next")}>
          <ChevronRight />
        </button>
      </div>

      {byCategory.length === 0 ? (
        <EmptyState icon={PiggyBank} title={t("summary.emptyTitle")} text={t("summary.emptyText")} />
      ) : (
        <>
          <div className="card">
            <p className="text-ink-soft">{t("summary.total")}</p>
            <p className="big-number text-5xl text-flow">
              {formatBani(total)} <span className="text-xl">{t("common.lei")}</span>
            </p>
            <p className="mt-2 font-semibold">{t("summary.biggest", { category: t(`categories.${byCategory[0].id}`) })}</p>
          </div>
          <div className="card">
            <CategoryChart data={byCategory} />
          </div>
        </>
      )}
    </div>
  );
}
