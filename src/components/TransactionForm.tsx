"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/i18n/LanguageProvider";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, type TransactionType } from "@/lib/categories";
import { leiToBani, toDateString } from "@/lib/money";
import type { Transaction } from "@/lib/types";

// Pop-up form to add or edit income / expenses.
// Quick path for an expense: type the amount, tap a category, save.
export default function TransactionForm({
  initialType = "expense",
  editing,
  onClose,
  onSaved,
}: {
  initialType?: TransactionType;
  editing?: Transaction | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useLanguage();
  const [type, setType] = useState<TransactionType>(editing?.type ?? initialType);
  const [amount, setAmount] = useState(editing ? String(editing.amount_bani / 100) : "");
  const [category, setCategory] = useState(editing?.category ?? (initialType === "expense" ? "food" : "allowance"));
  const [note, setNote] = useState(editing?.note ?? "");
  const [date, setDate] = useState(editing?.date ?? toDateString(new Date()));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const categories = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  function switchType(newType: TransactionType) {
    setType(newType);
    setCategory(newType === "expense" ? "food" : "allowance");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amountBani = leiToBani(Number(amount.replace(",", ".")));
    if (!amountBani || amountBani <= 0) return;

    setBusy(true);
    const row = { type, amount_bani: amountBani, category, note: note || null, date };
    const { error } = editing
      ? await supabase.from("transactions").update(row).eq("id", editing.id)
      : await supabase.from("transactions").insert(row);
    setBusy(false);

    if (error) return setError(t("common.error"));
    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 sm:items-center" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md space-y-4 rounded-t-card bg-surface p-6 sm:rounded-card"
      >
        <div className="flex items-center justify-between">
          <h2 className="h2">{editing ? t("tx.editTitle") : type === "expense" ? t("tx.addExpense") : t("tx.addIncome")}</h2>
          <button type="button" onClick={onClose} className="rounded-full p-1 text-ink-soft hover:bg-foam" aria-label={t("common.cancel")}>
            <X />
          </button>
        </div>

        {/* Expense / income switch */}
        <div className="grid grid-cols-2 rounded-pill bg-mist p-1">
          {(["expense", "income"] as const).map((option) => (
            <button
              type="button"
              key={option}
              onClick={() => switchType(option)}
              className={`rounded-pill py-2 text-sm font-bold ${
                type === option ? (option === "expense" ? "bg-coral text-white" : "bg-leaf text-white") : "text-ink-soft"
              }`}
            >
              {t(`tx.${option}`)}
            </button>
          ))}
        </div>

        <div>
          <label className="label" htmlFor="amount">{t("tx.amount")}</label>
          <input
            id="amount"
            className="input big-number text-3xl"
            inputMode="decimal"
            placeholder="0"
            autoFocus
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.,]/g, ""))}
            required
          />
        </div>

        <div>
          <span className="label">{t("tx.category")}</span>
          <div className="grid grid-cols-4 gap-2">
            {categories.map(({ id, icon: Icon, color }) => (
              <button
                type="button"
                key={id}
                onClick={() => setCategory(id)}
                className={`flex flex-col items-center gap-1 rounded-2xl border-2 p-2 text-[11px] font-semibold leading-tight ${
                  category === id ? "border-flow bg-foam text-ink" : "border-transparent bg-mist text-ink-soft"
                }`}
              >
                <Icon size={22} color={color} />
                {t(`categories.${id}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="note">{t("tx.note")}</label>
            <input id="note" className="input" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="date">{t("tx.date")}</label>
            <input id="date" type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
        </div>

        {error && <p className="text-sm font-medium text-coral">{error}</p>}

        <button className="btn-primary w-full" disabled={busy}>{t("common.save")}</button>
      </form>
    </div>
  );
}
