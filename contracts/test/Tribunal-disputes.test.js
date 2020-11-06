const ContractWrapper = require('./ContractWrapper');
const WalletLoader = require('./WalletLoader');
const chai = require('chai');
const expect  = chai.expect;

var user1, user2, tribunal;

describe('Miscellaneous functions', function () {

  before(async function() {
    [user1, user2] = await WalletLoader.loadWallets();
    tribunal = new ContractWrapper("./contracts/src/Tribunal.js", {
      BASE_QUORUM: 10
    });
  });

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
  });

  it('should open another dispute', async function () {
    await tribunal.execute({function: "openDispute", title: "Dispute 2"}, user1);

    //There should be one new dispute
    let disputes = await tribunal.state.disputes;
    expect(disputes.length).to.be.equal(2);

    //Dispute should have correct parameters
    let dispute = disputes[1];
    expect(dispute.creator).to.be.equal(user1);
    expect(dispute.title).to.be.equal("Dispute 2");
    expect(dispute.quorum).to.be.equal(10);
  });

});



