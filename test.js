var winston = require('winston');
var assert = require('assert');
var should = require('should'); 
var request = require('superagent');
var app = require('./index');

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
    describe('Get', function() {
        winston.info("route /");

        it('check default route', function(done) {
            request
                .get(url + '/')
                .end(function(err, res) {
                    assert(res.status, 200);
                    assert(res.body, "hi");
                    done();
                });
        });
    });

    describe('Post', function() {
        winston.info("route /repos/obihann/git-mirror-sync/hooks/1/tests");
        winston.log("debug", "posting: " + profile);

        it('check default route', function(done) {
            request
                .post(url + '/repos/obihann/git-mirror-sync/hooks/1/tests')
                .send(profile)
                .end(function(err, res) {
                    assert(res.status, 200);
                    done();
                });
            });
    });
});
