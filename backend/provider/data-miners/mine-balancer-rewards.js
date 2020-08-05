const fs = require('fs');
const connector = require("../connector/arweave-connector.js");
const fetcher = require("../fetcher/coingecko-fetcher.js");

const REPORTS_PATH = "/Users/kuba/projects/bal-mining-scripts/reports/10/";
const WEEK = 10;
const SNAPSHOT = 10538688;

const MINING_INTERVAL = 600; //In seconds

async function uploadData(data, week, snapshot) {
  let tags = {
    app: "Limestone",
    version: "0.003",
    type: "balancer-rewards",
    week: week,
    snapshot: snapshot,
    time: new Date().getTime(),
  };
  let tx = await connector.upload(data, tags);
  console.log(tx);
}


async function checkAndUpdate() {
  let filename = `${REPORTS_PATH}cum_${SNAPSHOT}.json`;
  let data = JSON.parse(fs.readFileSync(filename));
  await uploadData(data, WEEK, SNAPSHOT);
}

async function updateAll() {
  checkAndUpdate();
}

updateAll();

