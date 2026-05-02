const express = require("express");
const axios = require("axios");
const mysql = require("mysql2/promise");

const app = express();
app.use(express.json());
const PORT = 3002;

// Koneksi ke database terpisah
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "reservation_db",
});

// Endpoint Membuat Reservasi (Komunikasi Inter-Service)
app.post("/api/reservation", async (req, res) => {
  const { patient_id, schedule_id } = req.body;

  try {
    // 1. Telepon Medical Service untuk cek apakah Pasien ada?
    const patientCheck = await axios.get(
      `http://localhost:8080/api/patients/${patient_id}`,
    );

    // 2. Telepon Medical Service untuk cek apakah Jadwal Dokter ada?
    const scheduleCheck = await axios.get(
      `http://localhost:8080/api/schedules/${schedule_id}`,
    );

    // Jika dua-duanya membalas sukses (200), baru kita simpan reservasinya
    if (patientCheck.status === 200 && scheduleCheck.status === 200) {
      const [result] = await pool.query(
        "INSERT INTO reservations (patient_id, schedule_id, status) VALUES (?, ?, ?)",
        [patient_id, schedule_id, "Confirmed"],
      );

      return res.status(201).json({
        status: 201,
        message: "Reservasi berhasil dibuat dan dikonfirmasi!",
        data: {
          reservation_id: result.insertId,
          patient: patientCheck.data.data.name, // Mengambil nama dari Medical Service
          status: "Confirmed",
        },
      });
    }
  } catch (error) {
    // Jika Medical Service bilang 404 Not Found
    return res.status(404).json({
      status: 404,
      message: "Gagal! Pasien atau Jadwal tidak ditemukan di Medical Service.",
    });
  }
});

// Endpoint Melihat Semua Reservasi
app.get("/api/reservation", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM reservations");
  res.status(200).json({ status: 200, data: rows });
});

app.listen(PORT, () => {
  console.log(
    `Reservation Service (REAL) berjalan di http://localhost:${PORT}`,
  );
});
