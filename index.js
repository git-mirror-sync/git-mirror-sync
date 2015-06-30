// load the dependencies
var passport = require('./auth');
var Tasks = require('./tasks');
var Routes = require("./routes");

var winston = require('winston');
var express = require('express');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// setup environment variables
var bb_auth;
var app = module.exports = express();
var port = process.env.PORT || 3002;

mongoose.connect('mongodb://localhost/gitmirrorsync');

// configure the environment
winston.level = process.env.WINSTON_LEVEL;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieSession({
  keys: ['gms']
}));
app.use(passport.initialize());
app.use(passport.session());

Routes(app);

app.listen(port, function () {
  winston.info('Example app listening at %s', port);
});
