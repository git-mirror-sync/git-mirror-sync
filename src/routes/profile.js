var winston = require('winston');
var _ = require('lodash');

module.exports = function(app, models) {
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
      models.log.find({user: req.user._id}, function(err, logs) {
        if (err) {
          winston.error(err);
        }

        var opts = {
          logs: logs.reverse()
        };

        res.render('profile', opts);
      });
    } else {
      res.render('bb-sign-in');
    }
  });
};
