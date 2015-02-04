var gulp = require('gulp');
var jslint = require('gulp-jslint');

// build the main source into the min file
gulp.task('jslint:all', ['clean'], function () {
    return gulp.src(['lib/**/*.js'])

        // pass your directives
        // as an object
        .pipe(jslint({
            // these directives can
            // be found in the official
            // JSLint documentation.
            ass: true, // if assignment expressions should be allowed
            bitwise: true, // if bitwise operators should be allowed
            browser: false, // if the standard browser globals should be predefined
            closure: false, // if Google Closure idioms should be tolerated
            continue: false, // if the continuation statement should be tolerated
            debug: false, // if debugger statements should be allowed
            devel: false, // if logging should be allowed (console, alert, etc.)
            eqeq: false, // if == should be allowed
            evil: false, // if eval should be allowed
            forin: false, // if for in statements need not filter
            indent: 4, // the indentation factor
            maxerr: 0, // the maximum number of errors to allow
            maxlen: 120, // the maximum length of a source line
            newcap: false, // if constructor names capitalization is ignored
            node: true, // if Node.js globals should be predefined
            nomen: false, // if names may have dangling _
            passfail: false, // if the scan should stop on first error
            plusplus: true, // if increment/decrement should be allowed
            properties: false, // if all property names must be declared with /*properties*/
            regexp: true, // if the . should be allowed in regexp literals
            rhino: false, // if the Rhino environment globals should be predefined
            unparam: false, // if unused parameters should be tolerated
            sloppy: false, // if the 'use strict'; pragma is optional
            stupid: false, // if really stupid practices are tolerated
            sub: true, // if all forms of subscript notation are tolerated
            todo: true, // if TODO comments are tolerated
            vars: true, // if multiple var statements per function should be allowed
            white: false, // if sloppy whitespace is tolerated
            debug: true,

            // you can also set global
            // declarations for all source
            // files like so:
            global: [],
            predef: [
                'require',
                'module',
                'console',
                'angular',
                '$',
                'alert',
                'document',
                'PIXI',
                'Box2D',
                'requestAnimFrame',
                'window'
            ],
            // both ways will achieve the
            // same result; predef will be
            // given priority because it is
            // promoted by JSLint

            // pass in your prefered
            // reporter like so:
            reporter: 'default',
            // ^ there's no need to tell gulp-jslint
            // to use the default reporter. If there is
            // no reporter specified, gulp-jslint will use
            // its own.

            // specify whether or not
            // to show 'PASS' messages
            // for built-in reporter
            errorsOnly: false
        }))

        // error handling:
        // to handle on error, simply
        // bind yourself to the error event
        // of the stream, and use the only
        // argument as the error object
        // (error instanceof Error)
        .on('error', function (error) {
            console.error(String(error));
        });
});

// build the main source into the min file
gulp.task('jslint:test', function () {
    return gulp.src(['tests/**/*.js', 'karma.conf.js'])

        // pass your directives
        // as an object
        .pipe(jslint({
            // these directives can
            // be found in the official
            // JSLint documentation.
            ass: true, // if assignment expressions should be allowed
            bitwise: true, // if bitwise operators should be allowed
            browser: false, // if the standard browser globals should be predefined
            closure: false, // if Google Closure idioms should be tolerated
            continue: false, // if the continuation statement should be tolerated
            debug: false, // if debugger statements should be allowed
            devel: false, // if logging should be allowed (console, alert, etc.)
            eqeq: false, // if == should be allowed
            evil: false, // if eval should be allowed
            forin: false, // if for in statements need not filter
            indent: 4, // the indentation factor
            maxerr: 0, // the maximum number of errors to allow
            maxlen: 120, // the maximum length of a source line
            newcap: false, // if constructor names capitalization is ignored
            node: true, // if Node.js globals should be predefined
            nomen: false, // if names may have dangling _
            passfail: false, // if the scan should stop on first error
            plusplus: true, // if increment/decrement should be allowed
            properties: false, // if all property names must be declared with /*properties*/
            regexp: true, // if the . should be allowed in regexp literals
            rhino: false, // if the Rhino environment globals should be predefined
            unparam: false, // if unused parameters should be tolerated
            sloppy: false, // if the 'use strict'; pragma is optional
            stupid: false, // if really stupid practices are tolerated
            sub: true, // if all forms of subscript notation are tolerated
            todo: true, // if TODO comments are tolerated
            vars: true, // if multiple var statements per function should be allowed
            white: false, // if sloppy whitespace is tolerated

            // you can also set global
            // declarations for all source
            // files like so:
            global: [],
            predef: [
                'angular',
                'document',
                'describe',
                'it',
                'before',
                'after',
                'beforeEach',
                'afterEach',
                'by',
                'browser',
                'element',
                'expect',
                'inject',
                'assert',
                '$',
                'sinon'
            ],
            // both ways will achieve the
            // same result; predef will be
            // given priority because it is
            // promoted by JSLint

            // pass in your prefered
            // reporter like so:
            reporter: 'default',
            // ^ there's no need to tell gulp-jslint
            // to use the default reporter. If there is
            // no reporter specified, gulp-jslint will use
            // its own.

            // specify whether or not
            // to show 'PASS' messages
            // for built-in reporter
            errorsOnly: false
        }))

        // error handling:
        // to handle on error, simply
        // bind yourself to the error event
        // of the stream, and use the only
        // argument as the error object
        // (error instanceof Error)
        .on('error', function (error) {
            console.error(String(error));
        });
});