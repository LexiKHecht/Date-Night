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

$.ajax(settings).done(function (response) {
	console.log(response);
});