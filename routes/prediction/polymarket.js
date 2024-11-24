const express = require('express');
const { getMarkets, getSingleMarket, getPriceHistory } = require('../../controllers/prediction/polymarket');

const router = express.Router();

// Routes pour 'prediction/polymarket/'
router.get('/markets', getMarkets);

// Routes pour 'prediction/polymarket/'
router.get('/singlemarket', getSingleMarket);

// Routes pour 'prediction/polymarket/'
router.get('/pricehistory', getPriceHistory);

module.exports = router;