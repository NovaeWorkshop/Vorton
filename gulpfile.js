'use strict';

var gulp        = require('gulp');
var concat      = require('gulp-concat');
var typescript  = require('gulp-typescript');
var sourcemaps  = require('gulp-sourcemaps');
var karma       = require('karma');
var path        = require('path');
var runSequence = require('run-sequence');


var tsProject = {
  sortOutput: true
};
var tsSources = [
  'src/*.ts'
];

gulp.task('typescript', function () {
  var tsResult = gulp.src(tsSources)
    .pipe(sourcemaps.init())
    .pipe(typescript(tsProject));

  return tsResult
    .pipe(concat('vorton.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./lib/'));
});


var testProject = {
  sortOutput: true
};
var testSources = [
  'spec/**/*.ts'
];

gulp.task('typescript-tests', function () {
  var tsResult = gulp.src(testSources)
    .pipe(sourcemaps.init())
    .pipe(typescript(testProject))

  return tsResult
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./spec/.dist/'));
});


gulp.task('karmaSingleRun', function (done) {
  var server = new karma.Server({
    configFile: path.join(__dirname, './karma.conf.js'),
    logLevel: 'ERROR',
    singleRun: true
  }, done);

  server.start();
});

gulp.task('karma', function (done) {
  var server = new karma.Server({
    configFile: path.join(__dirname, './karma.conf.js')
  }, done);

  server.start();
});


gulp.task('watch', function () {
  gulp.watch(tsSources, ['typescript']);
  gulp.watch(testSources, ['typescript-tests']);
});

gulp.task('test', function (callback) {
  runSequence(['typescript', 'typescript-tests'], 'karmaSingleRun');
});

gulp.task('default', function (callback) {
  runSequence(['typescript', 'typescript-tests'], ['karma', 'watch']);
});
