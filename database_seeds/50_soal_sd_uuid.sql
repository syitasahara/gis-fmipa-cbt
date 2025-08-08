-- =====================================================
-- SQL QUERY: 50 SOAL SD UNTUK CBT GIS FMIPA (UUID VERSION)
-- =====================================================
-- Versi untuk primary key UUID
-- Menggunakan UUID() function untuk generate unique ID
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
SET @q1_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q1_uuid, 'SD', 'text', 'Berapakah hasil dari 25 + 17?', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q1_uuid, 'text', '42', NULL, true, NOW(), NOW()),
(UUID(), @q1_uuid, 'text', '41', NULL, false, NOW(), NOW()),
(UUID(), @q1_uuid, 'text', '43', NULL, false, NOW(), NOW()),
(UUID(), @q1_uuid, 'text', '40', NULL, false, NOW(), NOW());

-- Soal 2: Pengurangan
SET @q2_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q2_uuid, 'SD', 'text', 'Hasil dari 89 - 34 adalah...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q2_uuid, 'text', '55', NULL, true, NOW(), NOW()),
(UUID(), @q2_uuid, 'text', '54', NULL, false, NOW(), NOW()),
(UUID(), @q2_uuid, 'text', '56', NULL, false, NOW(), NOW()),
(UUID(), @q2_uuid, 'text', '53', NULL, false, NOW(), NOW());

-- Soal 3: Perkalian
SET @q3_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q3_uuid, 'SD', 'text', 'Berapa hasil dari 7 × 8?', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q3_uuid, 'text', '56', NULL, true, NOW(), NOW()),
(UUID(), @q3_uuid, 'text', '54', NULL, false, NOW(), NOW()),
(UUID(), @q3_uuid, 'text', '58', NULL, false, NOW(), NOW()),
(UUID(), @q3_uuid, 'text', '49', NULL, false, NOW(), NOW());

-- Soal 4: Pembagian
SET @q4_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q4_uuid, 'SD', 'text', 'Hasil dari 72 ÷ 9 adalah...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q4_uuid, 'text', '8', NULL, true, NOW(), NOW()),
(UUID(), @q4_uuid, 'text', '7', NULL, false, NOW(), NOW()),
(UUID(), @q4_uuid, 'text', '9', NULL, false, NOW(), NOW()),
(UUID(), @q4_uuid, 'text', '6', NULL, false, NOW(), NOW());

-- Soal 5: Pecahan
SET @q5_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q5_uuid, 'SD', 'text', 'Bentuk paling sederhana dari pecahan 6/8 adalah...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q5_uuid, 'text', '3/4', NULL, true, NOW(), NOW()),
(UUID(), @q5_uuid, 'text', '2/3', NULL, false, NOW(), NOW()),
(UUID(), @q5_uuid, 'text', '4/5', NULL, false, NOW(), NOW()),
(UUID(), @q5_uuid, 'text', '1/2', NULL, false, NOW(), NOW());

-- Soal 6: Keliling Persegi
SET @q6_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q6_uuid, 'SD', 'text', 'Keliling sebuah persegi yang panjang sisinya 12 cm adalah...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q6_uuid, 'text', '48 cm', NULL, true, NOW(), NOW()),
(UUID(), @q6_uuid, 'text', '36 cm', NULL, false, NOW(), NOW()),
(UUID(), @q6_uuid, 'text', '144 cm', NULL, false, NOW(), NOW()),
(UUID(), @q6_uuid, 'text', '24 cm', NULL, false, NOW(), NOW());

-- Soal 7: Luas Persegi Panjang
SET @q7_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q7_uuid, 'SD', 'text', 'Luas persegi panjang dengan panjang 15 cm dan lebar 8 cm adalah...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q7_uuid, 'text', '120 cm²', NULL, true, NOW(), NOW()),
(UUID(), @q7_uuid, 'text', '46 cm²', NULL, false, NOW(), NOW()),
(UUID(), @q7_uuid, 'text', '23 cm²', NULL, false, NOW(), NOW()),
(UUID(), @q7_uuid, 'text', '92 cm²', NULL, false, NOW(), NOW());

