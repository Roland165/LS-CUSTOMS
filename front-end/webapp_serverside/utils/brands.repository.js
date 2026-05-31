const { USE_DB } = require('./config');

// ── DB MODE ───────────────────────────────────────────────────────────────────
// Active when USE_DB=true (default).
// Requires MySQL + back-end/lscustoms_create.sql / lscustoms_insert.sql
const pool = USE_DB ? require('./db.include') : null;

// ── JSON MODE ─────────────────────────────────────────────────────────────────
// Active when USE_DB=false. Static read-only data, no database needed.
// Write operations (add / edit / delete) are disabled and throw an error.
const WRITE_DISABLED = 'Write operations require a database (set USE_DB=true and configure MySQL).';
const brandsData = !USE_DB ? require('../data/brands.json') : null;
const carsData   = !USE_DB ? require('../data/cars.json')   : null;

module.exports = {
    async getAllBrands() {
        if (USE_DB) {
            // ── original DB code ──────────────────────────────────────────────
            try {
                let sql = "SELECT * FROM brand";
                const [rows] = await pool.execute(sql);
                return rows;
            } catch (err) {
                console.error("Error in getAllBrands:", err);
                throw err;
            }
            // ─────────────────────────────────────────────────────────────────
        } else {
            return brandsData;
        }
    },

    async getOneBrand(brandId) {
        if (USE_DB) {
            // ── original DB code ──────────────────────────────────────────────
            try {
                let sql = "SELECT * FROM brand WHERE brand_id = ?";
                const [rows] = await pool.execute(sql, [brandId]);
                // Return first row or null if not found
                return rows[0] || null;
            } catch (err) {
                console.error("Error in getOneBrand:", err);
                throw err;
            }
            // ─────────────────────────────────────────────────────────────────
        } else {
            return brandsData.find(b => b.brand_id === parseInt(brandId)) || null;
        }
    },

    async addOneBrand(brand) {
        if (USE_DB) {
            // ── original DB code ──────────────────────────────────────────────
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
            // ─────────────────────────────────────────────────────────────────
        } else {
            throw new Error(WRITE_DISABLED);
        }
    },

    async delOneBrand(brandId) {
        if (USE_DB) {
            // ── original DB code ──────────────────────────────────────────────
            try {
                let sql = "DELETE FROM brand WHERE brand_id = ?";
                const [result] = await pool.execute(sql, [brandId]);
                console.log("Brand deleted:", result.affectedRows);
                return result.affectedRows;
            } catch (err) {
                console.error("Error in delOneBrand:", err);
                throw err;
            }
            // ─────────────────────────────────────────────────────────────────
        } else {
            throw new Error(WRITE_DISABLED);
        }
    },

    async getCarsByBrand(brandId) {
        if (USE_DB) {
            // ── original DB code ──────────────────────────────────────────────
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
            // ─────────────────────────────────────────────────────────────────
        } else {
            const bid = parseInt(brandId);
            const brand = brandsData.find(b => b.brand_id === bid);
            return carsData
                .filter(c => c.brand_id === bid)
                .map(c => ({ ...c, brand_name: brand ? brand.brand_name : null }));
        }
    },

    async editOneBrand(brandId, brand) {
        if (USE_DB) {
            // ── original DB code ──────────────────────────────────────────────
            try {
                console.log('Updating brand:', brand);
                let sql = `
                UPDATE brand
                SET brand_name = ?,
                    brand_revenue = ?,
                    brand_creation_date = ?,
                    brand_creator = ?,
                    brand_creation_place = ?
                WHERE brand_id = ?
            `;
                const [result] = await pool.execute(sql, [
                    brand.brand_name,
                    brand.brand_revenue,
                    brand.brand_creation_date,
                    brand.brand_creator,
                    brand.brand_creation_place,
                    brandId
                ]);
                return result.affectedRows;
            } catch (err) {
                console.error("Error in editOneBrand:", err);
                throw err;
            }
            // ─────────────────────────────────────────────────────────────────
        } else {
            throw new Error(WRITE_DISABLED);
        }
    }
};
