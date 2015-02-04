var gulp = require('gulp');

gulp.task('copy', ['clean'], function () {
    return gulp.src('assets/resources/**')
        .pipe(gulp.dest('sample/assets/resources/'));
});