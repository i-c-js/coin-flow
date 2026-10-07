"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { findCategory } from "@/lib/categories";
import { formatBani } from "@/lib/money";
import type { Transaction } from "@/lib/types";

export default function TransactionRow({
  tx,
  onEdit,
  onDelete,
}: {
  tx: Transaction;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const { t } = useLanguage();
  const { icon: Icon, color } = findCategory(tx.type, tx.category);
  const isExpense = tx.type === "expense";

  return (
    <li className="flex items-center gap-3 py-3">
      <span className="rounded-2xl p-2.5" style={{ backgroundColor: `${color}22` }}>
        <Icon size={20} color={color} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{tx.note || t(`categories.${tx.category}`)}</p>
        <p className="text-xs text-ink-soft">
          {t(`categories.${tx.category}`)} · {tx.date}
        </p>
      </div>
      <p className={`font-display font-bold ${isExpense ? "text-coral" : "text-leaf"}`}>
        {isExpense ? "−" : "+"}
        {formatBani(tx.amount_bani)}
      </p>
      {onEdit && (
        <button onClick={onEdit} className="rounded-full p-1.5 text-ink-soft hover:bg-foam" aria-label={t("common.edit")}>
          <Pencil size={16} />
        </button>
      )}
      {onDelete && (
        <button onClick={onDelete} className="rounded-full p-1.5 text-ink-soft hover:bg-coral/10 hover:text-coral" aria-label={t("common.delete")}>
          <Trash2 size={16} />
        </button>
      )}
    </li>
  );
}
