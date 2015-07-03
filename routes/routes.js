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
      res.send("<html><body><a href='/auth/github'>Connect to Github</a></body></html>");
    }
  });

  // index
  app.get('/profile', app.ensureAuthenticated, function(req, res) {
    winston.log("info", "GET /profile");

    console.log(req.user);

    res.send("<html><body><a href='/auth/bitbucket'>Connect to BitBucket</a></body></html>");

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

  require("./auth")(app, models, passport);
  require("./hooks")(app, models, tasks);
};
