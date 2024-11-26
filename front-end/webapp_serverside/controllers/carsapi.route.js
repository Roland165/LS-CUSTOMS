const express = require('express');
const router = express.Router();
const carRepo = require('../utils/cars.repository');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadDir = path.join(__dirname, '../../webapp_clientside/src/medias/car_img');

try {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log('Created directory:', uploadDir);
    }
    console.log('Full upload directory path:', path.resolve(uploadDir));
} catch (error) {
    console.error('Error creating directory:', error);
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Existing routes
router.get('/brands', brandListAction);
router.get('/list', carListAction);
router.get('/show/:carId', carShowAction);
router.get('/del/:carId', carDelAction);
router.post('/update/:carId', carUpdateAction);
router.get('/show/:carId/features', featureListAction);

// New route for adding a car
router.post('/add-car', upload.single('image'), addCarAction);

// Existing action functions

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

async function addCarAction(request, response) {
    try {
        console.log('Received car data:', request.body);
        console.log('Received file:', request.file);

        const carData = {
            brand_id: request.body.brand_id,
            car_name: request.body.car_name,
            car_seat_num: request.body.car_seat_num,
            car_creation_date: request.body.car_creation_date,
            car_base_power: request.body.car_base_power,
            car_base_weight: request.body.car_base_weight,
            car_base_price: request.body.car_base_price
        };

        const carId = await carRepo.addOneCar(carData);

        response.json({
            success: true,
            carId: carId,
            message: 'Car added successfully'
        });
    } catch (error) {
        console.error('Error adding car:', error);
        response.status(500).json({
            success: false,
            message: error.message || 'Failed to add car'
        });
    }
}


module.exports = router;