var winston = require('winston');
var assert = require('assert');
var request = require('superagent');
var app = require('../index');

var port = process.env.PORT || 3002;
var url = "http://localhost:" + port;

app.listen(port, function () {
  winston.info('Example app listening at %s', port);
});

winston.level = 'debug';
winston.info("testing: " + url);

var profile = {
    something: 'somethingelse',
};

describe('Hooks', function() {
    describe('Post', function() {
        winston.info("route /");
        winston.log("debug", "posting: " + profile);

        it('check default route', function(done) {
            request
                .post(url + '/')
                .send(profile)
                .end(function(err, res) {
                    assert(res.status, 200);
                    done();
                });
            });
    });
});
