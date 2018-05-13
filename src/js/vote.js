function voteAndCheck(pollname) {
	ballotInstance.voteFor(function(err, data) {
		console.log(data);
		if(data != "0x0000000000000000000000000000000000000000") {
			$("#" + data).prop("checked", true);
			$('input[name="elector"]').attr("disabled", true);
		} else {
			var pollHex = '0x' + convertToHex(pollname);
			$('input[name="elector"]').change(function() {
				if($(this).is(':checked')) {
					var proposal_id = $(this).attr('id');
					ballotInstance.vote(pollHex, proposal_id, function(err, data) {
						console.log(err);
					});
				}
			})
		}
	});
}

function loadCandidateToVote(state) {
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
            // console.log(data);
            message = data['message']
            if(message == 'ok') {
            	data = data['data'];
	        	var proposalFromPoll = $("#elector");
	        	proposalFromPoll.html("");
	        	proposal_list = data['proposal_list']
	        	for(i=0; i < proposal_list.length; i++) {
	        		proposalFromPoll.append('<div class="selection"> <input id="' + proposal_list[i].address 
	        			+ '" name="elector" type="radio"> <label for="' + proposal_list[i].address 
	        			+ '">' + proposal_list[i].name + '</label> </div>');
	        	}
	        	voteAndCheck(proposal_list[0].poll_name);
	        }
	        else {
	        	alert(message);
	        }
        },
    });
}

$(document).ready(function() {
	ballotInstance.userState(account, function(err, data) {
		var pollname = convertFromHex(data.substr(2,).replace(/0+$/i, ''));
		loadCandidateToVote(pollname);
	});
})