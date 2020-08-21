const Web3 = require('web3');
const BigNumber = require('bignumber.js');
const cliProgress = require('cli-progress');
const fs = require('fs');
const { argv } = require('yargs');

const utils = require('./lib/utils');
const fasterWeb3 = require('./faster-web3');
const poolAbi = require('./abi/BPool.json');
const tokenAbi = require('./abi/BToken.json');

const { uncappedTokens } = require('./lib/tokens');
const {
  getFeeFactor,
  getBalFactor,
  getRatioFactor,
  getWrapFactor,
} = require('./lib/factors');


// const web3 = new Web3(
//     new Web3.providers.WebsocketProvider(`ws://localhost:8546`)
// );

// const web3 = new Web3(
//   // Replace YOUR-PROJECT-ID with a Project ID from your Infura Dashboard
//   new Web3.providers.WebsocketProvider("wss://vigilant-pasteur:anthem-deacon-napkin-sandy-fling-viral@ws-nd-974-782-067.p2pify.com")
// );

// const web3 = new Web3(
//     new Web3.providers.WebsocketProvider(`ws://localhost:8546`)
// );

const web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/4151b2d00d774670adf72249002fae04"));




BigNumber.config({
    EXPONENTIAL_AT: [-100, 100],
    ROUNDING_MODE: BigNumber.ROUND_DOWN,
    DECIMAL_PLACES: 18,
});

function bnum(val) {
  return new BigNumber(val.toString());
}

// if (!argv.startBlock || !argv.endBlock || !argv.week) {
//     console.log(
//         'Usage: node index.js --week 1 --startBlock 10131642 --endBlock 10156690'
//     );
//     process.exit();
// }

//const END_BLOCK = argv.endBlock; // Closest block to reference time at end of week
//const START_BLOCK = argv.startBlock; // Closest block to reference time at beginning of week
const WEEK = argv.week; // Week for mining distributions. Ex: 1

const BAL_PER_WEEK = bnum(145000);
const BLOCKS_PER_SNAPSHOT = 256;
const SNAPSHOTS_PER_WEEK = 178;
//const SNAPSHOTS_PER_WEEK = 151;

// const BAL_PER_SNAPSHOT = BAL_PER_WEEK.div(
//    bnum(Math.ceil((END_BLOCK - START_BLOCK) / BLOCKS_PER_SNAPSHOT))
// ); // Ceiling because it includes end block
const BAL_PER_SNAPSHOT = BAL_PER_WEEK.div(SNAPSHOTS_PER_WEEK);



