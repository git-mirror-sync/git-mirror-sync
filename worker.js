var winston = require('winston');
var spawn = require('child_process').spawn;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uuid = require('node-uuid');
var amqp = require('amqplib');

var tasks = require('./tasks');
var utils = require('./utils');

mongoose.connect(process.env.MONGO_DB);

amqp.connect(process.env.RABBITMQ_BIGWIG_URL, {
  deliveryTagInPayload: true, 
  defaultExchangeName: "gms.exchange"
}).then(function(conn) {
  process.once('SIGINT', function() { conn.close(); });
  return conn.createChannel().then(function(ch) {
    var ok = ch.assertQueue('gms.queue', {durable: true});
    ok = ok.then(function() { ch.prefetch(1); });
    ok = ok.then(function() {
      ch.consume('gms.queue', doWork, {noAck: false});
    });
    return ok;

    function doWork(msg) {
      var body = JSON.parse(msg.content.toString());
      var username;
      var type;

      if(typeof(body.organization) !== 'undefined') {
        username = body.organization.login;
        type="org";
      } else {
        username = body.repository.owner.login;
        type="user";
      }
      
      utils.models.user.findOne({username: body.sender.login}, function(err, user) {
        var bbkeyName = username + '_token';
        bbkeyName = bbkeyName.replace(/-|\//g, '');
        bbkeyName = bbkeyName.toUpperCase();

        var logEntry = new utils.models.log({
          repo: body.repository.full_name,
          user: user,
          request: msg.content
        });

        winston.log('debug', bbkeyName);

        var config = {
          owner: username,
          bbkey: user.bitbucket.accessToken,
          bbrefresh: user.bitbucket.refreshToken,
          bbclient: process.env.BB_KEY,
          bbsecret: process.env.BB_SECRET,
          ghkey: user.accessToken,
          repo: body.repository.full_name,
          cwd: uuid.v4(),
          type: type,
          logEntry: logEntry
        };

        tasks.checkBitbucket(config)
        .then(tasks.gitClone)
        .then(tasks.fetchAll)
        .then(tasks.addMirror)
        .then(tasks.pushMirror)
        .catch(function (e) {
          err = e;
          logEntry.status = "error";
          logEntry.message = e;
          logEntry.save(function(err) {
            if (err) {
              winston.error(err);
            }
          });

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

          child.on('close', function () {
            if (err === null) {
              logEntry.status = "success";
              logEntry.save(function(err) {
                if (err) {
                  winston.error(err);
                }
              });

              winston.log('debug', 'deleted repo');
              ch.ack(msg);
            } else {
              logEntry.status = "error";
              logEntry.message = err;
              logEntry.save(function(err) {
                if (err) {
                  winston.error(err);
                }
              });

              ch.nack(err);
            }
          });
        });
      });
    }
  });
}).then(null, console.warn);
