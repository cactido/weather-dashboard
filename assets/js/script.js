const API_KEY = 'c2762dacd6fce5141196e5b409b3fb43';

//makes an API call with city name in the search box
function findCity(city) {
    //fetch up to five results by city name from Open Weather
    fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=5&appid=c2762dacd6fce5141196e5b409b3fb43')
        .then(function (res) {
            res.json().then(function (data) {
                //generate an alert if no results are returned
                if (data.length === 0) {
                    alert('City not found, please try again.');
                } else if (data.length === 1) {         //automatically save longitude and latitude
                    var cityInformation = {                //if there is only one result to be used
                        'lon': data[0].lon,             //in the weather forecast API call
                        'lat': data[0].lat,
                        'name': data[0].name,
                        'state': data[0].state,
                        'country': data[0].country
                    };
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
                                'name': data[i].name,
                                'state': data[i].state,
                                'country': data[i].country
                            }
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
//calls Open Weather one-call-api with the retrieved location data and displays it
function weatherLookup(loc) {
    console.log(loc.lon, loc.lat);
    //retrieve the weather data for the searched location from Open Weather
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + loc.lat + '&lon=' + loc.lon + '&exclude=minutely,hourly,alerts&units=imperial&appid=' + API_KEY)
    .then(res => res.json())
    .then(weatherData => weatherDisplay(loc, weatherData))
    .catch((err) => console.log(err));
}

function weatherDisplay(loc, data) {
    console.log(data);
    date = getDayMonth(data.current.dt);
}
//converts from Unix timestamps and returns a string with the day and month
function getDayMonth(d) {
    var date = new Date(d * 1000);
    var dayMonth = (date.getMonth() + 1) + '/' + (date.getDate()); 
    return dayMonth;
}

//initiates an API call when the city search form is submitted
$('#city-search-form').on('submit', function (event) {
    event.preventDefault();
    var city = $('#search-input').val();
    findCity(city);
});