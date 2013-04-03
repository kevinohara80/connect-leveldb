
var util    = require('util');
var levelup = require('levelup');
var path    = require('path');

var oneDay = 86400;

module.exports = function(connect) {

  var Store = connect.session.Store;

  // LevelDBStore class definition
  function LevelDBStore(options, cb) {

    var self = this;

    if(!options) options = {};
    if(!cb) cb = function() {};

    this.prefix = null == options.prefix
      ? 'sess:'
      : options.prefix;

    this.ttl =  options.ttl;

    Store.call(this, options);

    // use options.path or default to ./sess for db location
    levelup(options.path || './.sess', options, function(err, db) {
      if(err) throw err;
      self.db = db;
      cb();
    });

  }

  // inherit from connect.session.Store
  util.inherits(LevelDBStore, Store);

  // session store get
  LevelDBStore.prototype.get = function(sid, cb) {
    sid = this.prefix + sid;
    console.log('get::sid -> ' + sid);
    this.db.get(sid, function(err, sess) {
      var result;
      if(err || !sess) return cb();
      try {
        result = JSON.parse(sess); 
      } catch (err) {
        return cb(err);
      }
      return cb(null, result);
    });
  }

  // session store set
  LevelDBStore.prototype.set = function(sid, sess, cb) {
    sid = this.prefix + sid;
    console.log('set::sid -> ' + sid);
    try {
      var maxAge = sess.cookie.maxAge;
      var ttl = this.ttl;
      
      sess = JSON.stringify(sess);

      ttl = ttl || ('number' == typeof maxAge
          ? maxAge / 1000 | 0
          : oneDay);

      this.db.put(sid, sess, function(err){
        if(err) {
          console.log('set::sid -> NOT OK');
        } else {
          console.log('set::sid -> OK');
        }
        cb && cb.apply(this, arguments);
      });

    } catch (err) {
      cb && cb(err);
    } 
  }

  // session store destroy
  LevelDBStore.prototype.destroy = function(sid, cb) {
    sid = this.prefix + sid;
    console.log('del::sid -> ' + sid);
    this.client.del(sid, fn);
  }

  return LevelDBStore;

}