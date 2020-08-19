const my = require('./reports/11/10628918.json');
const others = require('./reports/org/10628918.json');
const totals = require('./reports/org/_totals.json');

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

  let oPools = others[2];
  let mPools = my[2];

  let oKeys = Object.keys(oPools);
  let mKeys = Object.keys(mPools);

  console.log("M pools: " + mKeys.length);
  console.log("O pools: " + oKeys.length);

  for (key of oKeys) {
    if (oPools[key] != mPools[key]) {
      console.log(key + " my: " + mPools[key] + " other: " + oPools[key]);
    }
  }

  // let oDetails = others[0];
  // let mDetails = my[0];
  //
  // let oKeys = Object.keys(oPools);
  // let mKeys = Object.keys(mPools);



  //
  // for(var i=0; i<10;i++) {
  //   let key = oKeys[i];
  //   let other = oPools[key];
  //   let my = mPools[key];
  //   if (JSON.stringify(other) !== JSON.stringify(my)) {
  //     console.log("Diff my: ");
  //     console.log(my);
  //     console.log("Diff other: ");
  //     console.log(other);
  //   }
  // }



  console.log("All checked");
}

//POOL
//0x72cd8f4504941bf8c5a21d1fd83a96499fd71d2c
//1592 holders, not 1000
//HOLDER
//0xa4ff6ffa9dbdbc647b4e150e9c1017853a9ed139

// const Web3 = require('web3');
// const poolAbi = require('./abi/BPool.json');
// const tokenAbi = require('./abi/BToken.json');
// const utils = require('./utils');
//
// const web3 = new Web3(
//   // Replace YOUR-PROJECT-ID with a Project ID from your Infura Dashboard
//   new Web3.providers.WebsocketProvider("wss://vigilant-pasteur:anthem-deacon-napkin-sandy-fling-viral@ws-nd-974-782-067.p2pify.com")
// );
//
// async function check() {
//   let bPool = new web3.eth.Contract(poolAbi, "0x055d9894faae9118414244d286027599c250fb6b");
//   let balance = await bPool.methods.balanceOf("0x364d55a1e0495dbc6ad810f69020f520bd2c86c4").call(undefined, 10493387);
//   console.log(balance);
// }
//
// async function checkPool() {
//   let pools = await utils.fetchAllPools(10493387);
//   for(pool of pools) {
//     if (pool.id === "0x055d9894faae9118414244d286027599c250fb6b") {
//       console.log(pool.id + " : " + pool.shares.length);
//     }
//   }
// }

function sumTotals() {
  let keys = Object.keys(totals);
  let sum = 0;
  keys.forEach(key => sum+=parseFloat(totals[key]));
  //let sum = keys.reduce((key, sum) => sum + parseFloat(totals[key]), 0);
  console.log("SUM: " + sum);

}

//checkPool();

//check();

checkRewards();

sumTotals();


//0x055d9894faae9118414244d286027599c250fb6b
//0x364d55a1e0495dbc6ad810f69020f520bd2c86c4
