const Arweave = require('arweave');

const arweave = Arweave.init({
  host: 'arweave.net',// Hostname or IP address for a Arweave host
  port: 443,          // Port
  protocol: 'https',  // Network protocol http or https
  timeout: 20000,     // Network request timeouts in milliseconds
  logging: false,     // Enable network request logging
});

const ACCOUNT_1 = require('../keys/.account-1.json');
const ACCOUNT_2 = require('../keys/.account-2.json');

async function loadWallets() {
  return [
    await arweave.wallets.jwkToAddress(ACCOUNT_1),
    await arweave.wallets.jwkToAddress(ACCOUNT_2)
  ]
}

module.exports.loadWallets = loadWallets;
