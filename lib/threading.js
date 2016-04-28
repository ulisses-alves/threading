var Thread = require('./thread')
var ThreadQueueItem = require('./thread-queue-item')
var ThreadStartOptions = require('./thread-start-options')

module.exports = Threading

function Threading(options) {
  options = options || {}
  this.__worker__ = options.worker || 'thread-worker.min.js'
  this.__pool__ = []
  this.__queue__ = []
  this.poolSize(options.pool || global.navigator.hardwareConcurrency || 4)
}

Threading.prototype = {
  poolSize: function (value) {
    if (value === undefined) return this.__poolSize__
    if (value === this.__pool__.length) return

    if (value > this.__pool__.length) {
      for (var i = this.__pool__.length; i < value; i++) {
        var thread = new Thread(this.__worker__)
        thread.onstop = this.__startNext__.bind(this, thread)
        this.__pool__.push(thread)
      }

      return
    }

    for (var i = this.__pool__.length - value; i > 0; i--) {
      this.__pool__.pop().terminate()
    }
  },
  run: function (action, args) {
    return new Promise(function (resolve, reject) {
      var options = new ThreadStartOptions(action, args || [])
      this.__queue__.push(new ThreadQueueItem(resolve, reject, options))
      this.__startNext__()
    }.bind(this))
  },
  terminate: function () {
    this.poolSize(0)
  },
  __startNext__: function (thread) {
    if (!thread) {
      for (var i = this.__pool__.length - 1; i >= 0; i--) {
        var t = this.__pool__[i]
        if (!t.busy) {
          thread = t
          break
        }
      }
    }

    if (!thread) return false

    var item = this.__queue__.shift()

    if (!item) return false

    thread.start(item.options).then(item.resolve, item.reject)

    return true
  }
}
