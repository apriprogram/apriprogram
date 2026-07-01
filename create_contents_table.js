const { pool } = require('./src/config/db');

async function createTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS contents (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        idea_summary TEXT,
        background TEXT,
        problem TEXT,
        objective TEXT,
        target_audience TEXT,
        concept TEXT,
        angle TEXT,
        value_provided TEXT,
        opening TEXT,
        narrative TEXT,
        outline TEXT,
        content_body LONGTEXT,
        cta TEXT,
        seo_keywords TEXT,
        \`references\` TEXT,
        assets TEXT,
        notes TEXT,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await pool.execute(query);
    console.log("Contents table created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error creating table:", err);
    process.exit(1);
  }
}

createTable();
