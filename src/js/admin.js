
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

function addVotePoll(pollname, displayname) {
    form = new FormData();
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
}

function addProposal(proposalName, proposalAddress, currentPollName) {
    form = new FormData();
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
}

function regisTest(id, pollname, voter) {
    pollHex = '0x' + convertToHex(pollname);
    authInstance.registerTest(id, pollHex, voter, function(err, data) {
        console.log(err);
    });
}

function voteTest(pollname, proposal_id, voter) {
    pollHex = '0x' + convertToHex(pollname);
    ballotInstance.voteTest(pollHex, proposal_id, voter, function(err, data) {
        console.log(err);
    });
}

$(document).ready(function() {
    $("#testMode").on("click", () => {
        // alert("Something");
        var names = ["final", "Cali", "Flo", "Tex"];
        var displaynames = ["Final", "California", "Florida", "Texas"];
        for(let j = 0; j < names.length; ++j) {
            addVotePoll(names[j], displaynames[j]);
        }
    })

    $("#initProposal").on("click", () => {
        var names = [
        "final", "final", 
        "Cali", "Cali", 
        "Flo", "Flo",
        "Tex", "Tex"];
        var pnames = [
        "Hillary Clinton", "Donald Trump", 
        "Jimmy Gomez", "Alejandra Campoverdi", 
        "Jose Felix Diaz", "Lorenzo J. Palomares",
        "Dee Margo", "Emma Acosta"];
        var padds = [
        "0xeb1433c9068c9a95ed7d8a51a862821cbe5bbbd7", "0xe0630f2429e2100199bfb2cd28b62f0882b8cb6d", 
        "0x6b6070ec7d05e6cb700f8802d66051c2282e34f1", "0x8b85622fdb620b373eb0665c1e0bf74d9513ab37",
        "0xc24e8d81152c7ce1d5eed401669e974b34528636", "0xa9fed54dc8c383ea57b6aae308e5a87651635ff3",
        "0xfc44640b7a34d56f29902da923874438187a6432", "0xfb3d67471383632e5efacee2041ac41a85d55cde"];
        for(let j = 0; j < names.length; ++j) {
            addProposal(pnames[j], padds[j], names[j]);
        }
    })

    $("#regisTest").on("click", () => {
        var ids = ["111111111", "222222222", "333333333", "444444444", "555555555", "666666666"];
        var pollnames = ["Cali", "Cali", "Cali", "Flo", "Flo", "Flo"];
        var voters = [
        "0x627bd61ce90284a741a654a75d03a1b8319a75d7",
        "0x9266eb51c983e457b71d7b8f883b32cd42a97fd7",
        "0xbd4bc40ff29be6037e9966f5afc1c89000610367",
        "0x20301b7f0b6341775493e1bc21b64c7e6a6597fe",
        "0x116c2d5814bf759124e6c307f6c56e27ef74b6a9",
        "0x4ef37a80107b460cd8886823ef49591c0e63e87a"];
        var n = ids.length;
        for (let j = 0; j < n; ++j)
            regisTest(ids[j], pollnames[j], voters[j]);
    })

    $("#voteTest").on("click", () => {
        var pollnames = ["Cali", "Cali", "Cali", "Flo", "Flo", "Flo"];
        var proposal_ids = [
        "0x6b6070ec7d05e6cb700f8802d66051c2282e34f1",
        "0x6b6070ec7d05e6cb700f8802d66051c2282e34f1",
        "0x6b6070ec7d05e6cb700f8802d66051c2282e34f1",
        "0xc24e8d81152c7ce1d5eed401669e974b34528636",
        "0xa9fed54dc8c383ea57b6aae308e5a87651635ff3",
        "0xa9fed54dc8c383ea57b6aae308e5a87651635ff3"];
        var voters = [
        "0x627bd61ce90284a741a654a75d03a1b8319a75d7",
        "0x9266eb51c983e457b71d7b8f883b32cd42a97fd7",
        "0xbd4bc40ff29be6037e9966f5afc1c89000610367",
        "0x20301b7f0b6341775493e1bc21b64c7e6a6597fe",
        "0x116c2d5814bf759124e6c307f6c56e27ef74b6a9",
        "0x4ef37a80107b460cd8886823ef49591c0e63e87a"];
        var n = pollnames.length;
        for (let j = 0; j < n; ++j)
            voteTest(pollnames[j], proposal_ids[j], voters[j]);
    })

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
            addVotePoll(pollname, displayname);
        })

        $("#newproposal").on("click", function() {
        	var proposalName = $("input[name='proposalName']").val();
        	var proposalAddress = $("input[name='proposalAddress'").val();
        	var currentPollName = $("#adminpollname").find(":selected").val();
        	addProposal(proposalName, proposalAddress, currentPollName);
            // window.location.reload();
        });
	})
})