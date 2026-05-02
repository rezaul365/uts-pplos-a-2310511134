# Sistem Reservasi Klinik - Microservices Architecture (UTS PPLOS)

**Nama:** Rezaul Karim
**NIM:** 2310511134
**Kelas:** A

---
Link: https://youtu.be/iRlddfFK5SU

## Ringkasan Sistem (System Overview)

Proyek ini adalah implementasi **Sistem Reservasi Klinik** yang dibangun menggunakan arsitektur **Microservices**. Sistem ini mendemonstrasikan bagaimana beberapa layanan (services) yang independen dan otonom dapat berkomunikasi satu sama lain untuk menyelesaikan sebuah alur bisnis yang utuh. Terdapat tiga layanan backend (services) utama dan satu API Gateway yang bertugas sebagai pintu masuk sentral.

## Arsitektur & Komponen

Sistem ini terdiri dari 4 komponen utama:

### 1. API Gateway (Port 3000)
- **Teknologi:** Node.js, Express.js, `http-proxy-middleware`.
- **Fungsi:** Bertindak sebagai *Single Entry Point* (pintu masuk utama) untuk semua permintaan dari sisi *client*. Gateway ini akan meneruskan (*proxy*) rute URL ke layanan (microservice) yang tepat.
- **Fitur Tambahan:** 
  - **Centralized Security:** Memvalidasi token JWT secara terpusat sebelum permintaan diteruskan ke layanan *Medical* atau *Reservation*.
  - **Rate Limiting:** Membatasi jumlah *request* (maksimal 60 request per menit) untuk mencegah *spam/DDoS*.

### 2. Auth Service (Port 3001)
- **Teknologi:** Node.js, Express.js, MySQL (`auth_db`), Google OAuth2.
- **Fungsi:** Mengelola autentikasi pengguna (Sistem Login).
- **Fitur:** Menggunakan Google Login (OAuth 2.0) untuk autentikasi. Setelah login berhasil, layanan ini akan menerbitkan (*issue*) tiket **JWT (JSON Web Token)** berupa *Access Token* dan *Refresh Token*. Layanan ini juga menangani fitur *refresh token* dan *logout* (menggunakan mekanisme *token blacklist* sederhana di memori).

### 3. Medical Service (Port 8080)
- **Teknologi:** PHP, CodeIgniter 4 (Framework MVC), MySQL.
- **Fungsi:** Mengelola data inti medis/klinik, khususnya data **Pasien (Patients)** dan **Jadwal Dokter (Schedules)**.
- **Fitur:** Layanan ini berjalan sendiri dan menyediakan endpoint RESTful API. Layanan ini adalah sumber data utama (Source of Truth) untuk informasi medis.

### 4. Reservation Service (Port 3002)
- **Teknologi:** Node.js, Express.js, MySQL (`reservation_db`).
- **Fungsi:** Menangani logika bisnis utama, yaitu pembuatan reservasi (booking).
- **Fitur Khusus (Inter-Service Communication):** Saat menerima permintaan pembuatan reservasi, layanan ini tidak memvalidasi data sendiri. Ia menggunakan **Axios** untuk melakukan komunikasi HTTP internal (*Inter-Service Communication*) dengan **Medical Service**. Ia akan bertanya: *"Apakah Pasien X ada?"* dan *"Apakah Jadwal Y ada?"*. Jika kedua data dikonfirmasi ada oleh *Medical Service*, barulah reservasi disimpan ke dalam *database* `reservation_db`.

## Alur Kerja Aplikasi (Workflow)

1. **Login:** Klien (misal: Postman/Frontend) mengakses endpoint `/auth/google` melalui API Gateway. Gateway meneruskannya ke *Auth Service*. Klien login dengan akun Google dan mendapatkan balasan berupa **JWT Access Token**.
2. **Akses Data:** Untuk melihat data medis atau membuat reservasi, klien wajib menyertakan token tersebut di header HTTP (`Authorization: Bearer <token>`).
3. **Validasi Gateway:** Saat klien mengakses endpoint (contoh: `/api/reservation`), API Gateway akan mencegatnya dan memverifikasi keaslian JWT. Jika valid, akses dilewatkan (*pass-through*) ke *Reservation Service*.
4. **Validasi Internal (Service-to-Service):** *Reservation Service* akan menghubungi *Medical Service* secara diam-diam (*background*) untuk mengecek ketersediaan Pasien dan Jadwal.
5. **Sukses:** Reservasi berhasil dibuat dan balasan dikembalikan ke klien.
