$(document).ready(function() {
	$("#editbtn").on("click", function() {
		$(this).hide();
		$("#adminscreen").show();
		var poll = $("#adminpollname");
        for (i in pollnames) {
            poll.append('<option value="' + pollnames[i].name + '">' + pollnames[i].display + '\t(' + pollnames[i].name + ')' + '</option>');
        }
	})
})