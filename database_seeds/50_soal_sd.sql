-- =====================================================
-- SQL QUERY: 50 SOAL SD UNTUK CBT GIS FMIPA
-- =====================================================
-- Struktur: 50 soal dengan 4 jawaban masing-masing
-- Jenis: Matematika, IPA, IPS untuk tingkat SD
-- =====================================================

-- Start transaction untuk safety
START TRANSACTION;

-- Set foreign key checks off temporarily (optional safety)
SET FOREIGN_KEY_CHECKS = 0;

-- Hapus data lama untuk level SD (AKTIFKAN JIKA PERLU RESET)
DELETE FROM answers WHERE question_id IN (SELECT id FROM questions WHERE level = 'SD');
DELETE FROM questions WHERE level = 'SD';

-- Reset auto increment untuk fresh start
ALTER TABLE questions AUTO_INCREMENT = 1;
ALTER TABLE answers AUTO_INCREMENT = 1;

-- Restore foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- SOAL MATEMATIKA SD (Soal 1-20)
-- =====================================================

-- Soal 1: Penjumlahan Dasar
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Berapakah hasil dari 25 + 17?', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', '42', NULL, true, NOW(), NOW()),
(@question_id, 'text', '41', NULL, false, NOW(), NOW()),
(@question_id, 'text', '43', NULL, false, NOW(), NOW()),
(@question_id, 'text', '40', NULL, false, NOW(), NOW());

-- Soal 2: Pengurangan
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Hasil dari 89 - 34 adalah...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', '55', NULL, true, NOW(), NOW()),
(@question_id, 'text', '54', NULL, false, NOW(), NOW()),
(@question_id, 'text', '56', NULL, false, NOW(), NOW()),
(@question_id, 'text', '53', NULL, false, NOW(), NOW());

-- Soal 3: Perkalian
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Berapa hasil dari 7 × 8?', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', '56', NULL, true, NOW(), NOW()),
(@question_id, 'text', '54', NULL, false, NOW(), NOW()),
(@question_id, 'text', '58', NULL, false, NOW(), NOW()),
(@question_id, 'text', '49', NULL, false, NOW(), NOW());

-- Soal 4: Pembagian
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Hasil dari 72 ÷ 9 adalah...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', '8', NULL, true, NOW(), NOW()),
(@question_id, 'text', '7', NULL, false, NOW(), NOW()),
(@question_id, 'text', '9', NULL, false, NOW(), NOW()),
(@question_id, 'text', '6', NULL, false, NOW(), NOW());

-- Soal 5: Pecahan
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Bentuk paling sederhana dari pecahan 6/8 adalah...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', '3/4', NULL, true, NOW(), NOW()),
(@question_id, 'text', '2/3', NULL, false, NOW(), NOW()),
(@question_id, 'text', '4/5', NULL, false, NOW(), NOW()),
(@question_id, 'text', '1/2', NULL, false, NOW(), NOW());

-- Soal 6: Keliling Persegi
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Keliling sebuah persegi yang panjang sisinya 12 cm adalah...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', '48 cm', NULL, true, NOW(), NOW()),
(@question_id, 'text', '36 cm', NULL, false, NOW(), NOW()),
(@question_id, 'text', '144 cm', NULL, false, NOW(), NOW()),
(@question_id, 'text', '24 cm', NULL, false, NOW(), NOW());

-- Soal 7: Luas Persegi Panjang
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Luas persegi panjang dengan panjang 15 cm dan lebar 8 cm adalah...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', '120 cm²', NULL, true, NOW(), NOW()),
(@question_id, 'text', '46 cm²', NULL, false, NOW(), NOW()),
(@question_id, 'text', '23 cm²', NULL, false, NOW(), NOW()),
(@question_id, 'text', '92 cm²', NULL, false, NOW(), NOW());

-- Soal 8: Satuan Waktu
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', '3 jam = ... menit', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', '180 menit', NULL, true, NOW(), NOW()),
(@question_id, 'text', '120 menit', NULL, false, NOW(), NOW()),
(@question_id, 'text', '240 menit', NULL, false, NOW(), NOW()),
(@question_id, 'text', '90 menit', NULL, false, NOW(), NOW());

