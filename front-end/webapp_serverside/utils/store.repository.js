const pool = require('./db.include');

module.exports = {
    async getAllStores() {
        try {
            let sql = "SELECT * FROM store";
            const [rows] = await pool.execute(sql);
            return rows;
        } catch (err) {
            console.error("Error in getAllStores:", err);
            throw err;
        }
    },

    async getStoresForConfiguration(carId, featureIds) {
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
    },

    async getOneStore(storeId) {
        try {
            let sql = "SELECT * FROM store WHERE store_id = ?";
            const [rows] = await pool.execute(sql, [storeId]);
            return rows[0];
        } catch (err) {
            console.error("Error in getOneStore:", err);
            throw err;
        }
    }
};