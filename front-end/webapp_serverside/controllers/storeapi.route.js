const express = require('express');
const router = express.Router();
const storeRepo = require('../utils/store.repository');
const pool = require('../utils/db.include');

// Get all stores
router.get('/list', async (request, response) => {
    try {
        const stores = await storeRepo.getAllStores();
        response.json(stores);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

// Get stores with specific car and features
router.get('/available/:carId', async (request, response) => {
    try {
        const carId = request.params.carId;
        const featureIds = request.query.features ? request.query.features.split(',') : [];

        let sql;
        let params;

        if (featureIds.length === 0) {
            // If no features selected, get all stores with the car
            sql = `
                SELECT DISTINCT s.*
                FROM store s
                         JOIN conn_C_S cs ON s.store_id = cs.store_id
                WHERE cs.car_id = ?
            `;
            params = [carId];
        } else {
            // Get stores that have the car and all selected features
            sql = `
                SELECT DISTINCT s.*
                FROM store s
                         JOIN conn_C_S cs ON s.store_id = cs.store_id
                         JOIN conn_CS_F csf ON cs.C_S_id = csf.C_S_id
                WHERE cs.car_id = ?
                  AND csf.feat_id IN (${featureIds.map(() => '?').join(',')})
                GROUP BY s.store_id
                HAVING COUNT(DISTINCT csf.feat_id) = ?
            `;
            params = [carId, ...featureIds, featureIds.length];
        }

        const [rows] = await pool.execute(sql, params);
        response.json(rows);
    } catch (error) {
        console.error('Error in store availability:', error);
        response.status(500).json({ message: error.message });
    }
});

// Get one store
router.get('/show/:storeId', async (request, response) => {
    try {
        const store = await storeRepo.getOneStore(request.params.storeId);
        if (store) {
            response.json(store);
        } else {
            response.status(404).json({ message: 'Store not found' });
        }
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

module.exports = router;