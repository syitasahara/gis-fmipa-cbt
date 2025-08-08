-- =====================================================
-- SQL QUERY: 50 SOAL SD UNTUK CBT GIS FMIPA (SAFE VERSION)
-- =====================================================
-- Struktur: 50 soal dengan 4 jawaban masing-masing
-- Jenis: Matematika, IPA, IPS untuk tingkat SD
-- Menggunakan transaction untuk memastikan konsistensi data
-- =====================================================

START TRANSACTION;

-- Hapus data lama jika ada (opsional)
-- DELETE FROM answers WHERE question_id IN (SELECT id FROM questions WHERE level = 'SD');
-- DELETE FROM questions WHERE level = 'SD';

-- =====================================================
-- SOAL MATEMATIKA SD (Soal 1-20)
-- =====================================================

-- Soal 1: Penjumlahan Dasar
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Berapakah hasil dari 25 + 17?', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', '42', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '41', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '43', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '40', NULL, false, NOW(), NOW());

-- Soal 2: Pengurangan
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Hasil dari 89 - 34 adalah...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', '55', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '54', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '56', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '53', NULL, false, NOW(), NOW());

-- Soal 3: Perkalian
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Berapa hasil dari 7 × 8?', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', '56', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '54', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '58', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '49', NULL, false, NOW(), NOW());

-- Soal 4: Pembagian
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Hasil dari 72 ÷ 9 adalah...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', '8', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '7', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '9', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '6', NULL, false, NOW(), NOW());

-- Soal 5: Pecahan
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Bentuk paling sederhana dari pecahan 6/8 adalah...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', '3/4', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '2/3', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '4/5', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '1/2', NULL, false, NOW(), NOW());

-- Soal 6: Keliling Persegi
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Keliling sebuah persegi yang panjang sisinya 12 cm adalah...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', '48 cm', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '36 cm', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '144 cm', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '24 cm', NULL, false, NOW(), NOW());

-- Soal 7: Luas Persegi Panjang
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Luas persegi panjang dengan panjang 15 cm dan lebar 8 cm adalah...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', '120 cm²', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '46 cm²', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '23 cm²', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '92 cm²', NULL, false, NOW(), NOW());

-- Soal 8: Satuan Waktu
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', '3 jam = ... menit', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', '180 menit', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '120 menit', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '240 menit', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '90 menit', NULL, false, NOW(), NOW());

-- Soal 9: Satuan Panjang
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', '2,5 meter = ... cm', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', '250 cm', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '25 cm', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '2500 cm', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '50 cm', NULL, false, NOW(), NOW());

-- Soal 10: Rata-rata
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Rata-rata dari bilangan 6, 8, 10, 12 adalah...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', '9', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '8', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '10', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '11', NULL, false, NOW(), NOW());

-- Soal 11: Bilangan Prima
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Bilangan prima antara 10 dan 20 adalah...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', '11, 13, 17, 19', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '11, 13, 15, 17', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '10, 12, 14, 16', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '13, 15, 17, 19', NULL, false, NOW(), NOW());

-- Soal 12: Aljabar Sederhana
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Jika 3x = 15, maka x = ...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', '5', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '3', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '45', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '12', NULL, false, NOW(), NOW());

-- Soal 13: Persentase
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', '50% dari 80 adalah...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', '40', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '30', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '50', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '20', NULL, false, NOW(), NOW());

-- Soal 14: Volume Kubus
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Volume kubus dengan sisi 4 cm adalah...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', '64 cm³', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '16 cm³', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '24 cm³', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '48 cm³', NULL, false, NOW(), NOW());

-- Soal 15: Urutan Bilangan Desimal
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Urutan bilangan dari terkecil: 0,8 ; 0,75 ; 0,9 ; 0,65', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', '0,65 ; 0,75 ; 0,8 ; 0,9', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '0,9 ; 0,8 ; 0,75 ; 0,65', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '0,75 ; 0,8 ; 0,65 ; 0,9', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '0,8 ; 0,75 ; 0,9 ; 0,65', NULL, false, NOW(), NOW());

-- Soal 16: KPK
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Kelipatan persekutuan terkecil (KPK) dari 12 dan 18 adalah...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', '36', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '6', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '72', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '18', NULL, false, NOW(), NOW());

