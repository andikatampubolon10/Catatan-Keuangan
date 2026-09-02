import { Transaction } from './types';

export const INCOME_CATEGORIES = [
  'Gaji',
  'Bonus',
  'Penjualan',
  'Investasi',
  'Hadiah',
  'Lain-lain',
];

export const EXPENSE_CATEGORIES = [
  'Makanan',
  'Transportasi',
  'Tagihan',
  'Hiburan',
  'Belanja',
  'Kesehatan',
  'Pendidikan',
  'Lain-lain',
];

export const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    description: 'Gaji Bulanan',
    amount: 6500000,
    type: 'pemasukan',
    category: 'Gaji',
    date: new Date().toISOString().slice(0, 8) + '01',
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'tx-2',
    description: 'Belanja Mingguan Supermarket',
    amount: 650000,
    type: 'pengeluaran',
    category: 'Makanan',
    date: new Date().toISOString().slice(0, 8) + '03',
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'tx-3',
    description: 'Listrik & Internet Rumah',
    amount: 450000,
    type: 'pengeluaran',
    category: 'Tagihan',
    date: new Date().toISOString().slice(0, 8) + '05',
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'tx-4',
    description: 'Proyek Sampingan Desain',
    amount: 1200000,
    type: 'pemasukan',
    category: 'Penjualan',
    date: new Date().toISOString().slice(0, 8) + '06',
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'tx-5',
    description: 'Bensin & Tol Mobil',
    amount: 250000,
    type: 'pengeluaran',
    category: 'Transportasi',
    date: new Date().toISOString().slice(0, 10),
    createdAt: Date.now(),
  },
];
