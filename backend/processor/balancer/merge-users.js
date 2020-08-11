const fasterWeb3 = require('./index');
const fs = require('fs');
var api = require('etherscan-api').init('KEKY5TS8G2WH712WG3SY5HWDHD2HNIUPJD');

const WEEK = 10;

var blockCache = {};

function extractUsers() {
  let files = fs.readdirSync(`./reports/${WEEK}/`);
  if (files.indexOf('_prices.json') != -1) {
    files.splice(files.indexOf('_prices.json'), 1);
  }

  files.forEach(filename => {
    if (filename.indexOf('users') == -1) {

      let matchingUsers = files.find((val) => val === "users_" + filename);
      if (matchingUsers) {
        console.log("Users matched for: " + filename);
      } else {
        console.log("No users for: " + filename);
        //Read file
        let rawdata = fs.readFileSync(`./reports/${WEEK}/${filename}`);
        let users = JSON.parse(rawdata)[1];
        console.log("All: " + Object.keys(users).length);
        const nonEmpty = Object.keys(users)
          .filter(key => users[key] != '0')
          .reduce((obj, key) => {
            obj[key] = users[key];
            return obj;
          }, {});
        console.log("Non empty: " + Object.keys(nonEmpty).length);

        let usersFile = `./users/${WEEK}/users_${filename}`;
        fs.writeFileSync(usersFile, JSON.stringify(nonEmpty, null, 4));
        console.log("File saved: " + usersFile);
      };
    }
  });


}

async function getBlockTime(block) {
  if (!blockCache[block]) {
    var blockTime = await api.proxy.eth_getBlockByNumber(parseInt(block).toString(16));
    let hexTimestamp = blockTime.result.timestamp;
    let time = parseInt(hexTimestamp) * 1000;
    blockCache[block] = time;
  }
  return blockCache[block];
}

async function mergeCumulative() {
  console.log("Merging users");
  let files = fs.readdirSync(`./users/${WEEK}/`);
  let userFiles = files.filter((val) => val.indexOf('users') >= 0);
  let blocks = {};

  for(var i=0; i<userFiles.length; i++) {
    let filename = userFiles[i];
    let postfix = filename.replace('users_','');
    let matchingCum = files.find((val) => val === "cum_" + postfix);
    if (!matchingCum) {
      let users = {};
      let block = postfix.replace('.json', '');
      console.log("Calculating cumulative for: " + block);
      let acc = {};
      let blockIndex = 0;
      for(var j=0; j<userFiles.length; j++) {
        let userFile = userFiles[j];
        let cumBlock = userFile.replace('users_', '');
        cumBlock = cumBlock.replace('.json', '');
        if (cumBlock <= block) {
          console.log("Including snapshot: " + cumBlock);
          blocks[cumBlock] = await getBlockTime(cumBlock);
          console.log("Block " + block + " " + blocks[cumBlock])
          let current =  JSON.parse(fs.readFileSync(`./users/${WEEK}/${userFile}`));
          Object.keys(current).forEach(user => {
            if (!users[user]) {
              users[user] = {};
              acc[user] = 0;
            }
            acc[user] += parseFloat(current[user]);
            users[user][blockIndex] = acc[user].toFixed(3);
          })
          blockIndex++;
        }
      };
      let cumFile = `./users/${WEEK}/cum_${block}.json`;
      fs.writeFileSync(cumFile, JSON.stringify({rewards: users, blocks: blocks}, null, 4));
    }
  };


}




async function run() {
  await extractUsers();
  await mergeCumulative();
  setTimeout(run, 10000);
};

run();

