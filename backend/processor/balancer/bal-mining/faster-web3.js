const Web3 = require('web3');
const poolAbi = require('./abi/BPool.json');
const tokenAbi = require('./abi/BToken.json');

const web3 = new Web3(
  // Replace YOUR-PROJECT-ID with a Project ID from your Infura Dashboard
  //new Web3.providers.WebsocketProvider("https://vigilant-pasteur:anthem-deacon-napkin-sandy-fling-viral@ws-nd-974-782-067.p2pify.com")
  new Web3.providers.HttpProvider("https://vigilant-pasteur:anthem-deacon-napkin-sandy-fling-viral@nd-974-782-067.p2pify.com")
  //new Web3.providers.HttpProvider("https://rpc.archivenode.io/e8rwjzi2wxxjifzfvcn2e8rwjw2hm5pc")
);

async function fetchPoolData(pools, i) {
  let start = new Date().getTime();
  var batch = new web3.BatchRequest();
  let promises = pools.map(function(pool) {
    let bPool = new web3.eth.Contract(poolAbi, pool.id);
    bPool.defaultBlock = i;
    return Promise.all([
      new Promise((res, rej) => {
        batch.add(bPool.methods.isPublicSwap().call.request({},
          (err, data) => err ? rej(err) : res(pool.publicSwap = data)
        ));
      }),
      new Promise((res, rej) => {
        batch.add(bPool.methods.getSwapFee().call.request({},
          (err, data) => err ? rej(err) : res(pool.poolFee = data)
        ));
      }),
      new Promise((res, rej) => {
        batch.add(bPool.methods.totalSupply().call.request({},
          (err, data) => err ? rej(err) : res(pool.bptSupplyWei = data)
        ));
      })]);
    });

    // pool.publicSwap = await bPool.methods.isPublicSwap().call(undefined, i);
    // pool.poolFee = await bPool.methods.getSwapFee().call(undefined, i);
    // pool.bptSupplyWei = await bPool.methods.totalSupply().call(undefined, i);

  await batch.execute();

  await Promise.all(promises);
  let elapsed = new Date().getTime() - start;
  //pools.forEach( pool => {console.log(pool.id + " : " + pool.publicSwap + ", " + pool.poolFee + ", " + pool.bptSupplyWei)})
  console.log("Fetched pool data in: " + elapsed/1000);

  //console.log("Supply: " + pools[0].bptSupplyWei);
  // console.log("Fetched all POOL DATA");
}

async function fetchCurrentTokens(pools, i) {
  let start = new Date().getTime();
  var batch = new web3.BatchRequest();
  let promises = pools.map(async function(pool) {
    let bPool = new web3.eth.Contract(poolAbi, pool.id);
    bPool.defaultBlock = i;
    return new Promise((res, rej) => {
      batch.add(bPool.methods.getCurrentTokens().call.request({},
        (err, data) => err ? rej(err) : res(pool.currentTokens = data)
      ));
    })
  });

  await batch.execute();
  await Promise.all(promises);

  let elapsed = new Date().getTime() - start;
  //pools.forEach( pool => {console.log(pool.id + " : " + pool.publicSwap + ", " + pool.poolFee + ", " + pool.bptSupplyWei)})
  console.log("Fetched current tokens in: " + elapsed/1000);

}

async function fetchTokenData(pools, i) {
  let start = new Date().getTime();
  var balanceBatch = new web3.BatchRequest();
  var normBatch = new web3.BatchRequest();
  var decimalBatch = new web3.BatchRequest();

  let balancePromises = [];
  let normPromises = [];
  let decimalsPromises = [];
  pools.forEach(function(pool) {
    let bPool = new web3.eth.Contract(poolAbi, pool.id);
    bPool.defaultBlock = i;
    pool.tokenData = {};
    for (const t of pool.currentTokens) {
      let token = web3.utils.toChecksumAddress(t);
      pool.tokenData[token] = {};

      balancePromises.push(
        new Promise((res, rej) => {
          balanceBatch.add(bPool.methods.getBalance(token).call.request({},
            (err, data) => err ? rej(err) : res(pool.tokenData[token].tokenBalanceWei = data)
          ));
        })
      );

      normPromises.push(
        new Promise((res, rej) => {
          normBatch.add(bPool.methods.getNormalizedWeight(token).call.request({},
            (err, data) => err ? rej(err) : res(pool.tokenData[token].normWeight = data)
          ));
        })
      );

      let bToken = new web3.eth.Contract(tokenAbi, token);
      bToken.defaultBlock = i;
      decimalsPromises.push(
        new Promise((res, rej) => {
          decimalBatch.add(bToken.methods.decimals().call.request({},
            (err, data) => err ? rej(err) : res(pool.tokenData[token].tokenDecimals = data)
          ));
        })
      );

    }
  });

  await balanceBatch.execute();
  await normBatch.execute();
  await decimalBatch.execute();

  await Promise.all(balancePromises);
  await Promise.all(normPromises);
  await Promise.all(decimalsPromises);

  let elapsed = new Date().getTime() - start;
  //pools.forEach( pool => {console.log(pool.id + " : " + pool.publicSwap + ", " + pool.poolFee + ", " + pool.bptSupplyWei)})
  console.log("Fetched all tokens in: " + elapsed/1000);
}

async function fetchHoldersData(pool, i) {
  let start = new Date().getTime();
  var batch = new web3.BatchRequest();

  let bPool = new web3.eth.Contract(poolAbi, pool.poolAddress);
  bPool.defaultBlock = i;
  pool.userBalances = {};

  let promises = pool.shareHolders.map(async function(holder) {
    return new Promise((res, rej) => {
      batch.add(bPool.methods.balanceOf(holder).call.request({},
        (err, data) => err ? rej(err) : res(pool.userBalances[holder] = data)
      ));
    })
  });

  // let promises = pool.shareHolders.map(async function(holder) {
  //   pool.userBalances[holder] = await bPool.methods.balanceOf(holder).call(undefined, i);
  // });

  //console.log("POOL: " + pool.poolAddress + " Holders: " + pool.shareHolders.length);
  await batch.execute();
  await Promise.all(promises);

  let elapsed = new Date().getTime() - start;
  //pools.forEach( pool => {console.log(pool.id + " : " + pool.publicSwap + ", " + pool.poolFee + ", " + pool.bptSupplyWei)})
  //console.log("Fetched pool in: " + elapsed/1000);
}


module.exports = {
  fetchPoolData,
  fetchCurrentTokens,
  fetchTokenData,
  fetchHoldersData
};
