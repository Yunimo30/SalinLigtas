# SalinLigtas: Campus Flood Monitoring & Response System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-green.svg)](https://leafletjs.com/)

A comprehensive predictive flood simulation and monitoring system designed for Philippine universities and campuses. SalinLigtas integrates real-time weather data, historical flood patterns, and advanced modeling to help educational institutions anticipate flooding, plan evacuations, and make informed suspension decisions.

##  Quick Links
- [Live Demo](https://yunimo30.github.io/SalinLigtas) (WIP)
- [Documentation](#-documentation)
- [Feature Requests](https://github.com/Yunimo30/Campus-Flood-Simulator/issues)
- [Report Bug](https://github.com/Yunimo30/Campus-Flood-Simulator/issues)

## 🌟 Overview

SalinLigtas (Filipino for "Safe and Secure") is a web-based application that provides:

- **Real-time Flood Prediction**: Uses Open-Meteo API for live weather data integration
- **Interactive Campus Maps**: Visual flood risk assessment with Leaflet.js mapping
- **Emergency Response Hub**: Comprehensive emergency contacts and evacuation planning
- **Weather Bulletin**: 24/7 weather monitoring with alerts and forecasts
- **Community Reporting**: Incident reporting and status tracking system
- **Coordinate Validation**: Automated validation of campus location data

The system currently supports 5 major Philippine campuses: De La Salle University (DLSU), University of Santo Tomas (UST), Mapúa University (Intramuros and Makati), and University of the Philippines Diliman (UPD).

## ✨ Key Features

### 🗺️ Plan & Monitor
- **Campus Selection**: Choose from 5 pre-configured university campuses
- **Rainfall Simulation**: Input custom rainfall intensity, duration, and patterns
- **Real-time Weather Integration**: Fetch live weather data or use mock scenarios
- **Interactive Results**: Visual flood maps with risk levels and safe routes
- **Historical Analysis**: Compare current predictions with past flood events

### 🌤️ Weather Bulletin
- **Current Conditions**: Real-time temperature, humidity, wind, and precipitation
- **24-Hour Forecast**: Hourly weather predictions with rain intensity
- **Weather Alerts**: Automated alerts for severe weather conditions
- **Historical Trends**: Past weather patterns and flood correlations
- **Multi-Location Comparison**: Weather data across Philippine cities

### 🚨 Emergency Hub
- **Emergency Hotlines**: National and local emergency contact numbers
- **Evacuation Routes**: Campus-specific safe evacuation paths
- **Emergency Procedures**: Step-by-step response guidelines
- **Resource Tracking**: Available evacuation centers and supplies
- **Emergency Kit Checklist**: Preparedness planning tools

### 📢 Report Issues
- **Incident Reporting**: Community-submitted flood reports and safety concerns
- **Photo Evidence**: Image upload support for incident documentation
- **Status Tracking**: Real-time updates on reported issues
- **Interactive Map**: Location-based incident mapping

### 🔍 Coordinate Validation
- **Automated Validation**: Geocoding service integration for location verification
- **Batch Processing**: Validate entire campus coordinates at once
- **Update Recommendations**: Suggested coordinate corrections
- **Validation Reports**: Detailed accuracy assessments

## 🛠️ Tech Stack

### Frontend
- **HTML5/CSS3**: Responsive web design with custom styling
- **JavaScript (ES6+)**: Modular architecture with async/await
- **Leaflet.js**: Interactive mapping and visualization
- **Chart.js**: Data visualization for weather and flood analytics

### Backend Services
- **Open-Meteo API**: Real-time weather data and forecasts
- **Geocoding Service**: Location validation and coordinate correction
- **Python HTTP Server**: Local development server

### Dependencies
```json
{
  "leaflet": "^1.9.4",
  "chart.js": "^4.4.0"
}
```

## 📊 Computations & Algorithms

### Flood Prediction Model

The system uses a multi-factor flood prediction algorithm:

#### Base Risk Calculation
```
Flood Risk = Street Sensitivity × Rainfall Intensity × Scaling Factor (0.7)
```

#### Weather Factors
```
Weather Multiplier = Rain Intensity Factor × Humidity Factor × Wind Factor

Rain Intensity Factor = 1 + (rain_mm/hr ÷ 10)
Humidity Factor = 1 + ((humidity - 60) ÷ 100)
Wind Factor = max(1, wind_speed_kmh ÷ 20)
```

#### Soil & Drainage Factors
```
Soil Saturation Factor = 1 + (recent_rainfall_mm ÷ 100) × soil_saturation
Drainage Load = 1 + (future_rainfall_mm ÷ 50) × (1 - drainage_capacity)
```

#### Final Risk Assessment
```
Total Risk = Base Risk × Weather Multiplier × Soil Saturation Factor × Drainage Load
Capped at MAX_HEIGHT_CM (150cm)
```

### Data Sources
- **Historical Flood Data**: Past flood events with rainfall and flood height correlations
- **Street Parameters**: Sensitivity values based on elevation, soil type, and drainage capacity
- **Real-time Weather**: Open-Meteo API integration for current conditions and forecasts
- **Geospatial Data**: Campus coordinates, street paths, and safe zone locations

## 🚀 Installation & Setup

### Prerequisites
- Node.js (for package management)
- Python 3.x (for local server)
- Modern web browser with JavaScript enabled

### Quick Start
1. **Clone the repository**
   ```bash
   git clone https://github.com/Yunimo30/SalinLigtas.git
   cd SalinLigtas
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   python -m http.server 8000
   ```

4. **Open in browser**
   ```
   http://localhost:8000
   ```

### Project Structure
```
SalinLigtas/
├── index.html              # Main application
├── style.css               # Global styles
├── main.js                 # Application entry point
├── data.js                 # Campus and emergency data
├── validation.js           # Coordinate validation logic
├── styles/
│   ├── validation.css      # Validation modal styles
│   └── weatherForecast.css # Weather bulletin styles
├── scripts/
│   ├── weatherBulletin.js  # Weather functionality
│   └── weatherInit.js      # Weather initialization
├── models/
│   └── floodPredictionModel.js # Flood prediction algorithms
├── services/
│   ├── weatherService.js   # Open-Meteo API integration
│   └── geocodingService.js # Location validation service
├── utils/
│   ├── coordinateValidator.js # Validation utilities
│   └── weatherUtils.js     # Weather data processing
├── controllers/
│   └── validationController.js # Validation UI controller
└── tests/
    └── validationTest.js   # Unit tests
```

## 📖 Usage Guide

### Basic Flood Simulation
1. **Select Campus**: Choose your university from the dropdown
2. **Configure Parameters**:
   - Rainfall Intensity (mm/hr)
   - Duration (minutes)
   - Weather Mode (Manual/Mock/Real-time)
   - Rainfall Pattern (Bell/Uniform/Increasing/Decreasing)
3. **Run Simulation**: Click "Run Simulation" to generate flood predictions
4. **Analyze Results**: Review flood risks, safe routes, and evacuation recommendations

### Weather Monitoring
1. **Navigate to Weather Bulletin**: Click the "Weather Bulletin" tab
2. **Select Location**: Choose from Philippine cities or use current location
3. **View Forecasts**: Check 24-hour and 7-day weather predictions
4. **Monitor Alerts**: Stay updated with weather warnings and advisories

### Emergency Response
1. **Access Emergency Hub**: Navigate to the emergency section
2. **Review Contacts**: Check national and local emergency hotlines
3. **Plan Evacuation**: View campus-specific evacuation routes
4. **Check Resources**: Monitor available evacuation centers and supplies

## 📋 API Reference

### Weather Service
```javascript
// Get current weather
const weather = await weatherService.getCurrentWeather(latitude, longitude);

// Get hourly forecast
const forecast = await weatherService.getHourlyForecast(latitude, longitude);

// Get historical weather
const history = await weatherService.getHistoricalWeather(lat, lon, startDate, endDate);
```

### Flood Model
```javascript
// Calculate flood predictions for campus
const predictions = await floodModel.getStreetPredictions(campusData);

// Calculate individual street risk
const risk = await floodModel.calculateFloodRisk(street, campus, weather, forecast);
```

### Geocoding Service
```javascript
// Validate location coordinates
const validation = await geocodingService.validateLocation(name, coords, type);

// Search by location name
const results = await geocodingService.searchByName("Location Name, Philippines");
```

## 🗂️ Data Structure

### Campus Data Format
```javascript
{
  id: "campus_id",
  name: "Full Campus Name",
  coords: [latitude, longitude],
  localHotlinesKey: "city_key",
  historical: [
    { year: 2020, rainMM: 200, floodCM: 80 }
  ],
  streets: [
    {
      name: "Street Name",
      sensitivity: 1.5,        // Flood vulnerability (1.0-2.0)
      soilSaturation: 1.3,     // Soil water retention factor
      drainageCapacity: 0.8,   // Drainage efficiency (0.0-1.0)
      elevation: 15,           // Height above sea level (meters)
      path: [[lat1, lon1], [lat2, lon2]] // Street coordinates
    }
  ],
  safeZones: [
    {
      name: "Evacuation Center Name",
      type: "Evacuation Center",
      coords: [latitude, longitude]
    }
  ]
}
```

### Emergency Hotlines Format
```javascript
{
  national: [
    { name: "Service Name", number: "hotline_number" }
  ],
  local: {
    city_key: [
      { name: "Local Service", number: "local_number" }
    ]
  }
}
```

## 🧪 Testing

Run the validation tests:
```bash
# Open tests/validationTest.js in browser or run with test framework
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-feature`
3. **Make your changes** and test thoroughly
4. **Commit your changes**: `git commit -m 'Add new feature'`
5. **Push to the branch**: `git push origin feature/new-feature`
6. **Submit a Pull Request**

### Development Guidelines
- Use ES6+ features and modular JavaScript
- Follow consistent naming conventions
- Add comments for complex algorithms
- Test all new features across different browsers
- Update documentation for API changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Open-Meteo API**: For providing free weather data
- **Leaflet.js**: For the excellent mapping library
- **Chart.js**: For data visualization capabilities
- **PAGASA**: For weather data and flood monitoring insights
- **Philippine Universities**: For providing campus data and validation

## 📞 Support

For questions, issues, or contributions:
- **GitHub Issues**: [Report bugs or request features](https://github.com/Yunimo30/SalinLigtas/issues)
- **Documentation**: Check this README and inline code comments
- **Community**: Join discussions in GitHub Discussions

---

**Stay Safe, Stay Prepared** 🛡️

*SalinLigtas - Because every student deserves a safe learning environment.*
