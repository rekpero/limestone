// import { execute } from 'smartweave/lib/contract-step';
// import { createContractExecutionEnvironment } from 'smartweave/lib/contract-load'

// import Arweave from 'arweave/node';
// import fs from 'fs'

const fs = require('fs');
const Smartweave = require('smartweave');
const Arweave = require('arweave/node');
const Load = require('smartweave/lib/contract-load');
const Step = require('smartweave/lib/contract-step');
const ContractWrapper = require('./ContractWrapper');


const ACCOUNT_1 = require('./keys/.account-1.json');
const ACCOUNT_2 = require('./keys/.account-2.json');

const arweave = Arweave.init({
  host: 'arweave.net',// Hostname or IP address for a Arweave host
  port: 443,          // Port
  protocol: 'https',  // Network protocol http or https
  timeout: 20000,     // Network request timeouts in milliseconds
  logging: false,     // Enable network request logging
});

var user1, user2;
var testToken = "giDl5I40JmmpwleUl6RvOQXg0MHkJEywwkA6_TkdIKg";

describe('Miscellaneous functions', function () {

  it('test', async function () {
    user1 = await arweave.wallets.jwkToAddress(ACCOUNT_1);
    user2 = await arweave.wallets.jwkToAddress(ACCOUNT_2);

    let token = new ContractWrapper("./contracts/src/limestone-token.js", {
      "ticker": "LIME-TST",
      "balances": {
        "R9PL9jt-mZoV6XcNjJD2uB2ajiFTC7PYZ_iyySzzz6U": 100
      }
    });
    await token.execute({function: "transfer", target: user2, qty: 1}, user1);
    console.log(token.state);
  })




});



