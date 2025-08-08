-- =====================================================
-- SQL QUERY: 50 SOAL SD UNTUK CBT GIS FMIPA (NO DUPLICATE)
-- =====================================================
-- Versi aman yang menghindari duplicate key error
-- Menggunakan INSERT IGNORE untuk skip duplicate
-- =====================================================

-- Start transaction
START TRANSACTION;

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Optional: Clean existing SD data (uncomment if needed)
-- DELETE FROM answers WHERE question_id IN (SELECT id FROM questions WHERE level = 'SD');
-- DELETE FROM questions WHERE level = 'SD';

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- SOAL MATEMATIKA SD (Soal 1-20)
-- =====================================================

-- Soal 1: Penjumlahan Dasar
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Berapakah hasil dari 25 + 17?', NULL, NOW(), NOW());
SET @q1 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q1, 'text', '42', NULL, true, NOW(), NOW()),
(@q1, 'text', '41', NULL, false, NOW(), NOW()),
(@q1, 'text', '43', NULL, false, NOW(), NOW()),
(@q1, 'text', '40', NULL, false, NOW(), NOW());

-- Soal 2: Pengurangan
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Hasil dari 89 - 34 adalah...', NULL, NOW(), NOW());
SET @q2 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q2, 'text', '55', NULL, true, NOW(), NOW()),
(@q2, 'text', '54', NULL, false, NOW(), NOW()),
(@q2, 'text', '56', NULL, false, NOW(), NOW()),
(@q2, 'text', '53', NULL, false, NOW(), NOW());

-- Soal 3: Perkalian
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Berapa hasil dari 7 × 8?', NULL, NOW(), NOW());
SET @q3 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q3, 'text', '56', NULL, true, NOW(), NOW()),
(@q3, 'text', '54', NULL, false, NOW(), NOW()),
(@q3, 'text', '58', NULL, false, NOW(), NOW()),
(@q3, 'text', '49', NULL, false, NOW(), NOW());

-- Soal 4: Pembagian
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Hasil dari 72 ÷ 9 adalah...', NULL, NOW(), NOW());
SET @q4 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q4, 'text', '8', NULL, true, NOW(), NOW()),
(@q4, 'text', '7', NULL, false, NOW(), NOW()),
(@q4, 'text', '9', NULL, false, NOW(), NOW()),
(@q4, 'text', '6', NULL, false, NOW(), NOW());

-- Soal 5: Pecahan
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Bentuk paling sederhana dari pecahan 6/8 adalah...', NULL, NOW(), NOW());
SET @q5 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q5, 'text', '3/4', NULL, true, NOW(), NOW()),
(@q5, 'text', '2/3', NULL, false, NOW(), NOW()),
(@q5, 'text', '4/5', NULL, false, NOW(), NOW()),
(@q5, 'text', '1/2', NULL, false, NOW(), NOW());

-- Soal 6: Keliling Persegi
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Keliling sebuah persegi yang panjang sisinya 12 cm adalah...', NULL, NOW(), NOW());
SET @q6 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q6, 'text', '48 cm', NULL, true, NOW(), NOW()),
(@q6, 'text', '36 cm', NULL, false, NOW(), NOW()),
(@q6, 'text', '144 cm', NULL, false, NOW(), NOW()),
(@q6, 'text', '24 cm', NULL, false, NOW(), NOW());

-- Soal 7: Luas Persegi Panjang
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Luas persegi panjang dengan panjang 15 cm dan lebar 8 cm adalah...', NULL, NOW(), NOW());
SET @q7 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q7, 'text', '120 cm²', NULL, true, NOW(), NOW()),
(@q7, 'text', '46 cm²', NULL, false, NOW(), NOW()),
(@q7, 'text', '23 cm²', NULL, false, NOW(), NOW()),
(@q7, 'text', '92 cm²', NULL, false, NOW(), NOW());

-- Soal 8: Satuan Waktu
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', '3 jam = ... menit', NULL, NOW(), NOW());
SET @q8 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q8, 'text', '180 menit', NULL, true, NOW(), NOW()),
(@q8, 'text', '120 menit', NULL, false, NOW(), NOW()),
(@q8, 'text', '240 menit', NULL, false, NOW(), NOW()),
(@q8, 'text', '90 menit', NULL, false, NOW(), NOW());

