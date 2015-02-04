var gulp = require('gulp');
var jade = require('gulp-jade');
var merge = require('merge-stream');

gulp.task('jade', ['clean'], function() {
    var views;
    var index;

    views = gulp.src('./views/**/*.jade')
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('./sample/views/'));

    index = gulp.src('./index.jade')
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest( './sample'));

    return merge(views, index);
});