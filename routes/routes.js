var winston = require('winston');
var GitHubApi = require('github');

module.exports = function(app, models, passport, tasks) {
  app.ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) { 
        return next();
    }

    res.redirect('/auth/github');
  };

  // index
  app.get('/', function(req, res) {
    winston.log("info", "GET /");

    if(typeof req.user !== 'undefined') {
      res.redirect("/profile");
    } else {
      res.render('index');
    }
  });

  // index
  app.get('/profile', app.ensureAuthenticated, function(req, res) {
    winston.log("info", "GET /profile");

    if (typeof req.user.bitbucket !== "undefined") {
      res.render('done');
    } else {
      res.render('profile');
    }
  });

  require("./auth")(app, models, passport);
  require("./hooks")(app, models, tasks);
};
