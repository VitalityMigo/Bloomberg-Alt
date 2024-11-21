const express = require('express');
const { getInterestRates, getHistoricVolatility } = require('../../controllers/crypto/globalController');

const router = express.Router();

// Route pour 'crypto/global/metrics/interest-rates'
router.get('/interest-rates', getInterestRates);

// Route pour 'crypto/global/metrics/historic-volatility'
router.get('/historic-volatility', getHistoricVolatility);

module.exports = router;