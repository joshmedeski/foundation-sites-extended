const gulp = require('gulp');
const browserSync = require('browser-sync').create();

const paths = {
    html: './test/visual/*.html',
    sass: './assets/*.scss',
    sassWatch: ['./assets/*.scss', './scss/**/*.scss'],
    sassIncludePaths: [
        './scss',
        './bower_components/foundation-sites/scss'
    ]
};

gulp.task('sass', function () {
    const sourcemaps = require('gulp-sourcemaps');
    const sass = require('gulp-sass');

    return gulp.src(paths.sass)
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: paths.sassIncludePaths
        }).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.stream());
});

gulp.task('serve', ['sass'], function() {
    browserSync.init({
        server: {
            baseDir: './test/visual',
            directory: true,
            routes: {
                '/dist': 'dist'
            }
        }
    });

    gulp.watch(paths.sassWatch, ['sass']);
    gulp.watch(paths.html).on('change', browserSync.reload);
});

gulp.task('default', ['sass', 'serve']);
