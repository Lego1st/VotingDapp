// fake Smart Contract here for testing
//**************START FAKE *************/

// var admin = "0xa4e7adb0cae9b692c07649f2f6b49537a3de9885"
var admin = "0x0";
var authorize_ABI = [{"constant":true,"inputs":[],"name":"creator","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"ballotAdr","type":"address"}],"name":"setBallotAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"ID","type":"string"},{"name":"state","type":"bytes32"}],"name":"register","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getRegisteredID","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ballotAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
var ballot_ABI = [{"constant":true,"inputs":[{"name":"votePollIdx","type":"uint256"},{"name":"proposalIdx","type":"uint256"}],"name":"getVotePollProposalInfo","outputs":[{"name":"proposal","type":"address"},{"name":"voteCount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"userState","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"startSecondBallot","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_auth","type":"address"}],"name":"setAuth","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"pollName","type":"bytes32"},{"name":"winnersCount","type":"uint256"}],"name":"addVotePoll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"pollName","type":"bytes32"}],"name":"getVotePollInfo","outputs":[{"name":"proposalCount","type":"uint256"},{"name":"ended","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"hasVoted","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"pollName","type":"bytes32"},{"name":"proposal","type":"address"}],"name":"vote","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"pollName","type":"bytes32"},{"name":"proposalAddress","type":"address"}],"name":"addProposalToVotePoll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"hasVoteRight","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"votePollName","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"votePollMap","outputs":[{"name":"name","type":"bytes32"},{"name":"ended","type":"bool"},{"name":"winnersCount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"pollName","type":"bytes32"},{"name":"voter","type":"address"}],"name":"giveRightToVote","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"auth","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"pollName","type":"bytes32"}],"name":"endPoll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getVotePollCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"voteFor","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
// var authorize_add = "0xaa9153babb4d918ec7cac0790a182b8a18802cd4";
// var ballot_add = "0x74f5ffde33be952e7d1175dcd8261c267f16faa1";
var authorize_add = "0x001be7e59cc4bf24e4e930c5a4c4f57c6249ffd6"
var ballot_add = "0x5306e714489bd9d61acb88567d39ae2d07a9e35a"
var account;
var web3Provider;
var pollnames = [];

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

function loadCandidateInfo(state) {
    form = new FormData();
    form.append('poll_name', state);
    $.ajax({
        url: "http://127.0.0.1:8000/get_list_proposals/", // Url to which the request is send
        crossDomain: true,
        type: "POST",             // Type of request to be send, called as method
        contentType: false,
        dataType: 'json',
        data: form, // Data sent to server, a set of key/value pairs (i.e. form fields and values)
        cache: false,             // To unable request pages to be cached
        processData:false,        // To send DOMDocument or non processed data file it is set to false
        success: function(data) {   // A function to be called if request succeeds
            console.log(data);
            var html = '';
            state_name = data['display_name']
            proposal_list = data['proposal_list']
            for(i=0; i < proposal_list.length; i++) {
                html += '<li><a href="#"> Candidate ' + i + ' </a></li><ul style="list-style: none">'
                            + '<li><b>Name:</b> ' + proposal_list[i]['name'] + ' </li>';
                if(proposal_list[i]['party'] != null && proposal_list[i]['party'] != ''){
                    html += '<li><b>Party:</b> ' + proposal_list[i]['party'] + ' </li>';
                }
                if(proposal_list[i]['support_name'] != null && proposal_list[i]['support_name'] != ''){
                    html += '<li><b>Support:</b> ' + proposal_list[i]['support_name'] + ' </li>';
                }
                if(proposal_list[i]['date_of_birth'] != null && proposal_list[i]['date_of_birth'] != ''){
                    html += '<li><b>Date of birth:</b> ' + proposal_list[i]['date_of_birth'] + ' </li>';
                }
                if(proposal_list[i]['description'] != null && proposal_list[i]['description'] != ''){
                    html += '<li><b>Short Bio:</b> <p>' + proposal_list[i]['description'] + '</p> </li>';
                }
                html += '</ul>'
            }
            console.log(html)
            $("#candidate_list").html(html)
        },
        error: function(request, status, error) {
            console.log(error)
        },
    });
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
            console.log(data);
            data = data['poll_list'];
            for (i in data) {
                pollnames.push({'name' : data[i].name, 'display' : data[i].display_name});
            }
        }
    })
}

$(document).ready(function() {
    loadPolls();
	$("#admin").hide();	
    initWeb3();
    var pollName = 'Cali';
    loadCandidateInfo(pollName);
})