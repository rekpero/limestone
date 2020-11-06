const ContractWrapper = require('./ContractWrapper');
const WalletLoader = require('./WalletLoader');
const Smartweave = require('smartweave');
const chai = require('chai');
const expect  = chai.expect;

var user1, user2, tribunal, token;


const Arweave = require('arweave/node');


const arweave = Arweave.init({
  host: 'arweave.net',// Hostname or IP address for a Arweave host
  port: 443,          // Port
  protocol: 'https',  // Network protocol http or https
  timeout: 20000,     // Network request timeouts in milliseconds
  logging: false,     // Enable network request logging
});

describe('Miscellaneous functions', function () {

  before(async function() {
    //Load users from wallet jsons
    [user1, user2] = await WalletLoader.loadWallets();

    //Deploy token contract
    let balances = {};
    balances[user1] = 1000;
    token = new ContractWrapper("./contracts/src/Tribunal.js", {
      "ticker": "LIME-TST",
      "balances": balances
    });

    //Deploy tribunal contract
    tribunal = new ContractWrapper("./contracts/src/Tribunal.js", {
      BASE_QUORUM: 10,
      STAKING_TOKEN: token.contractId
    });

  });

  it('should have no disputes at the beginning', async function () {
    let tokenId = token.contractId;
    console.log("Token ID: " + tokenId);
  });

  //TODO: Testing nested contracts
  // it('should read balances', async function () {
  //   let balances = await token.execute({function: "getBalances"}, user1);
  //   console.log(balances);
  // });

  it('should have no disputes at the beginning', async function () {
    let disputes = await tribunal.state.disputes;
    expect(disputes).to.be.undefined;
  });

  it('should open dispute', async function () {
    await tribunal.execute({function: "openDispute", title: "Dispute 1"}, user1);

    //There should be one new dispute
    let disputes = await tribunal.state.disputes;
    expect(disputes.length).to.be.equal(1);

    //Dispute should have correct parameters
    let dispute = disputes[0];
    expect(dispute.creator).to.be.equal(user1);
    expect(dispute.title).to.be.equal("Dispute 1");
    expect(dispute.quorum).to.be.equal(10);
  })




});



