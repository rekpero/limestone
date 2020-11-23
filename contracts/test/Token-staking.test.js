const ContractWrapper = require('./common/ContractWrapper');
const WalletLoader = require('./common/WalletLoader');
const Smartweave = require('smartweave');
const chai = require('chai');
const expect  = chai.expect;
chai.use(require('chai-as-promised'))

var user1, user2, tribunal, token;


const Arweave = require('arweave/node');


const arweave = Arweave.init({
  host: 'arweave.net',// Hostname or IP address for a Arweave host
  port: 443,          // Port
  protocol: 'https',  // Network protocol http or https
  timeout: 20000,     // Network request timeouts in milliseconds
  logging: false,     // Enable network request logging
});

describe('Token staking', function () {

  before(async function() {
    //Load users from wallet jsons
    [user1, user2] = await WalletLoader.loadWallets();

    //Deploy token contract
    let balances = {};
    balances[user1] = 1000;
    token = new ContractWrapper("./contracts/src/Token.js", {
      "ticker": "LIME-TST",
      "balances": balances
    });
  });


  it('should stake on yes from user1', async function () {
    await token.execute({function: "stake", contract: "CONTRACT_HASH", topic: "DISPUTE_ID", key:"yes", value: 11}, user1);

    let staked = await token.state.stakes["CONTRACT_HASH"]["DISPUTE_ID"]["yes"];
    expect(staked.total).to.be.equal(11);
    expect(staked[user1]).to.be.equal(11);
  });

  it('should stake on yes from user2', async function () {
    await token.execute({function: "stake", contract: "CONTRACT_HASH", topic: "DISPUTE_ID", key:"yes", value: 12}, user2);

    //There should be one new dispute
    let staked = await token.state.stakes["CONTRACT_HASH"]["DISPUTE_ID"]["yes"];
    expect(staked.total).to.be.equal(23);
    expect(staked[user1]).to.be.equal(11);
    expect(staked[user2]).to.be.equal(12);
  });


  it('should stake on no dispute from user2', async function () {
    await token.execute({function: "stake", contract: "CONTRACT_HASH", topic: "DISPUTE_ID", key:"no", value: 7}, user1);

    //There should be one new dispute
    let staked = await token.state.stakes["CONTRACT_HASH"]["DISPUTE_ID"]["no"];
    expect(staked.total).to.be.equal(7);
    expect(staked[user1]).to.be.equal(7);
  });




});



