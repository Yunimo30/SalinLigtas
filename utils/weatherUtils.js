// Weather utilities for script.js
import { weatherService } from './services/weatherService.js';
import { floodModel } from './models/floodPredictionModel.js';

// Update these functions in your script.js
async function updateWeatherData() {
    const campus = campuses.find(c => c.id === campusSelect.value);
    if (!campus) return;

    try {
        const currentWeather = await weatherService.getCurrentWeather(campus.coords[0], campus.coords[1]);
        const forecast = await weatherService.getHourlyForecast(campus.coords[0], campus.coords[1]);
        
        // Update current weather display
        document.getElementById('currentTemp').textContent = `${currentWeather.temperature}°C`;
        document.getElementById('currentWind').textContent = `${currentWeather.windSpeed} km/h`;
        document.getElementById('precipitationRate').textContent = `${currentWeather.rain} mm/hr`;
        
        // Update hourly forecast
        const hourlyForecast = document.getElementById('hourlyForecast');
        hourlyForecast.innerHTML = '';
        
        forecast.time.slice(0, 24).forEach((time, i) => {
            const hour = new Date(time).getHours();
            const rain = forecast.rain[i];
            const temp = forecast.temperature[i];
            
            hourlyForecast.innerHTML += `
                <div class="forecast-item">
                    <div class="forecast-hour">${hour}:00</div>
                    <div class="forecast-temp">${temp}°C</div>
                    <div class="forecast-rain">${rain} mm</div>
                </div>
            `;
        });
        
        // Update alerts based on weather conditions
        updateWeatherAlerts(currentWeather, forecast);
        
        // Trigger simulation update with new weather data
        await runSimulation();
        
    } catch (error) {
        console.error('Error updating weather data:', error);
    }
}

// Add this function to handle weather-based alerts
function updateWeatherAlerts(currentWeather, forecast) {
    const alertsContainer = document.getElementById('weatherAlerts');
    alertsContainer.innerHTML = '';
    
    // Check current conditions
    if (currentWeather.rain > 25) {
        addAlert('Heavy Rain Warning', 'Heavy rainfall occurring. Monitor flood conditions.', 'warning');
    }
    
    // Check forecast for next 6 hours
    const nextSixHours = forecast.rain.slice(0, 6);
    const maxRain = Math.max(...nextSixHours);
    
    if (maxRain > 30) {
        addAlert('Severe Weather Alert', 'Heavy rainfall expected in the next 6 hours.', 'severe');
    }
    
    // Check wind conditions
    if (currentWeather.windSpeed > 30) {
        addAlert('Strong Winds', 'Strong winds may affect evacuation routes.', 'caution');
    }
}

function addAlert(title, message, type) {
    const alertsContainer = document.getElementById('weatherAlerts');
    alertsContainer.innerHTML += `
        <div class="alert-item ${type}">
            <i class="fas fa-exclamation-circle"></i>
            <div class="alert-content">
                <strong>${title}</strong>
                <p>${message}</p>
            </div>
        </div>
    `;
}

// Add auto-refresh for weather data
setInterval(updateWeatherData, 300000); // Update every 5 minutes