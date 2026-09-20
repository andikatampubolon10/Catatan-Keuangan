import pool from './db.js';

async function testDatabase() {
  console.log('--- Memulai Pengujian Koneksi Database MySQL ---');
  try {
    // 1. Cek Koneksi
    const [versionResult] = await pool.query('SELECT VERSION() as version');
    console.log('✅ Terhubung ke MySQL/MariaDB! Versi:', versionResult[0].version);

    // 2. Buat data transaksi uji coba
    const testId = 'tx-test-' + Date.now();
    const newTransaction = {
      id: testId,
      description: 'Uji Coba Transaksi Kopi Sore',
      amount: 35000,
      type: 'pengeluaran',
      category: 'Makanan',
      date: new Date().toISOString().slice(0, 10),
      created_at: Date.now()
    };

    console.log('\n--- Memasukkan Data Uji Coba ke Tabel transactions ---');
    console.log(newTransaction);

    await pool.query(
      `INSERT INTO transactions (id, description, amount, type, category, date, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        newTransaction.id,
        newTransaction.description,
        newTransaction.amount,
        newTransaction.type,
        newTransaction.category,
        newTransaction.date,
        newTransaction.created_at
      ]
    );
    console.log('✅ Data berhasil dimasukkan (INSERT) ke MySQL!');

    // 3. Baca kembali data yang baru saja dimasukkan
    console.log('\n--- Mengambil Kembali Data dari MySQL (SELECT) ---');
    const [rows] = await pool.query('SELECT * FROM transactions WHERE id = ?', [testId]);

    if (rows.length > 0) {
      console.log('✅ Data berhasil ditemukan di database:');
      console.table(rows);
    } else {
      console.error('❌ Data tidak ditemukan setelah dimasukkan.');
    }

    // 4. Hitung total data di database saat ini
    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM transactions');
    console.log(`\n📊 Total transaksi di database saat ini: ${countResult[0].total} baris.`);

  } catch (err) {
    console.error('❌ Terjadi kesalahan saat pengujian database:', err.message);
  } finally {
    await pool.end();
    console.log('\n--- Pengujian Selesai ---');
  }
}

testDatabase();
