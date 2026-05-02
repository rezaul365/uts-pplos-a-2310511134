const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3000;

// Kunci ini harus SAMA PERSIS dengan yang ada di Auth Service
const JWT_ACCESS_SECRET = "Kunci_RahasiaUPNVJ_123";

// Syarat: Basic Rate Limiting (Maks 60 req/menit)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 menit
  max: 60,
  message: "Terlalu banyak request, santai dulu bosku!",
});
app.use(limiter);

// Middleware Validasi JWT di Gateway
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Akses Ditolak! Tiket JWT tidak ditemukan." });
  }

  jwt.verify(token, JWT_ACCESS_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        message: "Akses Ditolak! Tiket JWT tidak valid atau sudah kadaluarsa.",
      });
    }
    // Jika valid, tiket dilewatkan
    req.user = user;
    next();
  });
};

// 1. Rute Publik (Tidak perlu JWT, karena tempat ambil tiket)
app.use(
  "/auth",
  createProxyMiddleware({
    target: "http://localhost:3001",
    changeOrigin: true,
    pathRewrite: { "^/": "/auth/" },
  }),
);

// 2. Rute Medical + JWT
app.use(
  "/api/medical",
  verifyToken,
  createProxyMiddleware({
    target: "http://localhost:8080",
    changeOrigin: true,
    pathRewrite: { "^/": "/api/" },
  }),
);

// Sebelum Direvisi
//app.use(
//  "/api/medical",
//  verifyToken,
//  createProxyMiddleware({
//    target: "http://localhost:8080",
//    changeOrigin: true,
//    pathRewrite: { "^/api/medical": "/api" }, 
//  }),
//);


// 3. Rute Reservation + JWT
app.use(
  "/api/reservation",
  verifyToken,
  createProxyMiddleware({
    target: "http://localhost:3002",
    changeOrigin: true,
    pathRewrite: { "^/": "/api/reservation/" },
  }),
);


app.get("/", (req, res) => {
  res.send(
    "API Gateway UPNVJ Beroperasi. Silakan gunakan Bearer Token untuk akses API.",
  );
});

app.listen(PORT, () => {
  console.log(
    `API Gateway siap sebagai pintu utama di http://localhost:${PORT}`,
  );
});
