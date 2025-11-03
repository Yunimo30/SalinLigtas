// ValidationController class
class ValidationController {
    constructor() {
        this.lastValidationResults = null;
    }

    async validateCoordinates() {
        const campusSelect = document.getElementById('campusSelect');
        console.log('Campus Select:', campusSelect);
        console.log('Selected Value:', campusSelect.value);
        console.log('Available Campuses:', campuses);
        const selectedCampusId = campusSelect.value;
        const campus = campuses[selectedCampusId];

        if (!campus) {
            alert('Please select a campus first');
            return;
        }

        const validationModal = document.getElementById('validationModal');
        // Show modal
        validationModal.style.display = 'block';

        // Start validation
        const resultsList = document.getElementById('modalValidationResults');
        const progressBar = document.getElementById('modalValidationProgress');

        try {
            if (resultsList) {
                resultsList.innerHTML = `
                    <div class="validation-message">
                        <i class="fas fa-spinner fa-spin"></i>
                        Validating coordinates for ${campus.name}...
                        <div class="validation-steps">
                            <div class="step">Checking campus location...</div>
                            <div class="step">Validating street coordinates...</div>
                            <div class="step">Verifying safe zones...</div>
                        </div>
                    </div>
                `;
            }
            if (progressBar) {
                progressBar.style.width = '0%';
            }

            // Validate campus coordinates
            const campusValidation = await geocodingService.validateLocation(
                campus.name,
                campus.coords,
                'campus'
            );

            if (campusValidation.needsUpdate) {
                campus.coords = campusValidation.validatedCoords;
            }

            progressBar.style.width = '33%';

            // Validate streets - one at a time to avoid rate limits
            const streetValidations = [];
            for (const street of campus.streets) {
                const validation = await this.validateStreet(street, campus.coords);
                if (validation.needsUpdate) {
                    street.path = validation.updatedPath;
                }
                streetValidations.push(validation);
                progressBar.style.width = `${33 + (33 * streetValidations.length / campus.streets.length)}%`;
            }

            // Validate safe zones - one at a time to avoid rate limits
            const safeZoneValidations = [];
            for (const zone of campus.safeZones) {
                const validation = await geocodingService.validateLocation(zone.name, zone.coords, 'safezone');
                if (validation.needsUpdate) {
                    zone.coords = validation.validatedCoords;
                }
                safeZoneValidations.push(validation);
                progressBar.style.width = `${66 + (34 * safeZoneValidations.length / campus.safeZones.length)}%`;
            }

            progressBar.style.width = '100%';

            // Store results for export
            this.lastValidationResults = {
                campus: campusValidation,
                streets: streetValidations,
                safeZones: safeZoneValidations
            };

            // Display results
            this.displayValidationResults(this.lastValidationResults);

        } catch (error) {
            console.error('Validation error:', error);
            resultsList.innerHTML = '<div class="error">Error during validation: ' + error.message + '</div>';
        }
    }

    async validateStreet(street, campusCoords) {
        try {
            // Search for the street name in the correct area
            const streetSearch = await geocodingService.searchByName(
                `${street.name}, Makati City, Philippines`
            );
            
            if (streetSearch && streetSearch.length > 0) {
                const bestMatch = streetSearch[0];
                
                // Get the street endpoints
                const updatedPath = street.path.map((coord, index) => {
                    if (index === 0 || index === street.path.length - 1) {
                        return [bestMatch.latitude, bestMatch.longitude];
                    }
                    return coord; // Keep intermediate points for now
                });
                
                return {
                    name: street.name,
                    originalPath: street.path,
                    updatedPath: updatedPath,
                    needsUpdate: true,
                    isValid: true,
                    confidence: 'high',
                    message: `Found matching street: ${bestMatch.name}`
                };
            }
            
            // If no direct match found, try reverse geocoding each point
            const pathValidations = await Promise.all(
                street.path.map(async (coords, index) => {
                    const pointName = `${street.name} Point ${index + 1}`;
                    return geocodingService.validateLocation(
                        pointName,
                        coords,
                        'street'
                    );
                })
            );

            const updatedPath = pathValidations.map(v => v.validatedCoords);
            const needsUpdate = pathValidations.some(v => v.needsUpdate);

            return {
                name: street.name,
                pathValidations,
                originalPath: street.path,
                updatedPath,
                needsUpdate,
                isValid: pathValidations.every(v => v.confidence !== 'error' && v.confidence !== 'low'),
                confidence: 'medium',
                message: 'Validated through reverse geocoding'
            };
        } catch (error) {
            console.error(`Error validating street ${street.name}:`, error);
            return {
                name: street.name,
                originalPath: street.path,
                updatedPath: street.path,
                needsUpdate: false,
                isValid: false,
                confidence: 'error',
                message: `Error during validation: ${error.message}`
            };
        }
    }

