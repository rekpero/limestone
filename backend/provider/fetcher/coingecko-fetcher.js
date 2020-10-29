const CoinGecko = require('coingecko-api');

const CoinGeckoClient = new CoinGecko();

async function fetchBundle(tokenName, days) {
  console.log("Fetching: " + tokenName + " days: " + days);
  let response = await CoinGeckoClient.coins.fetchMarketChart(tokenName, {days: days});
  return response.data.prices;
};

async function fetchLatest(tokenName) {
  console.log("Fetching: " + tokenName + " latest price");
  let response = await CoinGeckoClient.coins.fetch(tokenName, {
    ico_data: false,
    community_data: false,
    developer_data: false,
    localization: false,
    tickers: false
  });
  return response.data.market_data.current_price.usd;
};

//EXPORTS:
module.exports.fetchBundle = fetchBundle;
module.exports.fetchLatest = fetchLatest;
