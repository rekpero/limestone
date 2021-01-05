const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

const CoinbaseClient = require('coinbase').Client;
const coinbaseClient = new CoinbaseClient({
  'apiKey': 'KEY',
  'apiSecret': 'SECRET',
  strictSSL: false
});

const symbolsMapping = {
  "kyber-network": "KNC",
  "maker": "MKR",
  "loopring": "LRC"
};

async function fetchBundle(tokenName, days) {
  console.log("Fetching: " + tokenName + " days: " + days);
  let response = await CoinGeckoClient.coins.fetchMarketChart(tokenName, {days: days});
  console.log(response.data.prices)
  return response.data.prices;
};

async function fetchLatest(tokenName) {
  console.log("Fetching: " + tokenName + " latest price");
  return new Promise((resolve, reject) => {
    coinbaseClient.getSpotPrice({'currencyPair': symbolsMapping[tokenName] + '-USD'}, function (err, response) {
      console.log(response.data.amount);
      if (err) {
        console.log("Error");
        console.log(err);
      }
      return response.data.amount;
    });
  });
}

async function fetchLatest(tokenName) {
  console.log("Fetching: " + tokenName + " latest price");
  return new Promise((resolve, reject) => {
    coinbaseClient.getSpotPrice({'currencyPair': symbolsMapping[tokenName] + '-USD'}, function (err, response) {
      if (err) {
        console.log("Error");
        console.log(err);
        reject(err);
      } else {
        resolve(response.data.amount);
      }
    });
  });
};

//EXPORTS:
module.exports.fetchBundle = fetchBundle;
module.exports.fetchLatest = fetchLatest;
