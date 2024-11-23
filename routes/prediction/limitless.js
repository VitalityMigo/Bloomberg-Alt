const express = require('express');
const { getMarketsLimitless, getMarketsHistoryLimitless } = require('../../controllers/prediction/limitless');

const router = express.Router();

// Routes pour 'prediction/limitless/'
router.get('/markets', getMarketsLimitless);

// Routes pour 'prediction/limitless/'
router.get('/history', getMarketsHistoryLimitless);

module.exports = router;