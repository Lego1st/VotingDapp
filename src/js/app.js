// fake Smart Contract here for testing
//**************START FAKE *************/

// var admin = "0xa4e7adb0cae9b692c07649f2f6b49537a3de9885"
var admin = "0x0";
var authorize_ABI = [{"constant":true,"inputs":[],"name":"creator","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"ballotAdr","type":"address"}],"name":"setBallotAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"ID","type":"string"},{"name":"state","type":"bytes32"}],"name":"register","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getRegisteredID","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ballotAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
var ballot_ABI = [{"constant":true,"inputs":[{"name":"votePollIdx","type":"uint256"},{"name":"proposalIdx","type":"uint256"}],"name":"getVotePollProposalInfo","outputs":[{"name":"proposal","type":"address"},{"name":"voteCount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"pollName","type":"bytes32"}],"name":"hasVoted","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"startSecondBallot","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_auth","type":"address"}],"name":"setAuth","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"pollName","type":"bytes32"},{"name":"winnersCount","type":"uint256"}],"name":"addVotePoll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"pollName","type":"bytes32"}],"name":"getVotePollInfo","outputs":[{"name":"proposalCount","type":"uint256"},{"name":"ended","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"pollName","type":"bytes32"},{"name":"proposal","type":"address"}],"name":"vote","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"pollName","type":"bytes32"}],"name":"hasVoteRight","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"pollName","type":"bytes32"},{"name":"proposalAddress","type":"address"}],"name":"addProposalToVotePoll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"votePollName","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"votePollMap","outputs":[{"name":"name","type":"bytes32"},{"name":"ended","type":"bool"},{"name":"winnersCount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"pollName","type":"bytes32"},{"name":"voter","type":"address"}],"name":"giveRightToVote","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"auth","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"pollName","type":"bytes32"}],"name":"endPoll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getVotePollCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
var authorize_add = "0xaa9153babb4d918ec7cac0790a182b8a18802cd4";
var ballot_add = "0x74f5ffde33be952e7d1175dcd8261c267f16faa1";
var account;
var web3Provider;

function register(id, state) {
    return true;
    return false;
}

function registered() {
    // return false;
    return true;
}

function vote(candidate) {
    return true;
}
function voted() {
    return "Candidate 1";
    return None;
}

function isEndedRound1() {
    return false;
}

//***************END FAKE***************/


function firstInit() {
	var ballotContract = web3.eth.contract(ballot_ABI);
	var ballotInstance = ballotContract.at(ballot_add);
	ballotInstance.owner(function(err, data) {
	    admin = data;
		if(account == admin) {
			$("#admin").show();
		}
	});
}

function initWeb3() {
    web3Provider = web3.currentProvider;
    web3 = new Web3(web3Provider);

    web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.log(error);
        }
        account = accounts[0];
        console.log(accounts);
    })
	firstInit();
}     

$(document).ready(function() {
	$("#admin").hide();	
	initWeb3();
})