-- Soal 9: Satuan Panjang
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', '2,5 meter = ... cm', NULL, NOW(), NOW());
SET @q9 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q9, 'text', '250 cm', NULL, true, NOW(), NOW()),
(@q9, 'text', '25 cm', NULL, false, NOW(), NOW()),
(@q9, 'text', '2500 cm', NULL, false, NOW(), NOW()),
(@q9, 'text', '50 cm', NULL, false, NOW(), NOW());

-- Soal 10: Rata-rata
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Rata-rata dari bilangan 6, 8, 10, 12 adalah...', NULL, NOW(), NOW());
SET @q10 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q10, 'text', '9', NULL, true, NOW(), NOW()),
(@q10, 'text', '8', NULL, false, NOW(), NOW()),
(@q10, 'text', '10', NULL, false, NOW(), NOW()),
(@q10, 'text', '11', NULL, false, NOW(), NOW());

-- Soal 11: Bilangan Prima
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Bilangan prima antara 10 dan 20 adalah...', NULL, NOW(), NOW());
SET @q11 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q11, 'text', '11, 13, 17, 19', NULL, true, NOW(), NOW()),
(@q11, 'text', '11, 13, 15, 17', NULL, false, NOW(), NOW()),
(@q11, 'text', '10, 12, 14, 16', NULL, false, NOW(), NOW()),
(@q11, 'text', '13, 15, 17, 19', NULL, false, NOW(), NOW());

-- Soal 12: Aljabar Sederhana
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Jika 3x = 15, maka x = ...', NULL, NOW(), NOW());
SET @q12 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q12, 'text', '5', NULL, true, NOW(), NOW()),
(@q12, 'text', '3', NULL, false, NOW(), NOW()),
(@q12, 'text', '45', NULL, false, NOW(), NOW()),
(@q12, 'text', '12', NULL, false, NOW(), NOW());

-- Soal 13: Persentase
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', '50% dari 80 adalah...', NULL, NOW(), NOW());
SET @q13 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q13, 'text', '40', NULL, true, NOW(), NOW()),
(@q13, 'text', '30', NULL, false, NOW(), NOW()),
(@q13, 'text', '50', NULL, false, NOW(), NOW()),
(@q13, 'text', '20', NULL, false, NOW(), NOW());

-- Soal 14: Volume Kubus
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Volume kubus dengan sisi 4 cm adalah...', NULL, NOW(), NOW());
SET @q14 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q14, 'text', '64 cm³', NULL, true, NOW(), NOW()),
(@q14, 'text', '16 cm³', NULL, false, NOW(), NOW()),
(@q14, 'text', '24 cm³', NULL, false, NOW(), NOW()),
(@q14, 'text', '48 cm³', NULL, false, NOW(), NOW());

-- Soal 15: Urutan Bilangan Desimal
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Urutan bilangan dari terkecil: 0,8 ; 0,75 ; 0,9 ; 0,65', NULL, NOW(), NOW());
SET @q15 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q15, 'text', '0,65 ; 0,75 ; 0,8 ; 0,9', NULL, true, NOW(), NOW()),
(@q15, 'text', '0,9 ; 0,8 ; 0,75 ; 0,65', NULL, false, NOW(), NOW()),
(@q15, 'text', '0,75 ; 0,8 ; 0,65 ; 0,9', NULL, false, NOW(), NOW()),
(@q15, 'text', '0,8 ; 0,75 ; 0,9 ; 0,65', NULL, false, NOW(), NOW());

-- Soal 16: KPK
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Kelipatan persekutuan terkecil (KPK) dari 12 dan 18 adalah...', NULL, NOW(), NOW());
SET @q16 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q16, 'text', '36', NULL, true, NOW(), NOW()),
(@q16, 'text', '6', NULL, false, NOW(), NOW()),
(@q16, 'text', '72', NULL, false, NOW(), NOW()),
(@q16, 'text', '18', NULL, false, NOW(), NOW());

-- Soal 17: FPB
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Faktor persekutuan terbesar (FPB) dari 24 dan 36 adalah...', NULL, NOW(), NOW());
SET @q17 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q17, 'text', '12', NULL, true, NOW(), NOW()),
(@q17, 'text', '6', NULL, false, NOW(), NOW()),
(@q17, 'text', '72', NULL, false, NOW(), NOW()),
(@q17, 'text', '24', NULL, false, NOW(), NOW());

