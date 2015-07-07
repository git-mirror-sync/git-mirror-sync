// load the dependencies
var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;
var winston = require('winston');
var models = require("./schema").models;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new GitHubStrategy({
    clientID: process.env.GH_ID,
    clientSecret: process.env.GH_SECRET,
    callbackURL: process.env.GH_CALLBACK
  },
  function(accessToken, refreshToken, profile, done) {
    models.user.findOne({ githubId: profile.id }, function (err, user) {
      if (err) {
        winston.log("error", err);
        return done(err);
      }

      if (!user) {
        user = new models.user({
          githubId: profile.id,
          displayName: profile.displayName,
          username: profile.username,
          accessToken: accessToken,
          createdAt: Date.now()
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
