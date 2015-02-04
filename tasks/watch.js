var gulp = require('gulp');

gulp.task('watch', ['build'], function () {
    gulp.watch('./assets/styles/**/*.scss',['build']);

    gulp.watch('./lib/**/*.js',['build']);

    gulp.watch('./views/**/*.jade',['build']);
});