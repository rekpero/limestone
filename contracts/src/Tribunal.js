
export async function handle(state, action) {

  const DAY = 60*60*24*1000;

  const status = {
    VOTING: "voting",
    APPROVED: "approved",
    REJECTED: "rejected"
  };

  let Token = state.token;
  let Disputes = state.disputes;

  let BASE_QUORUM = state.BASE_QUORUM;


  if (action.input.function == 'openDispute') {

    //Input parameters
    let title = action.input.title;
    let description = action.input.description;
    let disputedTx = action.input.disputedTx;
    let deposit = action.input.deposit;

    if (!Disputes) {
      state.disputes = [];
      state.counter = 1;
      Disputes = state.disputes;
    }

    if (!title) {
      throw new ContractError(`No title specified`);
    }

    if (!description) {
      throw new ContractError(`No description provided`);
    }

    //Check if tx hasn't been disputed before
    Disputes.forEach(dispute => {
      if (dispute.disputedTx === disputedTx && dispute.round === 0) {
        throw new ContractError(`Transaction ${disputedTx} has already been disputed`);
      }
    });

    //TODO: Verify deposit against disputedTX stake

    state.disputes.push({
      id: "D-" + state.counter++,
      creator: action.caller,
      title: title,
      description: description,
      quorum: BASE_QUORUM,
      deposit: deposit,
      status: status.VOTING,
      round: 0,
      disputedTx: disputedTx,
    });

    return { state };
  }

  if (action.input.function == 'closeDispute') {
    //Input parameters
    let id = action.input.disputeId;

    //Check if tx hasn't been disputed before
    Disputes.forEach(dispute => {
      if (dispute.id === id) {
        //Connect to token
        dispute.status = status.APPROVED;
        return;
      }
    });

    throw new ContractError(`No dispute with the given id: ${id}`);



    return { state };
  }

  throw new ContractError(`No function supplied or function not recognised: "${input.function}"`);
}
