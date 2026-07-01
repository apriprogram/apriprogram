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
      if (row.section === 'service_items' || row.section === 'project_items' || row.section === 'timeline_items' || row.section === 'hero_items' || row.section === 'faq_items') {
        try {
          settings[row.section][row.setting_key] = JSON.parse(row.setting_value || '{}');
        } catch (error) {
          settings[row.section][row.setting_key] = {};
        }
      } else {
        settings[row.section][row.setting_key] = row.setting_value;
      }
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


function normalizeServicePayload(body) {
  const slug = (body.slug || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return {
    title: (body.title || "").trim(),
    slug,
    category: (body.category || "").trim(),
    short_description: (body.short_description || "").trim(),
    description: (body.description || "").trim(),
    image: (body.image || "").trim(),
    publish_date: body.publish_date || null,
    button_text: (body.button_text || "Read details").trim(),
    button_link: (body.button_link || "#").trim(),
    sort_order: Number.parseInt(body.sort_order, 10) || 0,
    status: body.status === "non-active" ? "non-active" : "active",
    featured: body.featured === "featured" ? "featured" : "not-featured",
    meta_title: (body.meta_title || "").trim(),
    meta_description: (body.meta_description || "").trim()
  };
}

exports.getServiceItems = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT setting_key, setting_value FROM settings WHERE section = 'service_items'"
    );
    const services = rows.map(row => {
      try {
        return { ...JSON.parse(row.setting_value || "{}"), setting_key: row.setting_key };
      } catch (error) {
        return { setting_key: row.setting_key };
      }
    }).sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0) || String(a.setting_key).localeCompare(String(b.setting_key)));
    res.json({ success: true, services });
  } catch (error) {
    console.error("Get service items error:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil data services." });
  }
};

exports.saveServiceItem = async (req, res) => {
  const payload = normalizeServicePayload(req.body);
  const originalKey = (req.body.original_key || "").trim();

  if (!payload.title || !payload.slug) {
    return res.status(400).json({ success: false, message: "Title dan Slug wajib diisi." });
  }

  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      if (originalKey && originalKey !== payload.slug) {
        await connection.query("DELETE FROM settings WHERE section = 'service_items' AND setting_key = ?", [originalKey]);
      }

      await connection.query(
        "INSERT INTO settings (section, setting_key, setting_value) VALUES ('service_items', ?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)",
        [payload.slug, JSON.stringify(payload)]
      );

      await connection.commit();
      res.json({ success: true, message: "Service berhasil disimpan.", service: payload });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Save service item error:", error);
    res.status(500).json({ success: false, message: "Gagal menyimpan service." });
  }
};

exports.deleteServiceItem = async (req, res) => {
  const { slug } = req.params;
  try {
    await pool.query("DELETE FROM settings WHERE section = 'service_items' AND setting_key = ?", [slug]);
    res.json({ success: true, message: "Service berhasil dihapus." });
  } catch (error) {
    console.error("Delete service item error:", error);
    res.status(500).json({ success: false, message: "Gagal menghapus service." });
  }
};

function normalizeProjectPayload(body) {
  const slug = (body.slug || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return {
    title: (body.title || "").trim(),
    slug,
    category: (body.category || "").trim(),
    short_description: (body.short_description || "").trim(),
    description: (body.description || "").trim(),
    image: (body.image || "").trim(),
    image_alt: (body.image_alt || "").trim(),
    client_name: (body.client_name || "").trim(),
    technology_stack: (body.technology_stack || "").trim(),
    project_url: (body.project_url || "").trim(),
    detail_url: (body.detail_url || "").trim(),
    button_text: (body.button_text || "Lihat detail").trim(),
    sort_order: Number.parseInt(body.sort_order, 10) || 0,
    status: body.status === "non-active" ? "non-active" : "active",
    featured: body.featured === "not-featured" ? "not-featured" : "featured",
    meta_title: (body.meta_title || "").trim(),
    meta_description: (body.meta_description || "").trim()
  };
}

exports.getProjectItems = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT setting_key, setting_value FROM settings WHERE section = 'project_items'"
    );
    const projects = rows.map(row => {
      try {
        return { ...JSON.parse(row.setting_value || "{}"), setting_key: row.setting_key };
      } catch (error) {
        return { setting_key: row.setting_key };
      }
    }).sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0) || String(a.setting_key).localeCompare(String(b.setting_key)));
    res.json({ success: true, projects });
  } catch (error) {
    console.error("Get project items error:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil data projects." });
  }
};

