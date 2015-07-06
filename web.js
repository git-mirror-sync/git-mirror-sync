// load the dependencies
var utils = require('./utils');
var tasks = require('./tasks');

var winston = require('winston');
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var amqp = require('amqplib');

// setup environment variables
var app = module.exports = express();
var port = process.env.PORT || 3002;

mongoose.connect(process.env.MONGO_DB);

// configure the environment
winston.level = process.env.WINSTON_LEVEL;
app.set('view engine', 'jade');
app.use(express.static('public'));
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

app.use(utils.passport.initialize());
app.use(utils.passport.session());

amqp.connect(process.env.RABBITMQ_BIGWIG_URL).then(function(conn) {
  conn.createChannel().then(function(ch) {
    var q = 'gms.queue';
    var ok = ch.assertQueue(q, {durable: true});
    
    return ok.then(function() {
      require("./routes")(app, utils.models, utils.passport, tasks, ch);
    });
  });
});


app.listen(port, function () {
  winston.info('Example app listening at %s', port);
});
