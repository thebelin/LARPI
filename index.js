// Express framework
var express = require('express'),

// The app package
  app = express(),

// An http server
  server = require('http').createServer(app),

// Socket.io for live data
  io = require('socket.io')(server),

// the body-parser for form processing
  bodyParser = require('body-parser'),

// Get the async module to do async response
  async = require('async'),

// Let's compress our http output
  compression = require('compression'),

// Authentication Middleware
  passport = require('passport'),

// Authentication middleware strategies for passport
  strategies = {
    local: require('passport-local').Strategy,
    facebook: require('passport-facebook').Strategy,
    google: require('passport-google').Strategy,
    twitter: require('passport-twitter').Strategy
  },

// Get all the environment vars from the env.json library
  env = require(__dirname + '/env.json'),

// The static web folder for holding content
  staticFolder = __dirname + '/' + (env.DIST_FOLDER || 'app'),

// A collection of async routes to run on the server
  appAsyncItems = [
    // Root path for serving support files from site
    express.static(staticFolder + '/html')
  ],

// This organizes the items which are incoming for async load
  parallel = function (middlewares) {
    return function (req, res, next) {
      async.each(middlewares, function (mw, cb) {
        mw(req, res, cb);
      }, next);
    };
  },

// A compression helper
  shouldCompress = function (req, res) {
    if (req.headers['x-no-compression']) {
      // don't compress responses with this request header
      return false
    }

    // fallback to standard filter function
    return compression.filter(req, res)
  };

// Make the POST and PUT data available
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Root path for serving support files from site
console.log('starting static http server on html files');
app.use(express.static('app/html'));

// Allow Cross-Origin GET and POST requests from any host
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,x-no-compression Authorization');
  next();
});

// Start up compression on everything
app.use(compression({filter: shouldCompress}));

// Start up the async server item collection
app.use(parallel(appAsyncItems));

// Authentication middleware for user token creation
passport.use(new strategies.local(
  function(email, password, done) {
    var User = require('mongoose').model('User', require(__dirname + '/models/user.js'))
    User.findOne({ email: email }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      // Password will be encoded
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

// @TODO Start Socket.io based middleware for interactions
// @TODO Look for interaction modules and expose them

// Start the server
console.log('listening on ' + env.PORT || 8080);
server.listen(env.PORT || 8080);
