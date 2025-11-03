// Weather Bulletin Enhancements

// Weather Alert System
class WeatherAlertSystem {
    constructor() {
        this.severityLevels = {
            low: { color: '#22c55e', icon: 'info-circle' },
            medium: { color: '#fbbf24', icon: 'exclamation-circle' },
            high: { color: '#ef4444', icon: 'exclamation-triangle' }
        };
        this.activeAlerts = new Map();
    }

    createAlert(type, message, severity = 'medium', duration = null) {
        const alertId = Date.now();
        const alert = {
            id: alertId,
            type,
            message,
            severity,
            timestamp: new Date(),
            expiresAt: duration ? new Date(Date.now() + duration) : null
        };
        this.activeAlerts.set(alertId, alert);
        this.displayAlert(alert);
        return alertId;
    }

    displayAlert(alert) {
        const alertsContainer = document.getElementById('weatherAlerts');
        const alertElement = document.createElement('div');
        const severity = this.severityLevels[alert.severity];

        alertElement.className = `alert-item ${alert.severity}`;
        alertElement.id = `alert-${alert.id}`;
        alertElement.innerHTML = `
            <i class="fas fa-${severity.icon}"></i>
            <div class="alert-content">
                <strong>${alert.type}</strong>
                <p>${alert.message}</p>
                <small>${this.getTimeAgo(alert.timestamp)}</small>
            </div>
        `;

        if (alertsContainer.firstChild) {
            alertsContainer.insertBefore(alertElement, alertsContainer.firstChild);
        } else {
            alertsContainer.appendChild(alertElement);
        }
    }

    getTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
            }
        }
        return 'Just now';
    }

    removeAlert(alertId) {
        const alertElement = document.getElementById(`alert-${alertId}`);
        if (alertElement) {
            alertElement.remove();
        }
        this.activeAlerts.delete(alertId);
    }

    clearExpiredAlerts() {
        const now = new Date();
        for (const [alertId, alert] of this.activeAlerts.entries()) {
            if (alert.expiresAt && now > alert.expiresAt) {
                this.removeAlert(alertId);
            }
        }
    }
}

// Weather Graphs and Charts Manager
class WeatherGraphsManager {
    constructor() {
        this.charts = new Map();
    }

    generateSampleData(type) {
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

    initializeCharts() {
        this.createTemperatureChart();
        this.createPrecipitationChart();
        this.createWindChart();
        this.createPressureChart();
    }

    createTemperatureChart() {
        const ctx = document.getElementById('temperatureChart').getContext('2d');
        this.charts.set('temperature', new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Temperature (°C)',
                    data: [],
                    borderColor: '#ef4444',
                    fill: false,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        }));
    }

    createPrecipitationChart() {
        const ctx = document.getElementById('precipitationChart').getContext('2d');
        this.charts.set('precipitation', new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Precipitation (mm)',
                    data: [],
                    backgroundColor: '#3b82f6',
                    borderColor: '#2563eb',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        }));
    }

    createWindChart() {
        const ctx = document.getElementById('windChart').getContext('2d');
        this.charts.set('wind', new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Wind Speed (km/h)',
                    data: [],
                    borderColor: '#22c55e',
                    fill: false,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        }));
    }

    createPressureChart() {
        const ctx = document.getElementById('pressureChart').getContext('2d');
        this.charts.set('pressure', new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Pressure (hPa)',
                    data: [],
                    borderColor: '#8b5cf6',
                    fill: false,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        }));
    }

    updateCharts(data) {
        const charts = this.charts;

        // Update temperature chart
        if (data.temperature && charts.has('temperature')) {
            const tempChart = charts.get('temperature');
            tempChart.data.labels = data.temperature.labels;
            tempChart.data.datasets[0].data = data.temperature.values;
            tempChart.update();
        }

        // Update precipitation chart
        if (data.precipitation && charts.has('precipitation')) {
            const precipChart = charts.get('precipitation');
            precipChart.data.labels = data.precipitation.labels;
            precipChart.data.datasets[0].data = data.precipitation.values;
            precipChart.update();
        }

        // Update wind chart
        if (data.wind && charts.has('wind')) {
            const windChart = charts.get('wind');
            windChart.data.labels = data.wind.labels;
            windChart.data.datasets[0].data = data.wind.values;
            windChart.update();
        }

        // Update pressure chart
        if (data.pressure && charts.has('pressure')) {
            const pressureChart = charts.get('pressure');
            pressureChart.data.labels = data.pressure.labels;
            pressureChart.data.datasets[0].data = data.pressure.values;
            pressureChart.update();
        }
    }
}

