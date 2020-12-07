const Arweave = require('arweave/node');
const ARQL =  require('arql-ops');
const fetch = require('isomorphic-fetch');
const ArQgl = require("ar-gql");

const arweave = Arweave.init({
  host: 'arweave.net',// Hostname or IP address for a Arweave host
  port: 443,          // Port
  protocol: 'https',  // Network protocol http or https
  timeout: 20000,     // Network request timeouts in milliseconds
  logging: false,     // Enable network request logging
});

var recentHeight;

async function getCurrentHeight() {
  if (!recentHeight) {
    let info = await arweave.network.getInfo();
    recentHeight = parseInt(info.height);
  }
  console.log("Recent height: " + recentHeight);
  return recentHeight;
}

export async function find(parameters) {
  let arqlParameters = Object.keys(parameters).reduce((acc, key) => {
    acc.push(ARQL.equals(key, parameters[key]));
    return acc;
  }, []);
  let myQuery = ARQL.and(... arqlParameters);
  let results = await arweave.arql(myQuery);
  return results;
}


export async function getData(tx) {
  let rawData = await arweave.transactions.getData(tx, {decode: true, string: true});
  //console.log(rawData);
  let data = JSON.parse(rawData);
  return data;
}


export async function getTags(tx) {
  let transaction = await arweave.transactions.get(tx);
  let tags = {};
  try {
    transaction.get('tags').forEach(tag => {
      let key = tag.get('name', {decode: true, string: true});
      let value = tag.get('value', {decode: true, string: true});
      //console.log(`${key} : ${value}`);
      tags[key] = value;
    });
  } catch (error) {
    console.log(error);
  }
  return tags;
}


export async function findAndDownload(parameters) {
  let txs = await find(parameters);
  console.log("TX found: " + txs[0]);
  let data = await getData(txs[0]);

  return data;
}

export async function findLastTx(parameters) {
  let startBlock = (await getCurrentHeight()) - 50;
  let query = `{ transactions(
  first: 1,
  tags: [
      { name: "app", values: "${parameters.app}" },
      { name: "version", values: "${parameters.version}" },
      { name: "id", values: "${parameters.id}" }
      { name: "type", values: "${parameters.type}" }
    ],
    block: {min: ${startBlock}},
    sort: HEIGHT_DESC
    ) {
      edges {
        node {
          id
        }
      }
    }
  }
`;
  console.log(query);

  let res = await ArQgl.run(query);
  if (res.data && res.data.transactions.edges[0]) {
    return res.data.transactions.edges[0].node.id;
  } else {
    throw Error("Invalid data returned from Arweave Graph QL");
  }
}

export async function findAllTx(parameters, limit) {
  let startBlock = (await getCurrentHeight()) - 100;
  let query = `{ transactions(
  first: ${limit},
  tags: [
      { name: "app", values: "${parameters.app}" },
      { name: "version", values: "${parameters.version}" },
      { name: "id", values: "${parameters.id}" },
      { name: "type", values: "${parameters.type}" }
    ],
    block: {min: ${startBlock}},
    sort: HEIGHT_DESC
    ) {
      edges {
        node {
          id,
          tags {
            name
            value
          }
        }
      }
    }
  }
`;
  console.log(query);

  let res = await ArQgl.run(query);
  if (res.data && res.data.transactions.edges[0]) {
    return res.data.transactions.edges;
  } else {
    throw Error("Invalid data returned from Arweave Graph QL");
  }
}

export async function findConfigTx(parameters, limit) {
  let query = `{ transactions(
  ids: [
    "k5lxkNBdRNxUHYteDZ2ma62ULYNo5MfvtsT4KzVMbnw",
     "EpIx1wbzpmxY4QmQrdIKoW7iwHuPqQugKMRt0vwqMvo",
     "fjwvlK4hI0W_-I3DYSUTo1byinrL9wRqzF9nnKi3bIA"
     ],
  sort: HEIGHT_ASC
    ) {
      edges {
        node {
          id,
          tags {
            name
            value
          }
        }
      }
    }
  }
`;

  let res = await ArQgl.run(query);
  if (res.data && res.data.transactions.edges[0]) {
    return res.data.transactions.edges;
  } else {
    throw Error("Invalid data returned from Arweave Graph QL");
  }

}




