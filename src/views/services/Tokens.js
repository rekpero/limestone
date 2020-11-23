
const tokens = {
  "BAL" : {
    name: "Balancer",
    logo: "https://assets.coingecko.com/coins/images/11683/large/Balancer.png?1592792958",
    url: "https://balancer.finance"
  },
  "COMP" : {
    name: "Compound",
    logo: "https://assets.coingecko.com/coins/images/10775/small/COMP.png?1592625425",
    url: "https://compound.finance"
  },
  "AR" : {
    name: "Arweave",
    logo: "https://icodrops.com/wp-content/uploads/2018/05/arweave_logo.jpg",
    url: "https://www.arweave.org/"
  },
  "CHI" : {
    name: "Chi (gas)",
    logo: "https://dappimg.com/media/image/app/77b59eb111dd4a4b80574e00eb47b1d9.png",
    url: "https://medium.com/@1inch.exchange/1inch-introduces-chi-gastoken-d0bd5bb0f92b"
  },
  "ETH" : {
    name: "Ethereum",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    url: "https://ethereum.org/"
  },
  "BTC" : {
    name: "Bitcoing",
    logo: "https://localbitcoinnow.com/wp-content/uploads/2019/12/The-bit-logo-e1575819611411.png",
    url: "https://bitcoin.org/"
  }
};


export function token(symbol) {
  let token = tokens[symbol];
  token.symbol = symbol;
  return token;
}

