const axios = require('axios');
const { formatDate, formatDatePlain } = require("../../functions/polymarket/date");
const searchMarkets = require("../../functions/polymarket/search")

// Handler pour 'prediction/polymarket/markets'
// AJOUTER LA PAGINATION POUR AVOIR TOUS LES MARCHE
const getMarkets = async (req, res) => {
    const { name } = req.query;
    try {

        // Appel API avec les paramètres
        const markets = await axios.get('https://gamma-api.polymarket.com/markets', {
            params: { closed: false, limit: "500", order: "volumeNum", ascending: "false" },
            headers: { 'accept': 'application/json', 'content-type': 'application/json' }
        });

        const response = searchMarkets(markets.data, name)
            .map(i => {

                // Parser outcomes et outcomePrices
                const outcomePrices = JSON.parse(i.outcomePrices); // ["0.0035", "0.9965"]
                const spread = i.spread * 100

                return {
                    market: i.question,
                    yes: "┃",
                    ["Y-Prob"]: parseFloat(parseFloat(outcomePrices[0]) * 100).toFixed(1),
                    ["Y-Bid "]: parseFloat((outcomePrices[0] * 100) - (spread / 2)).toFixed(1),
                    ["Y-Ask "]: parseFloat((outcomePrices[0] * 100) + (spread / 2)).toFixed(1),
                    // ["⊢"]: "│",
                    spread: parseFloat(spread).toFixed(1),
                    // ["⊣"]: "│",
                    ["N-Bid"]: parseFloat((outcomePrices[1] * 100) - (spread / 2)).toFixed(1),
                    ["N-Ask"]: parseFloat((outcomePrices[1] * 100) + (spread / 2)).toFixed(1),
                    ["N-Prob"]: (parseFloat(outcomePrices[1]) * 100).toFixed(1),
                    no: "┃",
                    resolution: formatDate(i.endDate),
                    volume: parseInt(i.volumeNum),
                    liquidity: parseInt(i.liquidityNum),
                    link: `https://polymarket.com/market/${i.slug}`,
                    id: i.id,
                }
            })
console.log(response)
        res.json(response);

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Erreur lors de la récupération des instruments.' });
    }
};

// Handler pour 'prediction/polymarket/singlemarket'
const getSingleMarket = async (req, res) => {
    const { id } = req.query;
    try {

        // Appel API avec les paramètres
        const markets = await axios.get(`https://gamma-api.polymarket.com/markets/${id}`, {
            headers: { 'accept': 'application/json', 'content-type': 'application/json' }
        });

        const data = markets.data

        // Parser outcomes et outcomePrices
        const outcomePrices = JSON.parse(data.outcomePrices); // ["0.0035", "0.9965"]
        const spread = data.spread * 100

        const response = {
            Market: data.question,
            ["Y-Prob"]: parseFloat(parseFloat(outcomePrices[0]) * 100).toFixed(1) + "%",
            ["N-Prob"]: (parseFloat(outcomePrices[1]) * 100).toFixed(1) + "%",
            Spread: parseFloat(spread).toFixed(1),
            Resolution: formatDate(data.endDate),
            Volume: parseInt(data.volumeNum),
            Liquidity: parseInt(data.liquidityNum),
            Link: `https://polymarket.com/market/${data.slug}`,
            Id: data.id,
        }

        // Transposer l'objet en un tableau clé-valeur
        const transposed = Object.entries(response);

        console.log(transposed)

        res.json(transposed);

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Erreur lors de la récupération des instruments.' });
    }
};

// Handler pour 'prediction/polymarket/pricehistory'
// AJOUTER LA PAGINATION POUR AVOIR TOUS LES MARCHE
const getPriceHistory = async (req, res) => {
    const { tokenId, interval } = req.query;
    try {

        // Appel API avec les paramètres
        const markets = await axios.get(`https://clob.polymarket.com//prices-history`, {
            params: { market: tokenId, interval: interval,  },
            headers: { 'accept': 'application/json', 'content-type': 'application/json' }
        });

        const data = markets.data

        const response = data.history
            .map(i => {

                return {
                    date: formatDatePlain(i.t),
                    price: (i.p * 100) + "%",
                }
            })

        res.json(response);

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Erreur lors de la récupération des instruments.' });
    }
};

module.exports = { getMarkets, getSingleMarket, getPriceHistory };
