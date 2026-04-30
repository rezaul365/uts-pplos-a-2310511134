const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const PORT = 3001;

const JWT_SECRET = "Rahasia_JWT_Klinik";

app.use(express.json());

app.get("/api/auth/test/", (req, res) => {
  res.json({
    status: "sukses",
    message: "Halo!!!!!!! Auth Service sudah berhasil menyala.",
  });
});

app.listen(PORT, () => {
  console.log(`Auth Service berjalan di http://localhost:${PORT}`);
});

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;

  // Dummy
  if (username === "admin" && password === "rahasia123") {
    const accessToken = jwt.sign({ username: username }, JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ username: username }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login berhasil!!",
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } else {
    res.status(401).json({ message: "Username atau password salah !" });
  }
});

app.listen(PORT, () => {
  console.log(`Auth Service berjalan di http://localhost:${PORT}`);
});
