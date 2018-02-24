var gulp = require('gulp');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var connect = require('gulp-connect');

var tsProject = ts.createProject('tsconfig.json');

gulp.task('connect', function() {
  connect.server();
});

gulp.task('compile', function(){
  var tsResult = gulp.src("src/**/*.ts")
        .pipe(tsProject())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist'));
});
 
gulp.task('live', ['compile', 'connect']);