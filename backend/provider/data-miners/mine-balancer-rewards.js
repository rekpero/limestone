const fs = require('fs');
const connector = require("../connector/arweave-connector.js");
const fetcher = require("../fetcher/coingecko-fetcher.js");

const REPORTS_PATH = "/Users/kuba/projects/bal-mining-scripts/users/10/";
const WEEK = 10;
const SNAPSHOT = "10597312";

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
  //let filename = `${REPORTS_PATH}cum_${SNAPSHOT}.json`;
  //let data = JSON.parse(fs.readFileSync(filename));
  let files = fs.readdirSync(`${REPORTS_PATH}`);
  let cumFiles = files.filter((val) => val.indexOf('cum') >= 0);
  let newestFile = cumFiles[cumFiles.length-1];
  let snapshot = newestFile.replace('cum_','').replace('.json','');
  console.log(newestFile);
  console.log("Snapshot: " + snapshot);

  let txs = await connector.find({app: "Limestone", type: "balancer-rewards", version: "0.004", snapshot: snapshot});
  if (txs.length>0) {
    console.log("Lastest snapshot already pushed to Arweave");
  } else {
    console.log("Uploading...");
    let data = JSON.parse(fs.readFileSync(filename));
    await uploadData(data, WEEK, snapshot);
  }
}

async function updateAll() {
  checkAndUpdate();
}

updateAll();

