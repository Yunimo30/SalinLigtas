import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import PlanMonitor from './pages/PlanMonitor'
import WeatherBulletin from './pages/WeatherBulletin'
import EmergencyHub from './pages/EmergencyHub'
import ReportIssues from './pages/ReportIssues'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="plan-monitor" element={<PlanMonitor />} />
        <Route path="weather-bulletin" element={<WeatherBulletin />} />
        <Route path="emergency-hub" element={<EmergencyHub />} />
        <Route path="report-issues" element={<ReportIssues />} />
      </Route>
    </Routes>
  )
}

export default App