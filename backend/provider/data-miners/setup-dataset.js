const Crypto = require('crypto-js')
const connector = require("../connector/arweave-connector.js");

async function setupDataset(token, source, fetching) {
  let fetchingConf = JSON.stringify(fetching);

  let dataset = {
    app: "Limestone",
    version: "0.002",
    type: "dataset-config",
    provider: "Demo Provider",
    startTime: new Date().getTime(),
    interval: "60",
    token: token,
    source: source
  };
  dataset.id = Crypto.SHA256(JSON.stringify(dataset)).toString();
  console.log(dataset.id);
  let tx = await connector.upload(fetchingConf, dataset);
  console.log(tx);
}

//setupDataset("COMP", "Coingecko", ["compound-governance-token", 7]);
setupDataset("BAL", "Coingecko", ["balancer", 7]);
