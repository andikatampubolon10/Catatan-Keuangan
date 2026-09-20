import { Transaction } from '../types';

const API_BASE = '/api';

export async function fetchTransactions(): Promise<Transaction[]> {
  const response = await fetch(`${API_BASE}/transactions`);
  if (!response.ok) {
    throw new Error(`Gagal mengambil data transaksi: ${response.statusText}`);
  }
  return response.json();
}

export async function createTransaction(tx: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
  const response = await fetch(`${API_BASE}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tx),
  });

  if (!response.ok) {
    throw new Error(`Gagal menyimpan transaksi: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteTransaction(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/transactions/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Gagal menghapus transaksi: ${response.statusText}`);
  }
}

export async function resetTransactions(): Promise<void> {
  const response = await fetch(`${API_BASE}/transactions/reset`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`Gagal mereset data transaksi: ${response.statusText}`);
  }
}

export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) return false;
    const data = await res.json();
    return data.database === 'connected';
  } catch {
    return false;
  }
}
