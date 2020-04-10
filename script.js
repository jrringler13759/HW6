

// api.openweathermap.org/data/2.5/weather?q={city name}&APPID=c69b1eeef58f9f4426fef5e9f3e9f49c

//when the start button is clicked
//the city is listed below and the weather appears on the right.

    
var cities = [];
console.log(cities);

function displayWeatherInfo() {
    var city = $("#cityInput").val().trim();
   
    var queryURL = "api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=62fca606199df2afea0a32e25faffdc5";
    console.log(queryURL);
    $.ajax({
        url:queryURL,
        
        method: "GET"
    }).then(function(response){
        console.log(response);
        var temp = response.main.temp;
    
        $("#temp").text(temp);
        $("#tempDayOne").text(temp);
    });
}

function renderSearchHistory() {
    $("#searchLog").empty();
    for (var i = 0; i < cities.length; i++){
        var newSearch = $("<button>");
        newSearch.attr("data-name", cities[i]);
        newSearch.text(cities[i]);
        $("#searchLog").prepend(newSearch);
    }
    
}   
 
$("#searchBtn").on("click", function(event){
    event.preventDefault();
    var city = $("#cityInput").val().trim();
    cities.push(city);
    renderSearchHistory();
    displayWeatherInfo();
})   
    
displayWeatherInfo();
renderSearchHistory();   
    