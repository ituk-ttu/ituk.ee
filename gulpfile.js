var gulp = require("gulp");
var pug = require('gulp-pug');
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var sourcemaps = require("gulp-sourcemaps");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var watch = require("gulp-watch");
var es = require('event-stream');
var pugi18n = require('gulp-pug-i18n');

var dir = {
    assets: "assets/",
    src: "src/",
    dest: "build/",
    bower: "bower_components/"
};

gulp.task("js", function() {
    gulp.src(dir.src + dir.assets + 'js/**/*.js')
        .pipe(gulp.dest(dir.dest + dir.assets + 'js/'))
});

gulp.task('views', function buildHTML() {
    var locations = [
        {
            src: "*.pug",
            dest: ""
        }
    ];
    for(var i = 0; i < locations.length; i++) {
        gulp.src(dir.src + locations[i].src)
            .pipe(plumber())
            .pipe(pug({
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
    gulp.src(dir.src + dir.assets + 'img/**/*.{jpg,JPG,png,svg}')
        .pipe(gulp.dest(dir.dest + dir.assets + 'img/'))
});

gulp.task("compile", ["views", "js", "less", "img", "translate"]);

gulp.task("default", ["views", "js", "less", "img", "translate"], function() {
    gulp.watch(dir.src + dir.assets + "js/**/*.js", function() {
        gulp.run("js");
    });
    gulp.watch(dir.src + dir.assets + "less/**/*.less", function() {
        gulp.run("less");
    });
    gulp.watch(dir.src + "/**/*.pug", function() {
        gulp.run("views");
    });
    gulp.watch(dir.src + dir.assets + "img/**/*.{jpg,JPG,png,svg}", function() {
        gulp.run("img");
    });

});

gulp.task("translate", function(){
    gulp.src('src/**/*.pug')
        .pipe(pugi18n({
            i18n: {
                locales: 'src/locales/*', // locales: en.yml, de.json,
                filename: '{{basename}}.{{lang}}.html',
                },
            pretty: true // Pug option
        }))
        .pipe(gulp.dest(dir.dest));
});


