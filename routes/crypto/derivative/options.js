const express = require('express');
const { getAllInstruments, getInstrument } = require('../../../controllers/crypto/derivative/optionController');

const router = express.Router();

// Route pour 'crypto/derivative/option/all-instrument'
router.get('/all-instrument', getAllInstruments);

// Route pour 'crypto/derivative/option/instrument'
router.get('/instrument', getInstrument);

module.exports = router;