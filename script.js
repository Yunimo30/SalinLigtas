let map;

window.addEventListener("DOMContentLoaded", () => {
  // Navigation functionality
  function navigateToSection(targetSection) {
    // Remove active class from all links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(l => l.classList.remove('active'));

    // Add active class to target link
    const targetLink = document.querySelector(`[data-section="${targetSection}"]`);
    if (targetLink) targetLink.classList.add('active');

    // Hide all sections with fade out
    const pageSections = document.querySelectorAll('.page-section');
    pageSections.forEach(section => {
      if (section.classList.contains('active')) {
        section.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
          section.classList.remove('active');
          section.style.animation = '';
        }, 300);
      }
    });

    // Show target section with fade in after a short delay
    setTimeout(() => {
      const targetElement = document.getElementById(targetSection);
      targetElement.classList.add('active');
      targetElement.style.animation = 'fadeIn 0.5s ease-out';
    }, 350);

    // Close mobile menu
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    hamburger.classList.remove('active');
    nav.classList.remove('active');

    // Invalidate map size if switching to plan-monitor
    if (targetSection === 'plan-monitor' && map) {
      setTimeout(() => map.invalidateSize(), 400);
    }
  }

  // Make navigateToSection globally available
  window.navigateToSection = navigateToSection;

  const navLinks = document.querySelectorAll('.nav-link');
  const pageSections = document.querySelectorAll('.page-section');
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  // Hamburger menu toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSection = e.target.getAttribute('data-section');

      // Remove active class from all links
      navLinks.forEach(l => l.classList.remove('active'));
      // Add active class to clicked link
      e.target.classList.add('active');

      // Hide all sections with fade out
      pageSections.forEach(section => {
        if (section.classList.contains('active')) {
          section.style.animation = 'fadeOut 0.3s ease-out';
          setTimeout(() => {
            section.classList.remove('active');
            section.style.animation = '';
          }, 300);
        }
      });

      // Show target section with fade in after a short delay
      setTimeout(() => {
        const targetElement = document.getElementById(targetSection);
        targetElement.classList.add('active');
        targetElement.style.animation = 'fadeIn 0.5s ease-out';
      }, 350);

      // Close mobile menu
      hamburger.classList.remove('active');
      nav.classList.remove('active');

      // Invalidate map size if switching to plan-monitor
      if (targetSection === 'plan-monitor' && map) {
        setTimeout(() => map.invalidateSize(), 400);
      }
    });
  });

  // Mobile toggles
  const mobileControlsToggle = document.getElementById('mobileControlsToggle');
  const mobileResultsToggle = document.getElementById('mobileResultsToggle');
  const controlsPanel = document.getElementById('controlsPanel');
  const resultsPanel = document.querySelector('.results');

  if (mobileControlsToggle && controlsPanel) {
    mobileControlsToggle.addEventListener('click', () => {
      controlsPanel.classList.toggle('active');
      mobileControlsToggle.classList.toggle('active');

      // Invalidate map size when controls panel changes
      if (map) {
        setTimeout(() => map.invalidateSize(), 300);
      }
    });
  }

  if (mobileResultsToggle && resultsPanel) {
    mobileResultsToggle.addEventListener('click', () => {
      resultsPanel.classList.toggle('active');
      mobileResultsToggle.classList.toggle('active');
    });
  }

  // Set initial active nav link to home
  document.querySelector('.nav-link[data-section="home"]').classList.add('active');

  // Theme toggle functionality
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeMenu = document.getElementById('themeMenu');
  const themeOptions = document.querySelectorAll('.theme-option');

  // Load saved theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);

  // Toggle theme menu
  themeToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    themeMenu.classList.toggle('show');
  });

  // Close theme menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!themeToggleBtn.contains(e.target) && !themeMenu.contains(e.target)) {
      themeMenu.classList.remove('show');
    }
  });

  // Theme option selection
  themeOptions.forEach(option => {
    option.addEventListener('click', () => {
      const selectedTheme = option.dataset.theme;
      applyTheme(selectedTheme);
      localStorage.setItem('theme', selectedTheme);
      themeMenu.classList.remove('show');
    });
  });

  // Apply theme function
  function applyTheme(theme) {
    const body = document.body;
    body.classList.remove('light', 'dark');

    if (theme === 'light') {
      body.classList.add('light');
    } else if (theme === 'dark') {
      body.classList.add('dark');
    } else if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      body.classList.add(prefersDark ? 'dark' : 'light');
    }

    // Update toggle button icon
    const icon = themeToggleBtn.querySelector('i');
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      icon.className = 'fas fa-sun';
    } else {
      icon.className = 'fas fa-moon';
    }
  }

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (localStorage.getItem('theme') === 'system') {
      applyTheme('system');
    }
  });

  // Map init
  map = L.map("map").setView([14.6098, 120.9896], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 19,
    minZoom: 10
  }).addTo(map);

  // Street layer group
  const streetLayer = L.layerGroup().addTo(map);

  // Path layer for safe routes
  const pathLayer = L.layerGroup().addTo(map);

  // Suspension overlay
  const overlay = document.createElement('div');
  overlay.id = 'suspensionOverlay';
  overlay.style.cssText = 'position:absolute; top:10px; right:10px; background:rgba(0,0,0,0.7); color:white; padding:8px; border-radius:5px; font-size:14px; font-weight:bold; z-index:1000; min-width:150px; text-align:center; display:none;';
  map.getContainer().appendChild(overlay);

  // UI refs
  const campusSelect = document.getElementById("campusSelect");
  const intensityInput = document.getElementById("intensity");
  const durationInput = document.getElementById("duration");
  const rainfallPatternSelect = document.getElementById("rainfallPattern");
  const runBtn = document.getElementById("runSim");
  const floodTbody = document.querySelector("#floodTable tbody");
  const kpiOnset = document.getElementById("kpiOnset");
  const kpiRoutes = document.getElementById("kpiRoutes");
  const kpiAccuracy = document.getElementById("kpiAccuracy");
  const kpiSuspension = document.getElementById("kpiSuspension");
  const kpiHeightComparison = document.getElementById("kpiHeightComparison");
  const safestRoutesDiv = document.getElementById("safestRoutes");
  const exportBtn = document.getElementById("exportBtn");
  const alertsDiv = document.getElementById("alerts");

  // Tab refs
  const simulationTab = document.getElementById("simulationTab");
  const forecastTab = document.getElementById("forecastTab");
  const tabBtns = document.querySelectorAll(".tab-btn");

  // Forecast refs
  const forecastHourSlider = document.getElementById("forecastHour");
  const forecastResults = document.getElementById("forecastResults");

  // Unit toggle
  const unitToggle = document.getElementById("unitToggle");
  let currentUnit = localStorage.getItem("unit") || "cm"; // cm or ft

  // Update unit label
  function updateUnitLabel() {
    unitToggle.textContent = `Units: ${currentUnit}`;
    // Update table headers
    const headers = document.querySelectorAll("#floodTable th");
    headers[2].innerHTML = `Expected height (${currentUnit})`;
    headers[3].innerHTML = `Forecast Peak (${currentUnit})`;
  }

  // Conversion function
  function convertHeight(cm) {
    return currentUnit === "ft" ? (cm / 30.48).toFixed(2) : cm.toFixed(1);
  }

  // Descriptive risk labels based on average Filipino height (~157cm)
  function getDescriptiveRisk(cm) {
    if (cm < 20) return "Ankle Level";
    if (cm < 40) return "Knee Level";
    if (cm < 70) return "Waist Level";
    if (cm < 100) return "Chest Level";
    return "Neck Level";
  }

  // Toggle unit
  unitToggle.addEventListener("click", () => {
    currentUnit = currentUnit === "cm" ? "ft" : "cm";
    localStorage.setItem("unit", currentUnit);
    updateUnitLabel();
    runSimulation(); // Re-run to update displays
    rankSafestRoutes();
  });

  updateUnitLabel(); // Initial

  // Populate dropdown and add markers
  const markers = [];
  campuses.forEach((c, idx) => {
    const opt = document.createElement("option");
    opt.value = idx;
    opt.textContent = c.name;
    campusSelect.appendChild(opt);

    const m = L.marker(c.coords).addTo(map).bindPopup(c.name);
    markers.push(m);
  });

  // default selection = first campus
  campusSelect.value = 0;
  map.setView(campuses[0].coords, 15);

  // Charts: rainfall profile (line) and hazard breakdown (pie)
  const rainfallCtx = document.getElementById("rainfallChart").getContext("2d");
  const isDarkMode = document.body.classList.contains('dark');
  const chartColors = {
    text: isDarkMode ? '#ffffff' : '#333333',
    grid: isDarkMode ? '#4b5563' : '#e5e7eb'
  };
  const rainfallChart = new Chart(rainfallCtx, {
    type: "line",
    data: { labels: [], datasets: [{ label: "Intensity (mm/hr)", data: [], borderColor: "#365a9b", fill: false }] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: { color: chartColors.text },
          grid: { color: chartColors.grid }
        },
        y: {
          ticks: { color: chartColors.text },
          grid: { color: chartColors.grid }
        }
      },
      plugins: {
        legend: {
          labels: { color: chartColors.text }
        }
      }
    }
  });

  // Forecast chart (will be created dynamically)
  let forecastChart = null;

  const hazardCtx = document.getElementById("hazardChart").getContext("2d");
  const hazardChart = new Chart(hazardCtx, {
    type: "pie",
    data: { labels: ["Safe","Caution","Impassable"], datasets: [{ data: [0,0,0], backgroundColor: ["#22c55e","#fbbf24","#ef4444"] }] },
    options: { responsive: true, maintainAspectRatio: false }
  });

  const historicalCtx = document.getElementById("historicalChart").getContext("2d");
  const historicalChart = new Chart(historicalCtx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        { label: "Rainfall (mm)", data: [], borderColor: "#365a9b", fill: false },
        { label: "Flood Height (cm)", data: [], borderColor: "#ef4444", fill: false }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  // Initial historical chart update for default campus
  updateHistoricalChart(campuses[0]);



  // Safe Route Identifier: rank streets by safety
  function rankSafestRoutes(overrideIntensity = null, overrideDuration = null) {
    const campusIndex = parseInt(campusSelect.value);
    const campus = campuses[campusIndex];
    const intensity = overrideIntensity !== null ? overrideIntensity : (parseFloat(intensityInput.value) || 0);
    const duration = overrideDuration !== null ? overrideDuration : (parseFloat(durationInput.value) || 0);

    // Get current flood heights
    const streetRisks = campus.streets.map(street => {
      const height = expectedFloodHeightCm(intensity, duration, street, campus);
      const cls = classifyByHeight(height);
      const descriptiveLabel = getDescriptiveRisk(height);
      return { name: street.name, height, level: cls.level, css: cls.css, desc: descriptiveLabel };
    });

    // Sort by height ascending (safest first)
    streetRisks.sort((a, b) => a.height - b.height);

    // Display ranked list
    let html = '<ol>';
    streetRisks.forEach(street => {
      html += `<li><strong>${street.name}</strong> - ${convertHeight(street.height)} ${currentUnit} (${street.level}) <small style="color:#666;">${street.desc}</small></li>`;
    });
    html += '</ol>';

    // Add button for pathfinding
    html += '<br><button id="findPathBtn" class="run-btn">Find Path to Safe Zone</button>';

    safestRoutesDiv.innerHTML = html;
    safestRoutesDiv.style.display = 'block';

    // Attach event listener to the button
    document.getElementById("findPathBtn").addEventListener("click", findPathToSafeZone);
  }

  // Reset selection button or clear
  // For now, add a clear button if needed, but skip for prototype

  // Calculation helpers
  function getHistoricalAvg(campus) {
    if (campus.historical && campus.historical.length > 0) {
      const avgRain = campus.historical.reduce((sum, h) => sum + h.rainMM, 0) / campus.historical.length;
      const avgFlood = campus.historical.reduce((sum, h) => sum + h.floodCM, 0) / campus.historical.length;
      return { avgRain, avgFlood };
    }
    // Fallback defaults
    return { avgRain: 150, avgFlood: 60 };
  }

  // Mock intensity function: sinusoidal variation based on time
  function getMockIntensity(hour) {
    // Base intensity with sinusoidal variation (peaks around noon/afternoon)
    const baseIntensity = 20; // mm/hr
    const amplitude = 15; // variation range
    const phase = Math.PI / 12; // shift to peak in afternoon
    return Math.max(0, baseIntensity + amplitude * Math.sin((hour - 6) * phase));
  }

  // Real-time intensity function: fetch from API with mock fallback
  async function getRealTimeIntensity() {
    try {
      // Use OpenWeatherMap API for current rainfall
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Manila,PH&appid=${API_KEY}&units=metric`);
      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();

      // Extract rainfall from weather data (if available)
      const rain = data.rain ? data.rain['1h'] || 0 : 0;
      return rain;
    } catch (error) {
      console.warn('Real-time API failed, using mock data:', error);
      // Fallback to mock intensity based on current hour
      const currentHour = new Date().getHours();
      return getMockIntensity(currentHour);
    }
  }

  function expectedFloodHeightCm(intensity, durationMin, street, campus) {
    const avgs = getHistoricalAvg(campus);
    const durationHours = durationMin / 60;

    // Enhanced flood calculation incorporating multiple factors
    const rainfallFactor = intensity / avgs.avgRain;
    const durationFactor = durationHours;
    const sensitivityFactor = street.sensitivity;
    const soilSaturationFactor = street.soilSaturation;
    const drainageFactor = 1 / street.drainageCapacity; // Lower drainage capacity increases flood risk
    const elevationFactor = Math.max(0.5, 1 - (street.elevation / 20)); // Higher elevation reduces flood risk

    // Combined flood height calculation
    const raw = avgs.avgFlood *
                rainfallFactor *
                durationFactor *
                sensitivityFactor *
                soilSaturationFactor *
                drainageFactor *
                elevationFactor;

    return Math.min(raw, SIM_CONFIG.MAX_HEIGHT_CM);
  }

  function classifyByHeight(cm) {
    if (cm < 20) return { level: "Safe", css: "green" };
    if (cm < 50) return { level: "Caution", css: "yellow" };
    return { level: "Impassable", css: "red" };
  }

  function generateRainfallData(pattern, intensity, slices) {
    switch (pattern) {
      case 'uniform':
        return Array(slices).fill(intensity);
      case 'increasing':
        return Array.from({ length: slices }, (_, i) => intensity * (i / (slices - 1 || 1)));
      case 'decreasing':
        return Array.from({ length: slices }, (_, i) => intensity * (1 - i / (slices - 1 || 1)));
      case 'bell':
      default:
        return Array.from({ length: slices }, (_, i) => {
          const t = i / (slices - 1 || 1);
          return intensity * Math.exp(-Math.pow((t - 0.5) * 3, 2));
        });
    }
  }

  function updateHistoricalChart(campus) {
    if (campus.historical && campus.historical.length > 0) {
      historicalChart.data.labels = campus.historical.map(h => h.year.toString());
      historicalChart.data.datasets[0].data = campus.historical.map(h => h.rainMM);
      historicalChart.data.datasets[1].data = campus.historical.map(h => h.floodCM);
    } else {
      historicalChart.data.labels = [];
      historicalChart.data.datasets[0].data = [];
      historicalChart.data.datasets[1].data = [];
    }
    historicalChart.update();
  }

  // Main update: table, charts, KPIs, map buffer
  async function runSimulation(mode = 'sim', hourData = null) {
    const campusIndex = parseInt(campusSelect.value);
    const campus = campuses[campusIndex];
    let intensity = parseFloat(intensityInput.value) || 0;
    let duration = parseFloat(durationInput.value) || 0;

    // Integrate weather mode logic
    const weatherMode = document.getElementById('weatherMode').value;
    if (weatherMode === 'mock') {
      const currentHour = new Date().getHours();
      intensity = getMockIntensity(currentHour);
      intensityInput.value = intensity.toFixed(1);
    } else if (weatherMode === 'real-time') {
      try {
        intensity = await getRealTimeIntensity();
        intensityInput.value = intensity.toFixed(1);
      } catch (error) {
        console.error('Failed to get real-time intensity:', error);
        // Fallback to manual input
      }
    }
    // For 'manual', use the input value as is

    if (mode === 'forecast') {
      intensity = hourData.intensity;
      duration = 60; // 1 hour
      forecastResults.style.display = 'block'; // Show results during animation
    } else {
      // Clear forecast on standard sim
      if (forecastAnimation) {
        clearInterval(forecastAnimation);
        forecastAnimation = null;
      }
      forecastResults.innerHTML = "";
      if (forecastChart) {
        forecastChart.destroy();
        forecastChart = null;
      }
      overlay.style.display = 'block';
    }

  // Clear previous street markers and labels
  streetLayer.clearLayers();

  pathLayer.clearLayers();

    // update table rows (per-street)
    floodTbody.innerHTML = "";
    const counts = { safe:0, caution:0, impassable:0 };
    let earliestOnsetMin = Infinity;
    const heights = [];
    let impassableCount = 0;

    const colorMap = { green: "#22c55e", yellow: "#fbbf24", red: "#ef4444" };

    campus.streets.forEach(street => {
      const peak = expectedFloodHeightCm(intensity, duration, street, campus);
      heights.push(peak);
      const cls = classifyByHeight(peak);

      if (cls.css === "green") counts.safe++;
      else if (cls.css === "yellow") counts.caution++;
      else {
        counts.impassable++;
        impassableCount++;
      }



      // estimate onset: approximate minutes until flood ~ proportional inverse to intensity
      // if intensity is zero, onset is infinity; otherwise rough estimate:
      const onset = intensity > 0 ? Math.max(5, Math.round((50 / (intensity/10)) * street.sensitivity)) : Infinity;
      if (onset < earliestOnsetMin) earliestOnsetMin = onset;

      const descriptiveLabel = getDescriptiveRisk(peak);
      const forecastHeight = mode === 'forecast' && hourData ? (hourData.peaks[street.name]?.height || peak) : peak;
      const forecastDescriptive = getDescriptiveRisk(forecastHeight);

      const row = document.createElement("tr");
      row.innerHTML = `<td>${street.name}</td>
        <td><span class="badge ${cls.css}">${cls.level}</span></td>
        <td>${convertHeight(peak)} ${currentUnit}<br><small style="color:#666;">${descriptiveLabel}</small></td>
        <td>${convertHeight(forecastHeight)} ${currentUnit}<br><small style="color:#666;">${forecastDescriptive}</small></td>`;
      floodTbody.appendChild(row);

      // Add circle for street at midpoint
      const midLat = street.path.reduce((sum, p) => sum + p[0], 0) / street.path.length;
      const midLng = street.path.reduce((sum, p) => sum + p[1], 0) / street.path.length;
      const radius = cls.css === 'green' ? 30 : cls.css === 'yellow' ? 50 : 80; // meters
      const popupContent = `<b>${street.name}</b><br>Risk: ${cls.level}<br>Height: ${convertHeight(peak)} ${currentUnit} <br><small style="color:#666;">${getDescriptiveRisk(peak)}</small>`;
      const streetCircle = L.circle([midLat, midLng], {
        radius: radius,
        color: colorMap[cls.css],
        fillColor: colorMap[cls.css],
        fillOpacity: 0.6,
        weight: 2
      }).bindPopup(popupContent);
      streetCircle.addTo(streetLayer);

      // Add name label (offset slightly)
      const labelOffset = [midLat, midLng + 0.0002];
      const labelIcon = L.divIcon({
        className: 'street-label',
        html: `<div style="background:rgba(255,255,255,0.9); padding:2px 4px; font-size:10px; font-weight:bold; border:1px solid #ccc; border-radius:3px;">${street.name}</div>`,
        iconSize: [null, null],
        iconAnchor: [0, 0]
      });
      L.marker(labelOffset, { icon: labelIcon }).addTo(streetLayer);
    });

      // Update rainfall chart: create a synthetic rainfall curve
      const slices = Math.max(1, Math.ceil(duration / 10));
      rainfallChart.data.labels = Array.from({ length: slices }, (_, i) => `${i * 10}m`);

      const pattern = rainfallPatternSelect.value;
      rainfallChart.data.datasets[0].data = generateRainfallData(pattern, intensity, slices);

      rainfallChart.update();


    // update hazard pie
    hazardChart.data.datasets[0].data = [counts.safe, counts.caution, counts.impassable];
    hazardChart.update();

    // Dynamic model confidence: based on height variance (lower variance = higher confidence)
    if (heights.length > 0) {
      const meanHeight = heights.reduce((sum, h) => sum + h, 0) / heights.length;
      const variance = heights.reduce((sum, h) => sum + Math.pow(h - meanHeight, 2), 0) / heights.length;
      const stdDev = Math.sqrt(variance);
      // Normalize: confidence decreases with stdDev (clamped 70-95%)
      const confidence = Math.max(70, Math.min(95, 90 - (stdDev / 10)));
      kpiAccuracy.textContent = `${confidence.toFixed(0)}%`;
    } else {
      kpiAccuracy.textContent = "N/A";
    }

    // Suspension risk
    const suspensionMessage = (impassableCount / campus.streets.length > 0.3) ? "CLASS SUSPENSION RECOMMENDED" : "Classes On Track";

    // Update banner tiles
    const tileFloodLevel = document.getElementById('tileFloodLevel');
    const tileIntensity = document.getElementById('tileIntensity');
    const tileOnset = document.getElementById('tileOnset');
    const tileRoutes = document.getElementById('tileRoutes');
    const tileStatus = document.getElementById('tileStatus');

    // Average flood level
    const avgFloodLevel = heights.reduce((sum, h) => sum + h, 0) / heights.length;
    const floodDesc = getDescriptiveRisk(avgFloodLevel);
    const floodClass = avgFloodLevel < 20 ? 'safe' : avgFloodLevel < 50 ? 'caution' : 'impassable';
    const floodValue = document.querySelector('#tileFloodLevel .tile-value');
    floodValue.textContent = floodDesc;
    floodValue.className = `tile-value ${floodClass}`;

    // Current intensity
    const intensityClass = intensity < 10 ? 'safe' : intensity < 30 ? 'caution' : 'impassable';
    const intensityValue = document.querySelector('#tileIntensity .tile-value');
    intensityValue.textContent = `${intensity.toFixed(0)} mm/hr`;
    intensityValue.className = `tile-value ${intensityClass}`;

    // Time to onset
    const onsetClass = isFinite(earliestOnsetMin) && earliestOnsetMin < 30 ? 'caution' : isFinite(earliestOnsetMin) && earliestOnsetMin < 10 ? 'impassable' : 'safe';
    const onsetText = isFinite(earliestOnsetMin) ? `${earliestOnsetMin} min` : "N/A";
    const onsetValue = document.querySelector('#tileOnset .tile-value');
    onsetValue.textContent = onsetText;
    onsetValue.className = `tile-value ${onsetClass}`;

    // Passable routes
    const passableCount = counts.safe + counts.caution;
    const routesClass = passableCount < campus.streets.length * 0.5 ? 'impassable' : passableCount < campus.streets.length * 0.8 ? 'caution' : 'safe';
    const routesValue = document.querySelector('#tileRoutes .tile-value');
    routesValue.textContent = `${passableCount}/${campus.streets.length}`;
    routesValue.className = `tile-value ${routesClass}`;

    // Campus status
    const statusClass = counts.impassable > 0 ? 'impassable' : counts.caution > 0 ? 'caution' : 'safe';
    const statusText = counts.impassable > 0 ? 'Critical' : counts.caution > 0 ? 'Caution' : 'Normal';
    const statusValue = document.querySelector('#tileStatus .tile-value');
    statusValue.textContent = statusText;
    statusValue.className = `tile-value ${statusClass}`;

    // Update overlay
    overlay.innerHTML = `Suspension: ${suspensionMessage}`;
    overlay.style.backgroundColor = suspensionMessage.includes('RECOMMENDED') ? 'rgba(239,68,68,0.8)' : 'rgba(34,197,94,0.8)';
    overlay.style.color = 'white';
    overlay.style.display = mode === 'forecast' ? 'block' : 'block';

    // KPIs
    kpiOnset.textContent = isFinite(earliestOnsetMin) ? earliestOnsetMin : "N/A";
    kpiRoutes.textContent = counts.safe + counts.caution; // Passable = safe + caution
    kpiSuspension.textContent = suspensionMessage;

    // Alerts
    if (counts.impassable > 0) {
      alertsDiv.innerHTML = `<strong>Alert:</strong> ${counts.impassable} street(s) are impassable. Recommend evacuation or suspension.`;
      alertsDiv.style.display = 'block';
    } else {
      alertsDiv.style.display = 'none';
    }

    // Map: center on campus + draw 1km buffer circle colored by overall severity
    map.setView(campus.coords, 16);

    // remove existing buffer layer if any
    if (window._campusBuffer) { map.removeLayer(window._campusBuffer); window._campusBuffer = null; }

    // compute an overall average height to decide buffer color
    const overallAvgHeight = (campus.streets.reduce((s, st) => s + expectedFloodHeightCm(intensity, duration, st, campus), 0) / campus.streets.length);
    const overallCls = classifyByHeight(overallAvgHeight);

    window._campusBuffer = L.circle(campus.coords, {
      radius: 300, // meters
      color: colorMap[overallCls.css],
      fillColor: colorMap[overallCls.css],
      fillOpacity: 0.18,
      weight: 2
    }).addTo(map);

    // open popup for campus marker (if any marker exists)
    const marker = markers[campusIndex];
    if (marker) marker.openPopup();
  }

  // hook run button and campus change (clear forecast on change)
  runBtn.addEventListener("click", async () => {
    if (forecastAnimation) {
      clearInterval(forecastAnimation);
      forecastAnimation = null;
    }
    forecastResults.innerHTML = "";
    if (forecastChart) {
      forecastChart.destroy();
      forecastChart = null;
    }
    await runSimulation();
    rankSafestRoutes();
  });
  campusSelect.addEventListener("change", async () => {
    const campusIndex = parseInt(campusSelect.value);
    const campus = campuses[campusIndex];
    updateHistoricalChart(campus);
    if (forecastAnimation) {
      clearInterval(forecastAnimation);
      forecastAnimation = null;
    }
    forecastResults.innerHTML = "";
    if (forecastChart) {
      forecastChart.destroy();
      forecastChart = null;
    }
    await runSimulation();
  });

  // scenario buttons
  document.querySelectorAll(".scenario-btn").forEach(b => {
    b.addEventListener("click", () => {
      intensityInput.value = b.dataset.i;
      durationInput.value = b.dataset.d;
      runSimulation();
      rankSafestRoutes();
    });
  });

  // Forecast control buttons: add start/stop button
  const forecastTabDiv = document.getElementById("forecastTab");
  const forecastControlDiv = document.createElement("div");
  forecastControlDiv.style.marginTop = "10px";
  forecastControlDiv.style.display = "flex";
  forecastControlDiv.style.gap = "10px";

  const startStopBtn = document.createElement("button");
  startStopBtn.textContent = "Start Forecast";
  startStopBtn.className = "run-btn";
  startStopBtn.style.flex = "1";

  const resetBtn = document.createElement("button");
  resetBtn.textContent = "Reset Forecast";
  resetBtn.className = "run-btn";
  resetBtn.style.flex = "1";

  forecastControlDiv.appendChild(startStopBtn);
  forecastControlDiv.appendChild(resetBtn);
  forecastTabDiv.appendChild(forecastControlDiv);

  let forecastRunning = false;

  startStopBtn.addEventListener("click", () => {
    if (!forecastRunning) {
      // Start forecast animation
      const activeScenarioBtn = document.querySelector(".forecast-scenario.active");
      let intensities;
      if (activeScenarioBtn) {
        intensities = getForecastIntensities(activeScenarioBtn.dataset.type);
      } else {
        intensities = getForecastIntensities('moderate');
      }
      runForecast(intensities);
      forecastRunning = true;
      startStopBtn.textContent = "Stop Forecast";
    } else {
      // Stop forecast animation
      if (forecastAnimation) {
        clearInterval(forecastAnimation);
        forecastAnimation = null;
      }
      forecastRunning = false;
      startStopBtn.textContent = "Start Forecast";
    }
  });

  resetBtn.addEventListener("click", async () => {
    if (forecastAnimation) {
      clearInterval(forecastAnimation);
      forecastAnimation = null;
    }
    forecastRunning = false;
    startStopBtn.textContent = "Start Forecast";
    forecastResults.innerHTML = "";
    forecastHourSlider.value = 0;
    await runSimulation();
  });

  // Export button
  exportBtn.addEventListener("click", () => {
    const table = document.getElementById("floodTable");
    let csv = `Street,Risk,Expected Height (${currentUnit}),Forecast Peak (${currentUnit})\n`;
    const rows = table.querySelectorAll("tbody tr");
    rows.forEach(row => {
      const cells = row.querySelectorAll("td");
      csv += Array.from(cells).map(cell => cell.textContent.replace(/,/g, '')).join(",") + "\n";
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flood_results.csv';
    a.click();
    URL.revokeObjectURL(url);
  });

  let forecastAnimation = null;
  let currentHour = 0;
  let hourlyData = []; // Store computed hourly risks

  // Tab switching logic fix: toggle display style instead of class
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const tab = btn.dataset.tab;
      if (tab === "simulation") {
        simulationTab.style.display = "block";
        forecastTab.style.display = "none";
      } else if (tab === "forecast") {
        simulationTab.style.display = "none";
        forecastTab.style.display = "block";
        // Run default forecast if not already run
        if (hourlyData.length === 0) {
          runForecast(getForecastIntensities('moderate'));
        }
      }
    });
  });

  // Forecast slider logic
  forecastHourSlider.addEventListener("input", () => {
    const hour = parseInt(forecastHourSlider.value);
    if (hourlyData[hour]) {
      runSimulation('forecast', hourlyData[hour]);
      rankSafestRoutes(hourlyData[hour].intensity, 60);
    }
  });

  function getForecastIntensities(type) {
    switch (type) {
      case 'clear':
        return Array(24).fill(0);
      case 'moderate':
        return [10, 20, 30, 40, 50, 40, 30, 20, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      case 'severe':
        return [50, 60, 70, 80, 90, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0];
      default:
        return Array(24).fill(0);
    }
  }

  function runForecast(intensities) {
    const campusIndex = parseInt(campusSelect.value);
    const campus = campuses[campusIndex];
    const duration = 60; // 1 hour per step

    // Compute hourly data
    hourlyData = [];
    let allHeights = [];
    let globalPeaks = {};
    for (let h = 0; h < 24; h++) {
      const intensity = intensities[h] || 0;
      const hourData = { hour: h, intensity, avgHeight: 0, maxRisk: 'Safe', peaks: {} };
      let totalHeight = 0;
      let maxCls = { level: 'Safe' };
      campus.streets.forEach(street => {
        const height = expectedFloodHeightCm(intensity, duration, street, campus);
        totalHeight += height;
        const cls = classifyByHeight(height);
        if (cls.level === 'Impassable' || (cls.level === 'Caution' && maxCls.level === 'Safe')) {
          maxCls = cls;
        }
        // Update global peaks
        if (!globalPeaks[street.name] || height > globalPeaks[street.name].height) {
          globalPeaks[street.name] = { height, hour: h };
        }
        // For current hour
        hourData.peaks[street.name] = { height, hour: h };
      });
      hourData.avgHeight = totalHeight / campus.streets.length;
      hourData.maxRisk = maxCls.level;
      allHeights.push(hourData.avgHeight);
      hourlyData.push(hourData);
    }

    // Create timeline chart
    forecastResults.innerHTML = '<canvas id="forecastTimeline" width="400" height="200"></canvas>';
    const forecastCtx = document.getElementById("forecastTimeline").getContext("2d");
    if (forecastChart) forecastChart.destroy();
    forecastChart = new Chart(forecastCtx, {
      type: "line",
      data: {
        labels: Array.from({length: 24}, (_, i) => `Hour ${i}`),
        datasets: [{ label: `Avg Flood Height (${currentUnit})`, data: allHeights.map(h => currentUnit === "ft" ? h / 30.48 : h), borderColor: "#ef4444", fill: false }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

    // Summary table
    let summaryHtml = `<h4>Peak Flood per Street</h4><table><thead><tr><th>Street</th><th>Peak Height (${currentUnit})</th><th>Hour</th></tr></thead><tbody>`;
    campus.streets.forEach(street => {
      const peak = globalPeaks[street.name] || { height: 0, hour: -1 };
      summaryHtml += `<tr><td>${street.name}</td><td>${convertHeight(peak.height)}</td><td>${peak.hour}</td></tr>`;
    });
    summaryHtml += '</tbody></table>';

    const totalRainfall = intensities.reduce((sum, i) => sum + i, 0);
    summaryHtml += `<p><strong>Total Rainfall:</strong> ${totalRainfall.toFixed(1)} mm</p>`;
    summaryHtml += `<p><strong>Source:</strong> Mock Weather API</p>`;
    summaryHtml += `<p><strong>Average Probability:</strong> ${Math.floor(Math.random() * 26) + 70}%</p>`;

    forecastResults.innerHTML += summaryHtml;

    // Start animation
    currentHour = 0;
    runSimulation('forecast', hourlyData[currentHour]);
    if (forecastAnimation) clearInterval(forecastAnimation);
    forecastAnimation = setInterval(() => {
      currentHour = (currentHour + 1) % 24;
      runSimulation('forecast', hourlyData[currentHour]);
      overlay.innerHTML = `Forecast Hour ${currentHour}: Max Risk - ${hourlyData[currentHour].maxRisk}`;
      overlay.style.backgroundColor = hourlyData[currentHour].maxRisk === 'Impassable' ? 'rgba(239,68,68,0.8)' : 
                                     hourlyData[currentHour].maxRisk === 'Caution' ? 'rgba(251,191,36,0.8)' : 'rgba(34,197,94,0.8)';
      overlay.style.display = 'block';
    }, 3000); // 3s per hour
  }



  document.querySelectorAll(".forecast-scenario").forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.type;
      const intensities = getForecastIntensities(type);
      runForecast(intensities);
    });
  });

  // Emergency Hotlines Modal
  const hotlinesModal = document.getElementById("hotlinesModal");
  const hotlinesBtn = document.getElementById("hotlinesBtn");
  const closeBtn = document.querySelector(".close");
  const hotlinesContent = document.getElementById("hotlinesContent");

  hotlinesBtn.addEventListener("click", () => {
    const campusIndex = parseInt(campusSelect.value);
    const campus = campuses[campusIndex];
    const localKey = campus.localHotlinesKey || "manila"; // Default to manila if not specified

    let content = "<h3>National Emergency Hotlines</h3><ul>";
    emergencyHotlines.national.forEach(hotline => {
      content += `<li><strong>${hotline.name}:</strong> ${hotline.number}</li>`;
    });
    content += "</ul>";

    content += `<h3>Local Hotlines (${localKey.charAt(0).toUpperCase() + localKey.slice(1)})</h3><ul>`;
    emergencyHotlines.local[localKey].forEach(hotline => {
      content += `<li><strong>${hotline.name}:</strong> ${hotline.number}</li>`;
    });
    content += "</ul>";

    hotlinesContent.innerHTML = content;
    hotlinesModal.style.display = "block";
  });

  closeBtn.addEventListener("click", () => {
    hotlinesModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === hotlinesModal) {
      hotlinesModal.style.display = "none";
    }
  });

  // Haversine distance function
  function haversine(lat1, lng1, lat2, lng2) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c * 1000; // meters
  }

  // How to Use button
  const howToUseBtn = document.getElementById("howToUseBtn");
  howToUseBtn.addEventListener("click", () => {
    document.getElementById("tutorialModal").style.display = "block";
  });

  // Help icons for guidelines
  const intensityHelp = document.getElementById("intensityHelp");
  intensityHelp.addEventListener("click", () => {
    document.getElementById("guidelinesModal").style.display = "block";
  });

  const durationHelp = document.getElementById("durationHelp");
  durationHelp.addEventListener("click", () => {
    document.getElementById("durationModal").style.display = "block";
  });

  const weatherModeHelp = document.getElementById("weatherModeHelp");
  weatherModeHelp.addEventListener("click", () => {
    document.getElementById("weatherModeModal").style.display = "block";
  });

  const rainfallPatternHelp = document.getElementById("rainfallPatternHelp");
  rainfallPatternHelp.addEventListener("click", () => {
    document.getElementById("rainfallPatternModal").style.display = "block";
  });

  // Tutorial navigation
  let currentStep = 1;
  const totalSteps = 3;

  document.querySelectorAll(".tutorial-next").forEach(btn => {
    btn.addEventListener("click", () => {
      if (currentStep < totalSteps) {
        document.getElementById(`step${currentStep}`).style.display = "none";
        currentStep++;
        document.getElementById(`step${currentStep}`).style.display = "block";
      }
    });
  });

  document.querySelectorAll(".tutorial-prev").forEach(btn => {
    btn.addEventListener("click", () => {
      if (currentStep > 1) {
        document.getElementById(`step${currentStep}`).style.display = "none";
        currentStep--;
        document.getElementById(`step${currentStep}`).style.display = "block";
      }
    });
  });

  document.querySelectorAll(".tutorial-done").forEach(btn => {
    btn.addEventListener("click", () => {
      document.getElementById("tutorialModal").style.display = "none";
      currentStep = 1;
      document.getElementById("step1").style.display = "block";
      document.getElementById("step2").style.display = "none";
      document.getElementById("step3").style.display = "none";
    });
  });

  // Close modals
  document.querySelectorAll(".close").forEach(closeBtn => {
    closeBtn.addEventListener("click", () => {
      document.getElementById("tutorialModal").style.display = "none";
      document.getElementById("guidelinesModal").style.display = "none";
      document.getElementById("durationModal").style.display = "none";
      document.getElementById("weatherModeModal").style.display = "none";
      document.getElementById("rainfallPatternModal").style.display = "none";
      document.getElementById("hotlinesModal").style.display = "none";
      currentStep = 1;
      document.getElementById("step1").style.display = "block";
      document.getElementById("step2").style.display = "none";
      document.getElementById("step3").style.display = "none";
    });
  });

  // Click outside modal to close
  window.addEventListener("click", (event) => {
    if (event.target === document.getElementById("tutorialModal")) {
      document.getElementById("tutorialModal").style.display = "none";
      currentStep = 1;
      document.getElementById("step1").style.display = "block";
      document.getElementById("step2").style.display = "none";
      document.getElementById("step3").style.display = "none";
    }
    if (event.target === document.getElementById("guidelinesModal")) {
      document.getElementById("guidelinesModal").style.display = "none";
    }
    if (event.target === document.getElementById("durationModal")) {
      document.getElementById("durationModal").style.display = "none";
    }
    if (event.target === document.getElementById("weatherModeModal")) {
      document.getElementById("weatherModeModal").style.display = "none";
    }
    if (event.target === document.getElementById("rainfallPatternModal")) {
      document.getElementById("rainfallPatternModal").style.display = "none";
    }
    if (event.target === document.getElementById("hotlinesModal")) {
      document.getElementById("hotlinesModal").style.display = "none";
    }
  });

  // View Street Details Modal
  const viewStreetDetailsBtn = document.getElementById('viewStreetDetailsBtn');
  const streetDetailsModal = document.getElementById('streetDetailsModal');
  const streetDetailsContent = document.getElementById('streetDetailsContent');

  viewStreetDetailsBtn.addEventListener('click', () => {
    const campusIndex = parseInt(campusSelect.value);
    const campus = campuses[campusIndex];
    const intensity = parseFloat(intensityInput.value) || 0;
    const duration = parseFloat(durationInput.value) || 0;

    let content = `<h3>${campus.name} - Street Flood Risk Factors</h3>`;
    content += '<div class="table-container"><table class="street-details-table">';
    content += '<thead><tr><th>Street Name</th><th>Sensitivity</th><th>Soil Saturation</th><th>Drainage Capacity</th><th>Elevation (m)</th><th>Expected Flood Height</th><th>Risk Level</th></tr></thead><tbody>';

    campus.streets.forEach(street => {
      const floodHeight = expectedFloodHeightCm(intensity, duration, street, campus);
      const riskLevel = classifyByHeight(floodHeight);
      const descriptiveRisk = getDescriptiveRisk(floodHeight);

      content += `<tr>
        <td>${street.name}</td>
        <td>${street.sensitivity}</td>
        <td>${street.soilSaturation}</td>
        <td>${street.drainageCapacity}</td>
        <td>${street.elevation}</td>
        <td>${convertHeight(floodHeight)} ${currentUnit}<br><small style="color:#666;">${descriptiveRisk}</small></td>
        <td><span class="badge ${riskLevel.css}">${riskLevel.level}</span></td>
      </tr>`;
    });

    content += '</tbody></table></div>';
    content += '<p><small><em>Sensitivity:</em> How prone the street is to flooding (higher = more prone).<br>';
    content += '<em>Soil Saturation:</em> Current soil moisture level (higher = more saturated).<br>';
    content += '<em>Drainage Capacity:</em> How well the street drains water (higher = better drainage).<br>';
    content += '<em>Elevation:</em> Street height above sea level (higher = less flood risk).</small></p>';

    streetDetailsContent.innerHTML = content;
    streetDetailsModal.style.display = 'block';
  });

  // Close modal when clicking X or outside
  document.querySelectorAll('#streetDetailsModal .close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      streetDetailsModal.style.display = 'none';
    });
  });

  window.addEventListener('click', (event) => {
    if (event.target === streetDetailsModal) {
      streetDetailsModal.style.display = 'none';
    }
  });

  // initial run on load
  (async () => {
    await runSimulation();
  })();

  // Weather Bulletin Functions
  const API_KEY = 'a252b3b7eef4860ca230bb022fbd10cf';
  let LOCATION = 'Manila,PH';

  function getWeatherIcon(iconCode) {
    const iconMap = {
      '01d': 'fas fa-sun', // clear sky day
      '01n': 'fas fa-moon',
      '02d': 'fas fa-cloud-sun',
      '02n': 'fas fa-cloud-moon',
      '03d': 'fas fa-cloud',
      '03n': 'fas fa-cloud',
      '04d': 'fas fa-cloud',
      '04n': 'fas fa-cloud',
      '09d': 'fas fa-cloud-rain',
      '09n': 'fas fa-cloud-rain',
      '10d': 'fas fa-cloud-sun-rain',
      '10n': 'fas fa-cloud-moon-rain',
      '11d': 'fas fa-bolt',
      '11n': 'fas fa-bolt',
      '13d': 'fas fa-snowflake',
      '13n': 'fas fa-snowflake',
      '50d': 'fas fa-smog',
      '50n': 'fas fa-smog'
    };
    return iconMap[iconCode] || 'fas fa-cloud';
  }

  async function fetchWeatherData() {
    try {
      // Fetch current weather
      const currentResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${LOCATION}&appid=${API_KEY}&units=metric`);
      if (!currentResponse.ok) throw new Error('Failed to fetch current weather');
      const currentData = await currentResponse.json();

      // Fetch forecast
      const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${LOCATION}&appid=${API_KEY}&units=metric`);
      if (!forecastResponse.ok) throw new Error('Failed to fetch forecast');
      const forecastData = await forecastResponse.json();

      return {
        current: {
          temp: Math.round(currentData.main.temp),
          condition: currentData.weather[0].main,
          icon: getWeatherIcon(currentData.weather[0].icon),
          humidity: currentData.main.humidity,
          wind: Math.round(currentData.wind.speed * 3.6), // m/s to km/h
          visibility: currentData.visibility ? (currentData.visibility / 1000).toFixed(1) : '10'
        },
        alerts: [], // OpenWeatherMap doesn't provide alerts in free tier
        hourly: forecastData.list.slice(0, 12).map(item => ({
          time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
          temp: Math.round(item.main.temp),
          condition: item.weather[0].main,
          icon: getWeatherIcon(item.weather[0].icon),
          precip: item.rain ? item.rain['3h'] || 0 : 0
        })),
        daily: forecastData.list.filter((_, i) => i % 8 === 0).slice(0, 7).map((item, i) => ({
          day: i === 0 ? 'Today' : new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' }),
          temp: Math.round(item.main.temp),
          condition: item.weather[0].main,
          icon: getWeatherIcon(item.weather[0].icon),
          precip: item.rain ? item.rain['3h'] || 0 : 0
        }))
      };
    } catch (error) {
      console.error('Weather API error:', error);
      // Fallback to mock data on error
      return generateMockWeatherData();
    }
  }

  function generateMockWeatherData() {
    const conditions = [
      { name: 'Sunny', icon: 'fas fa-sun', temp: 28 + Math.floor(Math.random() * 8) },
      { name: 'Partly Cloudy', icon: 'fas fa-cloud-sun', temp: 26 + Math.floor(Math.random() * 6) },
      { name: 'Cloudy', icon: 'fas fa-cloud', temp: 24 + Math.floor(Math.random() * 4) },
      { name: 'Light Rain', icon: 'fas fa-cloud-rain', temp: 22 + Math.floor(Math.random() * 4) },
      { name: 'Heavy Rain', icon: 'fas fa-cloud-showers-heavy', temp: 20 + Math.floor(Math.random() * 3) }
    ];

    const current = conditions[Math.floor(Math.random() * conditions.length)];
    return {
      current: {
        temp: current.temp,
        condition: current.name,
        icon: current.icon,
        humidity: 65 + Math.floor(Math.random() * 20),
        wind: 10 + Math.floor(Math.random() * 15),
        visibility: 8 + Math.floor(Math.random() * 4)
      },
      alerts: Math.random() > 0.7 ? [{
        title: 'Heavy Rain Warning',
        message: 'Heavy rainfall expected in the next 24 hours. Monitor flood conditions closely.'
      }] : [],
      hourly: Array.from({ length: 24 }, (_, i) => {
        const hour = new Date();
        hour.setHours(hour.getHours() + i);
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        return {
          time: hour.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
          temp: condition.temp,
          condition: condition.name,
          icon: condition.icon,
          precip: Math.random() * 10
        };
      }),
      daily: Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        return {
          day: i === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'long' }),
          temp: condition.temp,
          condition: condition.name,
          icon: condition.icon,
          precip: Math.random() * 15
        };
      })
    };
  }

  async function updateWeatherDisplay() {
    const weatherData = await fetchWeatherData();

    // Current weather
    document.getElementById('currentTemp').textContent = weatherData.current.temp;
    document.getElementById('currentCondition').textContent = weatherData.current.condition;
    document.getElementById('currentIcon').className = weatherData.current.icon;
    document.getElementById('currentHumidity').textContent = `${weatherData.current.humidity}%`;
    document.getElementById('currentWind').textContent = `${weatherData.current.wind} km/h`;
    document.getElementById('currentVisibility').textContent = `${weatherData.current.visibility} km`;

    // Weather alerts (mock for now since API doesn't provide)
    const alertsContainer = document.getElementById('weatherAlerts');
    alertsContainer.innerHTML = '';
    if (weatherData.alerts.length > 0) {
      weatherData.alerts.forEach(alert => {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert-item warning';
        alertDiv.innerHTML = `
          <i class="fas fa-exclamation-circle"></i>
          <div class="alert-content">
            <strong>${alert.title}</strong>
            <p>${alert.message}</p>
          </div>
        `;
        alertsContainer.appendChild(alertDiv);
      });
    } else {
      const noAlertDiv = document.createElement('div');
      noAlertDiv.className = 'alert-item';
      noAlertDiv.innerHTML = `
        <i class="fas fa-check-circle" style="color: var(--green);"></i>
        <div class="alert-content">
          <strong>No Active Weather Alerts</strong>
          <p>Weather conditions are currently stable.</p>
        </div>
      `;
      alertsContainer.appendChild(noAlertDiv);
    }

    // Hourly forecast
    const hourlyContainer = document.getElementById('hourlyForecast');
    hourlyContainer.innerHTML = '';
    weatherData.hourly.forEach(hour => {
      const hourDiv = document.createElement('div');
      hourDiv.className = 'hourly-item';
      hourDiv.innerHTML = `
        <span class="forecast-time">${hour.time}</span>
        <i class="${hour.icon} forecast-icon"></i>
        <span class="forecast-temp">${hour.temp}°</span>
        <span class="forecast-desc">${hour.condition}</span>
      `;
      hourlyContainer.appendChild(hourDiv);
    });

    // 7-day forecast
    const dailyContainer = document.getElementById('weeklyForecast');
    dailyContainer.innerHTML = '';
    weatherData.daily.forEach(day => {
      const dayDiv = document.createElement('div');
      dayDiv.className = 'daily-item';
      dayDiv.innerHTML = `
        <span class="forecast-time">${day.day}</span>
        <i class="${day.icon} forecast-icon"></i>
        <span class="forecast-temp">${day.temp}°</span>
        <span class="forecast-desc">${day.condition}</span>
      `;
      dailyContainer.appendChild(dayDiv);
    });

    // Impact analysis based on current weather
    const floodRisk = weatherData.current.temp < 25 || weatherData.alerts.length > 0 ? 'high' : 'medium';
    const precipRate = weatherData.hourly[0].precip.toFixed(1);
    const stormSurge = weatherData.current.wind > 20 ? 'high' : weatherData.current.wind > 15 ? 'medium' : 'low';

    document.getElementById('floodRiskLevel').textContent = floodRisk.charAt(0).toUpperCase() + floodRisk.slice(1);
    document.getElementById('floodRiskLevel').className = `impact-value ${floodRisk}`;
    document.getElementById('precipitationRate').textContent = `${precipRate} mm/hr`;
    document.getElementById('stormSurge').textContent = stormSurge.charAt(0).toUpperCase() + stormSurge.slice(1);
    document.getElementById('stormSurge').className = `impact-value ${stormSurge}`;
  }

  // Historical weather chart
  function createHistoricalWeatherChart() {
    const ctx = document.getElementById('historicalWeatherChart').getContext('2d');
    const historicalData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Average Rainfall (mm)',
        data: [45, 38, 52, 68, 89, 112, 134, 145, 123, 98, 76, 54],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }, {
        label: 'Flood Events',
        data: [2, 1, 3, 4, 6, 8, 12, 15, 10, 7, 4, 3],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y1'
      }]
    };

    new Chart(ctx, {
      type: 'line',
      data: historicalData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Rainfall (mm)'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Flood Events'
            },
            grid: {
              drawOnChartArea: false,
            },
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        }
      }
    });
  }

  // Location selector functionality
  const locationSelect = document.getElementById('locationSelect');
  if (locationSelect) {
    locationSelect.addEventListener('change', function() {
      LOCATION = this.value;
      const locationText = this.options[this.selectedIndex].text;
      document.getElementById('weatherLocation').textContent = locationText;
      updateWeatherDisplay();
    });
  }

  // Global functions for weather actions
  window.refreshWeather = function() {
    updateWeatherDisplay();
    alert('Weather data refreshed!');
  };

  window.exportWeatherData = function() {
    const weatherData = generateMockWeatherData();
    const csvContent = `Weather Report - ${new Date().toLocaleDateString()}\n\nCurrent Conditions:\nTemperature: ${weatherData.current.temp}°C\nCondition: ${weatherData.current.condition}\nHumidity: ${weatherData.current.humidity}%\nWind: ${weatherData.current.wind} km/h\n\nHourly Forecast:\n${weatherData.hourly.map(h => `${h.time}: ${h.temp}°C, ${h.condition}`).join('\n')}\n\nDaily Forecast:\n${weatherData.daily.map(d => `${d.day}: ${d.temp}°C, ${d.condition}`).join('\n')}`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weather_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Initialize weather data when weather bulletin is shown
  const weatherSection = document.getElementById('weather-bulletin');
  if (weatherSection && weatherSection.classList.contains('active')) {
    updateWeatherDisplay();
    createHistoricalWeatherChart();
  }

  // Update weather when navigating to weather bulletin
  const originalNavigateToSection = window.navigateToSection;
  window.navigateToSection = function(targetSection) {
    originalNavigateToSection(targetSection);
    if (targetSection === 'weather-bulletin') {
      setTimeout(() => {
        updateWeatherDisplay();
        createHistoricalWeatherChart();
      }, 400);
    }
  };

  // Pathfinding to safe zone using A* on street graph
  function findPathToSafeZone() {
    const campusIndex = parseInt(campusSelect.value);
    const campus = campuses[campusIndex];
    const intensity = parseFloat(intensityInput.value) || 0;
    const duration = parseFloat(durationInput.value) || 0;

    // Clear previous paths
    pathLayer.clearLayers();

    // Find nearest safe zone
    let nearestSafeZone = null;
    let minDist = Infinity;
    campus.safeZones.forEach(sz => {
      const dist = haversine(campus.coords[0], campus.coords[1], sz.coords[0], sz.coords[1]);
      if (dist < minDist) {
        minDist = dist;
        nearestSafeZone = sz;
      }
    });

    if (!nearestSafeZone) return;

    // Build graph: nodes are streets + campus + safeZone
    const nodes = campus.streets.map(street => ({
      id: street.name,
      coords: street.path[street.path.length - 1], // use end for heuristic
      risk: classifyByHeight(expectedFloodHeightCm(intensity, duration, street, campus)).level,
      path: street.path
    }));
    nodes.push({ id: 'campus', coords: campus.coords, risk: 'Safe', path: [campus.coords] });
    nodes.push({ id: 'safeZone', coords: nearestSafeZone.coords, risk: 'Safe', path: [nearestSafeZone.coords] });

    const graph = {};
    nodes.forEach(node => {
      graph[node.id] = [];
    });

    // Connect streets based on proximity
    campus.streets.forEach(street => {
      const node = nodes.find(n => n.id === street.name);
      campus.streets.forEach(other => {
        if (street.name !== other.name) {
          const otherNode = nodes.find(n => n.id === other.name);
          const dist1 = haversine(node.coords[0], node.coords[1], otherNode.path[0][0], otherNode.path[0][1]);
          const dist2 = haversine(node.coords[0], node.coords[1], otherNode.coords[0], otherNode.coords[1]);
          const minDist = Math.min(dist1, dist2);
          if (minDist < 1000) { // increased threshold
            let weight = minDist;
            if (node.risk === 'Impassable' || otherNode.risk === 'Impassable') weight = 10000; // High cost but traversable
            else if (node.risk === 'Caution' || otherNode.risk === 'Caution') weight *= 2;
            graph[node.id].push({ to: other.id, weight });
          }
        }
      });
    });

    // Connect campus to all nearby streets (within 500m)
    nodes.forEach(node => {
      if (node.id !== 'campus' && node.id !== 'safeZone') {
        const dist = haversine(campus.coords[0], campus.coords[1], node.path[0][0], node.path[0][1]);
        if (dist < 500) {
          let weight = dist;
          const street = campus.streets.find(s => s.name === node.id);
          const streetRisk = classifyByHeight(expectedFloodHeightCm(intensity, duration, street, campus)).level;
          if (streetRisk === 'Impassable') weight = dist + 10000;
          else if (streetRisk === 'Caution') weight = dist * 2;
          graph['campus'].push({ to: node.id, weight });
        }
      }
    });

    // Connect all nearby streets to safeZone (within 500m)
    nodes.forEach(node => {
      if (node.id !== 'campus' && node.id !== 'safeZone') {
        const dist = haversine(nearestSafeZone.coords[0], nearestSafeZone.coords[1], node.coords[0], node.coords[1]);
        if (dist < 500) {
          let weight = dist;
          const street = campus.streets.find(s => s.name === node.id);
          const streetRisk = classifyByHeight(expectedFloodHeightCm(intensity, duration, street, campus)).level;
          if (streetRisk === 'Impassable') weight = dist + 10000;
          else if (streetRisk === 'Caution') weight = dist * 2;
          graph[node.id].push({ to: 'safeZone', weight });
        }
      }
    });

    // A* algorithm
    function aStar(start, goal, graph) {
      const openSet = [start];
      const cameFrom = {};
      const gScore = {};
      const fScore = {};
      gScore[start] = 0;
      fScore[start] = haversine(nodes.find(n => n.id === start).coords[0], nodes.find(n => n.id === start).coords[1], nodes.find(n => n.id === goal).coords[0], nodes.find(n => n.id === goal).coords[1]);
      while (openSet.length > 0) {
        const current = openSet.reduce((a, b) => (fScore[a] || Infinity) < (fScore[b] || Infinity) ? a : b);
        if (current === goal) {
          const path = [current];
          let temp = current;
          while (cameFrom[temp]) {
            temp = cameFrom[temp];
            path.unshift(temp);
          }
          return path;
        }
        openSet.splice(openSet.indexOf(current), 1);
        graph[current].forEach(neighbor => {
          const tentativeG = gScore[current] + neighbor.weight;
          if (tentativeG < (gScore[neighbor.to] || Infinity)) {
            cameFrom[neighbor.to] = current;
            gScore[neighbor.to] = tentativeG;
            fScore[neighbor.to] = tentativeG + haversine(nodes.find(n => n.id === neighbor.to).coords[0], nodes.find(n => n.id === neighbor.to).coords[1], nodes.find(n => n.id === goal).coords[0], nodes.find(n => n.id === goal).coords[1]);
            if (!openSet.includes(neighbor.to)) openSet.push(neighbor.to);
          }
        });
      }
      return null; // no path
    }

    const pathNodes = aStar('campus', 'safeZone', graph);
    if (!pathNodes) {
      alert("No safe path found to a safe zone.");
      return;
    }

    // Draw the path: straight lines between nodes
    const pathCoords = pathNodes.map(nodeId => nodes.find(n => n.id === nodeId).coords);
    // Remove consecutive duplicates
    const uniqueCoords = pathCoords.filter((coord, index, arr) => index === 0 || coord[0] !== arr[index-1][0] || coord[1] !== arr[index-1][1]);

    const pathLine = L.polyline(uniqueCoords, {
      color: 'blue',
      weight: 5,
      opacity: 0.8
    }).addTo(pathLayer);

    // Add markers
    L.marker(campus.coords).addTo(pathLayer).bindPopup(`Start: ${campus.name}`);
    L.marker(nearestSafeZone.coords).addTo(pathLayer).bindPopup(`Safe Zone: ${nearestSafeZone.name} (${nearestSafeZone.type})`);

  // Fit map to path
    map.fitBounds(pathLine.getBounds());
  }

  // Emergency Hub Functions
  function initializeEmergencyHub() {
    loadEmergencyContacts();
    loadEvacuationRoutes();
    initializeEmergencyKit();
  }

  function loadEmergencyContacts() {
    const contactsContent = document.getElementById('contactsContent');
    const nationalContacts = emergencyHotlines.national;

    const localContacts = [
      ...emergencyHotlines.local.manila,
      ...emergencyHotlines.local.makati,
      ...emergencyHotlines.local.quezoncity
    ];

    function renderContacts(contacts) {
      contactsContent.innerHTML = '';
      contacts.forEach(contact => {
        const contactDiv = document.createElement('div');
        contactDiv.className = 'contact-item';
        contactDiv.innerHTML = `
          <span class="contact-name">${contact.name}</span>
          <span class="contact-number">${contact.number}</span>
        `;
        contactsContent.appendChild(contactDiv);
      });
    }

    // Initial load
    renderContacts(nationalContacts);

    // Tab switching
    const contactTabs = document.querySelectorAll('.contact-tab');
    contactTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        contactTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        if (this.dataset.contact === 'national') {
          renderContacts(nationalContacts);
        } else {
          renderContacts(localContacts);
        }
      });
    });
  }

  function loadEvacuationRoutes() {
    const evacuationSelect = document.getElementById('evacuationCampusSelect');
    const routeList = document.getElementById('routeList');

    const routes = {
      dlsu: [
        'Exit through main gate and head north towards Taft Avenue',
        'Turn right onto Pedro Gil Street and proceed to CCP Complex',
        'Use designated pedestrian walkways to avoid flooded areas',
        'Proceed to SM Mall of Asia evacuation center if needed'
      ],
      ust: [
        'Exit through España Boulevard towards Lerma Street',
        'Head west towards Recto Avenue and proceed to Quiapo Church area',
        'Use elevated walkways to avoid low-lying areas near Pasig River',
        'Proceed to Chinese General Hospital or EARIST Gymnasium'
      ],
      mapua_manila: [
        'Exit through General Luna Street towards Intramuros walls',
        'Head north towards Bonifacio Drive and Rizal Park',
        'Use elevated pedestrian bridges to cross busy streets',
        'Proceed to Philippine General Hospital or Manila City Hall'
      ],
      mapua_makati: [
        'Exit through Pablo Ocampo Street towards Chino Roces Avenue',
        'Head south towards Ayala Avenue and proceed to Makati CBD',
        'Use covered walkways and avoid low-lying areas near Pasig River tributaries',
        'Proceed to Makati Medical Center or nearby schools'
      ],
      upd: [
        'Exit through University Avenue towards Katipunan Road',
        'Head south towards Ateneo de Manila University campus',
        'Use the elevated pedestrian bridge to cross Katipunan',
        'Proceed to Quezon City Hall evacuation center'
      ]
    };

    function updateRoutes() {
      const selectedCampus = evacuationSelect.value;
      const campusRoutes = routes[selectedCampus];

      routeList.innerHTML = '<ol>';
      campusRoutes.forEach(route => {
        routeList.innerHTML += `<li>${route}</li>`;
      });
      routeList.innerHTML += '</ol>';
    }

    // Initial load
    updateRoutes();

    // Campus selection change
    evacuationSelect.addEventListener('change', updateRoutes);
  }

  function initializeEmergencyKit() {
    // Emergency kit functionality will be handled by existing HTML
  }

  // Global Emergency Hub Functions
  window.refreshAlerts = function() {
    const alertsContainer = document.getElementById('emergencyAlerts');
    const mockAlerts = [
      {
        type: 'info',
        title: 'System Status: Normal',
        message: 'All emergency systems are operational. No active alerts at this time.'
      },
      {
        type: 'warning',
        title: 'Weather Advisory',
        message: 'Heavy rain expected in Metro Manila. Monitor local weather updates.'
      }
    ];

    const randomAlert = mockAlerts[Math.floor(Math.random() * mockAlerts.length)];
    alertsContainer.innerHTML = `
      <div class="alert-item ${randomAlert.type}">
        <i class="fas fa-${randomAlert.type === 'info' ? 'info-circle' : 'exclamation-circle'}"></i>
        <div class="alert-content">
          <strong>${randomAlert.title}</strong>
          <p>${randomAlert.message}</p>
        </div>
      </div>
    `;
    alert('Emergency alerts refreshed!');
  };

  window.updateResources = function() {
    const statuses = ['available', 'limited', 'unavailable'];
    const statusTexts = {
      available: ['Well Stocked', 'Adequate', '15 Available'],
      limited: ['Limited Stock', 'Low Supply', '5 Available'],
      unavailable: ['Out of Stock', 'Unavailable', '0 Available']
    };

    document.querySelectorAll('.resource-status').forEach((statusEl, index) => {
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      statusEl.className = `resource-status ${randomStatus}`;
      statusEl.textContent = statusTexts[randomStatus][index % 3];
    });
    alert('Resource status updated!');
  };

  window.printChecklist = function() {
    const checklistItems = document.querySelectorAll('.kit-category input[type="checkbox"]');
    let checkedItems = [];
    let uncheckedItems = [];

    checklistItems.forEach(item => {
      const label = item.parentElement.textContent.trim();
      if (item.checked) {
        checkedItems.push(label);
      } else {
        uncheckedItems.push(label);
      }
    });

    const printContent = `
      <h2>Emergency Kit Checklist</h2>
      <h3>Prepared Items:</h3>
      <ul>${checkedItems.map(item => `<li>${item}</li>`).join('')}</ul>
      <h3>Items Still Needed:</h3>
      <ul>${uncheckedItems.map(item => `<li>${item}</li>`).join('')}</ul>
      <p>Generated on: ${new Date().toLocaleString()}</p>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Emergency Kit Checklist</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h2 { color: #1e40af; }
            h3 { color: #374151; margin-top: 20px; }
            ul { margin: 10px 0; }
            li { margin: 5px 0; }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  window.resetChecklist = function() {
    if (confirm('Are you sure you want to reset the checklist?')) {
      document.querySelectorAll('.kit-category input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
      });
    }
  };

  window.activateEmergencyMode = function() {
    if (confirm('Activate Emergency Mode? This will notify all emergency contacts and activate response protocols.')) {
      alert('Emergency Mode Activated!\n\n- Emergency contacts notified\n- Response teams deployed\n- Public alerts sent\n- Monitoring systems activated');
    }
  };

  window.contactEmergency = function() {
    const emergencyNumber = '911';
    if (confirm(`Call emergency services at ${emergencyNumber}?`)) {
      window.location.href = `tel:${emergencyNumber}`;
    }
  };

  // Initialize Emergency Hub when navigating to it
  const emergencySection = document.getElementById('emergency-hub');
  if (emergencySection && emergencySection.classList.contains('active')) {
    initializeEmergencyHub();
  }

  // Update emergency hub when navigating to emergency hub section
  window.navigateToSection = function(targetSection) {
    // Call original function if it exists
    if (originalNavigateToSection) {
      originalNavigateToSection(targetSection);
    } else {
      // Fallback navigation
      document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
      });
      document.getElementById(targetSection).classList.add('active');

      // Update nav links
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
      });
      document.querySelector(`[data-section="${targetSection}"]`).classList.add('active');
    }

    // Initialize specific sections
    if (targetSection === 'weather-bulletin') {
      setTimeout(() => {
        updateWeatherDisplay();
        createHistoricalWeatherChart();
      }, 400);
    } else if (targetSection === 'emergency-hub') {
      setTimeout(() => {
        initializeEmergencyHub();
      }, 400);
    }
  };
});
