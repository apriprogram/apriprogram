const bcrypt = require("bcrypt");
const { pool } = require("../config/db");

exports.register = async (req, res) => {
  const { full_name, email, whatsapp, password } = req.body;
  
  if (!email || !password || !full_name || !whatsapp) {
    return res.status(400).json({ success: false, message: "Semua kolom wajib diisi." });
  }

  try {
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: "Email sudah terdaftar." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (email, password, role, full_name, whatsapp) VALUES (?, ?, 'client', ?, ?)",
      [email, hashedPassword, full_name, whatsapp]
    );

    req.session.userId = result.insertId;
    req.session.role = 'client';
    req.session.email = email;

    res.status(201).json({ success: true, message: "Registrasi berhasil.", redirectUrl: "/order" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email dan password wajib diisi." });
  }

  try {
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: "Email atau password salah." });
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ success: false, message: "Email atau password salah." });
    }

    req.session.userId = user.id;
    req.session.role = user.role;
    req.session.email = user.email;

    res.status(200).json({ 
      success: true, 
      message: "Login berhasil.", 
      role: user.role,
      redirectUrl: (user.role === 'admin' || user.role === 'super admin') ? '/admin/dashboard' : '/order' 
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Gagal logout." });
    }
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
};

const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// Ensure redirect URI matches what's configured in Google Cloud Console
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback';

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

exports.googleAuth = (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
  });
  res.redirect(url);
};

exports.googleCallback = async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.redirect('/login?error=NoCode');
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: google_id, email, name: full_name, picture: avatar } = payload;

    const [users] = await pool.query("SELECT * FROM users WHERE email = ? OR google_id = ?", [email, google_id]);
    
    let user;
    if (users.length > 0) {
      user = users[0];
      if (!user.google_id) {
        await pool.query("UPDATE users SET google_id = ?, avatar = ? WHERE id = ?", [google_id, avatar, user.id]);
      }
    } else {
      const [result] = await pool.query(
        "INSERT INTO users (email, google_id, role, full_name, avatar, password) VALUES (?, ?, 'client', ?, ?, NULL)",
        [email, google_id, full_name, avatar]
      );
      user = { id: result.insertId, email, role: 'client', full_name, avatar };
    }

    req.session.userId = user.id;
    req.session.role = user.role;
    req.session.email = user.email;

    const redirectUrl = (user.role === 'admin' || user.role === 'super admin') ? '/admin/dashboard' : '/order';
    res.redirect(redirectUrl);

  } catch (error) {
    console.error("Google Auth error:", error);
    res.redirect('/login?error=GoogleAuthFailed');
  }
};
