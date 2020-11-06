
export async function handle(state, action) {
  const status = {
    VOTING: "voting",
    APPROVED: "approved",
    REJECTED: "rejected"
  };


  if (action.input.function == 'openDispute') {
    if (!state.disputes) {
      state.disputes = [];
    }

    if (!action.input.title) {
      throw new ContractError(`No title specified`);
    }

    state.disputes.push({
      creator: action.caller,
      title: action.input.title,
      quorum: state.BASE_QUORUM,
      status: status.VOTING,
      votes: {
        approve: 0,
        reject: 0
      }
    });

    return { state };
  }

  if (action.input.function == 'getBalances') {

    const tokenContractState = await SmartWeave.contracts.readContractState(state.STAKING_TOKEN);

    return tokenContractState.balances;
  }

  // if (input.function == 'transfer') {
  //
  //   let target = input.target;
  //   let qty = input.qty;
  //
  //   if (!Number.isInteger(qty)) {
  //     throw new ContractError(`Invalid value for "qty". Must be an integer`);
  //   }
  //
  //   if (!target) {
  //     throw new ContractError(`No target specified`);
  //   }
  //
  //   if (qty <= 0 || caller == target) {
  //     throw new ContractError('Invalid token transfer');
  //   }
  //
  //   if (balances[caller] < qty) {
  //     throw new ContractError(`Caller balance not high enough to send ${qty} token(s)!`);
  //   }
  //
  //   // Lower the token balance of the caller
  //   balances[caller] -= qty;
  //   if (target in balances) {
  //     // Wallet already exists in state, add new tokens
  //     balances[target] += qty;
  //   } else {
  //     // Wallet is new, set starting balance
  //     balances[target] = qty;
  //   }
  //
  //   return { state };
  // }
  //
  // if (input.function == 'balance') {
  //
  //   let target = input.target;
  //   let ticker = state.ticker;
  //
  //   if (typeof target !== 'string') {
  //     throw new ContractError(`Must specificy target to get balance for`);
  //   }
  //
  //   if (typeof balances[target] !== 'number') {
  //     throw new ContractError(`Cannnot get balance, target does not exist`);
  //   }
  //
  //   return { result: { target, ticker, balance: balances[target] } };
  // }

  throw new ContractError(`No function supplied or function not recognised: "${input.function}"`);
}
