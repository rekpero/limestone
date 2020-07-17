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
  console.log(tx);
  return tx;
}

async function find(token, source) {
  let myQuery = ARQL.and(
    ARQL.equals('token', token),
    ARQL.equals('source', source),
  );

  let results = await arweave.arql(myQuery);
  return results;
}

async function download(tx) {
  let rawData = await arweave.transactions.getData(tx, {decode: true, string: true});
  console.log("Downloaded: " + rawData);
  let data = JSON.parse(rawData);
  return data;
}

async function findAndDownload(token, source) {
  let txs = await find(token, source);
  console.log("TX found: " + txs[0]);
  let data = await download(txs[0]);

  return data;
}

//EXPORTS:
module.exports.upload = upload;
module.exports.findAndDownload = findAndDownload;



