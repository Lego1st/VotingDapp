// fake Smart Contract here for testing
//**************START FAKE *************/

// var admin = "0xa4e7adb0cae9b692c07649f2f6b49537a3de9885"
var admin = "0x0";
var authorize_ABI = [{"constant":true,"inputs":[],"name":"creator","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"ballotAdr","type":"address"}],"name":"setBallotAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"ID","type":"string"},{"name":"state","type":"bytes32"}],"name":"register","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getRegisteredID","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ballotAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
var ballot_ABI = [{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"userState","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"startSecondBallot","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_auth","type":"address"}],"name":"setAuth","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"pollName","type":"bytes32"},{"name":"winnersCount","type":"uint256"}],"name":"addVotePoll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"pollName","type":"bytes32"}],"name":"getVotePollInfo","outputs":[{"name":"proposalCount","type":"uint256"},{"name":"ended","type":"bool"},{"name":"winnersCount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"hasVoted","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"pollName","type":"bytes32"},{"name":"proposalIdx","type":"uint256"}],"name":"getVotePollProposalInfo","outputs":[{"name":"proposal","type":"address"},{"name":"voteCount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"pollName","type":"bytes32"},{"name":"proposal","type":"address"}],"name":"vote","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"pollName","type":"bytes32"},{"name":"proposalAddress","type":"address"}],"name":"addProposalToVotePoll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"hasVoteRight","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"votePollName","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"votePollMap","outputs":[{"name":"name","type":"bytes32"},{"name":"ended","type":"bool"},{"name":"winnersCount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isFinale","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"pollName","type":"bytes32"},{"name":"voter","type":"address"}],"name":"giveRightToVote","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"auth","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"pollName","type":"bytes32"}],"name":"endPoll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getVotePollCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"voteFor","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];

var authorize_add = "0x2063e572939ac04db9846a7ecf8a5909f9bcbda2"
var ballot_add = "0x77c5f53045f442a77ca9ff148c0816787cbe2613"

var web3Provider;
var pollnames = [];

// function register(id, state) {
//     return true;
//     return false;
// }

// function registered() {
//     // return false;
//     return true;
// }

// function vote(candidate) {
//     return true;
// }
// function voted() {
//     return "Candidate 1";
//     return None;
// }

function isEndedRound1() {
    return false;
}

//***************END FAKE***************/

function convertFromHex(hex) {
    var hex = hex.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

function convertToHex(str) {
    var hex = '';
    for(var i=0;i<str.length;i++) {
        hex += ''+str.charCodeAt(i).toString(16);
    }
    return hex;
}

account = "0x0";

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
        // console.log(accounts);
    })
	firstInit();
}

function loadPolls() {
    $.ajax({
        url: "http://127.0.0.1:8000/get_all_poll/",
        crossDomain: true,
        type: "POST",
        contentType: false,
        cache: false,
        processData: false,
        success: function(data) {
            message = data['message'];
            if(message == 'ok') {
                data = data['data'];
                for (i in data) {
                    pollnames.push({'name' : data[i].name, 'display' : data[i].display_name});
                }

                loadPollName();
            }
            else {
                alert(message);
            }
        }
    })
}

$(document).ready(function() {
    loadPolls();
	$("#admin").hide();	
    initWeb3();
})