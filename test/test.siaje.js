var should = require('chai').should(),
    conf = require('../config'),
    Siaje = require('../lib/siaje');

describe('#connect', function() {
    it('connect to SIAJE',function() {
        var s = new Siaje(conf.connection.je, conf.connection.login, conf.connection.pass, function(err) {
           err.should.equal(null); 
        });

    });
});
