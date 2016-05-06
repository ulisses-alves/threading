var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var tap = require('gulp-tap');
var rename = require('gulp-rename');
var lazypipe = require('lazypipe');
var merge = require('merge-stream');

module.exports = gulp.task('build', function () {
  var jsTransform = lazypipe()
    .pipe(buffer)
    .pipe(sourcemaps.init, {loadMaps: true})
    .pipe(uglify)
    .pipe(rename, {extname: '.min.js'})
    .pipe(sourcemaps.write, './')
    .pipe(gulp.dest, './dist');

  var threading = gulp.src('./lib/threading.js', {read: false})
    .pipe(tap(function (file) {
      var b = browserify({
        entries: file.path,
        debug: true,
        standalone: 'Threading'
      });

      file.contents = b.bundle();
    }))
    .pipe(jsTransform());

  var worker = gulp.src('./lib/thread-worker.js', {read: false})
    .pipe(tap(function (file) {
      var b = browserify({
        entries: file.path,
        debug: true
      });

      file.contents = b.bundle();
    }))
    .pipe(jsTransform());

  return merge([threading, worker]);
});
