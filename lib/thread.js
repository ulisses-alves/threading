module.exports = Thread

function Thread(worker, options) {
  if (typeof(worker) === 'string') {
    options = options || {}
  } else {
    options = worker
    worker = options.worker
  }

  this.__worker__ = new Worker(worker)
  this.__onstop__ = options.onstop
  this.busy = false
}

Thread.prototype = {
  start: function (options) {
    if (this.busy) return Promise.reject(new Error('Thread is busy'))
    this.busy = true

    return new Promise(function (resolve, reject) {
      this.__worker__.onmessage = function (e) {
        this.busy = false

        e.data.error
          ? reject(e.data.error)
          : resolve(e.data.value)

        if (this.onstop) this.onstop.call(this)
      }.bind(this)

      this.__worker__.postMessage(options.message())
    }.bind(this))
  },
  terminate: function () {
    this.__worker__.terminate()
  }
}