-- Soal 8: Satuan Waktu
SET @q8_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q8_uuid, 'SD', 'text', '3 jam = ... menit', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q8_uuid, 'text', '180 menit', NULL, true, NOW(), NOW()),
(UUID(), @q8_uuid, 'text', '120 menit', NULL, false, NOW(), NOW()),
(UUID(), @q8_uuid, 'text', '240 menit', NULL, false, NOW(), NOW()),
(UUID(), @q8_uuid, 'text', '90 menit', NULL, false, NOW(), NOW());

-- Soal 9: Satuan Panjang
SET @q9_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q9_uuid, 'SD', 'text', '2,5 meter = ... cm', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q9_uuid, 'text', '250 cm', NULL, true, NOW(), NOW()),
(UUID(), @q9_uuid, 'text', '25 cm', NULL, false, NOW(), NOW()),
(UUID(), @q9_uuid, 'text', '2500 cm', NULL, false, NOW(), NOW()),
(UUID(), @q9_uuid, 'text', '50 cm', NULL, false, NOW(), NOW());

-- Soal 10: Rata-rata
SET @q10_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q10_uuid, 'SD', 'text', 'Rata-rata dari bilangan 6, 8, 10, 12 adalah...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q10_uuid, 'text', '9', NULL, true, NOW(), NOW()),
(UUID(), @q10_uuid, 'text', '8', NULL, false, NOW(), NOW()),
(UUID(), @q10_uuid, 'text', '10', NULL, false, NOW(), NOW()),
(UUID(), @q10_uuid, 'text', '11', NULL, false, NOW(), NOW());

-- Soal 11: Bilangan Prima
SET @q11_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q11_uuid, 'SD', 'text', 'Bilangan prima antara 10 dan 20 adalah...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q11_uuid, 'text', '11, 13, 17, 19', NULL, true, NOW(), NOW()),
(UUID(), @q11_uuid, 'text', '11, 13, 15, 17', NULL, false, NOW(), NOW()),
(UUID(), @q11_uuid, 'text', '10, 12, 14, 16', NULL, false, NOW(), NOW()),
(UUID(), @q11_uuid, 'text', '13, 15, 17, 19', NULL, false, NOW(), NOW());

-- Soal 12: Aljabar Sederhana
SET @q12_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q12_uuid, 'SD', 'text', 'Jika 3x = 15, maka x = ...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q12_uuid, 'text', '5', NULL, true, NOW(), NOW()),
(UUID(), @q12_uuid, 'text', '3', NULL, false, NOW(), NOW()),
(UUID(), @q12_uuid, 'text', '45', NULL, false, NOW(), NOW()),
(UUID(), @q12_uuid, 'text', '12', NULL, false, NOW(), NOW());

-- Soal 13: Persentase
SET @q13_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q13_uuid, 'SD', 'text', '50% dari 80 adalah...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q13_uuid, 'text', '40', NULL, true, NOW(), NOW()),
(UUID(), @q13_uuid, 'text', '30', NULL, false, NOW(), NOW()),
(UUID(), @q13_uuid, 'text', '50', NULL, false, NOW(), NOW()),
(UUID(), @q13_uuid, 'text', '20', NULL, false, NOW(), NOW());

-- Soal 14: Volume Kubus
SET @q14_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q14_uuid, 'SD', 'text', 'Volume kubus dengan sisi 4 cm adalah...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q14_uuid, 'text', '64 cm³', NULL, true, NOW(), NOW()),
(UUID(), @q14_uuid, 'text', '16 cm³', NULL, false, NOW(), NOW()),
(UUID(), @q14_uuid, 'text', '24 cm³', NULL, false, NOW(), NOW()),
(UUID(), @q14_uuid, 'text', '48 cm³', NULL, false, NOW(), NOW());

-- Soal 15: Urutan Bilangan Desimal
SET @q15_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q15_uuid, 'SD', 'text', 'Urutan bilangan dari terkecil: 0,8 ; 0,75 ; 0,9 ; 0,65', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q15_uuid, 'text', '0,65 ; 0,75 ; 0,8 ; 0,9', NULL, true, NOW(), NOW()),
(UUID(), @q15_uuid, 'text', '0,9 ; 0,8 ; 0,75 ; 0,65', NULL, false, NOW(), NOW()),
(UUID(), @q15_uuid, 'text', '0,75 ; 0,8 ; 0,65 ; 0,9', NULL, false, NOW(), NOW()),
(UUID(), @q15_uuid, 'text', '0,8 ; 0,75 ; 0,9 ; 0,65', NULL, false, NOW(), NOW());