// Location Weather Comparison
class WeatherComparison {
    constructor() {
        this.locations = new Map();
    }

    addLocation(locationId, name, data) {
        this.locations.set(locationId, {
            name,
            data
        });
        this.updateComparisonDisplay();
    }

    removeLocation(locationId) {
        this.locations.delete(locationId);
        this.updateComparisonDisplay();
    }

    updateComparisonDisplay() {
        const container = document.getElementById('weatherComparison');
        if (!container) return;

        let html = '<div class="comparison-grid">';
        for (const [id, location] of this.locations.entries()) {
            html += `
                <div class="comparison-card">
                    <div class="comparison-header">
                        <h4>${location.name}</h4>
                        <button onclick="weatherComparison.removeLocation('${id}')" class="remove-btn">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="comparison-details">
                        <div class="detail-item">
                            <span class="label">Temperature</span>
                            <span class="value">${location.data.temperature}°C</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Precipitation</span>
                            <span class="value">${location.data.precipitation} mm</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Wind Speed</span>
                            <span class="value">${location.data.windSpeed} km/h</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Humidity</span>
                            <span class="value">${location.data.humidity}%</span>
                        </div>
                    </div>
                </div>
            `;
        }
        html += '</div>';
        container.innerHTML = html;
    }
}

// Historical Data Analysis
class HistoricalDataAnalyzer {
    constructor() {
        this.data = new Map();
    }

    loadHistoricalData(location, data) {
        this.data.set(location, data);
        this.analyzeData(location);
    }

    analyzeData(location) {
        const data = this.data.get(location);
        if (!data) return null;

        const analysis = {
            averages: this.calculateAverages(data),
            trends: this.calculateTrends(data),
            patterns: this.identifyPatterns(data),
            extremes: this.findExtremes(data)
        };

        this.displayAnalysis(location, analysis);
        return analysis;
    }

    calculateAverages(data) {
        return {
            temperature: data.temperature.reduce((a, b) => a + b) / data.temperature.length,
            precipitation: data.precipitation.reduce((a, b) => a + b) / data.precipitation.length,
            humidity: data.humidity.reduce((a, b) => a + b) / data.humidity.length
        };
    }

    calculateTrends(data) {
        // Simple linear regression for temperature trend
        const n = data.temperature.length;
        const xValues = Array.from({length: n}, (_, i) => i);
        const sumX = xValues.reduce((a, b) => a + b);
        const sumY = data.temperature.reduce((a, b) => a + b);
        const sumXY = xValues.reduce((sum, x, i) => sum + x * data.temperature[i], 0);
        const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        return {
            temperature: slope > 0 ? 'increasing' : slope < 0 ? 'decreasing' : 'stable'
        };
    }

    identifyPatterns(data) {
        // Identify seasonal patterns
        const patterns = {
            seasonal: false,
            cyclic: false,
            extreme: false
        };

        // Check for seasonal pattern (simplified)
        const seasonalCheck = this.checkSeasonalPattern(data.temperature);
        patterns.seasonal = seasonalCheck.isPresent;

        return patterns;
    }

    checkSeasonalPattern(data) {
        // Simplified seasonal pattern detection
        const quarterSize = Math.floor(data.length / 4);
        const quarters = [
            data.slice(0, quarterSize),
            data.slice(quarterSize, quarterSize * 2),
            data.slice(quarterSize * 2, quarterSize * 3),
            data.slice(quarterSize * 3)
        ];

        const quarterAverages = quarters.map(q => 
            q.reduce((a, b) => a + b) / q.length
        );

        const maxDiff = Math.max(...quarterAverages) - Math.min(...quarterAverages);
        return {
            isPresent: maxDiff > 5, // Threshold for seasonal variation
            variation: maxDiff
        };
    }

    findExtremes(data) {
        return {
            temperature: {
                max: Math.max(...data.temperature),
                min: Math.min(...data.temperature)
            },
            precipitation: {
                max: Math.max(...data.precipitation)
            }
        };
    }

