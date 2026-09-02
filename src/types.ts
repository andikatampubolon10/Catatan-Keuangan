export type TransactionType = 'pemasukan' | 'pengeluaran';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // YYYY-MM-DD
  createdAt: number;
}

export interface MonthSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}
