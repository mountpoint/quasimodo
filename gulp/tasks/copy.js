'use strict';

const
  gulp = require('gulp'),
  debug = require('gulp-debug')
;

gulp.task('copy', () => {
  return gulp.src(['src/**'])
    .pipe(debug({'title': 'copying files...'}))
    .pipe(gulp.dest('public'))
  ;
});
