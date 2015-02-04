var gulp = require('gulp');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');

// Basic usage
gulp.task('browserify', ['clean'], function() {

    // Single entry point to browserify
    return gulp.src('./lib/index.js')
        .pipe(browserify({
        }))
        .pipe(rename('app.js'))
        .pipe(gulp.dest('./sample'));

});