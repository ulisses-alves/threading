var gulp = require('gulp');
var watch = require('gulp-watch');

module.exports = gulp.task('watch', function () {
  return watch('lib/**/*', function () {
    return gulp.run('build');
  });
});
