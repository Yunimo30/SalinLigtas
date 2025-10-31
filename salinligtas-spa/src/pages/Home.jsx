const Home = () => {
  return (
    <div className="py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
          Welcome to SalinLigtas
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          A comprehensive flood monitoring and response system for campuses. Stay informed,
          plan ahead, and respond effectively to flood risks.
        </p>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="card text-center p-6">
          <i className="fas fa-university text-4xl text-primary mb-4"></i>
          <div className="text-3xl font-bold text-primary mb-2">5</div>
          <div className="text-gray-600 dark:text-gray-300">Monitored Campuses</div>
        </div>
        <div className="card text-center p-6">
          <i className="fas fa-chart-line text-4xl text-primary mb-4"></i>
          <div className="text-3xl font-bold text-primary mb-2">1000+</div>
          <div className="text-gray-600 dark:text-gray-300">Simulations Run</div>
        </div>
        <div className="card text-center p-6">
          <i className="fas fa-shield-alt text-4xl text-primary mb-4"></i>
          <div className="text-3xl font-bold text-primary mb-2">24/7</div>
          <div className="text-gray-600 dark:text-gray-300">Monitoring</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center text-primary mb-8">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card p-6">
            <i className="fas fa-map-marked-alt text-3xl text-primary mb-4"></i>
            <h3 className="text-xl font-bold mb-3 text-primary">Predictive Maps</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Visualize flood risks and safe routes around your campus with real-time data.
            </p>
          </div>
          <div className="card p-6">
            <i className="fas fa-bell text-3xl text-primary mb-4"></i>
            <h3 className="text-xl font-bold mb-3 text-primary">Real-time Alerts</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get instant notifications about changing weather conditions and flood risks.
            </p>
          </div>
          <div className="card p-6">
            <i className="fas fa-route text-3xl text-primary mb-4"></i>
            <h3 className="text-xl font-bold mb-3 text-primary">Safe Route Planning</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Identify the safest evacuation routes and make informed decisions quickly.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-12 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
          Ready to protect your campus?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Start using our flood simulation system today.
        </p>
        <a
          href="/plan-monitor"
          className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          Get Started
        </a>
      </section>
    </div>
  )
}

export default Home