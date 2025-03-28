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
    const { tokenId, interval, outcome } = req.query;
    try {

        // Fidelity is f(interval)
        const fidelity_param = { ["1h"]: 1, ["6h"]: 1, ["1d"]: 5, ["1w"]: 30, ["1m"]: 180, ["max"]: 720 }

        // Appel API avec les paramètres
        const markets = await axios.get(`https://clob.polymarket.com/prices-history`, {
            params: { market: tokenId, interval: interval, fidelity: fidelity_param[interval] },
            headers: { 'accept': 'application/json', 'content-type': 'application/json' }
        });

        const data = markets.data

        const response = data.history
            .map(i => {

                return {
                    date: formatDatePlain(i.t),
                    price: outcome === 'yes' ? i.p : 1 - i.p,
                }
            })

        res.json(response);

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Erreur lors de la récupération des instruments.' });
    }
};

// Handler pour 'prediction/polymarket/book'
const getOrderbook = async (req, res) => {
    const { tokenId } = req.query;
    try {

        // Appel API avec les paramètres
        const markets = await axios.get(`https://clob.polymarket.com/book`, {
            params: { token_id: tokenId },
            headers: { 'accept': 'application/json', 'content-type': 'application/json' }
        });

        const bids = markets.data.bids
        const asks = markets.data.asks

        // Convertir les prix et tailles en nombres
        const bidsData = bids.map(bid => ({ price: parseFloat(bid.price), size: parseFloat(bid.size) }));
        const asksData = asks.map(ask => ({ price: parseFloat(ask.price), size: parseFloat(ask.size) }));

        // Calculer le prix d'équilibre
        const bestBid = bidsData[bidsData.length - 1].price
        const bestAsk = asksData[asksData.length - 1].price
        const equilibriumPrice = (bestBid + bestAsk) / 2;

        // Filtrer les données pour ne garder que les ordres à + ou - 20% du prix d'équilibre
        const filteredBids = bidsData.filter(bid => bid.price >= equilibriumPrice * 0.75);
        const filteredAsks = asksData.filter(ask => ask.price <= equilibriumPrice * 1.25);

        console.log("Bids", filteredBids)
        console.log("Asks", filteredAsks)

        // Créer les traces pour Plotly
        const bidTrace = {
            x: filteredBids.map(bid => bid.price),
            y: filteredBids.map(bid => bid.size),
            type: 'bar',
            orientation: 'h',
            name: 'Bids',
            marker: { color: 'green' }
        };

        const askTrace = {
            x: filteredAsks.map(ask => ask.price),
            y: filteredAsks.map(ask => ask.size),
            type: 'bar',
            orientation: 'h',
            name: 'Asks',
            marker: { color: 'red' }
        };

        const layout = {
            barmode: 'relative',
            title: 'Order Book',
            xaxis: { title: 'Price' },
            yaxis: { title: 'Size' }
        };

        const figure = { data: [bidTrace, askTrace], layout };

        // Convertir le graphique en JSON
        const graphJSON = JSON.stringify(figure, null, 2);

        res.json(graphJSON);

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Erreur lors de la récupération des instruments.' });
    }
};

// Handler pour 'prediction/polymarket/marketsheader'
const getMarketsHeaders = async (req, res) => {
    const { id_type } = req.query;
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
            .filter(i => i.marketType !== 'scalar' && i.outcomePrices && i.clobTokenIds)
            .map(i => {

                const id = id_type === 'id' ? i.id : JSON.parse(i.clobTokenIds)[0]

                return {
                    label: i.question,
                    value: id,
                }
            })

        res.json(response);

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Erreur lors de la récupération des instruments.' });
    }
};


module.exports = {
    getMarkets,
    getSingleMarket,
    getPriceHistory,
    getOrderbook,
    getMarketsHeaders,
};


