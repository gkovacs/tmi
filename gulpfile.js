// Generated by LiveScript 1.4.0
(function(){
  var gulp, gulpChanged, gulpUtil, gulpPrint, gulpLivescript, gulpCrLfReplace, lspattern;
  gulp = require('gulp');
  gulpChanged = require('gulp-changed');
  gulpUtil = require('gulp-util');
  gulpPrint = require('gulp-print');
  gulpLivescript = require('gulp-livescript');
  gulpCrLfReplace = require('gulp-cr-lf-replace');
  lspattern = ['*.ls', 'experiments/**/*.ls', 'fields/**/*.ls'];
  gulp.task('livescript', function(){
    gulp.src(lspattern, {
      base: './'
    }).pipe(gulpChanged('.', {
      extension: '.js'
    })).pipe(gulpLivescript({
      bare: false
    })).on('error', gulpUtil.log).pipe(gulpPrint({
      colors: false
    })).pipe(gulpCrLfReplace({
      changeCode: 'LF'
    })).pipe(gulp.dest('.'));
  });
  gulp.task('build', ['livescript']);
  gulp.task('watch', function(){
    return gulp.watch(lspattern, ['build']);
  });
  gulp.task('default', ['build', 'watch']);
}).call(this);
