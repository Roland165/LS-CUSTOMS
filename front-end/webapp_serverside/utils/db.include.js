const { USE_DB } = require('./config');

// ── JSON MODE ─────────────────────────────────────────────────────────────────
// When USE_DB=false this module is not used; export null so repositories can
// safely require it without crashing (they guard with if (USE_DB) before use).
if (!USE_DB) {
    module.exports = null;
} else {
    // ── DB MODE ───────────────────────────────────────────────────────────────
    // Requires MySQL. Set DB_HOST / DB_USER / DB_PASS / DB_DATABASE in .env
    // and run back-end/lscustoms_create.sql + back-end/lscustoms_insert.sql
    const mysql = require('mysql2/promise');

    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || 'admin',
        database: process.env.DB_DATABASE || 'lscustoms',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    module.exports = pool;
}