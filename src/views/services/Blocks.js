var api = require('etherscan-api').init('KEKY5TS8G2WH712WG3SY5HWDHD2HNIUPJD');

export async function getBlockTime(block) {
  var block = await api.proxy.eth_getBlockByNumber(parseInt(block).toString(16));
  let hexTimestamp = block.result.timestamp;
  let time = parseInt(hexTimestamp) * 1000;
  console.log(block + " : " + time);
  return time;
}

