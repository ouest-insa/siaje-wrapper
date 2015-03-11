var should = require('chai').should(),
    conf = require('../config'),
    Siaje = require('../lib/siaje');

describe('new Siaje()', function() {
    
    it('success to connect to SIAJE',function(done) {
        var s = new Siaje(conf.connection.je, conf.connection.login, conf.connection.pass, function(err) {
           should.not.exist(err); 
           done();
        });
    });
    
    it('fail to connect to SIAJE',function(done) {
        var s = new Siaje(conf.connection.je, conf.connection.login, conf.connection.pass+'a', function(err) {
           err.should.equal('Wrong username or password'); 
           done();
        });
    });
   
    it('success to connect after a failure. SIAJE security against bruteforcing', function(done) {
        this.timeout(10000);
        setTimeout(function() {
        global.s = new Siaje(conf.connection.je, conf.connection.login, conf.connection.pass, function(err) {
           should.not.exist(err); 
           done();
        });
        }, 3000);
    });
});

describe('Siaje.getStudies()', function() {
    it('retrieve studies',function(done) {
        global.s.getStudies(function(err,res) {
           should.not.exist(err);
           done();
        });
    });
});

describe('Siaje.getStudy()', function() {
    it('retrieve a study',function(done) {
        global.s.getStudy(2, function(err,res) {
           should.not.exist(err);
           done();
        });
    });
});
