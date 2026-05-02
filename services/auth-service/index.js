require("dotenv").config();
const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3001;

// Koneksi ke Database auth_db
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "auth_db",
});

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `http://localhost:${PORT}/auth/google/callback`,
);

// Blacklist token sederhana di memori (Syarat: Token invalidation)
const tokenBlacklist = new Set();

// 1. Rute Mulai Login
app.get("/auth/google", (req, res) => {
  const url = client.generateAuthUrl({
    access_type: "offline",
    scope: ["email", "profile"],
  });
  res.redirect(url);
});

// 2. Rute Callback & Pembuatan JWT
app.get("/auth/google/callback", async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const oauth2 = require("googleapis").google.oauth2({
      auth: client,
      version: "v2",
    });
    const userInfo = await oauth2.userinfo.get();
    const { name, email, picture } = userInfo.data;

    // Cek apakah user sudah ada di database lokal
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    let user;

    if (rows.length === 0) {
      // Jika belum ada, buat otomatis dengan flag oauth_provider
      const [result] = await pool.query(
        "INSERT INTO users (name, email, picture, oauth_provider) VALUES (?, ?, ?, 1)",
        [name, email, picture],
      );
      user = { id: result.insertId, email: email };
    } else {
      user = rows[0];
    }

    // Terbitkan Tiket JWT
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" },
    );
    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    // Menampilkan token
    res.status(200).json({
      status: 200,
      message: "Login OAuth Berhasil!",
      user: { name, email },
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Gagal login dengan Google" });
  }
});

// 3. Endpoint Refresh Token
app.post("/api/auth/refresh", (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token)
    return res.status(401).json({ message: "Refresh token dibutuhkan" });

  jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err)
      return res
        .status(403)
        .json({ message: "Refresh token tidak valid atau kadaluarsa" });

    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" },
    );
    res.status(200).json({ access_token: newAccessToken });
  });
});

// 4. Endpoint Logout (Blacklist)
app.post("/api/auth/logout", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    tokenBlacklist.add(token);
  }
  res
    .status(200)
    .json({ message: "Logout berhasil, access token telah di-blacklist" });
});

app.listen(PORT, () => {
  console.log(`Auth Service berjalan di http://localhost:${PORT}`);
});