-- Soal 18: Penjumlahan Pecahan
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', '1/4 + 1/3 = ...', NULL, NOW(), NOW());
SET @q18 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q18, 'text', '7/12', NULL, true, NOW(), NOW()),
(@q18, 'text', '2/7', NULL, false, NOW(), NOW()),
(@q18, 'text', '1/2', NULL, false, NOW(), NOW()),
(@q18, 'text', '5/12', NULL, false, NOW(), NOW());

-- Soal 19: Derajat Putaran
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Jika sebuah roda berputar 360 derajat, berapa seperempat putaran?', NULL, NOW(), NOW());
SET @q19 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q19, 'text', '90 derajat', NULL, true, NOW(), NOW()),
(@q19, 'text', '180 derajat', NULL, false, NOW(), NOW()),
(@q19, 'text', '270 derajat', NULL, false, NOW(), NOW()),
(@q19, 'text', '45 derajat', NULL, false, NOW(), NOW());

-- Soal 20: Soal Cerita
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Pak Budi membeli 3 kg apel seharga Rp45.000. Harga 1 kg apel adalah...', NULL, NOW(), NOW());
SET @q20 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q20, 'text', 'Rp15.000', NULL, true, NOW(), NOW()),
(@q20, 'text', 'Rp12.000', NULL, false, NOW(), NOW()),
(@q20, 'text', 'Rp18.000', NULL, false, NOW(), NOW()),
(@q20, 'text', 'Rp135.000', NULL, false, NOW(), NOW());

-- =====================================================
-- SOAL IPA SD (Soal 21-35)
-- =====================================================

-- Soal 21: Planet
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Planet yang paling dekat dengan Matahari adalah...', NULL, NOW(), NOW());
SET @q21 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q21, 'text', 'Merkurius', NULL, true, NOW(), NOW()),
(@q21, 'text', 'Venus', NULL, false, NOW(), NOW()),
(@q21, 'text', 'Mars', NULL, false, NOW(), NOW()),
(@q21, 'text', 'Bumi', NULL, false, NOW(), NOW());

-- Soal 22: Bagian Tumbuhan
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Bagian tumbuhan yang berfungsi untuk menyerap air adalah...', NULL, NOW(), NOW());
SET @q22 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q22, 'text', 'Akar', NULL, true, NOW(), NOW()),
(@q22, 'text', 'Batang', NULL, false, NOW(), NOW()),
(@q22, 'text', 'Daun', NULL, false, NOW(), NOW()),
(@q22, 'text', 'Bunga', NULL, false, NOW(), NOW());

-- Soal 23: Penguapan
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Proses perubahan air menjadi uap air disebut...', NULL, NOW(), NOW());
SET @q23 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q23, 'text', 'Penguapan', NULL, true, NOW(), NOW()),
(@q23, 'text', 'Pencairan', NULL, false, NOW(), NOW()),
(@q23, 'text', 'Pembekuan', NULL, false, NOW(), NOW()),
(@q23, 'text', 'Pengkristalan', NULL, false, NOW(), NOW());

-- Soal 24: Metamorfosis
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Hewan yang mengalami metamorfosis sempurna adalah...', NULL, NOW(), NOW());
SET @q24 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q24, 'text', 'Kupu-kupu', NULL, true, NOW(), NOW()),
(@q24, 'text', 'Katak', NULL, false, NOW(), NOW()),
(@q24, 'text', 'Belalang', NULL, false, NOW(), NOW()),
(@q24, 'text', 'Kecoak', NULL, false, NOW(), NOW());

-- Soal 25: Fotosintesis
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Gas yang dibutuhkan tumbuhan untuk fotosintesis adalah...', NULL, NOW(), NOW());
SET @q25 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q25, 'text', 'Karbon dioksida (CO2)', NULL, true, NOW(), NOW()),
(@q25, 'text', 'Oksigen (O2)', NULL, false, NOW(), NOW()),
(@q25, 'text', 'Nitrogen (N2)', NULL, false, NOW(), NOW()),
(@q25, 'text', 'Hidrogen (H2)', NULL, false, NOW(), NOW());

