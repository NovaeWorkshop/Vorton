'use strict';

var gulp        = require('gulp');
var concat      = require('gulp-concat');
var typescript  = require('gulp-typescript');
var sourcemaps  = require('gulp-sourcemaps');

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
    .pipe(concat('highlight.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./lib/'));
});

gulp.task('build', ['typescript']);

gulp.task('watch', function () {
  gulp.watch(tsSources, ['build']);
});

gulp.task('default', ['build', 'watch']);
