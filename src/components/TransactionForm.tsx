import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType } from '../types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../constants';
import { formatRupiah } from '../utils';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction }) => {
  const today = new Date().toISOString().slice(0, 10);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [type, setType] = useState<TransactionType>('pengeluaran');
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0]);
  const [date, setDate] = useState<string>(today);
  const [error, setError] = useState<string>('');

  // Update default category when type changes
  useEffect(() => {
    if (type === 'pemasukan') {
      if (!INCOME_CATEGORIES.includes(category)) {
        setCategory(INCOME_CATEGORIES[0]);
      }
    } else {
      if (!EXPENSE_CATEGORIES.includes(category)) {
        setCategory(EXPENSE_CATEGORIES[0]);
      }
    }
  }, [type]);

  const categories = type === 'pemasukan' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanDescription = description.trim();
    const numAmount = parseFloat(amount.replace(/[^0-9]/g, ''));

    if (!cleanDescription) {
      setError('Deskripsi transaksi wajib diisi');
      return;
    }

    if (!numAmount || numAmount <= 0) {
      setError('Nominal harus lebih besar dari 0');
      return;
    }

    if (!date) {
      setError('Tanggal transaksi wajib dipilih');
      return;
    }

    onAddTransaction({
      description: cleanDescription,
      amount: numAmount,
      type,
      category,
      date,
    });

    // Reset form
    setDescription('');
    setAmount('');
    setError('');
  };

  const parsedAmount = parseFloat(amount.replace(/[^0-9]/g, '')) || 0;

  return (
    <div className="bg-[#171717] border border-[#262626] p-6 rounded-none shadow-xs">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#262626]">
        <h2 className="text-xs uppercase tracking-[0.25em] text-[#A3A3A3] font-semibold flex items-center gap-2">
          <span>Tambah Entri Transaksi</span>
        </h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-950/30 border border-[#EF4444]/40 text-[#EF4444] text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tipe Transaksi: Segmented Minimal Dark Control */}
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-[#737373] mb-1.5 font-semibold">
            Jenis Transaksi
          </label>
          <div className="grid grid-cols-2 gap-2 bg-[#0A0A0A] p-1 border border-[#333333]">
            <button
              type="button"
              onClick={() => setType('pengeluaran')}
              className={`py-2 px-3 text-[11px] font-bold uppercase tracking-wider transition-all ${
                type === 'pengeluaran'
                  ? 'bg-[#EF4444] text-white shadow-xs'
                  : 'text-[#737373] hover:text-[#F5F5F5]'
              }`}
            >
              Pengeluaran (-)
            </button>
            <button
              type="button"
              onClick={() => setType('pemasukan')}
              className={`py-2 px-3 text-[11px] font-bold uppercase tracking-wider transition-all ${
                type === 'pemasukan'
                  ? 'bg-[#22C55E] text-[#0A0A0A] shadow-xs'
                  : 'text-[#737373] hover:text-[#F5F5F5]'
              }`}
            >
              Pemasukan (+)
            </button>
          </div>
        </div>

        {/* Deskripsi */}
        <div>
          <label htmlFor="deskripsi" className="block text-[10px] uppercase tracking-widest text-[#737373] mb-1.5 font-semibold">
            Deskripsi Transaksi
          </label>
          <input
            id="deskripsi"
            type="text"
            placeholder="Contoh: Gaji Pokok, Belanja Groceries, Bensin"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#404040] py-2.5 px-3 text-sm text-[#F5F5F5] focus:border-[#A3A3A3] outline-none placeholder:text-[#525252] transition-colors"
          />
        </div>

        {/* Nominal Uang */}
        <div>
          <label htmlFor="nominal" className="block text-[10px] uppercase tracking-widest text-[#737373] mb-1.5 font-semibold">
            Nominal (IDR)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#737373] font-mono text-xs">
              Rp
            </div>
            <input
              id="nominal"
              type="number"
              min="1"
              step="1"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#404040] py-2.5 pl-9 pr-3 text-sm font-mono text-[#F5F5F5] focus:border-[#A3A3A3] outline-none placeholder:text-[#525252] transition-colors"
            />
          </div>
          {parsedAmount > 0 && (
            <p className="mt-1 text-[11px] text-[#A3A3A3] font-mono">
              Terbaca: <span className="font-semibold text-[#F5F5F5]">{formatRupiah(parsedAmount)}</span>
            </p>
          )}
        </div>

        {/* Grid: Kategori & Tanggal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Dropdown Kategori */}
          <div>
            <label htmlFor="kategori" className="block text-[10px] uppercase tracking-widest text-[#737373] mb-1.5 font-semibold">
              Kategori
            </label>
            <div className="relative">
              <select
                id="kategori"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#404040] py-2.5 px-3 pr-8 text-sm text-[#F5F5F5] focus:border-[#A3A3A3] outline-none cursor-pointer appearance-none transition-colors"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#171717] text-[#F5F5F5]">
                    {cat}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#737373] text-[10px]">
                ▼
              </div>
            </div>
          </div>

          {/* Input Tanggal */}
          <div>
            <label htmlFor="tanggal" className="block text-[10px] uppercase tracking-widest text-[#737373] mb-1.5 font-semibold">
              Tanggal
            </label>
            <input
              id="tanggal"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#404040] py-2.5 px-3 text-sm text-[#F5F5F5] focus:border-[#A3A3A3] outline-none transition-colors [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-3 bg-[#F5F5F5] text-[#0A0A0A] font-bold text-[11px] uppercase tracking-widest py-3 hover:bg-white active:bg-slate-200 transition-colors shadow-xs"
        >
          <span>Simpan {type === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}</span>
        </button>
      </form>
    </div>
  );
};