exports.saveProjectItem = async (req, res) => {
  const payload = normalizeProjectPayload(req.body);
  const originalKey = (req.body.original_key || "").trim();

  if (!payload.title || !payload.slug) {
    return res.status(400).json({ success: false, message: "Title dan Slug wajib diisi." });
  }

  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      if (originalKey && originalKey !== payload.slug) {
        await connection.query("DELETE FROM settings WHERE section = 'project_items' AND setting_key = ?", [originalKey]);
      }

      await connection.query(
        "INSERT INTO settings (section, setting_key, setting_value) VALUES ('project_items', ?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)",
        [payload.slug, JSON.stringify(payload)]
      );

      await connection.commit();
      res.json({ success: true, message: "Project berhasil disimpan.", project: payload });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Save project item error:", error);
    res.status(500).json({ success: false, message: "Gagal menyimpan project." });
  }
};

exports.deleteProjectItem = async (req, res) => {
  const { slug } = req.params;
  try {
    await pool.query("DELETE FROM settings WHERE section = 'project_items' AND setting_key = ?", [slug]);
    res.json({ success: true, message: "Project berhasil dihapus." });
  } catch (error) {
    console.error("Delete project item error:", error);
    res.status(500).json({ success: false, message: "Gagal menghapus project." });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT id, email, role, full_name, whatsapp, company, country, avatar, created_at FROM users ORDER BY created_at DESC"
    );
    res.json({ success: true, users });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil data users." });
  }
};

