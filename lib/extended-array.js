module.exports = ExtendedArray

function ExtendedArray() {}

ExtendedArray.prototype = new Array()

ExtendedArray.prototype.first = function (predicate, defaultValue) {
  for (var i = 0; i < this.length; i++) {
    if (predicate(this[i], i)) return this[i]
  }

  return defaultValue
}

ExtendedArray.prototype.firstWhere = function (predicateObj, defaultValue) {
  var keys = Object.keys(predicateObj)

  return this.first(function (x) {
    return keys.every(function (k) {
      return x[k] === predicateObj[k]
    })
  }, defaultValue)
}
