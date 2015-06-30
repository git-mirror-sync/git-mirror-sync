var passport = require('./auth');
var models = require("./schema").models;

var winston = require('winston');
var Q = require('q');
var request = require('request');
var spawn = require('child_process').spawn;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var GitHubApi = require('github');
var OAuth   = require('oauth');

var bb_client = process.env.BB_KEY;
var bb_secret = process.env.BB_SECRET;

var oauth2 = new OAuth.OAuth2(
  bb_client,
  bb_secret,
  'https://bitbucket.org/site/oauth2',
  '/authorize',
  '/access_token',
  null
);

module.exports = function(app) {
  // index
  app.get('/', function(req, res) {
    winston.log("info", "GET /");

    if(typeof req.user === 'undefined') {
      winston.log("error", "must login first at /auth/github");
      res.sendStatus(401);
    } else {
      res.send(req.user);
    }
    //var github = new GitHubApi({
      //version: '3.0.0',
      //protocol: 'https',
      //host: 'api.github.com',
      //timeout: 5000
    //});

    //github.authenticate({
      //type: 'oauth',
      //key: process.env.GH_ID,
      //secret: process.env.GH_SECRET
    //});

    //github.user.get({
      //user: req.user.username
    //}, function(err, ghRes) {
      //if (err) {
        //winston.error(err);
        //res.sendStatus(500);
      //} else {
        //winston.log('debug', JSON.stringify(ghRes));
        //res.send(ghRes);
      //}
    //});
  });

  // initialize gitbucket oauth
  app.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }));

  // github callback
  app.get('/auth/github/callback',  passport.authenticate('github'), function(req, res) {
      winston.log("info", "GET /auth/github/callback");
      res.send("done");
    }
  );

  // initialize bitbucket oauth
  app.get('/auth/bitbucket', function(req, res) {
    winston.log("info", "GET /auth/bitbucket");

    if(typeof req.user === 'undefined') {
      winston.log("error", "must login first at /auth/github");
      res.sendStatus(401);
    } else {
      var authUrl = oauth2.getAuthorizeUrl({
        'response_type':'code'
      });

      res.redirect(authUrl);
    }
  });

  // bitbucket callback
  app.get('/auth/bitbucket/callback', function(req, res) {
    winston.log("info", "GET /auth/bitbucket/callback");
    var code = req.query.code;

    if(typeof code === undefined) {
      winston.log('error', '/code param code is missing');
      res.sendStatus(500);
    } else {
      request
      .post(
        {
          url: 'https://' + bb_client + ':' + bb_secret + '@bitbucket.org/site/oauth2/access_token',
          form: {
            grant_type:'authorization_code',
            code: code 
          }
        },
        function(error, response, body) {
          if (error) {
            winston.log('debug', error);
            res.sendStatus(500);
          } else {
            body = JSON.parse(body);

            var bitbucket = {
              code: code,
              accessToken: body.access_token,
              scopes: body.scopes,
              expiresIn: body.expires_in,
              refreshToken: body.refresh_token,
              tokenType: body.token_type
            };

            winston.log("debug", bitbucket);

            models.user.update({username:"obihann"}, {
              'bitbucket': bitbucket
            }, function(err, user) {
              if (err) {
                winston.error(err);
                res.send(err);
              } else {
                res.send(body);
              }
            });
          }
        });
    }
  });

  // initialize the sync of a repo
  app.post('/', function (req, res) {
    var org;

    if(typeof(req.body.organization) !== 'undefined') {
      org = req.body.organization.login;
    } else {
      org = req.body.repository.owner.login;
    }

    winston.log('debug', org);

    var bbkeyName = org + '_token';
    bbkeyName = bbkeyName.replace(/-|\//g, '');
    bbkeyName = bbkeyName.toUpperCase();

    winston.log('debug', bbkeyName);

    var config = {
      owner: org,
      bbkey: process.env[bbkeyName],
      ghkey: process.env.GH_TOKEN,
      repo: req.body.repository.full_name,
      uname: process.env.BB_USER,
      pword: process.env.BB_PASS,
      cwd: 'gh'
    };

    winston.log('debug', config);

    if (typeof(config.bbkey) == 'undefined') {
      winston.error('bbkey "' + bbkeyName + '" missing, please create one for bitbucket.com/' + org);
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
          'rm',
          [
            '-rf', 
            config.cwd
          ]
        );

        child.stderr.on('data', function (data) {
          err = new Error(data);
        });

        child.on('close', function (code) {
          if (err === null) {
            winston.log('debug', 'deleted repo');
            res.sendStatus(204);
          } else {
            winston.error(err);
            res.sendStatus(500);
          }
        });
      });
    }
  });
};
