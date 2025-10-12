window.addEventListener("DOMContentLoaded", () => {
  // Map init
  const map = L.map("map").setView([14.6098, 120.9896], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
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
  const rainfallChart = new Chart(rainfallCtx, {
    type: "line",
    data: { labels: [], datasets: [{ label: "Intensity (mm/hr)", data: [], borderColor: "#365a9b", fill: false }] },
    options: { responsive: true, maintainAspectRatio: false }
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
      const height = expectedFloodHeightCm(intensity, duration, street.sensitivity, campus);
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

  function expectedFloodHeightCm(intensity, durationMin, sensitivity, historical) {
    const avgs = getHistoricalAvg(historical);
    const durationHours = durationMin / 60;
    const raw = avgs.avgFlood * (intensity / avgs.avgRain) * sensitivity * durationHours;
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
  function runSimulation(mode = 'sim', hourData = null) {
    const campusIndex = parseInt(campusSelect.value);
    const campus = campuses[campusIndex];
    let intensity = parseFloat(intensityInput.value) || 0;
    let duration = parseFloat(durationInput.value) || 0;

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
      const peak = expectedFloodHeightCm(intensity, duration, street.sensitivity, campus);
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
    const overallAvgHeight = (campus.streets.reduce((s, st) => s + expectedFloodHeightCm(intensity, duration, st.sensitivity, campus), 0) / campus.streets.length);
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
  runBtn.addEventListener("click", () => {
    if (forecastAnimation) {
      clearInterval(forecastAnimation);
      forecastAnimation = null;
    }
    forecastResults.innerHTML = "";
    if (forecastChart) {
      forecastChart.destroy();
      forecastChart = null;
    }
    runSimulation();
    rankSafestRoutes();
  });
  campusSelect.addEventListener("change", () => {
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
    runSimulation();
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

  resetBtn.addEventListener("click", () => {
    if (forecastAnimation) {
      clearInterval(forecastAnimation);
      forecastAnimation = null;
    }
    forecastRunning = false;
    startStopBtn.textContent = "Start Forecast";
    forecastResults.innerHTML = "";
    forecastHourSlider.value = 0;
    runSimulation();
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
        const height = expectedFloodHeightCm(intensity, duration, street.sensitivity, campus);
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

  // Help icon for rainfall guidelines
  const intensityHelp = document.getElementById("intensityHelp");
  intensityHelp.addEventListener("click", () => {
    document.getElementById("guidelinesModal").style.display = "block";
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
    if (event.target === document.getElementById("hotlinesModal")) {
      document.getElementById("hotlinesModal").style.display = "none";
    }
  });

  // initial run on load
  runSimulation();

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
      risk: classifyByHeight(expectedFloodHeightCm(intensity, duration, street.sensitivity, campus)).level,
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
          const streetRisk = classifyByHeight(expectedFloodHeightCm(intensity, duration, campus.streets.find(s => s.name === node.id).sensitivity, campus)).level;
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
          const streetRisk = classifyByHeight(expectedFloodHeightCm(intensity, duration, campus.streets.find(s => s.name === node.id).sensitivity, campus)).level;
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
});
