require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cryptoRoutes = require('./routes/crypto');
const predictionRoutes = require('./routes/prediction');

const app = express();
const port = process.env.PORT || 3000;

// Utiliser les routes 'crypto'
app.use('/crypto', cryptoRoutes);
app.use('/prediction', predictionRoutes);

app.use(cors());

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
