const express = require('express');
const optionRoutes = require('./options');
const perpetualsRoutes = require('./perpetuals');

const router = express.Router();

// Routes pour 'crypto/derivative/option'
router.use('/option', optionRoutes);

// Routes pour 'crypto/derivative/perpetuals'
router.use('/perpetuals', perpetualsRoutes);

module.exports = router;
