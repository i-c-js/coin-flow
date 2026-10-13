"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2, Droplets, Pencil, Target } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import EmptyState from "@/components/EmptyState";
import GoalCard from "@/components/GoalCard";
import Modal from "@/components/Modal";
import ConfirmDialog from "@/components/ConfirmDialog";
import AmountDialog from "@/components/AmountDialog";
import { useLanguage } from "@/i18n/LanguageProvider";
import { supabase } from "@/lib/supabase";
import { parseLeiInput } from "@/lib/money";
import type { SavingsGoal } from "@/lib/types";

export default function GoalsPage() {
  return <AuthGuard>{() => <Goals />}</AuthGuard>;
}

function Goals() {
  const { t } = useLanguage();
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  // Which pop-up is open (at most one at a time)
  const [formGoal, setFormGoal] = useState<SavingsGoal | "new" | null>(null);
  const [addingTo, setAddingTo] = useState<SavingsGoal | null>(null);
  const [deleting, setDeleting] = useState<SavingsGoal | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase.from("savings_goals").select("*").order("created_at");
    setGoals(data ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function addMoney(goal: SavingsGoal, bani: number) {
    await supabase.from("savings_goals").update({ saved_bani: goal.saved_bani + bani }).eq("id", goal.id);
    load();
  }

  async function remove(goal: SavingsGoal) {
    await supabase.from("savings_goals").delete().eq("id", goal.id);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="h1">{t("goals.title")}</h1>
        <button className="btn-primary" onClick={() => setFormGoal("new")}>
          <Plus size={20} /> {t("goals.new")}
        </button>
      </div>

      {goals.length === 0 ? (
        <EmptyState image="/illustrations/empty-jar.svg" icon={Target} title={t("goals.emptyTitle")} text={t("goals.emptyText")}>
          <button className="btn-primary" onClick={() => setFormGoal("new")}>{t("goals.new")}</button>
        </EmptyState>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal}>
              <div className="mt-4 flex gap-2">
                <button className="btn-sun px-4 py-2 text-sm" onClick={() => setAddingTo(goal)}>
                  <Droplets size={16} /> {t("goals.addMoney")}
                </button>
                <button className="btn-ghost px-3 py-2" onClick={() => setFormGoal(goal)} aria-label={t("common.edit")}>
                  <Pencil size={16} />
                </button>
                <button className="btn-ghost px-3 py-2" onClick={() => setDeleting(goal)} aria-label={t("common.delete")}>
                  <Trash2 size={16} />
                </button>
              </div>
            </GoalCard>
          ))}
        </div>
      )}

      {formGoal && (
        <GoalForm editing={formGoal === "new" ? null : formGoal} onClose={() => setFormGoal(null)} onSaved={load} />
      )}
      {addingTo && (
        <AmountDialog
          title={t("goals.addMoneyTitle", { name: addingTo.name })}
          onSave={(bani) => addMoney(addingTo, bani)}
          onClose={() => setAddingTo(null)}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title={t("goals.deleteConfirm")}
          text={deleting.name}
          confirmLabel={t("common.delete")}
          onConfirm={() => remove(deleting)}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  );
}

// Create a new goal, or edit an existing one.
function GoalForm({ editing, onClose, onSaved }: { editing: SavingsGoal | null; onClose: () => void; onSaved: () => void }) {
  const { t } = useLanguage();
  const lei = (bani?: number) => (bani ? String(bani / 100) : "");
  const [name, setName] = useState(editing?.name ?? "");
  const [target, setTarget] = useState(lei(editing?.target_bani));
  const [saved, setSaved] = useState(lei(editing?.saved_bani));
  const [monthly, setMonthly] = useState(lei(editing?.monthly_bani));
  const [deadline, setDeadline] = useState(editing?.deadline ?? "");
  const [error, setError] = useState("");

  // Empty optional fields count as 0
  const optionalBani = (value: string) => (value.trim() === "" ? 0 : parseLeiInput(value));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const targetBani = parseLeiInput(target);
    const savedBani = optionalBani(saved);
    const monthlyBani = optionalBani(monthly);
    if (targetBani === null || savedBani === null || monthlyBani === null) return setError(t("common.amountError"));

    const row = { name: name.trim(), target_bani: targetBani, saved_bani: savedBani, monthly_bani: monthlyBani, deadline: deadline || null };
    const { error } = editing
      ? await supabase.from("savings_goals").update(row).eq("id", editing.id)
      : await supabase.from("savings_goals").insert(row);
    if (error) return setError(t("common.error"));
    onSaved();
    onClose();
  }

  return (
    <Modal title={editing ? t("goals.editTitle") : t("goals.new")} onClose={onClose}>
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="goal-name">{t("goals.name")}</label>
          <input id="goal-name" className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} required autoFocus />
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
        {error && <p role="alert" className="text-sm font-medium text-coral sm:col-span-2">{error}</p>}
        <button className="btn-primary sm:col-span-2">{t("common.save")}</button>
      </form>
    </Modal>
  );
}
