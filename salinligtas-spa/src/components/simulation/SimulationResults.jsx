import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

const SimulationResults = ({ results }) => {
  // Sample data for demonstration
  const hazardData = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk', 'Critical'],
    datasets: [
      {
        data: [40, 30, 20, 10],
        backgroundColor: [
          'rgba(34, 197, 94, 0.6)',
          'rgba(251, 191, 36, 0.6)',
          'rgba(249, 115, 22, 0.6)',
          'rgba(239, 68, 68, 0.6)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(251, 191, 36)',
          'rgb(249, 115, 22)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const streets = [
    {
      name: 'Taft Avenue',
      risk: 'High',
      height: 45,
      forecast: 50,
    },
    {
      name: 'Agno Street',
      risk: 'Medium',
      height: 30,
      forecast: 35,
    },
    {
      name: 'Castro Street',
      risk: 'Low',
      height: 15,
      forecast: 20,
    },
  ]

  const getRiskBadgeColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'low':
        return 'bg-green-500'
      case 'medium':
        return 'bg-amber-500'
      case 'high':
        return 'bg-orange-500'
      case 'critical':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="card p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-primary flex items-center gap-2 mb-2">
          <i className="fas fa-chart-bar"></i> Simulation Results
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Analysis and insights from your simulation
        </p>
      </div>

      {/* Street Risk Table */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <i className="fas fa-road"></i> Flood Risk by Street
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Street
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Risk
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Height (cm)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Forecast (cm)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {streets.map((street) => (
                <tr key={street.name}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {street.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 text-xs font-medium text-white rounded-full ${getRiskBadgeColor(
                        street.risk
                      )}`}
                    >
                      {street.risk}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {street.height}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {street.forecast}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hazard Chart */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <i className="fas fa-chart-pie"></i> Hazard Breakdown
        </h3>
        <div className="h-64">
          <Pie data={hazardData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <i className="fas fa-tachometer-alt"></i> Key Metrics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Flood Onset
            </div>
            <div className="text-xl font-semibold">30 min</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Passable Routes
            </div>
            <div className="text-xl font-semibold">4/6</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Model Accuracy
            </div>
            <div className="text-xl font-semibold">85%</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Suspension Risk
            </div>
            <div className="text-xl font-semibold text-amber-500">Medium</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
          <i className="fas fa-phone"></i> Emergency Hotlines
        </button>
        <button className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
          <i className="fas fa-download"></i> Export Results
        </button>
      </div>
    </div>
  )
}

export default SimulationResults