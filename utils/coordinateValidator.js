// Coordinate validation utility
import { geocodingService } from './geocodingService.js';

class CoordinateValidator {
    constructor() {
        this.validationResults = {
            campuses: [],
            streets: [],
            safeZones: []
        };
    }

    async validateCampus(campus) {
        // Validate campus coordinates
        const campusValidation = await geocodingService.validateLocation(
            campus.name,
            campus.coords,
            'campus'
        );

        const streetValidations = await Promise.all(
            campus.streets.map(street => 
                this.validateStreet(street, campus.coords)
            )
        );

        const safeZoneValidations = await Promise.all(
            campus.safeZones.map(zone =>
                geocodingService.validateLocation(
                    zone.name,
                    zone.coords,
                    'safezone'
                )
            )
        );

        return {
            campus: campusValidation,
            streets: streetValidations,
            safeZones: safeZoneValidations
        };
    }

    async validateStreet(street, campusCoords) {
        // For each point in the street's path
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

        return {
            name: street.name,
            pathValidations,
            isValid: pathValidations.every(v => v.confidence !== 'error' && v.confidence !== 'low')
        };
    }

    generateReport(validationResults) {
        return {
            summary: {
                totalLocations: this.countTotalLocations(validationResults),
                validLocations: this.countValidLocations(validationResults),
                needsUpdate: this.countLocationsNeedingUpdate(validationResults),
                confidence: this.calculateOverallConfidence(validationResults)
            },
            details: {
                campusIssues: this.getLocationIssues(validationResults.campus),
                streetIssues: this.getStreetIssues(validationResults.streets),
                safeZoneIssues: this.getLocationIssues(validationResults.safeZones)
            },
            recommendations: this.generateRecommendations(validationResults)
        };
    }

    countTotalLocations(results) {
        const streetPoints = results.streets.reduce((sum, street) => 
            sum + street.pathValidations.length, 0
        );
        return 1 + streetPoints + results.safeZones.length;
    }

    countValidLocations(results) {
        let count = results.campus.confidence !== 'low' && results.campus.confidence !== 'error' ? 1 : 0;
        
        count += results.streets.reduce((sum, street) => 
            sum + street.pathValidations.filter(v => 
                v.confidence !== 'low' && v.confidence !== 'error'
            ).length, 0
        );

        count += results.safeZones.filter(zone => 
            zone.confidence !== 'low' && zone.confidence !== 'error'
        ).length;

        return count;
    }

    countLocationsNeedingUpdate(results) {
        let count = results.campus.needsUpdate ? 1 : 0;
        
        count += results.streets.reduce((sum, street) => 
            sum + street.pathValidations.filter(v => v.needsUpdate).length, 0
        );

        count += results.safeZones.filter(zone => zone.needsUpdate).length;

        return count;
    }

    calculateOverallConfidence(results) {
        const total = this.countTotalLocations(results);
        const valid = this.countValidLocations(results);
        const percentage = (valid / total) * 100;

        if (percentage >= 90) return 'High';
        if (percentage >= 70) return 'Medium';
        return 'Low';
    }

    getLocationIssues(location) {
        if (location.confidence === 'low' || location.confidence === 'error') {
            return [{
                name: location.name,
                issue: location.error || 'Low confidence in coordinate validation',
                recommendation: 'Verify coordinates manually'
            }];
        }
        return [];
    }

    getStreetIssues(streets) {
        return streets
            .filter(street => !street.isValid)
            .map(street => ({
                name: street.name,
                issue: 'One or more points in the street path could not be validated',
                recommendation: 'Review street path coordinates'
            }));
    }

    generateRecommendations(results) {
        const recommendations = [];

        if (results.campus.needsUpdate) {
            recommendations.push({
                location: results.campus.name,
                currentCoords: results.campus.originalCoords,
                suggestedCoords: results.campus.validatedCoords,
                confidence: results.campus.confidence
            });
        }

        results.streets.forEach(street => {
            street.pathValidations
                .filter(point => point.needsUpdate)
                .forEach((point, index) => {
                    recommendations.push({
                        location: `${street.name} Point ${index + 1}`,
                        currentCoords: point.originalCoords,
                        suggestedCoords: point.validatedCoords,
                        confidence: point.confidence
                    });
                });
        });

        results.safeZones
            .filter(zone => zone.needsUpdate)
            .forEach(zone => {
                recommendations.push({
                    location: zone.name,
                    currentCoords: zone.originalCoords,
                    suggestedCoords: zone.validatedCoords,
                    confidence: zone.confidence
                });
            });

        return recommendations;
    }
}

export const coordinateValidator = new CoordinateValidator();