-- Soal 26: Bunyi
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Bunyi dapat merambat melalui...', NULL, NOW(), NOW());
SET @q26 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q26, 'text', 'Padat, cair, dan gas', NULL, true, NOW(), NOW()),
(@q26, 'text', 'Hanya udara', NULL, false, NOW(), NOW()),
(@q26, 'text', 'Hanya benda padat', NULL, false, NOW(), NOW()),
(@q26, 'text', 'Ruang hampa', NULL, false, NOW(), NOW());

-- Soal 27: Energi
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Energi yang tersimpan dalam makanan disebut energi...', NULL, NOW(), NOW());
SET @q27 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q27, 'text', 'Kimia', NULL, true, NOW(), NOW()),
(@q27, 'text', 'Kinetik', NULL, false, NOW(), NOW()),
(@q27, 'text', 'Potensial', NULL, false, NOW(), NOW()),
(@q27, 'text', 'Listrik', NULL, false, NOW(), NOW());

-- Soal 28: Alat Indera
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Alat indera yang berfungsi untuk mencium adalah...', NULL, NOW(), NOW());
SET @q28 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q28, 'text', 'Hidung', NULL, true, NOW(), NOW()),
(@q28, 'text', 'Mata', NULL, false, NOW(), NOW()),
(@q28, 'text', 'Telinga', NULL, false, NOW(), NOW()),
(@q28, 'text', 'Lidah', NULL, false, NOW(), NOW());

-- Soal 29: Gravitasi
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Gaya yang menyebabkan benda jatuh ke bawah disebut gaya...', NULL, NOW(), NOW());
SET @q29 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q29, 'text', 'Gravitasi', NULL, true, NOW(), NOW()),
(@q29, 'text', 'Magnet', NULL, false, NOW(), NOW()),
(@q29, 'text', 'Gesek', NULL, false, NOW(), NOW()),
(@q29, 'text', 'Pegas', NULL, false, NOW(), NOW());

-- Soal 30: Siklus Air
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Siklus air dimulai dari proses...', NULL, NOW(), NOW());
SET @q30 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q30, 'text', 'Penguapan', NULL, true, NOW(), NOW()),
(@q30, 'text', 'Kondensasi', NULL, false, NOW(), NOW()),
(@q30, 'text', 'Presipitasi', NULL, false, NOW(), NOW()),
(@q30, 'text', 'Infiltrasi', NULL, false, NOW(), NOW());

-- Soal 31: Karbohidrat
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Makanan yang mengandung karbohidrat tinggi adalah...', NULL, NOW(), NOW());
SET @q31 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q31, 'text', 'Nasi', NULL, true, NOW(), NOW()),
(@q31, 'text', 'Daging', NULL, false, NOW(), NOW()),
(@q31, 'text', 'Ikan', NULL, false, NOW(), NOW()),
(@q31, 'text', 'Susu', NULL, false, NOW(), NOW());

-- Soal 32: Mamalia
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Hewan yang termasuk mamalia adalah...', NULL, NOW(), NOW());
SET @q32 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q32, 'text', 'Paus', NULL, true, NOW(), NOW()),
(@q32, 'text', 'Ikan hiu', NULL, false, NOW(), NOW()),
(@q32, 'text', 'Burung elang', NULL, false, NOW(), NOW()),
(@q32, 'text', 'Ular', NULL, false, NOW(), NOW());

-- Soal 33: Jantung
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Organ tubuh yang berfungsi memompa darah adalah...', NULL, NOW(), NOW());
SET @q33 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q33, 'text', 'Jantung', NULL, true, NOW(), NOW()),
(@q33, 'text', 'Paru-paru', NULL, false, NOW(), NOW()),
(@q33, 'text', 'Ginjal', NULL, false, NOW(), NOW()),
(@q33, 'text', 'Hati', NULL, false, NOW(), NOW());

-- Soal 34: Pemuaian
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Benda yang dapat mengalami pemuaian adalah...', NULL, NOW(), NOW());
SET @q34 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q34, 'text', 'Rel kereta api', NULL, true, NOW(), NOW()),
(@q34, 'text', 'Batu', NULL, false, NOW(), NOW()),
(@q34, 'text', 'Kertas', NULL, false, NOW(), NOW()),
(@q34, 'text', 'Kayu', NULL, false, NOW(), NOW());

