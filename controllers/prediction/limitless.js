const axios = require('axios');

const formatDate = require("../../functions/limitless/date");
const searchMarkets = require("../../functions/limitless/search")
const { priceHistory } = require("../../functions/limitless/queries")

// Handler pour 'prediction/limitless/markets'
const getMarketsLimitless = async (req, res) => {
    const { name, category } = req.query;
    try {

        // Appel API avec les paramètres
        const markets = await axios.get('https://api.limitless.exchange/markets/daily', {
            params: { limit: 50 },
            headers: { 'accept': '*/*', } //  'Cookie': limitless_key
        });

        const p_history = await priceHistory(markets.data.data.map(i => i.address))

        const response = searchMarkets(markets.data.data, name)
            .map(i => {

                const y_prob = p_history.find(a => a.id.toLowerCase() === i.address.toLowerCase() && a.isLast === true).price
                const n_prob = 100 - y_prob

                return {
                    market: i.title,
                    yes: "┃",
                    ["Y-Prob"]: parseFloat(y_prob).toFixed(1) + "%",
                    ["Y-Return "]: parseFloat((100 - y_prob) * 100 / y_prob).toFixed(1),
                    ["┃"]: "┃",
                    ["N-Return"]: parseFloat((100 - n_prob) * 100 / n_prob).toFixed(1),
                    ["N-Prob"]: parseFloat(n_prob).toFixed(1) + "%",
                    no: "┃",
                    resolution: i.expirationDate,
                    volume: parseInt(i.volumeFormatted),
                    liquidity: parseInt(i.liquidityFormatted),
                    quote: i.collateralToken.symbol,
                    link: `https://limitless.exchange/markets/${i.address}`,
                    id: i.address
                }
            }).sort((a, b) => b.volume - a.volume)

        res.json(response);

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Erreur lors de la récupération des instruments.' });
    }
};

// Handler pour 'prediction/limitless/history'
const getMarketsHistoryLimitless = async (req, res) => {
    const { id } = req.query;
    try {

        // Appel API avec les paramètres
        const markets = await axios.get(`https://api.limitless.exchange/markets/${id}`, {
            params: { limit: 50 },
            headers: { 'accept': '*/*', }
        });

        // Price history
        const p_history = await priceHistory([id])

        // Objet de réponse 
        const response = {
            market: markets.data.title
        }

        // Response builder
        let price = 0
        for (const i of p_history) {
            response[formatDate(i.timestamp)] = i.price ? i.price : price
            price = i.price ? i.price : price
        }

        res.json(response);

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Erreur lors de la récupération des instruments.' });
    }
};


module.exports = { getMarketsLimitless, getMarketsHistoryLimitless };
