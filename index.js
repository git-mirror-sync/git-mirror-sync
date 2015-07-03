// load the dependencies
var passport = require('./auth');
var Tasks = require('./tasks');
var models = require("./schema").models;

var winston = require('winston');
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// setup environment variables
var bb_auth;
var app = module.exports = express();
var port = process.env.PORT || 3002;

mongoose.connect(process.env.MONGO_DB);

// configure the environment
winston.level = process.env.WINSTON_LEVEL;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session(
  {
    store: new MongoStore(
      { 
        mongooseConnection: mongoose.connection
      },
      function(err){
        console.log(err || 'connect-mongodb setup ok');
      }
    ),
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: false
  }
));
app.use(passport.initialize());
app.use(passport.session());

var ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) { 
    console.log("isauth");
    console.log(req.user);
      return next();
  }

  res.redirect('/oauth/github');
};
//});

require("./routes/routes")(app, models, passport);

app.listen(port, function () {
  winston.info('Example app listening at %s', port);
});
