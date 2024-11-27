const express = require('express');
const { getMarkets, getSingleMarket, getPriceHistory, getMarketsName, getMarketsNameById, getMarketsHeaders } = require('../../controllers/prediction/polymarket');

const router = express.Router();

// Routes pour 'prediction/polymarket/'
router.get('/markets', getMarkets);

// Routes pour 'prediction/polymarket/'
router.get('/singlemarket', getSingleMarket);

// Routes pour 'prediction/polymarket/'
router.get('/pricehistory', getPriceHistory);

// Routes pour 'prediction/polymarket/'
router.get('/markets-headers', getMarketsHeaders);


module.exports = router;