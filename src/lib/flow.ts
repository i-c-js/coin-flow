import type { Transaction } from "./types";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "./categories";

// Data for the "money flow" diagram:
//   income categories  ->  wallet  ->  expense categories (+ "left over")
// If more was spent than earned, an extra "earlier money" stream flows into the wallet,
// so what goes in always equals what comes out.

export type FlowNode = { id: string; kind: "income" | "wallet" | "expense" | "leftover" | "earlier"; color: string };
export type FlowLink = { source: number; target: number; valueBani: number };
export type MoneyFlow = { nodes: FlowNode[]; links: FlowLink[] };

export function buildMoneyFlow(transactions: Transaction[]): MoneyFlow | null {
  const total = (type: "income" | "expense", category: string) =>
    transactions.filter((tx) => tx.type === type && tx.category === category).reduce((sum, tx) => sum + tx.amount_bani, 0);

  const incomes = INCOME_CATEGORIES.map((c) => ({ ...c, bani: total("income", c.id) })).filter((c) => c.bani > 0);
  const expenses = EXPENSE_CATEGORIES.map((c) => ({ ...c, bani: total("expense", c.id) })).filter((c) => c.bani > 0);
  if (incomes.length === 0 && expenses.length === 0) return null;

  const incomeTotal = incomes.reduce((sum, c) => sum + c.bani, 0);
  const expenseTotal = expenses.reduce((sum, c) => sum + c.bani, 0);

  const nodes: FlowNode[] = [];
  const links: FlowLink[] = [];
  const addNode = (node: FlowNode) => nodes.push(node) - 1; // returns the new node's index

  const wallet = addNode({ id: "wallet", kind: "wallet", color: "#0b6e6e" });

  for (const c of incomes) {
    links.push({ source: addNode({ id: c.id, kind: "income", color: c.color }), target: wallet, valueBani: c.bani });
  }
  if (expenseTotal > incomeTotal) {
    const earlier = addNode({ id: "earlier", kind: "earlier", color: "#8a9aa5" });
    links.push({ source: earlier, target: wallet, valueBani: expenseTotal - incomeTotal });
  }
  for (const c of expenses) {
    links.push({ source: wallet, target: addNode({ id: c.id, kind: "expense", color: c.color }), valueBani: c.bani });
  }
  if (incomeTotal > expenseTotal) {
    const leftover = addNode({ id: "leftover", kind: "leftover", color: "#3cc3b0" });
    links.push({ source: wallet, target: leftover, valueBani: incomeTotal - expenseTotal });
  }

  return { nodes, links };
}
