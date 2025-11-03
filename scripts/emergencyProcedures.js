// Emergency Procedures System
document.addEventListener('DOMContentLoaded', () => {
    // Populate emergency alerts
    const alertsContainer = document.getElementById('emergencyAlerts');
    if (alertsContainer) {
        alertsContainer.innerHTML = `
            <div class="alert-item high">
                <i class="fas fa-exclamation-circle"></i>
                <div class="alert-content">
                    <strong>High Flood Risk Alert</strong>
                    <p>Heavy rainfall expected in the next 24 hours. Be prepared for possible evacuation.</p>
                    <span class="alert-time">10 minutes ago</span>
                </div>
            </div>
            <div class="alert-item warning">
                <i class="fas fa-exclamation-triangle"></i>
                <div class="alert-content">
                    <strong>Weather Warning</strong>
                    <p>Moderate to heavy rainfall forecasted. Monitor updates regularly.</p>
                    <span class="alert-time">30 minutes ago</span>
                </div>
            </div>
            <div class="alert-item info">
                <i class="fas fa-info-circle"></i>
                <div class="alert-content">
                    <strong>Evacuation Route Update</strong>
                    <p>Eastern campus exit temporarily closed. Please use alternate routes.</p>
                    <span class="alert-time">1 hour ago</span>
                </div>
            </div>
        `;
    }

    // Handle procedure tabs
    const procedureTabs = document.querySelectorAll('.procedure-tab');
    const procedureContents = document.querySelectorAll('.procedure-content');

    procedureTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            procedureTabs.forEach(t => t.classList.remove('active'));
            procedureContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            const contentId = tab.getAttribute('data-tab') + 'Procedure';
            document.getElementById(contentId).classList.add('active');
        });
    });

    // Add content to other procedures
    const fireProcedure = document.getElementById('fireProcedure');
    if (fireProcedure) {
        fireProcedure.innerHTML = `
            <ol class="procedure-steps">
                <li>Activate the nearest fire alarm</li>
                <li>Call emergency services immediately</li>
                <li>Evacuate the building calmly and quickly</li>
                <li>Use stairs, never elevators</li>
                <li>Close doors behind you to contain the fire</li>
                <li>Meet at designated assembly points</li>
                <li>Follow instructions from fire marshals</li>
                <li>Do not re-enter the building until cleared</li>
            </ol>
        `;
    }

    const earthquakeProcedure = document.getElementById('earthquakeProcedure');
    if (earthquakeProcedure) {
        earthquakeProcedure.innerHTML = `
            <ol class="procedure-steps">
                <li>Drop, Cover, and Hold On</li>
                <li>Stay away from windows and tall furniture</li>
                <li>If inside, stay inside; if outside, stay outside</li>
                <li>After shaking stops, evacuate calmly</li>
                <li>Be aware of possible aftershocks</li>
                <li>Follow evacuation routes to assembly points</li>
                <li>Help others if you can do so safely</li>
                <li>Wait for official instructions</li>
            </ol>
        `;
    }
});