// calls the Openweather's geolocator API 
let api_url = 'http://api.openweathermap.org/geo/1.0/zip?zip=22202,US&appid=a8fca69c0decd07fd47a9618050e95c3';




// will reference the index.html element with the id of city
let city = $('#city');

// will reference the index.html element with the id of svBtn
let saveBtn = $('#svBtn');

// will reference the index.html element with the id of valid-zip
let zipResult = $('#valid-zip');

let quickTimerCtr = 15;
let quickTimer;


// A simple function which validates the Zip Code has a correct length of 5
function isValidZip(currentZip){
	if(currentZip.length == 5)
		return true;
	return false;
}

function alertUser(){
	quickTimer = setInterval(function () {
		quickTimerCtr--;

		//  Show element indicating that user's Zip Code is invalid  
		zipResult.removeClass("invisible");

		if (quickTimerCtr <= 0) {

		//  if quickTimer is less than or equal to 0 then hide the element 
		  zipResult.addClass("invisible");
		  clearInterval(quickTimer);
		  console.log(quickTimerCtr);
		}
		// set in Nanoseconds
	  }, 100);

	// Resets timer back to 10 for the next time an invlaid zip code is entered
	quickTimerCtr = 15;
}
  
// This click will begin the API call 
saveBtn.on('click', function () {
	zipCode = city.val();
	// if zipCode is truthy then do work 

	if (zipCode && isValidZip(zipCode)) 
	{
		// How to make an API call
		http://api.openweathermap.org/geo/1.0/zip?zip={zip code},{country code}&appid={API key}
		// force the name into our city through concatting the string

		api_url = 'http://api.openweathermap.org/geo/1.0/zip?zip=' +
			zipCode + ',US&appid=a8fca69c0decd07fd47a9618050e95c3';

		console.log(zipCode);

		fetch(api_url)
			.then(function (response) {
				return response.json();
			})

			.then(function (data) {

				console.log('API request was a success \n----------');
				console.log(data);

				// we are now on the restaurants.html page so therefore we can now display 
				// more data
				// window.location.href= 'http://127.0.0.1:5500/restaurants.html'

				// $('.target').append('<p>This is where the results will be</p>')

				// call the Restaurants near me USA API
				// displays the object returned by the api call 
				// this object is called settings 
				// if the response to the call is valid then settings attributes are 
				// displayed to the console

				// set to comments so that the api isnt being constanly called on every reload

				// $.ajax(settings).done(function (response) {
				// 	// console.log(response);
				// });



				// https://rapidapi.com/makingdatameaningful/api/restaurants-near-me-usa
				// const settings = {
				// async: true,
				// crossDomain: true,
				// url: 'https://restaurants-near-me-usa.p.rapidapi.com/restaurants/location/zipcode/90210/0',
				// method: 'GET',
				// headers: {
				// 		'X-RapidAPI-Key': '7efaff1c97msh4469252a2b3babep1db259jsna8b5a9d547c0',
				// 		'X-RapidAPI-Host': 'restaurants-near-me-usa.p.rapidapi.com'
				// 	}
				// };

			});
	}
	// Zip Code is not valid and therefore we must alert the user 
	else
	{
		alertUser();
	}
});

