'use strict';

const
    gulp = require('gulp'),
    del = require('del') // default function in gulp >= 4.0  // del('folder-path')
;

gulp.task('clean' ,function () {
    return del(['public/**/*']);
});
