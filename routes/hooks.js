var winston = require('winston');
var Q = require('q');
var request = require('request');
var spawn = require('child_process').spawn;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var uuid = require('node-uuid');

var bb_client = process.env.BB_KEY;
var bb_secret = process.env.BB_SECRET;

module.exports = function(app, models, tasks) {
  // initialize the sync of a repo
  app.post('/', function (req, res) {
    winston.log("info", "POST /");

    var username;

    console.log(req.body);

    if(typeof(req.body.organization) !== 'undefined') {
      username = req.body.organization.login;
    } else {
      username = req.body.repository.owner.login;
    }
    
    models.user.findOne({username: req.body.sender.login}, function(err, user) {
      var bbkeyName = username + '_token';
      bbkeyName = bbkeyName.replace(/-|\//g, '');
      bbkeyName = bbkeyName.toUpperCase();

      winston.log('debug', bbkeyName);

      var config = {
        owner: username,
        bbkey: user.bitbucket.accessToken,
        bbrefresh: user.bitbucket.refreshToken,
        bbclient: process.env.BB_KEY,
        bbsecret: process.env.BB_SECRET,
        ghkey: user.accessToken,
        repo: req.body.repository.full_name,
        cwd: uuid.v4()
      };

      tasks.checkBitbucket(config)
      .then(tasks.gitClone)
      .then(tasks.fetchAll)
      .then(tasks.addMirror)
      .then(tasks.pushMirror)
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
    });
  });
};
