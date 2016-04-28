module.exports = ThreadQueueItem

function ThreadQueueItem(resolve, reject, options) {
  this.resolve = resolve
  this.reject = reject
  this.options = options
}
