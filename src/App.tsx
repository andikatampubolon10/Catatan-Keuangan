/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Transaction } from './types';
import { INITIAL_TRANSACTIONS, MONTH_NAMES } from './constants';
import { DashboardCards } from './components/DashboardCards';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { Header } from './components/Header';

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

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());

  // Save to localStorage
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
  const handleAddTransaction = (newTxData: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...newTxData,
      id: 'tx-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      createdAt: Date.now(),
    };

    setTransactions((prev) => [newTx, ...prev]);

    // If transaction date is in another month/year, switch filter to that month/year so user sees it
    const [txY, txM] = newTx.date.split('-');
    const m = parseInt(txM, 10);
    const y = parseInt(txY, 10);
    if (selectedMonth !== 0 && selectedMonth !== m) {
      setSelectedMonth(m);
    }
    if (selectedYear !== 0 && selectedYear !== y) {
      setSelectedYear(y);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  const handleResetData = () => {
    if (window.confirm('Apakah Anda yakin ingin mengatur ulang data ke data contoh bawaan?')) {
      setTransactions(INITIAL_TRANSACTIONS);
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
      <Header onResetData={handleResetData} onExportData={handleExportData} />

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
        <p>Catatan Keuangan Bulanan &bull; Local Storage Ledger</p>
        <p className="font-mono text-[#525252]">Sistem Terhubung</p>
      </footer>
    </div>
  );
}
