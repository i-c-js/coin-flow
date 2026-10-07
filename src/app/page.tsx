"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, ChevronRight, GraduationCap, Target, Receipt } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import Wave from "@/components/Wave";
import EmptyState from "@/components/EmptyState";
import GoalCard from "@/components/GoalCard";
import TransactionForm from "@/components/TransactionForm";
import TransactionRow from "@/components/TransactionRow";
import CategoryChart from "@/components/CategoryChart";
import { useLanguage } from "@/i18n/LanguageProvider";
import { supabase } from "@/lib/supabase";
import { addDays, formatBani, startOfWeek, toDateString } from "@/lib/money";
import { spendingByCategory, sumByType } from "@/lib/summary";
import { LESSONS } from "@/content/lessons";
import type { SavingsGoal, Transaction } from "@/lib/types";

export default function HomePage() {
  return <AuthGuard>{(user) => <Home name={user.user_metadata?.display_name || ""} />}</AuthGuard>;
}

function Home({ name }: { name: string }) {
  const { t } = useLanguage();
  const [weekTx, setWeekTx] = useState<Transaction[]>([]);
  const [recent, setRecent] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [lessonsDone, setLessonsDone] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    const monday = startOfWeek(new Date());
    const [week, latest, goalRows, progress] = await Promise.all([
      supabase.from("transactions").select("*").gte("date", toDateString(monday)).lt("date", toDateString(addDays(monday, 7))),
      supabase.from("transactions").select("*").order("date", { ascending: false }).order("created_at", { ascending: false }).limit(5),
      supabase.from("savings_goals").select("*").order("created_at").limit(3),
      supabase.from("lesson_progress").select("lesson_id"),
    ]);
    setWeekTx(week.data ?? []);
    setRecent(latest.data ?? []);
    setGoals(goalRows.data ?? []);
    setLessonsDone(progress.data?.length ?? 0);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const spent = sumByType(weekTx, "expense");
  const received = sumByType(weekTx, "income");
  const byCategory = spendingByCategory(weekTx);

  return (
    <div className="space-y-8">
      {/* Hero: this week's spending, with the big "add expense" button */}
      <section className="relative overflow-hidden rounded-card bg-flow px-6 pb-16 pt-7 text-white sm:px-8">
        {name && <p className="font-semibold text-foam">{t("home.hello", { name })}</p>}
        <p className="mt-3 text-foam">{t("home.weekSpent")}</p>
        <p className="big-number mt-1 text-5xl sm:text-6xl">
          {formatBani(spent)} <span className="text-2xl text-wave">{t("common.lei")}</span>
        </p>
        <p className="mt-2 text-sm text-foam">
          {t("home.weekIncome")}: <span className="font-bold text-white">+{formatBani(received)} {t("common.lei")}</span>
        </p>
        <button onClick={() => setShowForm(true)} className="btn-sun relative z-10 mt-6 px-6 py-4 text-lg">
          <Plus size={22} strokeWidth={3} />
          {t("home.addExpense")}
        </button>
        <Image
          src="/illustrations/hero-flow.svg"
          alt=""
          width={320}
          height={260}
          priority
          className="absolute bottom-6 right-6 hidden h-52 w-auto sm:block"
        />
        <Wave className="absolute inset-x-0 bottom-0 h-12 w-full" />
      </section>

      {/* Savings goals */}
      <section>
        <SectionTitle title={t("home.yourGoals")} href="/goals" linkText={t("home.seeAll")} />
        {goals.length === 0 ? (
          <EmptyState image="/illustrations/empty-jar.svg" icon={Target} title={t("home.noGoalsTitle")} text={t("home.noGoalsText")}>
            <Link href="/goals" className="btn-primary">{t("home.createGoal")}</Link>
          </EmptyState>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-8 md:grid-cols-2">
        {/* This week by category */}
        <section>
          <SectionTitle title={t("home.weekChart")} href="/summary" linkText={t("home.seeAll")} />
          <div className="card">
            {byCategory.length === 0 ? (
              <p className="py-6 text-center text-ink-soft">{t("summary.emptyText")}</p>
            ) : (
              <CategoryChart data={byCategory} />
            )}
          </div>
        </section>

        {/* Recent transactions */}
        <section>
          <SectionTitle title={t("home.recent")} href="/transactions" linkText={t("home.seeAll")} />
          {recent.length === 0 ? (
            <EmptyState image="/illustrations/calm-water.svg" icon={Receipt} title={t("home.noTxTitle")} text={t("home.noTxText")} />
          ) : (
            <ul className="card divide-y divide-line py-2">
              {recent.map((tx) => (
                <TransactionRow key={tx.id} tx={tx} />
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Lessons teaser */}
      <Link href="/lessons" className="card flex items-center gap-4 hover:border-flow">
        <span className="rounded-2xl bg-sun p-3 text-ink">
          <GraduationCap size={26} />
        </span>
        <div className="flex-1">
          <p className="h2">{t("home.learnTitle")}</p>
          <p className="text-ink-soft">{t("home.learnText", { done: lessonsDone, total: LESSONS.length })}</p>
        </div>
        <ChevronRight className="text-ink-soft" />
      </Link>

      {showForm && <TransactionForm onClose={() => setShowForm(false)} onSaved={load} />}
    </div>
  );
}

function SectionTitle({ title, href, linkText }: { title: string; href: string; linkText: string }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="h2">{title}</h2>
      <Link href={href} className="flex items-center text-sm font-semibold text-flow">
        {linkText} <ChevronRight size={16} />
      </Link>
    </div>
  );
}