-- Soal 35: Cahaya
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Cahaya merambat dalam garis...', NULL, NOW(), NOW());
SET @q35 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q35, 'text', 'Lurus', NULL, true, NOW(), NOW()),
(@q35, 'text', 'Lengkung', NULL, false, NOW(), NOW()),
(@q35, 'text', 'Zigzag', NULL, false, NOW(), NOW()),
(@q35, 'text', 'Melingkar', NULL, false, NOW(), NOW());

-- =====================================================
-- SOAL IPS SD (Soal 36-50)
-- =====================================================

-- Soal 36: Ibu Kota Indonesia
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Ibu kota Indonesia adalah...', NULL, NOW(), NOW());
SET @q36 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q36, 'text', 'Jakarta', NULL, true, NOW(), NOW()),
(@q36, 'text', 'Surabaya', NULL, false, NOW(), NOW()),
(@q36, 'text', 'Bandung', NULL, false, NOW(), NOW()),
(@q36, 'text', 'Medan', NULL, false, NOW(), NOW());

-- Soal 37: Proklamasi
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Proklamasi kemerdekaan Indonesia dibacakan pada tanggal...', NULL, NOW(), NOW());
SET @q37 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q37, 'text', '17 Agustus 1945', NULL, true, NOW(), NOW()),
(@q37, 'text', '1 Juni 1945', NULL, false, NOW(), NOW()),
(@q37, 'text', '20 Mei 1908', NULL, false, NOW(), NOW()),
(@q37, 'text', '28 Oktober 1928', NULL, false, NOW(), NOW());

-- Soal 38: Presiden Pertama
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Presiden pertama Indonesia adalah...', NULL, NOW(), NOW());
SET @q38 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q38, 'text', 'Ir. Soekarno', NULL, true, NOW(), NOW()),
(@q38, 'text', 'Soeharto', NULL, false, NOW(), NOW()),
(@q38, 'text', 'B.J. Habibie', NULL, false, NOW(), NOW()),
(@q38, 'text', 'Megawati', NULL, false, NOW(), NOW());

-- Soal 39: Gunung Tertinggi
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Gunung tertinggi di Indonesia adalah...', NULL, NOW(), NOW());
SET @q39 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q39, 'text', 'Puncak Jaya', NULL, true, NOW(), NOW()),
(@q39, 'text', 'Gunung Merapi', NULL, false, NOW(), NOW()),
(@q39, 'text', 'Gunung Bromo', NULL, false, NOW(), NOW()),
(@q39, 'text', 'Gunung Semeru', NULL, false, NOW(), NOW());

-- Soal 40: Mata Uang
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Mata uang Indonesia adalah...', NULL, NOW(), NOW());
SET @q40 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q40, 'text', 'Rupiah', NULL, true, NOW(), NOW()),
(@q40, 'text', 'Ringgit', NULL, false, NOW(), NOW()),
(@q40, 'text', 'Peso', NULL, false, NOW(), NOW()),
(@q40, 'text', 'Baht', NULL, false, NOW(), NOW());

-- Soal 41: Benua Terbesar
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Benua terbesar di dunia adalah...', NULL, NOW(), NOW());
SET @q41 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q41, 'text', 'Asia', NULL, true, NOW(), NOW()),
(@q41, 'text', 'Afrika', NULL, false, NOW(), NOW()),
(@q41, 'text', 'Amerika', NULL, false, NOW(), NOW()),
(@q41, 'text', 'Eropa', NULL, false, NOW(), NOW());

-- Soal 42: Samudra Pasifik
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Samudra yang memisahkan Asia dan Amerika adalah...', NULL, NOW(), NOW());
SET @q42 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q42, 'text', 'Samudra Pasifik', NULL, true, NOW(), NOW()),
(@q42, 'text', 'Samudra Atlantik', NULL, false, NOW(), NOW()),
(@q42, 'text', 'Samudra Hindia', NULL, false, NOW(), NOW()),
(@q42, 'text', 'Samudra Arktik', NULL, false, NOW(), NOW());

-- Soal 43: Suku Jawa
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Suku terbesar di Indonesia adalah...', NULL, NOW(), NOW());
SET @q43 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q43, 'text', 'Jawa', NULL, true, NOW(), NOW()),
(@q43, 'text', 'Sunda', NULL, false, NOW(), NOW()),
(@q43, 'text', 'Batak', NULL, false, NOW(), NOW()),
(@q43, 'text', 'Minang', NULL, false, NOW(), NOW());

