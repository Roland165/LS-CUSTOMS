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

    async delOneBrand(brandId) {
        try {
            let sql = "DELETE FROM brand WHERE brand_id = ?";
            const [result] = await pool.execute(sql, [brandId]);
            console.log("Brand deleted:", result.affectedRows);
            return result.affectedRows;
        } catch (err) {
            console.error("Error in delOneBrand:", err);
            throw err;
        }
    },

    async getCarsByBrand(brandId) {
        try {
            let sql = `
                SELECT c.*, b.brand_name
                FROM car c
                JOIN brand b ON c.brand_id = b.brand_id
                WHERE c.brand_id = ?
            `;
            const [rows] = await pool.execute(sql, [brandId]);
            return rows;
        } catch (err) {
            console.error("Error in getCarsByBrand:", err);
            throw err;
        }
    },
};