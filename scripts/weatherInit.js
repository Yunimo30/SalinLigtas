// Weather Feature Initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeWeatherFeatures();
});

function initializeWeatherFeatures() {
    // Initialize default location
    const defaultLocation = document.getElementById('locationSelect').value;
    
    // Load initial weather data
    updateCurrentConditions();
    updateForecasts();
    
    // Initialize and load data for all sections
    initGraphTabs();
    updateAllGraphs();
    
    initRadarView();
    updateRadarView('radar');
    
    initLocationComparison();
    // Add default location to comparison
    addLocationToComparison(defaultLocation, 
        document.getElementById('locationSelect').options[
            document.getElementById('locationSelect').selectedIndex
        ].text
    );
    
    initHistoricalAnalysis();
    updateHistoricalAnalysis(document.getElementById('analysisTimeframe').value);
    
    initAlertSystem();
    loadInitialAlerts();
    
    // Start periodic updates
    startWeatherUpdates();
}

function initGraphTabs() {
    const tabs = document.querySelectorAll('.graph-tab');
    const graphs = document.querySelectorAll('.graph-content canvas');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Hide all graphs
            graphs.forEach(g => g.style.display = 'none');
            
            // Activate selected tab and show corresponding graph
            tab.classList.add('active');
            const graphId = tab.getAttribute('data-graph');
            document.getElementById(`${graphId}Chart`).style.display = 'block';
            
            // Update the selected graph with latest data
            updateGraph(graphId);
        });
    });
}

function initRadarView() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const radarContainer = document.getElementById('radarContainer');
    const timeline = document.getElementById('radarTimeline');

    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateRadarView(btn.getAttribute('data-view'));
        });
    });

    timeline.addEventListener('input', () => {
        updateRadarTimestamp(timeline.value);
    });
}

function initLocationComparison() {
    const addLocationBtn = document.getElementById('addLocationBtn');
    const locationSelect = document.getElementById('locationSelect');

    addLocationBtn.addEventListener('click', () => {
        const selectedOption = locationSelect.options[locationSelect.selectedIndex];
        addLocationToComparison(selectedOption.value, selectedOption.text);
    });
}

function initHistoricalAnalysis() {
    const timeframeSelect = document.getElementById('analysisTimeframe');
    
    timeframeSelect.addEventListener('change', () => {
        updateHistoricalAnalysis(timeframeSelect.value);
    });
}

function initAlertSystem() {
    const filterBtns = document.querySelectorAll('.alert-filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterAlerts(btn.getAttribute('data-filter'));
        });
    });
}

function updateGraph(graphType) {
    // Sample data - replace with actual API data
    const data = generateSampleData(graphType);
    weatherGraphsManager.updateCharts({
        [graphType]: {
            labels: data.labels,
            values: data.values
        }
    });
}

function updateRadarView(viewType) {
    // Sample implementation - replace with actual radar/satellite API
    const radarContainer = document.getElementById('radarContainer');
    radarContainer.innerHTML = `<div class="loading-overlay">Loading ${viewType} view...</div>`;
    
    // Simulate loading radar/satellite image
    setTimeout(() => {
        radarContainer.innerHTML = `
            <img src="https://example.com/weather/${viewType}.png" 
                 alt="${viewType} view" 
                 style="width: 100%; height: 100%; object-fit: cover;">
        `;
    }, 1000);
}

function updateRadarTimestamp(timeValue) {
    // Convert timeline value to timestamp and update radar view
    const hoursAgo = 12 - timeValue;
    const timestamp = new Date(Date.now() - (hoursAgo * 60 * 60 * 1000));
    // Update radar view with historical data at timestamp
}

function addLocationToComparison(locationId, locationName) {
    // Sample weather data - replace with actual API data
    const weatherData = {
        temperature: Math.round(20 + Math.random() * 15),
        precipitation: Math.round(Math.random() * 100),
        windSpeed: Math.round(5 + Math.random() * 20),
        humidity: Math.round(60 + Math.random() * 30)
    };
    
    weatherComparison.addLocation(locationId, locationName, weatherData);
}

function updateHistoricalAnalysis(timeframe) {
    // Sample historical data - replace with actual API data
    const historicalData = generateHistoricalData(timeframe);
    historicalAnalyzer.loadHistoricalData(
        document.getElementById('locationSelect').value,
        historicalData
    );
}

function filterAlerts(filterType) {
    const alertsContainer = document.getElementById('weatherAlerts');
    const alerts = alertsContainer.getElementsByClassName('alert-item');
    
    Array.from(alerts).forEach(alert => {
        switch(filterType) {
            case 'active':
                alert.style.display = alert.classList.contains('expired') ? 'none' : 'flex';
                break;
            case 'expired':
                alert.style.display = alert.classList.contains('expired') ? 'flex' : 'none';
                break;
            default: // 'all'
                alert.style.display = 'flex';
        }
    });
}

