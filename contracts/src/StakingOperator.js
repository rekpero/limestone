
export function handle(state, action) {

  let balances = state.balances;
  let input = action.input;
  let caller = action.caller;
  let OPERATOR = state.OPERATOR;

  if (input.function == 'transfer') {

    await Smartweave.interactWriteDryRun(arweave, ACCOUNT_1, STAKING_TOKEN, {
      function: "delegateTransfer",
      from: user1,
      target: "aaa",
      qty: 2
    });

    return { state };
  }

  if (input.function == 'delegateTransfer') {

    let target = input.target;
    let qty = input.qty;
    let delegatedCaller = input.from;

    if (caller != OPERATOR) {
      throw new ContractError(`Must be an operator to delegate transfer.`);
    }

    if (!Number.isInteger(qty)) {
      throw new ContractError(`Invalid value for "qty". Must be an integer`);
    }

    if (!target) {
      throw new ContractError(`No target specified`);
    }

    if (qty <= 0 || delegatedCaller == target) {
      throw new ContractError('Invalid token transfer');
    }

    if (balances[delegatedCaller] < qty) {
      throw new ContractError(`Caller balance not high enough to send ${qty} token(s)!`);
    }

    // Lower the token balance of the caller
    balances[delegatedCaller] -= qty;
    if (target in balances) {
      // Wallet already exists in state, add new tokens
      balances[target] += qty;
    } else {
      // Wallet is new, set starting balance
      balances[target] = qty;
    }

    return { state };
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
