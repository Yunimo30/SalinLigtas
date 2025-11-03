// Test script for coordinate validation
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Starting validation tests...');

    // Test 1: Basic coordinate validation
    try {
        const testCampus = campuses[0]; // Using DLSU as test case
        console.log(`Testing coordinates for ${testCampus.name}...`);
        
        const validator = new CoordinateValidator();
        const results = await validator.validateCampus(testCampus);
        
        console.log('Validation Results:', {
            campusValidation: results.campus,
            streetCount: results.streets.length,
            safeZoneCount: results.safeZones.length
        });

        // Test 2: Generate and display report
        const report = validator.generateReport(results);
        console.log('Validation Report:', {
            confidence: report.summary.confidence,
            totalLocations: report.summary.totalLocations,
            validLocations: report.summary.validLocations,
            needsUpdate: report.summary.needsUpdate
        });

        // Test 3: Weather integration
        const weatherService = new WeatherService();
        const weather = await weatherService.getCurrentWeather(
            testCampus.coords[0],
            testCampus.coords[1]
        );
        console.log('Weather Data:', weather);

        console.log('All tests completed successfully!');
    } catch (error) {
        console.error('Test failed:', error);
    }
});

// Function to test individual street validation
async function testStreetValidation(streetName) {
    try {
        const campus = campuses.find(c => 
            c.streets.some(s => s.name === streetName)
        );
        
        if (!campus) {
            throw new Error(`No campus found with street: ${streetName}`);
        }

        const street = campus.streets.find(s => s.name === streetName);
        const validator = new CoordinateValidator();
        const result = await validator.validateStreet(street, campus.coords);

        console.log(`Validation results for ${streetName}:`, result);
        return result;
    } catch (error) {
        console.error(`Error validating street ${streetName}:`, error);
        throw error;
    }
}

// Function to test safe zone validation
async function testSafeZoneValidation(zoneName) {
    try {
        const campus = campuses.find(c => 
            c.safeZones.some(z => z.name === zoneName)
        );
        
        if (!campus) {
            throw new Error(`No campus found with safe zone: ${zoneName}`);
        }

        const zone = campus.safeZones.find(z => z.name === zoneName);
        const geocoding = new GeocodingService();
        const result = await geocoding.validateLocation(
            zone.name,
            zone.coords,
            'safezone'
        );

        console.log(`Validation results for ${zoneName}:`, result);
        return result;
    } catch (error) {
        console.error(`Error validating safe zone ${zoneName}:`, error);
        throw error;
    }
}

// Make test functions globally available
window.testStreetValidation = testStreetValidation;
window.testSafeZoneValidation = testSafeZoneValidation;