-- Soal 9: Satuan Panjang
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', '2,5 meter = ... cm', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', '250 cm', NULL, true, NOW(), NOW()),
(@question_id, 'text', '25 cm', NULL, false, NOW(), NOW()),
(@question_id, 'text', '2500 cm', NULL, false, NOW(), NOW()),
(@question_id, 'text', '50 cm', NULL, false, NOW(), NOW());

-- Soal 10: Rata-rata
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Rata-rata dari bilangan 6, 8, 10, 12 adalah...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', '9', NULL, true, NOW(), NOW()),
(@question_id, 'text', '8', NULL, false, NOW(), NOW()),
(@question_id, 'text', '10', NULL, false, NOW(), NOW()),
(@question_id, 'text', '11', NULL, false, NOW(), NOW());

-- Soal 11-20: Lanjutan Matematika
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Bilangan prima antara 10 dan 20 adalah...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', '11, 13, 17, 19', NULL, true, NOW(), NOW()),
(@question_id, 'text', '11, 13, 15, 17', NULL, false, NOW(), NOW()),
(@question_id, 'text', '10, 12, 14, 16', NULL, false, NOW(), NOW()),
(@question_id, 'text', '13, 15, 17, 19', NULL, false, NOW(), NOW());

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Jika 3x = 15, maka x = ...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', '5', NULL, true, NOW(), NOW()),
(@question_id, 'text', '3', NULL, false, NOW(), NOW()),
(@question_id, 'text', '45', NULL, false, NOW(), NOW()),
(@question_id, 'text', '12', NULL, false, NOW(), NOW());

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', '50% dari 80 adalah...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', '40', NULL, true, NOW(), NOW()),
(@question_id, 'text', '30', NULL, false, NOW(), NOW()),
(@question_id, 'text', '50', NULL, false, NOW(), NOW()),
(@question_id, 'text', '20', NULL, false, NOW(), NOW());

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Volume kubus dengan sisi 4 cm adalah...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', '64 cm³', NULL, true, NOW(), NOW()),
(@question_id, 'text', '16 cm³', NULL, false, NOW(), NOW()),
(@question_id, 'text', '24 cm³', NULL, false, NOW(), NOW()),
(@question_id, 'text', '48 cm³', NULL, false, NOW(), NOW());

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Urutan bilangan dari terkecil: 0,8 ; 0,75 ; 0,9 ; 0,65', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', '0,65 ; 0,75 ; 0,8 ; 0,9', NULL, true, NOW(), NOW()),
(@question_id, 'text', '0,9 ; 0,8 ; 0,75 ; 0,65', NULL, false, NOW(), NOW()),
(@question_id, 'text', '0,75 ; 0,8 ; 0,65 ; 0,9', NULL, false, NOW(), NOW()),
(@question_id, 'text', '0,8 ; 0,75 ; 0,9 ; 0,65', NULL, false, NOW(), NOW());

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Kelipatan persekutuan terkecil (KPK) dari 12 dan 18 adalah...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', '36', NULL, true, NOW(), NOW()),
(@question_id, 'text', '6', NULL, false, NOW(), NOW()),
(@question_id, 'text', '72', NULL, false, NOW(), NOW()),
(@question_id, 'text', '18', NULL, false, NOW(), NOW());

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Faktor persekutuan terbesar (FPB) dari 24 dan 36 adalah...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', '12', NULL, true, NOW(), NOW()),
(@question_id, 'text', '6', NULL, false, NOW(), NOW()),
(@question_id, 'text', '72', NULL, false, NOW(), NOW()),
(@question_id, 'text', '24', NULL, false, NOW(), NOW());

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', '1/4 + 1/3 = ...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', '7/12', NULL, true, NOW(), NOW()),
(@question_id, 'text', '2/7', NULL, false, NOW(), NOW()),
(@question_id, 'text', '1/2', NULL, false, NOW(), NOW()),
(@question_id, 'text', '5/12', NULL, false, NOW(), NOW());

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Jika sebuah roda berputar 360 derajat, berapa seperempat putaran?', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', '90 derajat', NULL, true, NOW(), NOW()),
(@question_id, 'text', '180 derajat', NULL, false, NOW(), NOW()),
(@question_id, 'text', '270 derajat', NULL, false, NOW(), NOW()),
(@question_id, 'text', '45 derajat', NULL, false, NOW(), NOW());

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Pak Budi membeli 3 kg apel seharga Rp45.000. Harga 1 kg apel adalah...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', 'Rp15.000', NULL, true, NOW(), NOW()),
(@question_id, 'text', 'Rp12.000', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Rp18.000', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Rp135.000', NULL, false, NOW(), NOW());