    displayValidationResults(results) {
        const resultsList = document.getElementById('modalValidationResults');
        if (!resultsList) {
            console.error('Validation results container not found');
            return;
        }
        const summary = {
            totalLocations: 1 + results.streets.length + results.safeZones.length,
            validLocations: 0,
            needsUpdate: 0
        };

        let html = `<div class="validation-content">`;
        html += `<h3>Validation Results for ${results.campus.name}</h3>`;

        // Campus validation
        html += `
            <div class="validation-section">
                <h4>Campus Location</h4>
                <div class="validation-details">
                    <p>Confidence: <span class="confidence-${results.campus.confidence}">${results.campus.confidence}</span></p>
                    ${results.campus.needsUpdate ? '<p class="warning">Update recommended</p>' : ''}
                    ${results.campus.needsUpdate ? `
                        <div class="coordinate-update">
                            <p><strong>Original coordinates:</strong><br>${JSON.stringify(results.campus.originalCoords)}</p>
                            <p><strong>Validated coordinates:</strong><br>${JSON.stringify(results.campus.validatedCoords)}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        if (results.campus.confidence !== 'error' && results.campus.confidence !== 'low') {
            summary.validLocations++;
        }
        if (results.campus.needsUpdate) summary.needsUpdate++;

        // Streets validation
        html += '<div class="validation-section"><h4>Streets</h4>';
        results.streets.forEach(street => {
            if (street.isValid) summary.validLocations++;
            if (street.needsUpdate) summary.needsUpdate++;

            html += `
                <div class="street-validation">
                    <h5>${street.name}</h5>
                    <div class="validation-details">
                        <p>Status: <span class="confidence-${street.confidence}">${street.confidence}</span></p>
                        <p>Message: ${street.message || 'No additional information'}</p>
                        ${street.needsUpdate ? '<p class="warning">Update recommended</p>' : ''}
                        ${street.needsUpdate ? `
                            <div class="coordinate-update">
                                <p><strong>Original path:</strong><br>${JSON.stringify(street.originalPath)}</p>
                                <p><strong>Validated path:</strong><br>${JSON.stringify(street.updatedPath)}</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });
        html += '</div>';

        // Safe zones validation
        html += '<div class="validation-section"><h4>Safe Zones</h4>';
        results.safeZones.forEach(zone => {
            if (zone.confidence !== 'error' && zone.confidence !== 'low') {
                summary.validLocations++;
            }
            if (zone.needsUpdate) summary.needsUpdate++;

            html += `
                <div class="safezone-validation">
                    <h5>${zone.name}</h5>
                    <div class="validation-details">
                        <p>Confidence: <span class="confidence-${zone.confidence}">${zone.confidence}</span></p>
                        ${zone.needsUpdate ? '<p class="warning">Update recommended</p>' : ''}
                        ${zone.needsUpdate ? `
                            <div class="coordinate-update">
                                <p><strong>Original coordinates:</strong><br>${JSON.stringify(zone.originalCoords)}</p>
                                <p><strong>Validated coordinates:</strong><br>${JSON.stringify(zone.validatedCoords)}</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });
        html += '</div>';

        // Add summary at the top
        const hasUpdates = summary.needsUpdate > 0;
        html = `
            <div class="validation-summary">
                <div class="summary-stats">
                    <div class="stat">
                        <span class="stat-label">Valid Locations:</span>
                        <span class="stat-value">${summary.validLocations}/${summary.totalLocations}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Locations Needing Update:</span>
                        <span class="stat-value">${summary.needsUpdate}</span>
                    </div>
                </div>
                ${hasUpdates ? `
                    <div class="update-actions">
                        <button onclick="validationController.applyUpdates()" class="run-btn primary">
                            <i class="fas fa-check-circle"></i> Apply All Updates
                        </button>
                    </div>
                ` : ''}
            </div>
        ` + html;

        html += '</div>';

        resultsList.innerHTML = html;

        resultsList.innerHTML = html;
    }

