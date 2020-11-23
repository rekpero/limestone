
export async function openDispute(dispute) {
  console.log("Opening dispute:");

  let disputes = await getAllDisputes();
  console.log(disputes);
  if (!disputes) {
    disputes = [];
  }
  dispute.id = "D-" + (disputes.length + 1);
  disputes.push(dispute);
  localStorage.setItem("disputes", JSON.stringify(disputes));
  console.log(dispute);
  return dispute;
}

export async function getDispute(disputeId) {
  let disputes = await getAllDisputes();
  let dispute = disputes.filter(d => d.id == disputeId)[0];
  dispute.deadline = new Date(dispute.deadline);
  return dispute;
}

export async function getAllDisputes() {
  let disputes = JSON.parse(localStorage.getItem("disputes"));
  return disputes;
}

function saveVotes(disputeId, votes) {
  let allVotes = JSON.parse(localStorage.getItem("votes")) || {};
  allVotes[disputeId] = votes;
  localStorage.setItem("votes", JSON.stringify(allVotes));
}

export async function getVotes(disputeId) {
  let allVotes = JSON.parse(localStorage.getItem("votes")) || {};

  let votes = allVotes[disputeId];
  if (!votes) {
    votes = {
      "yes": 0,
      "no" : 0,
      "total" : 0,
      "ratio" : 50
    };
    saveVotes(disputeId, votes);
  }
  console.log(votes);
  return votes;
}

export async function vote(disputeId, choice, value) {
  console.log(`Voting ${disputeId}: ${choice} - ${value}`);
  let votes = await getVotes(disputeId);
  votes[choice] = votes[choice] + value;
  votes.total = votes.yes + votes.no;
  votes.ratio = votes.yes*100/votes.total;
  saveVotes(disputeId, votes);
  return getVotes(disputeId);
}
