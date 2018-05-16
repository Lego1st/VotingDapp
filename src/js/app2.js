function argMax(array) {
  return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}

function congratulation() {
	loadLeaderBoardInfo("final", function(p, v) {
		var bestIdx = argMax(v);
		$("#leaderSelect").hide();
		$("#proposalFromPoll").html("");
		$("#proposalFromPoll").append('<div style="text-align:center"><h1 style="margin: 0"> Our new president is <span style="color:red;font-size: 60px"><b>' + p[bestIdx].name + '</b></span></h1></div>');
	})
}

function beautifulStat(proposal_list, softmax_votes) {
	var proposalFromPoll = $("#proposalFromPoll");
	proposalFromPoll.html("");
	n = softmax_votes.length;
	for(let j = 0; j < n; ++j)  {
		proposalFromPoll.append('<div class="row" style="display:flex;align-items:center"> <span class="col-xs-5"><h4>' 
				+ proposal_list[j]['name'] 
				+ '</h4></span><span class="col-xs-7">' + '<div class="progress" style="margin: 0"><div class="progress-bar" role="progressbar" style="width:' + softmax_votes[j] + '%">'
				+ '<span class="sr-only">70% Complete</span></div></div>'
				+ '</span><div>');
	}
}

function softmax(votes) {
	var sum = 0;
	var res = [];
	for (let k in votes) {
		sum += parseInt(votes[k]) + 1
	}
	for (let k in votes) {
		res[k] = Math.floor((parseInt(votes[k])+1)/sum * 100);
	}
	return res;
}

function loadLeaderBoardInfo(pollname, cb) {
    form = new FormData();
    form.append('poll_name', pollname);
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
            // console.log(data);
            message = data['message']
            if(message == 'ok') {
            	data = data['data'];
	        	var proposal_list = data['proposal_list']
	        	var votes = [];
	        	var addrs = [];
	        	for(let i=0; i < proposal_list.length; i++) {
	        		var polHex = '0x' + convertToHex(pollname);
	        		var n = proposal_list.length;
	        		
	        		ballotInstance.getVotePollProposalInfo(polHex, i, function(err, data) {
	        			console.log(data);
	        			votes[i] = data[1].toString();
	        			addrs[i] = data[0];
	        			if(votes.length == n) {
	        				softmax_votes = softmax(votes);
	        				var new_proposal_list = [];
	        				for (let j = 0; j < n; ++j) {
	        					for (let k = 0; k < n; ++k) {
	        						if(proposal_list[k]['address'] == addrs[j]) {
	        							new_proposal_list[j] = proposal_list[k];
	        							break;
	        						}
	        					}
	        				}
	        				cb(new_proposal_list, softmax_votes);
	        			} 
	        		})
	        	}
	        }
	        else {
	        	alert(message);
	        }
        },
    });
}

function displayLeaderboard() {
	var poll = $("#leaderSelect");
	for (i in pollnames) {
        poll.append('<option value="' + pollnames[i].name + '">' + pollnames[i].display + '\t(' + pollnames[i].name + ')' + '</option>');
    }

    loadLeaderBoardInfo(poll.find(":selected").val(), beautifulStat);

   	poll.on("change", function() {
   		loadLeaderBoardInfo($(this).find(":selected").val(), beautifulStat);
   	})

}

$(document).ready(function() {
    ballotInstance.isFinale(function(err, finale) {
    	if(finale == true) {
    		ballotInstance.votePollMap("0x66696e616c", function(err, data) {
    			var isElectionEnd = data[1];
    			if(isElectionEnd) {
    				congratulation();
    			} else {
    				displayLeaderboard();
    			}
    		})
    	} else {
    		displayLeaderboard();
    	}
    }); 
})