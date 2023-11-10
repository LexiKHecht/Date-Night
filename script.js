// calls the Openweather's geolocator API 
let api_url = 'http://api.openweathermap.org/geo/1.0/direct?q=places&limit=5&appid=a8fca69c0decd07fd47a9618050e95c3';


// call the Restaurants near me USA API
// https://rapidapi.com/makingdatameaningful/api/restaurants-near-me-usa
const settings = {
	async: true,
	crossDomain: true,
	url: 'https://restaurants-near-me-usa.p.rapidapi.com/restaurants/location/state/MI/city/West%20Bloomfield/0',
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '7efaff1c97msh4469252a2b3babep1db259jsna8b5a9d547c0',
		'X-RapidAPI-Host': 'restaurants-near-me-usa.p.rapidapi.com'
	}
};

// displays the object returned by the api call 
// this object is called settings 
// if the response to the call is valid then settings attributes are 
// displayed to the console
$.ajax(settings).done(function (response) {
	console.log(response);
});

// will reference the index element with the id of city
let city = $('#city');

// will reference the index element with the id of svBtn
let saveBtn = $('#svBtn');

saveBtn.on('click', function () {
	cityName = city.val();
  
	// if cityName is truthy then do work 
	if (cityName) {
  
	  // force the name into our city through concatting the string
	  api_url = 'http://api.openweathermap.org/geo/1.0/direct?q=' +
		cityName + ',US&limit=5&appid=a8fca69c0decd07fd47a9618050e95c3';
  
	  fetch(api_url)
		.then(function (response) {
		  return response.json();
		})
		.then(function (data) {
		  console.log('API request was a success \n----------');
		  console.log(data);
		});
	}
  });