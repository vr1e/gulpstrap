import gulp from 'gulp';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import sass from 'gulp-sass';
import del from 'del';
import uglify from 'gulp-uglify';
import browserSync from 'browser-sync';
import {paths, jsDependencies, cssDependencies } from './gulp.constants';

const server = browserSync.create();
const clean = () => del(['dist']);

function scripts() {
	return gulp
		.src(paths.sctipts, { sourcemaps: true })
		.pipe(babel())
		.pipe(uglify())
		.pipe(concat('index.min.js'))
		.pipe(gulp.dest(paths.dest));
}

function copy() {
	return gulp.src(['./src/*.html']).pipe(gulp.dest(paths.dist));
}

function js() {
	return gulp
		.src(jsDependencies)
		.pipe(gulp.dest(paths.dest));
}

const fonts = done => {
	gulp
		.src(['node_modules/@fortawesome/fontawesome-free/webfonts/**'])
		.pipe(gulp.dest(`${paths.dist}webfonts/`));
	done();
};

const customStyles = () => {
	return gulp
		.src(`${paths.styles}main.scss`, { sourcemaps: true })
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(`${paths.dist}styles/`));
};

const bootstrap = () => {
	return gulp
		.src(`${paths.styles}vendors/bootstrap/bootstrap.scss`, { sourcemaps: true })
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(`${paths.dist}styles/`));
};

function css() {
	return gulp
		.src(cssDependencies)
		.pipe(gulp.dest(`${paths.dist}styles/`));
}

function reload(done) {
	server.reload();
	done();
}

function serve(done) {
	server.init({
		server: {
			baseDir: 'dist/'
		}
	});
	done();
}

const watch = () =>
	gulp.watch(paths.watch, gulp.series(copy, customStyles, bootstrap, scripts, reload));

const dev = gulp.series(
	clean,
	copy,
	fonts,
	js,
	css,
	customStyles,
	bootstrap,
	scripts,
	serve,
	watch
);
export default dev;
