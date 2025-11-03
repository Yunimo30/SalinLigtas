// Main entry point
import { campuses } from './data.js';
import { geocodingService } from './services/geocodingService.js';
import { coordinateValidator } from './utils/coordinateValidator.js';
import { weatherService } from './services/weatherService.js';
import { floodModel } from './models/floodPredictionModel.js';

// Make modules available globally
window.geocodingService = geocodingService;
window.coordinateValidator = coordinateValidator;
window.weatherService = weatherService;
window.floodModel = floodModel;
window.campuses = campuses;

// Initialize validation functionality
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing validation system...');
    
    const validateBtn = document.getElementById('validateCoordinatesBtn');
    const validationModal = document.getElementById('validationModal');
    const closeButtons = document.getElementsByClassName('close');

    if (validateBtn) {
        console.log('Validation button found, adding click handler...');
        validateBtn.addEventListener('click', async () => {
            console.log('Validate button clicked');
            const campusSelect = document.getElementById('campusSelect');
            const selectedCampusId = campusSelect.value;
            const campus = campuses.find(c => c.id === selectedCampusId);

            if (!campus) {
                alert('Please select a campus first');
                return;
            }

            // Show modal
            validationModal.style.display = 'block';

            // Start validation
            const resultsList = document.getElementById('validationResults');
            const progressBar = document.getElementById('validationProgress');

            try {
                resultsList.innerHTML = '<div class="validation-message">Validating coordinates for ' + campus.name + '...</div>';
                progressBar.style.width = '0%';

                // Perform validation
                console.log('Starting validation for campus:', campus.name);
                const result = await coordinateValidator.validateCampus(campus);
                console.log('Validation result:', result);

                progressBar.style.width = '50%';

                // Generate report
                console.log('Generating validation report...');
                const report = coordinateValidator.generateReport(result);
                console.log('Validation report:', report);

                // Display results
                displayValidationResults([{
                    campusName: campus.name,
                    ...report
                }]);

                progressBar.style.width = '100%';

            } catch (error) {
                console.error('Validation error:', error);
                resultsList.innerHTML = '<div class="error">Error during validation: ' + error.message + '</div>';
            }
        });
    }

    // Close modal functionality
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

// Helper function to display validation results
function displayValidationResults(reports) {
    console.log('Displaying validation results:', reports);
    const resultsList = document.getElementById('validationResults');
    resultsList.innerHTML = '';

    reports.forEach(report => {
        const campusSection = document.createElement('div');
        campusSection.className = 'validation-campus-section';

        campusSection.innerHTML = `
            <h3>${report.campusName}</h3>
            <div class="validation-summary">
                <p>Confidence: <span class="confidence-${report.summary.confidence.toLowerCase()}">${report.summary.confidence}</span></p>
                <p>Valid Locations: ${report.summary.validLocations}/${report.summary.totalLocations}</p>
                <p>Locations Needing Update: ${report.summary.needsUpdate}</p>
            </div>
        `;

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

        resultsList.appendChild(campusSection);
    });
}