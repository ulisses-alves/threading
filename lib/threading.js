var Thread = require('./thread')
var ThreadQueueItem = require('./thread-queue-item')
var ThreadStartOptions = require('./thread-start-options')
var ThreadPool = require('./thread-pool')

module.exports = Threading

function Threading(options) {
  options = options || {}

  this.__pool__ = new ThreadPool({
    worker: options.worker || 'thread-worker.min.js',
    size: options.pool || 4
  })
}

Threading.prototype = {
  run: function (action, args) {
    return new Promise(function (resolve, reject) {
      this.__pool__.use(function (thread) {
        var options = new ThreadStartOptions(action, args || [])
        thread.start(options).then(resolve, reject)
      }.bind(this))
    }.bind(this))
  },
  pool: function (size) {
    this.__pool__.size(size)
  },
  terminate: function () {
    this.__pool__.size(0)
  },
}
