require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const cryptoRoutes = require('./routes/crypto');
const predictionRoutes = require('./routes/prediction');

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: [
    'http://localhost:3000',   // Remplacer par l'URL de ton frontend
    'https://pro.openbb.dev',  // Autres URLs autorisées
    'https://pro.openbb.co'
  ],
};

// CORS
app.use(cors(corsOptions));

// Utiliser les routes 'crypto'
app.use('/crypto', cryptoRoutes);
app.use('/prediction', predictionRoutes);

// Endpoint de base
app.get('/', (req, res) => {
  res.json({ "Bloomberg": "Server initialized" });
});

// Widget.json
app.get("/widgets.json", (req, res) => {
  fs.readFile(path.join(__dirname, 'widgets.json'), 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to load widgets.json' });
    res.json(JSON.parse(data));
  });
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
