
export function handle(state, action) {

  let balances = state.balances;
  let stakes = state.stakes;
  let input = action.input;
  let caller = action.caller;
  let OPERATOR = state.OPERATOR;

  if (input.function == 'transfer') {

    let target = input.target;
    let qty = input.qty;

    if (!Number.isInteger(qty)) {
      throw new ContractError(`Invalid value for "qty". Must be an integer`);
    }

    if (!target) {
      throw new ContractError(`No target specified`);
    }

    if (qty <= 0 || caller == target) {
      throw new ContractError('Invalid token transfer');
    }

    if (balances[caller] < qty) {
      throw new ContractError(`Caller balance not high enough to send ${qty} token(s)!`);
    }

    // Lower the token balance of the caller
    balances[caller] -= qty;
    if (target in balances) {
      // Wallet already exists in state, add new tokens
      balances[target] += qty;
    } else {
      // Wallet is new, set starting balance
      balances[target] = qty;
    }

    return { state };
  }

  if (input.function == 'stake') {

    let contract = input.contract;
    let topic = input.topic;
    let key = input.key;
    let value = input.value;
    let caller = action.caller;

    if (!contract) {
      throw new ContractError(`No contract specified`);
    }

    if (!Number.isInteger(value)) {
      throw new ContractError(`Invalid value for "value". Must be an integer`);
    }

    if (value <= 0) {
      throw new ContractError('Stake value must be > 0');
    }

    if (balances[caller] < value) {
      throw new ContractError(`Caller balance not high enough to stake ${value} token(s)!`);
    }

    if (!stakes) {
      state.stakes = {};
      stakes = state.stakes;
    }

    if (!stakes[contract]) {
      stakes[contract] = {};
    }

    if (!stakes[contract][topic]) {
      stakes[contract][topic] = {};
    }

    if (!stakes[contract][topic][key]) {
      stakes[contract][topic][key] = {
        total: value
      };
    } else {
      stakes[contract][topic][key].total += value;
    }

    if (!stakes[contract][topic][key][caller]) {
      stakes[contract][topic][key][caller] = value;
    } else {
      stakes[contract][topic][key][caller] += value;
    }
    balances[caller] -= value;

    return { state };
  }

  if (input.function == 'getStake') {
    let contract = input.contract;
    let topic = input.topic;
    let key = input.key;

    return stakes[contract][topic][key];
  }

  if (input.function == 'balance') {

    let target = input.target;
    let ticker = state.ticker;

    if (typeof target !== 'string') {
      throw new ContractError(`Must specificy target to get balance for`);
    }

    if (typeof balances[target] !== 'number') {
      throw new ContractError(`Cannnot get balance, target does not exist`);
    }

    return { result: { target, ticker, balance: balances[target] } };
  }

  throw new ContractError(`No function supplied or function not recognised: "${input.function}"`);
}