-- Soal 16: KPK
SET @q16_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q16_uuid, 'SD', 'text', 'Kelipatan persekutuan terkecil (KPK) dari 12 dan 18 adalah...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q16_uuid, 'text', '36', NULL, true, NOW(), NOW()),
(UUID(), @q16_uuid, 'text', '6', NULL, false, NOW(), NOW()),
(UUID(), @q16_uuid, 'text', '72', NULL, false, NOW(), NOW()),
(UUID(), @q16_uuid, 'text', '18', NULL, false, NOW(), NOW());

-- Soal 17: FPB
SET @q17_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q17_uuid, 'SD', 'text', 'Faktor persekutuan terbesar (FPB) dari 24 dan 36 adalah...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q17_uuid, 'text', '12', NULL, true, NOW(), NOW()),
(UUID(), @q17_uuid, 'text', '6', NULL, false, NOW(), NOW()),
(UUID(), @q17_uuid, 'text', '72', NULL, false, NOW(), NOW()),
(UUID(), @q17_uuid, 'text', '24', NULL, false, NOW(), NOW());

-- Soal 18: Penjumlahan Pecahan
SET @q18_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q18_uuid, 'SD', 'text', '1/4 + 1/3 = ...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q18_uuid, 'text', '7/12', NULL, true, NOW(), NOW()),
(UUID(), @q18_uuid, 'text', '2/7', NULL, false, NOW(), NOW()),
(UUID(), @q18_uuid, 'text', '1/2', NULL, false, NOW(), NOW()),
(UUID(), @q18_uuid, 'text', '5/12', NULL, false, NOW(), NOW());

-- Soal 19: Derajat Putaran
SET @q19_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q19_uuid, 'SD', 'text', 'Jika sebuah roda berputar 360 derajat, berapa seperempat putaran?', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q19_uuid, 'text', '90 derajat', NULL, true, NOW(), NOW()),
(UUID(), @q19_uuid, 'text', '180 derajat', NULL, false, NOW(), NOW()),
(UUID(), @q19_uuid, 'text', '270 derajat', NULL, false, NOW(), NOW()),
(UUID(), @q19_uuid, 'text', '45 derajat', NULL, false, NOW(), NOW());

-- Soal 20: Soal Cerita
SET @q20_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q20_uuid, 'SD', 'text', 'Pak Budi membeli 3 kg apel seharga Rp45.000. Harga 1 kg apel adalah...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q20_uuid, 'text', 'Rp15.000', NULL, true, NOW(), NOW()),
(UUID(), @q20_uuid, 'text', 'Rp12.000', NULL, false, NOW(), NOW()),
(UUID(), @q20_uuid, 'text', 'Rp18.000', NULL, false, NOW(), NOW()),
(UUID(), @q20_uuid, 'text', 'Rp135.000', NULL, false, NOW(), NOW());

-- =====================================================
-- SOAL IPA SD (Soal 21-35)
-- =====================================================

-- Soal 21: Planet
SET @q21_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q21_uuid, 'SD', 'text', 'Planet yang paling dekat dengan Matahari adalah...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q21_uuid, 'text', 'Merkurius', NULL, true, NOW(), NOW()),
(UUID(), @q21_uuid, 'text', 'Venus', NULL, false, NOW(), NOW()),
(UUID(), @q21_uuid, 'text', 'Mars', NULL, false, NOW(), NOW()),
(UUID(), @q21_uuid, 'text', 'Bumi', NULL, false, NOW(), NOW());

-- Soal 22: Bagian Tumbuhan
SET @q22_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q22_uuid, 'SD', 'text', 'Bagian tumbuhan yang berfungsi untuk menyerap air adalah...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q22_uuid, 'text', 'Akar', NULL, true, NOW(), NOW()),
(UUID(), @q22_uuid, 'text', 'Batang', NULL, false, NOW(), NOW()),
(UUID(), @q22_uuid, 'text', 'Daun', NULL, false, NOW(), NOW()),
(UUID(), @q22_uuid, 'text', 'Bunga', NULL, false, NOW(), NOW());

