const pool = require('./db.include');

module.exports = {
    async getAllCars() {
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
    },

    async getOneCar(carId) {
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
    },

    async addOneCar(car) {
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
    },

    async delOneCar(carId) {
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
    },

    async editOneCar(carId, car) {
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
    },

    async getCarFeatures(carId) {
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
    }
};