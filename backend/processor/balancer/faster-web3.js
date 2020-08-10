const Web3 = require('web3');
const poolAbi = require('./abi/BPool.json');
const tokenAbi = require('./abi/BToken.json');

var web3 = new Web3(
  // Replace YOUR-PROJECT-ID with a Project ID from your Infura Dashboard
  //new Web3.providers.WebsocketProvider("https://vigilant-pasteur:anthem-deacon-napkin-sandy-fling-viral@ws-nd-974-782-067.p2pify.com")
  //new Web3.providers.HttpProvider("https://infallible-newton:ahead-sludge-aged-snooze-resize-clutch@nd-641-207-013.p2pify.com")
  //new Web3.providers.HttpProvider("https://awesome-wilson:jockey-morale-item-dwarf-candle-slain@nd-460-233-595.p2pify.com")
  new Web3.providers.HttpProvider("https://rpc.archivenode.io/e8rwjzi2wxxjifzfvcn2e8rwjw2hm5pc")
);

function reset() {
  web3 = new Web3(
    // Replace YOUR-PROJECT-ID with a Project ID from your Infura Dashboard
    //new Web3.providers.WebsocketProvider("https://vigilant-pasteur:anthem-deacon-napkin-sandy-fling-viral@ws-nd-974-782-067.p2pify.com")
    //new Web3.providers.HttpProvider("https://infallible-newton:ahead-sludge-aged-snooze-resize-clutch@nd-641-207-013.p2pify.com")
    //new Web3.providers.HttpProvider("https://awesome-wilson:jockey-morale-item-dwarf-candle-slain@nd-460-233-595.p2pify.com")
    new Web3.providers.HttpProvider("https://rpc.archivenode.io/e8rwjzi2wxxjifzfvcn2e8rwjw2hm5pc")
  );
}

async function fetchPoolData(pools, i) {
  // let current = await await web3.eth.getBlockNumber();
  // console.log("Current block: " + current);
  // for(var p=0;p<pools.length;p++){
  //   let pool = pools[i];
  //   let bPool = new web3.eth.Contract(poolAbi, pool.id);
  //   bPool.defaultBlock = i
  //   console.log("Querying: " + pool.id);
  //   let pub = await bPool.methods.isPublicSwap().call({});
  //
  //   console.log(pub);
  // };

  let start = new Date().getTime();
  var batch = new web3.BatchRequest();
  let promises = pools.map(function (pool) {
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
  console.log("Fetched pool data in: " + elapsed / 1000);
}

async function fetchCurrentTokens(pools, i) {
  let start = new Date().getTime();
  var batch = new web3.BatchRequest();
  let c=0;
  let promises = pools.map(async function(pool) {
    if (c>10) return;
    c++;
    let bPool = new web3.eth.Contract(poolAbi, pool.id);
    bPool.defaultBlock = i;
      return new Promise((res, rej) => {
        batch.add(
          bPool.methods.getCurrentTokens().call.request({}, function(bp) {
            return function(err, data) {
              if (err) {
                console.log("Error getting current tokens");
                console.log(err);
              } else {
                console.log(bp._address);
                console.log(pool.id);
                console.log(data);
                res(pool.currentTokens = data)
              }
            }
          } (bPool))
        )
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

  console.log("Fetching token data...");


  pools.forEach(function (pool) {
    let bPool = new web3.eth.Contract(poolAbi, pool.id);
    bPool.defaultBlock = i;
    pool.tokenData = {};

    if (pool.currentTokens) {
      for (const t of pool.currentTokens) {
        let token = web3.utils.toChecksumAddress(t);
        pool.tokenData[token] = {};


        balancePromises.push(
          new Promise((res, rej) => {
            balanceBatch.add(bPool.methods.getBalance(token).call.request({},
              (err, data) => err ? rej(err) : res(true)
              //(err, data) => err ? rej(err) : res(pool.tokenData[token].tokenBalanceWei = data)
            ));
          })
        );


        // normPromises.push(
        //   new Promise((res, rej) => {
        //     normBatch.add(bPool.methods.getNormalizedWeight(token).call.request({},
        //       (err, data) => err ? rej(err) : res(pool.tokenData[token].normWeight = data)
        //     ));
        //   })
        // );
        //
        // let bToken = new web3.eth.Contract(tokenAbi, token);
        // bToken.defaultBlock = i;
        // decimalsPromises.push(
        //   new Promise((res, rej) => {
        //     decimalBatch.add(bToken.methods.decimals().call.request({},
        //       (err, data) => err ? rej(err) : res(pool.tokenData[token].tokenDecimals = data)
        //     ));
        //   })
        // );

      }
    }
  });

  await balanceBatch.execute();
  // await normBatch.execute();
  // await decimalBatch.execute();

  await Promise.all(balancePromises);
  // await Promise.all(normPromises);
  // await Promise.all(decimalsPromises);

  let elapsed = new Date().getTime() - start;
  //pools.forEach( pool => {console.log(pool.id + " : " + pool.publicSwap + ", " + pool.poolFee + ", " + pool.bptSupplyWei)})
  console.log("Fetched all tokens in: " + elapsed / 1000);
}

async function fetchHoldersData(pool, i) {
  let start = new Date().getTime();
  var batch = new web3.BatchRequest();

  let bPool = new web3.eth.Contract(poolAbi, pool.poolAddress);
  bPool.defaultBlock = i;
  pool.userBalances = {};

  let promises = pool.shareHolders.map(async function (holder) {
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
  console.log("Fetched pool in: " + elapsed / 1000);
}

async function fetchAllHoldersData(pools, i) {
  let start = new Date().getTime();
  var batch = new web3.BatchRequest();


  let promises = [];

  pools.forEach(pool => {
    let bPool = new web3.eth.Contract(poolAbi, pool.id);
    bPool.defaultBlock = i;
    pool.userBalances = {};
    pool.shareHolders.forEach(async function (holder) {
      promises.push(new Promise((res, rej) => {
        batch.add(bPool.methods.balanceOf(holder).call.request({},
          (err, data) => err ? rej(err) : res(pool.userBalances[holder] = data)
        ));
      }));
    });
  });

  // let promises = pool.shareHolders.map(async function(holder) {
  //   pool.userBalances[holder] = await bPool.methods.balanceOf(holder).call(undefined, i);
  // });

  //console.log("POOL: " + pool.poolAddress + " Holders: " + pool.shareHolders.length);
  await batch.execute();
  await Promise.all(promises);

  let elapsed = new Date().getTime() - start;
  //pools.forEach( pool => {console.log(pool.id + " : " + pool.publicSwap + ", " + pool.poolFee + ", " + pool.bptSupplyWei)})
  console.log("Fetched all holders in: " + elapsed / 1000);
}


module.exports = {
  fetchPoolData,
  fetchCurrentTokens,
  fetchTokenData,
  fetchHoldersData,
  fetchAllHoldersData
};
