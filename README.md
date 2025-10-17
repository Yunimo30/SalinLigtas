# 🌊 SalinLigtas: Campus Flood Simulation System

![SalinLigtas Banner](https://img.shields.io/badge/🏛️-Campus%20Safety-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![Status](https://img.shields.io/badge/status-prototype-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

> A comprehensive digital twin flood prediction system designed to protect academic communities through advanced simulation and real-time monitoring.

## 🎯 Quick Links
- [Live Demo](https://yunimo30.github.io/SalinLigtas) (WIP)
- [Documentation](#-documentation)
- [Feature Requests](https://github.com/Yunimo30/Campus-Flood-Simulator/issues)
- [Report Bug](https://github.com/Yunimo30/Campus-Flood-Simulator/issues)

## 📖 Overview

SalinLigtas (from Filipino words "Salin" - to transfer/simulate, and "Ligtas" - safe) is a state-of-the-art flood prediction tool that enables campus administrators and disaster response teams to:

- 🎯 Simulate various rainfall scenarios
- 🗺️ Visualize flood risks in real-time
- 🛣️ Identify safe evacuation routes
- ⚡ Make quick, data-driven decisions
- 📊 Access comprehensive analytics

## ✨ Key Features

### 🗺️ Interactive Mapping
- Real-time flood visualization using Leaflet.js
- Dynamic hazard zone overlays
- Street-level risk assessment
- Safe route identification

### 💧 Advanced Simulation
- Customizable rainfall intensity (mm/hr)
- Adjustable duration settings
- Multiple rainfall patterns:
  - Bell curve distribution
  - Uniform pattern
  - Increasing/Decreasing trends

### 📊 Visual Analytics
- Real-time flood level monitoring
- Historical trend analysis
- Risk distribution charts
- Street-wise flood forecasting

### ⚡ Smart Alerts
- Class suspension recommendations
- Route safety notifications
- Emergency contact integration
- Real-time risk updates

## 🛠️ Technical Stack

### Frontend
- **HTML5** - Structure and content
- **CSS3** - Styling and animations
- **JavaScript** - Core functionality
- **Leaflet.js** - Interactive mapping
- **Chart.js** - Data visualization

### Core Components
```
├── index.html     # Main structure
├── style.css      # Visual styling
├── script.js      # Core logic
├── data.js        # Campus data
└── README.md      # Documentation
```

## 📈 Simulation Model

### Input Parameters
- Rainfall Intensity (mm/hr)
- Duration (minutes)
- Pattern Selection
- Campus Location

### Calculation Formula
```javascript
expectedFloodHeight (cm) = totalRainfall × sensitivity × scaleFactor
where:
totalRainfall = intensity × (duration / 60)
```

## 🎮 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari)
- JavaScript enabled
- Internet connection for map tiles

### Installation
1. Clone the repository
   ```bash
   git clone https://github.com/Yunimo30/Campus-Flood-Simulator.git
   ```
2. Open index.html in your browser
3. Select your campus
4. Configure simulation parameters
5. Run simulation

## 📚 Documentation

### User Guide
1. **Campus Selection**
   - Choose your campus from the dropdown
   - View historical flood data

2. **Simulation Setup**
   - Set rainfall intensity
   - Adjust duration
   - Select pattern

3. **Analysis**
   - Review flood risk levels
   - Check safe routes
   - Monitor KPIs

### API Reference
- Map Interaction API
- Simulation Controls
- Data Export Functions

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the Project
2. Create your Feature Branch
3. Commit your Changes
4. Push to the Branch
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- [OpenStreetMap](https://www.openstreetmap.org/) for map data
- [Leaflet.js](https://leafletjs.com/) for mapping functionality
- [Chart.js](https://www.chartjs.org/) for data visualization
- All contributors and supporters

## 📞 Contact

Project Maintainer: [Yunimo30](https://github.com/Yunimo30)

## 🗺️ Roadmap

- [ ] Real-time weather data integration
- [ ] Mobile application development
- [ ] Machine learning predictions
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

---

<p align="center">Made with ❤️ for campus safety</p>
