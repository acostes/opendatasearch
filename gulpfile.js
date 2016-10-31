var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var runSequence = require('run-sequence');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var size = require('gulp-filesize');
var minifycss = require('gulp-clean-css');
var less = require('gulp-less');

gulp.task('run', function() {
    nodemon({
        script: 'app',
        ext: 'js css',
    })
});

// Paths
var bower = './bower_components';

// css task
gulp.task('styles', function () {
    return gulp.src(['public/css/bootstrap.css', 'public/css/main.css'])
    .pipe(autoprefixer('last 2 version'))
    .pipe(concat('main.min.css'))
    .pipe(minifycss())
    .pipe(gulp.dest('public/css/'))
    .pipe(size());
});

// Compiles LESS > CSS
gulp.task('build-less', function(){
    return gulp.src(bower + '/bootstrap/less/bootstrap.less')
        .pipe(less())
        .pipe(gulp.dest('public/css'));
});

// javascript task
gulp.task('scripts', function() {
    return gulp.src([
        bower + '/jquery/dist/jquery.js',
        bower + '/bootstrap/dist/js/bootstrap.js',
        bower + '/angular/angular.js',
        bower + '/angular-route/angular-route.js',
        'public/js/app.js',
        'public/js/controllers.js',
        'public/js/services.js',
    ])
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest('public/js'))
    .pipe(size());
});

// fonts task
gulp.task('fonts', function() {
    return gulp.src([
        bower + '/bootstrap/fonts/glyphicons-halflings-regular.ttf',
        bower + '/bootstrap/fonts/glyphicons-halflings-regular.eot',
        bower + '/bootstrap/fonts/glyphicons-halflings-regular.svg',
        bower + '/bootstrap/fonts/glyphicons-halflings-regular.woff',
        bower + '/bootstrap/fonts/glyphicons-halflings-regular.woff2'
    ])
    .pipe(gulp.dest('public/fonts'));
});

gulp.task('watch', function() {
    gulp.watch(["./public/css/*.css", "!./public/css/main.min.css"], ["styles"]);
    gulp.watch(["./public/js/*.js", "!./public/js/main.min.js"], ["scripts"]);
})

// default task
gulp.task('default', function() {
    runSequence('build-less', 'styles', 'scripts', 'fonts', 'run', 'watch');
});