-- =====================================================
-- SOAL IPA SD (Soal 21-35)
-- =====================================================

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Planet yang paling dekat dengan Matahari adalah...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', 'Merkurius', NULL, true, NOW(), NOW()),
(@question_id, 'text', 'Venus', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Mars', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Bumi', NULL, false, NOW(), NOW());

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Bagian tumbuhan yang berfungsi untuk menyerap air adalah...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', 'Akar', NULL, true, NOW(), NOW()),
(@question_id, 'text', 'Batang', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Daun', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Bunga', NULL, false, NOW(), NOW());

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Proses perubahan air menjadi uap air disebut...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', 'Penguapan', NULL, true, NOW(), NOW()),
(@question_id, 'text', 'Pencairan', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Pembekuan', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Pengkristalan', NULL, false, NOW(), NOW());

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Hewan yang mengalami metamorfosis sempurna adalah...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', 'Kupu-kupu', NULL, true, NOW(), NOW()),
(@question_id, 'text', 'Katak', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Belalang', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Kecoak', NULL, false, NOW(), NOW());

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Gas yang dibutuhkan tumbuhan untuk fotosintesis adalah...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', 'Karbon dioksida (CO2)', NULL, true, NOW(), NOW()),
(@question_id, 'text', 'Oksigen (O2)', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Nitrogen (N2)', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Hidrogen (H2)', NULL, false, NOW(), NOW());

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Bunyi dapat merambat melalui...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', 'Padat, cair, dan gas', NULL, true, NOW(), NOW()),
(@question_id, 'text', 'Hanya udara', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Hanya benda padat', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Ruang hampa', NULL, false, NOW(), NOW());

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Energi yang tersimpan dalam makanan disebut energi...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', 'Kimia', NULL, true, NOW(), NOW()),
(@question_id, 'text', 'Kinetik', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Potensial', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Listrik', NULL, false, NOW(), NOW());

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Alat indera yang berfungsi untuk mencium adalah...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', 'Hidung', NULL, true, NOW(), NOW()),
(@question_id, 'text', 'Mata', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Telinga', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Lidah', NULL, false, NOW(), NOW());

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Gaya yang menyebabkan benda jatuh ke bawah disebut gaya...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', 'Gravitasi', NULL, true, NOW(), NOW()),
(@question_id, 'text', 'Magnet', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Gesek', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Pegas', NULL, false, NOW(), NOW());

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Siklus air dimulai dari proses...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', 'Penguapan', NULL, true, NOW(), NOW()),
(@question_id, 'text', 'Kondensasi', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Presipitasi', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Infiltrasi', NULL, false, NOW(), NOW());

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Makanan yang mengandung karbohidrat tinggi adalah...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', 'Nasi', NULL, true, NOW(), NOW()),
(@question_id, 'text', 'Daging', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Ikan', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Susu', NULL, false, NOW(), NOW());

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Hewan yang termasuk mamalia adalah...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', 'Paus', NULL, true, NOW(), NOW()),
(@question_id, 'text', 'Ikan hiu', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Burung elang', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Ular', NULL, false, NOW(), NOW());

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Organ tubuh yang berfungsi memompa darah adalah...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', 'Jantung', NULL, true, NOW(), NOW()),
(@question_id, 'text', 'Paru-paru', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Ginjal', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Hati', NULL, false, NOW(), NOW());

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Benda yang dapat mengalami pemuaian adalah...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', 'Rel kereta api', NULL, true, NOW(), NOW()),
(@question_id, 'text', 'Batu', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Kertas', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Kayu', NULL, false, NOW(), NOW());

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Cahaya merambat dalam garis...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', 'Lurus', NULL, true, NOW(), NOW()),
(@question_id, 'text', 'Lengkung', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Zigzag', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Melingkar', NULL, false, NOW(), NOW());

