const axios = require('axios');
const formatDate = require("../../../functions/derive/date");

// Handler pour 'crypto/derivative/option/all-instrument'
const getAllInstruments = async (req, res) => {
    const { currency, direction, strike, expiry } = req.query;
    try {

        // Appel API avec les paramètres
        const instruments = await axios.post('https://api.lyra.finance/public/get_instruments',
            { expired: false, instrument_type: "option", currency: currency },
            {
                headers: { 'accept': 'application/json', 'content-type': 'application/json' }
            });

        // Fonction pour filtrer les instruments
        const filtered = instruments.data.result.filter(i => {
            const [T_currency, T_expiry, T_strike, T_direction] = i.instrument_name.split('-');

            // On compare les valeurs si elles sont définies
            return (
                (strike === undefined || T_strike === strike) &&
                (expiry === undefined || formatDate(T_expiry) === expiry) &&
                (direction === undefined || T_direction === direction)
            );
        });
        console.log(filtered)
        const response = filtered
            .sort((a, b) => a.option_details.expiry - b.option_details.expiry)
            .map(i => { 
                return {
                    id: i.instrument_name,
                    asset: i.base_currency,
                    type: i.option_details.option_type === 'C' ? 'Call' : 'Put',
                    strike: i.option_details.strike,
                    expiry: formatDate(i.instrument_name.slice(4, 12)),
                    min: i.minimum_amount,
                    max: i.maximum_amount,
                    fees: i.base_fee + '%',
                    quote: i.quote_currency,
                }})

        res.json(response);

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Erreur lors de la récupération des instruments.' });
    }
};

// Handler pour 'crypto/derivative/option/instrument'
const getInstrument = async (req, res) => {
    const { currency, expiry } = req.query;
    try {
        const response = await axios.get('https://api.exemple.com/instrument', {
            params: { currency, expiry },
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
    }
};

module.exports = { getAllInstruments, getInstrument };
