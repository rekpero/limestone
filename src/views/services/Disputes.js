
export async function openDispute(dispute) {
  console.log("Opening dispute:");
  dispute.id = "D-1";
  localStorage.setItem(dispute.id, JSON.stringify(dispute));
  return dispute;
}

export async function getDispute(disputeId) {
  let dispute = JSON.parse(localStorage.getItem(disputeId));
  dispute.value = 2.22;
  dispute.deadline = new Date(new Date().getTime() + 1000* 60*60*24*3);
  return dispute;
}

export async function getVotes(disputeId) {
  let votes = JSON.parse(localStorage.getItem("votes"));
  console.log(votes);
  if (votes === undefined || !votes) {
    votes = {
      "yes": 60,
      "no" : 40
    }
  }
  votes.total = votes.yes + votes.no;
  votes.ratio = votes.yes*100/votes.total;

  return votes;
}

export async function vote(disputeId, choice, value) {
  console.log(`Voting ${disputeId}: ${choice} - ${value}`);
  let votes = await getVotes(disputeId);
  votes[choice] = votes[choice] + value;
  localStorage.setItem("votes", JSON.stringify(votes));
  return getVotes(disputeId);
}
