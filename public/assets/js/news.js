$(document).ready(function(){

    $("#search-button").on("click", function(){

        console.log("working");
        $.get("/scrape").then(function(dbData){
            console.log(dbData);
        });
    });



});