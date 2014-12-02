var should = require('chai').should(),
    conf = require('../config'),
    Siaje = require('../lib/siaje');

describe('#connect', function() {
    
    it('success to connect to SIAJE',function(done) {
        var s2 = new Siaje(conf.connection.je, conf.connection.login, conf.connection.pass, function(err) {
           should.not.exist(err); 
           done();
        });
    });
    
    it('fail to connect to SIAJE',function(done) {
        var s1 = new Siaje(conf.connection.je, conf.connection.login, conf.connection.pass+'a', function(err) {
           err.should.equal('Wrong username or password'); 
           done();
        });
    });
   
    it('success to connect after a failure. SIAJE security against bruteforcing',function(done) {
        this.timeout(10000);
        setTimeout(function() {
        var s22 = new Siaje(conf.connection.je, conf.connection.login, conf.connection.pass, function(err2) {
           should.not.exist(err2); 
           done();
        });
        }, 3000);
    });

});
