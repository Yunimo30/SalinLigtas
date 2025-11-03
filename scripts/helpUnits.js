document.addEventListener('DOMContentLoaded', () => {
    const helpUnitsToggle = document.getElementById('help-units-toggle');
    const helpUnitsModal = document.getElementById('helpUnitsModal');
    
    if (!helpUnitsToggle || !helpUnitsModal) {
        console.warn('Help & Units elements not found');
        return;
    }

    // Toggle help units modal
    helpUnitsToggle.addEventListener('click', () => {
        helpUnitsModal.classList.toggle('active');
        helpUnitsToggle.classList.toggle('active');
    });

    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        if (helpUnitsModal.classList.contains('active') &&
            !helpUnitsModal.contains(e.target) && 
            !helpUnitsToggle.contains(e.target)) {
            helpUnitsModal.classList.remove('active');
            helpUnitsToggle.classList.remove('active');
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && helpUnitsModal.classList.contains('active')) {
            helpUnitsModal.classList.remove('active');
            helpUnitsToggle.classList.remove('active');
        }
    });

    // Handle unit toggle button
    const unitToggleBtn = document.getElementById('unitToggle');
    if (unitToggleBtn) {
        unitToggleBtn.addEventListener('click', () => {
            const currentUnit = unitToggleBtn.textContent.includes('cm') ? 'ft' : 'cm';
            unitToggleBtn.textContent = `Units: ${currentUnit}`;
            if (window.toggleUnit) {
                window.toggleUnit();
            }
        });
    }

    // Handle How to Use button
    const howToUseBtn = document.getElementById('howToUseBtn');
    if (howToUseBtn) {
        howToUseBtn.addEventListener('click', () => {
            const tutorialModal = document.getElementById('tutorialModal');
            if (tutorialModal) {
                tutorialModal.style.display = 'block';
                helpUnitsModal.classList.remove('active');
                helpUnitsToggle.classList.remove('active');
            }
        });
    }
});