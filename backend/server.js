require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "*"
}));
app.use(express.json());

// Podešavanje skladišta za multer (upload fajlova)
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const upload = multer({ storage });

// Rutiranje za upload fajla
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Nema fajla za upload" });
  }
  // Vraćamo URL do uploadovane slike
  res.json({ url: `/uploads/${req.file.filename}` });
});

const authRoutes = require("./routes/authRoutes");
const gameRoutes = require("./routes/gameRoutes");
const userRoutes = require("./routes/userRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");

// Staticki folder za slike
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rute
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/wishlist", wishlistRoutes);

// Pokretanje servera
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Backend radi na http://localhost:${PORT}`);
});
