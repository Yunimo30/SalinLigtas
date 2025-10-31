const EmergencyHub = () => {
  const emergencyContacts = [
    {
      name: 'National Emergency Hotline',
      number: '911',
      category: 'Emergency',
      available: '24/7',
    },
    {
      name: 'Philippine Red Cross',
      number: '143',
      category: 'Emergency',
      available: '24/7',
    },
    {
      name: 'Bureau of Fire Protection',
      number: '(02) 8426-0219',
      category: 'Fire',
      available: '24/7',
    },
    {
      name: 'MMDA Metrobase',
      number: '136',
      category: 'Traffic',
      available: '24/7',
    },
  ]

  const evacuationCenters = [
    {
      name: 'De La Salle University',
      address: '2401 Taft Avenue, Malate, Manila',
      status: 'Open',
      capacity: '500',
      current: '125',
    },
    {
      name: 'Philippine Christian University',
      address: '1648 Taft Avenue, Manila',
      status: 'Open',
      capacity: '300',
      current: '98',
    },
    {
      name: 'Arellano University',
      address: '2600 Taft Avenue, Malate, Manila',
      status: 'Standby',
      capacity: '250',
      current: '0',
    },
  ]

  const newsUpdates = [
    {
      title: 'Flash Flood Warning Issued',
      time: '2 hours ago',
      severity: 'High',
      description:
        'PAGASA issues flash flood warning for Metro Manila due to continuous heavy rainfall.',
    },
    {
      title: 'Roads Closed Due to Flooding',
      time: '1 hour ago',
      severity: 'Medium',
      description:
        'Several roads in Taft Avenue area closed due to rising flood waters.',
    },
    {
      title: 'Evacuation Advisory',
      time: '30 minutes ago',
      severity: 'High',
      description:
        'Residents in low-lying areas advised to evacuate to nearest centers.',
    },
  ]

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'text-red-500'
      case 'medium':
        return 'text-orange-500'
      case 'low':
        return 'text-green-500'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-green-500'
      case 'full':
        return 'bg-red-500'
      case 'standby':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Emergency Contacts */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold text-primary flex items-center gap-2 mb-4">
          <i className="fas fa-phone-alt"></i> Emergency Contacts
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Number
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Available
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {emergencyContacts.map((contact, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium">{contact.name}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-mono">{contact.number}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {contact.category}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {contact.available}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button className="text-primary hover:text-primary-dark">
                      <i className="fas fa-phone"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Latest Updates */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold text-primary flex items-center gap-2 mb-4">
          <i className="fas fa-newspaper"></i> Latest Updates
        </h2>
        <div className="space-y-4">
          {newsUpdates.map((news, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{news.title}</h3>
                <span
                  className={`${getSeverityColor(
                    news.severity
                  )} text-sm font-medium`}
                >
                  {news.severity}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {news.description}
              </p>
              <div className="text-xs text-gray-500">{news.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Evacuation Centers */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-primary flex items-center gap-2 mb-4">
          <i className="fas fa-hospital"></i> Evacuation Centers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {evacuationCenters.map((center, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{center.name}</h3>
                <span
                  className={`${getStatusColor(
                    center.status
                  )} px-2 py-1 text-xs text-white rounded-full`}
                >
                  {center.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {center.address}
              </p>
              <div className="flex justify-between text-sm">
                <span>
                  Capacity:{' '}
                  <span className="font-medium">
                    {center.current}/{center.capacity}
                  </span>
                </span>
                <button className="text-primary hover:text-primary-dark">
                  <i className="fas fa-directions"></i> Directions
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EmergencyHub