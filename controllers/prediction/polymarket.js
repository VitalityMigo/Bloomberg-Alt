const axios = require('axios');
const formatDate = require("../../functions/polymarket/date");
const searchMarkets = require("../../functions/polymarket/search")

// Handler pour 'prediction/polymarket/markets'
// AJOUTER LA PAGINATION POUR AVOIR TOUS LES MARCHE
const getMarkets = async (req, res) => {
    const { name } = req.query;
    try {

        // Appel API avec les paramètres
        const markets = await axios.get('https://gamma-api.polymarket.com/markets', {
            params: { closed: false, limit: "500", order: "volumeNum", ascending: "false"},
            headers: { 'accept': 'application/json', 'content-type': 'application/json' }});

            const response = searchMarkets(markets.data, name)
            .map(i => {

                // Parser outcomes et outcomePrices
                const outcomes = JSON.parse(i.outcomes); // ["Yes", "No"]
                const outcomePrices = JSON.parse(i.outcomePrices); // ["0.0035", "0.9965"]
                const spread = i.spread * 100

                return {
                    market: i.question,
                    yes: "┃",
                    ["Y-Prob"]: parseFloat(parseFloat(outcomePrices[0]) * 100).toFixed(1) + "%",
                    ["Y-Bid "]: parseFloat((outcomePrices[0] * 100) - (spread / 2)).toFixed(1),
                    ["Y-Ask "]: parseFloat((outcomePrices[0] * 100) + (spread / 2)).toFixed(1),
                   // ["⊢"]: "│",
                    spread: parseFloat(spread).toFixed(1),
                   // ["⊣"]: "│",
                    ["N-Bid"]: parseFloat((outcomePrices[1] * 100) - (spread / 2)).toFixed(1),
                    ["N-Ask"]: parseFloat((outcomePrices[1] * 100) + (spread / 2)).toFixed(1),
                    ["N-Prob"]:  (parseFloat(outcomePrices[1]) * 100).toFixed(1) + "%",
                    no: "┃",
                    resolution: formatDate(i.endDate),
                    volume: parseInt(i.volumeNum),
                    liquidity: parseInt(i.liquidityNum),
                    link: `https://polymarket.com/market/${i.slug}`,
                    id: i.id,
                }
            })

        res.json(response);

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Erreur lors de la récupération des instruments.' });
    }
};

module.exports = { getMarkets };
