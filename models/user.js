// A mongoose Data model for User data
// Define the Schema
var userSchema = new require('mongoose').Schema({
  status: String,
  level: {type: Number, required: true, default: 0},
  experience: {type: Number, required: true, default: 0},
  firstName:  String,
  lastName: String,
  nickName: {type: String, required: true},
  email: {type: String, required: true, lowercase: true, trim: true, index: {unique: true }},
  password: {type: String, required: true},
  google: String,
  facebook: String,
  twitter: String,
  location: {lat: Number, lng: Number},
  history: [{activity: String, date: Date}]
}, {timestamps: 1});

// Create Indexes on queried and order fields
userSchema.index({
  firstName: 1,
  lastName: 1,
  nickName: 1,
  email: 1,
  password: 1,
  status: 1,
  level: 1,
  location.lat: 1,
  location.lng: 1
});

// A virtual for the full name data
userSchema.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.lastName;
});

/**
 * Finds users who are within the specified distance of this user
 * 
 * Note that this measurement is currently in degrees of lat/lng
 * 
 * @param Number   distance The maximum distance to look for other users
 * @param Function cb       The callback to run on the found users
 */
userSchema.methods.findCloseUsers = function (distance, cb) {
  // The user's location needs to be checked,
  // the max value being +/- distance from the user's lat/lng
  return this.find({
    location.lat: {
      $gt: location.lat - distance
      $lt: location.lat + distance
    },
    location.lng: {
      $gt: location.lng - distance
      $lt: location.lng + distance
    }
  }, cb);
};