exports.createUser = async (req, res) => {
  const { email, password, role, full_name, whatsapp, company, country, avatar } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: "Email dan password wajib diisi." });
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || 'client';
    await pool.query(
      "INSERT INTO users (email, password, role, full_name, whatsapp, company, country, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
      [email, hashedPassword, userRole, full_name || null, whatsapp || null, company || null, country || null, avatar || null]
    );
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
  const { email, password, role, full_name, whatsapp, company, country, avatar } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email wajib diisi." });
  
  try {
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        "UPDATE users SET email = ?, password = ?, role = ?, full_name = ?, whatsapp = ?, company = ?, country = ?, avatar = ? WHERE id = ?", 
        [email, hashedPassword, role || 'client', full_name || null, whatsapp || null, company || null, country || null, avatar || null, id]
      );
    } else {
      await pool.query(
        "UPDATE users SET email = ?, role = ?, full_name = ?, whatsapp = ?, company = ?, country = ?, avatar = ? WHERE id = ?", 
        [email, role || 'client', full_name || null, whatsapp || null, company || null, country || null, avatar || null, id]
      );
    }
    // Refresh session if the user edited their own profile
    if (req.session && req.session.userId && String(req.session.userId) === String(id)) {
      req.session.email    = email;
      req.session.role     = role || req.session.role;
      req.session.full_name = full_name || '';
      req.session.whatsapp  = whatsapp || '';
      req.session.company   = company || '';
      req.session.country   = country || '';
      req.session.avatar    = avatar || null;
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
  const path = require('path');
  const fs = require('fs');

  try {
    // Fetch user data (for avatar)
    const [userRows] = await pool.query("SELECT avatar FROM users WHERE id = ?", [id]);
    if (userRows.length === 0) {
      return res.status(404).json({ success: false, message: "Pengguna tidak ditemukan." });
    }

    // Fetch all orders for this user (for their attached files)
    const [orderRows] = await pool.query(
      "SELECT project_document, payment_proof FROM orders WHERE user_id = ?",
      [id]
    );

    // Helper to delete a file from filesystem
    const deleteFile = (filePath) => {
      if (!filePath) return;
      filePath.split(',').forEach(fp => {
        const trimmed = fp.trim();
        if (!trimmed) return;
        const relPath = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
        const absPath = path.join(__dirname, '../../public', relPath.replace(/^public\//, ''));
        if (fs.existsSync(absPath)) {
          try { fs.unlinkSync(absPath); } catch (e) { /* ignore */ }
        }
      });
    };

    // Delete order files
    for (const order of orderRows) {
      deleteFile(order.project_document);
      deleteFile(order.payment_proof);
    }

    // Delete user avatar
    const avatar = userRows[0].avatar;
    if (avatar && !avatar.startsWith('http')) {
      deleteFile(avatar);
    }

    // Delete orders first (cascade safety), then delete user
    await pool.query("DELETE FROM orders WHERE user_id = ?", [id]);
    await pool.query("DELETE FROM users WHERE id = ?", [id]);

    res.json({ success: true, message: "Pengguna dan semua data terkait berhasil dihapus." });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ success: false, message: "Gagal menghapus pengguna." });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const [[usersRows]] = await pool.query(`
      SELECT 
        SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as harian,
        SUM(CASE WHEN YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1) THEN 1 ELSE 0 END) as mingguan,
        SUM(CASE WHEN MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE()) THEN 1 ELSE 0 END) as bulanan,
        SUM(CASE WHEN YEAR(created_at) = YEAR(CURDATE()) THEN 1 ELSE 0 END) as tahunan
      FROM users WHERE role = 'client'
    `);
    
    const [[ordersRows]] = await pool.query(`
      SELECT 
        SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as harian,
        SUM(CASE WHEN YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1) THEN 1 ELSE 0 END) as mingguan,
        SUM(CASE WHEN MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE()) THEN 1 ELSE 0 END) as bulanan,
        SUM(CASE WHEN YEAR(created_at) = YEAR(CURDATE()) THEN 1 ELSE 0 END) as tahunan
      FROM orders
    `);

    let visStats = { harian: 0, mingguan: 0, bulanan: 0, tahunan: 0 };
    try {
      const [[visRows]] = await pool.query(`
        SELECT 
          SUM(CASE WHEN DATE(visited_at) = CURDATE() THEN 1 ELSE 0 END) as harian,
          SUM(CASE WHEN YEARWEEK(visited_at, 1) = YEARWEEK(CURDATE(), 1) THEN 1 ELSE 0 END) as mingguan,
          SUM(CASE WHEN MONTH(visited_at) = MONTH(CURDATE()) AND YEAR(visited_at) = YEAR(CURDATE()) THEN 1 ELSE 0 END) as bulanan,
          SUM(CASE WHEN YEAR(visited_at) = YEAR(CURDATE()) THEN 1 ELSE 0 END) as tahunan
        FROM visitors
      `);
      if (visRows) visStats = visRows;
    } catch(e) {
      console.warn("Visitors table not ready:", e.message);
    }

    const [status_counts] = await pool.query("SELECT status, COUNT(*) as count FROM orders GROUP BY status");
    
    // Status mapping
    const statuses = { 'pending dp': 0, 'proses': 0, 'revisi': 0, 'selesai': 0, 'batal': 0 };
    let total_active = 0;
    status_counts.forEach(row => {
      const key = (row.status || '').toLowerCase().trim();
      if (statuses[key] !== undefined) statuses[key] = row.count;
      total_active += row.count;
    });

    res.json({
      success: true,
      stats: {
        users: {
          Harian: Number(usersRows.harian || 0),
          Mingguan: Number(usersRows.mingguan || 0),
          Bulanan: Number(usersRows.bulanan || 0),
          Tahunan: Number(usersRows.tahunan || 0)
        },
        orders: {
          Harian: Number(ordersRows.harian || 0),
          Mingguan: Number(ordersRows.mingguan || 0),
          Bulanan: Number(ordersRows.bulanan || 0),
          Tahunan: Number(ordersRows.tahunan || 0)
        },
        visitors: {
          Harian: Number(visStats.harian || 0),
          Mingguan: Number(visStats.mingguan || 0),
          Bulanan: Number(visStats.bulanan || 0),
          Tahunan: Number(visStats.tahunan || 0)
        },
        statuses: statuses,
        total_orders: total_active
      }
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ success: false });
  }
};