-- Soal 23: Penguapan
SET @q23_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q23_uuid, 'SD', 'text', 'Proses perubahan air menjadi uap air disebut...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q23_uuid, 'text', 'Penguapan', NULL, true, NOW(), NOW()),
(UUID(), @q23_uuid, 'text', 'Pencairan', NULL, false, NOW(), NOW()),
(UUID(), @q23_uuid, 'text', 'Pembekuan', NULL, false, NOW(), NOW()),
(UUID(), @q23_uuid, 'text', 'Pengkristalan', NULL, false, NOW(), NOW());

-- Soal 24: Metamorfosis
SET @q24_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q24_uuid, 'SD', 'text', 'Hewan yang mengalami metamorfosis sempurna adalah...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q24_uuid, 'text', 'Kupu-kupu', NULL, true, NOW(), NOW()),
(UUID(), @q24_uuid, 'text', 'Katak', NULL, false, NOW(), NOW()),
(UUID(), @q24_uuid, 'text', 'Belalang', NULL, false, NOW(), NOW()),
(UUID(), @q24_uuid, 'text', 'Kecoak', NULL, false, NOW(), NOW());

-- Soal 25: Fotosintesis
SET @q25_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q25_uuid, 'SD', 'text', 'Gas yang dibutuhkan tumbuhan untuk fotosintesis adalah...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q25_uuid, 'text', 'Karbon dioksida (CO2)', NULL, true, NOW(), NOW()),
(UUID(), @q25_uuid, 'text', 'Oksigen (O2)', NULL, false, NOW(), NOW()),
(UUID(), @q25_uuid, 'text', 'Nitrogen (N2)', NULL, false, NOW(), NOW()),
(UUID(), @q25_uuid, 'text', 'Hidrogen (H2)', NULL, false, NOW(), NOW());

-- Soal 26: Bunyi
SET @q26_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q26_uuid, 'SD', 'text', 'Bunyi dapat merambat melalui...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q26_uuid, 'text', 'Padat, cair, dan gas', NULL, true, NOW(), NOW()),
(UUID(), @q26_uuid, 'text', 'Hanya udara', NULL, false, NOW(), NOW()),
(UUID(), @q26_uuid, 'text', 'Hanya benda padat', NULL, false, NOW(), NOW()),
(UUID(), @q26_uuid, 'text', 'Ruang hampa', NULL, false, NOW(), NOW());

-- Soal 27: Energi
SET @q27_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q27_uuid, 'SD', 'text', 'Energi yang tersimpan dalam makanan disebut energi...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q27_uuid, 'text', 'Kimia', NULL, true, NOW(), NOW()),
(UUID(), @q27_uuid, 'text', 'Kinetik', NULL, false, NOW(), NOW()),
(UUID(), @q27_uuid, 'text', 'Potensial', NULL, false, NOW(), NOW()),
(UUID(), @q27_uuid, 'text', 'Listrik', NULL, false, NOW(), NOW());

-- Soal 28: Alat Indera
SET @q28_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q28_uuid, 'SD', 'text', 'Alat indera yang berfungsi untuk mencium adalah...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q28_uuid, 'text', 'Hidung', NULL, true, NOW(), NOW()),
(UUID(), @q28_uuid, 'text', 'Mata', NULL, false, NOW(), NOW()),
(UUID(), @q28_uuid, 'text', 'Telinga', NULL, false, NOW(), NOW()),
(UUID(), @q28_uuid, 'text', 'Lidah', NULL, false, NOW(), NOW());

-- Soal 29: Gravitasi
SET @q29_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q29_uuid, 'SD', 'text', 'Gaya yang menyebabkan benda jatuh ke bawah disebut gaya...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q29_uuid, 'text', 'Gravitasi', NULL, true, NOW(), NOW()),
(UUID(), @q29_uuid, 'text', 'Magnet', NULL, false, NOW(), NOW()),
(UUID(), @q29_uuid, 'text', 'Gesek', NULL, false, NOW(), NOW()),
(UUID(), @q29_uuid, 'text', 'Pegas', NULL, false, NOW(), NOW());

-- Soal 30: Siklus Air
SET @q30_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q30_uuid, 'SD', 'text', 'Siklus air dimulai dari proses...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q30_uuid, 'text', 'Penguapan', NULL, true, NOW(), NOW()),
(UUID(), @q30_uuid, 'text', 'Kondensasi', NULL, false, NOW(), NOW()),
(UUID(), @q30_uuid, 'text', 'Presipitasi', NULL, false, NOW(), NOW()),
(UUID(), @q30_uuid, 'text', 'Infiltrasi', NULL, false, NOW(), NOW());

