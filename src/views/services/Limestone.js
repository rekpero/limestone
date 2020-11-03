import { find, getTags, getData } from './Arweave';

const VERSION = "0.005";


export async function fetchDatasetConfigs(result) {
  let configTxs = await find({app: "Limestone", type: "dataset-config", version: VERSION});
  console.log("Found datasets: " + configTxs.length);

  configTxs.forEach(async tx => {
    try {
      let config = await getTags(tx);
      config.tx = tx;
      result.push(config);
    } catch (err) {
      console.log("Dataset not mined yet: " + tx);
    }
  });
}

export async function fetchDataset(result, configId, id, dataTxs) {
  if (!dataTxs) {
    dataTxs = await find({app: "Limestone", type: "dataset-content", version: VERSION, id: configId});
    console.log("Found txs: " + dataTxs.length);
  }

  let latestTx = dataTxs.length > id ? dataTxs[id] : null;

  if (latestTx) {
    let latestDataset = null;
    try {
      latestDataset = await getTags(latestTx);
      latestDataset.tx = latestTx;
      latestDataset.lastUpdated = new Date(parseInt(latestDataset.time));
      console.log(latestDataset.lastUpdated);

      console.log(latestDataset);
      Object.assign(result, latestDataset);
      result.data = await getData(result.tx);
    } catch {
      console.log("Cannot fetch the latest dataset, trying previous transaction: " + (id + 1));
      await fetchDataset(result, configId, id+1, dataTxs);
    }
  }
}

export async function fetchDataEntries(configId, result) {
  let dataTxs = await find({app: "Limestone", type: "data-latest", version: VERSION, id: configId});
  console.log(dataTxs);
  console.log("Found txs: " + dataTxs.length);

  dataTxs.forEach(async function(tx) {
    let tags = await getTags(tx);
    tags.tx = tx;
    tags.time = new Date(parseInt(tags.time));
    console.log(tags);
    result.push(tags);
    result = result.sort((a,b) => b.time - a.time);
  });
}




export async function getLatestData(token, txId, dataTxs) {
  if (!dataTxs) {
    dataTxs = await find({app: "Limestone", type: "data-latest", version: VERSION, token: token});
  }

  let latestTx = dataTxs.length > txId ? dataTxs[txId] : null;

  if (latestTx) {
    let latestData = null;
    try {
      latestData = await getTags(latestTx);
      latestData.lastUpdated = new Date(parseInt(latestDataset.time));
      console.log(latestData.lastUpdated);

      console.log(latestData);
      //result.data = await getData(result.tx);
    } catch {
      await fetchDataset(result, configId, txId+1, dataTxs);
    }
  }
}

