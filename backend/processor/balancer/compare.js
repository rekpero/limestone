const my = require('./reports/10/10538432');
const others = require('./reports/9/10538432');

//console.log(my);

// let myUsers = my[0];
// let myCount = Object.keys(myUsers).length;
// console.log("My count: " + myCount);
//
// let othersCount = Object.keys(others[0]).length;
// console.log("Others count: " + othersCount);


// let oUsers = others[0];
// let oUserKeys = Object.keys(oUsers);
// let key = oUserKeys[0];
// let oPools = oUsers[key];
// console.log(oPools);
//
// console.log("MY");
// let mPools = my[0][key];
// console.log(mPools);


function checkRewards() {
  let oTotal = others[1];
  let mTotal = my[1];

  let keys = Object.keys(oTotal);

//Filter off zero
  for (key of keys) {
    if (oTotal[key] == 0) delete oTotal[key]
  }
  for (key of keys) {
    if (mTotal[key] == 0) delete mTotal[key]
  }

  console.log("My shareholders: " + Object.keys(mTotal).length)
  console.log("Other shareholders: " + Object.keys(oTotal).length)


  for (key of keys) {
    if (oTotal[key] != mTotal[key]) {
      console.log(key + " my: " + mTotal[key] + " other: " + oTotal[key]);
    }
  }
  console.log("All checked");
}

//POOL
//0x72cd8f4504941bf8c5a21d1fd83a96499fd71d2c
//1592 holders, not 1000
//HOLDER
//0xa4ff6ffa9dbdbc647b4e150e9c1017853a9ed139

const Web3 = require('web3');
const poolAbi = require('./abi/BPool.json');
const tokenAbi = require('./abi/BToken.json');
const utils = require('./utils');

const web3 = new Web3(
  // Replace YOUR-PROJECT-ID with a Project ID from your Infura Dashboard
  new Web3.providers.WebsocketProvider("wss://vigilant-pasteur:anthem-deacon-napkin-sandy-fling-viral@ws-nd-974-782-067.p2pify.com")
);

async function check() {
  let bPool = new web3.eth.Contract(poolAbi, "0x055d9894faae9118414244d286027599c250fb6b");
  let balance = await bPool.methods.balanceOf("0x364d55a1e0495dbc6ad810f69020f520bd2c86c4").call(undefined, 10493387);
  console.log(balance);
}

async function checkPool() {
  let pools = await utils.fetchAllPools(10493387);
  for(pool of pools) {
    if (pool.id === "0x055d9894faae9118414244d286027599c250fb6b") {
      console.log(pool.id + " : " + pool.shares.length);
    }
  }
}

//checkPool();

//check();

checkRewards();


//0x055d9894faae9118414244d286027599c250fb6b
//0x364d55a1e0495dbc6ad810f69020f520bd2c86c4
