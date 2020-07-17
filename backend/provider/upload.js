const Arweave = require('arweave/node');
const PRIVATE_KEY = require('./.secret.json');

const arweave = Arweave.init({
  host: 'arweave.net',// Hostname or IP address for a Arweave host
  port: 443,          // Port
  protocol: 'https',  // Network protocol http or https
  timeout: 20000,     // Network request timeouts in milliseconds
  logging: false,     // Enable network request logging
});



async function upload(data, tags) {
  let key = await arweave.wallets.generate();

  console.log(key);

  let transactionB = await arweave.createTransaction({
    data: Buffer.from('Some data', 'utf8')
  }, key);


  //let tx = await arweave.createTransaction({data: data}, PRIVATE_KEY);
  // Object.keys(tags).forEach(function(key) {
  //   tx.addTag(key, tags[key]);
  // });
  // await arweave.transactions.sign(tx, key);
  // const response = await arweave.transactions.post(tx);
  // console.log(response.status);
}

async function download() {
  arweave.transactions.getData('TjoSG4xE5EmqSUiR7eveWVGJR3U0AEeoVeah6HCn8o0', {decode: true, string: true}).then(data => {
    console.log(data);
    // <!DOCTYPE HTML>...
  });
}

//upload({test: "Kuba"}, {token: "TST", source: "Coingecko"});

download();
