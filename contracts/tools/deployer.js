const Smartweave = require('smartweave');
const Arweave = require('arweave/node');
const fs = require('fs');



const ACCOUNT_1 = require('./keys/.account-1');
//const ACCOUNT_2 = require('../keys/.account-2.json');



const arweave = Arweave.init({
  host: 'arweave.net',// Hostname or IP address for a Arweave host
  port: 443,          // Port
  protocol: 'https',  // Network protocol http or https
  timeout: 60000,     // Network request timeouts in milliseconds
  logging: false,     // Enable network request logging
});

async function checkBalance() {
  let balance = await arweave.wallets.getBalance(user1);
  console.log(balance);
  console.log("User: " + user1 + " Balance: " + balance);
}

async function deployToken() {
  const user1 = await arweave.wallets.jwkToAddress(ACCOUNT_1);

  const contractBuffer = fs.readFileSync("./contracts/src/Token.js");
  let contractSrc = contractBuffer.toString();

  let init = {};
  init.balances = {};
  init.balances[user1] = 1000000;
  init.ticker = "LIME-TST";
  init.OPERATOR = user1;

  let tx = await Smartweave.createContract(arweave, ACCOUNT_1, contractSrc, JSON.stringify(init));
  console.log(tx);
}

async function deployTribunal() {

  const user1 = await arweave.wallets.jwkToAddress(ACCOUNT_1);

  const contractBuffer = fs.readFileSync("./contracts/src/Tribunal.js");
  let contractSrc = contractBuffer.toString();

  let init = {};
  init.balances = {};
  init.balances[user1] = 1000000;
  init.ticker = "LIME-TST";
  init.OPERATOR = user1;

  let tx = await Smartweave.createContract(arweave, ACCOUNT_1, contractSrc, JSON.stringify({
    BASE_QUORUM: 1000
  }));
  console.log(tx);
}



deployToken();
