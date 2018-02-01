function askLocation() {
	navigator.geolocation.getCurrentPosition(getWeatherData, showLocationSelector);
}

function showLocationSelector() {
	document.getElementById('select').classList.remove('hide');
	var input = document.getElementById('locationInput');
	input.onkeyup = suggestLocations;
}

function hideLocationSelector() {
	document.getElementById('select').classList.add('hide');
}

function getWeatherData(position) {
	var here = {
		lat: +position.coords.latitude.toFixed(2),
		lon: +position.coords.longitude.toFixed(2)
	};
	var APIRequest = new XMLHttpRequest();
	APIRequest.onreadystatechange = function () {
		if(APIRequest.readyState === 4 && APIRequest.status === 200) {
			var data = JSON.parse(APIRequest.responseText);
			showWeather(data);
		}
	};
	APIRequest.open('GET', 'https://fcc-weather-api.glitch.me/api/current?lat=' + here.lat + '&lon=' + here.lon);
	APIRequest.send();
}

function showWeather(data) {
	document.getElementById('weather').classList.remove('hide');
	document.getElementById('icon').className = 'icon loaded ' + data.weather[0].description.replace(/\s/g, '-');
	document.getElementById('temp').innerHTML = Math.round(data.main.temp) + '&deg;';
	document.getElementById('desc').innerText = data.weather[0].description;
	document.getElementById('loc').innerText = ' in ' + data.name;
}

function suggestLocations() {
	var HTML;
	var suggestions;
	var suggestionsUL = document.getElementById('suggestions');
	var inputValue = this.value.toLowerCase();
	if(inputValue === '') {
		suggestionsUL.classList.add('hide');
	} else if(inputValue.length >= 2) {
		suggestionsUL.classList.remove('hide');
		suggestions = cities.filter(function(city) {
				return city.name.toLowerCase().startsWith(inputValue);
		});

		HTML = suggestions.map(
			function(city) {
				return '<li data-lat=\'' + city.lat + 
				'\' data-lon=\'' + city.lon + '\'>' + 
				city.name + ', ' + city.country + '</li>';
			}).join('\n');

		suggestionsUL.innerHTML = HTML;

		document.querySelectorAll('li').forEach(function(li) {
			li.addEventListener('click', function() {
				var lat = li.getAttribute('data-lat');
				var lon = li.getAttribute('data-lon');
				getWeatherData({coords: {latitude: +lat, longitude: +lon}});
			});
		});
	}
}

askLocation();