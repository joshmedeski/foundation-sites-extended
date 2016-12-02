const browserSync = require('browser-sync').create();
const gulp = require('gulp');
const panini = require('panini');

const PATHS = {
    pages: 'panini/pages/*.html',
    panini: 'panini/**/*',
    sass: 'panini/assets/*.scss',
    sassWatch: ['assets/*.scss', 'scss/**/*.scss'],
    sassIncludePaths: [
        'scss',
        'bower_components/foundation-sites/scss'
    ]
};

gulp.task('sass', function () {
    const sourcemaps = require('gulp-sourcemaps');
    const sass = require('gulp-sass');

    return gulp.src(PATHS.sass)
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: PATHS.sassIncludePaths
        }).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.stream());
});

gulp.task('panini', function(done) {
    gulp.src(PATHS.pages)
        .pipe(panini({
            root: 'panini/pages/',
            layouts: 'panini/layouts/',
            partials: 'panini/partials/',
            helpers: 'panini/helpers/',
            data: 'panini/data/'
        }))
        .pipe(gulp.dest('build'));

    gulp.watch([PATHS.panini], [panini.refresh]);
    done();
});

gulp.task('serve', ['sass', 'panini'], function() {
    browserSync.init({
        server: {
            baseDir: 'build',
            directory: true
        }
    });

    gulp.watch(PATHS.panini, browserSync.reload);
});

gulp.task('default', ['sass', 'panini', 'serve']);