    displayAnalysis(location, analysis) {
        const container = document.getElementById('historicalAnalysis');
        if (!container) return;

        container.innerHTML = `
            <div class="analysis-card">
                <h3>Historical Analysis - ${location}</h3>
                <div class="analysis-section">
                    <h4>Averages</h4>
                    <p>Temperature: ${analysis.averages.temperature.toFixed(1)}°C</p>
                    <p>Precipitation: ${analysis.averages.precipitation.toFixed(1)}mm</p>
                    <p>Humidity: ${analysis.averages.humidity.toFixed(1)}%</p>
                </div>
                <div class="analysis-section">
                    <h4>Trends</h4>
                    <p>Temperature: ${analysis.trends.temperature}</p>
                </div>
                <div class="analysis-section">
                    <h4>Patterns</h4>
                    <p>Seasonal Variation: ${analysis.patterns.seasonal ? 'Present' : 'Not significant'}</p>
                    <p>Cyclic Pattern: ${analysis.patterns.cyclic ? 'Present' : 'Not detected'}</p>
                </div>
                <div class="analysis-section">
                    <h4>Extremes</h4>
                    <p>Highest Temperature: ${analysis.extremes.temperature.max}°C</p>
                    <p>Lowest Temperature: ${analysis.extremes.temperature.min}°C</p>
                    <p>Maximum Rainfall: ${analysis.extremes.precipitation.max}mm</p>
                </div>
            </div>
        `;
    }
}

// Initialize weather bulletin components
const weatherAlertSystem = new WeatherAlertSystem();
const weatherGraphsManager = new WeatherGraphsManager();
const weatherComparison = new WeatherComparison();
const historicalAnalyzer = new HistoricalDataAnalyzer();

function updateHourlyForecast(hourlyData) {
    const hourlyContainer = document.getElementById('hourlyForecast');
    if (!hourlyContainer) return;

    // Clear current content
    hourlyContainer.innerHTML = '';

    // Add header row
    const headerRow = document.createElement('div');
    headerRow.className = 'forecast-row header';
    headerRow.innerHTML = `
        <span class="time">Time</span>
        <span class="condition">Condition</span>
        <span class="temp">Temp</span>
        <span class="precip">Rain</span>
        <span class="wind">Wind</span>
    `;
    hourlyContainer.appendChild(headerRow);

    // Add forecast rows
    hourlyData.forEach(hour => {
        const date = new Date(hour.dt_txt);
        const hourRow = document.createElement('div');
        hourRow.className = 'forecast-row';
        hourRow.innerHTML = `
            <span class="time">${date.getHours()}:00</span>
            <span class="condition">
                <i class="fas fa-${getIconClass(hour.weather[0].icon)}"></i>
                ${hour.weather[0].main}
            </span>
            <span class="temp">${Math.round(hour.main.temp)}°C</span>
            <span class="precip">${hour.rain ? Math.round(hour.rain['3h']) : 0}mm</span>
            <span class="wind">${Math.round(hour.wind.speed * 3.6)} km/h</span>
        `;
        hourlyContainer.appendChild(hourRow);
    });
}

function updateWeeklyForecast(forecastData) {
    const weeklyContainer = document.getElementById('weeklyForecast');
    if (!weeklyContainer) return;
    
    // Clear current content
    weeklyContainer.innerHTML = '';
    
    // Add header row
    const headerRow = document.createElement('div');
    headerRow.className = 'forecast-row header';
    headerRow.innerHTML = `
        <span class="date">Date</span>
        <span class="condition">Condition</span>
        <span class="temp-range">Temperature</span>
        <span class="precip">Rain Chance</span>
        <span class="wind">Wind</span>
    `;
    weeklyContainer.appendChild(headerRow);

    const dailyData = groupForecastByDay(forecastData);
    
    Object.entries(dailyData).forEach(([date, dayData]) => {
        const dayRow = document.createElement('div');
        dayRow.className = 'forecast-row';
        dayRow.innerHTML = `
            <span class="date">${formatDate(date)}</span>
            <span class="condition">
                <i class="fas fa-${getIconClass(getMostFrequentIcon(dayData))}"></i>
                ${getMostFrequentCondition(dayData)}
            </span>
            <span class="temp-range">
                ${Math.round(getMinTemp(dayData))}° - ${Math.round(getMaxTemp(dayData))}°C
            </span>
            <span class="precip">${calculateDailyPrecipChance(dayData)}%</span>
            <span class="wind">${Math.round(getAvgWindSpeed(dayData) * 3.6)} km/h</span>
        `;
        weeklyContainer.appendChild(dayRow);
    });
}

