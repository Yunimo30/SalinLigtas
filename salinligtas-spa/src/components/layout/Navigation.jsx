import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

const Navigation = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/plan-monitor', label: 'Plan & Monitor' },
    { path: '/weather-bulletin', label: 'Weather Bulletin' },
    { path: '/emergency-hub', label: 'Emergency Hub' },
    { path: '/report-issues', label: 'Report Issues' },
  ]

  return (
    <header className="bg-[var(--card)] shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-primary">
              SalinLigtas
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            <div className={`menu-icon ${isMenuOpen ? 'open' : ''}`}>
              <span className="block w-6 h-0.5 bg-gray-600 dark:bg-gray-300 mb-1.5"></span>
              <span className="block w-6 h-0.5 bg-gray-600 dark:bg-gray-300 mb-1.5"></span>
              <span className="block w-6 h-0.5 bg-gray-600 dark:bg-gray-300"></span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === link.path
                    ? 'bg-primary text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Theme Toggle and GitHub Link */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <i className="fas fa-sun text-gray-600 dark:text-gray-300"></i>
              ) : (
                <i className="fas fa-moon text-gray-600 dark:text-gray-300"></i>
              )}
            </button>
            <a
              href="https://github.com/Yunimo30/Campus-Flood-Simulator"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-primary"
              aria-label="GitHub repository"
            >
              <i className="fab fa-github text-xl"></i>
            </a>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden ${
            isMenuOpen ? 'block' : 'hidden'
          } pb-4`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === link.path
                  ? 'bg-primary text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}

export default Navigation