async function getRewardsAtBlock(i, pools, prices) {
    let totalBalancerLiquidity = bnum(0);

    console.log("Getting block: " + i);
    let block = await web3.eth.getBlock(i);

    console.log(new Date(block.timestamp).toLocaleTimeString());

    let allPoolData = [];
    let userPools = {};
    let userLiquidity = {};
    let tokenTotalMarketCaps = {};

    let start = new Date().getTime()/1000;

    await fasterWeb3.fetchPoolData(pools, i);
    await fasterWeb3.fetchCurrentTokens(pools, i);
    await fasterWeb3.fetchTokenData(pools, i);

    for (const pool of pools) {
        let poolData = {};
        poolData.poolAddress = pool.id;

        //Copy after fetching
        poolData.bptSupplyWei = pool.bptSupplyWei;

        // Check if at least two tokens have a price
        let atLeastTwoTokensHavePrice = false;
        let nTokensHavePrice = 0;

        if (pool.createTime > block.timestamp || !pool.tokensList) {
            continue;
        }

        //let bPool = new web3.eth.Contract(poolAbi, poolData.poolAddress);

        // let publicSwap = await bPool.methods.isPublicSwap().call(undefined, i);
        // if (!publicSwap) {
        //    continue;
        // }
        if (!pool.publicSwap) {
            continue;
        }

        // let currentTokens = await bPool.methods
        //     .getCurrentTokens()
        //     .call(undefined, i);
        let currentTokens = pool.currentTokens;


        for (const t of currentTokens) {
            let token = web3.utils.toChecksumAddress(t);
            if (prices[token] !== undefined && prices[token].length > 0) {
                nTokensHavePrice++;
                if (nTokensHavePrice > 1) {
                    atLeastTwoTokensHavePrice = true;
                    break;
                }
            }
        }



        if (!atLeastTwoTokensHavePrice) {
            continue;
        }

        let poolMarketCap = bnum(0);
        let originalPoolMarketCapFactor = bnum(0);
        let eligibleTotalWeight = bnum(0);
        let poolRatios = [];



        for (const t of currentTokens) {
            // Skip token if it doesn't have a price
            let token = web3.utils.toChecksumAddress(t);
            if (prices[token] === undefined || prices[token].length === 0) {
                continue;
            }

            // let bToken = new web3.eth.Contract(tokenAbi, token);
            // let tokenBalanceWei = await bPool.methods
            //     .getBalance(token)
            //     .call(undefined, i);
            // let tokenDecimals = await bToken.methods.decimals().call();
            // let normWeight = await bPool.methods
            //     .getNormalizedWeight(token)
            //     .call(undefined, i);
            let tokenBalanceWei = pool.tokenData[token].tokenBalanceWei;
            let tokenDecimals = pool.tokenData[token].tokenDecimals;
            let normWeight = pool.tokenData[token].normWeight;


            eligibleTotalWeight = eligibleTotalWeight.plus(
                utils.scale(normWeight, -18)
            );

            let closestPrice = prices[token].reduce((a, b) => {
                return Math.abs(b[0] - block.timestamp * 1000) <
                    Math.abs(a[0] - block.timestamp * 1000)
                    ? b
                    : a;
            })[1];

      let tokenBalance = utils.scale(tokenBalanceWei, -tokenDecimals);
      let tokenMarketCap = tokenBalance.times(bnum(closestPrice)).dp(18);

      if (poolData.tokens) {
        let obj = {
          token: t,
          origMarketCap: tokenMarketCap,
          normWeight: utils.scale(normWeight, -18),
        };
        poolData.tokens.push(obj);
      } else {
        poolData.tokens = [
          {
            token: t,
            origMarketCap: tokenMarketCap,
            normWeight: utils.scale(normWeight, -18),
          },
        ];
      }

      poolRatios.push(utils.scale(normWeight, -18));
      poolMarketCap = poolMarketCap.plus(tokenMarketCap);
    }

    poolData.marketCap = poolMarketCap;
    poolData.eligibleTotalWeight = eligibleTotalWeight;

    let ratioFactor = getRatioFactor(currentTokens, poolRatios);
    let wrapFactor = getWrapFactor(currentTokens, poolRatios);

        //let poolFee = await bPool.methods.getSwapFee().call(undefined, i);
        let poolFee = pool.poolFee;

        poolFee = utils.scale(poolFee, -16); // -16 = -18 * 100 since it's in percentage terms
        let feeFactor = bnum(getFeeFactor(poolFee));

    originalPoolMarketCapFactor = feeFactor
      .times(ratioFactor)
      .times(wrapFactor)
      .times(poolMarketCap)
      .dp(18);

    poolData.ratioFactor = ratioFactor;
    poolData.wrapFactor = wrapFactor;
    poolData.feeFactor = feeFactor;
    poolData.originalPoolMarketCapFactor = originalPoolMarketCapFactor;

    for (const t in poolData.tokens) {
      let r = poolData.tokens[t];
      let tokenMarketCapWithCap = r.normWeight
        .div(eligibleTotalWeight)
        .times(originalPoolMarketCapFactor);
      if (tokenTotalMarketCaps[r.token]) {
        tokenTotalMarketCaps[r.token] = bnum(
          tokenTotalMarketCaps[r.token]
        ).plus(tokenMarketCapWithCap);
      } else {
        tokenTotalMarketCaps[r.token] = tokenMarketCapWithCap;
      }
    }

    poolData.shareHolders = pool.shareHolders;
    poolData.controller = pool.controller;
    allPoolData.push(poolData);
  }

    // elapsed = new Date().getTime()/1000-start;
    // console.log("Elapsed 1 : " + elapsed);
    //
    //
    // elapsed = new Date().getTime()/1000-start;
    // console.log("Elapsed 2 : " + elapsed);

    let pc=0;
    for (const pool of allPoolData) {
        let finalPoolMarketCap = bnum(0);
        let finalPoolMarketCapFactor = bnum(0);

    for (const t of pool.tokens) {
      if (
        !uncappedTokens.includes(t.token) &&
        bnum(tokenTotalMarketCaps[t.token]).isGreaterThan(
          bnum(10000000)
        )
      ) {
        let tokenMarketCapFactor = bnum(10000000).div(
          tokenTotalMarketCaps[t.token]
        );
        adjustedTokenMarketCap = t.origMarketCap
          .times(tokenMarketCapFactor)
          .dp(18);
      } else {
        adjustedTokenMarketCap = t.origMarketCap;
      }
      finalPoolMarketCap = finalPoolMarketCap.plus(
        adjustedTokenMarketCap
      );
    }

    finalPoolMarketCapFactor = pool.feeFactor
      .times(pool.ratioFactor)
      .times(pool.wrapFactor)
      .times(finalPoolMarketCap)
      .dp(18);

    totalBalancerLiquidity = totalBalancerLiquidity.plus(
      finalPoolMarketCapFactor
    );

        //Faster Web3
        let bPool = new web3.eth.Contract(poolAbi, pool.poolAddress);
        //let bptSupplyWei = await bPool.methods.totalSupply().call(undefined, i);
        let bptSupplyWei = pool.bptSupplyWei;

        let bptSupply = utils.scale(bptSupplyWei, -18);

    if (bptSupply.eq(bnum(0))) {
      // Private pool
      if (userPools[pool.controller]) {
        userPools[pool.controller].push({
          pool: pool.poolAddress,
          feeFactor: pool.feeFactor.toString(),
          ratioFactor: pool.ratioFactor.toString(),
          wrapFactor: pool.wrapFactor.toString(),
          valueUSD: finalPoolMarketCap.toString(),
          factorUSD: finalPoolMarketCapFactor.toString(),
        });
      } else {
        userPools[pool.controller] = [
          {
            pool: pool.poolAddress,
            feeFactor: pool.feeFactor.toString(),
            ratioFactor: pool.ratioFactor.toString(),
            wrapFactor: pool.wrapFactor.toString(),
            valueUSD: finalPoolMarketCap.toString(),
            factorUSD: finalPoolMarketCapFactor.toString(),
          },
        ];
      }

      // Add this pool liquidity to total user liquidity
      if (userLiquidity[pool.controller]) {
        userLiquidity[pool.controller] = bnum(
          userLiquidity[pool.controller]
        )
          .plus(finalPoolMarketCapFactor)
          .toString();
      } else {
        userLiquidity[
          pool.controller
          ] = finalPoolMarketCapFactor.toString();
      }
    } else {
      // Shared pool
      await fasterWeb3.fetchHoldersData(pool, i);
      console.log("Fetched holders: " + pc++);


      for (const holder of pool.shareHolders) {

                //Faster Web3
                // let userBalanceWei = await bPool.methods
                //     .balanceOf(holder)
                //     .call(undefined, i);
                let userBalanceWei = pool.userBalances[holder];

                let userBalance = utils.scale(userBalanceWei, -18);
                let userPoolValue = userBalance
                    .div(bptSupply)
                    .times(finalPoolMarketCap)
                    .dp(18);

                let userPoolValueFactor = userBalance
                    .div(bptSupply)
                    .times(finalPoolMarketCapFactor)
                    .dp(18);

        if (userPools[holder]) {
          userPools[holder].push({
            pool: pool.poolAddress,
            feeFactor: pool.feeFactor.toString(),
            ratioFactor: pool.ratioFactor.toString(),
            wrapFactor: pool.wrapFactor.toString(),
            valueUSD: userPoolValue.toString(),
            factorUSD: userPoolValueFactor.toString(),
          });
        } else {
          userPools[holder] = [
            {
              pool: pool.poolAddress,
              feeFactor: pool.feeFactor.toString(),
              ratioFactor: pool.ratioFactor.toString(),
              wrapFactor: pool.wrapFactor.toString(),
              valueUSD: userPoolValue.toString(),
              factorUSD: userPoolValueFactor.toString(),
            },
          ];
        }

        // Add this pool liquidity to total user liquidity
        if (userLiquidity[holder]) {
          userLiquidity[holder] = bnum(userLiquidity[holder])
            .plus(userPoolValueFactor)
            .toString();
        } else {
          userLiquidity[holder] = userPoolValueFactor.toString();
        }
      }
    }

    //poolProgress.increment(1);
  }

  // Final iteration across all users to calculate their BAL tokens for this block
  let userBalReceived = {};
  let balDistributedDoubleCheck = bnum(0);
  for (const user in userLiquidity) {
    userBalReceived[user] = bnum(userLiquidity[user])
      .times(BAL_PER_SNAPSHOT)
      .div(totalBalancerLiquidity);
  }

  return [userPools, userBalReceived, tokenTotalMarketCaps];
}

