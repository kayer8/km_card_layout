const gulp = require('gulp');
const ts = require('gulp-typescript');
const del = require('del');

const paths = {
  lib: {
    base: 'src',
    dist: 'miniprogram_dist',
    watch: 'src/**/*',
    assets: ['src/**/*', '!src/**/*.ts'],
  },
  demo: {
    base: 'example',
    dist: 'example_dist',
    watch: ['example/**/*'],
  },
};

const tsProject = ts.createProject('tsconfig.json');

function clean() {
  return del([paths.lib.dist, paths.demo.dist]);
}

function buildLibScripts() {
  const tsResult = tsProject.src().pipe(tsProject());
  return tsResult.js.pipe(gulp.dest(paths.lib.dist));
}

function copyLibAssets() {
  return gulp.src(paths.lib.assets, { base: paths.lib.base }).pipe(gulp.dest(paths.lib.dist));
}

function copyDemoSource() {
  return gulp.src(paths.demo.watch, { base: paths.demo.base }).pipe(gulp.dest(paths.demo.dist));
}

function syncLibToDemo() {
  return gulp
    .src(`${paths.lib.dist}/**/*`, { allowEmpty: true, base: paths.lib.dist })
    .pipe(gulp.dest(`${paths.demo.dist}/miniprogram_dist`));
}

const buildLib = gulp.series(gulp.parallel(buildLibScripts, copyLibAssets));
const buildDemo = gulp.series(copyDemoSource, syncLibToDemo);
const build = gulp.series(clean, buildLib, buildDemo);

function watchTask() {
  gulp.watch(paths.lib.watch, gulp.series(buildLib, syncLibToDemo));
  gulp.watch(paths.demo.watch, gulp.series(copyDemoSource));
}

exports.clean = clean;
exports['build:lib'] = buildLib;
exports['build:demo'] = buildDemo;
exports.build = build;
exports.dev = gulp.series(build, watchTask);
