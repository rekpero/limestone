const ContractWrapper = require('./common/ContractWrapper');
const WalletLoader = require('./common/WalletLoader');
const chai = require('chai');
const expect  = chai.expect;
chai.use(require("chai-as-promised"));

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

  it('should prevent opening dispute without title', async function () {
    await expect(tribunal.execute({function: "openDispute",
      description: "Bla, bla, bla",
      disputedTx: "tx1",
      deposit: 100
    }, user1)).to.be.rejectedWith('No title specified');

  });

  it('should open dispute', async function () {
    await tribunal.execute({function: "openDispute",
      title: "First dispute",
      description: "Bla, bla, bla",
      disputedTx: "tx1",
      deposit: 100
    }, user1);

    //There should be one new dispute
    let disputes = await tribunal.state.disputes;
    expect(disputes.length).to.be.equal(1);

    //Dispute should have correct parameters
    let dispute = disputes[0];
    expect(dispute.creator).to.be.equal(user1);
    expect(dispute.id).to.be.equal("D-1");
    expect(dispute.title).to.be.equal("First dispute");
    expect(dispute.quorum).to.be.equal(10);
    expect(dispute.description).to.be.equal("Bla, bla, bla");
    expect(dispute.disputedTx).to.be.equal("tx1");
    expect(dispute.deposit).to.be.equal(100);
  });

  it('should prevent opening dispute with the same Tx', async function () {
    await expect(tribunal.execute({function: "openDispute",
      title: "First dispute",
      description: "Bla, bla, bla",
      disputedTx: "tx1",
      deposit: 100
    }, user1)).to.be.rejectedWith('Transaction tx1 has already been disputed');

  });

  it('should open another dispute', async function () {
    await tribunal.execute({function: "openDispute",
      title: "Second dispute",
      description: "Bla, bla, bla",
      disputedTx: "tx2",
      deposit: 200
    }, user1);

    //There should be one new dispute
    let disputes = await tribunal.state.disputes;
    expect(disputes.length).to.be.equal(2);

    //Dispute should have correct parameters
    let dispute = disputes[1];
    expect(dispute.creator).to.be.equal(user1);
    expect(dispute.id).to.be.equal("D-2");
    expect(dispute.title).to.be.equal("Second dispute");
    expect(dispute.quorum).to.be.equal(10);
    expect(dispute.description).to.be.equal("Bla, bla, bla");
    expect(dispute.disputedTx).to.be.equal("tx2");
    expect(dispute.deposit).to.be.equal(200);
  });

});



