import { Outlet } from 'react-router-dom'
import Navigation from './Navigation'

const Layout = () => {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navigation />
      <main className="container mx-auto px-4">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout