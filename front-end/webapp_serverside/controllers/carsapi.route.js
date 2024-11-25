const express = require('express');
const router = express.Router();
const carRepo = require('../utils/cars.repository');

router.get('/brands', brandListAction);
router.get('/list', carListAction);
router.get('/show/:carId', carShowAction); // The carId after the : is a parameter
router.get('/del/:carId', carDelAction);
router.post('/update/:carId', carUpdateAction);
router.get('/show/:carId/features', featureListAction);

// http://localhost:9000/carsapi/brands
async function brandListAction(request, response) {
    try {
        const brands = await carRepo.getAllBrands();
        response.json(brands);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
}

async function carListAction(request, response) {
    try {
        const cars = await carRepo.getAllCars();
        response.json(cars);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
}

async function carShowAction(request, response) {
    try {
        const oneCar = await carRepo.getOneCar(request.params.carId);
        response.json(oneCar);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
}

async function featureListAction(request, response) {
    try {
        const features = await carRepo.getCarFeatures(request.params.carId);
        response.json(features);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
}

async function carDelAction(request, response) {
    try {
        // TODO: First remove extras for the car, unless the car cannot be removed!!!
        const numRows = await carRepo.delOneCar(request.params.carId);
        let result = { rowsDeleted: numRows };
        response.json(result);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
}

async function carUpdateAction(request, response) {
    try {
        const carId = request.params.carId;
        const isFancy = request.body.car_isFancy ? 1 : 0;
        const numRows = await carRepo.editOneCar(carId,
            request.body.car_brand,
            request.body.car_name,
            request.body.car_baseprice,
            isFancy,
            request.body.car_realPrice);
        let result = { rowsUpdated: numRows };
        response.json(result);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
}

module.exports = router;