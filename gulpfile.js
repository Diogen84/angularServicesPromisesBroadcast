"use strict";

var gulp = require("gulp");
var concat = require("gulp-concat");
var streamqueue = require("streamqueue");
var watch = require("gulp-watch");

gulp.task('jsVendor', function() {
    return gulp.src('./src/app/vendor/**/*')
        .pipe(gulp.dest("dist/js"));
});


gulp.task('jsBuilder', function() {
    return streamqueue(
        {objectMode: true},
        gulp.src('./src/app/services/*.js'),
        gulp.src('./src/app/controllers/*.js'),
        gulp.src('./src/app/directives/*.js'),
        gulp.src('./src/js/script.js')
    )
        .pipe(concat('app.js'))
        .pipe(gulp.dest("dist/js"));
});

gulp.task("assets", function() {
    return gulp.src(["./src/assets/**/*", "./src/*.js", "./src/*.html"])
        .pipe(gulp.dest("dist"));
});
gulp.task("partials", function() {
    return gulp.src(["./src/partial/**/*"])
        .pipe(gulp.dest("dist/partial"));
});
gulp.task("data", function() {
    return gulp.src(["./src/data/**/*"])
        .pipe(gulp.dest("dist/data"));
});

gulp.task('watch', function() {
    gulp.watch(
        ['./src/app/services/*.js', './src/app/directives/*.js', './src/app/controllers/*.js', './src/js/script.js', './src/assets/**/*', './src/data/**/*', './src/partial/**/*', './src/js/*.js', './src/*.html'],
        ['jsBuilder', 'jsVendor', 'assets', 'partials', 'data']);
});
gulp.task('default', ['jsBuilder', 'jsVendor', 'assets', 'partials', 'data', 'watch']);
