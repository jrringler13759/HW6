
    
var cities = [];


//function updateCurrent(cityInfo) {
    
    //var mainTemp = $("#temp").text(cityInfo.main.temp);


   
//}

//function updateFiveDay(forecast){
//}

//function uvIndex(lat, long){
//}



function renderSearchHistory() {
    $("#searchLog").empty();
    for (var i = 0; i < cities.length; i++){
        displayNewCity(cities[i]);
    }
} 

function displayNewCity (city){
    var newSearch = $("<button class = 'cityBtn'>");
    newSearch.attr("data-name", city);
    newSearch.text(city);
    $("#searchLog").prepend(newSearch);   
}


//LOCAL STORAGE
//function onLoad() {
//localStorage.getItem("city")
//}

//is it ok to have two click event on the same button?
$("#searchBtn").on("click", function(event){
    event.preventDefault();
    var city = $("#cityInput").val().trim();
    console.log(city);
    
    if (city) {
        if (cities.indexOf(city)=== -1){
            cities.push(city);
            renderSearchHistory(city);
            localStorage.setItem("city", city);
        }
        //updateCurrent();
        $("#cityInput").val("");
    }
    
})   

$("#searchBtn").on("click", function(event){
    event.preventDefault();
   
    $("#weather").show();
    var city = $("#cityInput").val().trim();
    
    //not showing up
    console.log(city);
   
    var currentQueryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=62fca606199df2afea0a32e25faffdc5";
$.ajax({
    url: currentQueryURL,
    method: "GET"
}).then(function(response){
    console.log(response);
})
});



/*
    var forecastQueryURL= "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&APPID=62fca606199df2afea0a32e25faffdc5";;
$.ajax({
    url:forecastQueryURL,
    method: "GET"
}).then(updateForecast)



    var uvIndexQueryURL;
$.ajax({
    url:uvIndexQueryURL,
    method: "GET"
}).then(uvIndex)
*/


$("#weather").hide();