const fetcher = require("../fetcher/coingecko-fetcher.js");
const connector = require("../connector/arweave-connector.js");

async function uploadData() {
  let data = await fetcher.fetch("balancer", 7);
  let tx = await connector.upload(data, {token: "BAL", source: "Coingecko"});
  console.log(tx);
}

async function test() {
  let data = await connector.findAndDownload("BAL", "Coingecko");
  console.log(data);
}

test();
