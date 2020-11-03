const Arweave = require('arweave/node');
const ARQL =  require('arql-ops');

const arweave = Arweave.init({
  host: 'arweave.net',// Hostname or IP address for a Arweave host
  port: 443,          // Port
  protocol: 'https',  // Network protocol http or https
  timeout: 20000,     // Network request timeouts in milliseconds
  logging: false,     // Enable network request logging
});

export async function find(parameters) {
  let arqlParameters = Object.keys(parameters).reduce((acc, key) => {
    acc.push(ARQL.equals(key, parameters[key]));
    return acc;
  }, []);
  let myQuery = ARQL.and(... arqlParameters);
  let results = await arweave.arql(myQuery);
  return results;
}


export async function getData(tx) {
  let rawData = await arweave.transactions.getData(tx, {decode: true, string: true});
  //console.log(rawData);
  let data = JSON.parse(rawData);
  return data;
}


export async function getTags(tx) {
  let transaction = await arweave.transactions.get(tx);
  let tags = {};
  try {
    transaction.get('tags').forEach(tag => {
      let key = tag.get('name', {decode: true, string: true});
      let value = tag.get('value', {decode: true, string: true});
      //console.log(`${key} : ${value}`);
      tags[key] = value;
    });
  } catch (error) {
    console.log(error);
  }
  return tags;
}


export async function findAndDownload(parameters) {
  let txs = await find(parameters);
  console.log("TX found: " + txs[0]);
  let data = await getData(txs[0]);

  return data;
}




