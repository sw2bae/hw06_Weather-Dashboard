var cityArray = [];


function renderBtn() {

    $("#v-pills-tab").empty();


    for (var i = 0; i < cityArray.length; i++) {

        var cityBtn = $("<button>");
        cityBtn
            .addClass("nav-link active")
            .attr("id", cityArray[i])
            .text(cityArray[i])
            .appendTo($("#v-pills-tab"));
    }
}

$("#submit").on("click", function (event) {
    event.preventDefault();

    displayWeather();
});

function displayWeather() {
    var cityInput = $("#search").val().trim();
    var apiKey = "443955fb6787f379caecf22f8c6f2f2e";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&units=imperial&appid=" + apiKey;

    $.ajax({

        url: queryURL,
        method: 'GET'

    }).then(function (res) {
        console.log(res);

        var city = res.name;

        cityArray.unshift(city);
        cityArray = Array.from(new Set(cityArray));

        renderBtn();
        $(".tab-content").empty();
        $("#forecast").empty();

        var lon = res.coord.lon;
        var lat = res.coord.lat;

        var forcastqueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey;

        $.ajax({

            url: forcastqueryURL,
            method: 'GET'

        }).then(function (res) {

            console.log(res);

            var cityInfo = $("<h1>");
            var iconURL = "http://openweathermap.org/img/wn/" + res.current.weather[0].icon + "@2x.png"
            var weatherIcon = $("<img>");
            var dt = new Date(res.current.dt * 1000);
            var date = (dt.getMonth() + 1 + "/" + dt.getDate() + "/" + dt.getFullYear());

            cityInfo.text(city + " (" + date + ") ")
                .appendTo($(".tab-content"));
            weatherIcon.attr("src", iconURL)
                .appendTo(cityInfo);

            var tempInfo = $("<p>");
            tempInfo.text("Temperature : " + res.current.temp + " °F")
                .appendTo($(".tab-content"));

            var humidityInfo = $("<p>");
            humidityInfo.text("Humidity : " + res.current.humidity + " %")
                .appendTo($(".tab-content"));

            var windInfo = $("<p>");
            windInfo.text("Wind Speed : " + res.current.wind_speed + " MPH")
                .appendTo($(".tab-content"));

            var uvIndex = $("<p>");
            uvIndex.text("UV Index : " + res.current.uvi)
                .appendTo($(".tab-content"));

            $("<hr>").appendTo($(".tab-content"));
            $("<h4>").text("5-Day Forecast : ")
                .appendTo($(".tab-content"));


            for (var i = 1; i < 6; i++) {

                var forecastDt = new Date(res.daily[i].dt * 1000);
                var forecastDate = (forecastDt.getMonth() + 1 + "/" + forecastDt.getDate() + "/" + forecastDt.getFullYear());

                $("<div>").text(forecastDate)
                    .addClass("border bg-primary col-2 mr-4 rounded shadow-lg text-white")
                    .attr("id", i)
                    .appendTo($("#forecast"));

                var forecastIcon = res.daily[i].weather[0].icon;
                forecastIcon = "http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png"


                $("<img>").attr("src", forecastIcon)
                    .appendTo("#" + i);

                $("<p>").text("Temp : " + res.daily[i].temp.day + " °F")
                    .appendTo("#" + i);

                $("<p>").text("Humidity : " + res.daily[i].humidity + " %")
                    .appendTo("#" + i);


            }

        });
    });



}

