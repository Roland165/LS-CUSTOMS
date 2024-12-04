const express = require('express');
const router = express.Router();
const featureRepo = require('../utils/features.repository');


router.get('/list', featureListAction);
router.get('/del/:featureId', featureDelAction);
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


module.exports = router;