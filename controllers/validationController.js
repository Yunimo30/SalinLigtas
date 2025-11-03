// Coordinate validation UI controller
import { coordinateValidator } from '../utils/coordinateValidator.js';

class ValidationController {
    constructor() {
        this.validationResults = null;
        this.modal = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Setup modal
        this.modal = document.getElementById('validationModal');
        const validateBtn = document.getElementById('validateCoordinatesBtn');
        const closeButtons = this.modal.getElementsByClassName('close');

        if (validateBtn) {
            validateBtn.addEventListener('click', () => {
                this.modal.style.display = 'block';
                this.validateCurrentCampus();
            });
        }

        // Close modal when clicking the X or outside the modal
        Array.from(closeButtons).forEach(button => {
            button.addEventListener('click', () => {
                this.modal.style.display = 'none';
            });
        });

        window.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.modal.style.display = 'none';
            }
        });
    }

    async validateCurrentCampus() {
        const campusSelect = document.getElementById('campusSelect');
        const selectedCampusId = campusSelect.value;
        const campus = campuses.find(c => c.id === selectedCampusId);

        if (!campus) {
            alert('Please select a campus first');
            this.modal.style.display = 'none';
            return;
        }

        const resultsList = document.getElementById('validationResults');
        const progressBar = document.getElementById('validationProgress');
        
        try {
            resultsList.innerHTML = '<div class="validation-message">Validating coordinates for ' + campus.name + '...</div>';
            progressBar.style.width = '0%';

            const result = await coordinateValidator.validateCampus(campus);
            const report = coordinateValidator.generateReport(result);

            this.displayValidationResults([{
                campusName: campus.name,
                ...report
            }]);

            this.validationResults = [{
                campusName: campus.name,
                ...report
            }];

            progressBar.style.width = '100%';

        } catch (error) {
            console.error('Validation error:', error);
            resultsList.innerHTML = '<div class="error">Error during validation: ' + error.message + '</div>';
        }
    }

    async validateAllLocations() {
        const resultsList = document.getElementById('validationResults');
        const progressBar = document.getElementById('validationProgress');
        
        try {
            resultsList.innerHTML = '<li>Starting validation...</li>';
            progressBar.style.width = '0%';

            // Validate each campus
            const allResults = await Promise.all(
                campuses.map(async (campus, index) => {
                    const result = await coordinateValidator.validateCampus(campus);
                    const progress = ((index + 1) / campuses.length) * 100;
                    progressBar.style.width = `${progress}%`;
                    return result;
                })
            );

            // Generate reports for all campuses
            const reports = allResults.map((result, index) => ({
                campusName: campuses[index].name,
                ...coordinateValidator.generateReport(result)
            }));

            this.displayValidationResults(reports);
            this.validationResults = reports;

        } catch (error) {
            console.error('Validation error:', error);
            resultsList.innerHTML = '<li class="error">Error during validation: ' + error.message + '</li>';
        }
    }

    displayValidationResults(reports) {
        const resultsList = document.getElementById('validationResults');
        resultsList.innerHTML = '';

        reports.forEach(report => {
            const campusSection = document.createElement('div');
            campusSection.className = 'validation-campus-section';

            // Campus header
            campusSection.innerHTML = `
                <h3>${report.campusName}</h3>
                <div class="validation-summary">
                    <p>Confidence: <span class="confidence-${report.summary.confidence.toLowerCase()}">${report.summary.confidence}</span></p>
                    <p>Valid Locations: ${report.summary.validLocations}/${report.summary.totalLocations}</p>
                    <p>Locations Needing Update: ${report.summary.needsUpdate}</p>
                </div>
            `;

            // Issues section
            if (report.details.campusIssues.length > 0 || 
                report.details.streetIssues.length > 0 || 
                report.details.safeZoneIssues.length > 0) {
                
                const issuesSection = document.createElement('div');
                issuesSection.className = 'validation-issues';
                issuesSection.innerHTML = '<h4>Issues Found:</h4>';
                
                const issuesList = document.createElement('ul');
                
                [...report.details.campusIssues, 
                 ...report.details.streetIssues, 
                 ...report.details.safeZoneIssues
                ].forEach(issue => {
                    issuesList.innerHTML += `
                        <li>
                            <strong>${issue.name}:</strong> ${issue.issue}
                            <br>
                            <em>Recommendation: ${issue.recommendation}</em>
                        </li>
                    `;
                });
                
                issuesSection.appendChild(issuesList);
                campusSection.appendChild(issuesSection);
            }

            // Recommendations section
            if (report.recommendations.length > 0) {
                const recsSection = document.createElement('div');
                recsSection.className = 'validation-recommendations';
                recsSection.innerHTML = '<h4>Suggested Updates:</h4>';
                
                const recsList = document.createElement('ul');
                report.recommendations.forEach(rec => {
                    recsList.innerHTML += `
                        <li>
                            <strong>${rec.location}</strong>
                            <br>
                            Current: [${rec.currentCoords.join(', ')}]
                            <br>
                            Suggested: [${rec.suggestedCoords.join(', ')}]
                            <br>
                            <span class="confidence-${rec.confidence.toLowerCase()}">
                                Confidence: ${rec.confidence}
                            </span>
                        </li>
                    `;
                });
                
                recsSection.appendChild(recsList);
                campusSection.appendChild(recsSection);
            }

            resultsList.appendChild(campusSection);
        });
    }

    exportValidationReport() {
        if (!this.validationResults) return;

        const report = {
            generatedAt: new Date().toISOString(),
            results: this.validationResults
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'coordinate-validation-report.json';
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Make ValidationController available globally
window.ValidationController = ValidationController;

// Initialize the controller
document.addEventListener('DOMContentLoaded', () => {
    window.validationController = new ValidationController();
    console.log('Validation controller initialized');
});