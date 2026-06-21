const { pool } = require("../config/db");
const bcrypt = require("bcrypt");

exports.getSettings = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT section, setting_key, setting_value FROM settings");
    const settings = {};
    rows.forEach(row => {
      if (!settings[row.section]) {
        settings[row.section] = {};
      }
      settings[row.section][row.setting_key] = row.setting_value;
    });
    res.json({ success: true, settings });
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil settings." });
  }
};

exports.updateSettings = async (req, res) => {
  const { section, settings } = req.body;
  if (!section || !settings) {
    return res.status(400).json({ success: false, message: "Data tidak lengkap." });
  }

  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      for (const [key, value] of Object.entries(settings)) {
        await connection.query(
          "INSERT INTO settings (section, setting_key, setting_value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE setting_value = ?",
          [section, key, value, value]
        );
      }
      await connection.commit();
      res.json({ success: true, message: "Settings berhasil diperbarui." });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Update settings error:", error);
    res.status(500).json({ success: false, message: "Gagal memperbarui settings." });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const [users] = await pool.query("SELECT id, email, role, created_at FROM users ORDER BY created_at DESC");
    res.json({ success: true, users });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil data users." });
  }
};

exports.createUser = async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: "Email dan password wajib diisi." });
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || 'client';
    await pool.query("INSERT INTO users (email, password, role) VALUES (?, ?, ?)", [email, hashedPassword, userRole]);
    res.json({ success: true, message: "Pengguna berhasil ditambahkan." });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: "Email sudah digunakan." });
    }
    console.error("Create user error:", error);
    res.status(500).json({ success: false, message: "Gagal menambahkan pengguna." });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, password, role } = req.body;
  if (!email || !role) return res.status(400).json({ success: false, message: "Email dan role wajib diisi." });
  
  try {
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query("UPDATE users SET email = ?, password = ?, role = ? WHERE id = ?", [email, hashedPassword, role, id]);
    } else {
      await pool.query("UPDATE users SET email = ?, role = ? WHERE id = ?", [email, role, id]);
    }
    res.json({ success: true, message: "Pengguna berhasil diperbarui." });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: "Email sudah digunakan oleh pengguna lain." });
    }
    console.error("Update user error:", error);
    res.status(500).json({ success: false, message: "Gagal memperbarui pengguna." });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ success: true, message: "Pengguna berhasil dihapus." });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ success: false, message: "Gagal menghapus pengguna." });
  }
};
