// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Mobile menu toggle functionality
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navLinks.style.display = 'none';
        }
    });
});

// Update navbar style on scroll
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(26, 26, 26, 0.9)';
        navbar.style.padding = '0.5rem 0';
    } else {
        navbar.style.background = 'var(--gray)';
        navbar.style.padding = '1rem 0';
    }
});

// Responsive adjustments
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navLinks.style.display = 'flex';
    } else {
        navLinks.style.display = 'none';
    }
});

// Weather API integration
const apiKey = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
const currentConditionsDiv = document.getElementById('current-conditions');
const forecastDataDiv = document.getElementById('forecast-data');
const locationInput = document.getElementById('location-input');
const getWeatherButton = document.getElementById('get-weather');
const useLocationButton = document.getElementById('use-location');

getWeatherButton.addEventListener('click', () => {
    const location = locationInput.value.trim();
    if (!location) {
        alert('Please enter a location.');
        return;
    }
    fetchWeatherData(location);
});

useLocationButton.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherDataByCoords(latitude, longitude);
        }, error => {
            alert('Unable to retrieve your location.');
        });
    } else {
        alert('Geolocation is not supported by your browser.');
    }
});

function fetchWeatherData(location) {
    if (apiKey === 'YOUR_API_KEY') {
        alert('Please replace the placeholder API key with your actual OpenWeatherMap API key.');
        return;
    }
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

    console.log('Fetching current weather from:', currentWeatherUrl);
    fetch(currentWeatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok for current weather');
            }
            return response.json();
        })
        .then(data => {
            console.log('Current weather data:', data);
            displayCurrentWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather:', error);
            currentConditionsDiv.innerHTML = `<p class="error">Error fetching current weather data. Please try again.</p>`;
        });

    console.log('Fetching forecast from:', forecastUrl);
    fetch(forecastUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok for forecast');
            }
            return response.json();
        })
        .then(data => {
            console.log('Forecast data:', data);
            displayForecast(data);
        })
        .catch(error => {
            console.error('Error fetching forecast:', error);
            forecastDataDiv.innerHTML = `<p class="error">Error fetching forecast data. Please try again.</p>`;
        });
}

function fetchWeatherDataByCoords(lat, lon) {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather:', error);
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayForecast(data);
        })
        .catch(error => {
            console.error('Error fetching forecast:', error);
        });
}

function displayCurrentWeather(data) {
    if (data.cod && data.cod !== 200) {
        currentConditionsDiv.innerHTML = `<p class="error">Error: ${data.message}</p>`;
        return;
    }
    const { main, weather, name, wind } = data;
    currentConditionsDiv.innerHTML = `
        <h3>${name}</h3>
        <p>Temperature: ${main.temp} °C</p>
        <p>Conditions: ${weather[0].description}</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>Wind Speed: ${wind.speed} m/s</p>
    `;
}

function displayForecast(data) {
    if (data.cod && data.cod !== "200") {
        forecastDataDiv.innerHTML = `<p class="error">Error: ${data.message}</p>`;
        return;
    }
    forecastDataDiv.innerHTML = '';
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        const { main, weather } = item;
        forecastDataDiv.innerHTML += `
            <div class="forecast-card">
                <h4>${date}</h4>
                <p>Temperature: ${main.temp} °C</p>
                <p>Conditions: ${weather[0].description}</p>
            </div>
        `;
    });
}
