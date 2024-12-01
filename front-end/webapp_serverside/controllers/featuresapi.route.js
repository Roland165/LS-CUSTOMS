const express = require('express');
const router = express.Router();
const brandRepo = require('../utils/brands.repository');
const carRepo = require('../utils/cars.repository');
const featureRepo = require('../utils/features.repository');


router.get('/list', featureListAction);
router.post('/add', addFeatureAction);


async function featureListAction(request, response) {
    try {
        const features = await featureRepo.getAllFeatures();
        response.json(features);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
}

async function addFeatureAction(request, response) {
    console.log('Received feature data:', request.body);
    try {
        const featureData = {
            feature_name: request.body.feature_name,
            feature_price: request.body.feature_price,
            feature_color: request.body.feature_color,
            feature_added_power: request.body.feature_added_power,
            feature_added_weight: request.body.feature_added_weight
        };

        const featureId = await featureRepo.addOneFeature(brandData);

        response.json({
            success: true,
            brandId: brandId,
            message: 'Brand added successfully'
        });
    } catch (error) {
        console.error('Error in add brand route:', error);
        response.status(500).json({
            success: false,
            message: error.message || 'Failed to add brand'
        });
    }
};

router.delete('/del/:brandId', async (request, response) => {
    try {
        const brandId = request.params.brandId;

        const cars = await carRepo.getCarsByBrand(brandId);
        if (cars.length > 0) {
            return response.status(400).json({
                success: false,
                message: 'Cannot delete brand with associated cars'
            });
        }

        const numRows = await brandRepo.delOneBrand(brandId);
        response.json({
            success: true,
            rowsDeleted: numRows
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            message: error.message
        });
    }
});


module.exports = router;