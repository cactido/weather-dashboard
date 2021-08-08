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
                    var cityLocation = {                //if there is only one result to be used
                        'lon': data[0].lon,             //in the weather forecast API call
                        'lat': data[0].lat
                    };
                    weatherLookup(cityLocation);
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
                            var cityLocation = {
                                'lon': data[i].lon,
                                'lat': data[i].lat
                            }
                            weatherLookup(cityLocation);
                            break;
                        }
                    }
                }
            }).catch(function (err) {
                console.log(err);
            })
        })
}

function weatherLookup(loc) {
    console.log(loc.lon, loc.lat);
}

//initiates an API call when the city search form is submitted
$('#city-search-form').on('submit', function (event) {
    event.preventDefault();
    var city = $('#search-input').val();
    findCity(city);
});