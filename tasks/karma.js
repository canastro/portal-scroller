var gulp = require('gulp');
var karma = require('karma').server;

/**
 * Run test once and exit
 */
gulp.task('karma', ['jslint:test'], function (done) {
    karma.start({
        configFile: 'karma.conf.js',
        singleRun: true
    }, done);
});