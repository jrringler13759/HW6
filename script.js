
    
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
        //should I do local storage or just make the ajax calls again??
        getWeather(city);
        displayWeather(city);
        displayUVIndex(city);
    }
});

//LOCAL STORAGE

$( window ).on( "load", function() {
    $("#weather").hide();
    var city = localStorage.getItem("city");
    getWeather(city);
    displayWeather(city);
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
            //localStorage.setItem("city", city);
        }
        //updateCurrent();
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
    $("#weather").show();
    
    $("#cityName").text(cityInfo.name + "  ")
    var currentDate = moment().subtract(10, 'days').calendar(); 
    $("#date").text("(" + currentDate + ")");
    var icon = cityInfo.weather[0].icon;
    var iconURL = "http://openweathermap.org/img/w/" + icon + ".png";
    $("#mainIcon").attr("src", iconURL);

    var mainTemp = ((cityInfo.main.temp - 273.15) * 1.80 + 32).toFixed(1); 
    $("#temp").text(mainTemp);
    var humidity = cityInfo.main.humidity;
    $("#humidity").text(humidity);
    $("#wind").text(" " + cityInfo.wind.speed);

    $("#dateOne").text(currentDate);
    $("#iconOne").attr("src", iconURL);
    $("#tempDayOne").text(mainTemp);
    $("#humidOne").text(humidity);
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
    
    
function getForecast(city) {
    var forecastQueryURL= "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&APPID=62fca606199df2afea0a32e25faffdc5";;
    $.ajax({
        url:forecastQueryURL,
        method: "GET"
    }).then(displayFiveDays)

}
//parse through and get the same time for 5 days
//should I stringify?
function displayFiveDays(forecastResponse) {
    //console.log(forecastResponse);
    var list = forecastResponse.list;
    var threePMList = [];
    console.log(threePMList);
    var fiveDayTemp = [];
    var fiveDayHumid = [];
    for (var i = 0; i < list.length; i++){
        //console.log(list[i].dt_txt);
        if (list[i].dt_txt.includes("15:00:00")) {
            threePMList.push(list[i]);
        }
    }
    for (var j = 0; j <threePMList.length; j++){
        fiveDayTemp.push(threePMList[i].main.temp);
        fiveDayHumid.push(threePMList[i].main.humidity);
    }
    console.log(fiveDayTemp);
    console.log(fiveDayHumid);
}

$("#weather").hide();

