var winston = require('winston');

module.exports = function(app, models, passport, tasks, channel) {
  app.ensureAuthenticated = function (req, res, next) {
    winston.info("ensureAuthenticated");
    winston.log("debug", "isAutneticated: ", req.isAuthenticated());

    if (req.isAuthenticated()) { 
        return next();
    }

    res.redirect('/auth/github');
  };

  app.get('/ping', function(req, res) {
    winston.log("info", "GET /ping");
    res.send("pong");
  });

  require("./profile")(app, models);
  require("./auth")(app, models, passport);
  require("./auth")(app, models, passport);
  require("./hooks")(app, models, tasks, channel);
};
