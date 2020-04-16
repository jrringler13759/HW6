
    
var cities = [];

function renderSearchHistory() {
    $("#searchLog").empty();
    for (var i = 0; i < cities.length; i++){
        displayNewCity(cities[i]);
        localStorage.setItem("city", cities[i]);
    }
} 

function displayNewCity (city){
    var newSearch = $("<button class = 'cityBtn'>");
    var hr = $("<hr>");
    newSearch.attr("data-name", city);
    newSearch.text(city);
    $("#searchLog").prepend(newSearch);
    $("#searchLog").prepend(hr);
    $("#uv").empty();
}

$("#searchLog").on("click", function(event){
    var cityBtn = $(event.target);
    var city = $(event.target).text();
    //console.log(city);
    if(cityBtn.is("button")){
        $("#uv").empty();
        getWeather(city);
        displayWeather(city);
        displayUVIndex(city);
    }
});

$(window).on( "load", function() {
    $("#weather").show();
    var city = localStorage.getItem("city");
    getWeather(city);
    getForecast(city)
});

$("#searchBtn").on("click", function(event){
    event.preventDefault();
    var city = $("#cityInput").val().trim();
   //*should only do something if there is something in the input field

    //if the city is already there don't put it again
    if (city) {
        if (cities.indexOf(city)=== -1){
            cities.push(city);
            renderSearchHistory(city);
        }
        $("#cityInput").val("");
    }
    getWeather(city);
    getForecast(city);
    
});   

//get current weather update
function getWeather(city) {    
    var currentQueryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=62fca606199df2afea0a32e25faffdc5";

    $.ajax({
        url: currentQueryURL,
        method: "GET"
    }).then(function(response){
       displayWeather(response);
       //use lat and lon to get uvindex
        var latitude =response.coord.lat; 
        var longitude = response.coord.lon;
        var uvIndexQueryURL = "http://api.openweathermap.org/data/2.5/uvi?appid=62fca606199df2afea0a32e25faffdc5&lat=" + latitude + "&lon=" + longitude;
        $.ajax({
            url:uvIndexQueryURL,
            method: "GET"
        }).then(displayUVIndex)
    })
}

//set all current weather text to appropriate item
function displayWeather(cityInfo) {
    console.log(cityInfo);
    $("#weather").show();
    //Setting all the main current weather
    $("#cityName").text(cityInfo.name + "  ")
    var currentDate = moment().format("MM/DD/YY"); 
    $("#date").text("(" + currentDate + ")");
    var icon = cityInfo.weather[0].icon;
    var iconURL = "http://openweathermap.org/img/w/" + icon + ".png";
    $("#mainIcon").attr("src", iconURL);
    var mainTemp = ((cityInfo.main.temp - 273.15) * 1.80 + 32).toFixed(1); 
    $("#temp").text(mainTemp);   
    var humidity = cityInfo.main.humidity;
    $("#humidity").text(humidity);
    $("#wind").text(" " + cityInfo.wind.speed);
}
//set uvIndex text to appropriate item
//also set colors based on index
function displayUVIndex(uvResponse){
    var UVIndex = uvResponse.value;
    $("#uv").append($("<span class = 'badge badge-lg'>").text(UVIndex));
    if (UVIndex >= 0 && UVIndex < 3){
        $(".badge").addClass("badge-success");
    } else if (UVIndex >= 3 && UVIndex < 6) {
        $(".badge").addClass("badge-warning");
    } else if (UVIndex >= 6 && UVIndex < 8) {
        $(".badge").addClass("badgeOrange");
    } else if ( UVIndex > 8) {
        $(".badge").addClass("badge-danger");
    } 
}
    

//Five Day Forecast
function getForecast(city) {
    var forecastQueryURL= "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&APPID=62fca606199df2afea0a32e25faffdc5";;
    $.ajax({
        url:forecastQueryURL,
        method: "GET"
    }).then(displayFiveDays)

}

function displayFiveDays(forecastResponse) {
    var list = forecastResponse.list;
    var count = 1;   
    for (var i = 0; i < list.length; i++){
   
        if (list[i].dt_txt.includes("15:00:00")) {
           
           $("#date-"+ count).text(new Date(list[i].dt_txt).toLocaleDateString());
           
           var iconURL = "http://openweathermap.org/img/w/" + list[i].weather[0].icon + ".png";
           $("#icon-"+ count).attr("src", iconURL);

           $("#tempDay-"+ count).text(((list[i].main.temp- 273.15) * 1.80 +32).toFixed(1));
           
           $("#humid-"+ count).text(list[i].main.humidity);
           count++; 
        }
    }
}

$("#weather").hide();

