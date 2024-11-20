const express = require('express');
const derivativeRoutes = require('./derivative');
const globalRoutes = require('./global');

const router = express.Router();

// Routes pour 'crypto/derivative'
router.use('/derivative', derivativeRoutes);

// Routes pour 'crypto/global'
router.use('/global', globalRoutes);

module.exports = router;