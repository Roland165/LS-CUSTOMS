const pool = require('./db.include');

module.exports = {
    async getAllBrands() {
        try {
            let sql = "SELECT * FROM brand";
            const [rows] = await pool.execute(sql);
            return rows;
        } catch (err) {
            console.error("Error in getAllBrands:", err);
            throw err;
        }
    },

    async addOneBrand(brand) {
        try {
            console.log('Adding brand:', brand);
            let sql = `
                INSERT INTO brand (
                    brand_name,
                    brand_revenue,
                    brand_creation_date,
                    brand_creator,
                    brand_creation_place
                ) VALUES (?, ?, ?, ?, ?)
            `;
            const [result] = await pool.execute(sql, [
                brand.brand_name,
                brand.brand_revenue,
                brand.brand_creation_date,
                brand.brand_creator,
                brand.brand_creation_place
            ]);
            return result.insertId;
        } catch (err) {
            console.error("Error in addOneBrand:", err);
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