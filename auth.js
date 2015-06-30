// load the dependencies
var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;
var winston = require('winston');
var mongoose = require('mongoose');
var Schemas = require("./schema");

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new GitHubStrategy({
    clientID: process.env.GH_ID,
    clientSecret: process.env.GH_SECRET,
    callbackURL: 'http://127.0.0.1:3002/auth/github/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    Schemas.models.user.findOne({ githubId: profile.id }, function (err, user) {
      if (err) {
        winston.log("error", err);
        return done(err);
      }

      if (!user) {
        user = new Schemas.models.user({
          githubId: profile.id,
          displayName: profile.displayName,
          username: profile.username,
          email: profile._json.email,
          accessToken: accessToken
        });

        user.save(function(err) {
          if (err) {
            return done(err);
          } else {
            return done(null, user);
          }
        });
      } else {
        return done(null, user);
      }
    });
  }
));

module.exports = passport;
