var connect      = require('connect');
var LevelDBStore = require('../')(connect);
var fs = require('fs');
var rimraf = require('rimraf');

describe('constructor', function() {

  describe('no options', function(done) {

    it('should initialize ok with no options', function() {
      var store = new LevelDBStore({}, done);
    });

  });

  after(function(done) {
    rimraf('../.sess', done);
  })

});