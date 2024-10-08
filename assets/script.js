const apiKey = 'c6a1e5024c3795d79ba24b990e115589'; 
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeatherDiv = document.getElementById('current-weather');
const forecastDiv = document.getElementById('forecast');
const searchHistoryList = document.getElementById('search-history');

function getWeatherData(city) {
    const geoUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    return fetch(geoUrl) 
        .then(response => response.json())
        .then(data => {
            const { lat, lon } = data.coord;
            return { lat, lon, city }; 
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function getForecast(lat, lon) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    return fetch(forecastUrl) 
        .then(response => response.json())
        .catch(error => console.error('Error fetching forecast data:', error));
}

function displayCurrentWeather(weatherData, city) {
    const { main, wind, weather } = weatherData;
    currentWeatherDiv.innerHTML = `
        <h2>Current Weather in ${city}</h2>
        <p>Temperature: ${main.temp}°K</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>Wind Speed: ${wind.speed} m/s</p>
        <img src="http://openweathermap.org/img/wn/${weather[0].icon}.png" alt="${weather[0].description}">
    `;
}

function displayForecast(forecastData) {
    forecastDiv.innerHTML = '<h2>5-Day Forecast</h2>';
    forecastData.list.forEach((data, index) => {
        if (index % 8 === 0) { 
            const { main, wind, weather, dt } = data;
            const date = new Date(dt * 1000).toLocaleDateString();
            forecastDiv.innerHTML += `
                <div>
                    <h3>${date}</h3>
                    <p>Temperature: ${main.temp}°K</p>
                    <p>Humidity: ${main.humidity}%</p>
                    <p>Wind Speed: ${wind.speed} m/s</p>
                    <img src="http://openweathermap.org/img/wn/${weather[0].icon}.png" alt="${weather[0].description}">
                </div>
            `;
        }
    });
}

function addToSearchHistory(city = null) {
    let history = JSON.parse(localStorage.getItem('search-history')) || [];

    if (city && !history.includes(city)) {
        history.push(city);
        localStorage.setItem('search-history', JSON.stringify(history));
    }

    searchHistoryList.innerHTML = '';

    history.forEach(storedCity => {
        const li = document.createElement('li');
        li.textContent = storedCity;
        li.addEventListener('click', () => {
            getWeatherData(storedCity).then(({ lat, lon }) => {
                getForecast(lat, lon).then(data => {
                    displayCurrentWeather(data.list[0], storedCity);
                    displayForecast(data);
                });
            });
        });
        searchHistoryList.appendChild(li);
    });
}


searchForm.addEventListener('submit', (event) => {
    event.preventDefault(); 
    const storedCity = cityInput.value.trim();
    if (storedCity) {
        getWeatherData(storedCity)
            .then(({ lat, lon }) => getForecast(lat, lon))
            .then(data => {
                displayCurrentWeather(data.list[0], storedCity);
                displayForecast(data);
                addToSearchHistory(storedCity); 
            })
            .catch(error => alert(error.message));
        cityInput.value = ''; 
    }
});

window.onload = () => {
    addToSearchHistory(); 
};













