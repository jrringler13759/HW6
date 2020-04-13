
    
var cities = [];

function renderSearchHistory() {
    $("#searchLog").empty();
    for (var i = 0; i < cities.length; i++){
        displayNewCity(cities[i]);
    }
} 

function displayNewCity (city){
    var newSearch = $("<button class = 'cityBtn'>");
    var hr = $("<hr>");
    newSearch.attr("data-name", city);
    newSearch.text(city);
    $("#searchLog").prepend(newSearch);
    $("#searchLog").prepend(hr);
    $("#uv").text("");

}

//LOCAL STORAGE
//function onLoad() {
//localStorage.getItem("city")
//}

$("#searchBtn").on("click", function(event){
    event.preventDefault();
    var city = $("#cityInput").val().trim();
   
    if (city) {
        if (cities.indexOf(city)=== -1){
            cities.push(city);
            renderSearchHistory(city);
            
        }
        //updateCurrent();
        $("#cityInput").val("");
    }
    getWeather(city);
    getForecast(city);
    
})   

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
    $("#weather").show();
    
    var cityName = $("#cityName").text(cityInfo.name + "  ")
    var currentDate = $("#date").text("(" + moment().subtract(10, 'days').calendar() + ")"); 
    var mainIcon = cityInfo.weather[0].icon;
    var iconURL = "http://openweathermap.org/img/w/" + mainIcon + ".png";
    $("#mainIcon").attr("src", iconURL);

    var mainTemp = $("#temp").text(" " + ((cityInfo.main.temp - 273.15) * 1.80 + 32).toFixed(1)); 
    var humidity = $("#humidity").text(" " + cityInfo.main.humidity);
    var windSpeed = $("#wind").text(" " + cityInfo.wind.speed);
}
//set uvIndex text to appropriate item
//also set colors based on index
function displayUVIndex(uvResponse){
    var UVIndex = uvResponse.value;
    var indexSpan = $("#uv");
    if (UVIndex >= 0 && UVIndex < 3){
        indexSpan.append($("<span class = 'badge-success'>").text(UVIndex));
    } else if (UVIndex >= 3 && UVIndex < 6) {
        indexSpan.append($("<span class = 'badge-warning'>").text(UVIndex));
    } else if (UVIndex>= 6 && UVIndex<8) {
        indexSpan.append($("<span class = 'badgeOrange'>").text(UVIndex));
    } else if ( UVIndex > 8) {
        indexSpan.append($("<span class = 'badge-danger'>").text(UVIndex));
    }

   
   
    /* $("#uv").text(UVIndex);
    if (UVIndex >= 0 && UVIndex < 3){
        $(".badge-lg").addClass("badge-success")
    } else if (UVIndex >= 3 && UVIndex < 6){
        $(".badge-lg").addClass("badge-warning");
    } else if (UVIndex>= 6 && UVIndex<8){
        $(".badge-lg").css("background-color", "orange");
    } else if (UVIndex > 8) {
        $(".badge-lg").addClass("badge-danger");
    } */
}



function getForecast(city) {
    var forecastQueryURL= "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&APPID=62fca606199df2afea0a32e25faffdc5";;
    $.ajax({
        url:forecastQueryURL,
        method: "GET"
    }).then(displayFiveDays)

}
//parse through and get the same time for 5 days
function displayFiveDays(forecastResponse) {
    //console.log(forecastResponse);
    var list = forecastResponse.list;
    //console.log(list);
    for (var i = 0; i < list.length; i++){
        //console.log(list[i].dt_txt);
    }

}



$("#weather").hide();