var winston = require('winston');

module.exports = function(app, models, tasks, channel) {
  // initialize the sync of a repo
  app.post('/', function (req, res) {
    winston.log("info", "POST /");

    channel.sendToQueue("gms.queue", new Buffer(JSON.stringify(req.body)), {deliveryMode: true});
    res.sendStatus(201);
  });
};
