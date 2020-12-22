const Crypto = require('crypto-js')
const connector = require("../connector/arweave-connector.js");

const VERSION = "0.005";

async function setupDataset(token, source, fetching) {
  let fetchingConf = JSON.stringify(fetching);

  let dataset = {
    app: "Limestone",
    version: VERSION,
    type: "dataset-config",
    provider: "Demo Provider",
    startTime: new Date().getTime(),
    interval: "600",
    token: token,
    source: source
  };
  dataset.id = Crypto.SHA256(JSON.stringify(dataset)).toString();
  console.log(dataset.id);
  let tx = await connector.upload(dataset, fetchingConf);
  console.log(tx);
}

//setupDataset("COMP", "coingecko", ["compound-governance-token", 7]);
//setupDataset("BAL", "coingecko", ["balancer", 7]);
//setupDataset("CHI", "uniswap", ["chi", 7]);
//setupDataset("BTC", "coingecko", ["bitcoin", 7]);
//setupDataset("CHI", "uniswap", ["chi", 7]);
//setupDataset("UNI", "uniswap", ["uni", 7]);
setupDataset("COMP", "uniswap", ["comp", 7]);
