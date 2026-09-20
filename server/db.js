import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const isAiven = process.env.DB_HOST?.includes('aivencloud.com');
const useSsl = process.env.DB_SSL === 'true' || isAiven;

// Pool koneksi MySQL - efisien untuk query banyak & siap untuk hosting / cloud
export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'catatan_keuangan',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: useSsl ? { rejectUnauthorized: false } : undefined,
});

export default pool;