// --- Timeline API ---

exports.getTimelineItems = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT setting_key, setting_value FROM settings WHERE section = 'timeline_items'"
    );
    const timelines = rows.map(r => JSON.parse(r.setting_value));
    res.json({ success: true, data: timelines });
  } catch (error) {
    console.error("Get timelines error:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil data timeline" });
  }
};

exports.saveTimelineItem = async (req, res) => {
  try {
    const { 
      step_number, step_label, icon, title, slug, 
      short_description, description, image, image_alt, 
      button_text, button_link, layout_position, sort_order, 
      status, meta_title, meta_description 
    } = req.body;
    
    if (!slug || !title) {
      return res.status(400).json({ success: false, message: "Slug dan Title wajib diisi." });
    }

    const timelineData = {
      step_number, step_label, icon, title, slug, 
      short_description, description, image, image_alt, 
      button_text, button_link, layout_position, sort_order, 
      status, meta_title, meta_description
    };

    // Replace based on slug
    await pool.query(
      "REPLACE INTO settings (section, setting_key, setting_value) VALUES ('timeline_items', ?, ?)",
      [slug, JSON.stringify(timelineData)]
    );

    res.json({ success: true, message: "Timeline berhasil disimpan." });
  } catch (error) {
    console.error("Save timeline error:", error);
    res.status(500).json({ success: false, message: "Gagal menyimpan timeline." });
  }
};

exports.deleteTimelineItem = async (req, res) => {
  try {
    const { slug } = req.params;
    if (!slug) return res.status(400).json({ success: false, message: "Slug diperlukan." });

    await pool.query(
      "DELETE FROM settings WHERE section = 'timeline_items' AND setting_key = ?",
      [slug]
    );
    res.json({ success: true, message: "Timeline berhasil dihapus." });
  } catch (error) {
    console.error("Delete timeline error:", error);
    res.status(500).json({ success: false, message: "Gagal menghapus timeline." });
  }
};

// --- Hero Sections API ---

exports.getHeroItems = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT setting_key, setting_value FROM settings WHERE section = 'hero_items'"
    );
    const heroes = rows.map(r => {
      try {
        return { ...JSON.parse(r.setting_value), setting_key: r.setting_key };
      } catch (error) {
        return { setting_key: r.setting_key };
      }
    }).sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0));
    res.json({ success: true, data: heroes });
  } catch (error) {
    console.error("Get heroes error:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil data hero sections." });
  }
};

