import { useState } from 'react'

const SimulationControls = ({ onRunSimulation }) => {
  const [settings, setSettings] = useState({
    campus: '',
    intensity: 30,
    duration: 60,
    weatherMode: 'manual',
    rainfallPattern: 'bell',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const quickScenarios = [
    { label: 'Light', intensity: 10, duration: 30 },
    { label: 'Moderate', intensity: 30, duration: 60 },
    { label: 'Heavy', intensity: 60, duration: 120 },
  ]

  return (
    <div className="card p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-primary flex items-center gap-2 mb-2">
          <i className="fas fa-cogs"></i> Simulation Controls
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Configure your flood simulation parameters
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <i className="fas fa-map-marker-alt mr-2"></i> Select Campus
          </label>
          <select
            name="campus"
            value={settings.campus}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="">Select a campus...</option>
            <option value="dlsu">De La Salle University (DLSU - Taft)</option>
            <option value="ust">University of Santo Tomas (UST - España)</option>
            <option value="mapua_manila">Mapúa (Intramuros, Manila)</option>
            <option value="mapua_makati">Mapúa (Makati, Pablo Ocampo)</option>
            <option value="upd">UP Diliman (Quezon City)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <i className="fas fa-cloud-rain mr-2"></i> Rainfall Intensity (mm/hr)
          </label>
          <input
            type="number"
            name="intensity"
            value={settings.intensity}
            onChange={handleChange}
            min="0"
            max="200"
            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <i className="fas fa-clock mr-2"></i> Duration (minutes)
          </label>
          <input
            type="number"
            name="duration"
            value={settings.duration}
            onChange={handleChange}
            min="0"
            max="1440"
            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <i className="fas fa-cloud-sun mr-2"></i> Weather Mode
          </label>
          <select
            name="weatherMode"
            value={settings.weatherMode}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="manual">Manual Input</option>
            <option value="mock">Mock Data</option>
            <option value="real-time">Real-Time</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <i className="fas fa-chart-line mr-2"></i> Rainfall Pattern
          </label>
          <select
            name="rainfallPattern"
            value={settings.rainfallPattern}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="bell">Bell Curve</option>
            <option value="uniform">Uniform</option>
            <option value="increasing">Increasing</option>
            <option value="decreasing">Decreasing</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <i className="fas fa-magic mr-2"></i> Quick Scenarios
          </label>
          <div className="grid grid-cols-3 gap-2">
            {quickScenarios.map((scenario) => (
              <button
                key={scenario.label}
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    intensity: scenario.intensity,
                    duration: scenario.duration,
                  }))
                }
                className="p-2 text-sm bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
              >
                {scenario.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onRunSimulation(settings)}
          className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <i className="fas fa-play"></i> Run Simulation
        </button>
      </div>
    </div>
  )
}

export default SimulationControls