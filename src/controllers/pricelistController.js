const { pool } = require("../config/db");

exports.getPricelists = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM pricelists ORDER BY id DESC");
    res.json({ success: true, pricelists: rows });
  } catch (err) {
    console.error("Error fetching pricelists:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.createPricelist = async (req, res) => {
  const { name, service_type, price, features, status } = req.body;
  
  if (!name || !service_type || !price) {
    return res.status(400).json({ success: false, message: "Name, service type, and price are required" });
  }

  try {
    await pool.query(
      "INSERT INTO pricelists (name, service_type, price, features, status) VALUES (?, ?, ?, ?, ?)",
      [name, service_type, price, features || "", status || "Active"]
    );
    res.json({ success: true, message: "Pricelist created successfully" });
  } catch (err) {
    console.error("Error creating pricelist:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updatePricelist = async (req, res) => {
  const { id } = req.params;
  const { name, service_type, price, features, status } = req.body;

  if (!name || !service_type || !price) {
    return res.status(400).json({ success: false, message: "Name, service type, and price are required" });
  }

  try {
    await pool.query(
      "UPDATE pricelists SET name=?, service_type=?, price=?, features=?, status=? WHERE id=?",
      [name, service_type, price, features || "", status || "Active", id]
    );
    res.json({ success: true, message: "Pricelist updated successfully" });
  } catch (err) {
    console.error("Error updating pricelist:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deletePricelist = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM pricelists WHERE id=?", [id]);
    res.json({ success: true, message: "Pricelist deleted successfully" });
  } catch (err) {
    console.error("Error deleting pricelist:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
