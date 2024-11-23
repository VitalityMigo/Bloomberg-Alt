const axios = require('axios');

async function priceHistory(marketIds) {

    const url = 'https://indexer.hyperindex.xyz/da7c4d3/v1/graphql';
    const query = `query prices {
      AutomatedMarketMakerPricing(where: { market_id: { _in: [${marketIds.map(id => JSON.stringify(id)).join(', ')}] } }) {
      yesBuyChartData
      market_id
    }
  }
`;

    // Fetch les datas
    const fetchData = async () => {
        try {
            const response = await axios.post(url, { query });
            const data = response.data.data.AutomatedMarketMakerPricing;

            // Étape 1 : Grouper les timestamps par market_id
            const timestampsByMarket = data.reduce((acc, { yesBuyChartData, market_id }) => {
                if (!acc[market_id]) acc[market_id] = [];
                acc[market_id].push(yesBuyChartData[0]);
                return acc;
            }, {});

            // Étape 2 : Trouver le timestamp maximal pour chaque market_id
            const maxTimestamps = Object.keys(timestampsByMarket).reduce((acc, market_id) => {
                acc[market_id] = Math.max(...timestampsByMarket[market_id]);
                return acc;
            }, {});

            // Étape 3 : Mapper les données selon la structure demandée
            const mappedData = data.map(({ yesBuyChartData, market_id }) => {
                const [timestamp, price] = yesBuyChartData;
                return {
                    id: market_id,
                    price: Number(price), // Convertit en nombre si ce n'est pas déjà le cas
                    timestamp,
                    isLast: timestamp === maxTimestamps[market_id]
                };
            });

            return mappedData

        } catch (error) {
            console.error('Error fetching data:', error);
            return []
        }
    };

    return fetchData();
}

module.exports = { priceHistory }