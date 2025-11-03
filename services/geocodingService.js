// Geocoding service for coordinate validation
const GEOCODING_API_BASE = 'https://geocoding-api.open-meteo.com/v1/search';
const NOMINATIM_API_BASE = 'https://nominatim.openstreetmap.org/search';

class GeocodingService {
    constructor() {
        this.cache = new Map();
        this.queue = Promise.resolve(); // For rate limiting
        this.lastRequest = 0;
        this.minRequestInterval = 1000; // 1 second between requests
    }

    async throttleRequest() {
        const now = Date.now();
        const timeToWait = Math.max(0, this.lastRequest + this.minRequestInterval - now);
        if (timeToWait > 0) {
            await new Promise(resolve => setTimeout(resolve, timeToWait));
        }
        this.lastRequest = Date.now();
    }

    async validateLocation(name, coordinates, type = 'campus') {
        try {
            const [lat, lon] = coordinates;
            const cacheKey = `${name}-${lat}-${lon}`;

            // Check cache first
            if (this.cache.has(cacheKey)) {
                return this.cache.get(cacheKey);
            }

            // Search by name first
            const nameResults = await this.searchByName(name);
            
            // If we find an exact match by name
            const exactMatch = nameResults.find(result => 
                this.isNearby(result.latitude, result.longitude, lat, lon, type === 'campus' ? 0.5 : 0.1)
            );

            if (exactMatch) {
                const validated = {
                    name,
                    originalCoords: [lat, lon],
                    validatedCoords: [exactMatch.latitude, exactMatch.longitude],
                    confidence: 'high',
                    source: 'exact_match',
                    needsUpdate: this.shouldUpdateCoordinates(lat, lon, exactMatch.latitude, exactMatch.longitude)
                };
                this.cache.set(cacheKey, validated);
                return validated;
            }

            // Reverse geocode the provided coordinates
            const reverseResults = await this.reverseGeocode(lat, lon);
            
            if (reverseResults.length > 0) {
                const bestMatch = reverseResults[0];
                const validated = {
                    name,
                    originalCoords: [lat, lon],
                    validatedCoords: [bestMatch.lat, bestMatch.lon],
                    confidence: 'medium',
                    source: 'reverse_geocode',
                    needsUpdate: this.shouldUpdateCoordinates(lat, lon, bestMatch.lat, bestMatch.lon)
                };
                this.cache.set(cacheKey, validated);
                return validated;
            }

            // If no matches found, return original with warning
            return {
                name,
                originalCoords: [lat, lon],
                validatedCoords: [lat, lon],
                confidence: 'low',
                source: 'original',
                needsUpdate: false,
                warning: 'Could not validate coordinates'
            };

        } catch (error) {
            console.error('Error validating location:', error);
            return {
                name,
                originalCoords: coordinates,
                validatedCoords: coordinates,
                confidence: 'error',
                source: 'error',
                needsUpdate: false,
                error: error.message
            };
        }
    }

    async searchByName(name) {
        await this.throttleRequest();
        try {
            const response = await fetch(`${GEOCODING_API_BASE}?name=${encodeURIComponent(name)}&count=5&language=en&format=json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.results || [];
        } catch (error) {
            console.warn('Error in searchByName:', error);
            return [];
        }
    }

    async reverseGeocode(lat, lon) {
        await this.throttleRequest();
        try {
            const headers = {
                'User-Agent': 'SalinLigtas/1.0 (Campus Flood Monitoring System)',
                'Accept-Language': 'en-US,en;q=0.9'
            };
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`,
                { headers }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // Convert the reverse geocoding response format to match our needs
            if (data && data.lat && data.lon) {
                return [{
                    lat: parseFloat(data.lat),
                    lon: parseFloat(data.lon),
                    name: data.display_name,
                    type: data.type
                }];
            }
            return [];
        } catch (error) {
            console.warn('Error in reverseGeocode:', error);
            return [];
        }
    }

    isNearby(lat1, lon1, lat2, lon2, maxDistanceKm = 0.5) {
        const R = 6371; // Earth's radius in km
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        return distance <= maxDistanceKm;
    }

    toRad(degrees) {
        return degrees * (Math.PI/180);
    }

    shouldUpdateCoordinates(origLat, origLon, newLat, newLon) {
        // Check if the difference is significant (more than 50 meters)
        return !this.isNearby(origLat, origLon, newLat, newLon, 0.05);
    }
}

const geocodingService = new GeocodingService();