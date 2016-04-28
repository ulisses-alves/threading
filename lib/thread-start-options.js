module.exports = ThreadStartOptions

function ThreadStartOptions(action, args) {
  this.action = action
  this.args = args
}

ThreadStartOptions.parse = function (message) {
  var getAction = new Function('return ' + message.action)
  return new ThreadStartOptions(getAction(), message.args)
}

ThreadStartOptions.prototype = {
  action: null,
  context: null,
  message: function () {
    return {
      args: this.args,
      action: this.action.toString()
    }
  }
}
