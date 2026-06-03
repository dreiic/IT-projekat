require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

const auth = require("./middleware/authMiddleware");
const adminOnly = require("./middleware/adminOnly");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

app.post("/api/upload", auth, adminOnly, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Nema fajla za upload" });
  res.json({ url: `/uploads/${req.file.filename}` });
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/games", require("./routes/gameRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ Backend radi na http://localhost:${PORT}`));
