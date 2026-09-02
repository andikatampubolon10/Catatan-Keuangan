import React, { useState, useMemo } from 'react';
import {
  Trash2,
  Calendar,
  Filter,
  Search,
  Inbox,
  X,
} from 'lucide-react';
import { Transaction, TransactionType } from '../types';
import { MONTH_NAMES } from '../constants';
import { formatRupiah, formatDateIndo } from '../utils';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  selectedMonth: number; // 0 for all, 1-12 for Jan-Dec
  setSelectedMonth: (month: number) => void;
  selectedYear: number; // 0 for all, or YYYY
  setSelectedYear: (year: number) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onDeleteTransaction,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
}) => {
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Extract available years from transactions
  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = new Set<number>([currentYear]);
    transactions.forEach((tx) => {
      const y = parseInt(tx.date.split('-')[0], 10);
      if (!isNaN(y)) years.add(y);
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [transactions]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Month filter
      if (selectedMonth > 0) {
        const txMonth = parseInt(tx.date.split('-')[1], 10);
        if (txMonth !== selectedMonth) return false;
      }

      // Year filter
      if (selectedYear > 0) {
        const txYear = parseInt(tx.date.split('-')[0], 10);
        if (txYear !== selectedYear) return false;
      }

      // Type filter
      if (filterType !== 'all' && tx.type !== filterType) {
        return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchDesc = tx.description.toLowerCase().includes(term);
        const matchCat = tx.category.toLowerCase().includes(term);
        if (!matchDesc && !matchCat) return false;
      }

      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, selectedMonth, selectedYear, filterType, searchTerm]);

  const handleDelete = (id: string) => {
    onDeleteTransaction(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="bg-[#171717] border border-[#262626] rounded-none flex flex-col shadow-xs">
      {/* Header & Controls Toolbar */}
      <div className="p-6 pb-4 border-b border-[#262626] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xs uppercase tracking-[0.25em] text-[#A3A3A3] font-semibold">
              Daftar Riwayat Transaksi
            </h2>
            <p className="text-[11px] text-[#737373] mt-0.5 font-mono">
              Menampilkan {filteredTransactions.length} dari total {transactions.length} entri
            </p>
          </div>

          {/* Filter Periode Bulan & Tahun */}
          <div className="flex items-center gap-2">
            {/* Filter Bulan */}
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="bg-[#0A0A0A] border border-[#404040] text-xs text-[#A3A3A3] focus:border-[#A3A3A3] py-1.5 pl-2.5 pr-6 rounded-none outline-none cursor-pointer appearance-none"
              >
                <option value={0} className="bg-[#171717]">Semua Bulan</option>
                {MONTH_NAMES.map((name, idx) => (
                  <option key={idx + 1} value={idx + 1} className="bg-[#171717]">
                    {name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-[#737373] text-[9px]">
                ▼
              </div>
            </div>

            {/* Filter Tahun */}
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-[#0A0A0A] border border-[#404040] text-xs text-[#A3A3A3] focus:border-[#A3A3A3] py-1.5 pl-2.5 pr-6 rounded-none outline-none cursor-pointer appearance-none"
              >
                <option value={0} className="bg-[#171717]">Semua Tahun</option>
                {availableYears.map((year) => (
                  <option key={year} value={year} className="bg-[#171717]">
                    {year}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-[#737373] text-[9px]">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tab & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
          {/* Filter Tipe Toggle */}
          <div className="flex items-center bg-[#0A0A0A] p-0.5 border border-[#333333] text-xs w-full sm:w-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`flex-1 sm:flex-none px-3 py-1 text-[11px] uppercase tracking-wider font-semibold transition-all ${
                filterType === 'all'
                  ? 'bg-[#262626] text-[#F5F5F5]'
                  : 'text-[#737373] hover:text-[#A3A3A3]'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterType('pemasukan')}
              className={`flex-1 sm:flex-none px-3 py-1 text-[11px] uppercase tracking-wider font-semibold transition-all ${
                filterType === 'pemasukan'
                  ? 'bg-[#22C55E] text-[#0A0A0A]'
                  : 'text-[#737373] hover:text-[#A3A3A3]'
              }`}
            >
              Masuk
            </button>
            <button
              onClick={() => setFilterType('pengeluaran')}
              className={`flex-1 sm:flex-none px-3 py-1 text-[11px] uppercase tracking-wider font-semibold transition-all ${
                filterType === 'pengeluaran'
                  ? 'bg-[#EF4444] text-white'
                  : 'text-[#737373] hover:text-[#A3A3A3]'
              }`}
            >
              Keluar
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#737373]">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              placeholder="Cari transaksi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#404040] py-1.5 pl-8 pr-7 text-xs text-[#F5F5F5] placeholder:text-[#525252] focus:border-[#A3A3A3] outline-none transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-2 flex items-center text-[#737373] hover:text-[#F5F5F5]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Transactions Table Content */}
      {filteredTransactions.length === 0 ? (
        <div className="py-16 px-4 text-center">
          <div className="w-12 h-12 bg-[#0A0A0A] border border-[#262626] flex items-center justify-center mx-auto mb-3 text-[#737373]">
            <Inbox className="w-5 h-5 stroke-[1.5]" />
          </div>
          <h3 className="text-xs uppercase tracking-widest text-[#A3A3A3] font-semibold">
            Tidak Ada Transaksi Ditemukan
          </h3>
          <p className="text-[11px] text-[#737373] mt-1 max-w-xs mx-auto">
            Tidak ada catatan yang cocok dengan filter atau kata kunci yang dipilih.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#262626] text-[10px] uppercase tracking-widest text-[#A3A3A3] font-bold">
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Deskripsi</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4 text-right">Jumlah</th>
                  <th className="py-3 px-4 text-center w-16">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626]">
                {filteredTransactions.map((tx) => {
                  const isIncome = tx.type === 'pemasukan';
                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-[#1C1C1C] transition-colors group"
                    >
                      <td className="py-3.5 px-4 text-[#737373] whitespace-nowrap font-mono text-xs">
                        {formatDateIndo(tx.date)}
                      </td>
                      <td className="py-3.5 px-4 text-[#F5F5F5] font-medium">
                        {tx.description}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] bg-[#262626] px-2 py-1 rounded-none text-[#A3A3A3] uppercase tracking-wider font-mono">
                          {tx.category}
                        </span>
                      </td>
                      <td
                        className={`py-3.5 px-4 text-right font-mono font-medium whitespace-nowrap text-sm ${
                          isIncome ? 'text-[#22C55E]' : 'text-[#EF4444]'
                        }`}
                      >
                        {isIncome ? '+ ' : '- '} {formatRupiah(tx.amount)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {deleteConfirmId === tx.id ? (
                          <div className="inline-flex items-center gap-1 bg-[#0A0A0A] p-1 border border-[#EF4444]/60">
                            <button
                              onClick={() => handleDelete(tx.id)}
                              className="px-1.5 py-0.5 bg-[#EF4444] hover:bg-red-600 text-white text-[10px] font-bold uppercase"
                            >
                              Hapus
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-1.5 py-0.5 bg-[#262626] hover:bg-[#333333] text-[#A3A3A3] text-[10px] uppercase"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(tx.id)}
                            title="Hapus Transaksi"
                            className="text-[#525252] hover:text-[#EF4444] p-1 transition-colors opacity-70 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden divide-y divide-[#262626]">
            {filteredTransactions.map((tx) => {
              const isIncome = tx.type === 'pemasukan';
              return (
                <div key={tx.id} className="p-4 hover:bg-[#1C1C1C] transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-[#F5F5F5]">{tx.description}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-[#737373]">
                          {formatDateIndo(tx.date)}
                        </span>
                        <span className="text-[9px] bg-[#262626] px-1.5 py-0.5 text-[#A3A3A3] uppercase tracking-wider font-mono">
                          {tx.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-mono font-medium ${
                          isIncome ? 'text-[#22C55E]' : 'text-[#EF4444]'
                        }`}
                      >
                        {isIncome ? '+ ' : '- '} {formatRupiah(tx.amount)}
                      </p>
                      <div className="mt-1 flex justify-end">
                        {deleteConfirmId === tx.id ? (
                          <div className="inline-flex items-center gap-1 bg-[#0A0A0A] p-1 border border-[#EF4444]/60">
                            <button
                              onClick={() => handleDelete(tx.id)}
                              className="px-1.5 py-0.5 bg-[#EF4444] text-white text-[9px] font-bold"
                            >
                              Ya
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-1.5 py-0.5 bg-[#262626] text-[#A3A3A3] text-[9px]"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(tx.id)}
                            className="text-[#525252] hover:text-[#EF4444] p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

