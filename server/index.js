import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pool from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper untuk memformat tanggal ke format YYYY-MM-DD
function formatDate(dateVal) {
  if (!dateVal) return '';
  if (typeof dateVal === 'string') {
    return dateVal.slice(0, 10);
  }
  const d = new Date(dateVal);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 1. Health check & status database
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    res.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      message: err.message
    });
  }
});

// 2. Ambil semua transaksi
app.get('/api/transactions', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, description, amount, type, category, date, created_at AS createdAt FROM transactions ORDER BY date DESC, created_at DESC'
    );

    // Format amount ke number dan date ke YYYY-MM-DD
    const formatted = rows.map((tx) => ({
      ...tx,
      amount: Number(tx.amount),
      date: formatDate(tx.date),
      createdAt: Number(tx.createdAt)
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Gagal mengambil data transaksi:', err);
    res.status(500).json({ error: 'Gagal mengambil data dari database' });
  }
});

// 3. Tambah transaksi baru
app.post('/api/transactions', async (req, res) => {
  const { id, description, amount, type, category, date, createdAt } = req.body;

  if (!description || amount === undefined || !type || !category || !date) {
    return res.status(400).json({ error: 'Data tidak lengkap' });
  }

  const txId = id || 'tx-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
  const txCreatedAt = createdAt || Date.now();

  try {
    await pool.query(
      `INSERT INTO transactions (id, description, amount, type, category, date, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [txId, description, Number(amount), type, category, date, txCreatedAt]
    );

    res.status(201).json({
      id: txId,
      description,
      amount: Number(amount),
      type,
      category,
      date,
      createdAt: txCreatedAt
    });
  } catch (err) {
    console.error('Gagal menyimpan transaksi:', err);
    res.status(500).json({ error: 'Gagal menyimpan transaksi ke database' });
  }
});

// 4. Hapus transaksi berdasarkan ID
app.delete('/api/transactions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM transactions WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
    }
    res.json({ message: 'Transaksi berhasil dihapus', id });
  } catch (err) {
    console.error('Gagal menghapus transaksi:', err);
    res.status(500).json({ error: 'Gagal menghapus transaksi dari database' });
  }
});

// 5. Reset data transaksi ke bawaan (opsional)
app.post('/api/transactions/reset', async (req, res) => {
  try {
    await pool.query('TRUNCATE TABLE transactions');

    const initialData = [
      ['tx-1', 'Gaji Bulanan', 6500000, 'pemasukan', 'Gaji', formatDate(new Date()), Date.now() - 5 * 24 * 60 * 60 * 1000],
      ['tx-2', 'Belanja Mingguan Supermarket', 650000, 'pengeluaran', 'Makanan', formatDate(new Date()), Date.now() - 3 * 24 * 60 * 60 * 1000],
      ['tx-3', 'Listrik & Internet Rumah', 450000, 'pengeluaran', 'Tagihan', formatDate(new Date()), Date.now() - 2 * 24 * 60 * 60 * 1000],
      ['tx-4', 'Proyek Sampingan Desain', 1200000, 'pemasukan', 'Penjualan', formatDate(new Date()), Date.now() - 1 * 24 * 60 * 60 * 1000],
      ['tx-5', 'Bensin & Tol Mobil', 250000, 'pengeluaran', 'Transportasi', formatDate(new Date()), Date.now()]
    ];

    for (const item of initialData) {
      await pool.query(
        'INSERT INTO transactions (id, description, amount, type, category, date, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        item
      );
    }

    res.json({ message: 'Data berhasil direset' });
  } catch (err) {
    console.error('Gagal mereset transaksi:', err);
    res.status(500).json({ error: 'Gagal mereset data di database' });
  }
});

// Sajikan static frontend jika folder dist ada (untuk mode hosting di Arenhost)
const distPath = path.resolve(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server Backend Catatan Keuangan berjalan di http://localhost:${PORT}`);
});