// Initialize radar/satellite view
function initRadarView() {
    const viewBtns = document.querySelectorAll('.view-btn');
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

function updateRadarView(viewType) {
    const radarContainer = document.getElementById('radarContainer');
    radarContainer.innerHTML = `<div class="loading-overlay">Loading ${viewType} view...</div>`;
    
    // In a real implementation, you would fetch the actual radar/satellite image
    // For now, we'll simulate it with a colored div
    setTimeout(() => {
        const gradient = viewType === 'radar' ? 
            'linear-gradient(45deg, #0284c7 0%, #1e40af 100%)' :
            viewType === 'satellite' ?
            'linear-gradient(45deg, #4b5563 0%, #1f2937 100%)' :
            'linear-gradient(45deg, #0284c7 0%, #1f2937 100%)';
            
        radarContainer.innerHTML = `
            <div style="width: 100%; height: 100%; background: ${gradient}; border-radius: 8px;">
                <div style="padding: 20px; color: white; text-align: center;">
                    <h4 style="margin: 0;">Sample ${viewType.charAt(0).toUpperCase() + viewType.slice(1)} View</h4>
                    <p style="margin: 10px 0;">Demonstrating weather patterns for Manila region</p>
                </div>
            </div>
        `;
    }, 1000);
}

function updateRadarTimestamp(value) {
    const hoursAgo = 12 - value;
    const timestamp = new Date(Date.now() - (hoursAgo * 60 * 60 * 1000));
    const timeStr = timestamp.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    // Update radar view with historical data
    updateRadarView(document.querySelector('.view-btn.active').getAttribute('data-view'));
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize weather graphs
    weatherGraphsManager.initializeCharts();
    
    // Initialize radar view
    initRadarView();
    
    // Try to fetch real data first
    fetchWeatherData()
        .catch(error => {
            console.warn('Unable to fetch real weather data, using sample data:', error);
            // Generate sample data for initial display
            const sampleData = {
                temperature: weatherGraphsManager.generateSampleData('temperature'),
                precipitation: weatherGraphsManager.generateSampleData('precipitation'),
                wind: weatherGraphsManager.generateSampleData('wind'),
                pressure: weatherGraphsManager.generateSampleData('pressure')
            };
            weatherGraphsManager.updateCharts(sampleData);
            
            // Update disclaimers to indicate sample data is being used
            document.querySelectorAll('.data-source-disclaimer').forEach(disclaimer => {
                disclaimer.style.background = '#ffe6e6';
                disclaimer.style.borderColor = '#ff8080';
                disclaimer.querySelector('span').innerHTML = 
                    disclaimer.querySelector('span').innerHTML.replace(
                        'Data Source:',
                        '<strong>NOTE: Currently showing sample data.</strong> Data Source:'
                    );
            });
        });
    
    // Add some sample locations for comparison
    weatherComparison.addLocation('manila', 'Manila', {
        temperature: 32,
        precipitation: 0,
        windSpeed: 15,
        humidity: 75
    });
    
    weatherComparison.addLocation('quezon', 'Quezon City', {
        temperature: 30,
        precipitation: 2.5,
        windSpeed: 12,
        humidity: 80
    });
    
    // Load sample historical data
    const sampleHistoricalData = {
        temperature: Array.from({length: 30}, () => 20 + Math.random() * 15),
        precipitation: Array.from({length: 30}, () => Math.random() * 50),
        humidity: Array.from({length: 30}, () => 60 + Math.random() * 30)
    };
    historicalAnalyzer.loadHistoricalData('Manila', sampleHistoricalData);
    
    // Set up tab functionality for graphs
    const graphTabs = document.querySelectorAll('.graph-tab');
    const graphCanvases = document.querySelectorAll('.graph-content canvas');
    
    graphTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            graphTabs.forEach(t => t.classList.remove('active'));
            graphCanvases.forEach(c => c.style.display = 'none');
            
            tab.classList.add('active');
            const graphType = tab.getAttribute('data-graph');
            document.getElementById(`${graphType}Chart`).style.display = 'block';
        });
    });
});

// Set up periodic updates
setInterval(() => {
    // Update current conditions
    weatherAlertSystem.clearExpiredAlerts();
    
    // Update graphs with new data
    const newData = {
        temperature: weatherGraphsManager.generateSampleData('temperature'),
        precipitation: weatherGraphsManager.generateSampleData('precipitation'),
        wind: weatherGraphsManager.generateSampleData('wind'),
        pressure: weatherGraphsManager.generateSampleData('pressure')
    };
    weatherGraphsManager.updateCharts(newData);
    
    // Update radar view
    const activeView = document.querySelector('.view-btn.active');
    if (activeView) {
        updateRadarView(activeView.getAttribute('data-view'));
    }
}, 300000); // Update every 5 minutes