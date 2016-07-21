// A mongoose Data model for Interaction data
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define the Schema
var interactionSchema = new Schema({
  active: {type: Boolean, default: true},
  type: String,
  range: Number,
  visibleRange: Number,
  interaction: {}
  location: {lat: Number, lng: Number},
  created: {type: Date, default: Date.now},
  updated: {type: Date, default: Date.now},
  history: [{activity: String, date: Date}]
});

// Note: indexes are disabled so they don't auto-run on start
interactionSchema.set('autoIndex', false);

// Create Indexes on queried and order fields
interactionSchema.index({
  level: 1,
  active: 1,
  location.lat: 1,
  location.lng: 1
});
