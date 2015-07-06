var winston = require('winston');
var request = require('request');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
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

module.exports = function(app, models, passport) {
  app.get('/logout', function(req, res) {
    winston.log("info", "GET /logout");
    req.logout();
    res.redirect("/");
  });

  // initialize gitbucket oauth
  app.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }));

  // github callback
  app.get('/auth/github/callback',  passport.authenticate('github'), function(req, res) {
    winston.log("info", "GET /auth/github/callback");
    res.redirect("/profile");
  });

  // initialize bitbucket oauth
  app.get('/auth/bitbucket',  app.ensureAuthenticated, function(req, res) {
    winston.log("info", "GET /auth/bitbucket");

    res.redirect(oauth2.getAuthorizeUrl({
      'response_type':'code'
    }));
  });

  // bitbucket callback
  app.get('/auth/bitbucket/callback', app.ensureAuthenticated, function(req, res) {
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
              tokenType: body.token_type,
              createdAt: new Date.now()
            };

            models.user.update({username:req.user.username}, {
              'bitbucket': bitbucket
            }, function(err) {
              if (err) {
                winston.error(err);
                res.redirect("/profile");
              } else {
                res.redirect("/profile");
              }
            });
          }
        });
      }
  });
};
