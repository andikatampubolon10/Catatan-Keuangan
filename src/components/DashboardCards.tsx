import React from 'react';
import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react';
import { formatRupiah } from '../utils';

interface DashboardCardsProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  periodLabel: string;
}

export const DashboardCards: React.FC<DashboardCardsProps> = ({
  totalIncome,
  totalExpense,
  balance,
  periodLabel,
}) => {
  const isPositiveBalance = balance >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
      {/* Total Pemasukan Card */}
      <div className="bg-[#171717] p-6 border border-[#262626] rounded-none relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-3 opacity-10 text-white pointer-events-none group-hover:opacity-20 transition-opacity">
          <ArrowUpRight className="w-16 h-16 stroke-[1]" />
        </div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#737373] mb-2 font-semibold">
          Total Pemasukan
        </p>
        <p className="text-3xl lg:text-4xl font-light text-[#22C55E] tracking-tight font-mono">
          {formatRupiah(totalIncome)}
        </p>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-[#22C55E]/80 font-medium">
          <span>&uarr; Periode {periodLabel}</span>
        </div>
      </div>

      {/* Total Pengeluaran Card */}
      <div className="bg-[#171717] p-6 border border-[#262626] rounded-none relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-3 opacity-10 text-white pointer-events-none group-hover:opacity-20 transition-opacity">
          <ArrowDownRight className="w-16 h-16 stroke-[1]" />
        </div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#737373] mb-2 font-semibold">
          Total Pengeluaran
        </p>
        <p className="text-3xl lg:text-4xl font-light text-[#EF4444] tracking-tight font-mono">
          {formatRupiah(totalExpense)}
        </p>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-[#EF4444]/80 font-medium">
          <span>&darr; Periode {periodLabel}</span>
        </div>
      </div>

      {/* Sisa Saldo Card - High Contrast Luxury Minimalist */}
      <div
        className={`p-6 rounded-none relative overflow-hidden transition-all ${
          isPositiveBalance
            ? 'bg-[#F5F5F5] text-[#0A0A0A] border border-[#F5F5F5]'
            : 'bg-[#171717] text-[#F5F5F5] border border-[#EF4444]/50'
        }`}
      >
        <p
          className={`text-[10px] uppercase tracking-[0.25em] mb-2 font-semibold ${
            isPositiveBalance ? 'text-[#737373]' : 'text-[#EF4444]'
          }`}
        >
          Sisa Saldo Efektif
        </p>
        <p
          className={`text-3xl lg:text-4xl tracking-tight font-mono ${
            isPositiveBalance
              ? 'font-semibold text-[#0A0A0A]'
              : 'font-light text-[#EF4444]'
          }`}
        >
          {formatRupiah(balance)}
        </p>
        <div
          className={`mt-3 flex items-center gap-2 text-xs font-medium ${
            isPositiveBalance ? 'text-[#525252]' : 'text-[#EF4444]'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              balance > 0
                ? 'bg-[#0A0A0A]'
                : balance === 0
                ? 'bg-slate-400'
                : 'bg-[#EF4444]'
            }`}
          ></span>
          <span>
            {balance > 0
              ? 'Surplus Keuangan Aman'
              : balance === 0
              ? 'Saldo Berimbang'
              : 'Defisit / Pengeluaran Berlebih'}
          </span>
        </div>
      </div>
    </div>
  );
};

