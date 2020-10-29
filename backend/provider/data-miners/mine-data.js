const connector = require("../connector/arweave-connector.js");
const fetchers = {
  coingecko: require("../fetcher/coingecko-fetcher.js"),
  uniswap: require("../fetcher/uniswap-fetcher.js")
}

const VERSION = "0.005";

const MINING_INTERVAL = 600; //In seconds

async function uploadData(config) {
  let fetchingConfig = await connector.getData(config.tx);
  console.log(fetchingConfig);
  let args = JSON.parse(fetchingConfig);
  let dataBundle = null;
  let dataLatest = null;
  try {
    dataBundle = await fetchers[config.source].fetchBundle(...args);
    dataLatest = await fetchers[config.source].fetchLatest(...args);
  } catch (err) {
    console.log("Error fetching data:");
    console.log(err);
    return;
  }
  if (dataBundle) {
    let tags = {
      app: "Limestone",
      version: VERSION,
      type: "dataset-content",
      token: config.token,
      id: config.id,
      time: new Date().getTime(),
      source: config.source
    };
    let tx = await connector.upload(tags, dataBundle);
    console.log(tx);
  }
  if (dataLatest) {
    let tags = {
      app: "Limestone",
      version: VERSION,
      type: "data-latest",
      token: config.token,
      id: config.id,
      time: new Date().getTime(),
      source: config.source,
      value: dataLatest
    };
    let tx = await connector.upload(tags, dataLatest);
    console.log(tx);
  }
}


async function checkAndUpdate(config) {
  console.log("Checking dataset: " + config.id);
  console.log(config);
  let dataTxs = await connector.find({app: "Limestone", type: "dataset-content", version: VERSION, id: config.id});
  if (dataTxs.length === 0) {
    console.log("No matching content for given dataset.");
    await uploadData(config);
  } else {
    console.log("Found transactions...");
    let now = new Date().getTime();
    let minInterval = Number.MAX_VALUE;
    for (var i = 0; i < dataTxs.length; i++) {
      let time = now;
      try {
        let tags = await connector.getTags(dataTxs[i]);
        time = tags.time;
      } catch (err) {
        console.log("Error fetching tx details - probably not mined yet");
        console.log(err);
      }
      minInterval = Math.min(now - time, minInterval);
    }
    ;
    console.log("Interval since last upload: " + minInterval);
    if (minInterval > MINING_INTERVAL * 1000) {
      await uploadData(config);
    }
  }

}

async function updateAll() {
  let configTxs = await connector.find({app: "Limestone", type: "dataset-config", version: VERSION});
  configTxs.forEach(async tx => {
    try {
      let config = await connector.getTags(tx);
      config.tx = tx;
      //await checkAndUpdate(config);
      uploadData(config);
    } catch (err) {
      console.log("Cannot fetch tx, probably not mined yet: " + tx);
    }
  });
  setTimeout(updateAll, 60000);
}

updateAll();

