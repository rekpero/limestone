const fs = require('fs');
const Arweave = require('arweave/node');
const ContractLoad = require('smartweave/lib/contract-load');
const ContractStep = require('smartweave/lib/contract-step');

const arweave = Arweave.init({
  host: 'arweave.net',// Hostname or IP address for a Arweave host
  port: 443,          // Port
  protocol: 'https',  // Network protocol http or https
  timeout: 20000,     // Network request timeouts in milliseconds
  logging: false,     // Enable network request logging
});

class ContractWrapper {

  constructor(srcPath, initialState) {
    const contractBuffer = fs.readFileSync(srcPath);
    let contractSrc = contractBuffer.toString();
    this.contractId = "TEST-" + new Date().getTime();

    let contractInfo = ContractLoad.createContractExecutionEnvironment(arweave, contractSrc, this.contractId);
    console.log(contractInfo);

    this.handler = contractInfo.handler;
    this.state = initialState;
  }

  async execute(tx, from) {
    let res = await ContractStep.execute(this.handler, {input: tx, caller: from} ,this.state );
    if (res.type === 'error' || res.type === 'exception') {
      throw Error(res.result);
    }
    //console.log(res);
    this.state = res.state;
  }
}

module.exports = ContractWrapper;
