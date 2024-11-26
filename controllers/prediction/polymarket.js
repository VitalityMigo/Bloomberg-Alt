const axios = require('axios');
const { formatDate, formatDatePlain } = require("../../functions/polymarket/date");
const searchMarkets = require("../../functions/polymarket/search")
const { getTodayISO } = require("../../functions/global/date")

// Handler pour 'prediction/polymarket/markets'
const getMarkets = async (req, res) => {
    const { name, last_res, category } = req.query;
    try {

        // On redéfinit last_res
        const norm_last_res = last_res === 'null' ? null : last_res
        const norm_name = name === 'null' ? null : name

        // On définit le tableau global et la variable
        const markets = []
        let offset = 0

        while (true) {
            // Appel API avec les paramètres
            const request = await axios.get('https://gamma-api.polymarket.com/markets', {
                params: { closed: false, limit: "500", order: "volumeNum", ascending: "false", end_date_min: getTodayISO(), offset: offset },
                headers: { 'accept': 'application/json', 'content-type': 'application/json' }
            });

            // On rajoute les éléments au tableau global
            markets.push(...request.data)

            if (request.data.length < 500) {
                break
            }

            offset += 500
        }

        const response = searchMarkets(markets, norm_name)
            .filter(i => (!norm_last_res || i.endDate <= last_res) && i.marketType !== 'scalar' && i.outcomePrices)
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
            Volume: parseInt(data.volumeNum),
            Liquidity: parseInt(data.liquidityNum),
            Resolution: formatDate(data.endDate),
            Link: `https://polymarket.com/market/${data.slug}`,
            Id: data.id,
        }

        // // Transposer l'objet en un tableau clé-valeur
        const transposed = Object.entries(response);

        res.json(transposed);

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Erreur lors de la récupération des instruments.' });
    }
};

// Handler pour 'prediction/polymarket/pricehistory'
const getPriceHistory = async (req, res) => {
    const { tokenId, interval } = req.query;
    try {

        // Appel API avec les paramètres
        const markets = await axios.get(`https://clob.polymarket.com//prices-history`, {
            params: { market: tokenId, interval: interval, },
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

// Handler pour 'prediction/polymarket/markets'
const getMarketsName = async (req, res) => {
    try {

        // On définit le tableau global et la variable
        const markets = []
        let offset = 0

        while (true) {
            // Appel API avec les paramètres
            const request = await axios.get('https://gamma-api.polymarket.com/markets', {
                params: { closed: false, limit: "500", order: "volumeNum", ascending: "false", end_date_min: getTodayISO(), offset: offset },
                headers: { 'accept': 'application/json', 'content-type': 'application/json' }
            });
            // On rajoute les éléments au tableau global
            markets.push(...request.data)

            if (request.data.length < 500) {
                break
            }

            offset += 500
        }

        const response = markets
            .filter(i => i.marketType !== 'scalar' && i.outcomePrices)
            .map(i => {

                return {
                    label: i.question,
                    value: i.id,
                }
            })

        res.json(response);

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Erreur lors de la récupération des instruments.' });
    }
};

// Handler pour 'prediction/polymarket/markets'
const getMarketsNameById = async (req, res) => {
    try {

        // On définit le tableau global et la variable
        const markets = []
        let offset = 0

        while (true) {
            // Appel API avec les paramètres
            const request = await axios.get('https://gamma-api.polymarket.com/markets', {
                params: { closed: false, limit: "500", order: "volumeNum", ascending: "false", end_date_min: getTodayISO(), offset: offset },
                headers: { 'accept': 'application/json', 'content-type': 'application/json' }
            });
            // On rajoute les éléments au tableau global
            markets.push(...request.data)

            if (request.data.length < 500) {
                break
            }

            offset += 500
        }

        const response = markets
            .filter(i => i.marketType !== 'scalar' && i.outcomePrices)
            .map(i => {

                return {
                    label: i.conditionId,
                    value: i.id,
                }
            })

            res.json(response);

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Erreur lors de la récupération des instruments.' });
    }
};

module.exports = { getMarkets, getSingleMarket, getPriceHistory, getMarketsName, getMarketsNameById };


