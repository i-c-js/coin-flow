import { Sandwich, Bus, Smartphone, Ticket, Shirt, Gift, Ellipsis, HandCoins, Briefcase, type LucideIcon } from "lucide-react";

export type TransactionType = "income" | "expense";

export type Category = { id: string; icon: LucideIcon; color: string };

// Labels come from the translation files: categories.<id>
export const EXPENSE_CATEGORIES: Category[] = [
  { id: "food", icon: Sandwich, color: "#f2674a" },
  { id: "transport", icon: Bus, color: "#0b6e6e" },
  { id: "phone", icon: Smartphone, color: "#3cc3b0" },
  { id: "going_out", icon: Ticket, color: "#ffc845" },
  { id: "clothes", icon: Shirt, color: "#4a7fd6" },
  { id: "gifts", icon: Gift, color: "#e0559a" },
  { id: "other", icon: Ellipsis, color: "#8a9aa5" },
];

export const INCOME_CATEGORIES: Category[] = [
  { id: "allowance", icon: HandCoins, color: "#1e9e5a" },
  { id: "job", icon: Briefcase, color: "#0b6e6e" },
  { id: "gifts", icon: Gift, color: "#e0559a" },
  { id: "other", icon: Ellipsis, color: "#8a9aa5" },
];

export function findCategory(type: TransactionType, id: string): Category {
  const list = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  return list.find((c) => c.id === id) ?? list[list.length - 1];
}
