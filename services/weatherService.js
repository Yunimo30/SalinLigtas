// Weather service using Open-Meteo API
const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1';

class WeatherService {
    async getCurrentWeather(latitude, longitude) {
        try {
            const response = await fetch(`${OPEN_METEO_BASE_URL}/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m&timezone=auto`);
            const data = await response.json();
            return {
                temperature: data.current.temperature_2m,
                humidity: data.current.relative_humidity_2m,
                precipitation: data.current.precipitation,
                rain: data.current.rain,
                windSpeed: data.current.wind_speed_10m,
                weatherCode: data.current.weather_code
            };
        } catch (error) {
            console.error('Error fetching current weather:', error);
            return null;
        }
    }

    async getHourlyForecast(latitude, longitude) {
        try {
            const response = await fetch(`${OPEN_METEO_BASE_URL}/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,rain,weather_code,wind_speed_10m&timezone=auto`);
            const data = await response.json();
            return {
                time: data.hourly.time,
                temperature: data.hourly.temperature_2m,
                humidity: data.hourly.relative_humidity_2m,
                precipitationProb: data.hourly.precipitation_probability,
                rain: data.hourly.rain,
                windSpeed: data.hourly.wind_speed_10m,
                weatherCode: data.hourly.weather_code
            };
        } catch (error) {
            console.error('Error fetching hourly forecast:', error);
            return null;
        }
    }

    async getHistoricalWeather(latitude, longitude, startDate, endDate) {
        try {
            const response = await fetch(`${OPEN_METEO_BASE_URL}/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&start_date=${startDate}&end_date=${endDate}`);
            const data = await response.json();
            return {
                dates: data.daily.time,
                maxTemp: data.daily.temperature_2m_max,
                minTemp: data.daily.temperature_2m_min,
                precipitation: data.daily.precipitation_sum
            };
        } catch (error) {
            console.error('Error fetching historical weather:', error);
            return null;
        }
    }
}

export const weatherService = new WeatherService();