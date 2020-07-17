const CoinGecko = require('coingecko-api');

const CoinGeckoClient = new CoinGecko();

async function fetch(tokenName, days) {
  let response = await CoinGeckoClient.coins.fetchMarketChart(tokenName, {days: days});
  let prices = response.data.prices;
  return prices;
};

//EXPORTS:
module.exports.fetch = fetch;
