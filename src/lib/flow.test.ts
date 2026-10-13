import { describe, expect, it } from "vitest";
import { buildMoneyFlow } from "./flow";
import { spendingByCategory, sumByType } from "./summary";
import type { Transaction } from "./types";

// Small helper to make test transactions
let nextId = 0;
const tx = (type: "income" | "expense", category: string, lei: number): Transaction => ({
  id: String(nextId++),
  type,
  category,
  amount_bani: lei * 100,
  note: null,
  date: "2026-10-07",
});

describe("weekly summary", () => {
  const list = [tx("expense", "food", 50), tx("expense", "food", 30), tx("expense", "transport", 100), tx("income", "job", 500)];

  it("adds up income and expenses separately", () => {
    expect(sumByType(list, "expense")).toBe(18000);
    expect(sumByType(list, "income")).toBe(50000);
  });
  it("groups spending by category, biggest first", () => {
    expect(spendingByCategory(list).map((row) => [row.id, row.totalBani])).toEqual([
      ["transport", 10000],
      ["food", 8000],
    ]);
  });
});

describe("money flow diagram", () => {
  it("returns null when there is nothing to show", () => {
    expect(buildMoneyFlow([])).toBeNull();
  });

  it("sends what is not spent to 'left over'", () => {
    const flow = buildMoneyFlow([tx("income", "allowance", 300), tx("expense", "food", 120)])!;
    const ids = flow.nodes.map((n) => n.id);
    expect(ids).toEqual(["wallet", "allowance", "food", "leftover"]);
    const leftover = flow.links.find((l) => flow.nodes[l.target].id === "leftover");
    expect(leftover?.valueBani).toBe(18000);
  });

  it("adds 'earlier money' when spending is bigger than income", () => {
    const flow = buildMoneyFlow([tx("income", "job", 100), tx("expense", "clothes", 250)])!;
    const earlier = flow.links.find((l) => flow.nodes[l.source].id === "earlier");
    expect(earlier?.valueBani).toBe(15000);
    expect(flow.nodes.some((n) => n.id === "leftover")).toBe(false);
  });

  it("keeps money in = money out", () => {
    const flow = buildMoneyFlow([tx("income", "job", 400), tx("income", "gifts", 100), tx("expense", "phone", 90)])!;
    const wallet = 0;
    const into = flow.links.filter((l) => l.target === wallet).reduce((s, l) => s + l.valueBani, 0);
    const out = flow.links.filter((l) => l.source === wallet).reduce((s, l) => s + l.valueBani, 0);
    expect(into).toBe(out);
  });
});