-- Soal 31: Karbohidrat
SET @q31_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q31_uuid, 'SD', 'text', 'Makanan yang mengandung karbohidrat tinggi adalah...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q31_uuid, 'text', 'Nasi', NULL, true, NOW(), NOW()),
(UUID(), @q31_uuid, 'text', 'Daging', NULL, false, NOW(), NOW()),
(UUID(), @q31_uuid, 'text', 'Ikan', NULL, false, NOW(), NOW()),
(UUID(), @q31_uuid, 'text', 'Susu', NULL, false, NOW(), NOW());

-- Soal 32: Mamalia
SET @q32_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q32_uuid, 'SD', 'text', 'Hewan yang termasuk mamalia adalah...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q32_uuid, 'text', 'Paus', NULL, true, NOW(), NOW()),
(UUID(), @q32_uuid, 'text', 'Ikan hiu', NULL, false, NOW(), NOW()),
(UUID(), @q32_uuid, 'text', 'Burung elang', NULL, false, NOW(), NOW()),
(UUID(), @q32_uuid, 'text', 'Ular', NULL, false, NOW(), NOW());

-- Soal 33: Jantung
SET @q33_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q33_uuid, 'SD', 'text', 'Organ tubuh yang berfungsi memompa darah adalah...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q33_uuid, 'text', 'Jantung', NULL, true, NOW(), NOW()),
(UUID(), @q33_uuid, 'text', 'Paru-paru', NULL, false, NOW(), NOW()),
(UUID(), @q33_uuid, 'text', 'Ginjal', NULL, false, NOW(), NOW()),
(UUID(), @q33_uuid, 'text', 'Hati', NULL, false, NOW(), NOW());

-- Soal 34: Pemuaian
SET @q34_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q34_uuid, 'SD', 'text', 'Benda yang dapat mengalami pemuaian adalah...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q34_uuid, 'text', 'Rel kereta api', NULL, true, NOW(), NOW()),
(UUID(), @q34_uuid, 'text', 'Batu', NULL, false, NOW(), NOW()),
(UUID(), @q34_uuid, 'text', 'Kertas', NULL, false, NOW(), NOW()),
(UUID(), @q34_uuid, 'text', 'Kayu', NULL, false, NOW(), NOW());

-- Soal 35: Cahaya
SET @q35_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q35_uuid, 'SD', 'text', 'Cahaya merambat dalam garis...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q35_uuid, 'text', 'Lurus', NULL, true, NOW(), NOW()),
(UUID(), @q35_uuid, 'text', 'Lengkung', NULL, false, NOW(), NOW()),
(UUID(), @q35_uuid, 'text', 'Zigzag', NULL, false, NOW(), NOW()),
(UUID(), @q35_uuid, 'text', 'Melingkar', NULL, false, NOW(), NOW());

-- =====================================================
-- SOAL IPS SD (Soal 36-50)
-- =====================================================

-- Soal 36: Ibu Kota Indonesia
SET @q36_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q36_uuid, 'SD', 'text', 'Ibu kota Indonesia adalah...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q36_uuid, 'text', 'Jakarta', NULL, true, NOW(), NOW()),
(UUID(), @q36_uuid, 'text', 'Surabaya', NULL, false, NOW(), NOW()),
(UUID(), @q36_uuid, 'text', 'Bandung', NULL, false, NOW(), NOW()),
(UUID(), @q36_uuid, 'text', 'Medan', NULL, false, NOW(), NOW());

-- Soal 37: Proklamasi
SET @q37_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q37_uuid, 'SD', 'text', 'Proklamasi kemerdekaan Indonesia dibacakan pada tanggal...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q37_uuid, 'text', '17 Agustus 1945', NULL, true, NOW(), NOW()),
(UUID(), @q37_uuid, 'text', '1 Juni 1945', NULL, false, NOW(), NOW()),
(UUID(), @q37_uuid, 'text', '20 Mei 1908', NULL, false, NOW(), NOW()),
(UUID(), @q37_uuid, 'text', '28 Oktober 1928', NULL, false, NOW(), NOW());

