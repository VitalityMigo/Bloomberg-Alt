const axios = require('axios');

const getInterestRates = async (req, res) => {
  const { currency } = req.query;
  try {
    const response = await axios.get('https://api.exemple.com/global/interest-rates', {
      params: { currency },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des taux d\'intérêt.' });
  }
};

const getHistoricVolatility = async (req, res) => {
  const { currency } = req.query;
  try {
    const response = await axios.get('https://api.exemple.com/global/historic-volatility', {
      params: { currency },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la volatilité historique.' });
  }
};

module.exports = { getInterestRates, getHistoricVolatility };