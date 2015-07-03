var request = require('request');
var fs = require('fs');
var spawn = require('child_process').spawn;
var winston = require('winston');
var Q = require('q');

var git="git";

function childExit(deferred, code, config, err) {
  if (code !== 0) {
    if (typeof(err) !== undefined) {
      deferred.reject(err);
    } else {
      deferred.reject(new Error("child process failed response expected 0 actual " + code));
    }
  } else {
    deferred.resolve(config);
  }
}

module.exports = {
  checkBitbucket: function (config) {
    winston.log("info", "checkBitbucket");

    var deferred = Q.defer();

    var oauth = { 
      callback: 'http://mysite.com/callback/',
      consumer_key: config.bbclient,
      consumer_secret:config.bbsecret 
    };

    request
    .get({
      url: 'https://bitbucket.org/api/2.0/repositories/' + config.repo,
      oauth: oauth
    })
    .on('response', function(bbRes) {
      // TODO: if repo does not exist create one
      if(bbRes.statusCode == 200){
        deferred.resolve(config);
      } else {
        deferred.reject(new Error("Expected status 200 from bitbucket.org actual " + bbRes.statusCode));
      }
    })
    .on('error', function(e) {
      deferred.reject(err);
    });

    return deferred.promise;
  },
  // spawn a sub process to clone a new git repo
  gitClone: function (config) {
    winston.log("info", "gitClone");

    var deferred = Q.defer();
    var child = spawn(
      git, 
      [
        "clone", 
        "https://" + config.ghkey + "@github.com/" + config.repo + ".git", 
        config.cwd
      ]
    );

    var err;

    child.stderr.on("data", function (data) {
      err = new Error('' + data);
    });

    child.on("close", function(code) {
      childExit(deferred, code, config, err);
    });

    return deferred.promise;
  },
  // spawn a process to fetch all branches from th erepo 
  fetchAll: function (config) {
    winston.log("info", "fetchAll");

    var deferred = Q.defer();
    var qReadFile = Q.nfbind(fs.readFile);
    var qWriteFile = Q.nfbind(fs.writeFile);

    qReadFile('checkoutall.sh', 'utf8')
    .then(
      function (data) {
        return qWriteFile(config.cwd + "/checkoutall.sh", data);
      }
    )
    .then(function() {
      var child = spawn(
        "sh",
        ["checkoutall.sh"],
        {cwd: config.cwd}
      );

      child.on('close', function (code) {
        childExit(deferred, code, config);
      });

      child.stderr.on('data', function (data) {
        var err = new Error('' + data);
        deferred.reject(err);
      });
    })
    .catch(function(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  },
  // spawn a process to add a mirror to a git repo
  addMirror: function (config) {
    winston.log("info", "addMirror");

    var deferred = Q.defer();

    var child = spawn(
      git,
      [
        "remote", 
        "add", 
        "mirror", 
        "https://x-token-auth:" + config.bbkey + "@bitbucket.org/" + config.repo + ".git", 
        "--mirror=push"
      ],
      {cwd: config.cwd}
    );

    child.on('close', function (code) {
      childExit(deferred, code, config);
    });

    child.stdout.on('data', function (data) {
      console.log(' ' + data);
    });

    child.stderr.on('data', function (data) {
      var err = new Error('' + data);
      deferred.reject(err);
    });

    return deferred.promise;
  },
  // spawn a process to add a mirror to a git repo
  pushMirror: function (config) {
    winston.log("info", "pushMirror");

    var deferred = Q.defer();

    var child = spawn(
      git,
      [
        "push", 
        "mirror",
      ],
      {cwd: config.cwd}
    );

    var err;

    child.stdout.on('data', function (data) {
      console.log(' ' + data);
    });

    child.stderr.on('data', function (data) {
      err = new Error('' + data);
    });

    child.on('close', function (code) {
      childExit(deferred, code, config, err);
    });

    return deferred.promise;
  }
};
