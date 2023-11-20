

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

// will reference the index.html element with the id of save-dates
let saveDates = $('#save-dates');

let saveSucc = $('#save-success')


// global variables
let quickTimerCtr = 15;
let successTimerCtr = 20;

let quickTimer;
let successTimer;
let loadedDate;

let dateUrl;
let dateRestaurant;

// anempty date object, we will use this to store newDate variables dynamically
let newDate = {
};

// A simple function which validates the Zip Code has a correct length of 5
function isValidZip(currentZip) {
	if (currentZip.length == 5)
		return true;
	return false;
}

function openMenu() {
	sideMenu.removeClass("invisible");
	printEvent();
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
function saveSuccess()
{
	successTimer = setInterval(function () {
		successTimerCtr--;

		//  Show element indicating that user's Zip Code is invalid  
		show($('#save-success'));
		if (successTimerCtr <= 0) {

			//  if quickTimer is less than or equal to 0 then hide the element 
			hide($('#save-success'));
			clearInterval(successTimer);
			resetPage();

		}
		// set in Nanoseconds
	}, 100);
	// Resets timer back to 10 for the next time an invlaid zip code is entered
	successTimerCtr = 20;
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
					restaurantResult.append('<h1 class= "mb-0 mt-0 text-base font-light leading-relaxed">Restaurants in ' + geocode_data.name + '</h1>')
					restaurantResult.append('<button id="resetBtn" class=" absolute top-0 right-0 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-2 mt-2 border border-gray-400 text-[0.875rem] rounded shadow" >Click here to start a new search</button>');

					for (let i = 0; i < 5; i++) {
						// Finds therestaurantResultnd now appends this new class <p class= "name mb-4 mt-0 ...
						restaurantResult.append('<p class=  mb-0 mt-0 text-base font-light leading-relaxed"> Restaurant ' +
							(i + 1) + '.)	' + restaurantsResponse.restaurants[i].restaurantName + '</p>');

						let restaurantUrl = restaurantsResponse.restaurants[i].website;
						// Finds therestaurantResultnd now appends this new class <p class= "name mb-4 mt-0 ...
						// this time we are listing the restaurants websites
						// restaurantResult.append('<p class= "mb-4 mt-0 text-base font-light leading-relaxed"> Their website '
						// + restaurantsResponse.restaurants[i].website + '</p>');

						// this is very dependent on string concat be careful editing these strings or it will break 
						restaurantResult.append('<p class= "mb-0 mt-0 text-base font-light leading-relaxed"> Their website: '
							+ ' <a href="' + restaurantUrl + '"' +
							'class="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline">' + restaurantUrl + '</a></p>');

						// attaching buttons to these restraunts
						restaurantResult.append('<button id="btn' + i + '"class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-2 mt-1 mb-2 border border-gray-400 text-[0.875rem] rounded shadow">Click To save your date location</button>');
						restaurantResult.append('<hr class="target h-px my-8 bg-gray-200 border-0 dark:bg-gray-700">');

					}

					// this click event must be within the moment when we create the button
					// otherwise the button wouldn't be called

					restaurantResult.on('click', '#btn0', handleTextSubmit);
					restaurantResult.on('click', '#btn1', handleTextSubmit);
					restaurantResult.on('click', '#btn2', handleTextSubmit);
					restaurantResult.on('click', '#btn3', handleTextSubmit);
					restaurantResult.on('click', '#btn4', handleTextSubmit);
					restaurantResult.on('click', '#resetBtn', resetPage);
					disableButton('svBtn')
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
				newDate['date'] = selectedDate;
				newDate['loadedDateurl'] = dateUrl;
				newDate['loadDateRestaurant'] = dateRestaurant;
				


				// if the first item of local storage has nothing in it overwrite it with the first saved value
				if (loadedDatesStorage[0] === null) {
					loadedDatesStorage[0] = newDate;
					loadedDatesStorage.push(newDate);
					saveDateToStorage(loadedDatesStorage);
				}

				// otherwise we just want to continue to add dates into storage 
				else {
					loadedDatesStorage.push(newDate);
					saveDateToStorage(loadedDatesStorage);

				}
				saveSuccess();
			}

		});

	});

}

function printEvent() {

	// We use numOfTimeSlots since it value is grabbed on init
	let dateFromStorage = readDateFromStorage();

	saveDates.append('<button class="delete-Btn bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-2 mt-2 ml-10 border border-gray-400 text-[0.875rem] rounded shadow">Click here clear your dates</button>' +
		'</div>');
	// if nothing is within the local storage then dont print any thing
	if (dateFromStorage[0] === null) {
		saveDates.append(' <div class="relative"> ' +
			'<h4 class= " mb-2 mt-5 ml-10" >No Dates Saved</h4>' +
			'</div>'
		);
	}
	else {
		// otherwise we print the values stored within the dateFromStorage object

		for (let i = 0; i < dateFromStorage.length; i++) {

			saveDates.append(' <div class=" content-center relative h-fit"> ' +
				'<a class="group flex flex-wrap h-12 cursor-pointer items-center truncate rounded-[5px] ' +
				'px-10 py-20 text-[1rem] text-gray-700 outline-none transition duration-300 ease-linear hover:bg-blue-400/10 hover:text-blue-600 hover:outline-none' +
				'focus:bg-blue-400/10 focus:text-blue-600 focus:outline-none active:bg-blue-400/10 active:text-blue-600 active:outline-none data-[te-sidenav-state-active]:text-blue-600' +
				'data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10 relative overflow-hidden inline-block align-bottom"' +
				'href="#!" data-te-sidenav-link-ref="" tabindex="0">' +
				'<span ' +
				'class="mr-4 [&amp;>svg]:h-3.5 [&amp;>svg]:w-3.5 [&amp;>svg]:fill-gray-700 [&amp;>svg]:transition [&amp;>svg]:duration-300 [&amp;>svg]:ease-linear group-hover:[&amp;>svg]:fill-blue-600 group-focus:[&amp;>svg]:fill-blue-600' +
				'group-active:[&amp;>svg]:fill-blue-600 group-[te-sidenav-state-active]:[&amp;>svg]:fill-blue-600 motion-reduce:[&amp;>svg]:transition-none dark:[&amp;>svg]:fill-gray-300 dark:group-hover:[&amp;>svg]:fill-gray-300 ">' +
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6">' +
				'<path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"></path>' +
				'<path ' +
				'd="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z">' +
				'</path>' +
				'</svg>' +
				'</span>' +
				'<span>Location:' + ' ' + dateFromStorage[i].loadDateRestaurant +
				'<br>' +
				'On' + ' ' + dateFromStorage[i].date +
				'<br>' +
				"location's website:" + dateFromStorage[i].loadedDateurl + '</span>' +
				'</a>'
			);
		}
	}

	// want to be able to delete dates, maybe they were bad...
	let deleteBtn = $('.delete-Btn');
	deleteBtn.on('click', function () {
		$(this).prev().remove();
		saveDates.remove();
		localStorage.removeItem("newDate");
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

saveBtn.on('click', updatePage);
menuBtn.on('click', openMenu);
xClose.on('click', closeMenu);



