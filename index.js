
var Batch = require('batch');

try {
  var each = require('each');
} catch (e) {
  var each = require('each-component');
}


/**
 * Expose `Parallel`.
 */

module.exports = Parallel;


/**
 * Initialize a new `Parallel`.
 */

function Parallel () {
  if (!(this instanceof Parallel)) return new Parallel();
  this.context = null;
  this.fns = [];
}


/**
 * Pass an `obj` to bind all of the functions with.
 *
 * @param {Object} obj
 * @return {Parallel}
 */

Parallel.prototype.bind = function (obj) {
  this.context = obj;
  return this;
};


/**
 * Add a new `fn` to be run, optionally with custom `args`.
 *
 * @param {Function} fn
 * @param {Mixed} args... (optional)
 * @return {Parallel}
 */

Parallel.prototype.push =
Parallel.prototype.add = function (fn) {
  this.fns.push({
    fn: fn,
    args: 1 == arguments.length ? null : [].slice.call(arguments, 1)
  });
  return this;
};


/**
 * Run all of the functions in parallel with optional `args`.
 *
 * @param {Mixed} args... (optional)
 * @param {Function} callback
 * @return {Parallel}
 */

Parallel.prototype.end = function () {
  var last = arguments.length - 1;
  var args = 1 == arguments.length ? [] : [].slice.call(arguments, 0, last);
  var callback = arguments[last];
  var batch = new Batch();
  var context = this.context;

  each(this.fns, function (obj) {
    batch.push(function (done) {
      var arr = obj.args || args.slice();
      arr.push(done);
      obj.fn.apply(context, arr);
    });
  });

  batch.end(callback);
  return this;
};