const express = require('express');
const { getMarketsLimitless } = require('../../controllers/prediction/limitless');

const router = express.Router();

// Routes pour 'prediction/limitless/'
router.get('/markets', getMarketsLimitless);

module.exports = router;