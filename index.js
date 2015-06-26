var express = require('express');
var winston = require('winston');
var bodyParser = require('body-parser');
var app = express();

winston.level = 'debug';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  winston.info("GET / request");
  winston.log('debug', req.body);
  res.send("hi");
});

app.post('/repos/:owner/:repo/hooks/:id/tests', function (req, res) {
  winston.info("POST /repos/:owner/:repo/hooks/:id/tests request");
  winston.log('debug', req.body);
  res.send(req.body);
});

var port = process.env.PORT || 3002;

var server = app.listen(port, function () {
  winston.info('Example app listening at %s', port);
});