-- Soal 38: Presiden Pertama
SET @q38_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q38_uuid, 'SD', 'text', 'Presiden pertama Indonesia adalah...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q38_uuid, 'text', 'Ir. Soekarno', NULL, true, NOW(), NOW()),
(UUID(), @q38_uuid, 'text', 'Soeharto', NULL, false, NOW(), NOW()),
(UUID(), @q38_uuid, 'text', 'B.J. Habibie', NULL, false, NOW(), NOW()),
(UUID(), @q38_uuid, 'text', 'Megawati', NULL, false, NOW(), NOW());

-- Soal 39: Gunung Tertinggi
SET @q39_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q39_uuid, 'SD', 'text', 'Gunung tertinggi di Indonesia adalah...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q39_uuid, 'text', 'Puncak Jaya', NULL, true, NOW(), NOW()),
(UUID(), @q39_uuid, 'text', 'Gunung Merapi', NULL, false, NOW(), NOW()),
(UUID(), @q39_uuid, 'text', 'Gunung Bromo', NULL, false, NOW(), NOW()),
(UUID(), @q39_uuid, 'text', 'Gunung Semeru', NULL, false, NOW(), NOW());

-- Soal 40: Mata Uang
SET @q40_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q40_uuid, 'SD', 'text', 'Mata uang Indonesia adalah...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q40_uuid, 'text', 'Rupiah', NULL, true, NOW(), NOW()),
(UUID(), @q40_uuid, 'text', 'Ringgit', NULL, false, NOW(), NOW()),
(UUID(), @q40_uuid, 'text', 'Peso', NULL, false, NOW(), NOW()),
(UUID(), @q40_uuid, 'text', 'Baht', NULL, false, NOW(), NOW());

-- Soal 41: Benua Terbesar
SET @q41_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q41_uuid, 'SD', 'text', 'Benua terbesar di dunia adalah...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q41_uuid, 'text', 'Asia', NULL, true, NOW(), NOW()),
(UUID(), @q41_uuid, 'text', 'Afrika', NULL, false, NOW(), NOW()),
(UUID(), @q41_uuid, 'text', 'Amerika', NULL, false, NOW(), NOW()),
(UUID(), @q41_uuid, 'text', 'Eropa', NULL, false, NOW(), NOW());

-- Soal 42: Samudra Pasifik
SET @q42_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q42_uuid, 'SD', 'text', 'Samudra yang memisahkan Asia dan Amerika adalah...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q42_uuid, 'text', 'Samudra Pasifik', NULL, true, NOW(), NOW()),
(UUID(), @q42_uuid, 'text', 'Samudra Atlantik', NULL, false, NOW(), NOW()),
(UUID(), @q42_uuid, 'text', 'Samudra Hindia', NULL, false, NOW(), NOW()),
(UUID(), @q42_uuid, 'text', 'Samudra Arktik', NULL, false, NOW(), NOW());

-- Soal 43: Suku Jawa
SET @q43_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q43_uuid, 'SD', 'text', 'Suku terbesar di Indonesia adalah...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q43_uuid, 'text', 'Jawa', NULL, true, NOW(), NOW()),
(UUID(), @q43_uuid, 'text', 'Sunda', NULL, false, NOW(), NOW()),
(UUID(), @q43_uuid, 'text', 'Batak', NULL, false, NOW(), NOW()),
(UUID(), @q43_uuid, 'text', 'Minang', NULL, false, NOW(), NOW());

-- Soal 44: Industri
SET @q44_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q44_uuid, 'SD', 'text', 'Kegiatan ekonomi yang mengolah bahan mentah menjadi barang jadi disebut...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q44_uuid, 'text', 'Industri', NULL, true, NOW(), NOW()),
(UUID(), @q44_uuid, 'text', 'Pertanian', NULL, false, NOW(), NOW()),
(UUID(), @q44_uuid, 'text', 'Perdagangan', NULL, false, NOW(), NOW()),
(UUID(), @q44_uuid, 'text', 'Jasa', NULL, false, NOW(), NOW());

