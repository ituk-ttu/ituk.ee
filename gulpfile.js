var gulp = require("gulp");
var jade = require("gulp-jade");
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var sourcemaps = require("gulp-sourcemaps");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var watch = require("gulp-watch");
var es = require('event-stream');

var dir = {
    assets: "assets/",
    src: "src/",
    dest: "build/",
    bower: "bower_components/"
};

gulp.task("js", function() {
    es.concat(
            gulp.src(dir.src + dir.assets + "js/**/*.js")
    )
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat("app.js"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dir.dest + dir.assets + "js/"));
});

gulp.task("jade", function () {
    var locations = [
        {
            src: "*.jade",
            dest: ""
        }
    ];
    for(var i = 0; i < locations.length; i++) {
        gulp.src(dir.src + locations[i].src)
            .pipe(plumber())
            .pipe(jade({
                pretty: true,
                doctype: "HTML"
            }))
            .pipe(gulp.dest(dir.dest + locations[i].dest));
    }
});

gulp.task("less", function() {
    gulp.src(dir.src + dir.assets + "less/master.less")
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dir.dest + dir.assets + "css/"));
});

gulp.task("img", function () {
    gulp.src(dir.src + dir.assets + 'img/**/*.{jpg,png,svg}')
        .pipe(gulp.dest(dir.dest + dir.assets + 'img/'))
});

gulp.task("compile", ["jade", "js", "less", "img"]);

gulp.task("default", ["jade", "js", "less", "img"], function() {
    gulp.watch(dir.src + dir.assets + "js/**/*.js", function() {
        gulp.run("js");
    });
    gulp.watch(dir.src + dir.assets + "less/**/*.less", function() {
        gulp.run("less");
    });
    gulp.watch(dir.src + "/**/*.jade", function() {
        gulp.run("jade");
    });
    gulp.watch(dir.src + dir.assets + "img/**/*.{jpg,png,svg}", function() {
        gulp.run("img");
    });
});
