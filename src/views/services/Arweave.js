import Arweave from 'arweave/web';
const ARQL =  require('arql-ops');

const arweave = Arweave.init({
  host: 'arweave.net',// Hostname or IP address for a Arweave host
  port: 443,          // Port
  protocol: 'https',  // Network protocol http or https
  timeout: 20000,     // Network request timeouts in milliseconds
  logging: false,     // Enable network request logging
});

export async function find(token, source) {
  let myQuery = ARQL.and(
    ARQL.equals('token', token),
    ARQL.equals('source', source),
  );

  let results = await arweave.arql(myQuery);
  return results;
}

export async function download(tx) {
  let rawData = await arweave.transactions.getData(tx, {decode: true, string: true});
  let data = JSON.parse(rawData);
  return data;
}

export async function findAndDownload(token, source) {
  let txs = await find(token, source);
  console.log("TX found: " + txs[0]);
  let data = await download(txs[0]);

  return data;
}


