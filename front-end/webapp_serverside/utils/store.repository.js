const { USE_DB } = require('./config');

// ── DB MODE ───────────────────────────────────────────────────────────────────
// Active when USE_DB=true (default).
// Requires MySQL + back-end/lscustoms_create.sql / lscustoms_insert.sql
const pool = USE_DB ? require('./db.include') : null;

// ── JSON MODE ─────────────────────────────────────────────────────────────────
// Active when USE_DB=false. Static read-only data, no database needed.
let storesData, connCsData, csFeatMap;
if (!USE_DB) {
    storesData = require('../data/stores.json');
    connCsData = require('../data/conn_c_s.json');

    // conn_cs_f.json stores { "feat_id": [C_S_id, ...] }
    // Build the reverse map { C_S_id: [feat_id, ...] } for fast lookup
    // (same map used in cars.repository — each module builds its own copy)
    const connCsFRaw = require('../data/conn_cs_f.json');
    csFeatMap = {};
    for (const [featId, csIds] of Object.entries(connCsFRaw)) {
        for (const csId of csIds) {
            if (!csFeatMap[csId]) csFeatMap[csId] = [];
            csFeatMap[csId].push(parseInt(featId));
        }
    }
}

module.exports = {
    async getAllStores() {
        if (USE_DB) {
            // ── original DB code ──────────────────────────────────────────────
            try {
                let sql = "SELECT * FROM store";
                const [rows] = await pool.execute(sql);
                return rows;
            } catch (err) {
                console.error("Error in getAllStores:", err);
                throw err;
            }
            // ─────────────────────────────────────────────────────────────────
        } else {
            return storesData;
        }
    },

    async getStoresForConfiguration(carId, featureIds) {
        if (USE_DB) {
            // ── original DB code ──────────────────────────────────────────────
            // Finds stores that have the car AND all the requested features.
            try {
                let sql = `
                    SELECT DISTINCT s.*
                    FROM store s
                    JOIN conn_C_S cs ON s.store_id = cs.store_id
                    JOIN conn_CS_F csf ON cs.C_S_id = csf.C_S_id
                    WHERE cs.car_id = ?
                    AND csf.feat_id IN (?)
                    GROUP BY s.store_id
                    HAVING COUNT(DISTINCT csf.feat_id) = ?
                `;
                const [rows] = await pool.execute(sql, [carId, featureIds, featureIds.length]);
                return rows;
            } catch (err) {
                console.error("Error in getStoresForConfiguration:", err);
                throw err;
            }
            // ─────────────────────────────────────────────────────────────────
        } else {
            // JS equivalent of the SQL above:
            // For each store-car link (conn_C_S), check that ALL requested
            // features are available (conn_CS_F). Keep distinct qualifying stores.
            const carIdInt = parseInt(carId);
            const featIdInts = featureIds.map(Number);

            // 1. All conn_C_S rows for this car
            const carConns = connCsData.filter(cs => cs.car_id === carIdInt);

            // 2. Keep only conns where ALL requested features are present
            const qualifyingConns = carConns.filter(cs => {
                const available = csFeatMap[cs.C_S_id] || [];
                return featIdInts.every(fId => available.includes(fId));
            });

            // 3. Unique store_ids from qualifying conns
            const qualifyingStoreIds = [...new Set(qualifyingConns.map(cs => cs.store_id))];

            return storesData.filter(s => qualifyingStoreIds.includes(s.store_id));
        }
    },

    async getOneStore(storeId) {
        if (USE_DB) {
            // ── original DB code ──────────────────────────────────────────────
            try {
                let sql = "SELECT * FROM store WHERE store_id = ?";
                const [rows] = await pool.execute(sql, [storeId]);
                return rows[0];
            } catch (err) {
                console.error("Error in getOneStore:", err);
                throw err;
            }
            // ─────────────────────────────────────────────────────────────────
        } else {
            return storesData.find(s => s.store_id === parseInt(storeId));
        }
    }
};
