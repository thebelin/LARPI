// A mongoose Data model for User data
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define the Schema
var userSchema = new Schema({
  status: String,
  level: Number,
  experience: Number,
  firstName:  String,
  lastName: String,
  email: String,
  password: String,
  google: String,
  facebook: String,
  twitter: String,
  location: {lat: Number, lng: Number},
  created: {type: Date, default: Date.now},
  updated: {type: Date, default: Date.now},
  history: [{activity: String, date: Date}]
});

// Note: indexes are disabled so they don't auto-run on start
userSchema.set('autoIndex', false);

// Create Indexes on queried and order fields
userSchema.index({
  firstName: 1,
  lastName: 1,
  email: 1,
  password: 1,
  location: 1,
  status: 1,
  level: 1
});

/**
 * Finds users who are within the specified distance of this user
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