const { pool } = require("../config/db");

function normalizeFeatures(features) {
  if (Array.isArray(features)) return JSON.stringify(features.filter(Boolean));
  if (typeof features !== 'string') return JSON.stringify([]);

  const trimmed = features.trim();
  if (!trimmed) return JSON.stringify([]);

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return JSON.stringify(parsed.filter(Boolean));
  } catch (error) {
    // Fall back to comma/newline splitting.
  }

  return JSON.stringify(trimmed.split(/\r?\n|,/).map(item => item.trim()).filter(Boolean));
}

function parseFeatures(features) {
  if (!features) return [];
  if (Array.isArray(features)) return features;
  try {
    const parsed = JSON.parse(features);
    if (Array.isArray(parsed)) return parsed;
  } catch (error) {
    // Fall back below.
  }
  return String(features).split(/\r?\n|,/).map(item => item.trim()).filter(Boolean);
}

function mapPricelist(row) {
  return {
    ...row,
    features: parseFeatures(row.features),
    is_popular: Number(row.is_popular || 0) === 1
  };
}

exports.getPublicPricelists = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM pricelists WHERE status = 'Active' ORDER BY service_type ASC, sort_order ASC, id ASC"
    );
    res.json({ success: true, pricelists: rows.map(mapPricelist) });
  } catch (err) {
    console.error("Error fetching public pricelists:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getPricelists = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM pricelists ORDER BY service_type ASC, sort_order ASC, id ASC");
    res.json({ success: true, pricelists: rows.map(mapPricelist) });
  } catch (err) {
    console.error("Error fetching pricelists:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.createPricelist = async (req, res) => {
  const { name, service_type, price, target, duration, features, is_popular, sort_order, status } = req.body;
  
  if (!name || !service_type || !price) {
    return res.status(400).json({ success: false, message: "Nama paket, jenis website, dan harga wajib diisi" });
  }

  try {
    await pool.query(
      `INSERT INTO pricelists (name, service_type, price, target, duration, features, is_popular, sort_order, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        service_type,
        price,
        target || "",
        duration || "",
        normalizeFeatures(features),
        is_popular ? 1 : 0,
        Number.parseInt(sort_order, 10) || 0,
        status || "Active"
      ]
    );
    res.json({ success: true, message: "Pricelist berhasil dibuat" });
  } catch (err) {
    console.error("Error creating pricelist:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updatePricelist = async (req, res) => {
  const { id } = req.params;
  const { name, service_type, price, target, duration, features, is_popular, sort_order, status } = req.body;

  if (!name || !service_type || !price) {
    return res.status(400).json({ success: false, message: "Nama paket, jenis website, dan harga wajib diisi" });
  }

  try {
    await pool.query(
      `UPDATE pricelists SET
        name = ?, service_type = ?, price = ?, target = ?, duration = ?, features = ?, is_popular = ?, sort_order = ?, status = ?
       WHERE id = ?`,
      [
        name,
        service_type,
        price,
        target || "",
        duration || "",
        normalizeFeatures(features),
        is_popular ? 1 : 0,
        Number.parseInt(sort_order, 10) || 0,
        status || "Active",
        id
      ]
    );
    res.json({ success: true, message: "Pricelist berhasil diperbarui" });
  } catch (err) {
    console.error("Error updating pricelist:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deletePricelist = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM pricelists WHERE id=?", [id]);
    res.json({ success: true, message: "Pricelist berhasil dihapus" });
  } catch (err) {
    console.error("Error deleting pricelist:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};