'use strict';

const gulp = require('gulp');

gulp.task('default', gulp.series('clean', 'copy'));
