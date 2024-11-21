const express = require('express');
const polymarketRoutes = require('./polymarket');
const limitlessRoutes = require('./limitless')

const router = express.Router();

// Routes pour 'prediction/polymarket'
router.use('/polymarket', polymarketRoutes);

// Routes pour 'prediction/limitless'
router.use('/limitless', limitlessRoutes);

module.exports = router;