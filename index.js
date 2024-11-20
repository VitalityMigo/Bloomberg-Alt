require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cryptoRoutes = require('./routes/crypto');

const app = express();
const port = process.env.PORT || 3000;

// Utiliser les routes 'crypto'
app.use('/crypto', cryptoRoutes);
app.use(cors());

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
