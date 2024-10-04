const apiKey = 'c6a1e5024c3795d79ba24b990e115589'; // Replace with your OpenWeather API key
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeatherDiv = document.getElementById('current-weather');
const forecastDiv = document.getElementById('forecast');
const searchHistoryList = document.getElementById('search-history');

searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const city = cityInput.value;
    getWeatherData(city);
    saveToSearchHistory(city);
});

function getWeatherData(city) {
    const geoUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    fetch(geoUrl)
        .then(response => response.json())
        .then(data => {
            const { lat, lon } = data.coord;
            getForecast(lat, lon, city);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function getForecast(lat, lon, city) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data.list[0], city);
            displayForecast(data.list);
        })
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
    forecastData.forEach((data, index) => {
        if (index % 8 === 0) { // Get forecast for every 8 hours
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
};

// Add city to search history
const addToSearchHistory = (city) => {
    let history = JSON.parse(localStorage.getItem('search-history')) || [];
    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem('search-history', JSON.stringify(history));
        const li = document.createElement('li');
        li.textContent = city;
        li.addEventListener('click', () => fetchWeather(city));
        searchHistoryList.appendChild(li);
    }
};

// Event listener for the search button
searchButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
        cityInput.value = ''; // Clear the input field
    }
});


// Load search history on page load
window.onload = loadSearchHistory;
console.log(loadSearchHistory);