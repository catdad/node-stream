var gulp = require('gulp');
var gulpif = require('gulp-if');
var eslint = require('gulp-eslint');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var sequence = require('gulp-sequence');
var beeper = require('beeper');

var source = {
  js: ['*.js', 'lib/**/*.js', 'performance/**/*.js', 'test/**/*.js'],
  lib: ['lib/**/*.js'],
  perf: ['performance/**/*.test.js'],
  test: ['test/**/*.test.js']
};

gulp.task('lint', function() {
  return gulp.src(source.js)
    .pipe(eslint())
    .pipe(eslint.results(function(results) {
      if (results.warningCount || results.errorCount) {
        beeper();
      }
    }))
    .pipe(eslint.format())
    .pipe(gulpif(gulp.seq.indexOf('watch') < 0, eslint.failAfterError()));
});

gulp.task('test', function() {
  return gulp.src(source.test)
    .pipe(mocha());
});

gulp.task('pre-coverage', function() {
  return gulp.src(source.lib)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('coverage', ['pre-coverage'], function() {
  return gulp.src(source.test)
    .pipe(mocha())
    .pipe(istanbul.writeReports())
    .pipe(istanbul.enforceThresholds({
      thresholds: {
        global: 98,
        each: 90
      }
    }));
});

gulp.task('watch', ['default'], function() {
  gulp.watch(source.js, function() {
    sequence(['lint', 'test'])();
  });
});

gulp.task('default', sequence('lint', 'test'));
