const axios = require('axios');
const formatDate = require("../../functions/polymarket/date");

// Handler pour 'prediction/polymarket/markets'
const getMarkets = async (req, res) => {
    const { name } = req.query;
    try {

        // Appel API avec les paramètres
        const markets = await axios.get('https://gamma-api.polymarket.com/markets',
            { closed: false, limit: "1000", order: "volumeNum", ascending: "false" },
            {
                headers: { 'accept': 'application/json', 'content-type': 'application/json' }
            });

        const response = markets.data
            .map(i => {

                // Parser outcomes et outcomePrices
                const outcomes = JSON.parse(i.outcomes); // ["Yes", "No"]
                const outcomePrices = JSON.parse(i.outcomePrices); // ["0.0035", "0.9965"]
                const spread = i.spread * 100

                return {
                    id: i.id,
                    market: i.question,
                    [outcomes[0]]: "┃",
                    probability:  (parseFloat(outcomePrices[0]) * 100).toFixed(1) + '%',
                    bid: parseFloat((outcomePrices[0] * 100) + (spread / 2)).toFixed(1),
                    ask: parseFloat((outcomePrices[0] * 100) - (spread / 2)).toFixed(1),
                    ["│"]: "│",
                    spread: spread,
                    ["│"]: "│",
                    bid: parseFloat((outcomePrices[0] * 100) + (spread / 2)).toFixed(1),
                    ask: parseFloat((outcomePrices[0] * 100) - (spread / 2)).toFixed(1),
                    probability:  (parseFloat(outcomePrices[0]) * 100).toFixed(1) + '%',
                    [outcomes[1]]: "┃",
                    resolution: formatDate(i.endDate),
                    volume: i.volumeNum,
                    liquidity: i.liquidityNum,
                    link: `https://polymarket.com/event/${i.slug}`,
                }
            })

        res.json(response);

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Erreur lors de la récupération des instruments.' });
    }
};

module.exports = { getMarkets };
