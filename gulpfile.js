'use strict';

//requiring the node modules
const gulp = require('gulp')
const sass = require('gulp-sass')
const browsersync = require('browser-sync')
const del = require('del')
const imagemin = require('gulp-imagemin')
const uglify = require('gulp-uglify')
const usemin = require('gulp-usemin')
const rev = require('gulp-rev')
const cleanCss = require('gulp-clean-css')
const flatmap = require('gulp-flatmap')
const htmlmin = require('gulp-htmlmin')

//converting the sass files to css
function css(){
  return gulp.src('./css/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('./css'));
}

// BrowserSync reload 
function browserReload () {
  return browsersync.reload;
}

//watching the changes in the css files
function watchFiles(done){
  return gulp.watch('./css/*.scss', gulp.parallel(css))
    .on('change', browserReload());
}

function browserSync() {
   var files = [
      './*.html',
      './css/*.css',
      './img/*.{png,jpg,gif}',
      './js/*.js'
   ];

  return browsersync(files, {
      server: {
         baseDir: "./"
      }
   });
}

function clean(){
  return del(['dist']); //this will delete the dist folder
}

//copying fonts in the dist folder
function copyfonts(){
  return gulp.src('./node_modules/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
  .pipe(gulp.dest('./dist/fonts')); //we don't seperate plugins to copy hence the streams will handle all those tasks here
}

//minimizing the images
function imageMin(){
  return gulp.src('img/*.{png,jpg,gif}')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/img'));
}

//takes html files, looks up the css and js files, combines, concats, minifies and places these concat files in the dist
function useMin() {
  return gulp.src('./*.html')
  .pipe(flatmap(function(stream, file){ //flatmap takes all the html files and in parallel makes seperate streams of all files and performs the functions on it
      return stream
        .pipe(usemin({
            css: [ rev() ],
            html: [ function() { return htmlmin({ collapseWhitespace: true })} ],
            js: [ uglify(), rev() ],
            inlinejs: [ uglify() ],
            inlinecss: [ cleanCss(), 'concat' ]
        }))
    }))
    .pipe(gulp.dest('dist/'));
}


//Default task
exports.css = css;
exports.default = gulp.parallel(browserSync, watchFiles);
exports.build = gulp.series(clean, gulp.parallel(copyfonts, imageMin, useMin))