const { USE_DB } = require('./config');

// ── DB MODE ───────────────────────────────────────────────────────────────────
// Active when USE_DB=true (default).
// Requires MySQL + back-end/lscustoms_create.sql / lscustoms_insert.sql
const pool = USE_DB ? require('./db.include') : null;

// ── JSON MODE ─────────────────────────────────────────────────────────────────
// Active when USE_DB=false. Static read-only data, no database needed.
// Write operations (add / edit / delete) are disabled and throw an error.
const WRITE_DISABLED = 'Write operations require a database (set USE_DB=true and configure MySQL).';

let carsData, brandsData, connCsData, featuresData, csFeatMap;
if (!USE_DB) {
    carsData     = require('../data/cars.json');
    brandsData   = require('../data/brands.json');
    connCsData   = require('../data/conn_c_s.json');
    featuresData = require('../data/features.json');

    // conn_cs_f.json stores { "feat_id": [C_S_id, ...] }
    // Build the reverse map { C_S_id: [feat_id, ...] } for fast lookup
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
    async getAllCars() {
        if (USE_DB) {
            // ── original DB code ──────────────────────────────────────────────
            try {
                let sql = `
                    SELECT c.*, b.brand_name
                    FROM car c
                    JOIN brand b ON c.brand_id = b.brand_id
                `;
                const [rows] = await pool.execute(sql);
                console.log("Cars fetched:", rows.length);
                return rows;
            } catch (err) {
                console.error("Error in getAllCars:", err);
                throw err;
            }
            // ─────────────────────────────────────────────────────────────────
        } else {
            return carsData.map(c => ({
                ...c,
                brand_name: (brandsData.find(b => b.brand_id === c.brand_id) || {}).brand_name || null
            }));
        }
    },

    async getOneCar(carId) {
        if (USE_DB) {
            // ── original DB code ──────────────────────────────────────────────
            try {
                let sql = `
                    SELECT c.*, b.brand_name
                    FROM car c
                    JOIN brand b ON c.brand_id = b.brand_id
                    WHERE c.car_id = ?
                `;
                const [rows] = await pool.execute(sql, [carId]);
                return rows[0];
            } catch (err) {
                console.error("Error in getOneCar:", err);
                throw err;
            }
            // ─────────────────────────────────────────────────────────────────
        } else {
            const car = carsData.find(c => c.car_id === parseInt(carId));
            if (!car) return undefined;
            const brand = brandsData.find(b => b.brand_id === car.brand_id);
            return { ...car, brand_name: brand ? brand.brand_name : null };
        }
    },

    async addOneCar(car) {
        if (USE_DB) {
            // ── original DB code ──────────────────────────────────────────────
            try {
                let sql = `
                    INSERT INTO car (
                        brand_id, car_name, car_seat_num,
                        car_creation_date, car_base_power,
                        car_base_weight, car_base_price
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)
                `;
                const [result] = await pool.execute(sql, [
                    car.brand_id,
                    car.car_name,
                    car.car_seat_num,
                    car.car_creation_date,
                    car.car_base_power,
                    car.car_base_weight,
                    car.car_base_price
                ]);

                //insert the new car into conn_C_S table with store LS_Origins so that we can link features to it.
                let sqlConn = `INSERT INTO conn_C_S (car_id, store_id) VALUES (?, 4)`;
                const [resultConn] = await pool.execute(sqlConn, [parseInt(result.insertId)]);

                return result.insertId;
            } catch (err) {
                console.error("Error in addOneCar:", err);
                throw err;
            }
            // ─────────────────────────────────────────────────────────────────
        } else {
            throw new Error(WRITE_DISABLED);
        }
    },

    async delOneCar(carId) {
        if (USE_DB) {
            // ── original DB code ──────────────────────────────────────────────
            try {
                // Delete related records first
                await pool.execute("DELETE FROM conn_CS_F WHERE C_S_id IN (SELECT C_S_id FROM conn_C_S WHERE car_id = ?)", [carId]);
                await pool.execute("DELETE FROM conn_C_S WHERE car_id = ?", [carId]);

                // Then delete the car
                let sql = "DELETE FROM car WHERE car_id = ?";
                const [result] = await pool.execute(sql, [carId]);
                return result.affectedRows;
            } catch (err) {
                console.error("Error in delOneCar:", err);
                throw err;
            }
            // ─────────────────────────────────────────────────────────────────
        } else {
            throw new Error(WRITE_DISABLED);
        }
    },

    async editOneCar(carId, car) {
        if (USE_DB) {
            // ── original DB code ──────────────────────────────────────────────
            const connection = await pool.getConnection();
            try {
                await connection.beginTransaction();

                console.log('Editing car details:', { carId, car });

                let sql = `
                    UPDATE car SET
                                   brand_id = ?,
                                   car_name = ?,
                                   car_seat_num = ?,
                                   car_creation_date = ?,
                                   car_base_power = ?,
                                   car_base_weight = ?,
                                   car_base_price = ?
                    WHERE car_id = ?
                `;

                const params = [
                    car.brand_id,
                    car.car_name,
                    car.car_seat_num,
                    car.car_creation_date,
                    car.car_base_power,
                    car.car_base_weight,
                    car.car_base_price,
                    carId
                ];

                params.forEach((param, index) => {
                    if (param === undefined || param === null) {
                        console.error(`Invalid parameter at index ${index}: ${param}`);
                        throw new Error(`Invalid parameter at index ${index}`);
                    }
                });

                const [result] = await connection.execute(sql, params);
                await connection.commit();
                console.log('Update result:', result);

                return result.affectedRows;
            } catch (err) {
                console.error("Error in editOneCar:", err);
                throw err;
            } finally {
                connection.release();
            }
            // ─────────────────────────────────────────────────────────────────
        } else {
            throw new Error(WRITE_DISABLED);
        }
    },

    async getCarFeatures(carId) {
        if (USE_DB) {
            // ── original DB code ──────────────────────────────────────────────
            try {
                let sql = `
                    SELECT DISTINCT f.*
                    FROM feature f
                    JOIN conn_CS_F csf ON f.feature_id = csf.feat_id
                    JOIN conn_C_S cs ON csf.C_S_id = cs.C_S_id
                    WHERE cs.car_id = ?
                `;
                const [rows] = await pool.execute(sql, [carId]);
                return rows;
            } catch (err) {
                console.error("Error in getCarFeatures:", err);
                throw err;
            }
            // ─────────────────────────────────────────────────────────────────
        } else {
            const carIdInt = parseInt(carId);
            // Collect all C_S_ids for this car
            const carCsIds = connCsData
                .filter(cs => cs.car_id === carIdInt)
                .map(cs => cs.C_S_id);

            // Collect all unique feat_ids linked to those C_S_ids
            const featIds = new Set();
            for (const csId of carCsIds) {
                const feats = csFeatMap[csId] || [];
                feats.forEach(fId => featIds.add(fId));
            }

            return featuresData.filter(f => featIds.has(f.feature_id));
        }
    }
};