async function execute(START_BLOCK, END_BLOCK, WEEK) {
  const multibar = new cliProgress.MultiBar(
    {
      clearOnComplete: false,
      format:
        '[{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | {task}',
    },
    cliProgress.Presets.shades_classic
  );

    !fs.existsSync(`./reports/${WEEK}/`) && fs.mkdirSync(`./reports/${WEEK}/`);

    let startBlockTimestamp = (await web3.eth.getBlock(START_BLOCK)).timestamp;
    let endBlockTimestamp = (await web3.eth.getBlock(END_BLOCK)).timestamp;

    let pools = await utils.fetchAllPools(END_BLOCK);

    let prices = {};

    if (fs.existsSync(`./reports/${WEEK}/_prices.json`)) {
        const jsonString = fs.readFileSync(`./reports/${WEEK}/_prices.json`);
        prices = JSON.parse(jsonString);
    } else {
        const whitelist = await utils.fetchWhitelist();

      let priceProgress = multibar.create(whitelist.length, 0, {
        task: 'Fetching Prices',
      });

        prices = await utils.fetchTokenPrices(
            whitelist,
            startBlockTimestamp,
            endBlockTimestamp,
            priceProgress
        );

        let path = `/${WEEK}/_prices`;
        utils.writeData(prices, path);
    }


        i = END_BLOCK;
        let start = new Date().getTime()/1000;

        let blockRewards = await getRewardsAtBlock(
            i,
            pools,
            prices
        );
        let path = `/${WEEK}/${i}`;
        utils.writeData(blockRewards, path);
        fs.unlinkSync(`./reports/${WEEK}/_prices.json`);

        let elapsed = new Date().getTime()/1000 - start;
        console.log("One snapshot time: " + elapsed);
};

module.exports = {
  execute
};






