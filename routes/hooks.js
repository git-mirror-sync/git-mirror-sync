var winston = require('winston');
var Q = require('q');
var request = require('request');
var spawn = require('child_process').spawn;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var bb_client = process.env.BB_KEY;
var bb_secret = process.env.BB_SECRET;

module.exports = function(app, models) {
  // initialize the sync of a repo
  app.post('/', function (req, res) {
    var username;

    if(typeof(req.body.organization) !== 'undefined') {
      username = req.body.organization.login;
    } else {
      username = req.body.repository.owner.login;
    }

    console.log(username);
    
    models.user.find({username: username}, function(err, user) {
      winston.log("debug", user);

      var bbkeyName = username + '_token';
      bbkeyName = bbkeyName.replace(/-|\//g, '');
      bbkeyName = bbkeyName.toUpperCase();

      winston.log('debug', bbkeyName);

      var config = {
        owner: username,
        bbkey: process.env[bbkeyName],
        ghkey: process.env.GH_TOKEN,
        repo: req.body.repository.full_name,
        uname: process.env.BB_USER,
        pword: process.env.BB_PASS,
        cwd: 'gh'
      };

      winston.log('debug', config);
    });

    //if (typeof(config.bbkey) == 'undefined') {
      //winston.error('bbkey "' + bbkeyName + '" missing, please create one for bitbucket.com/' + username);
      //res.sendStatus(500);
    //} else {
      //var err = null;

      //Tasks.checkBitbucket(config)
      //.then(Tasks.gitClone)
      //.then(Tasks.fetchAll)
      //.then(Tasks.addMirror)
      //.then(Tasks.pushMirror)
      //.catch(function (e) {
        //err = e;
        //winston.error(e);
      //})
      //.done(function() {
        ////once were done cleanup and delete the downloaded code
        //var child = spawn(
          //'rm',
          //[
            //'-rf', 
            //config.cwd
          //]
        //);

        //child.stderr.on('data', function (data) {
          //err = new Error(data);
        //});

        //child.on('close', function (code) {
          //if (err === null) {
            //winston.log('debug', 'deleted repo');
            //res.sendStatus(204);
          //} else {
            //winston.error(err);
            //res.sendStatus(500);
          //}
        //});
      //});
    //}
  });
};
