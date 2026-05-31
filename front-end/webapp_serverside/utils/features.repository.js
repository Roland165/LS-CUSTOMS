const { USE_DB } = require('./config');

// ── DB MODE ───────────────────────────────────────────────────────────────────
// Active when USE_DB=true (default).
// Requires MySQL + back-end/lscustoms_create.sql / lscustoms_insert.sql
const pool = USE_DB ? require('./db.include') : null;

// ── JSON MODE ─────────────────────────────────────────────────────────────────
// Active when USE_DB=false. Static read-only data, no database needed.
// Write operations (add / edit / delete) are disabled and throw an error.
const WRITE_DISABLED = 'Write operations require a database (set USE_DB=true and configure MySQL).';
const featuresData = !USE_DB ? require('../data/features.json') : null;

module.exports = {
    async getAllFeatures() {
        if (USE_DB) {
            // ── original DB code ──────────────────────────────────────────────
            try {
                let sql = "SELECT * FROM feature";
                const [rows] = await pool.execute(sql);
                return rows;
            } catch (err) {
                console.error("Error in getAllFeatures:", err);
                throw err;
            }
            // ─────────────────────────────────────────────────────────────────
        } else {
            return featuresData;
        }
    },

    async addOneFeature(feature) {
        if (USE_DB) {
            // ── original DB code ──────────────────────────────────────────────
            try {
                console.log('Adding feature:', feature);
                let sql = `
                    INSERT INTO feature (
                        feature_name,
                        feature_price,
                        feature_color,
                        feature_added_power,
                        feature_added_weight
                    ) VALUES (?, ?, ?, ?, ?)
                `;
                const [result] = await pool.execute(sql, [
                    feature.feature_name,
                    feature.feature_price,
                    feature.feature_color,
                    feature.feature_added_power,
                    feature.feature_added_weight
                ]);
                return result.insertId;
            } catch (err) {
                console.error("Error in addOneFeature:", err);
                throw err;
            }
            // ─────────────────────────────────────────────────────────────────
        } else {
            throw new Error(WRITE_DISABLED);
        }
    },

    async delOneFeature(featureId) {
        if (USE_DB) {
            // ── original DB code ──────────────────────────────────────────────
            try {
                let sql = "DELETE FROM feature WHERE feature_id = ?";
                const [result] = await pool.execute(sql, [featureId]);
                console.log("Feature deleted:", result.affectedRows);
                return result.affectedRows;
            } catch (err) {
                console.error("Error in delOneFeature:", err);
                throw err;
            }
            // ─────────────────────────────────────────────────────────────────
        } else {
            throw new Error(WRITE_DISABLED);
        }
    },

    async getOneFeature(featureId) {
        if (USE_DB) {
            // ── original DB code ──────────────────────────────────────────────
            try {
                let sql = `
                    SELECT feature.* FROM feature WHERE feature.feature_id = ?
                `;
                const [rows] = await pool.execute(sql, [featureId]);
                return rows[0];
            } catch (err) {
                console.error("Error in getOneFeature:", err);
                throw err;
            }
            // ─────────────────────────────────────────────────────────────────
        } else {
            return featuresData.find(f => f.feature_id === parseInt(featureId));
        }
    },

    async editOneFeature(featureId, feature) {
        if (USE_DB) {
            // ── original DB code ──────────────────────────────────────────────
            try {
                console.log('Updating feature:', feature);
                let sql = `
                UPDATE feature
                SET feature_name = ?,
                    feature_price = ?,
                    feature_color = ?,
                    feature_added_power = ?,
                    feature_added_weight = ?
                WHERE feature_id = ?
            `;
                const [result] = await pool.execute(sql, [
                    feature.feature_name,
                    feature.feature_price,
                    feature.feature_color,
                    feature.feature_added_power,
                    feature.feature_added_weight,
                    featureId
                ]);
                return result.affectedRows;
            } catch (err) {
                console.error("Error in editOneFeature:", err);
                throw err;
            }
            // ─────────────────────────────────────────────────────────────────
        } else {
            throw new Error(WRITE_DISABLED);
        }
    }
};
