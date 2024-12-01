const express = require('express');
const router = express.Router();
const carRepo = require('../utils/cars.repository');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../webapp_clientside/src/medias/car_img');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
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

// Route to get all cars
router.get('/list', carListAction);
router.get('/show/:carId', carShowAction);
router.get('/show/:carId/features', featureListAction);
router.get('/del/:carId', carDelAction);
router.post('/add-car', upload.single('image'), addCarAction);
router.post('/update/:carId', carUpdateAction);

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
        const carId = request.params.carId;
        const car = await carRepo.getOneCar(carId);

        if (!car) {
            return response.status(404).json({ message: 'Car not found' });
        }

        const numRows = await carRepo.delOneCar(carId);

        if (numRows > 0) {
            try {
                const formattedBrand = car.brand_name.split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join('');
                const formattedModel = car.car_name.replace(/[\s-()]/g, '');
                const imageName = `${formattedBrand}_${formattedModel}_img.jpg`;
                const imagePath = path.join(__dirname, '../../webapp_clientside/src/medias/car_img', imageName);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            } catch (imageError) {
                console.error('Error deleting image:', imageError);
            }
        }

        response.json({ rowsDeleted: numRows });
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
        response.json({ rowsUpdated: numRows });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
}

async function addCarAction(request, response) {
    try {
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
        response.status(500).json({
            success: false,
            message: error.message || 'Failed to add car'
        });
    }
}

module.exports = router;