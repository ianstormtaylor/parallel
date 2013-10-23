
describe('parallel', function () {

  var assert = require('assert');
  var parallel = require('parallel');
  var tick = require('next-tick');

  describe('#add', function () {
    it('should push a new handler', function () {
      var fn = function(){};
      var p = parallel().add(fn);
      var fns = p.fns;
      assert(1 == fns.length);
      assert(fn == fns[0].fn);
      assert(null == fns[0].args);
    });

    it('should take optional args', function () {
      var p = parallel().add(function(){}, 1, 2, 3);
      var args = p.fns[0].args;
      assert(1 == args[0]);
      assert(2 == args[1]);
      assert(3 == args[2]);
    });

    it('should be chainable', function () {
      var p = parallel();
      assert(p == p.add(function(){}));
    });
  });

  describe('#bind', function () {
    it('should store a context', function () {
      var obj = {};
      var p = parallel().bind(obj);
      assert(obj == p.context);
    });

    it('should be chainable', function () {
      var p = parallel();
      assert(p == p.bind());
    });
  });

  describe('#run', function () {
    it('should call a handler', function (done) {
      parallel()
        .add(function (callback) {
          callback(null, 'result');
        })
        .run(function (err, res) {
          assert('result' == res[0]);
          done();
        });
    });

    it('should call the handlers in parallel', function (done) {
      var value = 1;
      parallel()
        .add(function (callback) {
          tick(function () {
            assert(2 == value);
            callback();
          });
        })
        .add(function (callback) {
          assert(1 == value);
          value++;
          callback();
        })
        .run(done);
    });

    it('should pass args to the handlers', function (done) {
      parallel()
        .add(function (a, b, callback) {
          assert(a == 'a');
          assert(b == 'b');
          callback();
        })
        .add(function (a, b, callback) {
          assert(a == 'a');
          assert(b == 'b');
          callback();
        })
        .run('a', 'b', done);
    });

    it('should pass function-specific args if they exist', function (done) {
      parallel()
        .add(function (a, b, callback) {
          assert(a == 1);
          assert(b == 2);
          callback();

        }, 1, 2)
        .add(function (a, b, callback) {
          assert(a == 'a');
          assert(b == 'b');
          callback();
        })
        .run('a', 'b', done);
    });

    it('should bind to a context', function (done) {
      var obj = {};
      parallel()
        .bind(obj)
        .add(function (callback) {
          assert(obj == this);
          callback();
        })
        .run(done);
    });

    it('should exit early on errors', function (done) {
      var error = new Error();
      parallel()
        .add(function (callback) {
          callback(error);
        })
        .add(function (callback) {
          assert(false);
        })
        .run(function (err, res) {
          assert(err == error);
          done();
        });
    });

    it('should be chainable', function () {
      var p = parallel();
      assert(p == p.run());
    });
  });
});