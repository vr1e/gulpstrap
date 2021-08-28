import gulp from 'gulp';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
const sass = require('gulp-sass')(require('sass'));
import del from 'del';
// import uglify from 'gulp-uglify';
import browserSync from 'browser-sync';
import { paths, jsDependencies, cssDependencies } from './gulp.constants';

const server = browserSync.create();
const clean = () => del(['dist']);

function scripts() {
	return (
		gulp
			.src(paths.scripts, { sourcemaps: true })
			.pipe(babel())
			// .pipe(uglify())
			// .pipe(concat('index.js'))
			.pipe(gulp.dest(paths.dest))
	);
}

function copyAssets() {
	return gulp
		.src(['./src/assets/**/*'])
		.pipe(gulp.dest(`${paths.dist}assets/`));
}

function copy() {
	return gulp.src(['./src/*.html']).pipe(gulp.dest(paths.dist));
}

function js() {
	return gulp.src(jsDependencies).pipe(gulp.dest(paths.dest));
}

const fonts = done => {
	gulp
		.src(['node_modules/@fortawesome/fontawesome-free/webfonts/**'])
		.pipe(gulp.dest(`${paths.dist}webfonts/`));
	done();
};

const styles = () => {
	return gulp
		.src(`${paths.styles}main.scss`, { sourcemaps: true })
		.pipe(sass({ includePaths: ['node_modules'] }).on('error', sass.logError))
		.pipe(gulp.dest(`${paths.dist}styles/`));
};

function css() {
	return gulp.src(cssDependencies).pipe(gulp.dest(`${paths.dist}styles/`));
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
	gulp.watch(
		paths.watch,
		gulp.series(copyAssets, copy, styles, scripts, reload)
	);

const dev = gulp.series(
	clean,
	copyAssets,
	copy,
	fonts,
	js,
	css,
	styles,
	scripts,
	serve,
	watch
);
export default dev;
