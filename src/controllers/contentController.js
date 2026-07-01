const { pool } = require("../config/db");

exports.getContents = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM contents ORDER BY sort_order ASC, created_at DESC");
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Error fetching contents:", err);
    res.status(500).json({ success: false, message: "Gagal mengambil data konten." });
  }
};

exports.saveContent = async (req, res) => {
  try {
    const {
      id,
      title,
      idea_summary,
      background,
      problem,
      objective,
      target_audience,
      concept,
      angle,
      value_provided,
      opening,
      narrative,
      outline,
      content_body,
      cta,
      seo_keywords,
      references,
      assets,
      notes
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Judul Konten wajib diisi." });
    }

    if (id) {
      // Update
      const query = `
        UPDATE contents 
        SET title = ?, idea_summary = ?, background = ?, problem = ?, objective = ?, 
            target_audience = ?, concept = ?, angle = ?, value_provided = ?, opening = ?, 
            narrative = ?, outline = ?, content_body = ?, cta = ?, seo_keywords = ?, 
            \`references\` = ?, assets = ?, notes = ?
        WHERE id = ?
      `;
      await pool.execute(query, [
        title, idea_summary || '', background || '', problem || '', objective || '',
        target_audience || '', concept || '', angle || '', value_provided || '', opening || '',
        narrative || '', outline || '', content_body || '', cta || '', seo_keywords || '',
        references || '', assets || '', notes || '', id
      ]);
      res.json({ success: true, message: "Konten berhasil diperbarui." });
    } else {
      // Insert
      const query = `
        INSERT INTO contents (
          title, idea_summary, background, problem, objective, target_audience, concept, 
          angle, value_provided, opening, narrative, outline, content_body, cta, seo_keywords, 
          \`references\`, assets, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const [result] = await pool.execute(query, [
        title, idea_summary || '', background || '', problem || '', objective || '',
        target_audience || '', concept || '', angle || '', value_provided || '', opening || '',
        narrative || '', outline || '', content_body || '', cta || '', seo_keywords || '',
        references || '', assets || '', notes || ''
      ]);
      res.json({ success: true, message: "Konten berhasil ditambahkan.", data: { id: result.insertId } });
    }
  } catch (err) {
    console.error("Error saving content:", err);
    res.status(500).json({ success: false, message: "Gagal menyimpan konten." });
  }
};

exports.deleteContent = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute("DELETE FROM contents WHERE id = ?", [id]);
    res.json({ success: true, message: "Konten berhasil dihapus." });
  } catch (err) {
    console.error("Error deleting content:", err);
    res.status(500).json({ success: false, message: "Gagal menghapus konten." });
  }
};

exports.toggleCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_completed } = req.body;
    await pool.execute("UPDATE contents SET is_completed = ? WHERE id = ?", [is_completed ? 1 : 0, id]);
    res.json({ success: true, message: "Status konten diperbarui." });
  } catch (err) {
    console.error("Error updating content status:", err);
    res.status(500).json({ success: false, message: "Gagal memperbarui status konten." });
  }
};

exports.reorderContents = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: "Invalid payload." });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      for (const item of items) {
        await connection.execute(
          "UPDATE contents SET sort_order = ? WHERE id = ?",
          [item.sort_order, item.id]
        );
      }
      await connection.commit();
      res.json({ success: true, message: "Urutan berhasil diperbarui." });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("Error reordering contents:", err);
    res.status(500).json({ success: false, message: "Gagal memperbarui urutan." });
  }
};
