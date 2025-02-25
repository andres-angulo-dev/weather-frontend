import * as popoverHandlers from './popoverHandlers.js';

// Display more details popover
const displayPopoverMoreDetails = (api,) => {
    const buttonWeather = document.querySelectorAll('.button-weather');
    buttonWeather.forEach((buttonWeather, index) => {
        const data = api[index];
        buttonWeather.addEventListener('click', () => {
            const dailyForecasts = data.list.filter((e) => e.dt_txt.includes('12:00:00'));
            updateWeatherDetails({
                currentTemp: Math.round(data.list[0].main.temp),
                currentDescription: data.list[0].weather[0].main,
                cityName: data.city.name,
                country: data.city.country,
                weatherMain: data.list[0].weather[0].main,
                hourly: data.list.slice(1, 4).map(hourlyData => ({
                    time: new Date(hourlyData.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    temp: Math.round(hourlyData.main.temp),
                    rain: hourlyData.pop * 100,
                    wind: hourlyData.wind.speed,
                    weatherMain: hourlyData.weather[0].main,
                })),
                daily: dailyForecasts.map(dailylyData => ({
                    time: new Date(dailylyData.dt_txt).toLocaleTimeString('en-US', { weekday: 'long' }),
                    tempMin: Math.round(dailylyData.main.temp_min),
                    tempMax: Math.round(dailylyData.main.temp_max),
                    rain: dailylyData.pop * 100,
                    wind: dailylyData.wind.speed,
                    weatherMain: dailylyData.weather[0].main,
                })),
                windSpeed: data.list[0].wind.speed,
                humidity: data.list[0].main.humidity,
                pressure: data.list[0].main.pressure,
            });
            popoverHandlers.handleOpenPopoverMoreDetailsClick();
        });
    });
}

// More details forecast
const updateWeatherDetails = (weatherData) => {
	document.getElementById('current-weather').textContent = `
	${weatherData.currentTemp}°,
	${weatherData.currentDescription}`;

	document.getElementById('cityName').textContent= `
	${weatherData.cityName}
	(${weatherData.country})`;
	
	document.getElementById('forecast-content').innerHTML = `<img class="weatherIcon-forecast" src="images/${weatherData.weatherMain}.gif" alt="Weather forecast: ${weatherData.weatherMain}"/>`;	
	
	weatherData.hourly.forEach((hour, index) => {
		if (index < 3 ) {
			document.getElementById(`hourly-${index + 1}-time`).textContent = hour.time;
			document.getElementById(`hourly-${index + 1}-temp`).textContent = `${hour.temp}°C`;
			document.getElementById(`hourly-${index + 1}-rain`).textContent = `${hour.rain.toFixed(2)}% Rain`;
			document.getElementById(`hourly-${index + 1}-wind`).textContent = `${hour.wind.toFixed(2)}km/h Wind`;
			
			const hourlyIconContainer = document.querySelector(`.hourly-right-container-${index + 1}`);
			if (hourlyIconContainer) {
				hourlyIconContainer.innerHTML = `<img id="hourly-${index + 1}-icon" src="images/${hour.weatherMain}.gif" alt="Weather forecast: ${hour.weatherMain}"/>`;
			}
		}
	});
	
	weatherData.daily.forEach((day, index) => {
		if (index < 5 ) {
			document.getElementById(`daily-${index + 1}-time`).textContent = day.time.split(' ')[0],
			document.getElementById(`daily-${index + 1}-temp`).textContent = `${day.tempMin}°C / ${day.tempMax}°C`;
			document.getElementById(`daily-${index + 1}-rain`).textContent = `${day.rain.toFixed(2)}% Rain`;
			document.getElementById(`daily-${index + 1}-wind`).textContent = `${day.wind.toFixed(2)}km/h Wind`;

			const dailyIconContainer = document.getElementById(`daily-${index + 1}-icon`);
			if (dailyIconContainer) {
				// Methode OUTERHTML
				dailyIconContainer.outerHTML = `<img id="daily-${index + 1}-icon" src="images/${day.weatherMain}.gif" alt="Weather forecast: ${day.weatherMain}"/>`;
				// // Methode SRC/ALT
				// dailyIconContainer.src = `images/${day.weatherMain}.gif`;
				// dailyIconContainer.alt = `Weather forecast: ${day.weatherMain}`;
			}

			// // Methode with INNERHTML
			// const dailyIconContainer = document.getElementById(`right-container-${index + 1}`);
			// if (dailyIconContainer) {
			// 	dailyIconContainer.innerHTML = `<img id="daily-${index + 1}-icon" src="images/${day.weatherMain}.gif" alt="Weather forecast: ${day.weatherMain}"/>`;
			// }
		}
	});

	document.getElementById('wind-speed').textContent = `${weatherData.windSpeed} km/h`;
	document.getElementById('humidity').textContent = `${weatherData.humidity}%`;
	document.getElementById('pressure').textContent = `${weatherData.pressure} hPa`;
};

export default displayPopoverMoreDetails;
