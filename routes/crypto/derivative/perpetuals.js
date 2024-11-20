const express = require('express');
const { getMetrics } = require('../../../controllers/crypto/derivative/perpetualsController');

const router = express.Router();

// Route pour 'crypto/derivative/perpetuals/metrics'
router.get('/metrics', getMetrics);

module.exports = router;