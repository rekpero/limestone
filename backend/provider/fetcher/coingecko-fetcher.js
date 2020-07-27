const CoinGecko = require('coingecko-api');

const CoinGeckoClient = new CoinGecko();

async function fetch(tokenName, days) {
  console.log("Fetching: " + tokenName + " days: " + days);
  let response = await CoinGeckoClient.coins.fetchMarketChart(tokenName, {days: days});
  return response.data.prices;
};

//EXPORTS:
module.exports.fetch = fetch;
