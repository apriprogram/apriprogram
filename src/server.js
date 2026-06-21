const path = require("path");
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const fs = require("fs");
require("dotenv").config();

const { pool, initDatabase } = require("./config/db");
const authController = require("./controllers/authController");
const adminController = require("./controllers/adminController");
const orderController = require("./controllers/orderController");
const { requireLogin, requireAdmin } = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use(session({
  secret: process.env.SESSION_SECRET || "apriprogram_secret_key_123!@#",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// API Contact
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "Nama, email, dan pesan wajib diisi." });
  }
  try {
    await pool.execute(
      "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)",
      [name.trim(), email.trim(), message.trim()]
    );
    return res.status(201).json({ success: true, message: "Pesan berhasil dikirim. Tim Apriprogram akan segera menghubungi Anda." });
  } catch (error) {
    console.error("Contact insert error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server. Coba lagi beberapa saat." });
  }
});

// Auth Routes
app.post("/api/auth/register", authController.register);
app.post("/api/auth/login", authController.login);
app.post("/api/auth/logout", authController.logout);
app.get("/logout", authController.logout);
app.get("/api/auth/google", authController.googleAuth);
app.get("/api/auth/google/callback", authController.googleCallback);

// Admin Pages Routes
app.get("/admin", (req, res) => {
  res.redirect("/admin/dashboard");
});
app.get("/admin/dashboard", requireAdmin, (req, res) => {
  res.render("admin/dashboard", { user: req.session });
});

// Admin API Routes
app.get("/api/settings", adminController.getSettings); // Public to fetch settings
app.post("/api/admin/settings", requireAdmin, adminController.updateSettings);
// Uploads config
const uploadDir = path.join(__dirname, "..", "public", "uploads");
const docDir = path.join(__dirname, "..", "public", "assets", "dokumen_client");
const paymentDir = path.join(__dirname, "..", "public", "assets", "bukti_pembayaran");

[uploadDir, docDir, paymentDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

const docStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, docDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const docUpload = multer({ storage: docStorage });

const paymentStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, paymentDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const paymentUpload = multer({ storage: paymentStorage });

app.post("/api/admin/upload", requireAdmin, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, url: fileUrl });
});

// Document Upload Route (Client & Admin)
app.post("/api/upload/document", requireLogin, docUpload.any(), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: "Tidak ada dokumen yang diunggah" });
  }
  const fileUrls = req.files.map(f => `/assets/dokumen_client/${f.filename}`);
  res.json({ success: true, url: fileUrls.join(',') });
});

// Payment Upload Route (Client & Admin)
app.post("/api/upload/payment", requireLogin, paymentUpload.any(), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: "Tidak ada bukti pembayaran yang diunggah" });
  }
  const fileUrls = req.files.map(f => `/assets/bukti_pembayaran/${f.filename}`);
  res.json({ success: true, url: fileUrls.join(',') });
});

// Compatibility route for old client upload
app.post("/api/upload", requireLogin, docUpload.any(), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: "No files uploaded" });
  }
  const fileUrls = req.files.map(f => `/assets/dokumen_client/${f.filename}`);
  res.json({ success: true, url: fileUrls.join(',') });
});

app.get("/api/admin/users", requireAdmin, adminController.getUsers);
app.post("/api/admin/users", requireAdmin, adminController.createUser);
app.put("/api/admin/users/:id", requireAdmin, adminController.updateUser);
app.delete("/api/admin/users/:id", requireAdmin, adminController.deleteUser);

// Order API Routes
app.post("/api/orders", requireLogin, orderController.createOrder);
app.get("/api/orders", requireLogin, orderController.getOrders);
app.put("/api/orders/:id", requireAdmin, orderController.updateOrder);
app.delete("/api/orders/:id", requireAdmin, orderController.deleteOrder);

// Views Routes
app.get("/order", requireLogin, (req, res) => {
  res.render("client/order", { user: req.session });
});
app.get("/login", (req, res) => {
  if (req.session && req.session.userId) {
    const isAdmin = req.session.role === 'admin' || req.session.role === 'super admin';
    return res.redirect(isAdmin ? '/admin/dashboard' : '/order');
  }
  res.render("login");
});

app.get("*", (req, res) => {
  res.render("index", { user: req.session || null });
});

initDatabase().catch((error) => {
  console.warn("Database initialization skipped:", error.message);
  console.warn("Landing page tetap berjalan. Contact form membutuhkan MySQL dan konfigurasi .env yang benar.");
});

app.listen(PORT, () => {
  console.log(`Apriprogram server running at http://localhost:${PORT}`);
});
