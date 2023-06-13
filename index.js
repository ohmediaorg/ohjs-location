export function getUserPosition() {
  return new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLatitude = position.coords.latitude;
          const userLongitude = position.coords.longitude;
          resolve({ latitude: userLatitude, longitude: userLongitude });
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

export function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371; // Radius of the earth in kilometers

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  return distance;
}

export function findNearestLocations(userLat, userLng, locationsArray) {
  const sortedLocations = locationsArray.sort((a, b) => {
    const distanceA = calculateDistance(userLat, userLng, a.latitude, a.longitude);
    const distanceB = calculateDistance(userLat, userLng, b.latitude, b.longitude);
    return distanceA - distanceB;
  });

  const nearestLocations = sortedLocations.slice(0, 3);

  return nearestLocations;
}
