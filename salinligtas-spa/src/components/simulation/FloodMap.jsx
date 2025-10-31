import { useEffect } from 'react'
import L from 'leaflet'

const FloodMap = ({ center = [14.5647, 120.9939], zoom = 16 }) => {
  useEffect(() => {
    // Initialize map
    const map = L.map('map').setView(center, zoom)

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    // Cleanup on unmount
    return () => {
      map.remove()
    }
  }, [center, zoom])

  return (
    <div className="card h-[calc(100vh-12rem)] flex flex-col">
      <div className="grid grid-cols-5 gap-2 p-2">
        {/* Status tiles */}
        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <div className="text-xs text-gray-600 dark:text-gray-400">Flood Level</div>
          <div className="font-semibold">Ankle Level</div>
        </div>
        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <div className="text-xs text-gray-600 dark:text-gray-400">Intensity</div>
          <div className="font-semibold">0 mm/hr</div>
        </div>
        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <div className="text-xs text-gray-600 dark:text-gray-400">Onset</div>
          <div className="font-semibold">N/A</div>
        </div>
        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <div className="text-xs text-gray-600 dark:text-gray-400">Passable Routes</div>
          <div className="font-semibold">0/0</div>
        </div>
        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <div className="text-xs text-gray-600 dark:text-gray-400">Campus Status</div>
          <div className="font-semibold">Normal</div>
        </div>
      </div>
      
      <div id="map" className="flex-1 rounded-lg overflow-hidden"></div>
    </div>
  )
}

export default FloodMap