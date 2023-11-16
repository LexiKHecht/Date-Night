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

// saveBtn.disabled =true;
// console.log(saveBtn.disabled);	



// A simple function which validates the Zip Code has a correct length of 5
function isValidZip(currentZip) {
	if (currentZip.length == 5)
		return true;
	return false;
}

function alertUser() {
	quickTimer = setInterval(function () {
		quickTimerCtr--;

		//  Show element indicating that user's Zip Code is invalid  
		zipResult.removeClass("invisible");
		console.log(quickTimerCtr);

		if (quickTimerCtr <= 0) {

			//  if quickTimer is less than or equal to 0 then hide the element 
			zipResult.addClass("invisible");
			clearInterval(quickTimer);
		}
		// set in Nanoseconds
	}, 100);

	// Resets timer back to 10 for the next time an invlaid zip code is entered
	quickTimerCtr = 15;
}

function disableSvBtn() {
	
}

function updatePage() {
	let zipCode = city.val();
	// if zipCode is truthy then do work 

	if (zipCode && isValidZip(zipCode)) {
		// How to make an API call
		http://api.openweathermap.org/geo/1.0/zip?zip={zip code},{country code}&appid={API key}
		// force the name into our city through concatting the string

		api_url = 'http://api.openweathermap.org/geo/1.0/zip?zip=' +
			zipCode + ',US&appid=fb1f3dcb852ef70f92f8472645b9bbfd';

		fetch(api_url)
			.then(function (geocode_response) {
				return geocode_response.json();
			})

			.then(function (geocode_data) {

				console.log('API request was a success \n----------');
				console.log(geocode_data);

				console.log(geocode_data.name);

				// we are now on the restaurants.html page so therefore we can now display 
				// more data

				// $('.target').append('<p>This is where the results will be</p>')

				// call the Restaurants near me USA API
				// displays the object returned by the api call 
				// this object is called settings 
				// if the response to the call is valid then settings attributes are 
				// displayed to the console
				// set to comments so that the api isnt being constanly called on every reload

				// https://rapidapi.com/makingdatameaningful/api/restaurants-near-me-usa

				const restaurantsForUser = {
					async: true,
					crossDomain: true,
					url: 'https://restaurants-near-me-usa.p.rapidapi.com/restaurants/location/zipcode/' + zipCode + '/0',
					method: 'GET',
					headers: {
						'X-RapidAPI-Key': '7efaff1c97msh4469252a2b3babep1db259jsna8b5a9d547c0',
						'X-RapidAPI-Host': 'restaurants-near-me-usa.p.rapidapi.com'
					}
				};

				// We now have list of 10 restraunts with their names, address, zip codes, ect 
				$.ajax(restaurantsForUser).done(function (restaurantsResponse) {

					// Finds the id restaurant-results and appends this new class <h1 class= "mb-4 ...
					$('#restaurant-results').append('<h1 class= "mb-4 mt-0 text-base font-light leading-relaxed">Restaurants in ' + geocode_data.name + '</h1>')
					for (let i = 0; i < 5; i++) {
						// Finds the id restaurant-results and now appends this new class <p class= "name mb-4 mt-0 ...
						$('#restaurant-results').append('<p class=  mb-4 mt-0 text-base font-light leading-relaxed"> Restaurant ' +
							(i + 1) + '.)	' + restaurantsResponse.restaurants[i].restaurantName + '</p>');

						let restaurantUrl = restaurantsResponse.restaurants[i].website;
						// Finds the id restaurant-results and now appends this new class <p class= "name mb-4 mt-0 ...
						// this time we are listing the restaurants websites
						// $('#restaurant-results').append('<p class= "mb-4 mt-0 text-base font-light leading-relaxed"> Their website '
						// + restaurantsResponse.restaurants[i].website + '</p>');

						// this is very dependent on string concat be careful editing these strings or it will break 
						$('#restaurant-results').append('<p class= "mb-4 mt-0 text-base font-light leading-relaxed"> Their website: '
							+ ' <a href="' + restaurantUrl + '"' +
							'class="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline">' + restaurantUrl + '</a></p>');

						// attaching buttonsing on to the save event
						$('#restaurant-results').append('<button id="btn' + i + '"class="px-3 py-1.5 text-center text-base font-normal text-pink-700 dark:text-neutral-200">Button</button>');
					}

					let restaurantResult = $('#restaurant-results');

					// this click event must be within the moment when we create the button
					// otherwise the button wouldn't be called

					restaurantResult.on('click', '#btn0', saveToLocal);
					restaurantResult.on('click', '#btn1', saveToLocal);
					restaurantResult.on('click', '#btn2', saveToLocal);
					restaurantResult.on('click', '#btn3', saveToLocal);
					restaurantResult.on('click', '#btn4', saveToLocal);
					disableSvBtn();
				});
			});

	}
	// Zip Code is not valid and therefore we must alert the user 
	else {
		alertUser();
	}

<<<<<<< HEAD
}

function saveToLocal(event) {
	event.preventDefault();

	// grabs the website url with some words b4 te actual url, we need to remove them
	let dateUrl = $(this).prev().text();

	// just like in 157 except we are getting the name
	let dateRestaurant = $(this).prev().prev().text();

	// removing and setting the strings to the desired data
	// All the data ends with a particular bit which will serve as a indicator 
	// to remove some code

	let searchTerm = ':';
	dateUrl = dateUrl.toString();
	dateUrl = dateUrl.slice( dateUrl.indexOf(searchTerm)+3, dateUrl.length);

	searchTerm = ')'
	dateRestaurant = dateRestaurant.toString();
	dateRestaurant = dateRestaurant.slice( dateRestaurant.indexOf(searchTerm)+2, dateRestaurant.length);

	console.log(dateUrl);
	console.log(dateRestaurant);

	let newDate = {
		loadedDateurl: dateUrl,
		loadDateRestaurant: dateRestaurant
	  };

	  saveDateToStorage(newDate);

}

function saveDateToStorage(date) {
	localStorage.setItem('newDate', JSON.stringify(date));
  }

// This click will begin the API call 
saveBtn.on('click', updatePage)

// <div class="flex gap-2">
//   <!-- HTML -->
//   <button class="bg-gray-300 px-4 py-2 rounded-md cursor-not-allowed opacity-50" disabled>
//     Disabled Button
//  </button>

//   <!-- HTML -->
//   <button class="bg-green-500 hover:bg-green-700 active:bg-green-800 px-4 py-2 rounded-md text-white">
//     Active Button
//   </button>

// </div>
=======
//This function takes the ID of a button as a parameter and 
//disables the button as well as making the cursor "not allowed"
function disableButton(buttonId){
	var button = document.getElementById(buttonId);
	button.disabled = "true";
	button.style.cursor = "not-allowed";
}

//This function takes the ID of a button as a parameter and 
//enables a previous disabled button as well as making the cursor a "pointer" again
function enableButton(buttonId){
	var button = document.getElementById(buttonId);
	button.disabled = "false";
	button.style.cursor = "pointer";
}
>>>>>>> aa0280225c68f168de8a8aa19bc9e8d484de61af
