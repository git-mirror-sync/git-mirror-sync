// load the dependencies
var request = require('request');
var OAuth   = require('oauth');
var express = require('express');
var winston = require('winston');
var bodyParser = require('body-parser');
var spawn = require('child_process').spawn;
var Q = require('q');
var Tasks = require('./tasks');

// setup environment variables
var app = module.exports = express();
var port = process.env.PORT || 3002;

// configure the environment
winston.level = process.env.WINSTON_LEVEL;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/login', function(req, res) {
  winston.log("info", "login");
  var apiKey = process.env.BB_KEY;
  var apiSecret = process.env.BB_SECRET;

  if(typeof apiKey !== 'undefined' || typeof apiSecret !== 'undefined') {
    var oauth = new OAuth.OAuth(
      'https://bitbucket.org/api/1.0/oauth/request_token',
      'https://bitbucket.org/!api/1.0/oauth/access_token',
      apiKey,
      apiSecret,
      '1.0',
      'https://git-mirror-sync.herokuapp.com/bbauth',
      'HMAC-SHA1'
    );

    oauth.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
      if (error) {
        winston.log("error", error);
        res.sendStatus("500");
      } else {
        winston.log("debug", oauth_token);
        winston.log("debug", oauth_token_secret);

        res.redirect("https://bitbucket.org/api/1.0/oauth/authenticate?oauth_token="+ oauth_token);
      }
    });
  } else {
    winston.error("missing bitbucket client_id expected enviroment variable BB_KEY");
    res.sendStatus(500);
  }
});

app.get('/bbauth', function(req, res) {
  winston.log("info", "GET /bbauth");

  var auth = req.query.oauth_token;
  var verifier = req.query.oauth_verifier;

  if (typeof auth !== 'undefined') {
      winston.log("debug", auth);
      res.sendStatus("204");
  } else {
    winston.error("missing code param in bitbucket oauth callback");
      res.sendStatus("500");
  }
});

app.post('/', function (req, res) {
  var org;

  if(typeof(req.body.organization) !== 'undefined') {
    org = req.body.organization.login;
  } else {
    org = req.body.repository.owner.login;
  }

  winston.log("debug", org);

  var bbkeyName = org + "_token";
  bbkeyName = bbkeyName.replace(/-|\//g, "");
  bbkeyName = bbkeyName.toUpperCase();

  winston.log("debug", bbkeyName);

  var config = {
    owner: org,
    bbkey: process.env[bbkeyName],
    ghkey: process.env.GH_TOKEN,
    repo: req.body.repository.full_name,
    uname: process.env.BB_USER,
    pword: process.env.BB_PASS,
    cwd: "gh"
  };

  winston.log("debug", config);

  if (typeof(config.bbkey) == "undefined") {
    winston.error("bbkey '" + bbkeyName + "' missing, please create one for bitbucket.com/" + org);
    res.sendStatus(500);
  } else {
    var err = null;

    Tasks.checkBitbucket(config)
    .then(Tasks.gitClone)
    .then(Tasks.fetchAll)
    .then(Tasks.addMirror)
    .then(Tasks.pushMirror)
    .catch(function (e) {
      err = e;
      winston.error(e);
    })
    .done(function() {
      //once were done cleanup and delete the downloaded code
      var child = spawn(
        "rm",
        [
          "-rf", 
          config.cwd
        ]
      );

      child.stderr.on('data', function (data) {
        err = new Error(data);
      });

      child.on('close', function (code) {
        if (err === null) {
          winston.log("debug", "deleted repo");
          res.sendStatus(204);
        } else {
          winston.error(err);
          res.sendStatus(500);
        }
      });
    });
  }
});

app.listen(port, function () {
  winston.info('Example app listening at %s', port);
});