function updateAllGraphs() {
    // Update all graph types
    ['temperature', 'precipitation', 'wind', 'pressure'].forEach(type => {
        updateGraph(type);
    });
    // Show temperature graph by default
    document.querySelector('.graph-tab[data-graph="temperature"]').classList.add('active');
    document.getElementById('temperatureChart').style.display = 'block';
}

function loadInitialAlerts() {
    // Sample initial alerts - replace with actual API data
    const initialAlerts = [
        {
            type: 'Weather Update',
            message: 'Current weather conditions are being monitored',
            severity: 'low',
            duration: 3600000 // 1 hour
        },
        {
            type: 'Rainfall Advisory',
            message: 'Light to moderate rainfall expected in the next 24 hours',
            severity: 'medium',
            duration: 86400000 // 24 hours
        }
    ];

    initialAlerts.forEach(alert => {
        weatherAlertSystem.createAlert(
            alert.type,
            alert.message,
            alert.severity,
            alert.duration
        );
    });

    // Activate "All" filter by default
    document.querySelector('.alert-filter-btn[data-filter="all"]').classList.add('active');
}

function generateSampleData(type) {
    const hours = Array.from({length: 24}, (_, i) => `${i}:00`);
    let values;
    
    switch(type) {
        case 'temperature':
            values = hours.map(() => Math.round(20 + Math.random() * 15));
            break;
        case 'precipitation':
            values = hours.map(() => Math.round(Math.random() * 20));
            break;
        case 'wind':
            values = hours.map(() => Math.round(5 + Math.random() * 25));
            break;
        case 'pressure':
            values = hours.map(() => Math.round(1000 + Math.random() * 30));
            break;
        default:
            values = hours.map(() => 0);
    }
    
    return { labels: hours, values: values };
}

function generateHistoricalData(timeframe) {
    const days = parseInt(timeframe);
    return {
        temperature: Array.from({length: days}, () => Math.round(15 + Math.random() * 20)),
        precipitation: Array.from({length: days}, () => Math.round(Math.random() * 100)),
        humidity: Array.from({length: days}, () => Math.round(40 + Math.random() * 60))
    };
}

function startWeatherUpdates() {
    // Update weather data every 5 minutes
    setInterval(() => {
        updateCurrentConditions();
        updateForecasts();
        checkForNewAlerts();
    }, 5 * 60 * 1000);
}

