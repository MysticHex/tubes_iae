-- Membuat database perpus_db
CREATE DATABASE IF NOT EXISTS perpus_db;
USE perpus_db;

-- Tabel mahasiswa
CREATE TABLE IF NOT EXISTS mahasiswa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nim VARCHAR(20) NOT NULL UNIQUE,
  nama VARCHAR(100) NOT NULL,
  jurusan VARCHAR(50) NOT NULL,
  angkatan INT NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel buku
CREATE TABLE IF NOT EXISTS buku (
  id INT AUTO_INCREMENT PRIMARY KEY,
  isbn VARCHAR(20) NOT NULL UNIQUE,
  judul VARCHAR(255) NOT NULL,
  pengarang VARCHAR(100) NOT NULL,
  penerbit VARCHAR(100) NOT NULL,
  tahun_terbit INT NOT NULL,
  jumlah INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel peminjaman
CREATE TABLE IF NOT EXISTS peminjaman (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mahasiswa_id INT NOT NULL,
  buku_id INT NOT NULL,
  tanggal_pinjam DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  tanggal_kembali DATETIME,
  status ENUM('Dipinjam', 'Dikembalikan', 'Hilang') NOT NULL DEFAULT 'Dipinjam',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (mahasiswa_id) REFERENCES mahasiswa(id),
  FOREIGN KEY (buku_id) REFERENCES buku(id)
);

-- Data contoh mahasiswa
INSERT INTO mahasiswa (nim, nama, jurusan, angkatan, email) VALUES
('1101190001', 'John Doe', 'Teknik Informatika', 2019, 'john.doe@student.telkomuniversity.ac.id'),
('1101190002', 'Jane Smith', 'Sistem Informasi', 2019, 'jane.smith@student.telkomuniversity.ac.id'),
('1101200001', 'Budi Santoso', 'Teknik Elektro', 2020, 'budi.santoso@student.telkomuniversity.ac.id'),
('1101210001', 'Ani Wijaya', 'Desain Komunikasi Visual', 2021, 'ani.wijaya@student.telkomuniversity.ac.id');

-- Data contoh buku
INSERT INTO buku (isbn, judul, pengarang, penerbit, tahun_terbit, jumlah) VALUES
('978-623-00-1234-1', 'Pemrograman JavaScript Modern', 'Budi Raharjo', 'PT. Informatika', 2021, 10),
('978-602-8519-93-9', 'Clean Code: A Handbook of Agile Software Craftsmanship', 'Robert C. Martin', 'Prentice Hall', 2008, 5),
('978-979-29-6965-7', 'Database Systems: The Complete Book', 'Hector Garcia-Molina', 'Pearson', 2014, 7),
('978-013-2350-88-4', 'Design Patterns: Elements of Reusable Object-Oriented Software', 'Erich Gamma', 'Addison-Wesley', 1994, 3),
('978-161-7295-85-8', 'Microservices Patterns', 'Chris Richardson', 'Manning Publications', 2018, 4);

-- Data contoh peminjaman
INSERT INTO peminjaman (mahasiswa_id, buku_id, tanggal_pinjam, tanggal_kembali, status) VALUES
(1, 1, '2023-01-10 09:00:00', '2023-01-17 14:30:00', 'Dikembalikan'),
(1, 3, '2023-02-15 10:15:00', NULL, 'Dipinjam'),
(2, 2, '2023-03-05 11:20:00', '2023-03-12 16:45:00', 'Dikembalikan'),
(3, 4, '2023-03-20 13:30:00', NULL, 'Dipinjam');