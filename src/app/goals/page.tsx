"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2, Droplets, Target } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import EmptyState from "@/components/EmptyState";
import GoalCard from "@/components/GoalCard";
import { useLanguage } from "@/i18n/LanguageProvider";
import { supabase } from "@/lib/supabase";
import { leiToBani } from "@/lib/money";
import type { SavingsGoal } from "@/lib/types";

export default function GoalsPage() {
  return <AuthGuard>{() => <Goals />}</AuthGuard>;
}

function Goals() {
  const { t } = useLanguage();
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.from("savings_goals").select("*").order("created_at");
    setGoals(data ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function addMoney(goal: SavingsGoal) {
    const answer = prompt(t("goals.howMuch"));
    const bani = leiToBani(Number((answer ?? "").replace(",", ".")));
    if (!bani || bani <= 0) return;
    await supabase.from("savings_goals").update({ saved_bani: goal.saved_bani + bani }).eq("id", goal.id);
    load();
  }

  async function remove(goal: SavingsGoal) {
    if (!confirm(t("goals.deleteConfirm"))) return;
    await supabase.from("savings_goals").delete().eq("id", goal.id);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="h1">{t("goals.title")}</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={20} /> {t("goals.new")}
        </button>
      </div>

      {showForm && (
        <GoalForm
          onSaved={() => {
            setShowForm(false);
            load();
          }}
        />
      )}

      {goals.length === 0 && !showForm ? (
        <EmptyState icon={Target} title={t("goals.emptyTitle")} text={t("goals.emptyText")}>
          <button className="btn-primary" onClick={() => setShowForm(true)}>{t("goals.new")}</button>
        </EmptyState>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal}>
              <div className="mt-4 flex gap-2">
                <button className="btn-sun px-4 py-2 text-sm" onClick={() => addMoney(goal)}>
                  <Droplets size={16} /> {t("goals.addMoney")}
                </button>
                <button className="btn-ghost px-3 py-2" onClick={() => remove(goal)} aria-label={t("common.delete")}>
                  <Trash2 size={16} />
                </button>
              </div>
            </GoalCard>
          ))}
        </div>
      )}
    </div>
  );
}

function GoalForm({ onSaved }: { onSaved: () => void }) {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [saved, setSaved] = useState("");
  const [monthly, setMonthly] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");

  const toBani = (value: string) => leiToBani(Number(value.replace(",", ".")) || 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (toBani(target) <= 0) return;
    const { error } = await supabase.from("savings_goals").insert({
      name,
      target_bani: toBani(target),
      saved_bani: toBani(saved),
      monthly_bani: toBani(monthly),
      deadline: deadline || null,
    });
    if (error) return setError(t("common.error"));
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit} className="card grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="label" htmlFor="goal-name">{t("goals.name")}</label>
        <input id="goal-name" className="input" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label className="label" htmlFor="goal-target">{t("goals.target")}</label>
        <input id="goal-target" className="input" inputMode="decimal" value={target} onChange={(e) => setTarget(e.target.value)} required />
      </div>
      <div>
        <label className="label" htmlFor="goal-saved">{t("goals.saved")}</label>
        <input id="goal-saved" className="input" inputMode="decimal" value={saved} onChange={(e) => setSaved(e.target.value)} />
      </div>
      <div>
        <label className="label" htmlFor="goal-monthly">{t("goals.monthly")}</label>
        <input id="goal-monthly" className="input" inputMode="decimal" value={monthly} onChange={(e) => setMonthly(e.target.value)} />
      </div>
      <div>
        <label className="label" htmlFor="goal-deadline">{t("goals.deadline")}</label>
        <input id="goal-deadline" type="date" className="input" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
      </div>
      {error && <p className="text-sm font-medium text-coral sm:col-span-2">{error}</p>}
      <button className="btn-primary sm:col-span-2">{t("common.save")}</button>
    </form>
  );
}
