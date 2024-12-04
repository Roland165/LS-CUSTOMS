const pool = require('./db.include');

module.exports = {
    async getAllFeatures() {
        try {
            let sql = "SELECT * FROM feature";
            const [rows] = await pool.execute(sql);
            return rows;
        } catch (err) {
            console.error("Error in getAllFeatures:", err);
            throw err;
        }
    },

    async addOneFeature(feature) {
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
    },

    async delOneFeature(featureId) {
        try {
            let sql = "DELETE FROM feature WHERE feature_id = ?";
            const [result] = await pool.execute(sql, [featureId]);
            console.log("Feature deleted:", result.affectedRows);
            return result.affectedRows;
        } catch (err) {
            console.error("Error in delOneFeature:", err);
            throw err;
        }
    },

    async getOneFeature(featureId) {
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
    },
};