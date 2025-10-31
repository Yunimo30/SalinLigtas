const WeatherBulletin = () => {
  const weatherData = {
    current: {
      temperature: 28,
      description: 'Light Rain',
      humidity: 75,
      windSpeed: 15,
      rainfall: 2.5,
    },
    forecast: [
      {
        day: 'Today',
        temperature: { min: 26, max: 30 },
        description: 'Light Rain',
        rainfall: 2.5,
      },
      {
        day: 'Tomorrow',
        temperature: { min: 25, max: 29 },
        description: 'Heavy Rain',
        rainfall: 8.2,
      },
      {
        day: 'Wednesday',
        temperature: { min: 24, max: 28 },
        description: 'Thunderstorms',
        rainfall: 12.4,
      },
    ],
    warnings: [
      {
        type: 'Heavy Rainfall',
        level: 'Orange',
        description:
          'Heavy rainfall expected in the next 24 hours. Possible flooding in low-lying areas.',
      },
      {
        type: 'Flood',
        level: 'Yellow',
        description:
          'Risk of flooding in vulnerable areas due to continuous rainfall.',
      },
    ],
  }

  const getWeatherIcon = (description) => {
    switch (description.toLowerCase()) {
      case 'light rain':
        return 'fas fa-cloud-rain'
      case 'heavy rain':
        return 'fas fa-cloud-showers-heavy'
      case 'thunderstorms':
        return 'fas fa-bolt'
      default:
        return 'fas fa-cloud'
    }
  }

  const getWarningColor = (level) => {
    switch (level.toLowerCase()) {
      case 'red':
        return 'bg-red-500'
      case 'orange':
        return 'bg-orange-500'
      case 'yellow':
        return 'bg-amber-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Current Weather */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold text-primary flex items-center gap-2 mb-4">
          <i className="fas fa-cloud"></i> Current Weather
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-6">
            <i
              className={`${getWeatherIcon(
                weatherData.current.description
              )} text-6xl text-primary`}
            ></i>
            <div>
              <div className="text-4xl font-bold">
                {weatherData.current.temperature}°C
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {weatherData.current.description}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Humidity
              </div>
              <div className="text-xl font-semibold">
                {weatherData.current.humidity}%
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Wind Speed
              </div>
              <div className="text-xl font-semibold">
                {weatherData.current.windSpeed} km/h
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Rainfall
              </div>
              <div className="text-xl font-semibold">
                {weatherData.current.rainfall} mm
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Warnings */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold text-primary flex items-center gap-2 mb-4">
          <i className="fas fa-exclamation-triangle"></i> Weather Warnings
        </h2>
        <div className="space-y-4">
          {weatherData.warnings.map((warning, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div
                className={`${getWarningColor(
                  warning.level
                )} w-12 h-12 rounded-full flex items-center justify-center text-white`}
              >
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{warning.type}</h3>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Alert Level: {warning.level}
                </div>
                <p className="text-sm">{warning.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3-Day Forecast */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-primary flex items-center gap-2 mb-4">
          <i className="fas fa-calendar-alt"></i> 3-Day Forecast
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {weatherData.forecast.map((day, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center"
            >
              <div className="font-semibold mb-2">{day.day}</div>
              <i
                className={`${getWeatherIcon(
                  day.description
                )} text-3xl text-primary mb-2`}
              ></i>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {day.description}
              </div>
              <div className="flex justify-center gap-4 text-sm">
                <span>Min: {day.temperature.min}°C</span>
                <span>Max: {day.temperature.max}°C</span>
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Rainfall: {day.rainfall} mm
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WeatherBulletin