-- Soal 45: Pulau Kalimantan
SET @q45_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q45_uuid, 'SD', 'text', 'Pulau terbesar di Indonesia adalah...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q45_uuid, 'text', 'Kalimantan', NULL, true, NOW(), NOW()),
(UUID(), @q45_uuid, 'text', 'Sumatera', NULL, false, NOW(), NOW()),
(UUID(), @q45_uuid, 'text', 'Papua', NULL, false, NOW(), NOW()),
(UUID(), @q45_uuid, 'text', 'Jawa', NULL, false, NOW(), NOW());

-- Soal 46: ASEAN
SET @q46_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q46_uuid, 'SD', 'text', 'Organisasi ASEAN didirikan pada tahun...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q46_uuid, 'text', '1967', NULL, true, NOW(), NOW()),
(UUID(), @q46_uuid, 'text', '1945', NULL, false, NOW(), NOW()),
(UUID(), @q46_uuid, 'text', '1965', NULL, false, NOW(), NOW()),
(UUID(), @q46_uuid, 'text', '1970', NULL, false, NOW(), NOW());

-- Soal 47: Ki Hajar Dewantara
SET @q47_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q47_uuid, 'SD', 'text', 'Pahlawan nasional yang dijuluki "Bapak Pendidikan Nasional" adalah...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q47_uuid, 'text', 'Ki Hajar Dewantara', NULL, true, NOW(), NOW()),
(UUID(), @q47_uuid, 'text', 'R.A. Kartini', NULL, false, NOW(), NOW()),
(UUID(), @q47_uuid, 'text', 'Diponegoro', NULL, false, NOW(), NOW()),
(UUID(), @q47_uuid, 'text', 'Pattimura', NULL, false, NOW(), NOW());

-- Soal 48: Garuda Pancasila
SET @q48_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q48_uuid, 'SD', 'text', 'Lambang negara Indonesia adalah...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q48_uuid, 'text', 'Garuda Pancasila', NULL, true, NOW(), NOW()),
(UUID(), @q48_uuid, 'text', 'Elang Jawa', NULL, false, NOW(), NOW()),
(UUID(), @q48_uuid, 'text', 'Harimau Sumatera', NULL, false, NOW(), NOW()),
(UUID(), @q48_uuid, 'text', 'Komodo', NULL, false, NOW(), NOW());

-- Soal 49: Danau Toba
SET @q49_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q49_uuid, 'SD', 'text', 'Danau terbesar di Indonesia adalah...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q49_uuid, 'text', 'Danau Toba', NULL, true, NOW(), NOW()),
(UUID(), @q49_uuid, 'text', 'Danau Maninjau', NULL, false, NOW(), NOW()),
(UUID(), @q49_uuid, 'text', 'Danau Kelimutu', NULL, false, NOW(), NOW()),
(UUID(), @q49_uuid, 'text', 'Danau Singkarak', NULL, false, NOW(), NOW());

-- Soal 50: Pancasila
SET @q50_uuid = UUID();
INSERT IGNORE INTO questions (id, level, type, question_text, question_img, created_at, updated_at) 
VALUES (@q50_uuid, 'SD', 'text', 'Dasar negara Indonesia adalah...', NULL, NOW(), NOW());
INSERT IGNORE INTO answers (id, question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(UUID(), @q50_uuid, 'text', 'Pancasila', NULL, true, NOW(), NOW()),
(UUID(), @q50_uuid, 'text', 'UUD 1945', NULL, false, NOW(), NOW()),
(UUID(), @q50_uuid, 'text', 'Bhinneka Tunggal Ika', NULL, false, NOW(), NOW()),
(UUID(), @q50_uuid, 'text', 'NKRI', NULL, false, NOW(), NOW());

-- Commit transaction
COMMIT;

-- =====================================================
-- QUERY SELESAI - UUID VERSION
-- =====================================================
-- Total: 50 soal SD dengan 4 jawaban masing-masing
-- Distribusi:
-- - Matematika: 20 soal (1-20)  
-- - IPA: 15 soal (21-35)
-- - IPS: 15 soal (36-50)
-- 
-- PERBEDAAN DENGAN VERSI SEBELUMNYA:
-- 1. Menggunakan UUID() untuk generate unique ID
-- 2. Explicit INSERT id untuk questions dan answers
-- 3. SET @qX_uuid untuk menyimpan UUID setiap soal
-- 4. Tidak bergantung pada LAST_INSERT_ID()
-- 5. Kompatibel dengan Laravel UUID primary key
-- =====================================================
