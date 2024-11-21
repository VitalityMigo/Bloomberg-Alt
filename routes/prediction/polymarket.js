const express = require('express');
const { getMarkets } = require('../../controllers/prediction/polymarket');

const router = express.Router();

// Routes pour 'prediction/polymarket/'
router.get('/markets', getMarkets);

module.exports = router;