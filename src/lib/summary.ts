import type { Transaction } from "./types";
import { EXPENSE_CATEGORIES } from "./categories";

// Adds up expenses per category, biggest first. Categories with 0 are left out.
export function spendingByCategory(transactions: Transaction[]) {
  return EXPENSE_CATEGORIES.map((category) => ({
    id: category.id,
    color: category.color,
    totalBani: transactions
      .filter((tx) => tx.type === "expense" && tx.category === category.id)
      .reduce((sum, tx) => sum + tx.amount_bani, 0),
  }))
    .filter((row) => row.totalBani > 0)
    .sort((a, b) => b.totalBani - a.totalBani);
}

export function sumByType(transactions: Transaction[], type: "income" | "expense") {
  return transactions.filter((tx) => tx.type === type).reduce((sum, tx) => sum + tx.amount_bani, 0);
}
