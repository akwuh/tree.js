var gulp = require('gulp')
var browserify = require('browserify')
var source = require('vinyl-source-stream')
var webserver = require('gulp-webserver')
var gutil = require('gulp-util')

gulp.task('js', function() {
    return browserify('./index.js')
        .bundle()
        .on('error', gutil.log)
        .pipe(source('index.js'))
        .pipe(gulp.dest('./dist'))
})

gulp.task('default', ['js'])

gulp.task('watch', ['default'], function() {
    gulp.watch('./tree.js', ['js'])
})

gulp.task('webserver', ['watch'], function() {
    gulp.src('./')
        .pipe(webserver({
            livereload: true,
            fallback: 'index.html',
            open: false
        }))
})