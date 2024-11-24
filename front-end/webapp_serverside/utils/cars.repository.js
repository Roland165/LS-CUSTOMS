const pool = require('./db.include');

module.exports = {
    getBlankCar() {
        return {
            "car_id": 0,
            "car_name": "",
            "car_seat_num": 0,
            "car_creation_date": new Date(),
            "car_base_power": 0,
            "car_base_weight": 0,
            "car_base_price": 0,
            "brand_id": 0
        };
    },

    async getAllBrands() {
        try {
            let sql = "SELECT * FROM brand";
            const [rows, fields] = await pool.execute(sql);
            console.log("BRANDS FETCHED: " + rows.length);
            return rows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    async getBrandById(brandId) {
        try {
            let sql = "SELECT * FROM brand WHERE brand_id = ?";
            const [rows, fields] = await pool.execute(sql, [brandId]);
            return rows[0];
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    async getAllCars() {
        try {
            let sql = `
                SELECT c.*, b.brand_name
                FROM car c
                JOIN brand b ON c.brand_id = b.brand_id
            `;
            const [rows, fields] = await pool.execute(sql);
            console.log("CARS FETCHED: " + rows.length);
            return rows;
        } catch (err) {
            console.log(err);
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
            const [rows, fields] = await pool.execute(sql, [brandId]);
            console.log("CARS FILTERED BY BRAND: " + rows.length);
            return rows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    async getCarsByName(name) {
        try {
            let sql = `
                SELECT c.*, b.brand_name
                FROM car c
                JOIN brand b ON c.brand_id = b.brand_id
                WHERE UPPER(c.car_name) LIKE UPPER(?)
            `;
            const [rows, fields] = await pool.execute(sql, [`%${name}%`]);
            console.log("CARS FILTERED: " + rows.length);
            return rows;
        } catch (err) {
            console.log(err);
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
            const [rows, fields] = await pool.execute(sql, [carId]);
            console.log("SINGLE CAR FETCHED: " + rows.length);
            if (rows.length == 1) {
                return rows[0];
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    async getCarFeatures(carId) {
        try {
            let sql = `
                SELECT f.*
                FROM feature f
                JOIN conn_CS_F csf ON f.feature_id = csf.feat_id
                JOIN conn_C_S cs ON csf.C_S_id = cs.C_S_id
                WHERE cs.car_id = ?
            `;
            const [rows, fields] = await pool.execute(sql, [carId]);
            console.log("CAR FEATURES FETCHED: " + rows.length);
            return rows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    async getCarStores(carId) {
        try {
            let sql = `
                SELECT s.*
                FROM store s
                JOIN conn_C_S cs ON s.store_id = cs.store_id
                WHERE cs.car_id = ?
            `;
            const [rows, fields] = await pool.execute(sql, [carId]);
            console.log("CAR STORES FETCHED: " + rows.length);
            return rows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    async delOneCar(carId) {
        try {
            // First delete related records in conn_CS_F and conn_C_S
            await pool.execute("DELETE FROM conn_CS_F WHERE C_S_id IN (SELECT C_S_id FROM conn_C_S WHERE car_id = ?)", [carId]);
            await pool.execute("DELETE FROM conn_C_S WHERE car_id = ?", [carId]);

            // Then delete the car
            let sql = "DELETE FROM car WHERE car_id = ?";
            const [okPacket, fields] = await pool.execute(sql, [carId]);
            console.log("DELETE " + JSON.stringify(okPacket));
            return okPacket.affectedRows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    async addOneCar(car) {
        try {
            let sql = `
                INSERT INTO car (
                    car_name, car_seat_num, car_creation_date,
                    car_base_power, car_base_weight, car_base_price, brand_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const [okPacket, fields] = await pool.execute(sql, [
                car.car_name,
                car.car_seat_num,
                car.car_creation_date,
                car.car_base_power,
                car.car_base_weight,
                car.car_base_price,
                car.brand_id
            ]);
            console.log("INSERT " + JSON.stringify(okPacket));
            return okPacket.insertId;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    async editOneCar(car) {
        try {
            let sql = `
                UPDATE car SET
                    car_name = ?,
                    car_seat_num = ?,
                    car_creation_date = ?,
                    car_base_power = ?,
                    car_base_weight = ?,
                    car_base_price = ?,
                    brand_id = ?
                WHERE car_id = ?
            `;
            const [okPacket, fields] = await pool.execute(sql, [
                car.car_name,
                car.car_seat_num,
                car.car_creation_date,
                car.car_base_power,
                car.car_base_weight,
                car.car_base_price,
                car.brand_id,
                car.car_id
            ]);
            console.log("UPDATE " + JSON.stringify(okPacket));
            return okPacket.affectedRows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    async addCarToStore(carId, storeId) {
        try {
            let sql = "INSERT INTO conn_C_S (car_id, store_id) VALUES (?, ?)";
            const [okPacket, fields] = await pool.execute(sql, [carId, storeId]);
            return okPacket.insertId;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    async addFeatureToCar(carId, storeId, featureId) {
        try {
            // First get the C_S_id
            let [rows] = await pool.execute(
                "SELECT C_S_id FROM conn_C_S WHERE car_id = ? AND store_id = ?",
                [carId, storeId]
            );

            if (rows.length === 0) {
                throw new Error('Car-Store combination not found');
            }

            let csId = rows[0].C_S_id;

            // Then add the feature
            let sql = "INSERT INTO conn_CS_F (C_S_id, feat_id) VALUES (?, ?)";
            const [okPacket, fields] = await pool.execute(sql, [csId, featureId]);
            return okPacket.insertId;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
};
