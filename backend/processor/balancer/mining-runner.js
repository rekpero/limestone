const Web3 = require('web3');
const miner = require('./bal-mining/index');
const fs = require('fs');
const web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/4151b2d00d774670adf72249002fae04"));

const START_BLOCK = 10674486;
const WEEK = 12;
var lastFetched = 0;

function getNextBlock() {
  let files = fs.readdirSync(`./reports/${WEEK}/`);
  if (files.indexOf('_prices.json') != -1) {
    files.splice(files.indexOf('_prices.json'), 1);
  }
  files = files.filter(val => {return val.indexOf('users') === -1});
  if (files.length>0) {
    let block = parseInt(files[files.length-1].replace('.json', ''));
    return block + 256;
  } else {
    return START_BLOCK ;
  }
}

async function run() {
  //let nextBlock = getNextBlock();
  let nextBlock = 10719542;
  let currentBlock = await web3.eth.getBlockNumber();
  if (currentBlock < nextBlock) {
    console.log("Next block not mined yet.")
  } else {
    console.log("Next block: " + nextBlock);
    if (nextBlock != lastFetched) {
      console.log("Calling execute with block: " + nextBlock);
      try {
        await miner.execute(START_BLOCK, nextBlock, WEEK);
        lastFetched = nextBlock;
      } catch (err) {
        console.log("Error processing snapshot. Will try again");
        console.log(err);
      }
    }
  }
  setTimeout(run, 10000);
};

run();

