var Thread = require('./thread')
var ExtendedArray = require('./extended-array')

module.exports = ThreadPool

function ThreadPool(options) {
  this.__threads__ = new ExtendedArray()
  this.__queue__ = new ExtendedArray()
  this.__worker__ = options.worker
  this.size(options.size)
}

ThreadPool.prototype = {
  size: function (value) {
    if (value === undefined) return this.__threads__.length

    var diff = value - this.__threads__.length

    if (diff === 0) return
    if (diff > 0) return this.add(diff)
    return this.remove(-diff)
  },
  add: function (count) {
    for (var i = 0; i < count; i++) {
      var thread = new Thread({
        worker: this.__worker__,
        onstop: notify.bind(null, this.__queue__, thread)
      });

      this.__threads__.push(thread)
    }
  },
  remove: function (count) {
    for (var i = 0; i < count; i++) {
      this.__threads__.pop().terminate()
    }
  },
  use: function (callback) {
    var thread = this.__threads__.firstWhere({busy: false})

    if (thread) {
      callback(thread)
      return
    }

    this.__queue__.push(callback)
  }
}

function notify(queue, thread) {
  if (!queue.length) return
  var callback = queue.shift()
  callback(thread)
}

