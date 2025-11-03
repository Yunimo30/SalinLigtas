// Enhanced flood prediction model using Open-Meteo data
import { weatherService } from './weatherService.js';

class FloodPredictionModel {
    constructor() {
        this.HEIGHT_SCALE = 0.7;
        this.MAX_HEIGHT_CM = 150;
    }

    async calculateFloodRisk(street, campus, currentWeather, forecast) {
        // Base calculation from current model
        const baseRisk = street.sensitivity * this.HEIGHT_SCALE;
        
        // Enhanced factors using real-time weather data
        const weatherFactors = this.calculateWeatherFactors(currentWeather);
        const soilFactors = this.calculateSoilFactors(street, forecast);
        const drainageFactors = this.calculateDrainageFactors(street, forecast);
        
        // Combine all factors
        const totalRisk = baseRisk * weatherFactors * soilFactors * drainageFactors;
        
        return Math.min(totalRisk, this.MAX_HEIGHT_CM);
    }

    calculateWeatherFactors(weather) {
        const rainIntensityFactor = weather.rain > 0 ? 1 + (weather.rain / 10) : 1;
        const humidityFactor = 1 + ((weather.humidity - 60) / 100);
        const windFactor = Math.max(1, weather.windSpeed / 20); // Strong winds can affect drainage

        return rainIntensityFactor * humidityFactor * windFactor;
    }

    calculateSoilFactors(street, forecast) {
        // Consider recent rainfall from forecast history
        const recentRainfall = forecast.rain.slice(0, 24).reduce((sum, rain) => sum + rain, 0);
        const saturationFactor = 1 + (recentRainfall / 100) * street.soilSaturation;

        return saturationFactor * (1 / street.elevation * 10);
    }

    calculateDrainageFactors(street, forecast) {
        // Consider upcoming rainfall intensity
        const futureRainfall = forecast.rain.slice(0, 6).reduce((sum, rain) => sum + rain, 0);
        const drainageLoad = 1 + (futureRainfall / 50) * (1 - street.drainageCapacity);

        return drainageLoad;
    }

    async getStreetPredictions(campus) {
        try {
            const currentWeather = await weatherService.getCurrentWeather(campus.coords[0], campus.coords[1]);
            const forecast = await weatherService.getHourlyForecast(campus.coords[0], campus.coords[1]);

            if (!currentWeather || !forecast) {
                throw new Error('Weather data unavailable');
            }

            const predictions = await Promise.all(campus.streets.map(async street => {
                const riskLevel = await this.calculateFloodRisk(street, campus, currentWeather, forecast);
                return {
                    street: street.name,
                    riskLevel,
                    currentRain: currentWeather.rain,
                    nextHourRain: forecast.rain[0],
                    soilSaturation: street.soilSaturation,
                    drainageStatus: street.drainageCapacity
                };
            }));

            return predictions;
        } catch (error) {
            console.error('Error calculating flood predictions:', error);
            return null;
        }
    }
}

export const floodModel = new FloodPredictionModel();