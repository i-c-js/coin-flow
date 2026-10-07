"use client";

import { useLanguage } from "@/i18n/LanguageProvider";
import { estimateGoal, goalPercent, monthlyNeededForDeadline } from "@/lib/calculations";
import { formatBani } from "@/lib/money";
import type { SavingsGoal } from "@/lib/types";
import GoalJar from "./GoalJar";

// Shows one goal: the filling container, the amounts and the time estimate.
export default function GoalCard({ goal, children }: { goal: SavingsGoal; children?: React.ReactNode }) {
  const { t, lang } = useLanguage();
  const percent = goalPercent(goal.target_bani, goal.saved_bani);
  const estimate = estimateGoal(goal.target_bani, goal.saved_bani, goal.monthly_bani);
  const formatDate = (date: Date) => date.toLocaleDateString(lang, { month: "long", year: "numeric" });

  let deadlineText = "";
  if (goal.deadline && !estimate.done) {
    const needed = monthlyNeededForDeadline(estimate.remainingBani, new Date(goal.deadline));
    deadlineText = goal.monthly_bani >= needed ? t("goals.onTrack") : t("goals.needPerMonth", { amount: formatBani(needed) });
  }

  return (
    <div className="card flex gap-4">
      <GoalJar percent={percent} />
      <div className="min-w-0 flex-1">
        <p className="h2 truncate">{goal.name}</p>
        <p className="mt-1">
          <span className="big-number text-2xl text-flow">{formatBani(goal.saved_bani)}</span>
          <span className="text-ink-soft"> {t("goals.of")} {formatBani(goal.target_bani)} {t("common.lei")}</span>
        </p>
        <p className="mt-2 text-sm text-ink-soft">
          {estimate.done
            ? t("goals.done")
            : estimate.months !== null && estimate.reachDate
              ? `${t("goals.reachIn", { months: estimate.months })}, ${t("goals.reachBy", { date: formatDate(estimate.reachDate) })}`
              : t("goals.noEstimate")}
        </p>
        {goal.deadline && (
          <p className="mt-1 text-sm text-ink-soft">
            {t("goals.deadlineLabel", { date: goal.deadline })}
            {deadlineText && <span className="block font-semibold text-ink">{deadlineText}</span>}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