exports.saveHeroItem = async (req, res) => {
  try {
    const { 
      badge, title, highlight_title, description, button_text, button_link, 
      background_image, background_overlay, sort_order, status, slug 
    } = req.body;
    
    // Use slug as setting_key. If not provided, generate a unique one.
    const heroSlug = (slug || title || "hero-" + Date.now()).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const originalKey = (req.body.original_key || "").trim();

    if (!heroSlug) {
      return res.status(400).json({ success: false, message: "Slug atau Judul Utama wajib diisi." });
    }

    const heroData = {
      badge: (badge || "").trim(), 
      title: (title || "").trim(), 
      highlight_title: (highlight_title || "").trim(), 
      description: (description || "").trim(), 
      button_text: (button_text || "").trim(), 
      button_link: (button_link || "").trim(), 
      background_image: (background_image || "").trim(), 
      background_overlay: (background_overlay || "").trim(), 
      sort_order: Number.parseInt(sort_order, 10) || 0, 
      status: status === "non-active" ? "non-active" : "active", 
      slug: heroSlug 
    };

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      if (originalKey && originalKey !== heroSlug) {
        await connection.query("DELETE FROM settings WHERE section = 'hero_items' AND setting_key = ?", [originalKey]);
      }

      await connection.query(
        "INSERT INTO settings (section, setting_key, setting_value) VALUES ('hero_items', ?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)",
        [heroSlug, JSON.stringify(heroData)]
      );

      await connection.commit();
      res.json({ success: true, message: "Hero Section berhasil disimpan." });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Save hero error:", error);
    res.status(500).json({ success: false, message: "Gagal menyimpan hero section." });
  }
};

exports.deleteHeroItem = async (req, res) => {
  try {
    const { slug } = req.params;
    if (!slug) return res.status(400).json({ success: false, message: "Slug diperlukan." });

    await pool.query(
      "DELETE FROM settings WHERE section = 'hero_items' AND setting_key = ?",
      [slug]
    );
    res.json({ success: true, message: "Hero Section berhasil dihapus." });
  } catch (error) {
    console.error("Delete hero error:", error);
    res.status(500).json({ success: false, message: "Gagal menghapus hero section." });
  }
};

// --- FAQ API ---

exports.getFaqItems = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT setting_key, setting_value FROM settings WHERE section = 'faq_items'"
    );
    const faqs = rows.map(r => {
      try {
        return { ...JSON.parse(r.setting_value), setting_key: r.setting_key };
      } catch (error) {
        return { setting_key: r.setting_key };
      }
    }).sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0));
    res.json({ success: true, data: faqs });
  } catch (error) {
    console.error("Get faqs error:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil data FAQ." });
  }
};

exports.saveFaqItem = async (req, res) => {
  try {
    const { question, answer, sort_order, status, slug } = req.body;
    
    // Use slug as setting_key. If not provided, generate a unique one based on question.
    const faqSlug = (slug || question || "faq-" + Date.now()).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const originalKey = (req.body.original_key || "").trim();

    if (!faqSlug || !question) {
      return res.status(400).json({ success: false, message: "Pertanyaan wajib diisi." });
    }

    const faqData = {
      question: question.trim(), 
      answer: (answer || "").trim(), 
      sort_order: Number.parseInt(sort_order, 10) || 0, 
      status: status === "non-active" ? "non-active" : "active", 
      slug: faqSlug 
    };

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      if (originalKey && originalKey !== faqSlug) {
        await connection.query("DELETE FROM settings WHERE section = 'faq_items' AND setting_key = ?", [originalKey]);
      }

      await connection.query(
        "INSERT INTO settings (section, setting_key, setting_value) VALUES ('faq_items', ?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)",
        [faqSlug, JSON.stringify(faqData)]
      );

      await connection.commit();
      res.json({ success: true, message: "FAQ berhasil disimpan." });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Save faq error:", error);
    res.status(500).json({ success: false, message: "Gagal menyimpan FAQ." });
  }
};

exports.deleteFaqItem = async (req, res) => {
  try {
    const { slug } = req.params;
    if (!slug) return res.status(400).json({ success: false, message: "Slug diperlukan." });

    await pool.query(
      "DELETE FROM settings WHERE section = 'faq_items' AND setting_key = ?",
      [slug]
    );
    res.json({ success: true, message: "FAQ berhasil dihapus." });
  } catch (error) {
    console.error("Delete faq error:", error);
    res.status(500).json({ success: false, message: "Gagal menghapus FAQ." });
  }
};

