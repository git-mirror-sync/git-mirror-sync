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
var oauth2 = new OAuth.OAuth2(
  process.env.BB_KEY,
  process.env.BB_SECRET,
  'https://bitbucket.org/site/oauth2',
  '/authorize',
  '/access_token',
  null
);

oauth2.useAuthorizationHeaderforGET(true);

// configure the environment
winston.level = process.env.WINSTON_LEVEL;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/login', function(req, res) {
  winston.log("info", "login");

  var authUrl = oauth2.getAuthorizeUrl({
    'response_type':'code'
  });

  res.redirect(authUrl);
});

app.get('/bbauth', function(req, res) {
  winston.log("debug", req);
  res.send(req.query.code);
});

app.get('/code', function(req, res) {
  winston.log("info", "GET /bbauth");

  oauth2.getOAuthAccessToken(
    req.query.code, 
    {
      'response_type':'code',
      'grant_type':'authorization_code'
    },
    function(error, oauth_token, oauth_token_secret, results) {
    if (error) {
      winston.log("error", error);
      res.sendStatus("500");
    } else {
      winston.log("debug", oauth_token);
      winston.log("debug", oauth_token_secret);

      res.send(oauth_token);
    }
  });
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
