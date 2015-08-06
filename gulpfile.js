'use strict'

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    tmodjs = require('gulp-tmod'),
    minifyhtml = require('gulp-minify-html'),
    minifycss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    rev = require('gulp-rev'),
    concat = require('gulp-concat'),
    cache = require('gulp-cache'),
    notify = require('gulp-notify'),
    util = require('gulp-util'),
    plumber = require('gulp-plumber'),
    url = require('url'),
    browserify = require('gulp-browserify'),
    browsersync = require('browser-sync'),
    proxy = require('proxy-middleware');

function errrHandler(e) {
    // 控制台发声,错误时beep一下
    util.beep();
    util.log(e);
}

var src = 'src/',
    dist = 'dist/', //服务根目录
    assets = dist + 'assets/'; //js, css, img资源输出目录
var config = {
    tpl: {
        src: src + 'tpl/**/*.html',
        base: src + 'tpl',
        output: src + 'js'
    },
    sass: {
        src: src + 'css/sass/**/*.scss',
        dest: src + 'css'
    },
    html: {
        src: src + 'html/**/*.html',
        dest: dist
    },
    css: {
        src: src + 'css/**/*.css',
        dest: assets + 'css'
    },
    js: {
        src: src + 'js/**/*.js',
        dest: assets + 'js'
    },
    imgs: {
        src: src + 'imgs/*',
        dest: assets + 'imgs'
    }
}

gulp.task('tmodjs', function() {
    return gulp.src(config.tpl.src)
        .pipe(plumber({
            errorHandler: errrHandler
        }))
        .pipe(tmodjs({
            base: config.tpl.base,
            combo: true,
            minify: false,
            output: config.tpl.output
        }))
        .pipe(notify({
            message: 'tmodjs 编译成功!'
        }));
});
gulp.task('sass', function() {
    return gulp.src(config.sass.src)
        .pipe(plumber({
            errorHandler: errrHandler
        }))
        .pipe(sass.sync())
        .pipe(gulp.dest(config.sass.dest));
});

gulp.task('html', function() {
    return gulp.src(config.html.src)
        .pipe(minifyhtml())
        .pipe(gulp.dest(config.html.dest))
        .pipe(notify({
            message: 'html 压缩成功!'
        }));
});

gulp.task('css', function() {
    return gulp.src(config.css.src)
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'ios 6', 'android 2.3.4'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifycss())
        .pipe(gulp.dest(config.css.dest))
        // .pipe(rev())
        // .pipe(gulp.dest('dist/assets/css'))
        .pipe(notify({
            message: 'css 压缩成功!'
        }));
});

gulp.task('csswithsass', ['sass'], function() {
    return gulp.src(config.css.src)
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'ios 6', 'android 2.3.4'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifycss())
        .pipe(gulp.dest(config.css.dest));
    // .pipe(rev())
    // .pipe(gulp.dest('dist/assets/css'));
});
gulp.task('js', function() {
    return gulp.src('src/js/index.js')
        .pipe(plumber({
            errorHandler: errrHandler
        }))
        .pipe(browserify({
            insertGlobals: true,
            debug: !gulp.env.production
        }))
        // .pipe(jshint('.jshintrc'))
        // .pipe(jshint.reporter('default'))
        // .pipe(concat('core.js'))
        // .pipe(gulp.dest('dist/assets/js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest(config.js.dest))
        // .pipe(rev())
        // .pipe(gulp.dest('dist/assets/js'))
        .pipe(notify({
            message: 'js 压缩成功!'
        }));
});

gulp.task('imgs', function() {
    return gulp.src(config.imgs.src)
        .pipe(cache(imagemin({
            svgoPlugins: [{
                removeViewBox: false
            }],
            optimizationLevel: 3,
            progressive: true,
            interlaced: true,
            use: [pngquant()]
        })))
        .pipe(gulp.dest(config.imgs.dest));
});

gulp.task('bs', function() {
    browsersync({
        files: dist,
        open: true,
        server: {
            baseDir: dist
        }
    });
});

gulp.task('browser-sync', ['js'], function() {
    gulp.start('bs');
});

gulp.task('clean', function() {
    cache.clearAll();
    return gulp.src(dist, {
            read: false
        })
        .pipe(clean())
        .pipe(notify({
            message: 'clean 执行完毕!'
        }));
});

gulp.task('watch', function() {
    gulp.watch(config.tpl.src, ['tmodjs']);
    gulp.watch(config.html.src, ['html']);
    gulp.watch(config.sass.src, ['sass']);
    gulp.watch(config.css.src, ['css']);
    gulp.watch(config.js.src, ['js']);
    gulp.watch(config.imgs.src, ['imgs']);
    gulp.start('bs');
});

gulp.task('default', ['clean'], function() {
    gulp.start('tmodjs');
    gulp.start('browser-sync', 'html', 'csswithsass', 'js', 'imgs');
});
