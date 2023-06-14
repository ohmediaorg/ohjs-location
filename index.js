export function LatLng(lat, lng) {
  validateLatLng(lat, lng);

  this.lat = lat;
  this.lng = lng;
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

  const dLat = ((latLng2.lat - latLng1.lat) * Math.PI) / 180;
  const dLon = ((latLng2.lng - latLng1.lng) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((latLng1.lat * Math.PI) / 180) *
    Math.cos((latLng2.lat * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  return distance;
}

export function findNearestLocations(userLatLng, locationsArray, count = 3) {
  if (!userLatLng instanceof LatLng) {
    throw new Error('Invalid LatLng object');
  }

  const sortedLocations = locationsArray.sort((a, b) => {
    const latLngA = new LatLng(parseFloat(a.lat), parseFloat(a.lng));
    const latLngB = new LatLng(parseFloat(b.lat), parseFloat(b.lng));

    return compareDistances(userLatLng, latLngA, latLngB);
  });

  const nearestLocations = sortedLocations.slice(0, count);

  return nearestLocations;
}

function compareDistances(userLatLng, a, b) {
  const distanceA = calculateDistance(userLatLng, a);
  const distanceB = calculateDistance(userLatLng, b);

  return distanceA - distanceB;
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
