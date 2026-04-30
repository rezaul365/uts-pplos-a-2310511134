const express = require("express");
const app = express();
const PORT = 3001;

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
