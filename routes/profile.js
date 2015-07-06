var winston = require('winston');

module.exports = function(app) {
  // index
  app.get('/', function(req, res) {
    winston.log("info", "GET /");

    if(typeof req.user !== 'undefined') {
      res.redirect("/profile");
    } else {
      res.render('index');
    }
  });

  app.get('/ping', function(req, res) {
    winston.log("info", "GET /");
    res.send("pong");
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
};
