"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Minus, Plus, ChartColumn, Receipt } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import EmptyState from "@/components/EmptyState";
import TransactionForm from "@/components/TransactionForm";
import TransactionRow from "@/components/TransactionRow";
import { useLanguage } from "@/i18n/LanguageProvider";
import { supabase } from "@/lib/supabase";
import { formatBani, toDateString } from "@/lib/money";
import { sumByType } from "@/lib/summary";
import type { TransactionType } from "@/lib/categories";
import type { Transaction } from "@/lib/types";

export default function TransactionsPage() {
  return <AuthGuard>{() => <Transactions />}</AuthGuard>;
}

function Transactions() {
  const { t } = useLanguage();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [formType, setFormType] = useState<TransactionType | null>(null);
  const [editing, setEditing] = useState<Transaction | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(200);
    setTransactions(data ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(tx: Transaction) {
    if (!confirm(t("tx.deleteConfirm"))) return;
    await supabase.from("transactions").delete().eq("id", tx.id);
    load();
  }

  const now = new Date();
  const monthStart = toDateString(new Date(now.getFullYear(), now.getMonth(), 1));
  const thisMonth = transactions.filter((tx) => tx.date >= monthStart);
  const income = sumByType(thisMonth, "income");
  const expenses = sumByType(thisMonth, "expense");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="h1">{t("tx.title")}</h1>
        <Link href="/summary" className="btn-ghost text-sm">
          <ChartColumn size={18} /> {t("tx.weekSummary")}
        </Link>
      </div>

      {/* Month balance */}
      <div className="card">
        <p className="text-ink-soft">{t("tx.balance")}</p>
        <p className={`big-number text-4xl ${income - expenses < 0 ? "text-coral" : "text-flow"}`}>
          {formatBani(income - expenses)} <span className="text-xl">{t("common.lei")}</span>
        </p>
        <div className="mt-3 flex gap-6 text-sm">
          <span>{t("tx.in")}: <b className="text-leaf">+{formatBani(income)}</b></span>
          <span>{t("tx.out")}: <b className="text-coral">−{formatBani(expenses)}</b></span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button className="btn bg-coral text-white" onClick={() => setFormType("expense")}>
          <Minus size={20} /> {t("tx.expense")}
        </button>
        <button className="btn bg-leaf text-white" onClick={() => setFormType("income")}>
          <Plus size={20} /> {t("tx.income")}
        </button>
      </div>

      {transactions.length === 0 ? (
        <EmptyState icon={Receipt} title={t("tx.emptyTitle")} text={t("tx.emptyText")} />
      ) : (
        <ul className="card divide-y divide-line py-2">
          {transactions.map((tx) => (
            <TransactionRow key={tx.id} tx={tx} onEdit={() => setEditing(tx)} onDelete={() => remove(tx)} />
          ))}
        </ul>
      )}

      {(formType || editing) && (
        <TransactionForm
          initialType={formType ?? "expense"}
          editing={editing}
          onClose={() => {
            setFormType(null);
            setEditing(null);
          }}
          onSaved={load}
        />
      )}
    </div>
  );
}
