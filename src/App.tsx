/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Transaction } from './types';
import { INITIAL_TRANSACTIONS, MONTH_NAMES } from './constants';
import { DashboardCards } from './components/DashboardCards';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { Header } from './components/Header';
import { fetchTransactions, createTransaction, deleteTransaction, resetTransactions, checkDatabaseHealth } from './services/api';

const STORAGE_KEY = 'catatan_keuangan_transaksi_v1';

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load transactions from localStorage:', e);
    }
    return INITIAL_TRANSACTIONS;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(false);

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());

  // Load transactions from MySQL Backend
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const isHealthy = await checkDatabaseHealth();
      if (isHealthy) {
        const data = await fetchTransactions();
        setTransactions(data);
        setIsDbConnected(true);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } else {
        setIsDbConnected(false);
      }
    } catch (err) {
      console.warn('Gagal terhubung ke MySQL, menggunakan penyimpanan lokal:', err);
      setIsDbConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Backup state to localStorage as a safety net
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [transactions]);

  // Calculate summary for selected month and year
  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;

    transactions.forEach((tx) => {
      const [y, m] = tx.date.split('-');
      const txMonth = parseInt(m, 10);
      const txYear = parseInt(y, 10);

      const matchMonth = selectedMonth === 0 || txMonth === selectedMonth;
      const matchYear = selectedYear === 0 || txYear === selectedYear;

      if (matchMonth && matchYear) {
        if (tx.type === 'pemasukan') {
          income += tx.amount;
        } else {
          expense += tx.amount;
        }
      }
    });

    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
    };
  }, [transactions, selectedMonth, selectedYear]);

  // Label for period
  const periodLabel = useMemo(() => {
    if (selectedMonth === 0 && selectedYear === 0) return 'Semua Waktu';
    if (selectedMonth === 0) return `Tahun ${selectedYear}`;
    if (selectedYear === 0) return `Bulan ${MONTH_NAMES[selectedMonth - 1]}`;
    return `${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`;
  }, [selectedMonth, selectedYear]);

  // Handlers
  const handleAddTransaction = async (newTxData: Omit<Transaction, 'id' | 'createdAt'>) => {
    const tempId = 'tx-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    const tempTx: Transaction = {
      ...newTxData,
      id: tempId,
      createdAt: Date.now(),
    };

    // Optimistic UI update
    setTransactions((prev) => [tempTx, ...prev]);

    // Save to MySQL backend
    try {
      const savedTx = await createTransaction(newTxData);
      setTransactions((prev) => prev.map((tx) => (tx.id === tempId ? savedTx : tx)));
      setIsDbConnected(true);
    } catch (err) {
      console.warn('Gagal simpan ke MySQL, data disimpan di lokal:', err);
    }

    // If transaction date is in another month/year, switch filter to that month/year so user sees it
    const [txY, txM] = newTxData.date.split('-');
    const m = parseInt(txM, 10);
    const y = parseInt(txY, 10);
    if (selectedMonth !== 0 && selectedMonth !== m) {
      setSelectedMonth(m);
    }
    if (selectedYear !== 0 && selectedYear !== y) {
      setSelectedYear(y);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));

    try {
      await deleteTransaction(id);
    } catch (err) {
      console.warn('Gagal menghapus dari MySQL:', err);
    }
  };

  const handleResetData = async () => {
    if (window.confirm('Apakah Anda yakin ingin mengatur ulang data ke data contoh bawaan?')) {
      try {
        await resetTransactions();
        await loadData();
      } catch (err) {
        console.warn('Gagal reset ke MySQL, mereset secara lokal:', err);
        setTransactions(INITIAL_TRANSACTIONS);
      }
      const now = new Date();
      setSelectedMonth(now.getMonth() + 1);
      setSelectedYear(now.getFullYear());
    }
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(transactions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `catatan_keuangan_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A] text-[#F5F5F5]">
      <Header onResetData={handleResetData} onExportData={handleExportData} isDbConnected={isDbConnected} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Dashboard Top Cards */}
        <section aria-label="Ringkasan Keuangan">
          <DashboardCards
            totalIncome={summary.totalIncome}
            totalExpense={summary.totalExpense}
            balance={summary.balance}
            periodLabel={periodLabel}
          />
        </section>

        {/* Main Content Layout: Form on Left, List on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Input Transaksi */}
          <section className="lg:col-span-5 w-full" aria-label="Form Input Transaksi">
            <TransactionForm onAddTransaction={handleAddTransaction} />
          </section>

          {/* Daftar & Filter Transaksi */}
          <section className="lg:col-span-7 w-full" aria-label="Daftar Transaksi">
            <TransactionList
              transactions={transactions}
              onDeleteTransaction={handleDeleteTransaction}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
            />
          </section>
        </div>
      </main>

      <footer className="px-4 sm:px-8 py-5 bg-[#171717] border-t border-[#262626] text-[10px] text-[#737373] uppercase tracking-[0.2em] flex flex-col sm:flex-row justify-between items-center gap-2 mt-auto">
        <p>Catatan Keuangan Bulanan &bull; {isDbConnected ? 'MySQL Database Sinkron' : 'Local Storage Ledger'}</p>
        <div className="flex items-center gap-2 font-mono">
          <span className={`w-1.5 h-1.5 rounded-full ${isDbConnected ? 'bg-emerald-500' : 'bg-neutral-500'}`} />
          <span className={isDbConnected ? 'text-emerald-500' : 'text-[#525252]'}>
            {isDbConnected ? 'Database MySQL Aktif' : 'Penyimpanan Offline'}
          </span>
        </div>
      </footer>
    </div>
  );
}
