export class LatLng {
  constructor(lat, lng) {
    this.lat = parseFloat(lat);
    this.lng = parseFloat(lng);

    validateLatLng(this.lat, this.lng);
  }
}

export function getUserPosition() {
  return new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLatitude = position.coords.latitude;
          const userLongitude = position.coords.longitude;
          resolve(new LatLng(userLatitude, userLongitude));
        },
        (error) => {
          reject(error);
        }
      );
    } else {
      reject(new Error('Geolocation is not supported by this browser.'));
    }
  });
}

export function calculateDistance(latLng1, latLng2) {
  if (!(latLng1 instanceof LatLng) || !(latLng2 instanceof LatLng)) {
    throw new Error('Invalid LatLng object');
  }

  const earthRadius = 6371; // Radius of the earth in kilometers

  const { lat: lat1, lng: lng1 } = latLng1;
  const { lat: lat2, lng: lng2 } = latLng2;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  return distance;
}

export function findNearestLocations(userLatLng, count, locationsArray) {
  if (!(userLatLng instanceof LatLng)) {
    throw new Error('Invalid LatLng object');
  }

  if (!Array.isArray(locationsArray) || !locationsArray.every(loc => loc instanceof LatLng)) {
    throw new Error('Invalid locations array. It should be an array of LatLng objects.');
  }

  return sortLocationsByDistance(userLatLng, locationsArray).slice(0, count);
}

function sortLocationsByDistance(userLatLng, locationsArray) {
  return locationsArray.sort((a, b) => {
    const distanceA = calculateDistance(userLatLng, a);
    const distanceB = calculateDistance(userLatLng, b);

    return distanceA - distanceB;
  });
}

function validateLatLng(lat, lng) {
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    throw new Error('Invalid latitude or longitude');
  }

  if (lat < -90 || lat > 90) {
    throw new Error('Invalid latitude');
  }

  if (lng < -180 || lng > 180) {
    throw new Error('Invalid longitude');
  }
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}
