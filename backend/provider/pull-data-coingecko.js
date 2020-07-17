const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

//3. Make calls
async function fetch() {
  let response = await CoinGeckoClient.coins.fetchMarketChart('balancer', {days:7});
  let prices = response.data.prices;
  return prices;
};

fetch();