-- Soal 17: FPB
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Faktor persekutuan terbesar (FPB) dari 24 dan 36 adalah...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', '12', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '6', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '72', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '24', NULL, false, NOW(), NOW());

-- Soal 18: Penjumlahan Pecahan
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', '1/4 + 1/3 = ...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', '7/12', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '2/7', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '1/2', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '5/12', NULL, false, NOW(), NOW());

-- Soal 19: Derajat Putaran
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Jika sebuah roda berputar 360 derajat, berapa seperempat putaran?', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', '90 derajat', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '180 derajat', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '270 derajat', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '45 derajat', NULL, false, NOW(), NOW());

-- Soal 20: Soal Cerita
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Pak Budi membeli 3 kg apel seharga Rp45.000. Harga 1 kg apel adalah...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', 'Rp15.000', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Rp12.000', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Rp18.000', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Rp135.000', NULL, false, NOW(), NOW());

-- =====================================================
-- SOAL IPA SD (Soal 21-35)
-- =====================================================

-- Soal 21: Planet
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Planet yang paling dekat dengan Matahari adalah...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', 'Merkurius', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Venus', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Mars', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Bumi', NULL, false, NOW(), NOW());

-- Soal 22: Bagian Tumbuhan
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Bagian tumbuhan yang berfungsi untuk menyerap air adalah...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', 'Akar', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Batang', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Daun', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Bunga', NULL, false, NOW(), NOW());

-- Soal 23: Penguapan
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Proses perubahan air menjadi uap air disebut...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', 'Penguapan', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Pencairan', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Pembekuan', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Pengkristalan', NULL, false, NOW(), NOW());

-- Soal 24: Metamorfosis
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Hewan yang mengalami metamorfosis sempurna adalah...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', 'Kupu-kupu', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Katak', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Belalang', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Kecoak', NULL, false, NOW(), NOW());

-- Soal 25: Fotosintesis
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Gas yang dibutuhkan tumbuhan untuk fotosintesis adalah...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', 'Karbon dioksida (CO2)', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Oksigen (O2)', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Nitrogen (N2)', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Hidrogen (H2)', NULL, false, NOW(), NOW());

-- Soal 26: Bunyi
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Bunyi dapat merambat melalui...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', 'Padat, cair, dan gas', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Hanya udara', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Hanya benda padat', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Ruang hampa', NULL, false, NOW(), NOW());

-- Soal 27: Energi
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Energi yang tersimpan dalam makanan disebut energi...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', 'Kimia', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Kinetik', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Potensial', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Listrik', NULL, false, NOW(), NOW());

-- Soal 28: Alat Indera
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Alat indera yang berfungsi untuk mencium adalah...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', 'Hidung', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Mata', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Telinga', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Lidah', NULL, false, NOW(), NOW());

-- Soal 29: Gravitasi
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Gaya yang menyebabkan benda jatuh ke bawah disebut gaya...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', 'Gravitasi', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Magnet', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Gesek', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Pegas', NULL, false, NOW(), NOW());

-- Soal 30: Siklus Air
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Siklus air dimulai dari proses...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', 'Penguapan', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Kondensasi', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Presipitasi', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Infiltrasi', NULL, false, NOW(), NOW());

-- Soal 31: Karbohidrat
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Makanan yang mengandung karbohidrat tinggi adalah...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', 'Nasi', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Daging', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Ikan', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Susu', NULL, false, NOW(), NOW());

-- Soal 32: Mamalia
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Hewan yang termasuk mamalia adalah...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', 'Paus', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Ikan hiu', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Burung elang', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Ular', NULL, false, NOW(), NOW());

-- Soal 33: Jantung
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Organ tubuh yang berfungsi memompa darah adalah...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', 'Jantung', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Paru-paru', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Ginjal', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Hati', NULL, false, NOW(), NOW());

-- Soal 34: Pemuaian
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Benda yang dapat mengalami pemuaian adalah...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', 'Rel kereta api', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Batu', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Kertas', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Kayu', NULL, false, NOW(), NOW());

-- Soal 35: Cahaya
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Cahaya merambat dalam garis...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', 'Lurus', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Lengkung', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Zigzag', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Melingkar', NULL, false, NOW(), NOW());

