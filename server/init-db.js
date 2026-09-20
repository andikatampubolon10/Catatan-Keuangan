import pool from './db.js';

async function initDatabase() {
  console.log('🔄 Menghubungkan ke database dan menginisialisasi tabel...');
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS transactions (
        id VARCHAR(50) NOT NULL,
        description VARCHAR(255) NOT NULL,
        amount DECIMAL(15, 2) NOT NULL,
        type ENUM('pemasukan', 'pengeluaran') NOT NULL,
        category VARCHAR(100) NOT NULL,
        date DATE NOT NULL,
        created_at BIGINT NOT NULL,
        PRIMARY KEY (id),
        INDEX idx_date (date),
        INDEX idx_type (type),
        INDEX idx_category (category)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await pool.query(createTableQuery);
    console.log('✅ Tabel "transactions" berhasil dibuat atau sudah ada di database target!');

    // Cek apakah tabel kosong, jika kosong tambahkan sample data awal
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM transactions');
    if (rows[0].count === 0) {
      console.log('ℹ️ Tabel masih kosong, menambahkan data contoh awal...');
      const sampleQuery = `
        INSERT INTO transactions (id, description, amount, type, category, date, created_at) 
        VALUES 
        ('tx-init-1', 'Gaji Bulanan', 6500000.00, 'pemasukan', 'Gaji', CURDATE(), UNIX_TIMESTAMP() * 1000),
        ('tx-init-2', 'Belanja Supermarket', 650000.00, 'pengeluaran', 'Makanan', CURDATE(), UNIX_TIMESTAMP() * 1000)
      `;
      await pool.query(sampleQuery);
      console.log('✅ Data awal berhasil dimasukkan.');
    } else {
      console.log(`ℹ️ Tabel sudah berisi ${rows[0].count} data transaksi.`);
    }

    console.log('\n🎉 Setup Database selesai dan siap digunakan!');
  } catch (error) {
    console.error('❌ Gagal menginisialisasi database:', error.message);
  } finally {
    await pool.end();
  }
}

initDatabase();
