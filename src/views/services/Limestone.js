import { find, getTags, getData, findLastTx, findAllTx } from './Arweave';

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
  let lastTx = await findLastTx({app: "Limestone", type: "dataset-content", version: VERSION, id: configId});
  console.log("Latest tx: " + lastTx);
  result.tx = lastTx;
  result.data = await getData(result.tx);
}

export async function fetchDataEntries(configId, result) {
  let dataTxs = await findAllTx({app: "Limestone", type: "data-latest", version: VERSION, id: configId}, 10);
  console.log("Found txs: " + dataTxs.length);

  dataTxs.forEach(edge => {
    let entry = {
      tx: edge.node.id
    };
    edge.node.tags.forEach(tag => {
      if (tag.name === "time") {
        entry.time = new Date(parseInt(tag.value));
      }
      if (tag.name === "value") {
        entry.value = parseFloat(tag.value);
      }
    });
    result.push(entry);
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