function updateCurrentConditions() {
    const location = getCurrentLocation();
    
    // Show loading state
    document.getElementById('currentTemp').textContent = '--';
    document.getElementById('currentCondition').textContent = 'Loading...';
    document.getElementById('currentHumidity').textContent = '--';
    document.getElementById('currentWind').textContent = '--';
    document.getElementById('currentVisibility').textContent = '--';

    try {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`)
            .then(response => response.json())
            .then(data => {
                document.getElementById('currentTemp').textContent = Math.round(data.main.temp);
                document.getElementById('currentCondition').textContent = data.weather[0].main;
                document.getElementById('currentHumidity').textContent = `${data.main.humidity}%`;
                document.getElementById('currentWind').textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
                document.getElementById('currentVisibility').textContent = `${(data.visibility / 1000).toFixed(1)} km`;
                updateWeatherIcon(data.weather[0].icon);
                
                // Update impact analysis based on current conditions
                updateImpactAnalysis(data);
            })
            .catch(error => {
                console.error('Error fetching current conditions:', error);
                useBackupWeatherData();
            });
    } catch (error) {
        console.error('Error in updateCurrentConditions:', error);
        useBackupWeatherData();
    }
}

function updateWeatherIcon(iconCode) {
    const iconMap = {
        '01d': 'sun',
        '01n': 'moon',
        '02d': 'cloud-sun',
        '02n': 'cloud-moon',
        '03d': 'cloud',
        '03n': 'cloud',
        '04d': 'clouds',
        '04n': 'clouds',
        '09d': 'cloud-showers-heavy',
        '09n': 'cloud-showers-heavy',
        '10d': 'cloud-sun-rain',
        '10n': 'cloud-moon-rain',
        '11d': 'bolt',
        '11n': 'bolt',
        '13d': 'snowflake',
        '13n': 'snowflake',
        '50d': 'smog',
        '50n': 'smog'
    };
    
    const iconClass = iconMap[iconCode] || 'question';
    document.getElementById('currentIcon').className = `fas fa-${iconClass}`;
}

function updateHourlyForecast(hourlyData) {
    const hourlyContainer = document.getElementById('hourlyForecast');
    hourlyContainer.innerHTML = '';
    
    hourlyData.forEach(hour => {
        const date = new Date(hour.dt_txt);
        const hourDiv = document.createElement('div');
        hourDiv.className = 'forecast-hour';
        hourDiv.innerHTML = `
            <span class="time">${date.getHours()}:00</span>
            <i class="fas fa-${getIconClass(hour.weather[0].icon)}"></i>
            <span class="temp">${Math.round(hour.main.temp)}°C</span>
            <span class="wind">${Math.round(hour.wind.speed * 3.6)} km/h</span>
        `;
        hourlyContainer.appendChild(hourDiv);
    });
}

function updateWeeklyForecast(forecastData) {
    const weeklyContainer = document.getElementById('weeklyForecast');
    weeklyContainer.innerHTML = '';
    
    // Group forecast by day
    const dailyData = groupForecastByDay(forecastData);
    
    Object.entries(dailyData).forEach(([date, dayData]) => {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'forecast-day';
        dayDiv.innerHTML = `
            <span class="date">${formatDate(date)}</span>
            <i class="fas fa-${getIconClass(getMostFrequentIcon(dayData))}"></i>
            <span class="temp-range">
                ${Math.round(getMinTemp(dayData))}°C - ${Math.round(getMaxTemp(dayData))}°C
            </span>
            <span class="precip">${calculateDailyPrecipChance(dayData)}% precip</span>
        `;
        weeklyContainer.appendChild(dayDiv);
    });
}

function groupForecastByDay(forecastData) {
    const dailyData = {};
    forecastData.forEach(forecast => {
        const date = forecast.dt_txt.split(' ')[0];
        if (!dailyData[date]) {
            dailyData[date] = [];
        }
        dailyData[date].push(forecast);
    });
    return dailyData;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function getIconClass(iconCode) {
    const iconMap = {
        '01d': 'sun',
        '01n': 'moon',
        '02d': 'cloud-sun',
        '02n': 'cloud-moon',
        '03d': 'cloud',
        '03n': 'cloud',
        '04d': 'clouds',
        '04n': 'clouds',
        '09d': 'cloud-showers-heavy',
        '09n': 'cloud-showers-heavy',
        '10d': 'cloud-sun-rain',
        '10n': 'cloud-moon-rain',
        '11d': 'bolt',
        '11n': 'bolt',
        '13d': 'snowflake',
        '13n': 'snowflake',
        '50d': 'smog',
        '50n': 'smog'
    };
    return iconMap[iconCode] || 'question';
}

function getMostFrequentIcon(dayData) {
    const iconCounts = {};
    dayData.forEach(forecast => {
        const icon = forecast.weather[0].icon;
        iconCounts[icon] = (iconCounts[icon] || 0) + 1;
    });
    return Object.entries(iconCounts)
        .sort((a, b) => b[1] - a[1])[0][0];
}

function getMinTemp(dayData) {
    return Math.min(...dayData.map(d => d.main.temp));
}

function getMaxTemp(dayData) {
    return Math.max(...dayData.map(d => d.main.temp));
}

function calculateDailyPrecipChance(dayData) {
    const precipForecasts = dayData.filter(d => 
        d.rain && d.rain['3h'] > 0 || 
        d.snow && d.snow['3h'] > 0
    );
    return Math.round((precipForecasts.length / dayData.length) * 100);
}

function updateForecasts() {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${getCurrentLocation()}&appid=${API_KEY}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Forecast API request failed');
            }
            return response.json();
        })
        .then(data => {
            updateHourlyForecast(data.list.slice(0, 24));
            updateWeeklyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching forecasts:', error);
            useBackupForecastData();
        });
}

function checkForNewAlerts() {
    // Check for new weather alerts from API
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${getCurrentLat()}&lon=${getCurrentLon()}&exclude=current,minutely,hourly,daily&appid=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            if (data.alerts) {
                data.alerts.forEach(alert => {
                    weatherAlertSystem.createAlert(
                        alert.event,
                        alert.description,
                        determineAlertSeverity(alert),
                        alert.end * 1000 - Date.now()
                    );
                });
            }
        })
        .catch(error => {
            console.error('Error checking for alerts:', error);
        });
}

function getCurrentLocation() {
    const locationSelect = document.getElementById('locationSelect');
    return locationSelect.value;
}

function getCurrentLat() {
    // Replace with actual coordinates for selected location
    return 14.6042;
}

function getCurrentLon() {
    // Replace with actual coordinates for selected location
    return 120.9822;
}

function useBackupForecastData() {
    const hourlyBackup = Array.from({length: 24}, (_, i) => ({
        dt_txt: new Date(Date.now() + i * 3600000).toISOString(),
        main: {
            temp: 25 + Math.sin(i * Math.PI / 12) * 5,
            humidity: 70 + Math.sin(i * Math.PI / 12) * 10
        },
        weather: [{
            main: 'Clouds',
            icon: '03d'
        }],
        wind: {
            speed: 12 + Math.sin(i * Math.PI / 12) * 3
        }
    }));

    updateHourlyForecast(hourlyBackup);
    updateWeeklyForecast(hourlyBackup);
}

function useBackupWeatherData() {
    // Backup data when API fails
    const backupData = {
        temp: 28,
        condition: 'Partly Cloudy',
        humidity: 75,
        windSpeed: 15,
        visibility: 10,
        icon: 'cloud',
        main: { humidity: 75 },
        wind: { speed: 15 },
        visibility: 10000,
        rain: { '1h': 0 }
    };

    document.getElementById('currentTemp').textContent = backupData.temp;
    document.getElementById('currentCondition').textContent = backupData.condition;
    document.getElementById('currentHumidity').textContent = `${backupData.humidity}%`;
    document.getElementById('currentWind').textContent = `${backupData.windSpeed} km/h`;
    document.getElementById('currentVisibility').textContent = `${backupData.visibility} km`;
    document.getElementById('currentIcon').className = `fas fa-${backupData.icon}`;
    
    // Update impact analysis with backup data
    updateImpactAnalysis(backupData);
}

function updateImpactAnalysis(data) {
    // Update flood risk level
    const precipitation = data.rain ? data.rain['1h'] || 0 : 0;
    const windSpeed = data.wind ? data.wind.speed : 0;
    const visibility = data.visibility ? data.visibility / 1000 : 10;

    // Update flood risk
    const floodRisk = document.getElementById('floodRiskLevel');
    let riskLevel = 'Low';
    if (precipitation > 50 || (precipitation > 30 && data.main.humidity > 85)) {
        riskLevel = 'High';
    } else if (precipitation > 20 || (precipitation > 10 && data.main.humidity > 75)) {
        riskLevel = 'Medium';
    }
    floodRisk.textContent = riskLevel;
    floodRisk.className = `impact-value ${riskLevel.toLowerCase()}`;

    // Update precipitation rate
    document.getElementById('precipitationRate').textContent = 
        `${precipitation.toFixed(1)} mm/hr`;

    // Update storm surge
    const surgePotential = document.getElementById('stormSurge');
    let surgeLevel = 'Low';
    if (windSpeed > 50) {
        surgeLevel = 'High';
    } else if (windSpeed > 30) {
        surgeLevel = 'Medium';
    }
    surgePotential.textContent = surgeLevel;
    surgePotential.className = `impact-value ${surgeLevel.toLowerCase()}`;

    // Update visibility status
    const visibilityStatus = document.getElementById('visibilityStatus');
    let visibilityLevel = 'Good';
    if (visibility < 2) {
        visibilityLevel = 'Poor';
    } else if (visibility < 5) {
        visibilityLevel = 'Moderate';
    }
    visibilityStatus.textContent = visibilityLevel;
    visibilityStatus.className = `impact-value ${
        visibilityLevel === 'Good' ? 'low' : 
        visibilityLevel === 'Moderate' ? 'medium' : 'high'
    }`;

    // Update wind advisory
    const windAdvisory = document.getElementById('windAdvisory');
    let windLevel = 'Normal';
    if (windSpeed > 50) {
        windLevel = 'Severe';
    } else if (windSpeed > 30) {
        windLevel = 'Advisory';
    }
    windAdvisory.textContent = windLevel;
    windAdvisory.className = `impact-value ${
        windLevel === 'Normal' ? 'low' :
        windLevel === 'Advisory' ? 'medium' : 'high'
    }`;
}

function determineAlertSeverity(alert) {
    // Determine severity based on alert type and description
    const severityKeywords = {
        high: ['severe', 'extreme', 'danger', 'warning'],
        medium: ['watch', 'advisory', 'caution'],
        low: ['statement', 'outlook', 'notice']
    };

    const alertText = (alert.event + ' ' + alert.description).toLowerCase();
    
    if (severityKeywords.high.some(keyword => alertText.includes(keyword))) {
        return 'high';
    } else if (severityKeywords.medium.some(keyword => alertText.includes(keyword))) {
        return 'medium';
    }
    return 'low';
}

// Initialize weather features when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWeatherFeatures);
} else {
    initializeWeatherFeatures();
}