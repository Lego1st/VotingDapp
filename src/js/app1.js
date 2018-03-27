var web3Provider;
var account; 
var ABI;
var ballot_add;

function load_round(loaddiv, toload) {
    $.ajax({
        url: toload,
        success: function(data) {
          $(loaddiv).html(data);
        }
      });
}

function init() {

    if(isEndedRound1()) {
        $(".round1end").show();
        $(".round1start").hide();
    } else {
        $(".round1end").hide();
        $(".round1start").show();
    }

    var status = "";
    if(registered()) 
        status = '<span style="color:green">Registered<span>';
    else 
        status = '<span style="color:red">Unregistered<span>';
    $("#status").html(status);

    var vote_status = voted();
    if(vote_status) {
        $("#status").append("<br> You voted " + vote_status);
    }

}

function initContract() {

}

function initWeb3() {
    web3Provider = web3.currentProvider;
    web3 = new Web3(web3Provider);

    web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.log(error);
        }
        account = accounts[0];
        $("#account").html(account);
    })
    
    ABI = [{"constant":true,"inputs":[{"name":"idx","type":"uint256"}],"name":"getVotePollName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"name","type":"string"},{"name":"proposalNames","type":"string[]"},{"name":"proposalIDs","type":"address[]"}],"name":"addVotePoll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"state","type":"string"},{"name":"voterAddress","type":"address"}],"name":"giveRightToVote","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"firstCitizen","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getVotePollCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"authorizeContractAddress","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
    ballot_add = "0xe6442e6421e9132a9396b23a643a40165130c202";
    init();
    smth();
}   

function smth() {
    var ballotContract = web3.eth.contract(ABI);
    var ballotInstance = ballotContract.at(ballot_add);
    ballotInstance.firstCitizen(function(err, data) {
        console.log(data);
    });
}
$(document).ready(function() {
    initWeb3();
    $("#regis").on("click", function() {
        load_round(".main-view", "regis.html");
    })
    $("#vote").on("click", function() {
        load_round(".main-view", "vote.html");
    })
    $("#info").on("click", function() {
        load_round(".main-view", "info.html");
    })
    $("#elector-form").submit(function(event) {
        if (registered()) {
            $("#warning1").show();
        } else {
            var dat = $(this).serializeArray();
            var id = dat[0].value;
            var state = dat[0].value;
            var res = register(id, state);
            if (res) {
                $("#notice").show();
            } else {
                $("#warning2").show();
            }
        }
        event.preventDefault();
    });
})