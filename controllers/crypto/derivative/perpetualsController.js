const axios = require('axios');

const getMetrics = async (req, res) => {
  const { currency } = req.query;
  try {
    const response = await axios.get('https://api.exemple.com/perpetuals/metrics', {
      params: { currency },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des métriques.' });
  }
};

module.exports = { getMetrics };