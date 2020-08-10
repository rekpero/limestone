const Arweave = require('arweave/node');
const PRIVATE_KEY = require('./.secret.json');
const ARQL =  require('arql-ops');

const arweave = Arweave.init({
  host: 'arweave.net',// Hostname or IP address for a Arweave host
  port: 443,          // Port
  protocol: 'https',  // Network protocol http or https
  timeout: 20000,     // Network request timeouts in milliseconds
  logging: false,     // Enable network request logging
});


async function upload(data, tags) {
  let tx = await arweave.createTransaction({data: JSON.stringify(data)}, PRIVATE_KEY);
  Object.keys(tags).forEach(function(key) {
    tx.addTag(key, tags[key]);
  });
  await arweave.transactions.sign(tx, PRIVATE_KEY);
  const response = await arweave.transactions.post(tx);
  console.log("Uploaded: ");
  console.log(response);
  return tx;
}


async function find(parameters) {
  let arqlParameters = Object.keys(parameters).reduce((acc, key) => {
    acc.push(ARQL.equals(key, parameters[key]));
    return acc;
  }, []);
  let myQuery = ARQL.and(... arqlParameters);
  let results = await arweave.arql(myQuery);
  return results;
}


async function getData(tx) {
  let rawData = await arweave.transactions.getData(tx, {decode: true, string: true});
  let data = JSON.parse(rawData);
  return data;
}


async function getTags(tx) {
  let transaction = await arweave.transactions.get(tx);
  let tags = {};
  transaction.get('tags').forEach(tag => {
    let key = tag.get('name', {decode: true, string: true});
    let value = tag.get('value', {decode: true, string: true});
    //console.log(`${key} : ${value}`);
    tags[key] = value;
  });
  return tags;
}


async function findAndDownload(token, source) {
  let txs = await find(token, source);
  console.log("TX found: " + txs[0]);
  let data = await getData(txs[0]);

  return data;
}

async function getStatus(tx) {
  let status = await arweave.transactions.getStatus(tx);
  console.log(status);
  return status
}

//EXPORTS:
module.exports.upload = upload;
module.exports.findAndDownload = findAndDownload;
module.exports.find = find;
module.exports.getData = getData;
module.exports.getTags = getTags;
module.exports.getStatus = getStatus;



