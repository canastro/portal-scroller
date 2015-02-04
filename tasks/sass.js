var gulp = require('gulp');
var sass = require('gulp-sass');
var path = require('path');

gulp.task('sass', ['clean'], function () {
    return gulp.src('./assets/styles/styles.scss')
        .pipe(sass())
        .pipe(gulp.dest('./sample/assets/styles'));
});