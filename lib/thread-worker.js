var ThreadStartOptions = require('./thread-start-options');

global.onmessage = function (event) {
  var options = ThreadStartOptions.parse(event.data);
  var value, error;

  try {
    value = options.action.apply(undefined, options.args);
  } catch (err) {
    error = err;
  } finally {
    this.postMessage({ error: error, value: value });
  }
};
