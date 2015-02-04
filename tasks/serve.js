var gulp = require('gulp');
var serve = require('gulp-serve');

gulp.task('serve', ['build'], serve({
    root: ['sample', 'bower_components'],
    port: 8080
}));