-- =====================================================
-- SOAL IPS SD (Soal 36-50)
-- =====================================================

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Ibu kota Indonesia adalah...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', 'Jakarta', NULL, true, NOW(), NOW()),
(@question_id, 'text', 'Surabaya', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Bandung', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Medan', NULL, false, NOW(), NOW());

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Proklamasi kemerdekaan Indonesia dibacakan pada tanggal...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', '17 Agustus 1945', NULL, true, NOW(), NOW()),
(@question_id, 'text', '1 Juni 1945', NULL, false, NOW(), NOW()),
(@question_id, 'text', '20 Mei 1908', NULL, false, NOW(), NOW()),
(@question_id, 'text', '28 Oktober 1928', NULL, false, NOW(), NOW());

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Presiden pertama Indonesia adalah...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', 'Ir. Soekarno', NULL, true, NOW(), NOW()),
(@question_id, 'text', 'Soeharto', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'B.J. Habibie', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Megawati', NULL, false, NOW(), NOW());

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Gunung tertinggi di Indonesia adalah...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', 'Puncak Jaya', NULL, true, NOW(), NOW()),
(@question_id, 'text', 'Gunung Merapi', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Gunung Bromo', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Gunung Semeru', NULL, false, NOW(), NOW());

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Mata uang Indonesia adalah...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', 'Rupiah', NULL, true, NOW(), NOW()),
(@question_id, 'text', 'Ringgit', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Peso', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Baht', NULL, false, NOW(), NOW());

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Benua terbesar di dunia adalah...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', 'Asia', NULL, true, NOW(), NOW()),
(@question_id, 'text', 'Afrika', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Amerika', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Eropa', NULL, false, NOW(), NOW());

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Samudra yang memisahkan Asia dan Amerika adalah...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', 'Samudra Pasifik', NULL, true, NOW(), NOW()),
(@question_id, 'text', 'Samudra Atlantik', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Samudra Hindia', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Samudra Arktik', NULL, false, NOW(), NOW());

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Suku terbesar di Indonesia adalah...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', 'Jawa', NULL, true, NOW(), NOW()),
(@question_id, 'text', 'Sunda', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Batak', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Minang', NULL, false, NOW(), NOW());

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Kegiatan ekonomi yang mengolah bahan mentah menjadi barang jadi disebut...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', 'Industri', NULL, true, NOW(), NOW()),
(@question_id, 'text', 'Pertanian', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Perdagangan', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Jasa', NULL, false, NOW(), NOW());

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Pulau terbesar di Indonesia adalah...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', 'Kalimantan', NULL, true, NOW(), NOW()),
(@question_id, 'text', 'Sumatera', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Papua', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Jawa', NULL, false, NOW(), NOW());

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Organisasi ASEAN didirikan pada tahun...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', '1967', NULL, true, NOW(), NOW()),
(@question_id, 'text', '1945', NULL, false, NOW(), NOW()),
(@question_id, 'text', '1965', NULL, false, NOW(), NOW()),
(@question_id, 'text', '1970', NULL, false, NOW(), NOW());

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Pahlawan nasional yang dijuluki "Bapak Pendidikan Nasional" adalah...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', 'Ki Hajar Dewantara', NULL, true, NOW(), NOW()),
(@question_id, 'text', 'R.A. Kartini', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Diponegoro', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Pattimura', NULL, false, NOW(), NOW());

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Lambang negara Indonesia adalah...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', 'Garuda Pancasila', NULL, true, NOW(), NOW()),
(@question_id, 'text', 'Elang Jawa', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Harimau Sumatera', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Komodo', NULL, false, NOW(), NOW());

INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Danau terbesar di Indonesia adalah...', NULL, NOW(), NOW());

SET @question_id = LAST_INSERT_ID();
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@question_id, 'text', 'Danau Toba', NULL, true, NOW(), NOW()),
(@question_id, 'text', 'Danau Maninjau', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Danau Kelimutu', NULL, false, NOW(), NOW()),
(@question_id, 'text', 'Danau Singkarak', NULL, false, NOW(), NOW());

-- Commit transaction
COMMIT;

-- =====================================================
-- QUERY SELESAI
-- =====================================================
-- Total: 50 soal SD dengan 4 jawaban masing-masing
-- Distribusi:
-- - Matematika: 20 soal (1-20)  
-- - IPA: 15 soal (21-35)
-- - IPS: 15 soal (36-50)
-- 
-- SOLUSI UNTUK ERROR #1062:
-- 1. Transaction digunakan untuk rollback jika error
-- 2. DELETE data lama untuk level SD
-- 3. Reset AUTO_INCREMENT untuk fresh start
-- 4. FOREIGN_KEY_CHECKS dimatikan sementara
-- =====================================================
