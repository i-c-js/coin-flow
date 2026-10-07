import type { TransactionType } from "./categories";

// Row types that match the tables in supabase/schema.sql.

export type Transaction = {
  id: string;
  type: TransactionType;
  amount_bani: number;
  category: string;
  note: string | null;
  date: string; // YYYY-MM-DD
};

export type SavingsGoal = {
  id: string;
  name: string;
  target_bani: number;
  saved_bani: number;
  monthly_bani: number;
  deadline: string | null;
  created_at: string;
};
