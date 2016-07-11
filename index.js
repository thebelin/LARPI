// Express framework
var express = require('express'),

// The app package
  app = express(),

// An http server
  server = require('http').createServer(app),

// Socket.io for live data
  io = require('socket.io')(server),

// the body-parser for form processing
  bodyParser = require('body-parser')

// Get the async module to do async response
  async = require('async'),

// Let's compress our http output
  compression = require('compression'),

// Get all the environment vars from the env.json library
  env = require(__dirname + "/env.json"),

// The static web folder for holding content
  staticFolder = __dirname + '/' + (env.DIST_FOLDER || 'dist'),

// The security key to post to secure endpoints
  securityKey = env.SECURITYKEY || 'ChangeMe2SomethingNew',

// A basic security model
  basic_auth = function (req, res, next) {
    if (req.headers.authorization && req.headers.authorization.search('Basic ') === 0) {
      // fetch login and password
      if (new Buffer(req.headers.authorization.split(' ')[1], 'base64').toString() == 'admin:' + securityKey) {
        next();
        return;
      }
    }
    console.log('Unable to authenticate user', req.headers.authorization);
    res.header('WWW-Authenticate', 'Basic realm="Admin Area"');
    if (req.headers.authorization) {
      setTimeout(function () {
        res.send('Authentication required', 401);
      }, 5000);
    } else {
      res.send('Authentication required', 401);
    }
  },

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

// Make the POST and PUT data available
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Start up compression on everything
app.use(compression({filter: shouldCompress}));

// Start up the async server item collection
app.use(parallel(appAsyncItems));


// @TODO Add Authentication middleware for user token creation
// @TODO Start Socket.io based middleware for interactions
// @TODO Look for interaction modules and expose them

// Start the server
console.log('listening on ' + env.PORT || 8080);
server.listen(env.PORT || 8080);
