var web3Provider;
// var ABI;
// var ballot_add;
var ballotInstance;
var authInstance;
function load_round(loaddiv, toload) {
    $.ajax({
        url: toload,
        success: function(data) {
          $(loaddiv).html(data);
        }
      });
}

function initContract() {
    var ballotContract = web3.eth.contract(ballot_ABI);
    ballotInstance = ballotContract.at(ballot_add);
    var authContract = web3.eth.contract(authorize_ABI);
    authInstance = authContract.at(authorize_add);
    init();
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

    authInstance.getRegisteredID(function(err, data) {
        registered = true
        if (data == "")
            registered = false
        if(registered) 
            status = '<span style="color:green">Registered<span>';
        else 
            status = '<span style="color:red">Unregistered<span>';
        $("#status").html(status);
        $("#elector-form").submit(function(event) {
            if (registered) {
                $("#warning1").show();
            } else {
                var dat = $(this).serializeArray();
                var id = dat[0].value;
                var state = dat[1].value;

                authInstance.register(id, state, function(err, data) {
                    console.log(err);
                });

                // var res = register(id, state);
                // if (res) {
                //     $("#notice").show();
                // } else {
                //     $("#warning2").show();
                // }
            }
            event.preventDefault();
        });
    });

    // var vote_status = voted();
    // if(vote_status) {
    //     $("#status").append("<br> You voted " + vote_status);
    // }
    web3.eth.getAccounts(function(err, data) {
        $("#account").html(data);    
    })
}

$(document).ready(function() {
    initWeb3();
    initContract();
    $("#regis").on("click", function() {
        load_round(".main-view", "regis.html");
    })
    $("#vote").on("click", function() {
        load_round(".main-view", "vote.html");
    })
    $("#info").on("click", function() {
        load_round(".main-view", "info.html");
    })
})