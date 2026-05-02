const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = 3000;

// Syarat: Basic Rate Limiting (Misal 60 request/menit)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 menit
  max: 60, // maksimal 60 request
  message: "Terlalu banyak request, harapp coba ulang lain waktu",
});
app.use(limiter);

// Peta Routing (Meneruskan dari Gateway ke Service masing-masing)
// 1. Rute ke Auth Service (Port 3001)
app.use(
  "/auth",
  createProxyMiddleware({
    target: "http://localhost:3001",
    changeOrigin: true,
  }),
);

// 2. Rute ke Medical Service (Port 8080 - CodeIgniter)
app.use(
  "/api/medical",
  createProxyMiddleware({
    target: "http://localhost:8080",
    changeOrigin: true,
    pathRewrite: { "^/api/medical": "/api" }, // Menyesuaikan URL CI4
  }),
);

// 3. Rute ke Notification Service (Port 3002)
app.use(
  "/api/notif",
  createProxyMiddleware({
    target: "http://localhost:3002",
    changeOrigin: true,
  }),
);

app.get("/", (req, res) => {
  res.send("Selamat datang di API Gateway UPNVJ!");
});

app.listen(PORT, () => {
  console.log(`API Gateway berjalan sebagai bos di http://localhost:${PORT}`);
});
