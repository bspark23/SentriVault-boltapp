// Geolocation and IP tracking utility
class GeolocationService {
  constructor() {
    this.ipApiKey = 'demo'; // Using demo key for IP info
    this.storageKey = 'sentrivault_location_data';
    this.trustedLocationsKey = 'sentrivault_trusted_locations';
  }

  // Get user's current IP and location
  async getCurrentLocation() {
    try {
      // Try to get precise location first
      const position = await this.getCurrentPosition();
      const locationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date().toISOString(),
        source: 'gps'
      };

      // Get IP-based location as backup
      const ipLocation = await this.getIPLocation();
      
      return {
        ...locationData,
        ipLocation,
        city: ipLocation.city,
        country: ipLocation.country,
        region: ipLocation.region
      };
    } catch (error) {
      console.warn('GPS location failed, using IP location:', error);
      // Fallback to IP-based location
      return await this.getIPLocation();
    }
  }

  // Get GPS position
  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  // Get IP-based location
  async getIPLocation() {
    try {
      // Using ipapi.co as it doesn't require API key for basic usage
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      return {
        ip: data.ip,
        city: data.city,
        region: data.region,
        country: data.country_name,
        countryCode: data.country_code,
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
        isp: data.org,
        timestamp: new Date().toISOString(),
        source: 'ip'
      };
    } catch (error) {
      console.error('IP location failed:', error);
      // Return mock data for demo
      return {
        ip: '192.168.1.1',
        city: 'Unknown',
        region: 'Unknown',
        country: 'Unknown',
        countryCode: 'XX',
        latitude: 0,
        longitude: 0,
        timezone: 'UTC',
        isp: 'Unknown ISP',
        timestamp: new Date().toISOString(),
        source: 'mock'
      };
    }
  }

  // Store location data
  storeLocationData(locationData) {
    try {
      const stored = this.getStoredLocations();
      stored.push(locationData);
      
      // Keep only last 50 locations
      if (stored.length > 50) {
        stored.splice(0, stored.length - 50);
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(stored));
      return true;
    } catch (error) {
      console.error('Failed to store location data:', error);
      return false;
    }
  }

  // Get stored locations
  getStoredLocations() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get stored locations:', error);
      return [];
    }
  }

  // Add trusted location
  addTrustedLocation(locationData, name = '') {
    try {
      const trusted = this.getTrustedLocations();
      const trustedLocation = {
        id: Date.now().toString(),
        name: name || `${locationData.city}, ${locationData.country}`,
        city: locationData.city,
        country: locationData.country,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        addedAt: new Date().toISOString()
      };
      
      trusted.push(trustedLocation);
      localStorage.setItem(this.trustedLocationsKey, JSON.stringify(trusted));
      return trustedLocation;
    } catch (error) {
      console.error('Failed to add trusted location:', error);
      return null;
    }
  }

  // Get trusted locations
  getTrustedLocations() {
    try {
      const stored = localStorage.getItem(this.trustedLocationsKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get trusted locations:', error);
      return [];
    }
  }

  // Check if location is suspicious
  isSuspiciousLocation(currentLocation) {
    const trusted = this.getTrustedLocations();
    const stored = this.getStoredLocations();
    
    // If no trusted locations, check against recent locations
    if (trusted.length === 0) {
      if (stored.length === 0) return false; // First time user
      
      const recentLocations = stored.slice(-5); // Last 5 locations
      return !recentLocations.some(loc => 
        this.calculateDistance(currentLocation, loc) < 100 // Within 100km
      );
    }
    
    // Check against trusted locations
    return !trusted.some(loc => 
      this.calculateDistance(currentLocation, loc) < 50 // Within 50km of trusted location
    );
  }

  // Calculate distance between two points (Haversine formula)
  calculateDistance(point1, point2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(point2.latitude - point1.latitude);
    const dLon = this.toRadians(point2.longitude - point1.longitude);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(point1.latitude)) * Math.cos(this.toRadians(point2.latitude)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Convert degrees to radians
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Track login location
  async trackLoginLocation() {
    try {
      const location = await this.getCurrentLocation();
      this.storeLocationData(location);
      
      const isSuspicious = this.isSuspiciousLocation(location);
      
      return {
        location,
        isSuspicious,
        message: isSuspicious ? 
          'Login from new or unusual location detected' : 
          'Login from recognized location'
      };
    } catch (error) {
      console.error('Failed to track login location:', error);
      return {
        location: null,
        isSuspicious: false,
        message: 'Unable to determine location'
      };
    }
  }

  // Get location summary
  getLocationSummary() {
    const stored = this.getStoredLocations();
    const trusted = this.getTrustedLocations();
    
    const countries = [...new Set(stored.map(loc => loc.country))];
    const cities = [...new Set(stored.map(loc => loc.city))];
    
    return {
      totalLocations: stored.length,
      trustedLocations: trusted.length,
      countriesVisited: countries.length,
      citiesVisited: cities.length,
      lastLocation: stored[stored.length - 1] || null,
      countries,
      cities
    };
  }

  // Clear location data
  clearLocationData() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.trustedLocationsKey);
  }

  // Export location data
  exportLocationData() {
    const data = {
      locations: this.getStoredLocations(),
      trustedLocations: this.getTrustedLocations(),
      summary: this.getLocationSummary(),
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sentrivault_location_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// Create singleton instance
const geolocationService = new GeolocationService();

// Export functions
export const getCurrentLocation = () => geolocationService.getCurrentLocation();
export const trackLoginLocation = () => geolocationService.trackLoginLocation();
export const addTrustedLocation = (location, name) => geolocationService.addTrustedLocation(location, name);
export const getTrustedLocations = () => geolocationService.getTrustedLocations();
export const getStoredLocations = () => geolocationService.getStoredLocations();
export const isSuspiciousLocation = (location) => geolocationService.isSuspiciousLocation(location);
export const getLocationSummary = () => geolocationService.getLocationSummary();
export const clearLocationData = () => geolocationService.clearLocationData();
export const exportLocationData = () => geolocationService.exportLocationData();

export default geolocationService;