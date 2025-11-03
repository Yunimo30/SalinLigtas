// Evacuation Map System

class EvacuationMapSystem {
    constructor() {
        this.map = null;
        this.routes = {};
        this.markers = [];
        this.currentCampus = null;

        this.campusData = {
            'dlsu': {
                name: 'De La Salle University',
                center: [14.5647, 120.9939],
                routes: [
                    {
                        name: 'Main Gate Route',
                        path: [
                            [14.5647, 120.9933],
                            [14.5645, 120.9935],
                            [14.5643, 120.9937]
                        ],
                        type: 'primary',
                        instructions: [
                            'Exit through the main gate',
                            'Head north on Taft Avenue',
                            'Proceed to the designated assembly point'
                        ]
                    },
                    {
                        name: 'South Gate Route',
                        path: [
                            [14.5640, 120.9933],
                            [14.5638, 120.9935],
                            [14.5636, 120.9937]
                        ],
                        type: 'secondary',
                        instructions: [
                            'Exit through the south gate',
                            'Head south on Taft Avenue',
                            'Turn right at the first intersection'
                        ]
                    }
                ],
                assemblyPoints: [
                    {
                        name: 'Main Assembly Point',
                        coordinates: [14.5650, 120.9935],
                        capacity: 1000
                    },
                    {
                        name: 'Secondary Assembly Point',
                        coordinates: [14.5635, 120.9940],
                        capacity: 500
                    }
                ]
            },
            'ust': {
                name: 'University of Santo Tomas',
                center: [14.6098, 120.9894],
                routes: [
                    {
                        name: 'Main Gate Route',
                        path: [
                            [14.6099, 120.9888],
                            [14.6097, 120.9890],
                            [14.6095, 120.9892]
                        ],
                        type: 'primary',
                        instructions: [
                            'Exit through the main gate',
                            'Head east on España Boulevard',
                            'Proceed to the designated assembly point'
                        ]
                    }
                ],
                assemblyPoints: [
                    {
                        name: 'Main Assembly Point',
                        coordinates: [14.6102, 120.9890],
                        capacity: 1200
                    }
                ]
            },
            'up': {
                name: 'University of the Philippines',
                center: [14.6538, 121.0682],
                routes: [
                    {
                        name: 'Academic Oval Route',
                        path: [
                            [14.6547, 121.0645],
                            [14.6545, 121.0647],
                            [14.6543, 121.0649]
                        ],
                        type: 'primary',
                        instructions: [
                            'Exit through nearest building exit',
                            'Head to the Academic Oval',
                            'Follow marshals to the assembly point'
                        ]
                    }
                ],
                assemblyPoints: [
                    {
                        name: 'Sunken Garden',
                        coordinates: [14.6550, 121.0647],
                        capacity: 2000
                    }
                ]
            },
            'mapua-makati': {
                name: 'Mapua Makati',
                center: [14.5660, 121.0150],
                routes: [
                    {
                        name: 'Main Exit Route',
                        path: [
                            [14.5576, 121.0252],
                            [14.5574, 121.0254],
                            [14.5572, 121.0256]
                        ],
                        type: 'primary',
                        instructions: [
                            'Exit through the main building entrance',
                            'Head towards Pablo Ocampo Sr. Street',
                            'Proceed to the designated assembly point'
                        ]
                    }
                ],
                assemblyPoints: [
                    {
                        name: 'Main Assembly Point',
                        coordinates: [14.5578, 121.0254],
                        capacity: 800
                    }
                ]
            },
            'mapua-intramuros': {
                name: 'Mapua Intramuros',
                center: [14.5900, 120.9775],
                routes: [
                    {
                        name: 'Main Gate Route',
                        path: [
                            [14.5917, 120.9738],
                            [14.5915, 120.9740],
                            [14.5913, 120.9742]
                        ],
                        type: 'primary',
                        instructions: [
                            'Exit through the main gate',
                            'Head towards Muralla Street',
                            'Proceed to the designated assembly point'
                        ]
                    }
                ],
                assemblyPoints: [
                    {
                        name: 'Main Assembly Point',
                        coordinates: [14.5919, 120.9740],
                        capacity: 1000
                    }
                ]
            }
        };
    }

