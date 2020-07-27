
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
  }
};


export function token(symbol) {
  return tokens[symbol];
}

