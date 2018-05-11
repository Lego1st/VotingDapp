var address = "123";

$(document).ready(function (e) {
    initWeb3();
    web3.eth.getAccounts(function(err, data) {
        address = data[0];
        console.log(address);
        $("#update_proposal").on('submit',(function(e) {
            e.preventDefault();

            form = new FormData(this);
            form.append('address', address);
            for (var pair of form.entries()) {
                console.log(pair[0]+ ', ' + pair[1]); 
            }

            $.ajax({
                url: "http://127.0.0.1:8000/update_proposal/", // Url to which the request is send
                crossDomain: true,
                type: "POST",             // Type of request to be send, called as method
                data: form, // Data sent to server, a set of key/value pairs (i.e. form fields and values)
                dataType: 'json',
                contentType: false,       // The content type used when sending data to the server.
                cache: false,             // To unable request pages to be cached
                processData:false,        // To send DOMDocument or non processed data file it is set to false
                success: function(data) {   // A function to be called if request succeeds
                    message = data['message'];
                    if(message == 'ok'){
                        alert('Done');
                    }
                    else {
                        alert(message);
                    }
                }
                
            });
        }));

        form = new FormData();

        form.append('address', address);
        $.ajax({
            url: "http://127.0.0.1:8000/get_proposal/", // Url to which the request is send
            crossDomain: true,
            type: "POST",             // Type of request to be send, called as method
            contentType: false,
            dataType: 'json',
            data: form, // Data sent to server, a set of key/value pairs (i.e. form fields and values)
            cache: false,             // To unable request pages to be cached
            processData:false,        // To send DOMDocument or non processed data file it is set to false
            success: function(data) {   // A function to be called if request succeeds
                message = data['message'];
                if(message == 'ok'){
                    data = data['data']
                    $("#name").val(data['name']);
                    $("#poll_name").val(data['poll_name']);
                    $("#support_address").val(data['support_address']);
                    $("#date_of_birth").val(data['date_of_birth']);
                    $("#party").val(data['party']);
                    $("#description").val(data['description']);
                }
                else {
                    alert(message);
                }

            },
        }); 
    })
    
});