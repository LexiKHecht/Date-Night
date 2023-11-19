// calls the Openweather's geolocator API 
let api_url = 'http://api.openweathermap.org/geo/1.0/zip?zip=22202,US&appid=a8fca69c0decd07fd47a9618050e95c3';


// will refrence the index.html element with the id of toggle
let menuBtn = $('#toggler')

let sideMenu = $('#sidenav')

let xClose = $('#xOut')

let box = $('#calanderBox')

// will reference the index.html element with the id of city
let city = $('#city');

// will reference the index.html element with the id of svBtn
let saveBtn = $('#svBtn');

// will reference the index.html element with the id of valid-zip
let zipResult = $('#valid-zip');



let quickTimerCtr = 15;
let quickTimer;
let loadedDate;

let dateUrl;
let dateRestaurant;

let newDate = {
};

// A simple function which validates the Zip Code has a correct length of 5
function isValidZip(currentZip) {
	if (currentZip.length == 5)
		return true;
	return false;
}

menuBtn.on('click', openMenu)
xClose.on('click', closeMenu)

function openMenu() {

	sideMenu.removeClass("invisible");
}

function closeMenu() {
	sideMenu.addClass('invisible');
}

function alertUser() {
	quickTimer = setInterval(function () {
		quickTimerCtr--;

		//  Show element indicating that user's Zip Code is invalid  
		zipResult.removeClass("invisible");

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

function updatePage() {

	disableButton('svBtn');
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
				if (geocode_response.status === 404) {
					window.alert('That is not a valid ZIP code');
				}
				return geocode_response.json();
			})

			.then(function (geocode_data) {

				console.log('API request was a success \n----------');
				console.log(geocode_data);

				console.log(geocode_data.name);

				// we are now on the restaurants.html page so therefore we can now display 
				// more data

				// $('.target').append('<p>ThirestaurantResultill be</p>')

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

					let restaurantResult = $('#restaurant-results');

					// Finds therestaurantResultnd appends this new class <h1 class= "mb-4 ...
					restaurantResult.append('<h1 class= "mb-4 mt-0 text-base font-light leading-relaxed">Restaurants in ' + geocode_data.name + '</h1>')
					for (let i = 0; i < 5; i++) {
						// Finds therestaurantResultnd now appends this new class <p class= "name mb-4 mt-0 ...
						restaurantResult.append('<p class=  mb-4 mt-0 text-base font-light leading-relaxed"> Restaurant ' +
							(i + 1) + '.)	' + restaurantsResponse.restaurants[i].restaurantName + '</p>');

						let restaurantUrl = restaurantsResponse.restaurants[i].website;
						// Finds therestaurantResultnd now appends this new class <p class= "name mb-4 mt-0 ...
						// this time we are listing the restaurants websites
						// restaurantResult.append('<p class= "mb-4 mt-0 text-base font-light leading-relaxed"> Their website '
						// + restaurantsResponse.restaurants[i].website + '</p>');

						// this is very dependent on string concat be careful editing these strings or it will break 
						restaurantResult.append('<p class= "mb-4 mt-0 text-base font-light leading-relaxed"> Their website: '
							+ ' <a href="' + restaurantUrl + '"' +
							'class="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline">' + restaurantUrl + '</a></p>');

						// attaching buttons to these restraunts
						restaurantResult.append('<button id="btn' + i + '"class="px-3 py-1.5 text-center text-base font-normal text-pink-700 dark:text-neutral-200">Click To save your date location</button>');
					}

					restaurantResult.append('<button id="resetBtn"class="px-3 py-1.5 text-center text-base font-normal text-pink-700 dark:text-neutral-200">Click here to start a new search</button>');

					// this click event must be within the moment when we create the button
					// otherwise the button wouldn't be called

					restaurantResult.on('click', '#btn0', handleTextSubmit);
					restaurantResult.on('click', '#btn1', handleTextSubmit);
					restaurantResult.on('click', '#btn2', handleTextSubmit);
					restaurantResult.on('click', '#btn3', handleTextSubmit);
					restaurantResult.on('click', '#btn4', handleTextSubmit);
					restaurantResult.on('click', '#resetBtn', resetPage);
				});
			});
	}
	// Zip Code is not valid and therefore we must alert the user 
	else {
		alertUser();
	}
}

function handleTextSubmit(event) {
	event.preventDefault();
	let loadedDatesStorage = readDateFromStorage();

	// grabs the website url with some words b4 te actual url, we need to remove them
	dateUrl = $(this).prev().text();

	// just like in 157 except we are getting the name
	dateRestaurant = $(this).prev().prev().text();

	// removing and setting the strings to the desired data
	// All the data ends with a particular bit which will serve as a indicator 
	// to remove some code

	let searchTerm = ':';
	dateUrl = dateUrl.toString();
	dateUrl = dateUrl.slice(dateUrl.indexOf(searchTerm) + 3, dateUrl.length);


	searchTerm = ')'
	dateRestaurant = dateRestaurant.toString();
	dateRestaurant = dateRestaurant.slice(dateRestaurant.indexOf(searchTerm) + 2, dateRestaurant.length);

	let restaurantResult = $('#restaurant-results');
	restaurantResult.remove();

	// we want to hide the results
	hide($('#restaurant-results'));
	show($('#pickDate'));

	$(function () {
		box.removeClass("invisible");
		$("#datepicker").datepicker({
			onSelect: function (selectedDate) {
				// custom callback logic here
				alert(selectedDate);
				newDate['thing'] = selectedDate;
				newDate['loadedDateurl'] = dateUrl;
				newDate['loadDateRestaurant'] = dateRestaurant;
				

				// if the first item of local storage has nothing in it overwrite it with the first saved value
				if (loadedDatesStorage[0] === null) {
					loadedDatesStorage[0] = newDate;
					saveDateToStorage(loadedDatesStorage);
				}

				// otherwise we just want to continue to add dates into storage 
				else {
					loadedDatesStorage.push(newDate)
					saveDateToStorage(loadedDatesStorage);
				}
			}

		});

	});

}

function getDate() {
	let date = $("#datepicker").datepicker("getDate");
	loadedDate = date.toString();

	let searchTerm = '2023';
	loadedDate = loadedDate.slice(0, loadedDate.indexOf(searchTerm) + 4);
	console.log(loadedDate)
}

function readDateFromStorage() {
	let loadedDate = localStorage.getItem('newDate');

	// if somebtnNumber was succefully loaded in description then 
	// JSON.parse(discription) transfroms the strings loaded from
	//  local storage into objects
	if (loadedDate) {
		loadedDate = JSON.parse(loadedDate);
	}

	// returns an empty array if description = falsey
	// meaning that there was nobtnNumber in local storage to load 
	else {
		loadedDate = [null];
	}

	return loadedDate;
}

function saveDateToStorage(date) {
	localStorage.setItem('newDate', JSON.stringify(date));
}

function resetPage() {
	location.reload();
}


function disableButton(buttonId) {
	var button = document.getElementById(buttonId);
	button.disabled = "true";
	button.style.cursor = "not-allowed";
}

//This function takes the ID of a button as a parameter and 
//enables a previous disabled button as well as making the cursor a "pointer" again
function enableButton(buttonId) {
	var button = document.getElementById(buttonId);
	button.disabled = "false";
	button.style.cursor = "pointer";
}

function hide(elementId) {
	elementId.addClass('invisible');
}

function show(elementId) {
	elementId.removeClass('invisible');
}

// Back to top button

const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

// This click will begin the API call 

saveBtn.on('click', updatePage)