-- Soal 44: Industri
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Kegiatan ekonomi yang mengolah bahan mentah menjadi barang jadi disebut...', NULL, NOW(), NOW());
SET @q44 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q44, 'text', 'Industri', NULL, true, NOW(), NOW()),
(@q44, 'text', 'Pertanian', NULL, false, NOW(), NOW()),
(@q44, 'text', 'Perdagangan', NULL, false, NOW(), NOW()),
(@q44, 'text', 'Jasa', NULL, false, NOW(), NOW());

-- Soal 45: Pulau Kalimantan
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Pulau terbesar di Indonesia adalah...', NULL, NOW(), NOW());
SET @q45 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q45, 'text', 'Kalimantan', NULL, true, NOW(), NOW()),
(@q45, 'text', 'Sumatera', NULL, false, NOW(), NOW()),
(@q45, 'text', 'Papua', NULL, false, NOW(), NOW()),
(@q45, 'text', 'Jawa', NULL, false, NOW(), NOW());

-- Soal 46: ASEAN
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Organisasi ASEAN didirikan pada tahun...', NULL, NOW(), NOW());
SET @q46 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q46, 'text', '1967', NULL, true, NOW(), NOW()),
(@q46, 'text', '1945', NULL, false, NOW(), NOW()),
(@q46, 'text', '1965', NULL, false, NOW(), NOW()),
(@q46, 'text', '1970', NULL, false, NOW(), NOW());

-- Soal 47: Ki Hajar Dewantara
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Pahlawan nasional yang dijuluki "Bapak Pendidikan Nasional" adalah...', NULL, NOW(), NOW());
SET @q47 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q47, 'text', 'Ki Hajar Dewantara', NULL, true, NOW(), NOW()),
(@q47, 'text', 'R.A. Kartini', NULL, false, NOW(), NOW()),
(@q47, 'text', 'Diponegoro', NULL, false, NOW(), NOW()),
(@q47, 'text', 'Pattimura', NULL, false, NOW(), NOW());

-- Soal 48: Garuda Pancasila
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Lambang negara Indonesia adalah...', NULL, NOW(), NOW());
SET @q48 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q48, 'text', 'Garuda Pancasila', NULL, true, NOW(), NOW()),
(@q48, 'text', 'Elang Jawa', NULL, false, NOW(), NOW()),
(@q48, 'text', 'Harimau Sumatera', NULL, false, NOW(), NOW()),
(@q48, 'text', 'Komodo', NULL, false, NOW(), NOW());

-- Soal 49: Danau Toba
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Danau terbesar di Indonesia adalah...', NULL, NOW(), NOW());
SET @q49 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q49, 'text', 'Danau Toba', NULL, true, NOW(), NOW()),
(@q49, 'text', 'Danau Maninjau', NULL, false, NOW(), NOW()),
(@q49, 'text', 'Danau Kelimutu', NULL, false, NOW(), NOW()),
(@q49, 'text', 'Danau Singkarak', NULL, false, NOW(), NOW());

-- Soal 50: Pancasila
INSERT IGNORE INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Dasar negara Indonesia adalah...', NULL, NOW(), NOW());
SET @q50 = LAST_INSERT_ID();
INSERT IGNORE INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(@q50, 'text', 'Pancasila', NULL, true, NOW(), NOW()),
(@q50, 'text', 'UUD 1945', NULL, false, NOW(), NOW()),
(@q50, 'text', 'Bhinneka Tunggal Ika', NULL, false, NOW(), NOW()),
(@q50, 'text', 'NKRI', NULL, false, NOW(), NOW());

-- Commit transaction
COMMIT;

-- =====================================================
-- QUERY SELESAI - NO DUPLICATE VERSION
-- =====================================================
-- Total: 50 soal SD dengan 4 jawaban masing-masing
-- Distribusi:
-- - Matematika: 20 soal (1-20)  
-- - IPA: 15 soal (21-35)
-- - IPS: 15 soal (36-50)
-- 
-- FITUR KEAMANAN:
-- 1. INSERT IGNORE - skip duplicate entries
-- 2. Unique variable names (@q1, @q2, dll)
-- 3. Transaction block untuk rollback safety
-- 4. Foreign key checks management
-- 5. Optional clean data section
-- =====================================================
