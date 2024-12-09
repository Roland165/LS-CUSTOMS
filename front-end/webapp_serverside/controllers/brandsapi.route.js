const express = require('express');
const router = express.Router();
const brandRepo = require('../utils/brands.repository');
const carRepo = require('../utils/cars.repository');

router.get('/show/:brandId/cars', brandListCarsAction);

router.get('/show/:brandId', async (request, response) => {
    try {
        const brandId = request.params.brandId;
        const brand = await brandRepo.getOneBrand(brandId);
        response.json(brand);
    } catch (error) {
        console.error('Error:', error);
        response.status(500).json({
            success: false,
            message: error.message
        });
    }
});



router.get('/list', async (request, response) => {
    try {
        const brands = await brandRepo.getAllBrands();
        response.json(brands);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

router.post('/add', async (request, response) => {
    console.log('Received brand data:', request.body);
    try {
        const brandData = {
            brand_name: request.body.brand_name,
            brand_revenue: request.body.brand_revenue,
            brand_creation_date: request.body.brand_creation_date,
            brand_creator: request.body.brand_creator,
            brand_creation_place: request.body.brand_creation_place
        };

        const brandId = await brandRepo.addOneBrand(brandData);

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
});

router.delete('/del/:brandId', async (request, response) => {
    try {
        const brandId = request.params.brandId;

        const cars = await brandRepo.getCarsByBrand(brandId);
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
router.post('/update/:brandId', async (request, response) => {
    console.log('Received update request with body:', request.body);

    try {
        const brandId = request.params.brandId;
        const brandData = {
            brand_name: request.body.brand_name || '',
            brand_creation_date: request.body.brand_creation_date || new Date().toISOString().split('T')[0],
            brand_creator: request.body.brand_creator || '',
            brand_creation_place: request.body.brand_creation_place || '',
            brand_revenue: request.body.brand_revenue || 0
        };

        // Validate required fields
        if (!brandData.brand_name) {
            return response.status(400).json({
                success: false,
                message: 'Brand name is required'
            });
        }

        console.log('Processed brand data:', brandData);

        const result = await brandRepo.editOneBrand(brandId, brandData);

        response.json({
            success: true,
            message: 'Brand updated successfully',
            updatedRows: result
        });
    } catch (error) {
        console.error('Update error:', error);
        response.status(500).json({
            success: false,
            message: error.message
        });
    }
});


async function brandListCarsAction(request, response) {
    try {
        const cars = await brandRepo.getCarsByBrand(request.params.brandId);
        response.json(cars);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
}

module.exports = router;