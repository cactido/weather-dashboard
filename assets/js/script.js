const API_KEY = 'c2762dacd6fce5141196e5b409b3fb43';
var searchHistory = [];

//makes an API call with city name in the search box
function findCity(city) {
    //fetch up to five results by city name from Open Weather
    fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=5&appid=c2762dacd6fce5141196e5b409b3fb43')
        .then(function (res) {
            res.json().then(function (data) {
                //generate an alert if no results are returned
                if (data.length === 0) {
                    alert('City not found, please try again.');
                } else if (data.length === 1) {         //automatically save longitude and latitude
                    var cityInformation = {                //if there is only one result to be used
                        'lon': data[0].lon,             //in the weather forecast API call
                        'lat': data[0].lat,
                        'name': data[0].name
                    };
                    updateSearchHistory(cityInformation);
                    weatherLookup(cityInformation);
                } else {
                    //if there is more than one result, loop through them and prompt the user
                    //with each choice then log the location data for the selected city
                    for (i = 0; i < data.length; i++) {
                        //prompt the user to confirm city, state (country) if there is a state or city, country if no state
                        if (data[i].state) {
                            var prompt = confirm('Did you mean ' + data[i].name + ', ' + data[i].state + ' (' + data[i].country + ')?');
                        } else {
                            var prompt = confirm('Did you mean ' + data[i].name + ' (' + data[i].country + ')?');
                        }

                        //if the user confirms, log the location data and exit the loop
                        if (prompt) {
                            var cityInformation = {
                                'lon': data[i].lon,
                                'lat': data[i].lat,
                                'name': data[i].name
                            }
                            updateSearchHistory(cityInformation);
                            weatherLookup(cityInformation);
                            break;
                        }
                    }
                }
            }).catch(function (err) {
                console.log(err);
            })
        })
}
//calls Open Weather one-call-api with the retrieved location data and sends it to the display function
function weatherLookup(city) {
    //retrieve the weather data for the searched location from Open Weather
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + city.lat + '&lon=' + city.lon + '&exclude=minutely,hourly,alerts&units=imperial&appid=' + API_KEY)
    .then(res => res.json())
    .then(weatherData => weatherDisplay(city, weatherData))
    .catch((err) => console.log(err));
}
//renders the information to the main page
function weatherDisplay(loc, data) {
    //set the main weather display to the city and today's date
    $('#weather-box-title').text(loc.name + ' (' + getDayMonth(data.current.dt) + ')');
    //creates an img tag for the weather icon
    $('#weather-box-icon').html('<img src="http://openweathermap.org/img/wn/' + data.current.weather[0].icon + '.png" />')
    //insert the temperature, wind, humidity and UV index
    $('#weather-box > .temp').text('Temp: ' + data.current.temp + '°F');
    $('#weather-box > .wind').text('Wind: ' + data.current.wind_speed + ' MPH');
    $('#weather-box > .humidity').text('Humidity: ' + data.current.humidity + '%');
    $('#weather-box > .uv-index').text('UV Index: ' + data.current.uvi);
    //loops through the next five days and sets the title, icon, temperature, wind, and humidity for the 5 day forecast
    for (let i = 0; i < 5; i++) {
        //select the element with the id of forecast-n
        var current = $('body').find('#forecast-' + (i + 1));
        //set each displayed element for the current forecast day
        current.find('.forecast-title').text(getDayMonth(data.daily[i + 1].dt));
        current.find('.forecast-icon').html('<img src="http://openweathermap.org/img/wn/' + data.daily[i + 1].weather[0].icon + '.png" />');
        current.find('.temp').text('Temp: ' + data.daily[i + 1].temp.day + '°F');
        current.find('.wind').text('Wind: ' + data.daily[i + 1].wind_speed + ' MPH');
        current.find('.humidity').text('Humidity: ' + data.daily[i + 1].humidity + '%');
    }
}
//converts from Unix timestamps and returns a string with the day and month
function getDayMonth(d) {
    var date = new Date(d * 1000);
    var dayMonth = (date.getMonth() + 1) + '/' + (date.getDate()); 
    return dayMonth;
}
//puts new city at the beginning of the searchHistory array and removes the last entry if the array is longer
//than 10 items
function updateSearchHistory(city) {
    searchHistory.splice(0, 0, city);
    if (searchHistory.length > 10) {
        searchHistory.pop();
    }
    localStorage.setItem('current', JSON.stringify(city));
    localStorage.setItem('history', JSON.stringify(searchHistory));
    console.log('search history updated: ', searchHistory)
    showSearchHistory();
}
//renders search history as buttons below the search form
function showSearchHistory () {
    $('#search-history').empty();
    for (let i = 0; i < searchHistory.length; i++) {
        $('#search-history').append('<button type="submit" class="btn btn-secondary w-100 mb-1 search-history-button" id="' + searchHistory[i].name + '" value="' + searchHistory[i].name + '">' + searchHistory[i].name + '</button>');
    }
}
//loads search history from local storage
function startUp() {
    //checks for search history in localStorage and, if it exists, renders the most recent city's weather
    if (Object.keys(localStorage).length) {
        searchHistory = JSON.parse(localStorage.getItem('history'));
        weatherLookup(JSON.parse(localStorage.getItem('current')));
    }
    console.log('startup history:', searchHistory);
    if (searchHistory) {
        showSearchHistory();
    }
}
//initiates an API call when the city search form is submitted
$('#city-search-form').on('submit', function (event) {
    event.preventDefault();
    var city = $('#search-input').val();
    findCity(city);
});
//when a history button is clicked, sets it as the current view
$('body').on('click', '.search-history-button', function (event) {
    event.preventDefault();  

    var clickedCity = $(this).attr('value');
    //find the matching object in the search history and display it
    for (let i = 0; i < searchHistory.length; i++) {
        if (searchHistory[i].name === clickedCity) {
            localStorage.setItem('current', JSON.stringify(searchHistory[i]));
            weatherLookup(searchHistory[i]);
        }
    }
}) 

startUp();