-- ==========================================================
-- Skema Database Catatan Keuangan
-- Kompatibel dengan MySQL 5.7+, MySQL 8.0+, dan MariaDB 10.x
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `catatan_keuangan` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `catatan_keuangan`;

-- Tabel Transaksi (Pemasukan & Pengeluaran)
CREATE TABLE IF NOT EXISTS `transactions` (
    `id` VARCHAR(50) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `type` ENUM('pemasukan', 'pengeluaran') NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `date` DATE NOT NULL,
    `created_at` BIGINT NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_date` (`date`),
    INDEX `idx_type` (`type`),
    INDEX `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Data Awal untuk Pengujian
INSERT INTO `transactions` (`id`, `description`, `amount`, `type`, `category`, `date`, `created_at`) 
VALUES 
('tx-init-1', 'Gaji Bulanan', 6500000.00, 'pemasukan', 'Gaji', CURDATE(), UNIX_TIMESTAMP() * 1000),
('tx-init-2', 'Belanja Supermarket', 650000.00, 'pengeluaran', 'Makanan', CURDATE(), UNIX_TIMESTAMP() * 1000)
ON DUPLICATE KEY UPDATE `description` = VALUES(`description`);
