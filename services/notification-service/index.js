const express = require("express");
const app = express();
app.use(express.json());

const PORT = 3002;

// Endpoint simulasi untuk mengirim notifikasi
app.post("/api/notifications", (req, res) => {
  const { patient_id, message } = req.body;

  // Simulasi pengiriman notifikasi
  console.log(
    `[NOTIFIKASI] Mengirim pesan ke Pasien ID ${patient_id}: ${message}`,
  );

  res.status(201).json({
    status: 201,
    message: "Notifikasi berhasil dikirim (Simulasi)",
    data: { patient_id, message },
  });
});

app.listen(PORT, () => {
  console.log(`Notification Service berjalan di http://localhost:${PORT}`);
});
