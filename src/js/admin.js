
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
            // console.log(data);
            message = data['message']
            if(message == 'ok') {
            	data = data['data'];
	        	var proposalFromPoll = $("#proposalFromPoll");
	        	proposalFromPoll.html("");
	        	proposal_list = data['proposal_list']
	        	for(i=0; i < proposal_list.length; i++) {
	        		proposalFromPoll.append('<li><b>' + proposal_list[i]['name'] + '</b><br><i>' + proposal_list[i]['address'] + '</i></li>');
	        	}
	        }
	        else {
	        	alert(message);
	        }
        },
    });
}

$(document).ready(function() {
    $("#start2ndRound").on("click", function() {
        ballotInstance.startSecondBallot(function(err, data) {
            alert('Elector round ended. President round start');
        });
    });
    $("#endElection").on("click", function() {
        var polHex = '0x' + convertToHex("final");
        ballotInstance.endPoll(polHex, function(err, data) {
            if(!err) {
                alert('Election ENDED!');
            } else {
                console.log(err);
            }
        })
    })
	$("#editbtn").on("click", function() {
		$("#adminOption").hide();
		$("#adminscreen").show();

		var poll = $("#adminpollname");
        for (i in pollnames) {
            poll.append('<option value="' + pollnames[i].name + '">' + pollnames[i].display + '\t(' + pollnames[i].name + ')' + '</option>');
        }

        loadCandidateInfo($("#adminpollname").find(":selected").val());

       	$("#adminpollname").on("change", function() {
       		loadCandidateInfo($(this).find(":selected").val());
       	})

        $("#newpoll").on("click", function() {
        	var pollname = $("input[name='pollname']").val();
        	var displayname = $("input[name='displayname']").val();
        	form = new FormData(this);
        	form.append('name', pollname);
        	form.append('display_name', displayname);
        	$.ajax({
                url: "http://127.0.0.1:8000/create_poll/", // Url to which the request is send
                crossDomain: true,
                type: "POST",             // Type of request to be send, called as method
                data: form, // Data sent to server, a set of key/value pairs (i.e. form fields and values)
                dataType: 'json',
                contentType: false,       // The content type used when sending data to the server.
                cache: false,             // To unable request pages to be cached
                processData:false,        // To send DOMDocument or non processed data file it is set to false
                success: function(data) {   // A function to be called if request succeeds
                    console.log(data['message']);
                    // console.log(account);
                    var pollHex = '0x' + convertToHex(pollname);
                        // var pollname = convertFromHex(data.substr(2,).replace(/0+$/i, ''));
                        // var pollHex = data.replace(/0+$/i, '');
                    ballotInstance.addVotePoll(pollHex, 1, function(err, data) {
                        console.log(err);
                        console.log(data);
                        if(!alert('Sucessful poll added')){window.location.reload();}
                    });
                },
                error: function(request, status, error) {
                    // console.log(error);
                },
                
            });
        })

        $("#newproposal").on("click", function() {
        	var proposalName = $("input[name='proposalName']").val();
        	var proposalAddress = $("input[name='proposalAddress'").val();
        	var currentPollName = $("#adminpollname").find(":selected").val();
        	form = new FormData(this);
        	form.append('name', proposalName);
        	form.append('address', proposalAddress);
        	form.append('poll_name', currentPollName);
        	$.ajax({
                url: "http://127.0.0.1:8000/create_proposal/", // Url to which the request is send
                crossDomain: true,
                type: "POST",             // Type of request to be send, called as method
                data: form, // Data sent to server, a set of key/value pairs (i.e. form fields and values)
                dataType: 'json',
                contentType: false,       // The content type used when sending data to the server.
                cache: false,             // To unable request pages to be cached
                processData:false,        // To send DOMDocument or non processed data file it is set to false
                success: function(data) {   // A function to be called if request succeeds
                    console.log(data['message']);
                    var pollHex = '0x' + convertToHex(currentPollName);
                    ballotInstance.addProposalToVotePoll(pollHex, proposalAddress, function(err, data) {
                        console.log(err);
                        console.log(data);
                        if(!alert("Successfully proposal added")) {window.location.reload()};
                    })
                },
                error: function(request, status, error) {
                    // console.log(error);
                },
                
            });
            // window.location.reload();
        });
	})
})