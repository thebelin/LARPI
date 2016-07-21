// Convert the distance between two Lat/Lng into meters
var degToMeters = exports.degToMeters = function (srcLat, srcLng, destLat, destLng) {
   // radius of planet in meters
   var R = 6371e3,

  // Latitude distance in radians
    dLat = rad(srcLat - destLat),
  
  // Longitude distance in radians
    dLong = rad(srcLng - destLng),
  
  // Haversine based distance determination
    a = halfSin(dLat) * halfSin(dLat) +
      Math.cos(rad(destLat)) * Math.cos(rad(destLat)) * halfSin(dLong) * halfSin(dLong),

  // The radian based difference between the points expressed as a float
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Return the Radius with the radian difference applied
  return R * c;
};