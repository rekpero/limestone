const Smartweave = require('smartweave');
const Arweave = require('arweave/node');
const fs = require('fs');



const ACCOUNT_1 = require('./keys/.account-1');
//const ACCOUNT_2 = require('../keys/.account-2.json');

// const arweave = Arweave.init({
//   host: 'localhost',// Hostname or IP address for a Arweave host
//   port: 8000,          // Port
//   protocol: 'http',  // Network protocol http or https
//   timeout: 20000,     // Network request timeouts in milliseconds
//   logging: true,     // Enable network request logging
// });

const arweave = Arweave.init({
  host: 'arweave.net',// Hostname or IP address for a Arweave host
  port: 443,          // Port
  protocol: 'https',  // Network protocol http or https
  timeout: 60000,     // Network request timeouts in milliseconds
  logging: false,     // Enable network request logging
});


async function deploy() {

  const user1 = await arweave.wallets.jwkToAddress(ACCOUNT_1);
  let balance = await arweave.wallets.getBalance(user1);
  console.log(balance);
  console.log("User: " + user1 + " Balance: " + balance);

  let tx = await arweave.createTransaction({
    target: '1seRanklLU_1VTGkEk7P0xAwMJfA7owA1JHW5KyZKlY',
    quantity: arweave.ar.arToWinston('0.01')
  }, ACCOUNT_1);

  await arweave.transactions.sign(tx, ACCOUNT_1);

  const response = await arweave.transactions.post(tx);

  console.log(response);

  // const contractBuffer = fs.readFileSync("./contracts/src/Token.js");
  // let contractSrc = contractBuffer.toString();
  //
  // let init = {};
  // init.balances = {};
  // init.balances[user1] = 1000;
  // init.ticker = "TST";
  // init.OPERATOR = user1;
  //
  // let tx = await Smartweave.createContract(arweave, ACCOUNT_1, contractSrc, JSON.stringify(init));
  // console.log(tx);
}

async function readContract() {
  let state = await Smartweave.readContract(arweave, CONTRACT_ID);
  console.log(state);
}

async function transfer() {
  let state = await Smartweave.interactWriteDryRun(arweave, ACCOUNT_1, CONTRACT_ID, {
    function: "transfer",
    target: "aaa",
    qty: 1
  });
  console.log(state);
}

async function delegateTransfer() {
  const user1 = await arweave.wallets.jwkToAddress(ACCOUNT_1);

  let state = await Smartweave.interactWriteDryRun(arweave, ACCOUNT_1, CONTRACT_ID, {
    function: "delegateTransfer",
    from: user1,
    target: "aaa",
    qty: 2
  });
  console.log(state);
}

const CONTRACT_ID = "qOwnVHYDbOx3k0G9LxahouY3lNnAc0e-X-gVWjRn8EI"

deploy();
//readContract();
//delegateTransfer();
