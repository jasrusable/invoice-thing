var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var gulpFilter = require('gulp-filter');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var del = require('del');
var debug = require('gulp-debug');


gulp.task('clean', function (cb) {
    return del(['./dist/*'], cb);
});

gulp.task('bower', [], function () {
    var jsFilter = gulpFilter(['**/*.js'], {restore: true});
    var lessFilter = gulpFilter(['**/*.less'], {restore: true});
    var cssFilter = gulpFilter(['**/*.css'], {restore: true});
    return gulp.src(mainBowerFiles(), {base: 'bower_components'})
        .pipe(sourcemaps.init())
        .pipe(jsFilter)
        .pipe(concat('bower.js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./dist/'))
        .pipe(jsFilter.restore)
        .pipe(lessFilter)
        .pipe(less())
        .pipe(lessFilter.restore)
        .pipe(cssFilter)
        .pipe(concat('bower.css'))
        .pipe(minifyCss())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('partials', function () {
    return gulp.src('./src/**/*.html')
        .pipe(gulp.dest('./dist/views/'));
});

gulp.task('index', function () {
    return gulp.src('./src/index.html')
        .pipe(gulp.dest('./dist/'));
});

gulp.task('styles', function () {
    return gulp.src('./src/**/*.css')
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('./dist/'));
})

gulp.task('scripts', function () {
    return gulp.src('./src/**/*.js')
        .pipe(concat('src.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['clean'], function () {
	gulp.start('bower', 'index', 'scripts', 'styles', 'partials');
});
