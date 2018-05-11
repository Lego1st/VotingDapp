function loadInformation(data)  {
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
    $("#candidate_list").html(html)	
    $("#info_poll_names").on('change', function() {
    	var new_poll_name = $(this).find(":selected").val();
    	loadCandidateInfo(new_poll_name);
    })
}

function loadPollName() {
    var poll = $("#info_poll_names");
    for (i in pollnames) {
        poll.append('<option value="' + pollnames[i].name + '">' + pollnames[i].display + '</option>');
    }
    loadCandidateInfo('Cali');
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
            // console.log(data);
            message = data['message']
            if(message == 'ok') {
                loadInformation(data['data']);
            }
            else {
                alert(message);
            }
        },
    });
}