    initializeMap(campusId) {
        // Wait for the map container to be ready
        const mapContainer = document.getElementById('evacuationMap');
        if (!mapContainer) {
            console.error('Map container not found');
            return;
        }

        // If map already exists, just update the view
        if (this.map) {
            this.clearMap();
            if (this.currentCampus) {
                this.map.setView(this.currentCampus.center, 17);
            }
            return;
        }

        // Initialize new map
        this.map = L.map('evacuationMap', {
            zoomControl: true,
            scrollWheelZoom: true,
            minZoom: 15,
            maxZoom: 19
        });

        // Add the tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
            maxNativeZoom: 19,
            tileSize: 256
        }).addTo(this.map);

        // Force a resize after initialization
        setTimeout(() => {
            this.map.invalidateSize(true);
        }, 100);

        // Clear existing markers and routes
        this.clearMap();

        // Set the current campus
        this.currentCampus = this.campusData[campusId];
        if (!this.currentCampus) return;

        // Set map view to campus center
        this.map.setView(this.currentCampus.center, 17);

        // Add evacuation routes
        this.addEvacuationRoutes();

        // Add assembly points
        this.addAssemblyPoints();

        // Update route list
        this.updateRouteList();
    }

    updateMapView(campusId) {
        if (!this.map || !this.campusData[campusId]) return;

        // Set current campus
        this.currentCampus = this.campusData[campusId];

        // Clear existing markers and routes
        this.clearMap();

        // Set view to new campus
        this.map.setView(this.currentCampus.center, 17);
        
        // Add routes and assembly points
        this.addEvacuationRoutes();
        this.addAssemblyPoints();
        
        // Update route list
        this.updateRouteList();

        // Force a map refresh
        setTimeout(() => {
            this.map.invalidateSize(true);
        }, 100);
    }

    clearMap() {
        // Clear existing markers
        this.markers.forEach(marker => marker.remove());
        this.markers = [];

        // Clear existing routes
        Object.values(this.routes).forEach(route => route.remove());
        this.routes = {};
    }

    addEvacuationRoutes() {
        this.currentCampus.routes.forEach((route, index) => {
            // Create the polyline for the route
            const routeLine = L.polyline(route.path, {
                color: route.type === 'primary' ? '#ff4444' : '#ff8800',
                weight: route.type === 'primary' ? 4 : 3,
                opacity: 0.8
            }).addTo(this.map);

            // Add route to the routes object
            this.routes[index] = routeLine;

            // Add a popup with route information
            routeLine.bindPopup(`
                <strong>${route.name}</strong><br>
                Type: ${route.type}<br>
                <button onclick="showRouteInstructions(${index})">View Instructions</button>
            `);
        });
    }

    addAssemblyPoints() {
        this.currentCampus.assemblyPoints.forEach(point => {
            // Create marker for assembly point
            const marker = L.marker(point.coordinates, {
                icon: L.divIcon({
                    className: 'assembly-point-marker',
                    html: '<i class="fas fa-flag"></i>',
                    iconSize: [25, 25]
                })
            }).addTo(this.map);

            // Add popup with assembly point information
            marker.bindPopup(`
                <strong>${point.name}</strong><br>
                Capacity: ${point.capacity} people
            `);

            // Store marker reference
            this.markers.push(marker);
        });
    }

    updateRouteList() {
        const routeList = document.getElementById('routeList');
        if (!routeList) return;

        let html = '<div class="route-list">';
        this.currentCampus.routes.forEach((route, index) => {
            html += `
                <div class="route-item" onclick="highlightRoute(${index})">
                    <div class="route-header">
                        <i class="fas fa-route"></i>
                        <span>${route.name}</span>
                        <span class="route-type ${route.type}">${route.type}</span>
                    </div>
                    <div class="route-instructions">
                        <ol>
                            ${route.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
                        </ol>
                    </div>
                </div>
            `;
        });
        html += '</div>';

        // Add assembly points information
        html += '<div class="assembly-points">';
        html += '<h4><i class="fas fa-flag"></i> Assembly Points</h4>';
        this.currentCampus.assemblyPoints.forEach(point => {
            html += `
                <div class="assembly-point-item">
                    <strong>${point.name}</strong>
                    <div>Capacity: ${point.capacity} people</div>
                </div>
            `;
        });
        html += '</div>';

        routeList.innerHTML = html;
    }

    highlightRoute(routeIndex) {
        // Reset all routes to default style
        Object.values(this.routes).forEach(route => {
            route.setStyle({
                weight: 3,
                opacity: 0.8
            });
        });

        // Highlight selected route
        const selectedRoute = this.routes[routeIndex];
        if (selectedRoute) {
            selectedRoute.setStyle({
                weight: 5,
                opacity: 1
            });
            selectedRoute.openPopup();
        }
    }

    showRouteInstructions(routeIndex) {
        const route = this.currentCampus.routes[routeIndex];
        if (!route) return;

        // Create or update instructions display
        const instructionsElement = document.createElement('div');
        instructionsElement.className = 'route-instructions-popup';
        instructionsElement.innerHTML = `
            <h4>${route.name} Instructions</h4>
            <ol>
                ${route.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
            </ol>
            <button onclick="this.parentElement.remove()">Close</button>
        `;

        // Add to the map container
        document.getElementById('evacuationMap').appendChild(instructionsElement);
    }
}

// Initialize evacuation map
document.addEventListener('DOMContentLoaded', () => {
    const evacuationSystem = new EvacuationMapSystem();
    
    // Set up campus selector
    const campusSelect = document.getElementById('evacuationCampusSelect');
    if (campusSelect) {
        // Populate campus options
        Object.keys(evacuationSystem.campusData).forEach(campusId => {
            const option = document.createElement('option');
            option.value = campusId;
            option.textContent = evacuationSystem.campusData[campusId].name || campusId.toUpperCase();
            campusSelect.appendChild(option);
        });

        // Handle campus selection
        campusSelect.addEventListener('change', (e) => {
            const selectedCampus = e.target.value;
            if (!evacuationSystem.map) {
                evacuationSystem.initializeMap(selectedCampus);
            } else {
                evacuationSystem.updateMapView(selectedCampus);
            }
            
            // Update emergency contacts for the selected campus
            if (window.emergencySystem) {
                window.emergencySystem.setCurrentCampus(selectedCampus);
            }

            // Force map resize after a short delay
            setTimeout(() => {
                if (evacuationSystem.map) {
                    evacuationSystem.map.invalidateSize(true);
                }
            }, 200);
        });

        // Initialize with first campus
        if (campusSelect.options.length > 0) {
            evacuationSystem.initializeMap(campusSelect.options[0].value);
        }
    }

    // Expose functions needed by the HTML
    window.highlightRoute = (routeIndex) => evacuationSystem.highlightRoute(routeIndex);
    window.showRouteInstructions = (routeIndex) => evacuationSystem.showRouteInstructions(routeIndex);
});