# Digital Pandu to Pandu — Prototype Frontend

Prototipe halaman Kirim Pesan dan Arsip Kenangan menggunakan HTML, Tailwind CSS, Vite, dan JavaScript.

## Fitur yang sudah tersedia
- Formulir nama, angkatan, dan pesan (semua wajib diisi).
- Unggah foto opsional dengan pratinjau, tipe JPG/PNG/WEBP dan batas 5 MB.
- Validasi formulir dan pesan konfirmasi setelah pengiriman.
- Arsip pesan dengan pencarian.
- Penyimpanan sementara menggunakan `localStorage` browser.
- Layout responsif untuk desktop dan ponsel.
- Navbar berbentuk kapsul dengan gradasi biru–hijau–kuning.

## Catatan
Ini masih prototipe frontend. Pesan hanya tersimpan di browser/perangkat yang digunakan dan tidak otomatis muncul di komputer atau TV lain. Data browser dapat hilang jika penyimpanan situs dibersihkan. Untuk penggunaan nyata bersama anggota UKM, langkah berikutnya adalah menambahkan backend/database dan penyimpanan foto, misalnya Supabase.

Foto disimpan sebagai data lokal di browser, jadi foto besar bisa membuat kapasitas `localStorage` cepat penuh. Jika penyimpanan penuh, coba kirim tanpa foto atau gunakan foto yang lebih kecil.
