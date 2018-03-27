$(document).ready(function() {
    if(isEndedRound1()) {
        $("#info-pre").on("click", function() {
            load_round(".main-view", "info-pre.html");
        })
    } 
})