const express = require('express');
const router = express.Router();
const featureRepo = require('../utils/features.repository');


router.get('/list', featureListAction);
router.get('/del/:featureId', featureDelAction);
router.post('/add', addFeatureAction);
router.get('/show/:featureId', featureShowAction);
router.post('/update/:featureId', featureEditAction);


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

        const featureId = await featureRepo.addOneFeature(featureData);

        response.json({
            success: true,
            featureId: featureId,
            message: 'Feature added successfully'
        });
    } catch (error) {
        console.error('Error in add feature route:', error);
        response.status(500).json({
            success: false,
            message: error.message || 'Failed to add feature'
        });
    }
};

async function featureDelAction(request, response) {
    try {
        const featureId = request.params.featureId;
        const feature = await featureRepo.getOneFeature(featureId);


        if (!feature) {
            return response.status(404).json({ message: 'Feature not found' });
        }


        const numRows = await featureRepo.delOneFeature(featureId);
        console.log("NUMROWS: " + numRows)

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
}

async function featureShowAction(request, response) {
    try {
        const featureId = request.params.featureId;
        const feature = await featureRepo.getOneFeature(featureId);

        // Check feature existence
        if (!feature) {
            return response.status(404).json({
                success: false,
                message: 'feature not found'
            });
        }

        response.json(feature);
    } catch (error) {
        console.error('Error:', error);
        response.status(500).json({
            success: false,
            message: error.message
        });
    }
};

async function featureEditAction(request, response) {
    console.log('Received update request with body:', request.body);

    try {
        const featureId = request.params.featureId;
        const featureData = {
            feature_name: request.body.feature_name || '',
            feature_price: request.body.feature_price || 0,
            feature_color: request.body.feature_color || '',
            feature_added_power: request.body.feature_added_power || 0,
            feature_added_weight: request.body.feature_added_weight || 0
        };

        // Validate required fields
        if (!featureData.feature_name) {
            return response.status(400).json({
                success: false,
                message: 'feature name is required'
            });
        }

        console.log('Processed feature data:', featureData);

        const result = await featureRepo.editOneFeature(featureId, featureData);

        response.json({
            success: true,
            message: 'feature updated successfully',
            updatedRows: result
        });
    } catch (error) {
        console.error('Update error:', error);
        response.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = router;