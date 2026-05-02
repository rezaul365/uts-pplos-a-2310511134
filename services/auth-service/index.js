require("dotenv").config();
const express = require("express");
const session = require("express-session");
const { OAuth2Client } = require("google-auth-library");

const app = express();
const PORT = process.env.PORT || 3001;

// Setup Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  }),
);

// Setup Google Client
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `http://localhost:${PORT}/auth/google/callback`, // URL Redirect setelah login
);

// Rute Halaman Utama (Cek Status Login)
app.get("/", (req, res) => {
  if (req.session.user) {
    res.send(
      `<h1>Halo, ${req.session.user.name}!</h1><p>Email: ${req.session.user.email}</p><a href="/logout">Logout</a>`,
    );
  } else {
    res.send(
      '<h1>Layanan Autentikasi</h1><a href="/auth/google">Login dengan Google</a>',
    );
  }
});

// Rute untuk memulai proses Login Google
app.get("/auth/google", (req, res) => {
  const url = client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  });
  res.redirect(url);
});

// Rute Callback (Google mengembalikan data user ke sini)
app.get("/auth/google/callback", async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // Ambil data profil user
    const oauth2 = require("googleapis").google.oauth2({
      auth: client,
      version: "v2",
    });
    const userInfo = await oauth2.userinfo.get();

    // Simpan data user ke session
    req.session.user = {
      name: userInfo.data.name,
      email: userInfo.data.email,
      picture: userInfo.data.picture,
    };

    res.redirect("/");
  } catch (error) {
    console.error("Error saat login Google:", error);
    res.send("Gagal login dengan Google.");
  }
});

// Rute Logout
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Auth Service berjalan di http://localhost:${PORT}`);
});