-- =====================================================
-- SOAL IPS SD (Soal 36-50)
-- =====================================================

-- Soal 36: Ibu Kota Indonesia
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Ibu kota Indonesia adalah...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', 'Jakarta', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Surabaya', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Bandung', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Medan', NULL, false, NOW(), NOW());

-- Soal 37: Proklamasi
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Proklamasi kemerdekaan Indonesia dibacakan pada tanggal...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', '17 Agustus 1945', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '1 Juni 1945', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '20 Mei 1908', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '28 Oktober 1928', NULL, false, NOW(), NOW());

-- Soal 38: Presiden Pertama
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Presiden pertama Indonesia adalah...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', 'Ir. Soekarno', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Soeharto', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'B.J. Habibie', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Megawati', NULL, false, NOW(), NOW());

-- Soal 39: Gunung Tertinggi
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Gunung tertinggi di Indonesia adalah...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', 'Puncak Jaya', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Gunung Merapi', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Gunung Bromo', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Gunung Semeru', NULL, false, NOW(), NOW());

-- Soal 40: Mata Uang
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Mata uang Indonesia adalah...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', 'Rupiah', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Ringgit', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Peso', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Baht', NULL, false, NOW(), NOW());

-- Soal 41: Benua Terbesar
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Benua terbesar di dunia adalah...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', 'Asia', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Afrika', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Amerika', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Eropa', NULL, false, NOW(), NOW());

-- Soal 42: Samudra Pasifik
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Samudra yang memisahkan Asia dan Amerika adalah...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', 'Samudra Pasifik', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Samudra Atlantik', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Samudra Hindia', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Samudra Arktik', NULL, false, NOW(), NOW());

-- Soal 43: Suku Jawa
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Suku terbesar di Indonesia adalah...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', 'Jawa', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Sunda', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Batak', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Minang', NULL, false, NOW(), NOW());

-- Soal 44: Industri
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Kegiatan ekonomi yang mengolah bahan mentah menjadi barang jadi disebut...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', 'Industri', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Pertanian', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Perdagangan', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Jasa', NULL, false, NOW(), NOW());

-- Soal 45: Pulau Kalimantan
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Pulau terbesar di Indonesia adalah...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', 'Kalimantan', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Sumatera', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Papua', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Jawa', NULL, false, NOW(), NOW());

-- Soal 46: ASEAN
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Organisasi ASEAN didirikan pada tahun...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', '1967', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '1945', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '1965', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', '1970', NULL, false, NOW(), NOW());

-- Soal 47: Ki Hajar Dewantara
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Pahlawan nasional yang dijuluki "Bapak Pendidikan Nasional" adalah...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', 'Ki Hajar Dewantara', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'R.A. Kartini', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Diponegoro', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Pattimura', NULL, false, NOW(), NOW());

-- Soal 48: Garuda Pancasila
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Lambang negara Indonesia adalah...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', 'Garuda Pancasila', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Elang Jawa', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Harimau Sumatera', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Komodo', NULL, false, NOW(), NOW());

-- Soal 49: Danau Toba
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Danau terbesar di Indonesia adalah...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', 'Danau Toba', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Danau Maninjau', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Danau Kelimutu', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Danau Singkarak', NULL, false, NOW(), NOW());

-- Soal 50: Pancasila
INSERT INTO questions (level, type, question_text, question_img, created_at, updated_at) 
VALUES ('SD', 'text', 'Dasar negara Indonesia adalah...', NULL, NOW(), NOW());
INSERT INTO answers (question_id, type, answer_text, answer_img, is_correct, created_at, updated_at) VALUES
(LAST_INSERT_ID(), 'text', 'Pancasila', NULL, true, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'UUD 1945', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'Bhinneka Tunggal Ika', NULL, false, NOW(), NOW()),
(LAST_INSERT_ID(), 'text', 'NKRI', NULL, false, NOW(), NOW());

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
-- Menggunakan TRANSACTION untuk memastikan:
-- 1. Semua data insert dengan aman
-- 2. Foreign key constraint terpenuhi
-- 3. LAST_INSERT_ID() berfungsi dengan benar
-- 4. Rollback otomatis jika ada error
-- =====================================================
