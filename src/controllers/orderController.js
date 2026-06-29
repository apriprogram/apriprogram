const { pool } = require("../config/db");

exports.createOrder = async (req, res) => {
  const { 
    user_id: reqBodyUserId, website_type, package_name, package_price, project_name, domain_name, description, features, target_date, start_date, notes, 
    files, project_document, reference_links, primary_color, secondary_color, typography, design_style, payment_proof
  } = req.body;
  
  // Admin can create orders for other users
  const isAdmin = req.session.role === 'admin' || req.session.role === 'super admin';
  const user_id = isAdmin && reqBodyUserId ? reqBodyUserId : req.session.userId;

  if (!user_id) {
    return res.status(401).json({ success: false, message: "Silakan login terlebih dahulu." });
  }

  try {
    await pool.query(
      `INSERT INTO orders (
        user_id, website_type, package_name, package_price, project_name, domain_name, description, features, target_date, start_date, notes, 
        files, project_document, reference_links, primary_color, secondary_color, typography, design_style, payment_proof
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id, website_type, package_name, package_price, project_name, domain_name, description, features, target_date, start_date, notes, 
        JSON.stringify(files || []), project_document, reference_links, primary_color, secondary_color, typography, design_style, payment_proof
      ]
    );

    res.status(201).json({ success: true, message: "Pesanan berhasil dibuat." });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan saat menyimpan pesanan." });
  }
};

exports.getOrders = async (req, res) => {
  try {
    let query = "SELECT o.*, u.full_name, u.email, u.whatsapp FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC";
    const params = [];
    
    // If not super admin/admin, only fetch their own orders
    if (req.session.role !== 'admin' && req.session.role !== 'super admin') {
      query = "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC";
      params.push(req.session.userId);
    }
    
    const [orders] = await pool.query(query, params);
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil data pesanan." });
  }
};

exports.updateOrder = async (req, res) => {
  const orderId = req.params.id;
  const { 
    website_type, package_name, package_price, project_name, domain_name, description, features, target_date, start_date, notes, 
    reference_links, primary_color, secondary_color, typography, design_style, status, user_id, project_document, payment_proof
  } = req.body;

  try {
    let updateQuery = `
      UPDATE orders SET 
        website_type = ?, package_name = ?, package_price = ?, project_name = ?, domain_name = ?, description = ?, features = ?, 
        target_date = ?, start_date = ?, notes = ?, reference_links = ?, primary_color = ?, secondary_color = ?, 
        typography = ?, design_style = ?, status = ?, project_document = ?, payment_proof = ?
    `;
    let queryParams = [
      website_type, package_name, package_price, project_name, domain_name, description, features, target_date, start_date, notes, 
      reference_links, primary_color, secondary_color, typography, design_style, status, project_document, payment_proof
    ];

    if (user_id) {
      updateQuery += `, user_id = ?`;
      queryParams.push(user_id);
    }

    updateQuery += ` WHERE id = ?`;
    queryParams.push(orderId);

    const [result] = await pool.query(updateQuery, queryParams);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Pesanan tidak ditemukan." });
    }

    res.json({ success: true, message: "Pesanan berhasil diperbarui." });
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan saat memperbarui pesanan." });
  }
};

exports.deleteOrder = async (req, res) => {
  const orderId = req.params.id;
  const path = require('path');
  const fs = require('fs');

  try {
    // Fetch file paths before deleting record
    const [rows] = await pool.query(
      "SELECT project_document, payment_proof FROM orders WHERE id = ?",
      [orderId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Pesanan tidak ditemukan." });
    }

    const order = rows[0];

    // Delete attached files from disk (multiple files separated by comma)
    const deleteFiles = (filePaths) => {
      if (!filePaths) return;
      filePaths.split(',').forEach(filePath => {
        const trimmed = filePath.trim();
        if (!trimmed) return;
        // Convert URL path to filesystem path
        const relPath = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
        const absPath = path.join(__dirname, '../../public', relPath.replace(/^public\//, ''));
        if (fs.existsSync(absPath)) {
          fs.unlinkSync(absPath);
        }
      });
    };

    deleteFiles(order.project_document);
    deleteFiles(order.payment_proof);

    // Now delete the order record only (user remains untouched)
    await pool.query("DELETE FROM orders WHERE id = ?", [orderId]);
    res.json({ success: true, message: "Pesanan berhasil dihapus beserta file terkait." });
  } catch (error) {
    console.error("Delete order error:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan saat menghapus pesanan." });
  }
};

exports.saveInvoice = async (req, res) => {
  const orderId = req.params.id;
  const invoiceData = req.body;

  if (!invoiceData) {
    return res.status(400).json({ success: false, message: "Data invoice tidak ditemukan." });
  }

  try {
    const discount = parseFloat(invoiceData.discount) || 0;
    const taxPct = parseFloat(invoiceData.tax_pct) || 0;

    const [result] = await pool.query(
      "UPDATE orders SET invoice_data = ?, discount = ?, tax_pct = ? WHERE id = ?",
      [JSON.stringify(invoiceData), discount, taxPct, orderId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Pesanan tidak ditemukan." });
    }
    res.json({ success: true, message: "Invoice berhasil disimpan." });
  } catch (error) {
    console.error("Save invoice error:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan saat menyimpan invoice." });
  }
};
