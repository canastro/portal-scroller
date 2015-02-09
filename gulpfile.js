var requireDir = require('require-dir');
var dir = requireDir('./tasks');
var gulp = require('gulp');

gulp.task('test', ['jslint:test', 'karma']);

gulp.task('build', ['clean', 'jslint:all', 'browserify', 'jade', 'sass', 'copy']);

gulp.task('serve-dev', ['build', 'serve', 'watch']);