    async applyUpdates() {
        if (!this.lastValidationResults) {
            alert('Please run validation first');
            return;
        }

        const results = this.lastValidationResults;
        const progressBar = document.getElementById('modalValidationProgress');
        const resultsList = document.getElementById('modalValidationResults');

        try {
            resultsList.innerHTML = '<div class="validation-message">Applying coordinate updates...</div>';
            progressBar.style.width = '0%';

            // Get the current campus
            const campusSelect = document.getElementById('campusSelect');
            const selectedCampusId = campusSelect.value;
            const campus = campuses[selectedCampusId];

            let progress = 0;
            const totalSteps = 1 + campus.streets.length + campus.safeZones.length;
            const updateStep = 100 / totalSteps;

            // Update campus coordinates if needed
            if (results.campus.needsUpdate) {
                campus.coords = results.campus.validatedCoords;
                progress += updateStep;
                progressBar.style.width = `${progress}%`;
            }

            // Update street coordinates
            for (const streetValidation of results.streets) {
                if (streetValidation.needsUpdate) {
                    const street = campus.streets.find(s => s.name === streetValidation.name);
                    if (street) {
                        street.path = streetValidation.updatedPath;
                    }
                }
                progress += updateStep;
                progressBar.style.width = `${progress}%`;
            }

            // Update safe zone coordinates
            for (const zoneValidation of results.safeZones) {
                if (zoneValidation.needsUpdate) {
                    const zone = campus.safeZones.find(z => z.name === zoneValidation.name);
                    if (zone) {
                        zone.coords = zoneValidation.validatedCoords;
                    }
                }
                progress += updateStep;
                progressBar.style.width = `${progress}%`;
            }

            // Save updates to storage if needed
            // TODO: Add persistence logic here if required

            // Update map with new coordinates
            if (typeof updateMap === 'function') {
                updateMap();
            }

            progressBar.style.width = '100%';
            resultsList.innerHTML = `
                <div class="validation-message success">
                    <i class="fas fa-check-circle"></i>
                    Coordinates successfully updated!
                    <button onclick="location.reload()" class="run-btn secondary" style="margin-left: 10px;">
                        <i class="fas fa-sync"></i> Refresh Page
                    </button>
                </div>
            `;

        } catch (error) {
            console.error('Error applying updates:', error);
            resultsList.innerHTML = `
                <div class="error">
                    Error applying updates: ${error.message}
                </div>
            `;
        }
    }

    exportValidationReport() {
        if (!this.lastValidationResults) {
            alert('Please run validation first');
            return;
        }

        const results = this.lastValidationResults;
        let report = `Coordinate Validation Report\n`;
        report += `Generated: ${new Date().toLocaleString()}\n\n`;

        // Campus details
        report += `Campus: ${results.campus.name}\n`;
        report += `Status: ${results.campus.confidence}\n`;
        if (results.campus.needsUpdate) {
            report += `Original coordinates: ${JSON.stringify(results.campus.originalCoords)}\n`;
            report += `Validated coordinates: ${JSON.stringify(results.campus.validatedCoords)}\n`;
        }
        report += '\n';

        // Streets
        report += 'Streets:\n';
        results.streets.forEach(street => {
            report += `\n${street.name}\n`;
            report += `Status: ${street.isValid ? 'Valid' : 'Needs Review'}\n`;
            if (street.needsUpdate) {
                report += `Updated path: ${JSON.stringify(street.updatedPath)}\n`;
            }
        });
        report += '\n';

        // Safe zones
        report += 'Safe Zones:\n';
        results.safeZones.forEach(zone => {
            report += `\n${zone.name}\n`;
            report += `Status: ${zone.confidence}\n`;
            if (zone.needsUpdate) {
                report += `Original coordinates: ${JSON.stringify(zone.originalCoords)}\n`;
                report += `Validated coordinates: ${JSON.stringify(zone.validatedCoords)}\n`;
            }
        });

        // Create and trigger download
        const blob = new Blob([report], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'validation-report.txt';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }
}

// Initialize the controller
const validationController = new ValidationController();

// Validation functionality
document.addEventListener('DOMContentLoaded', () => {
    const validateBtn = document.getElementById('validateCoordinatesBtn');
    const validationModal = document.getElementById('validationModal');

    if (validateBtn) {
        validateBtn.addEventListener('click', () => validationController.validateCoordinates());
    }

    // Close modal functionality
    const closeButtons = document.getElementsByClassName('close');
    Array.from(closeButtons).forEach(button => {
        button.addEventListener('click', () => {
            validationModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target === validationModal) {
            validationModal.style.display = 'none';
        }
    });
});

